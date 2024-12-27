import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Analytics } from '@/app/lib/analytics'
import { useEffect } from 'react'

export const metadata: Metadata = {
  title: 'AGB | BLACKFISH.DIGITAL',
  description: 'Allgemeine Geschäftsbedingungen von BLACKFISH.DIGITAL - Ihre Full-Service Digitalagentur',
  robots: {
    index: true,
    follow: true,
  },
}

export default function AGBPage() {
  const { t } = useTranslation()

  useEffect(() => {
    Analytics.pageview('/agb')
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
              {t('agb.title', 'Allgemeine Geschäftsbedingungen')}
            </h1>
            <p className="mt-4 text-gray-300">
              Stand: {t('agb.lastUpdate', 'Dezember 2024')}
            </p>
          </header>
          
          <div className="space-y-8 text-gray-300">
            <section id="scope" aria-labelledby="scope-title">
              <h2 id="scope-title" className="text-2xl font-semibold text-white mb-4">
                §1 {t('agb.sections.scope.title', 'Geltungsbereich')}
              </h2>
              <p>
                Diese Geschäftsbedingungen gelten für alle Verträge zwischen BLACKFISH.DIGITAL, 
                Rheinische Straße 220, 44147 Dortmund (nachfolgend "Agentur") und ihren 
                Auftraggebern (nachfolgend "Kunde"), soweit nicht etwas anderes ausdrücklich 
                vereinbart wurde.
              </p>
            </section>

            <section id="contract" aria-labelledby="contract-title">
              <h2 id="contract-title" className="text-2xl font-semibold text-white mb-4">
                §2 {t('agb.sections.contract.title', 'Vertragsschluss')}
              </h2>
              <p>
                Die Angebote der Agentur sind freibleibend. Der Vertrag kommt durch die 
                Auftragserteilung des Kunden (Angebot) und die schriftliche Auftragsbestätigung 
                der Agentur (Annahme) zustande.
              </p>
            </section>

            <section id="services" aria-labelledby="services-title">
              <h2 id="services-title" className="text-2xl font-semibold text-white mb-4">
                §3 {t('agb.sections.services.title', 'Leistungsumfang')}
              </h2>
              <div className="space-y-4">
                <p>
                  Der Umfang der zu erbringenden Leistungen ergibt sich aus der schriftlichen 
                  Auftragsbestätigung. Nachträgliche Änderungen des Leistungsinhalts bedürfen 
                  der schriftlichen Bestätigung.
                </p>
                <p>
                  Die Agentur ist zu Teilleistungen berechtigt, soweit diese dem Kunden 
                  zumutbar sind.
                </p>
              </div>
            </section>

            <section id="payment" aria-labelledby="payment-title">
              <h2 id="payment-title" className="text-2xl font-semibold text-white mb-4">
                §4 {t('agb.sections.payment.title', 'Vergütung')}
              </h2>
              <div className="space-y-4">
                <p>
                  Die vereinbarte Vergütung ist innerhalb von 14 Tagen nach Rechnungsstellung 
                  ohne Abzug zur Zahlung fällig. Alle Preise verstehen sich zuzüglich der 
                  gesetzlichen Mehrwertsteuer.
                </p>
                <p>
                  Bei Zahlungsverzug ist die Agentur berechtigt, Verzugszinsen in Höhe von 
                  9 Prozentpunkten über dem Basiszinssatz zu berechnen.
                </p>
              </div>
            </section>

            <section id="cooperation" aria-labelledby="cooperation-title">
              <h2 id="cooperation-title" className="text-2xl font-semibold text-white mb-4">
                §5 {t('agb.sections.cooperation.title', 'Mitwirkungspflichten des Kunden')}
              </h2>
              <p>
                Der Kunde stellt der Agentur alle für die Durchführung des Projekts benötigten 
                Daten und Unterlagen unentgeltlich zur Verfügung. Alle Arbeitsunterlagen werden 
                von der Agentur sorgsam behandelt und vertraulich gehalten.
              </p>
            </section>

            <section id="warranty" aria-labelledby="warranty-title">
              <h2 id="warranty-title" className="text-2xl font-semibold text-white mb-4">
                §6 {t('agb.sections.warranty.title', 'Gewährleistung und Haftung')}
              </h2>
              <div className="space-y-4">
                <p>
                  Die Agentur verpflichtet sich zur gewissenhaften Vorbereitung und sorgfältigen 
                  Auswahl und Überwachung der Leistungserbringer nach den Sorgfaltspflichten 
                  eines ordentlichen Kaufmanns.
                </p>
                <p>
                  Die Agentur haftet für Schäden nur bei Vorsatz und grober Fahrlässigkeit. 
                  Dies gilt nicht für Schäden aus der Verletzung des Lebens, des Körpers oder 
                  der Gesundheit.
                </p>
              </div>
            </section>

            <section id="copyright" aria-labelledby="copyright-title">
              <h2 id="copyright-title" className="text-2xl font-semibold text-white mb-4">
                §7 {t('agb.sections.copyright.title', 'Urheberrecht und Nutzungsrechte')}
              </h2>
              <div className="space-y-4">
                <p>
                  Alle Rechte an den von der Agentur entwickelten Konzepten, Softwares und 
                  sonstigen Arbeitsergebnissen verbleiben bei der Agentur.
                </p>
                <p>
                  Der Kunde erhält die für den jeweiligen Verwendungszweck erforderlichen 
                  Nutzungsrechte erst nach vollständiger Bezahlung der vereinbarten Vergütung.
                </p>
              </div>
            </section>

            <section id="confidentiality" aria-labelledby="confidentiality-title">
              <h2 id="confidentiality-title" className="text-2xl font-semibold text-white mb-4">
                §8 {t('agb.sections.confidentiality.title', 'Vertraulichkeit')}
              </h2>
              <p>
                Die Agentur verpflichtet sich, alle im Rahmen der Zusammenarbeit mit dem 
                Kunden zur Kenntnis gelangenden Geschäftsgeheimnisse mit der im Geschäftsleben 
                üblichen Vertraulichkeit zu behandeln.
              </p>
            </section>

            <section id="final" aria-labelledby="final-title">
              <h2 id="final-title" className="text-2xl font-semibold text-white mb-4">
                §9 {t('agb.sections.final.title', 'Schlussbestimmungen')}
              </h2>
              <div className="space-y-4">
                <p>
                  Erfüllungsort und Gerichtsstand ist Dortmund.
                </p>
                <p>
                  Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des 
                  UN-Kaufrechts.
                </p>
                <p>
                  Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, 
                  berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.
                </p>
              </div>
            </section>

            <footer className="pt-8">
              <p className="text-sm text-gray-400">
                {t('agb.footer.lastUpdated', 'Stand')}: {t('agb.footer.date', 'Dezember 2024')}<br />
                BLACKFISH.DIGITAL
              </p>
            </footer>
          </div>
        </motion.article>
      </div>
    </main>
  )
}