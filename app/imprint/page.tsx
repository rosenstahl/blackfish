// app/imprint/page.tsx
export default function ImpressumPage() {
  return (
    <LegalPageLayout
      title="Impressum"
      description="Gesetzliche Angaben gemäß § 5 TMG"
      schemaType="AboutPage"
      lastUpdated="Dezember 2024"
    >
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Angaben gemäß § 5 TMG
        </h2>
        <address className="not-italic">
          BLACKFISH.DIGITAL<br />
          Rheinische Straße 220<br />
          44147 Dortmund
        </address>
      </section>

      {/* Rest des Impressums ... */}
    </LegalPageLayout>
  )
}

// app/privacy/page.tsx
export default function DatenschutzPage() {
  return (
    <LegalPageLayout
      title="Datenschutzerklärung"
      description="Informationen zur Verarbeitung Ihrer personenbezogenen Daten"
      schemaType="PrivacyPolicy"
      lastUpdated="Dezember 2024"
    >
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">
          1. Datenschutz auf einen Blick
        </h2>
        <h3 className="text-xl font-medium text-white mb-2">
          Allgemeine Hinweise
        </h3>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, 
          was mit Ihren personenbezogenen Daten passiert...
        </p>
      </section>

      {/* Rest der Datenschutzerklärung ... */}
    </LegalPageLayout>
  )
}

// app/terms/page.tsx
export default function AGBPage() {
  return (
    <LegalPageLayout
      title="Allgemeine Geschäftsbedingungen"
      description="Unsere allgemeinen Geschäftsbedingungen für eine faire Zusammenarbeit"
      schemaType="TermsOfService"
      lastUpdated="Dezember 2024"
    >
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">
          §1 Geltungsbereich
        </h2>
        <p>
          Diese Geschäftsbedingungen gelten für alle Verträge zwischen 
          BLACKFISH.DIGITAL und ihren Auftraggebern...
        </p>
      </section>

      {/* Rest der AGB ... */}
    </LegalPageLayout>
  )
}

// Optimierte Metadaten für jede Seite
export const metadata = {
  impressum: {
    title: 'Impressum | BLACKFISH.DIGITAL',
    description: 'Gesetzliche Angaben und Informationen zu BLACKFISH.DIGITAL gemäß § 5 TMG.',
  },
  datenschutz: {
    title: 'Datenschutzerklärung | BLACKFISH.DIGITAL',
    description: 'Informationen zum Datenschutz und zur Verarbeitung Ihrer personenbezogenen Daten.',
  },
  agb: {
    title: 'AGB | BLACKFISH.DIGITAL',
    description: 'Allgemeine Geschäftsbedingungen für die Zusammenarbeit mit BLACKFISH.DIGITAL.',
  }
}