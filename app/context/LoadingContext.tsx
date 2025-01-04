'use client'

import { createContext, useContext, useState, type ReactNode, type FC } from 'react'
import PageLoadingIndicator from '@/app/components/common/PageLoadingIndicator'

interface LoadingContextType {
  loading: boolean
  setLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoading: () => {}
})

interface Props {
  children: ReactNode
  initialLoading?: boolean
}

export const LoadingProvider: FC<Props> = ({ children, initialLoading = false }) => {
  const [loading, setLoading] = useState(initialLoading)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <PageLoadingIndicator />}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)