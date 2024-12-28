import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Components
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy loaded components
const Header = dynamic(() => import("@/app/components/layout/Header"), {
  ssr: true
});
const Footer = dynamic(() => import("@/app/components/layout/Footer"), {
  ssr: true
});
const CookieBanner = dynamic(() => import("@/app/components/common/CookieBanner"), {
  ssr: false
});
const SkipLink = dynamic(() => import("@/app/components/common/SkipLink"), {
  ssr: true
});

// Providers
import { Providers } from './providers/Providers';

// Config & Utils
import defaultMetadata from "@/app/lib/metadata";
import { getOrganizationSchema } from '@/app/lib/schema';

// Font Configuration with performance optimization
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

// Metadata Configuration
export const metadata: Metadata = {
  ...defaultMetadata,
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
  },
  verification: {
    google: 'google-site-verification=xyz', // Fügen Sie Ihre Verifizierung hinzu
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema())
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#1a1f36" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body 
        className={`${inter.className} bg-gray-900 text-white antialiased min-h-screen`}
      >
        <Providers>
          <Suspense fallback={null}>
            <SkipLink />
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-grow">
                {children}
              </main>
              <Footer />
              <CookieBanner />
            </div>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}