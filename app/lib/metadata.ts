// app/lib/metadata.ts
import type { Metadata } from 'next'

const defaultMetadata: Metadata = {
  title: {
    default: 'BLACKFISH.DIGITAL - Digitalagentur für nachhaltigen Erfolg',
    template: '%s | BLACKFISH.DIGITAL'
  },
  description: 'Ihre Full-Service Digitalagentur für Webdesign, Marketing, SEO & Branding. ✓ Express Service ✓ Transparente Preise ✓ Messbarer Erfolg',
  keywords: [
    'Digitalagentur',
    'Webdesign',
    'Digital Marketing',
    'SEO',
    'Branding',
    'App Development',
    'Software Solutions',
    'Online Marketing',
    'Website Entwicklung',
    'Digital Transformation'
  ],
  authors: [{ name: 'BLACKFISH.DIGITAL' }],
  creator: 'BLACKFISH.DIGITAL',
  publisher: 'BLACKFISH.DIGITAL',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://blackfish.digital'),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://blackfish.digital',
    title: 'BLACKFISH.DIGITAL - Digitalagentur für nachhaltigen Erfolg',
    description: 'Ihre Full-Service Digitalagentur für Webdesign, Marketing, SEO & Branding',
    siteName: 'BLACKFISH.DIGITAL',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BLACKFISH.DIGITAL Preview'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLACKFISH.DIGITAL - Digitalagentur für nachhaltigen Erfolg',
    description: 'Ihre Full-Service Digitalagentur für Webdesign, Marketing, SEO & Branding',
    images: ['/twitter-image.jpg'],
    creator: '@blackfishdigital',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'google-site-verification-code',
  }
}

export default defaultMetadata