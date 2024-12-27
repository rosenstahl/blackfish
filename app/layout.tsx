// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Components
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import CookieBanner from "@/app/components/common/CookieBanner";
import GlobalErrorBoundary from "./components/common/GlobalErrorBoundary";
import SkipLink from "@/app/components/common/SkipLink";

// Providers
import { CookieConsentProvider } from "@/app/context/CookieConsentContext";
import { LoadingProvider } from "@/app/context/LoadingContext";
import { Providers } from './providers/Providers';

// Config & Utils
import defaultMetadata from "@/app/lib/metadata";
import { getOrganizationSchema } from '@/app/lib/schema';

// Font Configuration
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap'
});

// Metadata Configuration
export const metadata: Metadata = defaultMetadata;

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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body 
        className={`${inter.className} bg-gray-900 text-white antialiased min-h-screen`}
      >
        <Providers>
          <GlobalErrorBoundary>
            <CookieConsentProvider>
              <LoadingProvider>
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