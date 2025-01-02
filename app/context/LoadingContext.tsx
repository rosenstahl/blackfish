import { createContext, useContext, useState, type ReactNode } from 'react'
import { PageLoadingIndicator } from '@/app/components/common/PageLoadingIndicator'

type LoadingContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null)

type LoadingProviderProps = {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <PageLoadingIndicator isLoading={loading} />
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}