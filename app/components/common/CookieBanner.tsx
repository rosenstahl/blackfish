'use client';

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Settings, X, Shield, ChartBar, Target } from 'lucide-react'
import { useCookieConsent } from '@/app/context/CookieConsentContext'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

const cookieGroups = [
  {
    id: 'necessary',
    icon: Shield,
    title: 'Notwendig',
    description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    required: true
  },
  {
    id: 'analytics',
    icon: ChartBar,
    title: 'Analytics',
    description: 'Helfen uns zu verstehen, wie Besucher mit der Website interagieren.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  {
    id: 'marketing',
    icon: Target,
    title: 'Marketing',
    description: 'Ermöglichen personalisierte Werbung und Analyse des Nutzerverhaltens.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  }
] as const

export default function CookieBanner() {
  const { consent, updateConsent, saveConsent, hasInteracted } = useCookieConsent()
  const [showDetails, setShowDetails] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Automatically show details on mobile
    const isMobile = window.innerWidth < 768
    setShowDetails(isMobile)
  }, [])

  if (hasInteracted) return null

  const handleAcceptAll = () => {
    Analytics.event({
      action: 'cookie_consent',
      category: 'Consent',
      label: 'accept_all'
    })

    updateConsent('analytics', true)
    updateConsent('marketing', true)
    setIsClosing(true)
    setTimeout(() => saveConsent(), 300)
  }

  const handleAcceptNecessary = () => {
    Analytics.event({
      action: 'cookie_consent',
      category: 'Consent',
      label: 'necessary_only'
    })

    setIsClosing(true)
    setTimeout(() => saveConsent(), 300)
  }

  const handleSaveSettings = () => {
    Analytics.event({
      action: 'cookie_consent',
      category: 'Consent',
      label: 'custom_settings'
    })

    setIsClosing(true)
    setTimeout(() => saveConsent(), 300)
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-gray-900/95 backdrop-blur-lg border-t border-gray-800"
      )}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 
                id="cookie-consent-title"
                className="text-lg font-semibold text-white mb-2"
              >
                Wir respektieren Ihre Privatsphäre
              </h3>
              <p 
                id="cookie-consent-description"
                className="text-gray-300 text-sm"
              >
                Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. 
                Sie können selbst entscheiden, welche Cookies Sie akzeptieren möchten.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 min-w-[300px]">
              <button
                onClick={handleAcceptAll}
                className={cn(
                  "w-full px-4 py-2 rounded-lg transition-colors",
                  "bg-blue-500 text-white hover:bg-blue-600",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                )}
                aria-label="Alle Cookies akzeptieren"
              >
                Alle akzeptieren
              </button>
              <button
                onClick={handleAcceptNecessary}
                className={cn(
                  "w-full px-4 py-2 rounded-lg transition-colors",
                  "bg-gray-800 text-white hover:bg-gray-700",
                  "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                )}
                aria-label="Nur notwendige Cookies akzeptieren"
              >
                Nur notwendige
              </button>
            </div>

            {/* Toggle Details Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={cn(
                "text-gray-400 hover:text-white transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              )}
              aria-expanded={showDetails}
              aria-controls="cookie-settings"
              aria-label={showDetails ? "Cookie-Einstellungen schließen" : "Cookie-Einstellungen öffnen"}
            >
              {showDetails ? (
                <X className="h-5 w-5" />
              ) : (
                <Settings className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Detailed Settings */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                id="cookie-settings"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-800 pt-4"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  {cookieGroups.map((group) => (
                    <div 
                      key={group.id}
                      className="p-4 rounded-lg bg-gray-800/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <group.icon className={cn("h-5 w-5", group.color)} />
                          <h4 className="font-medium text-white">{group.title}</h4>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            id={`cookie-${group.id}`}
                            checked={group.required || consent[group.id]}
                            onChange={(e) => updateConsent(group.id, e.target.checked)}
                            disabled={group.required}
                            className="sr-only peer"
                            aria-label={`${group.title} Cookies ${group.required ? '(erforderlich)' : ''}`}
                          />
                          <div className={cn(
                            "w-11 h-6 rounded-full transition-colors",
                            group.required ? "bg-green-500" : "bg-gray-700 peer-checked:bg-blue-500"
                          )}/>
                          <div className={cn(
                            "absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all",
                            "peer-checked:translate-x-5 peer-focus:ring-2 peer-focus:ring-blue-500"
                          )}/>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">
                        {group.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className={cn(
                      "px-6 py-2 rounded-lg transition-colors",
                      "bg-blue-500 text-white hover:bg-blue-600",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    )}
                  >
                    Einstellungen speichern
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}