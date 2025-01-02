import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Analytics } from '@/app/lib/analytics'
import { useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'

export const metadata: Metadata = {
  title: 'Impressum | BLACKFISH.DIGITAL',
  description: 'Impressum und rechtliche Informationen von BLACKFISH.DIGITAL',
  robots: {
    index: true,
    follow: true,
  },
}

const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BLACKFISH.DIGITAL",
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
    "contactType": "customer service"
  }
}

export default function ImpressumPage() {
  const { t } = useTranslation()

  useEffect(() => {
    Analytics.pageView('/impressum')
  }, [])

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      
      <main className="min-h-screen bg-[#1a1f36]">
        <div className="container mx-auto px-4 py-24">
          <motion.article 
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={fadeIn.transition}
            className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
          >
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-white">
                {t('imprint.title', 'Impressum')}
              </h1>
            </header>
            
            <div className="space-y-8 text-gray-300">
              <section aria-labelledby="company-info">
                <h2 id="company-info" className="text-2xl font-semibold text-white mb-4">
                  {t('imprint.sections.info.title', 'Angaben gemäß § 5 TMG')}
                </h2>
                <address className="not-italic">
                  BLACKFISH.DIGITAL<br />
                  Rheinische Straße 220<br />
                  44147 Dortmund<br />
                  Deutschland
                </address>
              </section>

              <section aria-labelledby="contact-info">
                <h2 id="contact-info" className="text-2xl font-semibold text-white mb-4">
                  {t('imprint.sections.contact.title', 'Kontakt')}
                </h2>
                <div className="space-y-2">
                  <p>
                    <Link 
                      href="tel:+4917385284821"
                      onClick={() => Analytics.event({
                        action: 'click_phone',
                        category: 'Contact',
                        label: 'Impressum'
                      })}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Telefon: +49 (0) 173 8528482
                    </Link>
                  </p>
                  <p>
                    <Link 
                      href="mailto:info@blackfish.digital"
                      onClick={() => Analytics.event({
                        action: 'click_email',
                        category: 'Contact',
                        label: 'Impressum'
                      })}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      E-Mail: info@blackfish.digital
                    </Link>
                  </p>
                </div>
              </section>

              <section aria-labelledby="tax-info">
                <h2 id="tax-info" className="text-2xl font-semibold text-white mb-4">
                  {t('imprint.sections.tax.title', 'Umsatzsteuer')}
                </h2>
                <p>
                  Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                  DE123456789
                </p>
              </section>

              <section aria-labelledby="professional-info">
                <h2 id="professional-info" className="text-2xl font-semibold text-white mb-4">
                  {t('imprint.sections.professional.title', 'Berufsbezeichnung und berufsrechtliche Regelungen')}
                </h2>
                <div className="space-y-2">
                  <p>Berufsbezeichnung: Digitalagentur</p>
                  <p>Zuständige Kammer: IHK Dortmund</p>
                </div>
              </section>

              <section aria-labelledby="responsibility-info">
                <h2 id="responsibility-info" className="text-2xl font-semibold text-white mb-4">
                  {t('imprint.sections.responsibility.title', 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV')}
                </h2>
                <address className="not-italic">
                  Max Mustermann<br />
                  Rheinische Straße 220<br />
                  44147 Dortmund
                </address>
              </section>

              <section aria-labelledby="dispute-resolution">
                <h2 id="dispute-resolution" className="text-2xl font-semibold text-white mb-4">
                  {t('imprint.sections.dispute.title', 'Streitschlichtung')}
                </h2>
                <div className="space-y-4">
                  <p>
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) 
                    bereit:{' '}
                    <Link 
                      href="https://ec.europa.eu/consumers/odr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      https://ec.europa.eu/consumers/odr
                    </Link>
                    <br />
                    Unsere E-Mail-Adresse finden Sie oben im Impressum.
                  </p>
                  <p>
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>
              </section>
            </div>
          </motion.article>
        </div>
      </main>
    </>
  )
}