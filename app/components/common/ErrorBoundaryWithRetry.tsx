import React from 'react'
import { type ReactNode, createContext, useContext } from 'react'
import { Analytics } from '@/app/lib/analytics'

type Props = {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

type State = {
  hasError: boolean
  error: Error | null
  retryCount: number
}

export class ErrorBoundaryWithRetry extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0
    }
  }

  // Rest der Implementierung...
}