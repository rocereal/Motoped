import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wheels - E-Bike SS-100',
  description: 'Smart & Connected E-BIKE SS-100 - Power Packed Electric Performance',
  icons: { icon: '/images/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/animate.css" />
        <link rel="stylesheet" href="/css/fontawesome.min.css" />
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/css/bootstrap5.css" />
        <link rel="stylesheet" href="/css/bootstrap.min5.css" />
        <link rel="stylesheet" href="/css/fancybox/jquery.fancybox.min.css" />
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/responsive.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
