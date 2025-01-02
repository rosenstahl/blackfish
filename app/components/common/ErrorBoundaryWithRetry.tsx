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

type ErrorInfo = {
  componentStack: string
  digest?: string
}

type RetryContextType = {
  reset: () => void
}

const RetryContext = createContext<RetryContextType | null>(null)

export function useRetry(): RetryContextType {
  const context = useContext(RetryContext)
  if (!context) {
    throw new Error('useRetry must be used within an ErrorBoundaryWithRetry')
  }
  return context
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

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      retryCount: 0
    }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error zu Analytics
    Analytics.event({
      action: 'error_boundary_caught',
      category: 'Error',
      label: error.message
    })

    console.error('Error caught by ErrorBoundary:', {
      error,
      errorInfo,
      retryCount: this.state.retryCount
    })
  }

  private reset = (): void => {
    const newRetryCount = this.state.retryCount + 1
    
    // Log retry zu Analytics
    Analytics.event({
      action: 'error_boundary_retry',
      category: 'Error',
      label: this.state.error?.message,
      value: newRetryCount
    })

    this.setState({
      hasError: false,
      error: null,
      retryCount: newRetryCount
    })

    this.props.onReset?.()
  }

  public override render(): ReactNode {
    const { children, fallback } = this.props
    const { hasError, error, retryCount } = this.state

    const retry = {
      reset: this.reset,
      error,
      retryCount
    }

    if (hasError) {
      if (fallback) {
        return fallback
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-white">
              Etwas ist schiefgelaufen
            </h1>
            
            <p className="text-gray-400">
              Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
            </p>

            {retryCount < 3 && (
              <button
                onClick={this.reset}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Erneut versuchen
              </button>
            )}
          </div>
        </div>
      )
    }

    return (
      <RetryContext.Provider value={retry}>
        {children}
      </RetryContext.Provider>
    )
  }
}