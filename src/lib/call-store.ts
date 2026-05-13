import { kset, kget, klpush, klrange } from './store'
import type { StoredCall } from './models'

const CALL_TTL = 90 * 24 * 3600  // 90 days

export function parseTimestamp(value: string): Date {
  const n = Number(value)
  if (!isNaN(n) && n > 1_000_000_000) return new Date(n * 1000)  // Unix seconds
  return new Date(value)
}

function callKey(callId: string): string { return `call:${callId}` }

function indexKey(date: string): string { return `call_idx:${date}` }

function datePart(ts: string): string {
  return parseTimestamp(ts).toISOString().slice(0, 10)
}

export async function saveCall(call: StoredCall): Promise<void> {
  const dateKey = call.started_at ? datePart(call.started_at) : new Date().toISOString().slice(0, 10)
  await kset(callKey(call.activity_id), JSON.stringify(call), CALL_TTL)
  await klpush(indexKey(dateKey), call.activity_id, CALL_TTL)

  const attr = call.attribution
  console.log(
    `[CallStore] Saved activity_id=${call.activity_id}` +
    ` caller=${call.caller_number ?? '—'}` +
    ` attributed=${attr ? `campaign="${attr.campaign_name ?? '—'}"` : 'no'}`,
  )
}

export async function getCall(callId: string): Promise<StoredCall | null> {
  const raw = await kget(callKey(callId))
  if (!raw) return null
  return JSON.parse(raw) as StoredCall
}

export async function getCallIdsByDate(date: string, limit = 500): Promise<string[]> {
  return klrange(indexKey(date), limit)
}
