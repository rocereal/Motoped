/**
 * KV store abstraction
 *
 * Production: Upstash Redis REST API
 *   Env vars: KV_REST_API_URL + KV_REST_API_TOKEN
 *   (Vercel KV sets these automatically when you connect a KV database)
 *
 * Dev / fallback: in-memory Map — NOT persisted across cold starts
 */

const KV_URL   = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN

// ── In-memory fallback ────────────────────────────────────────────────────────

interface MemEntry { v: string; exp: number }
const mem = new Map<string, MemEntry>()

function memGet(key: string): string | null {
  const e = mem.get(key)
  if (!e) return null
  if (e.exp < Date.now()) { mem.delete(key); return null }
  return e.v
}

function memSet(key: string, value: string, ttl: number): void {
  mem.set(key, { v: value, exp: Date.now() + ttl * 1000 })
}

function memDel(key: string): void { mem.delete(key) }

function memLrange(key: string, start: number, stop: number): string[] {
  const raw = memGet(key)
  if (!raw) return []
  const arr: string[] = JSON.parse(raw)
  const end = stop === -1 ? arr.length : stop + 1
  return arr.slice(start, end)
}

function memLpush(key: string, value: string, ttl: number): void {
  const raw = memGet(key)
  const arr: string[] = raw ? JSON.parse(raw) : []
  arr.unshift(value)
  memSet(key, JSON.stringify(arr), ttl)
}

// ── Upstash REST ──────────────────────────────────────────────────────────────

async function kvExec(command: unknown[]): Promise<unknown> {
  const res = await fetch(KV_URL!, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${KV_TOKEN!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })
  const json = (await res.json()) as { result: unknown; error?: string }
  if (json.error) throw new Error(`KV error: ${json.error}`)
  return json.result
}

// ── Public API ────────────────────────────────────────────────────────────────

export function isKvAvailable(): boolean {
  return !!(KV_URL && KV_TOKEN)
}

const DEFAULT_TTL = 30 * 24 * 3600  // 30 days

export async function kset(key: string, value: string, ttl = DEFAULT_TTL): Promise<void> {
  if (isKvAvailable()) {
    await kvExec(['SET', key, value, 'EX', String(ttl)])
  } else {
    memSet(key, value, ttl)
  }
}

export async function kget(key: string): Promise<string | null> {
  if (isKvAvailable()) {
    return (await kvExec(['GET', key])) as string | null
  }
  return memGet(key)
}

export async function kdel(key: string): Promise<void> {
  if (isKvAvailable()) {
    await kvExec(['DEL', key])
  } else {
    memDel(key)
  }
}

export async function klpush(key: string, value: string, ttl = DEFAULT_TTL): Promise<void> {
  if (isKvAvailable()) {
    await kvExec(['LPUSH', key, value])
    await kvExec(['EXPIRE', key, String(ttl)])
  } else {
    memLpush(key, value, ttl)
  }
}

export async function klrange(key: string, limit = 200): Promise<string[]> {
  if (isKvAvailable()) {
    return (await kvExec(['LRANGE', key, '0', String(limit - 1)])) as string[]
  }
  return memLrange(key, 0, limit - 1)
}
