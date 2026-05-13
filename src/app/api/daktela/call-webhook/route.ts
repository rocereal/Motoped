/**
 * POST /api/daktela/call-webhook
 *
 * Daktela queue 1001 workflow sends this when a call closes.
 * ALL async work runs before returning the response — Vercel terminates after response.
 *
 * Workflow payload template (Settings → Workflows → Edit event actions → Open URL):
 *   { "activity_id": "{{name}}", "activity_type": "{{type}}", "activity_action": "{{action}}",
 *     "caller_number": "{{title}}", "duration": "{{duration}}", "started_at": "{{time}}",
 *     "ended_at": "{{time_close}}", "queue": "{{queue}}", "user": "{{user}}" }
 *
 * NOTE: {{title}} resolves to caller phone — Activities template engine
 * does not expose nested item.clid directly.
 *
 * Flow:
 *   1. Validate payload
 *   2. Resolve call details (payload fields → getDaktelaActivity fallback)
 *   3. Attribution: callerNumber + timestamp → PhoneClick → session UTMs
 *   4. Persist StoredCall to KV
 *   5. Daktela upsert — ALWAYS runs (contact created even without attribution)
 *   6. Meta CAPI Contact — only when FB attribution data present (fbp/fbc/fbclid)
 */

import { NextRequest, NextResponse } from 'next/server'
import { DaktelaCallWebhookSchema } from '@/lib/validation'
import {
  getDaktelaActivity,
  upsertDaktelaContact,
  buildMarketingAttributionFields,
} from '@/lib/daktela'
import type { DaktelaActivityItem, DaktelaActivityUser, DaktelaActivityQueue } from '@/lib/daktela'
import { attachAttributionToCall } from '@/lib/attribution'
import { saveCall, parseTimestamp } from '@/lib/call-store'
import { buildLeadCAPIEvent, sendCAPIEvent } from '@/lib/meta-capi'
import type { StoredCall } from '@/lib/models'

