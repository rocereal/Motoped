import { kset, kget, klpush, klrange } from './store'
import type { PhoneClick } from './models'

const CLICK_TTL = 30 * 24 * 3600  // 30 days

function normalizePhoneForIndex(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.startsWith('0040')) return d.slice(2)
  if (d.startsWith('40') && d.length === 11) return d
  if (d.startsWith('0') && d.length === 10)  return '4' + d.slice(1)
  if (d.length === 9) return '40' + d
  return d
}

function clickKey(id: string): string {
  return `phoneclk:${id}`
}

function dateIndexKey(date: string): string {
  return `phoneclk_idx:${date}`
}

function phoneIndexKey(phone: string): string {
  return `phoneclk_phone:${normalizePhoneForIndex(phone)}`
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function savePhoneClick(click: PhoneClick): Promise<void> {
  await kset(clickKey(click.id), JSON.stringify(click), CLICK_TTL)
  await klpush(dateIndexKey(todayStr()), click.id, CLICK_TTL)
  // phone → latest click_id (for SmartBill / offline-conversion attribution)
  await kset(phoneIndexKey(click.clicked_phone_number), click.id, CLICK_TTL)

  console.log(
    `[PhoneClick] Saved id=${click.id}` +
    ` session=${click.session_id}` +
    ` phone=${click.clicked_phone_number}` +
    ` campaign=${click.campaign_name ?? '—'}`,
  )
}

export async function getPhoneClick(id: string): Promise<PhoneClick | null> {
  const raw = await kget(clickKey(id))
  if (!raw) return null
  return JSON.parse(raw) as PhoneClick
}

export async function getPhoneClickIdsByDate(date: string, limit = 500): Promise<string[]> {
  return klrange(dateIndexKey(date), limit)
}

export async function getLatestPhoneClickByCallerPhone(phone: string): Promise<PhoneClick | null> {
  const clickId = await kget(phoneIndexKey(phone))
  if (!clickId) return null
  return getPhoneClick(clickId)
}
