import { type Metadata } from 'next'
import LegalPageLayout from '@/app/components/layouts/LegalPageLayout'

export const metadata: Metadata = {
  title: 'AGB | BLACKFISH.DIGITAL',
  description: 'Unsere AGB für Geschäftsbeziehungen'
}

export default function AGBPage() {
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