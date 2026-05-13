/**
 * Daktela API v6 — Activities + Contacts
 *
 * Activities  (base: /external/api/v6, auth: accessToken query param)
 *   GET  /activities/{name}.json
 *   GET  /activitiesCall.json?filter[field]=activity&…
 *
 * Contacts    (base: /api/v6, auth: X-AUTH-TOKEN header)
 *   GET  /contacts.json?filter[logic]=and&filter[filters][0][field]=customFields.number&…
 *   POST /contacts.json
 *   PUT  /contacts/{name}.json
 *
 * Phone numbers stored in customFields.number (E.164 array) — NOT in tel/phone.
 * Email stored in customFields.email (array).
 * database must be "default" on create; omit on update.
 */

import type { TrackingData } from './validation'
import type { CallAttribution } from './models'

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_URL     = (process.env.DAKTELA_BASE_URL ?? '').replace(/\/$/, '')
const ACCESS_TOKEN = process.env.DAKTELA_ACCESS_TOKEN ?? ''
const ENABLED      = process.env.DAKTELA_ENABLED !== 'false'

// Activities use /external/api/v6 (query-param auth); contacts use /api/v6 (header auth)
const ACTIVITIES_BASE = `${BASE_URL}/external/api/v6`
const CONTACTS_BASE   = `${BASE_URL}/api/v6`

function missingConfig(): boolean {
  return !BASE_URL || !ACCESS_TOKEN
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DaktelaContactCustomFields {
  number?:             string[]
  email?:              string[]
  address?:            string[]
  note?:               string[]
  utm_source?:         string[]
  utm_medium?:         string[]
  utm_campaign?:       string[]
  utm_content?:        string[]
  utm_term?:           string[]
  landing_page?:       string[]
  product?:            string[]
  lead_submitted_at?:  string[]
  source_activity_id?: string[]
  source_site?:        string[]
  fbp?:                string[]
  fbc?:                string[]
  [key: string]: string | string[] | undefined
}

export interface DaktelaContact {
  name:          string
  title?:        string
  firstname?:    string
  lastname?:     string
  description?:  string
  database?:     string | { name: string; title?: string }
  customFields?: DaktelaContactCustomFields
}

interface DaktelaListResponse {
  result: { data: DaktelaContact[]; total: number }
  error?: string[]
}

interface DaktelaSingleResponse {
  result: DaktelaContact
  error?: string[]
}

export interface CreateContactPayload {
  title?:        string
  firstname?:    string
  lastname?:     string
  description?:  string
  database?:     string
  customFields?: DaktelaContactCustomFields
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────

async function activitiesRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const sep = path.includes('?') ? '&' : '?'
  const url = `${ACTIVITIES_BASE}${path}${sep}accessToken=${encodeURIComponent(ACCESS_TOKEN)}`
  const resp = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  const body = await resp.text()
  if (!resp.ok) throw new Error(`Daktela ${resp.status} on ${path}: ${body.slice(0, 200)}`)
  try { return JSON.parse(body) as T } catch {
    throw new Error(`Daktela non-JSON on ${path}: ${body.slice(0, 200)}`)
  }
}

async function contactsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${CONTACTS_BASE}${path}`
  const resp = await fetch(url, {
    ...init,
    headers: {
      'X-AUTH-TOKEN':  ACCESS_TOKEN,
      'Content-Type':  'application/json',
      'Accept':        'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const body = await resp.text()
  if (!resp.ok) throw new Error(`Daktela ${resp.status} on ${path}: ${body.slice(0, 200)}`)
  if (!body.trim()) return {} as T
  try { return JSON.parse(body) as T } catch {
    throw new Error(`Daktela non-JSON on ${path}: ${body.slice(0, 200)}`)
  }
}

// ── Activity fetch ────────────────────────────────────────────────────────────

export interface DaktelaActivityItem {
  id_call?:   string
  clid?:      string   // caller phone
  did?:       string   // called number (DID)
  direction?: string
  duration?:  number
  call_time?: string
}

export interface DaktelaActivityUser  { name: string; title?: string }
export interface DaktelaActivityQueue { name: string; title?: string }

export interface DaktelaActivity {
  name:        string
  title?:      string
  action?:     string
  type?:       string
  time?:       string
  time_close?: string
  duration?:   number
  queue?:      DaktelaActivityQueue | string | null
  user?:       DaktelaActivityUser  | string | null
  contact?:    { name: string; title?: string } | string | null
  item?:       DaktelaActivityItem  | null
}

interface DaktelaActivityResponse {
  result: DaktelaActivity
  error?: string[]
}

export async function getDaktelaActivity(activityName: string): Promise<DaktelaActivity | null> {
  if (missingConfig()) {
    console.error('[Daktela] Missing config — cannot fetch activity')
    return null
  }

  // Activity names like "activities_xxx.yyy" contain dots.
  // Encode as %2E so the router strips only the trailing .json suffix.
  const encodedName = activityName.replace(/\./g, '%2E')
  const directPath  = `/activities/${encodedName}.json`

  try {
    const data = await activitiesRequest<DaktelaActivityResponse>(directPath)
    const activity = data.result ?? null
    if (activity) {
      console.log(`[Daktela] Activity fetched — name="${activity.name}" action="${activity.action}"`)
    }
    return activity
  } catch (firstErr) {
    console.warn(`[Daktela] Direct fetch failed: ${(firstErr as Error).message} — trying activitiesCall fallback`)

    const fallbackPath =
      `/activitiesCall.json?filter[field]=activity&filter[operator]=eq` +
      `&filter[value]=${encodeURIComponent(activityName)}`
    try {
      const data = await activitiesRequest<{ result: { data: DaktelaActivityItem[]; total: number } }>(fallbackPath)
      const item = data.result?.data?.[0]
      if (item) return { name: activityName, item } as DaktelaActivity
      console.warn(`[Daktela] No activitiesCall record for activity="${activityName}"`)
      return null
    } catch (secondErr) {
      console.error('[Daktela] Both fetch attempts failed:', (secondErr as Error).message)
      return null
    }
  }
}

// ── Phone normalisation ───────────────────────────────────────────────────────

export function normalizePhone(raw: string): string {
  const c = raw.replace(/[\s\-().]/g, '')
  if (c.startsWith('+40'))                    return c
  if (c.startsWith('0040'))                   return '+40' + c.slice(4)
  if (c.startsWith('40') && c.length === 11)  return '+' + c
  if (c.startsWith('0')  && c.length === 10)  return '+40' + c.slice(1)
  if (c.length === 9)                         return '+40' + c
  return c
}

// ── Timestamp conversion ──────────────────────────────────────────────────────

/**
 * Convert ISO 8601 UTC string to "YYYY-MM-DD HH:MM:SS" in Europe/Bucharest.
 * DST-aware via IANA tz database built into V8/Node. No external deps.
 */
export function toRomaniaDaktelaFormat(iso: string): string {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Bucharest',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).formatToParts(new Date(iso))
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00'
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`
}

