/**
 * GET /api/smartbill/poll-invoices
 *
 * Called hourly by Vercel Cron. Also accepts POST for manual trigger.
 * Vercel Cron automatically attaches: Authorization: Bearer {CRON_SECRET}
 *
 * Flow per paid invoice:
 *   1. Dedup check (skip if already processed)
 *   2. Resolve attribution: client phone → PhoneClick → TrackingSession
 *   3. Send Meta CAPI Purchase event
 *   4. Persist ProcessedInvoice to KV (dashboard + dedup)
 *
 * Env vars:
 *   SMARTBILL_EMAIL, SMARTBILL_TOKEN, SMARTBILL_CIF
 *   META_PIXEL_ID, META_ACCESS_TOKEN
 *   KV_REST_API_URL, KV_REST_API_TOKEN
 *   CRON_SECRET  (optional but recommended)
 *   DEFAULT_PURCHASE_VALUE (default 24900)
 */

import { NextRequest, NextResponse } from 'next/server'
import { listPaidInvoices, invoiceId } from '@/lib/smartbill'
import type { SmartBillInvoice } from '@/lib/smartbill'
import { hasInvoiceBeenProcessed, saveProcessedInvoice } from '@/lib/invoice-store'
import { getLatestPhoneClickByCallerPhone } from '@/lib/phone-click'
import { getSession } from '@/lib/session'
import { sendMetaOfflineConversion } from '@/lib/meta-capi'

const PRODUCT = process.env.NEXT_PUBLIC_PRODUCT_NAME ?? 'NIEVE Q-EN'

interface Attribution {
  fbp?:          string
  fbc?:          string
  fbclid?:       string
  campaign_name?: string
  adset_name?:   string
  ad_name?:      string
  campaign_id?:  string
  adset_id?:     string
  ad_id?:        string
  landing_page_url?: string
  source:        'phone_index' | 'none'
}

async function resolveAttribution(phone?: string): Promise<Attribution> {
  if (phone) {
    const click = await getLatestPhoneClickByCallerPhone(phone).catch(() => null)
    if (click) {
      const session = await getSession(click.session_id).catch(() => null)
      console.log(
        `[SmartBill] Purchase match found:` +
        ` click_id=${click.id}` +
        ` session_id=${click.session_id}` +
        ` campaign="${click.campaign_name ?? session?.campaign_name ?? '—'}"`,
      )
      return {
        fbp:           click.fbp           ?? session?.fbp,
        fbc:           click.fbc           ?? session?.fbc,
        fbclid:        click.fbclid        ?? session?.fbclid,
        campaign_name: click.campaign_name ?? session?.campaign_name,
        adset_name:    click.adset_name    ?? session?.adset_name,
        ad_name:       click.ad_name       ?? session?.ad_name,
        campaign_id:   click.campaign_id   ?? session?.campaign_id,
        adset_id:      click.adset_id      ?? session?.adset_id,
        ad_id:         click.ad_id         ?? session?.ad_id,
        landing_page_url: click.landing_page_url ?? session?.landing_page_url,
        source: 'phone_index',
      }
    }
  }

  console.log(`[SmartBill] No tracking match for phone=${phone ?? '—'} — Purchase sent with phone hash only`)
  return { source: 'none' }
}

async function processInvoice(inv: SmartBillInvoice): Promise<void> {
  const invId = invoiceId(inv)

  if (await hasInvoiceBeenProcessed(invId)) {
    console.log(`[SmartBill] Duplicate invoice skipped: ${invId}`)
    return
  }

  const phone = inv.client.phone
  const email = inv.client.email

  console.log(
    `[SmartBill] Invoice detected: ${invId}` +
    ` client="${inv.client.name ?? '—'}"` +
    ` phone=${phone ?? '—'}` +
    ` value=${inv.totalAmount} ${inv.currency}` +
    ` issued=${inv.issueDate}`,
  )

  const attr    = await resolveAttribution(phone)
  const eventId = `smartbill-${invId}`

  let sentToMeta = false
  let metaError: string | undefined

  try {
    await sendMetaOfflineConversion({
      eventName:       'Purchase',
      eventId,
      phone,
      email,
      fbp:             attr.fbp,
      fbc:             attr.fbc,
      campaignName:    attr.campaign_name,
      adsetName:       attr.adset_name,
      adName:          attr.ad_name,
      landingPageUrl:  attr.landing_page_url,
      value:           inv.totalAmount,
      currency:        inv.currency || 'RON',
      productInterest: PRODUCT,
      invoiceId:       invId,
    })
    sentToMeta = true
    console.log(
      `[SmartBill] Meta Purchase sent:` +
      ` invoice=${invId}` +
      ` value=${inv.totalAmount} ${inv.currency}` +
      ` campaign="${attr.campaign_name ?? '—'}"` +
      ` event_id=${eventId}`,
    )
  } catch (err) {
    metaError = (err as Error).message
    console.error(`[SmartBill] Meta CAPI error for invoice=${invId}:`, metaError)
  }

  await saveProcessedInvoice({
    invoice_id:      invId,
    client_name:     inv.client.name,
    phone,
    email,
    value:           inv.totalAmount,
    currency:        inv.currency || 'RON',
    issued_at:       inv.issueDate,
    campaign_name:   attr.campaign_name,
    adset_name:      attr.adset_name,
    ad_name:         attr.ad_name,
    campaign_id:     attr.campaign_id,
    adset_id:        attr.adset_id,
    ad_id:           attr.ad_id,
    fbclid:          attr.fbclid,
    fbp:             attr.fbp,
    fbc:             attr.fbc,
    tracking_source: attr.source,
    meta_event_id:   sentToMeta ? eventId : undefined,
    sent_to_meta:    sentToMeta,
    meta_error:      metaError,
    sent_at:         sentToMeta ? new Date().toISOString() : undefined,
    processed_at:    new Date().toISOString(),
  })
}

export async function GET(req: NextRequest) {
  return handler(req)
}

export async function POST(req: NextRequest) {
  return handler(req)
}

async function handler(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization') ?? ''
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const now       = new Date()
  const windowMs  = 48 * 60 * 60 * 1000
  const startDate = new Date(now.getTime() - windowMs).toISOString().slice(0, 10)
  const endDate   = now.toISOString().slice(0, 10)

  console.log(`[SmartBill] Poll started: ${startDate} → ${endDate}`)

  let paidInvoices: SmartBillInvoice[]
  try {
    paidInvoices = await listPaidInvoices(startDate, endDate)
  } catch (err) {
    console.error('[SmartBill] listPaidInvoices failed:', (err as Error).message)
    return NextResponse.json({ error: 'SmartBill fetch failed', detail: (err as Error).message }, { status: 500 })
  }

  const results  = await Promise.allSettled(paidInvoices.map(processInvoice))
  const processed = results.filter(r => r.status === 'fulfilled').length
  const failed    = results.filter(r => r.status === 'rejected').map(
    r => (r as PromiseRejectedResult).reason?.message ?? 'unknown',
  )

  console.log(`[SmartBill] Poll complete: ${processed} processed, ${failed.length} failed`)

  return NextResponse.json({
    ok:        true,
    startDate,
    endDate,
    invoices:  paidInvoices.length,
    processed,
    failed:    failed.length,
    errors:    failed.length ? failed : undefined,
  })
}
