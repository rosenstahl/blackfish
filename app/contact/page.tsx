import { Metadata } from 'next'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Analytics } from '@/app/lib/analytics'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import PageLoadingIndicator from '@/app/components/common/PageLoadingIndicator'

// Dynamic import of contact form to reduce initial bundle size
const DynamicContactForm = dynamic(
  () => import('@/app/components/contact/ContactForm'),
  {
    loading: () => (
      <div className="h-[600px] bg-gray-800/20 rounded-lg animate-pulse" />
    ),
    ssr: false
  }
)

// Metadata
export const metadata: Metadata = {
  title: 'Kontakt | BLACKFISH.DIGITAL',
  description: 'Kontaktieren Sie BLACKFISH.DIGITAL - Ihre Full-Service Digitalagentur in Dortmund. Wir beraten Sie gerne zu Webdesign, Marketing und digitalen Lösungen.',
  openGraph: {
    title: 'Kontakt BLACKFISH.DIGITAL',
    description: 'Kontaktieren Sie uns für Ihre digitale Transformation',
    images: ['/contact-og.jpg'],
  },
}

// Contact information
const contactInfo = [
  {
    icon: Phone,
    title: 'Telefon',
    value: '+49 (0) 173 8528482',
    href: 'tel:+491738528482',
    type: 'phone'
  },
  {
    icon: Mail,
    title: 'E-Mail',
    value: 'info@blackfish.digital',
    href: 'mailto:info@blackfish.digital',
    type: 'email'
  },
  {
    icon: MapPin,
    title: 'Adresse',
    value: 'Rheinische Straße 220\n44147 Dortmund',
    href: 'https://maps.google.com/?q=Rheinische+Straße+220,44147+Dortmund',
    type: 'address'
  }
]

export default function ContactPage() {
  useEffect(() => {
    Analytics.pageview('/contact')
  }, [])

  const handleContactClick = (type: string) => {
    Analytics.event({
      action: 'contact_info_click',
      category: 'Contact',
      label: type
    })
  }

  return (
    <main 
      className="min-h-screen bg-[#1a1f36]"
      itemScope 
      itemType="https://schema.org/ContactPage"
    >
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <header className="text-center mb-12">
            <motion.h1 
              className="text-4xl font-bold text-white mb-8"
              itemProp="name"
            >
              Kontaktieren Sie uns
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-center mb-12 text-lg"
              itemProp="description"
            >
              Wir freuen uns darauf, von Ihnen zu hören. 
              Unser Team steht Ihnen für Fragen zur Verfügung.
            </motion.p>
          </header>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              {contactInfo.map((info) => (
                <motion.div
                  key={info.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4"
                  itemProp={info.type === 'address' ? 'address' : undefined}
                  itemScope={info.type === 'address' ? true : undefined}
                  itemType={info.type === 'address' ? 'https://schema.org/PostalAddress' : undefined}
                >
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <info.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      {info.title}
                    </h3>
                    <a
                      href={info.href}
                      onClick={() => handleContactClick(info.type)}
                      className="text-gray-400 hover:text-white transition-colors whitespace-pre-line"
                      target={info.type === 'address' ? '_blank' : undefined}
                      rel={info.type === 'address' ? 'noopener noreferrer' : undefined}
                      itemProp={
                        info.type === 'email' ? 'email' :
                        info.type === 'phone' ? 'telephone' :
                        info.type === 'address' ? 'streetAddress' :
                        undefined
                      }
                    >
                      {info.value}
                    </a>
                  </div>
                </motion.div>
              ))}

              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-12 p-6 bg-gray-800/30 rounded-lg"
                itemProp="openingHours"
              >
                <h3 className="text-white font-medium mb-4">Geschäftszeiten</h3>
                <div className="space-y-2 text-gray-400">
                  <p>Montag - Freitag: 9:00 - 18:00 Uhr</p>
                  <p>Samstag & Sonntag: Nach Vereinbarung</p>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <Suspense fallback={<PageLoadingIndicator />}>
              <DynamicContactForm />
            </Suspense>
          </div>
        </motion.div>
      </div>

      {/* Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Kontakt BLACKFISH.DIGITAL",
            "description": "Kontaktieren Sie BLACKFISH.DIGITAL für Ihre digitale Transformation",
            "mainEntity": {
              "@type": "Organization",
              "name": "BLACKFISH.DIGITAL",
              "telephone": "+49-173-8528482",
              "email": "info@blackfish.digital",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rheinische Straße 220",
                "addressLocality": "Dortmund",
                "postalCode": "44147",
                "addressCountry": "DE"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              }
            }
          })
        }}
      />
    </main>
  )
}