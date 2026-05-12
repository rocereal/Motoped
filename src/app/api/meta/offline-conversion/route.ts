import { NextRequest, NextResponse } from 'next/server'
import { OfflineConversionSchema } from '@/lib/validation'
import { sendCAPIEvent, buildLeadCAPIEvent } from '@/lib/meta-capi'

const STATUS_TO_META: Record<string, string | null> = {
  QualifiedLead:      'QualifiedLead',
  TestDriveScheduled: 'Schedule',
  Purchase:           'Purchase',
  NewLead:            null,
  Contacted:          null,
  Lost:               null,
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = OfflineConversionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { status, customer, tracking, eventTime, value, currency } = parsed.data
  const metaEventName = STATUS_TO_META[status]

  if (!metaEventName) {
    console.log(`[offline-conversion] Status "${status}" not mapped — skipping`)
    return NextResponse.json({ ok: true, skipped: true })
  }

  const eventId    = crypto.randomUUID()
  const trackingMap = (tracking ?? {}) as Record<string, string | undefined>
  const customData: Record<string, unknown> = {}

  if (status === 'Purchase' && value != null) {
    customData.value    = value
    customData.currency = currency ?? 'RON'
  }

  await sendCAPIEvent(
    buildLeadCAPIEvent({
      eventName:    metaEventName,
      eventId,
      phone:        customer.phone,
      email:        customer.email,
      tracking:     trackingMap,
      actionSource: 'system_generated',
      customData,
      eventTime,
    }),
  )

  return NextResponse.json({ ok: true, eventId })
}
