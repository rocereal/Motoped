'use client'

interface Props {
  href: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export default function PhoneLink({ href, className, style, children }: Props) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      ;(window as any).fbq('track', 'Lead')
    }
  }

  return (
    <a href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  )
}
