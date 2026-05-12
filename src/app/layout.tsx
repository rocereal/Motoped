import type { Metadata } from 'next'
import Script from 'next/script'
import TrackingProvider from '@/components/providers/TrackingProvider'
import './globals.css'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ''

export const metadata: Metadata = {
  title: 'NIEVE Q-EN | Mașină Electrică 100% | Motoped.ro',
  description: 'NIEVE Q-EN — mașina electrică compactă de 2 locuri, perfectă pentru oraș. Zero emisii, autonomie 90–120 km, încărcare la orice priză. Dealer autorizat în Sibiu și Lunguletu. Test drive gratuit!',
  keywords: 'masina electrica, NIEVE Q-EN, microcar electric, masina electrica Romania, masina electrica Sibiu, masina electrica tineri, permis 16 ani, vehicul electric urban, Motoped',
  authors: [{ name: 'Motoped.ro' }],
  openGraph: {
    title: 'NIEVE Q-EN | Mașină Electrică 100% | Motoped.ro',
    description: 'Mașina electrică compactă de 2 locuri ideală pentru oraș. Autonomie 90–120 km, încărcare la orice priză, preț accesibil. Dealer autorizat NIEVE în România.',
    locale: 'ro_RO',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=PT+Sans:400,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap" />
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
      <body>
        {children}
        <TrackingProvider />
      </body>
      <Script id="fb-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init','${PIXEL_ID}');
        fbq('track','PageView');
      `}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </html>
  )
}
