import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Shield, BarChart, LucideProps } from 'lucide-react'
import { useCookieConsent, type ConsentType } from '@/app/context/CookieConsentContext'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

type Icon = React.ComponentType<LucideProps>

type CookieGroup = {
  id: keyof ConsentType
  icon: Icon
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

  if (!consent) return null

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
            {/* Rest of the component content */}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}