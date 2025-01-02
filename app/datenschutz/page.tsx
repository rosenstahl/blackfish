import { type Metadata } from 'next'
import LegalPageLayout from '@/app/components/layouts/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | BLACKFISH.DIGITAL',
  description: 'Informationen zum Schutz Ihrer Daten'
}

export default function DatenschutzPage() {
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