import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LucideProps } from 'lucide-react'
import { Settings, Shield, BarChart } from 'lucide-react'
import { useCookieConsent, type ConsentType } from '@/app/context/CookieConsentContext'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

type CookieGroup = {
  id: keyof ConsentType
  icon: React.ComponentType<LucideProps>
  title: string
  description: string
  color: string
  bgColor: string
  isRequired: boolean
}

const cookieGroups: CookieGroup[] = [
  {
    id: 'necessary',
    icon: Shield,
    title: 'Notwendig',
    description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    isRequired: true
  },
  {
    id: 'functional',
    icon: Settings,
    title: 'Funktional',
    description: 'Ermöglichen eine bessere Nutzererfahrung und Funktionalität.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    isRequired: false
  },
  {
    id: 'analytics',
    icon: BarChart,
    title: 'Analytics',
    description: 'Helfen uns zu verstehen, wie Besucher mit der Website interagieren.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    isRequired: false
  }
]

export default function CookieBanner() {
  const { consent, updateConsent, saveConsent } = useCookieConsent()
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (showDetails !== undefined) {
      Analytics.event({
        action: showDetails ? 'cookie_details_show' : 'cookie_details_hide',
        category: 'Cookie Consent',
        label: 'Cookie Banner Interaction'
      })
    }
  }, [showDetails])

  if (!consent) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 bottom-0 z-50 pb-safe-area-inset-bottom">
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4"
        >
          <div className="max-w-7xl mx-auto space-y-4">
            {cookieGroups.map((group) => (
              <div
                key={group.id}
                className={cn('rounded-lg p-4', group.bgColor)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <group.icon className={cn('h-5 w-5', group.color)} />
                      <h3 className="font-medium text-white">
                        {group.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                      {group.description}
                    </p>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={group.isRequired || consent[group.id]}
                      onChange={() => {
                        if (!group.isRequired) {
                          updateConsent(group.id, !consent[group.id])
                        }
                      }}
                      disabled={group.isRequired}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700"
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  cookieGroups.forEach(group => updateConsent(group.id, true))
                  saveConsent()
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Alle akzeptieren
              </button>
              <button
                onClick={() => saveConsent()}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Auswahl speichern
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
