import { getPhoneClick, getPhoneClickIdsByDate } from './phone-click'
import { getSession } from './session'
import type { PhoneClick, CallAttribution } from './models'

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0040')) return digits.slice(2)
  if (digits.startsWith('40') && digits.length === 11) return digits
  if (digits.startsWith('0')  && digits.length === 10) return '4' + digits.slice(1)
  if (digits.length === 9) return '40' + digits
  return digits
}

/**
 * Find the PhoneClick closest in time before a Daktela incoming call,
 * searching today and yesterday indices.
 *
 * @param callTimestamp  when the call started
 * @param calledNumber   our phone number the caller dialled
 * @param windowMs       max look-back (default 8h)
 * @param extraClickIds  explicit click IDs to check first
 */
export async function findMatchingPhoneClick(
  callTimestamp: Date,
  calledNumber:  string,
  windowMs = 8 * 60 * 60 * 1000,
  extraClickIds: string[] = [],
): Promise<PhoneClick | null> {
  console.log(`[Attribution] Looking up call at ${callTimestamp.toISOString()} to ${calledNumber}`)

  const callTime   = callTimestamp.getTime()
  const normCalled = normalizePhone(calledNumber)

  const today     = callTimestamp.toISOString().slice(0, 10)
  const yesterday = new Date(callTime - 86400000).toISOString().slice(0, 10)

  const [todayIds, yesterdayIds] = await Promise.all([
    getPhoneClickIdsByDate(today),
    getPhoneClickIdsByDate(yesterday),
  ])

  const candidates = [...new Set([...extraClickIds, ...todayIds, ...yesterdayIds])]

  let best: PhoneClick | null = null
  let bestDelta = Infinity

  for (const id of candidates) {
    const click = await getPhoneClick(id)
    if (!click) continue
    if (normalizePhone(click.clicked_phone_number) !== normCalled) continue

    const clickTime = new Date(click.clicked_at).getTime()
    const delta     = callTime - clickTime

    if (delta < 0 || delta > windowMs) continue

    if (delta < bestDelta) {
      bestDelta = delta
      best      = click
    }
  }

  if (!best) {
    console.log('[Attribution] No matching PhoneClick found')
  }
  return best
}

export async function attachAttributionToCall(
  callTimestamp: Date,
  calledNumber:  string,
  extraClickIds: string[] = [],
  windowMs = 8 * 60 * 60 * 1000,
): Promise<CallAttribution | null> {
  const click = await findMatchingPhoneClick(callTimestamp, calledNumber, windowMs, extraClickIds)
  if (!click) return null

  const session = await getSession(click.session_id)
  const delta   = callTimestamp.getTime() - new Date(click.clicked_at).getTime()

  const attr: CallAttribution = {
    phone_click_id:         click.id,
    session_id:             click.session_id,
    utm_source:             session?.utm_source,
    utm_medium:             session?.utm_medium,
    utm_campaign:           session?.utm_campaign,
    utm_content:            session?.utm_content,
    utm_term:               session?.utm_term,
    campaign_name:          click.campaign_name  ?? session?.campaign_name,
    adset_name:             click.adset_name     ?? session?.adset_name,
    ad_name:                click.ad_name        ?? session?.ad_name,
    campaign_id:            click.campaign_id    ?? session?.campaign_id,
    adset_id:               click.adset_id       ?? session?.adset_id,
    ad_id:                  click.ad_id          ?? session?.ad_id,
    fbclid:                 click.fbclid         ?? session?.fbclid,
    fbp:                    click.fbp            ?? session?.fbp,
    fbc:                    click.fbc            ?? session?.fbc,
    landing_page_url:       click.landing_page_url,
    click_to_call_delta_ms: delta,
  }

  console.log(
    `[Attribution] Match found: campaign="${attr.campaign_name ?? '—'}"` +
    ` ad="${attr.ad_name ?? '—'}"` +
    ` delta=${Math.round(delta / 60000)}min`,
  )

  return attr
}
