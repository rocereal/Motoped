import { NextRequest, NextResponse } from 'next/server'
import { ContactPayloadSchema } from '@/lib/validation'
import { upsertDaktelaContact } from '@/lib/daktela'
import { sendCAPIEvent, buildLeadCAPIEvent } from '@/lib/meta-capi'

const META_EVENT_MAP: Record<string, string> = {
  LeadFormSubmitted:        'Lead',
  VehicleInterestSubmitted: 'Lead',
  PhoneCallClicked:         'Contact',
  WhatsAppClicked:          'Contact',
  ContactRequested:         'Contact',
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
  try {
    body = await req.json()
  } catch {
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
  const nameParts     = (customer.name ?? '').split(' ')
  const firstName     = nameParts[0] || undefined
  const lastName      = nameParts.slice(1).join(' ') || undefined
  const trackingMap   = (tracking ?? {}) as Record<string, string | undefined>

  await Promise.allSettled([
    upsertDaktelaContact({
      customerName: customer.name,
      phone:        customer.phone,
      email:        customer.email,
      eventName,
      eventId,
      product:  interest?.product,
      message:  interest?.message,
      tracking: trackingMap,
    }),
    sendCAPIEvent(
      buildLeadCAPIEvent({
        eventName: metaEventName,
        eventId,
        phone:     customer.phone,
        email:     customer.email,
        firstName,
        lastName,
        tracking:  trackingMap,
        sourceUrl,
        clientIp,
        userAgent,
      }),
    ),
  ]).then((results) => {
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[contact/route] task[${i}] failed:`, r.reason)
      }
    })
  })

  return NextResponse.json({ ok: true, eventId }, { status: 200, headers: corsHeaders() })
}
