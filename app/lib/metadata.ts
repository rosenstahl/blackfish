import type { Metadata } from 'next'

const defaultMetadata: Metadata = {
  title: 'BLACKFISH.DIGITAL - Digitalagentur für nachhaltige Lösungen',
  description: 'Wir entwickeln individuelle digitale Lösungen für Ihr Unternehmen. Von Webdesign über E-Commerce bis hin zu Marketing-Automatisierung.',
  authors: [{ name: 'BLACKFISH.DIGITAL' }],
  robots: 'index, follow',
  applicationName: 'BLACKFISH.DIGITAL',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Digitalagentur',
    'Webentwicklung',
    'E-Commerce',
    'Marketing Automation',
    'SEO',
    'Dortmund'
  ],
  creator: 'BLACKFISH.DIGITAL',
  publisher: 'BLACKFISH.DIGITAL',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  metadataBase: new URL('https://blackfish.digital'),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'BLACKFISH.DIGITAL',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BLACKFISH.DIGITAL - Digitalagentur für nachhaltige Lösungen'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@blackfish_dig',
    creator: '@blackfish_dig'
  }
}

export default defaultMetadata