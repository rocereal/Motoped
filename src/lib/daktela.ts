const BASE_URL     = process.env.DAKTELA_BASE_URL      ?? ''
const ACCESS_TOKEN = process.env.DAKTELA_ACCESS_TOKEN  ?? ''
const ENABLED      = process.env.DAKTELA_ENABLED !== 'false'

function normalisePhone(raw: string): string {
  const c = raw.replace(/[\s\-().]/g, '')
  if (c.startsWith('+40'))                     return c
  if (c.startsWith('0040'))                    return '+40' + c.slice(4)
  if (c.startsWith('40') && c.length === 11)   return '+' + c
  if (c.startsWith('0')  && c.length === 10)   return '+40' + c.slice(1)
  if (c.length === 9)                          return '+40' + c
  return c
}

async function daktelaFetch(path: string, method: 'GET' | 'POST' | 'PUT', body?: unknown) {
  const sep = path.includes('?') ? '&' : '?'
  const url = `${BASE_URL}/external/api/v6${path}${method === 'GET' ? sep + 'accessToken=' + ACCESS_TOKEN : '?accessToken=' + ACCESS_TOKEN}`
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Daktela ${method} ${path} → ${res.status}: ${text}`)
  }
  return res.json()
}

export interface UpsertInput {
  customerName?: string
  phone:         string
  email?:        string
  eventName:     string
  eventId:       string
  product?:      string
  message?:      string
  tracking?:     Record<string, string | undefined>
}

function buildPayload(input: UpsertInput) {
  const { customerName, phone, email, eventName, eventId, product, message, tracking = {} } = input
  const normPhone = normalisePhone(phone)

  const descLines = [
    '=== Lead Info ===',
    customerName ? `Name: ${customerName}` : null,
    `Event: ${eventName}`,
    `Event ID: ${eventId}`,
    product ? `Product: ${product}` : null,
    message ? `Message: ${message}` : null,
    '',
    '=== Tracking ===',
    ...Object.entries(tracking)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`),
  ].filter((l): l is string => l !== null)

  return {
    title: customerName ?? normPhone,
    tel:   normPhone,
    ...(email && { email }),
    description: descLines.join('\n'),
    customFields: {
      event_name:       eventName,
      event_id:         eventId,
      product_interest: product ?? '',
      lead_source:      tracking.utm_source ?? 'direct',
      utm_source:       tracking.utm_source    ?? '',
      utm_medium:       tracking.utm_medium    ?? '',
      utm_campaign:     tracking.utm_campaign  ?? '',
      fbclid:           tracking.fbclid        ?? '',
      fbp:              tracking.fbp           ?? '',
      fbc:              tracking.fbc           ?? '',
      fb_campaign_id:   tracking.campaign_id   ?? '',
      fb_campaign_name: tracking.campaign_name ?? '',
      fb_adset_id:      tracking.adset_id      ?? '',
      fb_adset_name:    tracking.adset_name    ?? '',
      fb_ad_id:         tracking.ad_id         ?? '',
      fb_ad_name:       tracking.ad_name       ?? '',
      landing_page_url: tracking.landing_page_url ?? '',
    },
  }
}

export async function upsertDaktelaContact(input: UpsertInput): Promise<void> {
  if (!ENABLED || !BASE_URL || !ACCESS_TOKEN) {
    console.warn('[Daktela] Disabled or not configured — skipping')
    return
  }

  const normPhone = normalisePhone(input.phone)
  const payload   = buildPayload(input)

  try {
    // 1. Search by phone
    const byPhone = await daktelaFetch(
      `/contacts.json?search[tel]=${encodeURIComponent(normPhone)}`, 'GET',
    )
    if (byPhone?.data?.length > 0) {
      const name = byPhone.data[0].name
      console.log(`[Daktela] Updating contact by phone: ${name}`)
      await daktelaFetch(`/contacts/${name}.json`, 'PUT', payload)
      return
    }

    // 2. Search by email
    if (input.email) {
      const byEmail = await daktelaFetch(
        `/contacts.json?search[email]=${encodeURIComponent(input.email)}`, 'GET',
      )
      if (byEmail?.data?.length > 0) {
        const name = byEmail.data[0].name
        console.log(`[Daktela] Updating contact by email: ${name}`)
        await daktelaFetch(`/contacts/${name}.json`, 'PUT', payload)
        return
      }
    }

    // 3. Create
    console.log('[Daktela] Creating new contact')
    await daktelaFetch('/contacts.json', 'POST', payload)
  } catch (err) {
    console.error('[Daktela] Error:', err)
  }
}
