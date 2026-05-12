import crypto from 'crypto'
import type { TrackingData } from './validation'

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

function hashPhone(phone: string): string {
  return sha256(phone.replace(/[\s\-().]/g, ''))
}

// ── Core event builder ────────────────────────────────────────────────────────

interface CAPIEventInput {
  eventName:     string
  eventId:       string
  phone?:        string
  email?:        string
  firstName?:    string
  lastName?:     string
  tracking?:     TrackingData | Record<string, string | undefined>
  sourceUrl?:    string
  clientIp?:     string
  userAgent?:    string
  actionSource?: string
  customData?:   Record<string, unknown>
  eventTime?:    number
}

export function buildLeadCAPIEvent(input: CAPIEventInput) {
  const {
    eventName, eventId, phone, email, firstName, lastName,
    tracking = {}, sourceUrl, clientIp, userAgent,
    actionSource = 'website', customData = {}, eventTime,
  } = input

  const t = tracking as Record<string, string | undefined>

  const userData: Record<string, string | undefined> = {
    fbp:               t.fbp,
    fbc:               t.fbc,
    client_ip_address: clientIp,
    client_user_agent: userAgent,
  }
  if (email)     userData.em = sha256(email)
  if (phone)     userData.ph = hashPhone(phone)
  if (firstName) userData.fn = sha256(firstName)
  if (lastName)  userData.ln = sha256(lastName)

  const cleanUserData = Object.fromEntries(
    Object.entries(userData).filter(([, v]) => v !== undefined),
  )

  const custom: Record<string, unknown> = {
    ...customData,
    ...(t.utm_source    && { utm_source:    t.utm_source }),
    ...(t.utm_medium    && { utm_medium:    t.utm_medium }),
    ...(t.utm_campaign  && { utm_campaign:  t.utm_campaign }),
    ...(t.campaign_name && { campaign_name: t.campaign_name }),
    ...(t.ad_name       && { ad_name:       t.ad_name }),
  }

  return {
    event_name:       eventName,
    event_id:         eventId,
    event_time:       eventTime ?? Math.floor(Date.now() / 1000),
    action_source:    actionSource,
    event_source_url: sourceUrl ?? t.landing_page_url,
    user_data:        cleanUserData,
    ...(Object.keys(custom).length > 0 && { custom_data: custom }),
  }
}

// ── Send to Meta Graph API ────────────────────────────────────────────────────

export async function sendCAPIEvent(
  event: ReturnType<typeof buildLeadCAPIEvent>,
): Promise<void> {
  const pixelId  = process.env.META_PIXEL_ID
  const token    = process.env.META_ACCESS_TOKEN
  const testCode = process.env.META_TEST_EVENT_CODE

  if (!pixelId || !token) {
    console.warn('[Meta CAPI] META_PIXEL_ID or META_ACCESS_TOKEN not set — skipping')
    return
  }

  const payload: Record<string, unknown> = { data: [event] }
  if (testCode) payload.test_event_code = testCode

  const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`

  try {
    const res  = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    const json = await res.json() as Record<string, unknown>
    if (!res.ok) {
      console.error(`[Meta CAPI] Event "${event.event_name}" failed:`, JSON.stringify(json))
    } else {
      console.log(`[Meta CAPI] Event "${event.event_name}" sent (id=${event.event_id}) events_received=${json.events_received}`)
    }
  } catch (err) {
    console.error(`[Meta CAPI] Network error for "${event.event_name}":`, (err as Error).message)
  }
}

// ── Offline / system_generated events ────────────────────────────────────────

export interface OfflineConversionParams {
  eventName:        string
  eventId:          string
  eventTime?:       number
  phone?:           string
  email?:           string
  fbp?:             string
  fbc?:             string
  campaignName?:    string
  adsetName?:       string
  adName?:          string
  landingPageUrl?:  string
  productInterest?: string
  value?:           number
  currency?:        string
  leadStatus?:      string
  invoiceId?:       string
}

export async function sendMetaOfflineConversion(p: OfflineConversionParams): Promise<void> {
  const customData: Record<string, unknown> = {
    ...(p.leadStatus      && { lead_status:      p.leadStatus }),
    ...(p.productInterest && { product_interest: p.productInterest }),
    ...(p.campaignName    && { campaign_name:    p.campaignName }),
    ...(p.adsetName       && { adset_name:       p.adsetName }),
    ...(p.adName          && { ad_name:          p.adName }),
  }

  if (p.eventName === 'Purchase') {
    customData.value    = p.value    ?? Number(process.env.DEFAULT_PURCHASE_VALUE ?? 24900)
    customData.currency = p.currency ?? 'RON'
    if (p.invoiceId) customData.invoice_id = p.invoiceId
  }

  await sendCAPIEvent(
    buildLeadCAPIEvent({
      eventName:    p.eventName,
      eventId:      p.eventId,
      eventTime:    p.eventTime ?? Math.floor(Date.now() / 1000),
      phone:        p.phone,
      email:        p.email,
      tracking:     { fbp: p.fbp, fbc: p.fbc, landing_page_url: p.landingPageUrl },
      actionSource: 'system_generated',
      sourceUrl:    p.landingPageUrl,
      customData,
    }),
  )
}

// ── CRM status → Meta event ───────────────────────────────────────────────────
// Only Purchase/Sold maps; everything else returns null (not sent to Meta).
// Primary Purchase flow: SmartBill invoice paid → /api/smartbill/poll-invoices.
export function crmStatusToMetaEvent(status: string): 'Purchase' | null {
  if (status === 'Purchase' || status === 'Sold') return 'Purchase'
  return null
}
