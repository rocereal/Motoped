/**
 * POST /api/daktela/call-webhook
 *
 * Daktela sends this after a call ends (queue 1001 workflow trigger).
 *
 * Flow:
 *   1. Validate payload
 *   2. Run attribution: callerNumber + callTimestamp → findMatchingPhoneClick
 *   3. If matched → session context (fbp, fbc, campaign) retrieved
 *   4. Send Meta CAPI Contact event (action_source: phone_call)
 *   5. Store call record in KV
 *
 * Daktela webhook payload fields (queue 1001 template):
 *   activity_id, activity_type, activity_action, caller_number,
 *   duration, started_at, ended_at, queue, user
 */

import { NextRequest, NextResponse } from 'next/server'
import { DaktelaCallWebhookSchema } from '@/lib/validation'
import { attachAttributionToCall } from '@/lib/attribution'
import { saveCall, parseTimestamp } from '@/lib/call-store'
import { buildLeadCAPIEvent, sendCAPIEvent } from '@/lib/meta-capi'
import { getPhoneClick } from '@/lib/phone-click'
import { getSession } from '@/lib/session'
import type { StoredCall } from '@/lib/models'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

  console.log('[Daktela] Call webhook received:', JSON.stringify(body))

  const parsed = DaktelaCallWebhookSchema.safeParse(body)
  if (!parsed.success) {
    console.error('[Daktela] Invalid call webhook payload:', JSON.stringify(parsed.error.flatten()))
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400, headers: corsHeaders() },
    )
  }

  const { activity_id, activity_type, activity_action, caller_number, called_number, started_at, ended_at, direction, duration, user, queue } = parsed.data

  // Respond immediately — never make Daktela wait
  const response = NextResponse.json({ ok: true, activity_id }, { headers: corsHeaders() })

  const callTimestamp = parseTimestamp(started_at ?? new Date().toISOString())

  // 1. Attribution: find the phone click that led to this call
  const attribution = await attachAttributionToCall(callTimestamp, called_number ?? '').catch(() => null)

  // 2. Resolve tracking for CAPI
  let fbp: string | undefined
  let fbc: string | undefined
  let landingUrl: string | undefined

  if (attribution) {
    const click   = await getPhoneClick(attribution.phone_click_id).catch(() => null)
    const session = attribution.session_id
      ? await getSession(attribution.session_id).catch(() => null)
      : null

    fbp        = click?.fbp  ?? session?.fbp
    fbc        = click?.fbc  ?? session?.fbc
    landingUrl = click?.landing_page_url ?? session?.landing_page_url
  }

  const eventId = crypto.randomUUID()

  // 3. Meta CAPI Contact event (action_source: phone_call)
  await sendCAPIEvent(
    buildLeadCAPIEvent({
      eventName:    'Contact',
      eventId,
      phone:        caller_number ?? undefined,
      tracking:     {
        fbp, fbc,
        landing_page_url: landingUrl,
        campaign_name:    attribution?.campaign_name,
        ad_name:          attribution?.ad_name,
      },
      actionSource: 'phone_call',
      sourceUrl:    landingUrl,
    }),
  ).catch((err: Error) => {
    console.error('[Meta CAPI] Call Contact event failed:', err.message)
  })

  // 4. Persist call record
  const storedCall: StoredCall = {
    activity_id,
    activity_type:   activity_type   ?? undefined,
    activity_action: activity_action ?? undefined,
    caller_number:   caller_number   ?? undefined,
    called_number:   called_number   ?? undefined,
    started_at:      started_at      ?? undefined,
    ended_at:        ended_at        ?? undefined,
    direction:       direction       ?? undefined,
    duration,
    user:            user            ?? undefined,
    queue,
    attribution:  attribution ?? undefined,
    processed_at: new Date().toISOString(),
  }

  await saveCall(storedCall).catch((err: Error) => {
    console.error('[CallStore] Save failed:', err.message)
  })

  if (attribution) {
    console.log(
      `[Daktela] Matching phone click found:` +
      ` click_id=${attribution.phone_click_id}` +
      ` campaign="${attribution.campaign_name ?? '—'}"` +
      ` delta=${Math.round((attribution.click_to_call_delta_ms ?? 0) / 60000)}min`,
    )
  } else {
    console.log(`[Daktela] No matching phone click for activity_id=${activity_id}`)
  }

  return response
}
