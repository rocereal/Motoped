import { NextRequest, NextResponse } from 'next/server'
import { TrackingSessionPayloadSchema } from '@/lib/validation'
import { upsertSession } from '@/lib/session'
import { isKvAvailable } from '@/lib/store'

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = TrackingSessionPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
  }

  const { session_id, ...rest } = parsed.data

  // Acknowledge immediately — this is fire-and-forget from the browser
  const response = NextResponse.json({ ok: true, kv: isKvAvailable() })

  const clientIp  = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined
  const userAgent = req.headers.get('user-agent') ?? undefined

  upsertSession(session_id, rest, clientIp, userAgent).catch((err: Error) => {
    console.error('[Session] Persist failed:', err.message)
  })

  return response
}