const PRODUCT = process.env.NEXT_PUBLIC_PRODUCT_NAME ?? 'NIEVE Q-EN'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Daktela-Token',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders() })
  }

  console.log('[Daktela Webhook] Received:', JSON.stringify(body))

  const parsed = DaktelaCallWebhookSchema.safeParse(body)
  if (!parsed.success) {
    console.error('[Daktela Webhook] Invalid payload:', JSON.stringify(parsed.error.flatten()))
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten().fieldErrors },
      { status: 400, headers: corsHeaders() },
    )
  }

  const {
    activity_id, activity_type, activity_action,
    caller_number: payloadCaller, called_number: payloadCalled,
    direction: payloadDirection, duration: payloadDuration,
    started_at: payloadStarted, ended_at: payloadEnded,
    queue: payloadQueue, user: payloadUser,
  } = parsed.data

  console.log(
    `[Daktela Webhook] activity_id=${activity_id} type=${activity_type ?? '—'} action=${activity_action ?? '—'}` +
    ` caller=${payloadCaller ?? '—'} duration=${payloadDuration ?? '—'}s`,
  )

  // ── Resolve call details: payload fields → API fallback ───────────────────
  // Daktela sends null for unpopulated template vars; already coerced to undefined by schema.
  let caller_number = payloadCaller   ?? undefined
  let called_number = payloadCalled   ?? undefined
  let direction     = payloadDirection ?? undefined
  let duration      = payloadDuration
  let started_at    = payloadStarted  ?? undefined
  let ended_at      = payloadEnded    ?? undefined
  let queue         = payloadQueue    ?? undefined
  let user          = payloadUser     ?? undefined
  let contact_name: string | undefined

  const hasCallDetails = !!(caller_number || called_number || started_at)

  if (!hasCallDetails) {
    console.log(`[Daktela Webhook] Call fields missing — fetching activity: ${activity_id}`)
    const activity = await getDaktelaActivity(activity_id)
    if (activity) {
      const item = activity.item as DaktelaActivityItem | null | undefined
      caller_number = caller_number ?? item?.clid
      called_number = called_number ?? item?.did
      direction     = direction     ?? item?.direction
      duration      = duration      ?? item?.duration ?? activity.duration
      started_at    = started_at    ?? item?.call_time ?? activity.time
      ended_at      = ended_at      ?? activity.time_close

      const queueRaw = activity.queue
      const userRaw  = activity.user
      queue = queue ?? (queueRaw
        ? (typeof queueRaw === 'string' ? queueRaw : (queueRaw as DaktelaActivityQueue).title ?? (queueRaw as DaktelaActivityQueue).name)
        : undefined)
      user = user ?? (userRaw
        ? (typeof userRaw === 'string' ? userRaw : (userRaw as DaktelaActivityUser).title ?? (userRaw as DaktelaActivityUser).name)
        : undefined)

      const contactRaw = activity.contact
      contact_name = contactRaw
        ? (typeof contactRaw === 'string' ? contactRaw : contactRaw.name)
        : undefined
    } else {
      console.warn(`[Daktela Webhook] Could not fetch activity ${activity_id} — proceeding without call details`)
    }
  }

  console.log(
    `[Daktela Webhook] Resolved — caller=${caller_number ?? '—'} called=${called_number ?? '—'}` +
    ` duration=${duration ?? '—'}s started=${started_at ?? '—'}`,
  )

  if (!caller_number) {
    console.warn(`[Daktela Webhook] No caller number for activity ${activity_id} — skipping`)
    return NextResponse.json({ ok: true, activity_id, warning: 'no caller number' }, { headers: corsHeaders() })
  }

  // ── Attribution ───────────────────────────────────────────────────────────
  const callTimestamp = started_at ? parseTimestamp(started_at) : new Date()

  const attribution = await attachAttributionToCall(callTimestamp, called_number ?? '').catch((err: Error) => {
    console.error('[Daktela Webhook] Attribution error:', err.message)
    return null
  })

  if (!attribution) {
    console.log(`[Daktela Webhook] No matching session for activity=${activity_id} caller=${caller_number}`)
  } else {
    console.log(
      `[Daktela Webhook] Attribution — campaign="${attribution.campaign_name ?? '—'}"` +
      ` ad="${attribution.ad_name ?? '—'}"` +
      ` delta=${Math.round((attribution.click_to_call_delta_ms ?? 0) / 60000)}min`,
    )
  }

  // ── Persist call ──────────────────────────────────────────────────────────
  const storedCall: StoredCall = {
    activity_id,
    activity_type:   activity_type   ?? undefined,
    activity_action: activity_action ?? undefined,
    caller_number,
    called_number,
    started_at,
    ended_at,
    direction,
    duration,
    user,
    queue,
    attribution:  attribution ?? undefined,
    processed_at: new Date().toISOString(),
  }

  await saveCall(storedCall).catch((err: Error) => {
    console.error('[Daktela Webhook] saveCall failed:', err.message)
  })

  // ── Daktela upsert — ALWAYS runs, even without attribution ────────────────
  // When attribution is null, contact is created/updated with phone only.
  // When attribution is present, structured Marketing Attribution fields populated.
  const marketingAttribution = attribution
    ? buildMarketingAttributionFields({
        attribution,
        activityId: activity_id,
        startedAt:  started_at,
        product:    PRODUCT,
      })
    : undefined

  await upsertDaktelaContact({
    customerName:         contact_name,
    phone:                caller_number,
    eventName:            'PhoneCallReceived',
    eventId:              activity_id,
    marketingAttribution,
  }).then((result) => {
    if (!result) return
    if (result.skipped) {
      console.log(`[Daktela Webhook] Skipped — duplicate activity="${activity_id}" contact="${result.contact.name}"`)
    } else {
      console.log(`[Daktela Webhook] Contact upserted — name="${result.contact.name}" created=${result.created}`)
    }
  }).catch((err: Error) => {
    console.error('[Daktela Webhook] Upsert failed:', err.message)
  })

  // ── Meta CAPI — always sent, even without fbp/fbc/fbclid ────────────────
  // Phone hash alone is valuable: Custom Audiences, Lookalike Audiences,
  // and future attribution even when the browser cookie is absent.
  await sendCAPIEvent(
    buildLeadCAPIEvent({
      eventName:    'Contact',
      eventId:      activity_id,
      phone:        caller_number,
      tracking: {
        campaign_name:    attribution?.campaign_name,
        adset_name:       attribution?.adset_name,
        ad_name:          attribution?.ad_name,
        campaign_id:      attribution?.campaign_id,
        adset_id:         attribution?.adset_id,
        ad_id:            attribution?.ad_id,
        fbclid:           attribution?.fbclid,
        fbp:              attribution?.fbp,
        fbc:              attribution?.fbc,
        landing_page_url: attribution?.landing_page_url,
      },
      sourceUrl:    attribution?.landing_page_url,
      actionSource: 'phone_call',
    }),
  ).then(() => {
    console.log(`[Daktela Webhook] Meta CAPI Contact sent for activity=${activity_id}`)
  }).catch((err: Error) => {
    console.error('[Daktela Webhook] Meta CAPI failed:', err.message)
  })

  return NextResponse.json({ ok: true, activity_id, attributed: !!attribution }, { headers: corsHeaders() })
}
