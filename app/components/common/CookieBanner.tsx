import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Shield, BarChart } from 'lucide-react'
import { useCookieConsent } from '@/app/context/CookieConsentContext'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

export interface ConsentType {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
}

type CookieGroup = {
  id: keyof ConsentType;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  isRequired: boolean;
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
];

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

  const handleAcceptAll = () => {
    cookieGroups.forEach(group => {
      updateConsent(group.id, true)
    })
    saveConsent()

    Analytics.event({
      action: 'cookie_accept_all',
      category: 'Cookie Consent',
      label: 'Accept All Cookies'
    })
  }

  const handleAcceptSelected = () => {
    saveConsent()

    Analytics.event({
      action: 'cookie_accept_selected',
      category: 'Cookie Consent',
      label: 'Accept Selected Cookies'
    })
  }

  const handleToggleCookie = (groupId: keyof ConsentType) => {
    if (!consent) return
    updateConsent(groupId, !consent[groupId])
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-x-0 bottom-0 z-50 pb-safe-area-inset-bottom"
        role="dialog"
        aria-labelledby="cookie-banner-title"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className={cn(
            'bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75',
            'border-t border-gray-800',
            'p-4 md:p-6'
          )}
        >
          <div className="mx-auto max-w-7xl space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3 md:flex-1">
                <h2
                  id="cookie-banner-title"
                  className="text-xl font-semibold text-white"
                >
                  Cookie-Einstellungen
                </h2>
                <p className="text-sm text-gray-400">
                  Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAcceptAll}
                  className={cn(
                    'rounded-lg bg-blue-500 px-5 py-2.5',
                    'text-sm font-medium text-white',
                    'hover:bg-blue-600 transition-colors'
                  )}
                >
                  Alle akzeptieren
                </button>
                {!showDetails && (
                  <button
                    onClick={() => setShowDetails(true)}
                    className={cn(
                      'rounded-lg border border-gray-700 px-5 py-2.5',
                      'text-sm font-medium text-white',
                      'hover:bg-gray-800 transition-colors'
                    )}
                  >
                    Einstellungen
                  </button>
                )}
              </div>
            </div>

            {/* Cookie Groups */}
            {showDetails && consent && (
              <div className="space-y-4">
                {cookieGroups.map((group) => (
                  <div
                    key={group.id}
                    className={cn(
                      'rounded-lg p-4',
                      group.bgColor
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
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

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={group.isRequired || consent[group.id]}
                          disabled={group.isRequired}
                          onChange={() => handleToggleCookie(group.id)}
                          className="h-4 w-4 rounded border-gray-600 bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end">
                  <button
                    onClick={handleAcceptSelected}
                    className={cn(
                      'rounded-lg bg-blue-500 px-5 py-2.5',
                      'text-sm font-medium text-white',
                      'hover:bg-blue-600 transition-colors'
                    )}
                  >
                    Auswahl speichern
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}