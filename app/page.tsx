import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Analytics } from '@/app/lib/analytics'
import { Performance } from '@/app/lib/performance-monitoring'
import { Suspense, useEffect } from 'react'
import PageLoadingIndicator from '@/app/components/common/PageLoadingIndicator'
import HeroSection from '@/app/components/home/HeroSection'
import ServicesSection from '@/app/components/home/ServicesSection'
import TrustedBySection from '@/app/components/home/TrustedBySection'
import StatsSection from '@/app/components/home/StatsSection'

// Dynamically import heavier components
const DynamicPricingSection = dynamic(
  () => import('@/app/components/pricing/PricingSection'),
  {
    loading: () => (
      <div className="h-screen bg-[#1a1f36] animate-pulse" role="progressbar" />
    ),
    ssr: false
  }
)

const DynamicCallToAction = dynamic(
  () => import('@/app/components/home/CallToAction'),
  {
    loading: () => (
      <div className="min-h-[400px] bg-[#1a1f36] animate-pulse" role="progressbar" />
    ),
    ssr: false
  }
)

// Metadata
export const metadata: Metadata = {
  title: 'BLACKFISH.DIGITAL - Digitalagentur für nachhaltigen Erfolg',
  description: 'Ihre Full-Service Digitalagentur für Webdesign, Marketing, SEO & Branding. ✓ Express Service ✓ Transparente Preise ✓ Messbarer Erfolg',
  keywords: [
    'Digitalagentur',
    'Webdesign',
    'Digital Marketing',
    'SEO',
    'Branding',
    'Dortmund'
  ],
  openGraph: {
    title: 'BLACKFISH.DIGITAL - Digitalagentur',
    description: 'Ihre Full-Service Digitalagentur für digitalen Erfolg',
    images: ['/og-image.jpg'],
  },
}

export default function HomePage() {
  // Initialize Analytics & Performance monitoring
  useEffect(() => {
    Analytics.pageview('/')
    Performance.measurePageLoad()
    Performance.trackResources()

    return () => {
      Performance.cleanup()
    }
  }, [])

  return (
    <main className="relative">
      {/* Base Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-[#1a1f36] -z-10" />
      
      {/* Hero Section */}
      <section className="relative">
        <Suspense fallback={<PageLoadingIndicator />}>
          <HeroSection />
        </Suspense>
      </section>

      {/* Services Section */}
      <section id="services" className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1f36] to-transparent" />
        <Suspense fallback={<PageLoadingIndicator />}>
          <ServicesSection />
        </Suspense>
      </section>

      {/* Trusted By / References */}
      <section id="trusted" className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900 to-transparent" />
        <Suspense fallback={<PageLoadingIndicator />}>
          <TrustedBySection />
        </Suspense>
      </section>

      {/* Statistics */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1f36]" />
        <Suspense fallback={<PageLoadingIndicator />}>
          <StatsSection />
        </Suspense>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative">
        <Suspense fallback={<PageLoadingIndicator />}>
          <DynamicPricingSection />
        </Suspense>
      </section>

      {/* Call to Action */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f36] to-gray-900" />
        <Suspense fallback={<PageLoadingIndicator />}>
          <DynamicCallToAction />
        </Suspense>
      </section>

      {/* Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "BLACKFISH.DIGITAL",
            "url": "https://blackfish.digital",
            "logo": "https://blackfish.digital/logo.png",
            "description": "Full-Service Digitalagentur für Webdesign, Marketing & Branding",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Rheinische Straße 220",
              "addressLocality": "Dortmund",
              "postalCode": "44147",
              "addressCountry": "DE"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+49-173-8528482",
              "contactType": "customer service",
              "availableLanguage": ["German", "English", "Turkish"]
            },
            "sameAs": [
              "https://instagram.com/blackfish.digital"
            ]
          })
        }}
      />

      {/* SEO Content */}
      <div className="sr-only">
        <h1>BLACKFISH.DIGITAL - Digitalagentur in Dortmund</h1>
        <p>
          BLACKFISH.DIGITAL ist Ihre Full-Service Digitalagentur für:
          - Professionelles Webdesign
          - Digitales Marketing
          - Suchmaschinenoptimierung (SEO)
          - Branding & Corporate Design
          - App-Entwicklung
          - Software-Lösungen
        </p>
      </div>
    </main>
  )
}