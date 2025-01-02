import { type Metadata } from 'next'
import LegalPageLayout from '@/app/components/layouts/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Impressum | BLACKFISH.DIGITAL',
  description: 'Rechtliche Informationen und Kontaktdaten'
}

export default function ImpressumPage() {
  return (
    <LegalPageLayout
      title="Impressum"
      description="Rechtliche Informationen und Kontaktdaten"
    >
      {/* Impressum-Content */}
      <h2>Angaben gemäß § 5 TMG</h2>
      {/* ... Rest des Impressum-Inhalts ... */}
    </LegalPageLayout>
  )
}

// Datenschutz-Page
export function DatenschutzPage() {
  return (
    <LegalPageLayout
      title="Datenschutzerklärung"
      description="Informationen zum Schutz Ihrer Daten"
    >
      {/* Datenschutz-Content */}
      <h2>Datenschutzerklärung</h2>
      {/* ... Rest des Datenschutz-Inhalts ... */}
    </LegalPageLayout>
  )
}

// AGB-Page
export function AGBPage() {
  return (
    <LegalPageLayout
      title="Allgemeine Geschäftsbedingungen"
      description="Unsere AGB für Geschäftsbeziehungen"
    >
      {/* AGB-Content */}
      <h2>Allgemeine Geschäftsbedingungen</h2>
      {/* ... Rest der AGB-Inhalte ... */}
    </LegalPageLayout>
  )
}