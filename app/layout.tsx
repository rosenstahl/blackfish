// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// Components
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import CookieBanner from "@/app/components/common/CookieBanner";
import GlobalErrorBoundary from "./components/common/GlobalErrorBoundary";
import SkipLink from "@/app/components/common/SkipLink";
import { Analytics } from "@/app/components/analytics/Analytics";

// Providers
import { CookieConsentProvider } from "@/app/context/CookieConsentContext";
import { LoadingProvider } from "@/app/context/LoadingContext";
import { Providers } from './providers/Providers';

// Config & Utils
import defaultMetadata from "@/app/lib/metadata";
import { getOrganizationSchema } from '@/app/lib/schema';
import { inter, fontVariables } from '@/app/fonts/fonts';

// Metadata Configuration
export const metadata: Metadata = {
  ...defaultMetadata,
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#1a1a1a' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="de" 
      className={`scroll-smooth ${fontVariables}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema())
          }}
        />
        <link
          rel="preload"
          href="/fonts/Inter-roman.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body 
        className={`bg-gray-900 text-white antialiased min-h-screen selection:bg-primary-200 selection:text-primary-900`}
      >
        <Providers>
          <GlobalErrorBoundary>
            <CookieConsentProvider>
              <LoadingProvider>
                <Analytics />
                <SkipLink />
                <div className="relative flex min-h-screen flex-col">
                  <Header />
                  <main id="main-content" className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                  <CookieBanner />
                </div>
              </LoadingProvider>
            </CookieConsentProvider>
          </GlobalErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}