'use client'

import { generateUUID, getTracking } from '@/lib/client-tracking'

const PRODUCT = process.env.NEXT_PUBLIC_PRODUCT_NAME ?? 'NIEVE Q-EN'

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

    const eventId  = generateUUID()
    const tracking = getTracking()

    // Fire Meta Pixel (sync — same eventId used by CAPI for deduplication)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any).fbq === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).fbq('track', 'Contact', {}, { eventID: eventId })
    }

    const payload = JSON.stringify({
      eventName: 'PhoneCallClicked',
      eventId,
      customer:  { phone },
      interest:  { product: PRODUCT },
      tracking,
      sourceUrl: window.location.href,
    })

    // sendBeacon is the most reliable option: browser queues it even after navigation
    if (typeof navigator.sendBeacon === 'function') {
      const ok = navigator.sendBeacon(
        '/api/daktela/contact',
        new Blob([payload], { type: 'application/json' }),
      )
      console.log('[PhoneCallClicked] Daktela contact request sent via sendBeacon', { ok })
    } else {
      // Fallback: await fetch with a 2-second timeout so mobile doesn't hang
      console.log('[PhoneCallClicked] Daktela contact request sent via fetch')
      try {
        const res = await Promise.race([
          fetch('/api/daktela/contact', {
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

    // Open the tel: link after the request is guaranteed to be queued
    window.location.href = href
  }

  return (
    <a href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  )
}
