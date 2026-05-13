/**
 * KV store abstraction — backed by Neon PostgreSQL
 *
 * Env var: DATABASE_URL (Neon connection string with pooling enabled)
 *
 * Falls back to in-memory Map when DATABASE_URL is not set (local dev only —
 * data is NOT shared between serverless function invocations).
 *
 * Table (auto-created on first use):
 *   kv_store(key TEXT PK, value TEXT, expires_at TIMESTAMPTZ)
 *
 * List operations (klpush/klrange) store values as JSON arrays in the same table.
 */

import { neon } from '@neondatabase/serverless'
import type { NeonQueryFunction } from '@neondatabase/serverless'

// ── Neon client ───────────────────────────────────────────────────────────────

let _sql: NeonQueryFunction<false, false> | null = null
let _tableReady = false

function getSql(): NeonQueryFunction<false, false> | null {
  const url = process.env.DATABASE_URL
  if (!url) return null
  if (!_sql) _sql = neon(url)
  return _sql
}

async function ensureTable(): Promise<void> {
  if (_tableReady) return
  const sql = getSql()
  if (!sql) return
  await sql`
    CREATE TABLE IF NOT EXISTS kv_store (
      key        TEXT PRIMARY KEY,
      value      TEXT        NOT NULL,
      expires_at TIMESTAMPTZ
    )
  `
  _tableReady = true
}

// ── In-memory fallback (local dev) ────────────────────────────────────────────

interface MemEntry { v: string; exp: number }
const mem = new Map<string, MemEntry>()

function memGet(key: string): string | null {
  const e = mem.get(key)
  if (!e) return null
  if (e.exp < Date.now()) { mem.delete(key); return null }
  return e.v
}

function memSet(key: string, value: string, ttlSeconds: number): void {
  mem.set(key, { v: value, exp: Date.now() + ttlSeconds * 1000 })
}

function memDel(key: string): void { mem.delete(key) }

function memLpush(key: string, value: string, ttlSeconds: number): void {
  const raw = memGet(key)
  const arr: string[] = raw ? JSON.parse(raw) : []
  arr.unshift(value)
  memSet(key, JSON.stringify(arr), ttlSeconds)
}

function memLrange(key: string, limit: number): string[] {
  const raw = memGet(key)
  if (!raw) return []
  return (JSON.parse(raw) as string[]).slice(0, limit)
}

// ── Public API ────────────────────────────────────────────────────────────────

export function isKvAvailable(): boolean {
  return !!process.env.DATABASE_URL
}

const DEFAULT_TTL = 30 * 24 * 3600  // 30 days

export async function kset(key: string, value: string, ttlSeconds = DEFAULT_TTL): Promise<void> {
  const sql = getSql()
  if (!sql) { memSet(key, value, ttlSeconds); return }
  await ensureTable()
  await sql`
    INSERT INTO kv_store (key, value, expires_at)
    VALUES (${key}, ${value}, NOW() + (${ttlSeconds} * interval '1 second'))
    ON CONFLICT (key) DO UPDATE
      SET value      = EXCLUDED.value,
          expires_at = EXCLUDED.expires_at
  `
}

export async function kget(key: string): Promise<string | null> {
  const sql = getSql()
  if (!sql) return memGet(key)
  await ensureTable()
  const rows = await sql`
    SELECT value FROM kv_store
    WHERE key = ${key}
      AND (expires_at IS NULL OR expires_at > NOW())
  `
  return (rows[0]?.value as string) ?? null
}

export async function kdel(key: string): Promise<void> {
  const sql = getSql()
  if (!sql) { memDel(key); return }
  await ensureTable()
  await sql`DELETE FROM kv_store WHERE key = ${key}`
}

export async function klpush(key: string, value: string, ttlSeconds = DEFAULT_TTL): Promise<void> {
  const sql = getSql()
  if (!sql) { memLpush(key, value, ttlSeconds); return }
  await ensureTable()
  const rows = await sql`
    SELECT value FROM kv_store
    WHERE key = ${key}
      AND (expires_at IS NULL OR expires_at > NOW())
  `
  const current: string[] = rows[0]?.value ? JSON.parse(rows[0].value as string) : []
  current.unshift(value)
  await sql`
    INSERT INTO kv_store (key, value, expires_at)
    VALUES (${key}, ${JSON.stringify(current)}, NOW() + (${ttlSeconds} * interval '1 second'))
    ON CONFLICT (key) DO UPDATE
      SET value      = EXCLUDED.value,
          expires_at = EXCLUDED.expires_at
  `
}

export async function klrange(key: string, limit = 200): Promise<string[]> {
  const sql = getSql()
  if (!sql) return memLrange(key, limit)
  await ensureTable()
  const rows = await sql`
    SELECT value FROM kv_store
    WHERE key = ${key}
      AND (expires_at IS NULL OR expires_at > NOW())
  `
  if (!rows[0]?.value) return []
  return (JSON.parse(rows[0].value as string) as string[]).slice(0, limit)
}
