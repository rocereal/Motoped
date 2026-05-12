/**
 * POST /api/meta/offline-conversion
 *
 * Only Purchase/Sold status changes are forwarded to Meta.
 * All other statuses (QualifiedLead, Contacted, Lost, etc.) are logged and skipped.
 *
 * Primary Purchase flow: SmartBill invoice paid → /api/smartbill/poll-invoices
 * This endpoint is a manual/fallback trigger (e.g. Daktela webhook on status change).
 *
 * Configure in Daktela → Webhooks → CRM Record Updated:
 *   URL: https://motoped.ro/api/meta/offline-conversion
 *   Payload:
 *     {
 *       "contactId":  "{{contact.name}}",
 *       "status":     "Purchase",
 *       "customer":   { "phone": "{{contact.tel}}", "email": "{{contact.email}}" },
 *       "value":      "{{contact.customFields.deal_value}}",
 *       "currency":   "RON"
 *     }
 */

import { NextRequest, NextResponse } from 'next/server'
import { OfflineConversionSchema } from '@/lib/validation'
import { crmStatusToMetaEvent, sendMetaOfflineConversion } from '@/lib/meta-capi'
import { hasBeenSent, markAsSent, getSentRecord } from '@/lib/offline-conv-store'
import { getLatestPhoneClickByCallerPhone } from '@/lib/phone-click'
import { getSession } from '@/lib/session'

const DEFAULT_PURCHASE_VALUE = Number(process.env.DEFAULT_PURCHASE_VALUE ?? 24900)
const PRODUCT = process.env.NEXT_PUBLIC_PRODUCT_NAME ?? 'NIEVE Q-EN'

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[Offline] Webhook received:', JSON.stringify(body))

  const parsed = OfflineConversionSchema.safeParse(body)
  if (!parsed.success) {
    console.error('[Offline] Invalid payload:', JSON.stringify(parsed.error.flatten()))
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { contactId, status, customer, tracking: payloadTracking, eventTime, productInterest, value, currency } = parsed.data
  const phone = customer?.phone
  const email = customer?.email

  // Only Purchase reaches Meta
  const metaEventName = crmStatusToMetaEvent(status)
  if (!metaEventName) {
    console.log(`[Offline] Skipped — status="${status}" for contact="${contactId}" not forwarded to Meta`)
    return NextResponse.json({ ok: true, skipped: true, reason: `status "${status}" not mapped` })
  }

  // Deduplication
  const alreadySent = await hasBeenSent(contactId, status).catch(() => false)
  if (alreadySent) {
    const existing = await getSentRecord(contactId, status).catch(() => null)
    console.log(`[Offline] Skipped — duplicate: contact="${contactId}" status="${status}" event_id=${existing?.event_id ?? '?'}`)
    return NextResponse.json({ ok: true, duplicate: true, event_id: existing?.event_id })
  }

  const eventId = `${contactId}-${status}-${Date.now()}`
  const response = NextResponse.json({ ok: true, event_id: eventId, meta_event: metaEventName })

  // Resolve tracking: payload → phone index → none
  let t = payloadTracking
  if (!t?.fbp && !t?.campaign_name && phone) {
    const click = await getLatestPhoneClickByCallerPhone(phone).catch(() => null)
    if (click) {
      const session = await getSession(click.session_id).catch(() => null)
      t = {
        fbp:           click.fbp          ?? session?.fbp,
        fbc:           click.fbc          ?? session?.fbc,
        fbclid:        click.fbclid       ?? session?.fbclid,
        campaign_name: click.campaign_name ?? session?.campaign_name,
        adset_name:    click.adset_name    ?? session?.adset_name,
        ad_name:       click.ad_name       ?? session?.ad_name,
        campaign_id:   click.campaign_id   ?? session?.campaign_id,
        adset_id:      click.adset_id      ?? session?.adset_id,
        ad_id:         click.ad_id         ?? session?.ad_id,
        landing_page_url: click.landing_page_url ?? session?.landing_page_url,
      }
      console.log(`[Offline] Tracking source: phone_index campaign="${t.campaign_name ?? '—'}"`)
    }
  }

  try {
    await sendMetaOfflineConversion({
      eventName:       'Purchase',
      eventId,
      eventTime:       eventTime ?? Math.floor(Date.now() / 1000),
      phone,
      email,
      fbp:             t?.fbp,
      fbc:             t?.fbc,
      campaignName:    t?.campaign_name,
      adsetName:       t?.adset_name,
      adName:          t?.ad_name,
      landingPageUrl:  t?.landing_page_url,
      productInterest: productInterest ?? PRODUCT,
      value:           typeof value === 'number' ? value : DEFAULT_PURCHASE_VALUE,
      currency:        currency ?? 'RON',
      leadStatus:      status,
    })

    await markAsSent(contactId, status, {
      event_id:   eventId,
      meta_event: 'Purchase',
      sent_at:    new Date().toISOString(),
    })

    console.log(
      `[Offline] Meta Purchase sent — contact="${contactId}"` +
      ` event_id="${eventId}"` +
      ` campaign="${t?.campaign_name ?? '—'}"` +
      ` value=${typeof value === 'number' ? value : DEFAULT_PURCHASE_VALUE} ${currency ?? 'RON'}`,
    )
  } catch (err) {
    console.error(`[Meta CAPI] Error for contact="${contactId}":`, (err as Error).message)
  }

  return response
}
