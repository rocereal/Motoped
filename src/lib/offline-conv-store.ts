import { kset, kget } from './store'

const TTL = 365 * 24 * 3600  // 1 year

export interface SentConversionRecord {
  event_id:   string
  meta_event: string
  sent_at:    string
}

function dedupKey(contactId: string, status: string): string {
  return `offconv:${contactId.replace(/:/g, '_')}:${status}`
}

export async function hasBeenSent(contactId: string, status: string): Promise<boolean> {
  return (await kget(dedupKey(contactId, status))) !== null
}

export async function markAsSent(
  contactId: string,
  status:    string,
  record:    SentConversionRecord,
): Promise<void> {
  await kset(dedupKey(contactId, status), JSON.stringify(record), TTL)
}

export async function getSentRecord(
  contactId: string,
  status:    string,
): Promise<SentConversionRecord | null> {
  const raw = await kget(dedupKey(contactId, status))
  if (!raw) return null
  return JSON.parse(raw) as SentConversionRecord
}
