export const TRACKING_KEY = 'motoped_tracking_v1'

export type EventName =
  | 'PhoneCallClicked'
  | 'WhatsAppClicked'
  | 'LeadFormSubmitted'
  | 'ContactRequested'
  | 'VehicleInterestSubmitted'

const META_EVENT_MAP: Record<EventName, string> = {
  LeadFormSubmitted:        'Lead',
  VehicleInterestSubmitted: 'Lead',
  PhoneCallClicked:         'Contact',
  WhatsAppClicked:          'Contact',
  ContactRequested:         'Contact',
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export function getTracking(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(TRACKING_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export async function fireTrackingEvent(
  eventName: EventName,
  customer:  { name?: string; phone: string; email?: string },
  interest?: { product?: string; message?: string },
): Promise<string> {
  const eventId    = generateUUID()
  const tracking   = getTracking()
  const metaEvent  = META_EVENT_MAP[eventName]

  // Browser Pixel — fires with same eventId as CAPI for deduplication
  if (typeof (window as any).fbq === 'function') {
    ;(window as any).fbq('track', metaEvent, {}, { eventID: eventId })
  }

  // Server-side CAPI + Daktela — fire and forget (keepalive survives navigation)
  fetch('/api/daktela/contact', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      eventName,
      eventId,
      customer,
      interest,
      tracking,
      sourceUrl: window.location.href,
    }),
  }).catch((err) => console.error('[Tracking] POST failed:', err))

  return eventId
}