// ── Marketing Attribution custom fields builder ───────────────────────────────

export interface MarketingAttributionParams {
  attribution: CallAttribution
  activityId:  string
  startedAt?:  string   // ISO 8601 UTC — converted to Romania local for lead_submitted_at
  product?:    string
}

/**
 * Maps CallAttribution → Daktela Marketing Attribution customFields block.
 * Only keys with actual values are included; absent keys leave existing
 * Daktela values intact (last-touch, partial update).
 * source_activity_id and source_site are always included.
 */
export function buildMarketingAttributionFields(
  p: MarketingAttributionParams,
): DaktelaContactCustomFields {
  const a  = p.attribution
  const cf: DaktelaContactCustomFields = {}

  if (a.utm_source)       cf.utm_source   = [a.utm_source]
  if (a.utm_medium)       cf.utm_medium   = [a.utm_medium]
  if (a.utm_campaign)     cf.utm_campaign = [a.utm_campaign]
  if (a.utm_content)      cf.utm_content  = [a.utm_content]
  if (a.utm_term)         cf.utm_term     = [a.utm_term]
  if (a.landing_page_url) cf.landing_page = [a.landing_page_url]
  if (p.product)          cf.product      = [p.product]
  if (a.fbp)              cf.fbp          = [a.fbp]
  if (a.fbc)              cf.fbc          = [a.fbc]

  cf.source_activity_id = [p.activityId]
  cf.source_site        = [process.env.SITE_NAME ?? 'unknown']

  if (p.startedAt) {
    try {
      cf.lead_submitted_at = [toRomaniaDaktelaFormat(p.startedAt)]
    } catch {
      // malformed ISO — omit field
    }
  }

  return cf
}

// ── Search ────────────────────────────────────────────────────────────────────

export async function findDaktelaContactByPhone(phone: string): Promise<DaktelaContact | null> {
  const normalized = normalizePhone(phone)
  try {
    const data = await contactsRequest<DaktelaListResponse>(
      `/contacts.json?filter[logic]=and` +
      `&filter[filters][0][field]=customFields.number` +
      `&filter[filters][0][operator]=eq` +
      `&filter[filters][0][value]=${encodeURIComponent(normalized)}` +
      `&take=1&fields=name,title,firstname,lastname,customFields`,
    )
    return data.result?.data?.[0] ?? null
  } catch (err) {
    console.error('[Daktela] findByPhone error:', (err as Error).message)
    return null
  }
}

