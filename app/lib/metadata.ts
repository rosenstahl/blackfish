import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'BLACKFISH.DIGITAL - Innovative Digital Solutions',
    template: '%s | BLACKFISH.DIGITAL'
  },
  description: 'BLACKFISH.DIGITAL bietet innovative digitale Lösungen für moderne Unternehmen. Expertise in Web-Entwicklung, Design und digitaler Transformation.',
  keywords: ['digital agency', 'web development', 'design', 'digital transformation', 'innovation'],
  authors: [{ name: 'BLACKFISH.DIGITAL' }],
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
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  alternates: {
    canonical: 'https://blackfish.digital',
    languages: {
      'de-DE': 'https://blackfish.digital/de',
      'en-US': 'https://blackfish.digital/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://blackfish.digital',
    title: 'BLACKFISH.DIGITAL',
    description: 'Innovative Digital Solutions for Modern Businesses',
    siteName: 'BLACKFISH.DIGITAL',
    images: [
      {
        url: 'https://blackfish.digital/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BLACKFISH.DIGITAL Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLACKFISH.DIGITAL',
    description: 'Innovative Digital Solutions for Modern Businesses',
    creator: '@blackfishdigital',
    images: ['https://blackfish.digital/twitter-image.jpg'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
};

export function generateMetadata({
  title,
  description,
  images,
  noIndex,
}: {
  title?: string;
  description?: string;
  images?: string[];
  noIndex?: boolean;
}): Metadata {
  return {
    ...defaultMetadata,
    title: title,
    description: description,
    robots: noIndex ? { index: false, follow: false } : defaultMetadata.robots,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title || defaultMetadata.openGraph?.title,
      description: description || defaultMetadata.openGraph?.description,
      images: images ? images.map(url => ({ url })) : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title || defaultMetadata.twitter?.title,
      description: description || defaultMetadata.twitter?.description,
      images: images || defaultMetadata.twitter?.images,
    },
  };
}