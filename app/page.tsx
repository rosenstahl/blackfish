import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

// Components
import PageLoadingIndicator from '@/app/components/common/PageLoadingIndicator'
import HeroSection from '@/app/components/home/HeroSection'

// Utils
import { Analytics } from '@/app/lib/analytics'
import { Performance } from '@/app/lib/performance-monitoring'

// Dynamically import heavy components with better loading states
const ServicesSection = dynamic(
  () => import('@/app/components/home/ServicesSection'),
  {
    loading: () => <PageLoadingIndicator />,
    ssr: true
  }
)

const TrustedBySection = dynamic(
  () => import('@/app/components/home/TrustedBySection'),
  {
    loading: () => <PageLoadingIndicator />,
    ssr: true
  }
)

const StatsSection = dynamic(
  () => import('@/app/components/home/StatsSection'),
  {
    loading: () => <PageLoadingIndicator />,
    ssr: true
  }
)

const DynamicPricingSection = dynamic(
  () => import('@/app/components/pricing/PricingSection'),
  {
    loading: () => (
      <div 
        className="h-screen bg-[#1a1f36] animate-pulse" 
        role="progressbar" 
        aria-label="Loading pricing section"
      />
    ),
    ssr: false
  }
)

const DynamicCallToAction = dynamic(
  () => import('@/app/components/home/CallToAction'),
  {
    loading: () => (
      <div 
        className="min-h-[400px] bg-[#1a1f36] animate-pulse" 
        role="progressbar"
        aria-label="Loading call to action section"
      />
    ),
    ssr: false
  }
)

// SEO & Metadata
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
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'BLACKFISH.DIGITAL Preview'
    }],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLACKFISH.DIGITAL - Digitalagentur',
    description: 'Ihre Full-Service Digitalagentur für digitalen Erfolg',
    images: ['/og-image.jpg'],
  }
}

export default function HomePage() {
  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [trustedRef, trustedInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  // Initialize Analytics & Performance monitoring
  useEffect(() => {
    const cleanup = Performance.initialize()
    Analytics.pageview('/')

    return () => {
      cleanup()
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
      <section 
        ref={servicesRef}
        id="services" 
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1f36] to-transparent" />
        {servicesInView && (
          <Suspense fallback={<PageLoadingIndicator />}>
            <ServicesSection />
          </Suspense>
        )}
      </section>

      {/* Trusted By / References */}
      <section 
        ref={trustedRef}
        id="trusted" 
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900 to-transparent" />
        {trustedInView && (
          <Suspense fallback={<PageLoadingIndicator />}>
            <TrustedBySection />
          </Suspense>
        )}
      </section>

      {/* Rest of the sections */}
      
      {/* Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "BLACKFISH.DIGITAL",
            "url": "https://blackfish.digital",
            "logo": {
              "@type": "ImageObject",
              "url": "https://blackfish.digital/logo.png",
              "width": "512",
              "height": "512"
            },
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
    </main>
  )
}