export async function findDaktelaContactByEmail(email: string): Promise<DaktelaContact | null> {
  try {
    const data = await contactsRequest<DaktelaListResponse>(
      `/contacts.json?filter[logic]=and` +
      `&filter[filters][0][field]=customFields.email` +
      `&filter[filters][0][operator]=eq` +
      `&filter[filters][0][value]=${encodeURIComponent(email)}` +
      `&take=1&fields=name,title,firstname,lastname,customFields`,
    )
    return data.result?.data?.[0] ?? null
  } catch (err) {
    console.error('[Daktela] findByEmail error:', (err as Error).message)
    return null
  }
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function createDaktelaContact(payload: CreateContactPayload): Promise<DaktelaContact> {
  const data = await contactsRequest<DaktelaSingleResponse>('/contacts.json', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
  return data.result
}

export async function updateDaktelaContact(
  contactName: string,
  payload:     Partial<CreateContactPayload>,
): Promise<DaktelaContact> {
  const data = await contactsRequest<DaktelaSingleResponse>(
    `/contacts/${encodeURIComponent(contactName)}.json`,
    { method: 'PUT', body: JSON.stringify(payload) },
  )
  return data.result
}

// ── Upsert ────────────────────────────────────────────────────────────────────

export interface UpsertOptions {
  customerName?: string
  phone:         string
  email?:        string
  eventName:     string  // kept for backward compat (contact route)
  eventId:       string  // kept for backward compat (contact route)
  product?:      string
  message?:      string
  tracking?:     TrackingData | Record<string, string | undefined>
  /**
   * Structured Marketing Attribution fields (from buildMarketingAttributionFields).
   * When present, takes precedence over legacy tracking.
   */
  marketingAttribution?: DaktelaContactCustomFields
}

export type UpsertResult = { contact: DaktelaContact; created: boolean; skipped?: boolean }

export async function upsertDaktelaContact(opts: UpsertOptions): Promise<UpsertResult | null> {
  if (!ENABLED || missingConfig()) {
    console.warn('[Daktela] Disabled or not configured — skipping')
    return null
  }
  if (!opts.phone) {
    console.warn('[Daktela] Missing phone — skipping upsert')
    return null
  }

  const phone = normalizePhone(opts.phone)
  const ma    = opts.marketingAttribution ?? buildLegacyAttributionCF(opts)

  let existing = await findDaktelaContactByPhone(phone)
  if (!existing && opts.email) {
    existing = await findDaktelaContactByEmail(opts.email)
  }

  try {
    if (existing) {
      // Idempotency: skip if this exact activity was already processed
      const lastActivityId = existing.customFields?.source_activity_id?.[0]
      if (lastActivityId && lastActivityId === ma.source_activity_id?.[0]) {
        console.log(`[Daktela] Duplicate activity "${lastActivityId}" — skipping update`)
        return { contact: existing, created: false, skipped: true }
      }

      // Defensive merge:
      //   Layer 1 — all existing customFields (preserves note, address, agent-edited fields)
      //   Layer 2 — new attribution fields (last-touch, overwrites only keys with data)
      //   Layer 3 — phone/email merge (always wins)
      const mergedPhones = Array.from(new Set([...(existing.customFields?.number ?? []), phone]))
      const mergedEmails = opts.email
        ? Array.from(new Set([...(existing.customFields?.email ?? []), opts.email]))
        : null

      const updateCustomFields: DaktelaContactCustomFields = {
        ...(existing.customFields ?? {}),
        ...ma,
        number: mergedPhones,
        ...(mergedEmails ? { email: mergedEmails } : {}),
      }

      const contact = await updateDaktelaContact(existing.name, { customFields: updateCustomFields })
      console.log(`[Daktela] Contact updated: ${existing.name}`)
      return { contact, created: false }
    }

    // Create
    const createPayload: CreateContactPayload = {
      title:       opts.customerName || phone,
      description: '',
      database:    'default',
      customFields: {
        ...ma,
        number: [phone],
        ...(opts.email ? { email: [opts.email] } : {}),
      },
    }
    const contact = await createDaktelaContact(createPayload)
    console.log(`[Daktela] Contact created: ${contact.name}`)
    return { contact, created: true }
  } catch (err) {
    console.error('[Daktela] Sync failed:', (err as Error).message)
    return null
  }
}

// Build basic attribution CF from legacy tracking (form submission path — no CallAttribution)
function buildLegacyAttributionCF(opts: UpsertOptions): DaktelaContactCustomFields {
  const t = (opts.tracking ?? {}) as Record<string, string | undefined>
  const cf: DaktelaContactCustomFields = {}

  if (t.utm_source)       cf.utm_source   = [t.utm_source]
  if (t.utm_medium)       cf.utm_medium   = [t.utm_medium]
  if (t.utm_campaign)     cf.utm_campaign = [t.utm_campaign]
  if (t.utm_content)      cf.utm_content  = [t.utm_content]
  if (t.utm_term)         cf.utm_term     = [t.utm_term]
  if (t.landing_page_url) cf.landing_page = [t.landing_page_url]
  if (opts.product)       cf.product      = [opts.product]
  if (t.fbp)              cf.fbp          = [t.fbp]
  if (t.fbc)              cf.fbc          = [t.fbc]

  cf.source_activity_id = [opts.eventId]
  cf.source_site        = [process.env.SITE_NAME ?? 'unknown']
  cf.lead_submitted_at  = [toRomaniaDaktelaFormat(new Date().toISOString())]

  return cf
}
