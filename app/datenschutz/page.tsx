import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Analytics } from '@/app/lib/analytics'
import { useEffect } from 'react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | BLACKFISH.DIGITAL',
  description: 'Datenschutzerklärung von BLACKFISH.DIGITAL - Ihre Full-Service Digitalagentur',
  robots: {
    index: true,
    follow: true,
  },
}

export default function DatenschutzPage() {
  const { t } = useTranslation()

  useEffect(() => {
    Analytics.pageview('/datenschutz')
  }, [])

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
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
              {t('privacy.title', 'Datenschutzerklärung')}
            </h1>
          </header>
          
          <div className="space-y-8 text-gray-300">
            <section id="overview" aria-labelledby="overview-title">
              <h2 id="overview-title" className="text-2xl font-semibold text-white mb-4">
                1. {t('privacy.sections.overview.title', 'Datenschutz auf einen Blick')}
              </h2>
              <h3 className="text-xl font-medium text-white mb-2">
                {t('privacy.sections.overview.general.title', 'Allgemeine Hinweise')}
              </h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen. 
                Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert 
                werden können.
              </p>
            </section>

            <section id="responsible" aria-labelledby="responsible-title">
              <h2 id="responsible-title" className="text-2xl font-semibold text-white mb-4">
                2. {t('privacy.sections.responsible.title', 'Allgemeine Hinweise und Pflichtinformationen')}
              </h2>
              <h3 className="text-xl font-medium text-white mb-2">
                {t('privacy.sections.responsible.operator.title', 'Verantwortlicher')}
              </h3>
              <address className="not-italic">
                BLACKFISH.DIGITAL<br />
                Rheinische Straße 220<br />
                44147 Dortmund<br />
                <Link href="tel:+4917385284821" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Telefon: +49 (0) 173 8528482
                </Link><br />
                <Link href="mailto:info@blackfish.digital" className="text-blue-400 hover:text-blue-300 transition-colors">
                  E-Mail: info@blackfish.digital
                </Link>
              </address>
            </section>

            <section id="data-collection" aria-labelledby="data-collection-title">
              <h2 id="data-collection-title" className="text-2xl font-semibold text-white mb-4">
                3. {t('privacy.sections.dataCollection.title', 'Datenerfassung auf dieser Website')}
              </h2>
              <h3 className="text-xl font-medium text-white mb-2">
                {t('privacy.sections.dataCollection.cookies.title', 'Cookies')}
              </h3>
              <div className="space-y-4">
                <p>
                  Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, 
                  die auf Ihrem Endgerät gespeichert werden. Diese Cookies helfen uns dabei, 
                  Ihr Nutzererlebnis zu verbessern und unsere Website zu optimieren.
                </p>
                <p>
                  Sie können Ihre Browser-Einstellungen so anpassen, dass Sie über das Setzen 
                  von Cookies informiert werden und einzeln über deren Annahme entscheiden.
                </p>
              </div>
            </section>

            <section id="analytics" aria-labelledby="analytics-title">
              <h2 id="analytics-title" className="text-2xl font-semibold text-white mb-4">
                4. {t('privacy.sections.analytics.title', 'Analyse-Tools und Werbung')}
              </h2>
              <h3 className="text-xl font-medium text-white mb-2">
                {t('privacy.sections.analytics.googleAnalytics.title', 'Google Analytics')}
              </h3>
              <p>
                Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Diese 
                Verarbeitung erfolgt auf Grundlage unserer berechtigten Interessen an einer 
                statistischen Analyse des Nutzerverhaltens zu Optimierungs- und Marketingzwecken.
              </p>
            </section>

            <section id="newsletter" aria-labelledby="newsletter-title">
              <h2 id="newsletter-title" className="text-2xl font-semibold text-white mb-4">
                5. {t('privacy.sections.newsletter.title', 'Newsletter')}
              </h2>
              <p>
                Wenn Sie unseren Newsletter abonnieren, werden die von Ihnen angegebenen Daten 
                ausschließlich für diesen Zweck verwendet. Abonnenten können auch über Umstände 
                per E-Mail informiert werden, die für den Dienst oder die Registrierung relevant sind.
              </p>
            </section>

            <section id="plugins" aria-labelledby="plugins-title">
              <h2 id="plugins-title" className="text-2xl font-semibold text-white mb-4">
                6. {t('privacy.sections.plugins.title', 'Plugins und Tools')}
              </h2>
              <h3 className="text-xl font-medium text-white mb-2">
                {t('privacy.sections.plugins.webfonts.title', 'Google Web Fonts')}
              </h3>
              <p>
                Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte 
                Web Fonts. Beim Aufruf einer Seite lädt Ihr Browser die benötigten Web Fonts 
                in ihren Browsercache.
              </p>
            </section>

            <section id="rights" aria-labelledby="rights-title">
              <h2 id="rights-title" className="text-2xl font-semibold text-white mb-4">
                7. {t('privacy.sections.rights.title', 'Ihre Rechte')}
              </h2>
              <div className="space-y-4">
                <p>{t('privacy.sections.rights.intro', 'Sie haben folgende Rechte:')}</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t('privacy.sections.rights.list.info', 'Recht auf Auskunft')}</li>
                  <li>{t('privacy.sections.rights.list.correction', 'Recht auf Berichtigung oder Löschung')}</li>
                  <li>{t('privacy.sections.rights.list.restriction', 'Recht auf Einschränkung der Verarbeitung')}</li>
                  <li>{t('privacy.sections.rights.list.objection', 'Recht auf Widerspruch gegen die Verarbeitung')}</li>
                  <li>{t('privacy.sections.rights.list.portability', 'Recht auf Datenübertragbarkeit')}</li>
                </ul>
              </div>
            </section>

            <section id="changes" aria-labelledby="changes-title">
              <h2 id="changes-title" className="text-2xl font-semibold text-white mb-4">
                8. {t('privacy.sections.changes.title', 'Änderung der Datenschutzerklärung')}
              </h2>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets 
                den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer 
                Leistungen umzusetzen.
              </p>
            </section>

            <footer className="pt-8">
              <p className="text-sm text-gray-400">
                {t('privacy.footer.lastUpdated', 'Stand')}: {t('privacy.footer.date', 'Dezember 2024')}<br />
                BLACKFISH.DIGITAL
              </p>
            </footer>
          </div>
        </motion.article>
      </div>
    </main>
  )
}