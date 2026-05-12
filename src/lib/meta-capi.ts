import crypto from 'crypto'

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

function hashPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-().]/g, '')
  return crypto.createHash('sha256').update(cleaned.toLowerCase()).digest('hex')
}

interface CAPIEventInput {
  eventName:    string
  eventId:      string
  phone?:       string
  email?:       string
  firstName?:   string
  lastName?:    string
  tracking?:    Record<string, string | undefined>
  sourceUrl?:   string
  clientIp?:    string
  userAgent?:   string
  actionSource?: string
  customData?:  Record<string, unknown>
  eventTime?:   number
}

export function buildLeadCAPIEvent(input: CAPIEventInput) {
  const {
    eventName, eventId, phone, email, firstName, lastName,
    tracking = {}, sourceUrl, clientIp, userAgent,
    actionSource = 'website', customData = {}, eventTime,
  } = input

  const userData: Record<string, string | undefined> = {
    fbp: tracking.fbp,
    fbc: tracking.fbc,
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
    ...(tracking.utm_source    && { utm_source:    tracking.utm_source }),
    ...(tracking.utm_medium    && { utm_medium:    tracking.utm_medium }),
    ...(tracking.utm_campaign  && { utm_campaign:  tracking.utm_campaign }),
    ...(tracking.campaign_name && { campaign_name: tracking.campaign_name }),
    ...(tracking.ad_name       && { ad_name:       tracking.ad_name }),
  }

  return {
    event_name:       eventName,
    event_id:         eventId,
    event_time:       eventTime ?? Math.floor(Date.now() / 1000),
    action_source:    actionSource,
    event_source_url: sourceUrl ?? tracking.landing_page_url,
    user_data:        cleanUserData,
    ...(Object.keys(custom).length > 0 && { custom_data: custom }),
  }
}

export async function sendCAPIEvent(
  event: ReturnType<typeof buildLeadCAPIEvent>,
): Promise<void> {
  const pixelId  = process.env.META_PIXEL_ID
  const token    = process.env.META_ACCESS_TOKEN
  const testCode = process.env.META_TEST_EVENT_CODE

  if (!pixelId || !token) {
    console.warn('[CAPI] META_PIXEL_ID or META_ACCESS_TOKEN not set — skipping')
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
    const json = await res.json()
    if (!res.ok) {
      console.error('[CAPI] Error:', JSON.stringify(json))
    } else {
      console.log('[CAPI] Success — events_received:', (json as any).events_received)
    }
  } catch (err) {
    console.error('[CAPI] Fetch failed:', err)
  }
}
