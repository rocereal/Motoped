/**
 * SmartBill REST API client
 * Docs: https://ws.smartbill.ro/SBORO/api/
 * Auth: Basic base64(email:token)
 * Env:  SMARTBILL_EMAIL, SMARTBILL_TOKEN, SMARTBILL_CIF
 */

const BASE_URL = 'https://ws.smartbill.ro/SBORO/api'

function authHeader(): string {
  const email = process.env.SMARTBILL_EMAIL ?? ''
  const token = process.env.SMARTBILL_TOKEN ?? ''
  return 'Basic ' + Buffer.from(`${email}:${token}`).toString('base64')
}

function missingConfig(): boolean {
  return !process.env.SMARTBILL_EMAIL || !process.env.SMARTBILL_TOKEN || !process.env.SMARTBILL_CIF
}

function cif(): string { return process.env.SMARTBILL_CIF ?? '' }

async function sbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const qs  = new URLSearchParams({ cif: cif(), ...params }).toString()
  const url = `${BASE_URL}${path}?${qs}`

  const res  = await fetch(url, { headers: { Authorization: authHeader(), Accept: 'application/json' } })
  const text = await res.text()

  if (!res.ok) throw new Error(`SmartBill ${res.status} on ${path}: ${text.slice(0, 300)}`)

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(`SmartBill non-JSON on ${path}: ${text.slice(0, 200)}`)
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SmartBillClient {
  name?:    string
  email?:   string
  phone?:   string
  vatCode?: string
  address?: string
  city?:    string
  county?:  string
}

export interface SmartBillInvoice {
  companyVatCode: string
  seriesName:     string
  number:         string
  issueDate:      string
  dueDate?:       string
  client:         SmartBillClient
  totalAmount:    number
  totalVAT?:      number
  currency:       string
  isDraft:        boolean
}

interface InvoiceListResponse {
  errorMessage?: string | null
  invoices?:     SmartBillInvoice[]
}

interface PaymentStatusResponse {
  errorMessage?:  string | null
  invoiceIsPaid?: boolean
  totalPaid?:     number
  totalToPay?:    number
}

// ── Public API ────────────────────────────────────────────────────────────────

export function invoiceId(inv: SmartBillInvoice): string {
  return `${inv.seriesName}-${inv.number}`
}

export async function listInvoices(startDate: string, endDate: string): Promise<SmartBillInvoice[]> {
  if (missingConfig()) {
    console.warn('[SmartBill] Missing config — skipping')
    return []
  }
  const data = await sbFetch<InvoiceListResponse>('/invoice/get', { startDate, endDate })
  if (data.errorMessage) throw new Error(`SmartBill API: ${data.errorMessage}`)
  return (data.invoices ?? []).filter(inv => !inv.isDraft)
}

export async function getPaymentStatus(seriesName: string, number: string): Promise<PaymentStatusResponse> {
  return sbFetch<PaymentStatusResponse>('/invoice/paymentstatus', { seriesname: seriesName, number })
}

export async function listPaidInvoices(startDate: string, endDate: string): Promise<SmartBillInvoice[]> {
  const all     = await listInvoices(startDate, endDate)
  const results: SmartBillInvoice[] = []

  for (const inv of all) {
    try {
      const status = await getPaymentStatus(inv.seriesName, inv.number)
      if (status.invoiceIsPaid === true) results.push(inv)
    } catch (err) {
      console.error(`[SmartBill] Payment status check failed for ${invoiceId(inv)}:`, (err as Error).message)
    }
  }

  console.log(`[SmartBill] ${startDate}→${endDate}: ${all.length} invoices, ${results.length} paid`)
  return results
}
