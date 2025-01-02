import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/app/components/ui/Container'
import { Analytics } from '@/app/lib/analytics'

type LegalPageLayoutProps = {
  title: string
  description?: string
  children: ReactNode
}

export default function LegalPageLayout({
  title,
  description,
  children
}: LegalPageLayoutProps) {
  return (
    <Container size="md" className="py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 text-center md:mb-12">
          <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
          {description && (
            <p className="mt-4 text-lg text-gray-400">{description}</p>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-invert mx-auto max-w-none">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-400 md:mt-16">
          <p>
            Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </p>
        </div>
      </motion.div>
    </Container>
  )
}
