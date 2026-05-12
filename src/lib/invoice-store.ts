import { kset, kget, klpush, klrange } from './store'

const TTL = 2 * 365 * 24 * 3600  // 2 years

export interface ProcessedInvoice {
  invoice_id:   string
  client_name?: string
  phone?:       string
  email?:       string
  value:        number
  currency:     string
  issued_at?:   string

  campaign_name?:   string
  adset_name?:      string
  ad_name?:         string
  campaign_id?:     string
  adset_id?:        string
  ad_id?:           string
  fbclid?:          string
  fbp?:             string
  fbc?:             string
  tracking_source?: string  // 'phone_index' | 'none'

  meta_event_id?: string
  sent_to_meta:   boolean
  meta_error?:    string
  sent_at?:       string
  processed_at:   string
}

function recordKey(invoiceId: string): string { return `invoice:${invoiceId}` }
function indexKey(month: string): string       { return `invoice_idx:${month}` }

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7)  // YYYY-MM
}

export async function hasInvoiceBeenProcessed(invoiceId: string): Promise<boolean> {
  return (await kget(recordKey(invoiceId))) !== null
}

export async function getProcessedInvoice(invoiceId: string): Promise<ProcessedInvoice | null> {
  const raw = await kget(recordKey(invoiceId))
  if (!raw) return null
  return JSON.parse(raw) as ProcessedInvoice
}

export async function saveProcessedInvoice(record: ProcessedInvoice): Promise<void> {
  await kset(recordKey(record.invoice_id), JSON.stringify(record), TTL)
  await klpush(indexKey(currentMonth()), record.invoice_id, TTL)

  console.log(
    `[InvoiceStore] Saved invoice_id=${record.invoice_id}` +
    ` value=${record.value} ${record.currency}` +
    ` sent_to_meta=${record.sent_to_meta}` +
    ` campaign="${record.campaign_name ?? '—'}"`,
  )
}

export async function getInvoiceIdsForMonth(month: string, limit = 200): Promise<string[]> {
  return klrange(indexKey(month), limit)
}
