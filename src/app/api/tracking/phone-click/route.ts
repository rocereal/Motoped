/**
 * POST /api/tracking/phone-click
 *
 * Called via navigator.sendBeacon() when user clicks a tel: link.
 * Does NOT create a Daktela contact — caller number is unknown until Daktela
 * delivers the call-webhook.
 *
 * Responsibilities:
 *   1. Persist PhoneClick to KV (for later call attribution)
 *   2. Send Meta CAPI Contact event (deduplication with browser Pixel via event_id)
 */

import { NextRequest, NextResponse } from 'next/server'
import { PhoneClickPayloadSchema } from '@/lib/validation'
import { savePhoneClick } from '@/lib/phone-click'
import { buildLeadCAPIEvent, sendCAPIEvent } from '@/lib/meta-capi'
import type { PhoneClick } from '@/lib/models'

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = PhoneClickPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { event_id, session_id, clicked_phone_number, tracking: t } = parsed.data

  const clientIp  = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined
  const userAgent = req.headers.get('user-agent') ?? undefined

  // Acknowledge immediately — never block the tel: redirect
  const response = NextResponse.json({ ok: true, event_id })

  const click: PhoneClick = {
    id:                   event_id,
    session_id,
    clicked_phone_number,
    clicked_at:           new Date().toISOString(),
    campaign_name:        t?.campaign_name,
    adset_name:           t?.adset_name,
    ad_name:              t?.ad_name,
    campaign_id:          t?.campaign_id,
    adset_id:             t?.adset_id,
    ad_id:                t?.ad_id,
    fbclid:               t?.fbclid,
    fbp:                  t?.fbp,
    fbc:                  t?.fbc,
    landing_page_url:     t?.landing_page_url,
    ip_address:           clientIp,
    user_agent:           userAgent,
  }

  await Promise.allSettled([
    savePhoneClick(click).catch((err: Error) => {
      console.error('[PhoneClick] Persist failed:', err.message)
    }),

    sendCAPIEvent(
      buildLeadCAPIEvent({
        eventName:  'Contact',
        eventId:    event_id,
        tracking:   t ?? {},
        sourceUrl:  t?.landing_page_url,
        clientIp,
        userAgent,
      }),
    ).then(() => {
      console.log(`[Meta CAPI] Contact event sent for phone click id=${event_id}`)
    }).catch((err: Error) => {
      console.error('[Meta CAPI] Contact event failed:', err.message)
    }),
  ])

  return response
}
