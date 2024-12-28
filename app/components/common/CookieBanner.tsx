import { memo, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Settings, X, Shield, ChartBar, Target } from 'lucide-react'
import { useCookieConsent } from '@/app/context/CookieConsentContext'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// Memoized Cookie Group Component
const CookieGroup = memo(({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  id, 
  required, 
  checked, 
  onChange 
}: {
  icon: typeof Shield;
  title: string;
  description: string;
  color: string;
  id: string;
  required: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div 
    className="p-4 rounded-lg bg-gray-800/50 transition-colors hover:bg-gray-800/70"
    role="group"
    aria-labelledby={`cookie-group-${id}`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-5 w-5", color)} aria-hidden="true" />
        <h4 id={`cookie-group-${id}`} className="font-medium text-white">{title}</h4>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          id={`cookie-${id}`}
          checked={required || checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={required}
          className="sr-only peer"
          aria-label={`${title} Cookies ${required ? '(erforderlich)' : 'aktivieren oder deaktivieren'}`}
        />
        <div 
          className={cn(
            "w-11 h-6 rounded-full transition-colors",
            required ? "bg-green-500" : "bg-gray-700 peer-checked:bg-blue-500"
          )}
          aria-hidden="true"
        />
        <div 
          className={cn(
            "absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform",
            "peer-checked:translate-x-5 peer-focus:ring-2 peer-focus:ring-blue-500"
          )}
          aria-hidden="true"
        />
      </div>
    </div>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
));

CookieGroup.displayName = 'CookieGroup';

// Cookie Groups Configuration
const cookieGroups = [
  {
    id: 'necessary',
    icon: Shield,
    title: 'Notwendig',
    description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich.',
    color: 'text-green-400',
    required: true
  },
  {
    id: 'analytics',
    icon: ChartBar,
    title: 'Analytics',
    description: 'Helfen uns zu verstehen, wie Besucher mit der Website interagieren.',
    color: 'text-blue-400',
    required: false
  },
  {
    id: 'marketing',
    icon: Target,
    title: 'Marketing',
    description: 'Ermöglichen personalisierte Werbung und Analyse des Nutzerverhaltens.',
    color: 'text-purple-400',
    required: false
  }
] as const;

// Main Component
function CookieBanner() {
  const { consent, updateConsent, saveConsent, hasInteracted } = useCookieConsent()
  const [showDetails, setShowDetails] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const prefersReducedMotion = useReducedMotion()

  // Show details automatically on mobile
  useEffect(() => {
    setShowDetails(isMobile)
  }, [isMobile])

  // Early return if user has already made a choice
  if (hasInteracted) return null

  // Event handlers with analytics
  const handleAcceptAll = useCallback(() => {
    Analytics.event({
      action: 'cookie_consent',
      category: 'Consent',
      label: 'accept_all'
    })

    updateConsent('analytics', true)
    updateConsent('marketing', true)
    setIsClosing(true)
    setTimeout(saveConsent, 300)
  }, [updateConsent, saveConsent])

  const handleAcceptNecessary = useCallback(() => {
    Analytics.event({
      action: 'cookie_consent',
      category: 'Consent',
      label: 'necessary_only'
    })

    setIsClosing(true)
    setTimeout(saveConsent, 300)
  }, [saveConsent])

  const handleSaveSettings = useCallback(() => {
    Analytics.event({
      action: 'cookie_consent',
      category: 'Consent',
      label: 'custom_settings',
      value: Object.entries(consent)
        .filter(([key]) => key !== 'necessary')
        .map(([key, value]) => `${key}:${value}`)
        .join(',')
    })

    setIsClosing(true)
    setTimeout(saveConsent, 300)
  }, [consent, saveConsent])

  // Animation variants
  const bannerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 }
  }

  const detailsVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 }
  }

  return (
    <motion.div
      initial="hidden"
      animate={isClosing ? 'exit' : 'visible'}
      exit="exit"
      variants={prefersReducedMotion ? {} : bannerVariants}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-gray-900/95 backdrop-blur-lg border-t border-gray-800",
        "shadow-lg"
      )}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          {/* Header Section */}
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
              <motion.button
                onClick={handleAcceptAll}
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                className={cn(
                  "w-full px-4 py-2 rounded-lg transition-colors duration-200",
                  "bg-blue-500 text-white hover:bg-blue-600",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "focus:ring-offset-gray-900"
                )}
                aria-label="Alle Cookies akzeptieren"
              >
                Alle akzeptieren
              </motion.button>
              <motion.button
                onClick={handleAcceptNecessary}
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                className={cn(
                  "w-full px-4 py-2 rounded-lg transition-colors duration-200",
                  "bg-gray-800 text-white hover:bg-gray-700",
                  "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
                  "focus:ring-offset-gray-900"
                )}
                aria-label="Nur notwendige Cookies akzeptieren"
              >
                Nur notwendige
              </motion.button>
            </div>

            {/* Toggle Details Button */}
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
              className={cn(
                "text-gray-400 hover:text-white transition-colors p-2 rounded-full",
                "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
                "focus:ring-offset-gray-900"
              )}
              aria-expanded={showDetails}
              aria-controls="cookie-settings"
              aria-label={showDetails ? "Cookie-Einstellungen schließen" : "Cookie-Einstellungen öffnen"}
            >
              {showDetails ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Settings className="h-5 w-5" aria-hidden="true" />
              )}
            </motion.button>
          </div>

          {/* Detailed Settings */}
          <AnimatePresence mode="wait">
            {showDetails && (
              <motion.div
                id="cookie-settings"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={prefersReducedMotion ? {} : detailsVariants}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-800 pt-4"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  {cookieGroups.map((group) => (
                    <CookieGroup
                      key={group.id}
                      {...group}
                      checked={consent[group.id]}
                      onChange={(checked) => updateConsent(group.id, checked)}
                    />
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <motion.button
                    onClick={handleSaveSettings}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    className={cn(
                      "px-6 py-2 rounded-lg transition-colors duration-200",
                      "bg-blue-500 text-white hover:bg-blue-600",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      "focus:ring-offset-gray-900"
                    )}
                  >
                    Einstellungen speichern
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// Performance Optimization durch Memoization
export default memo(CookieBanner)