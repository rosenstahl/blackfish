// app/components/layouts/LegalPageLayout.tsx
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/app/lib/utils'

interface LegalPageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  schemaType: 'PrivacyPolicy' | 'TermsOfService' | 'AboutPage';
  lastUpdated?: string;
}

export default function LegalPageLayout({
  children,
  title,
  description,
  schemaType,
  lastUpdated
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#1a1f36]">
      <div className="container mx-auto px-4 py-24">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "max-w-4xl mx-auto bg-gray-800/50",
            "backdrop-blur-sm rounded-2xl p-8",
            "border border-gray-700"
          )}
        >
          <header className="mb-8">
            <motion.h1 
              className="text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p 
                className="text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {description}
              </motion.p>
            )}
          </header>
          
          <div className="space-y-8 text-gray-300">
            {children}
          </div>

          {lastUpdated && (
            <footer className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Stand: {lastUpdated}<br />
                BLACKFISH.DIGITAL
              </p>
            </footer>
          )}
        </motion.article>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": schemaType,
            "name": title,
            "description": description,
            "dateModified": lastUpdated,
            "publisher": {
              "@type": "Organization",
              "name": "BLACKFISH.DIGITAL",
              "url": "https://blackfish.digital"
            }
          })
        }}
      />
    </div>
  )
}