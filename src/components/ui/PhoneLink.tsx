'use client'

import { generateUUID, getTracking, getOrCreateSessionId } from '@/lib/client-tracking'

interface Props {
  href:       string
  className?: string
  style?:     React.CSSProperties
  children:   React.ReactNode
}

export default function PhoneLink({ href, className, style, children }: Props) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const phone = href.replace('tel:', '').replace(/\s/g, '')
    console.log('[PhoneCallClicked] triggered', { phone })

    const eventId   = generateUUID()
    const sessionId = getOrCreateSessionId()
    const tracking  = getTracking()

    // Browser Pixel — same eventId as CAPI for deduplication
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any).fbq === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).fbq('track', 'Contact', {}, { eventID: eventId })
    }

    const payload = JSON.stringify({
      event_id:             eventId,
      session_id:           sessionId,
      clicked_phone_number: phone,
      tracking,
    })

    // sendBeacon is most reliable: queued by browser even after navigation
    if (typeof navigator.sendBeacon === 'function') {
      const ok = navigator.sendBeacon(
        '/api/tracking/phone-click',
        new Blob([payload], { type: 'application/json' }),
      )
      console.log('[PhoneCallClicked] Daktela contact request sent via sendBeacon', { ok })
    } else {
      console.log('[PhoneCallClicked] Daktela contact request sent via fetch')
      try {
        const res = await Promise.race([
          fetch('/api/tracking/phone-click', {
            method:    'POST',
            headers:   { 'Content-Type': 'application/json' },
            keepalive: true,
            body:      payload,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 2000),
          ),
        ])
        console.log('[PhoneCallClicked] Daktela contact request success', (res as Response).status)
      } catch (err) {
        console.error('[PhoneCallClicked] Daktela contact request error', err)
      }
    }

    window.location.href = href
  }

  return (
    <a href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  )
}
