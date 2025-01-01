import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface ConsentType {
  necessary: boolean
  functional: boolean
  analytics: boolean
}

type CookieConsentContextType = {
  consent: ConsentType | null
  updateConsent: (type: keyof ConsentType, value: boolean) => void
  saveConsent: () => void
}

const CookieConsentContext = createContext<CookieConsentContextType | null>(null)

const defaultConsent: ConsentType = {
  necessary: true,
  functional: false,
  analytics: false
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentType | null>(null)

  useEffect(() => {
    // Load consent from localStorage on mount
    const savedConsent = localStorage.getItem('cookieConsent')
    if (savedConsent) {
      try {
        setConsent(JSON.parse(savedConsent))
      } catch (error) {
        console.error('Error parsing cookie consent:', error)
        setConsent(defaultConsent)
      }
    }
  }, [])

  const updateConsent = (type: keyof ConsentType, value: boolean) => {
    setConsent(prev => {
      if (!prev) return defaultConsent
      return { ...prev, [type]: value }
    })
  }

  const saveConsent = () => {
    if (consent) {
      localStorage.setItem('cookieConsent', JSON.stringify(consent))
    }
  }

  return (
    <CookieConsentContext.Provider value={{ consent, updateConsent, saveConsent }}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider')
  }
  return context
}