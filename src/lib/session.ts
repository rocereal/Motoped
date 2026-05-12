import { kset, kget } from './store'
import type { TrackingSession } from './models'

const SESSION_TTL = 7 * 24 * 3600  // 7 days

function key(sessionId: string): string {
  return `session:${sessionId}`
}

export async function saveSession(session: TrackingSession): Promise<void> {
  await kset(key(session.session_id), JSON.stringify(session), SESSION_TTL)
  console.log(
    `[Session] Persisted session_id=${session.session_id}` +
    ` utm_source=${session.utm_source ?? '—'}` +
    ` campaign=${session.campaign_name ?? '—'}`,
  )
}

export async function getSession(sessionId: string): Promise<TrackingSession | null> {
  const raw = await kget(key(sessionId))
  if (!raw) return null
  return JSON.parse(raw) as TrackingSession
}

export async function upsertSession(
  sessionId: string,
  data: Omit<TrackingSession, 'session_id' | 'created_at' | 'updated_at'>,
  ipAddress?: string,
  userAgent?: string,
): Promise<TrackingSession> {
  const existing = await getSession(sessionId)
  const now = new Date().toISOString()

  const session: TrackingSession = {
    ...(existing ?? {}),
    ...data,
    session_id: sessionId,
    created_at: existing?.created_at ?? now,
    updated_at: now,
    ip_address: ipAddress ?? existing?.ip_address,
    user_agent: userAgent ?? existing?.user_agent,
  }

  await saveSession(session)
  return session
}
