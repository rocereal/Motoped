'use client'

import { fireTrackingEvent } from '@/lib/client-tracking'

interface Props {
  href:       string
  className?: string
  style?:     React.CSSProperties
  children:   React.ReactNode
}

export default function PhoneLink({ href, className, style, children }: Props) {
  const handleClick = () => {
    const phone = href.replace('tel:', '').replace(/\s/g, '')
    fireTrackingEvent(
      'PhoneCallClicked',
      { phone },
      { product: process.env.NEXT_PUBLIC_PRODUCT_NAME ?? 'NIEVE Q-EN' },
    )
  }

  return (
    <a href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  )
}
