// app/context/CookieConsentContext.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Analytics, Performance } from '@/app/lib/analytics'

type ConsentType = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

type CookieConsentContextType = {
  consent: ConsentType;
  updateConsent: (type: keyof ConsentType, value: boolean) => void;
  saveConsent: () => void;
  hasInteracted: boolean;
}

const defaultConsent: ConsentType = {
  necessary: true,
  analytics: false,
  marketing: false,
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentType>(defaultConsent)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookieConsent')
    if (storedConsent) {
      const parsedConsent = JSON.parse(storedConsent)
      setConsent(parsedConsent)
      setHasInteracted(true)

      if (parsedConsent.analytics) {
        Analytics.init()
        Performance.measurePageLoad()
        Performance.trackResources()
        Performance.trackErrors()
      }
    }
  }, [])

  useEffect(() => {
    if (consent.analytics) {
      const handleRouteChange = (url: string) => {
        Analytics.pageview(url)
      }
  
      // Speichere die Referenz der Funktion
      const boundHandleRoute = () => handleRouteChange(window.location.pathname)
      
      // Initial pageview
      handleRouteChange(window.location.pathname)
      
      // Füge Event Listener hinzu
      window.addEventListener('popstate', boundHandleRoute)
      
      // Cleanup mit derselben Funktionsreferenz
      return () => {
        window.removeEventListener('popstate', boundHandleRoute)
      }
    }
  }, [consent.analytics])

  const updateConsent = (type: keyof ConsentType, value: boolean) => {
    setConsent(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const saveConsent = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(consent))
    setHasInteracted(true)
    
    if (consent.analytics) {
      Analytics.init()
      Performance.measurePageLoad()
      Performance.trackResources()
      Performance.trackErrors()

      // Initiales Tracking
      Analytics.event({
        action: 'consent_given',
        category: 'Consent',
        label: 'Analytics'
      })
    }

    if (consent.marketing) {
      // Hier Marketing-Tracking aktivieren
      Analytics.event({
        action: 'consent_given',
        category: 'Consent',
        label: 'Marketing'
      })
    }
  }

  return (
    <CookieConsentContext.Provider value={{
      consent,
      updateConsent,
      saveConsent,
      hasInteracted
    }}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }
  return context
}