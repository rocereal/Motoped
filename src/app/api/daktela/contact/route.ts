import { NextRequest, NextResponse } from 'next/server'
import { ContactPayloadSchema } from '@/lib/validation'
import { upsertDaktelaContact } from '@/lib/daktela'
import { buildLeadCAPIEvent, sendCAPIEvent } from '@/lib/meta-capi'

const NOTIFY_EMAIL = 'contact@motoped.ro'
const PRODUCT      = process.env.NEXT_PUBLIC_PRODUCT_NAME ?? 'NIEVE Q-EN'

// PhoneCallClicked is handled by /api/tracking/phone-click — not here.
// That route persists a PhoneClick for call attribution and fires the CAPI event.
const DAKTELA_EVENTS = new Set(['LeadFormSubmitted', 'VehicleInterestSubmitted', 'ContactRequested'])
const EMAIL_EVENTS   = new Set(['LeadFormSubmitted', 'VehicleInterestSubmitted', 'ContactRequested'])

const META_EVENT_MAP: Record<string, string> = {
  LeadFormSubmitted:        'Lead',
  VehicleInterestSubmitted: 'Lead',
  WhatsAppClicked:          'Contact',
  ContactRequested:         'Contact',
}

async function sendLeadEmail(params: {
  name?:     string
  phone:     string
  email?:    string
  message?:  string
  eventId:   string
  tracking?: Record<string, string | undefined>
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not set — skipping email notification')
    return
  }

  const { name, phone, email, message, eventId, tracking: t } = params

  const utmInfo = t
    ? [
        t.utm_source   && `<b>Sursă:</b> ${t.utm_source}`,
        t.utm_medium   && `<b>Medium:</b> ${t.utm_medium}`,
        t.utm_campaign && `<b>Campanie:</b> ${t.utm_campaign}`,
      ].filter(Boolean).join('<br>')
    : ''

  const html = `
    <h2 style="margin:0 0 16px">Lead nou — Motoped.ro</h2>
    <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:480px">
      <tr><td><b>Nume</b></td><td>${name || '—'}</td></tr>
      <tr><td><b>Telefon</b></td><td><a href="tel:${phone}">${phone}</a></td></tr>
      <tr><td><b>Email</b></td><td>${email || '—'}</td></tr>
      <tr><td><b>Mesaj</b></td><td>${message || '—'}</td></tr>
      ${utmInfo ? `<tr><td colspan="2" style="padding-top:12px;font-size:12px;color:#666">${utmInfo}</td></tr>` : ''}
      <tr><td style="font-size:11px;color:#aaa" colspan="2">Event ID: ${eventId}</td></tr>
    </table>
  `

  const resp = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:    `${PRODUCT} Lead <noreply@motoped.ro>`,
      to:      [NOTIFY_EMAIL],
      subject: `Lead nou: ${name || phone}`,
      html,
    }),
  })

  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`Resend ${resp.status}: ${body.slice(0, 200)}`)
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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

  const parsed = ContactPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400, headers: corsHeaders() },
    )
  }

  const { eventName, eventId, customer, interest, tracking, sourceUrl } = parsed.data

  const clientIp      = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined
  const userAgent     = req.headers.get('user-agent') ?? undefined
  const metaEventName = META_EVENT_MAP[eventName] ?? 'Lead'
  const trackingMap   = (tracking ?? {}) as Record<string, string | undefined>

  // Acknowledge immediately
  const response = NextResponse.json({ ok: true, eventId }, { status: 200, headers: corsHeaders() })

  await Promise.allSettled([
    ...(DAKTELA_EVENTS.has(eventName) ? [
      upsertDaktelaContact({
        customerName: customer.name,
        phone:        customer.phone,
        email:        customer.email || undefined,
        eventName,
        eventId,
        product:      interest?.product ?? PRODUCT,
        message:      interest?.message,
        tracking:     trackingMap,
      }).then(() => {
        console.log(`[Daktela] Sync success — event=${eventName}`)
      }).catch((err: Error) => {
        console.error('[Daktela] Sync failed:', err.message)
      }),
    ] : []),

    ...(EMAIL_EVENTS.has(eventName) ? [
      sendLeadEmail({
        name:     customer.name,
        phone:    customer.phone,
        email:    customer.email || undefined,
        message:  interest?.message,
        eventId,
        tracking: trackingMap,
      }).catch((err: Error) => {
        console.error('[Email] Send failed:', err.message)
      }),
    ] : []),

    sendCAPIEvent(
      buildLeadCAPIEvent({
        eventName:  metaEventName,
        eventId,
        phone:      customer.phone,
        email:      customer.email || undefined,
        tracking:   trackingMap,
        sourceUrl:  sourceUrl ?? trackingMap.landing_page_url,
        clientIp,
        userAgent,
      }),
    ).catch((err: Error) => {
      console.error('[Meta CAPI] Send failed:', err.message)
    }),
  ])

  return response
}
