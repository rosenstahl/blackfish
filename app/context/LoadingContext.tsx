// app/context/LoadingContext.tsx
'use client'

import { createContext, useContext, useState } from 'react'
import PageLoadingIndicator from '@/app/components/common/PageLoadingIndicator'

type LoadingContextType = {
  startLoading: () => void;
  stopLoading: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingTimer, setLoadingTimer] = useState<NodeJS.Timeout | null>(null)

  const startLoading = () => {
    // Minimale Ladezeit von 500ms um Flackern zu vermeiden
    setIsLoading(true)
    if (loadingTimer) clearTimeout(loadingTimer)
  }

  const stopLoading = () => {
    // Verzögerung um abrupte Übergänge zu vermeiden
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    setLoadingTimer(timer)
  }

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading, isLoading }}>
      {children}
      {isLoading && <PageLoadingIndicator />}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
