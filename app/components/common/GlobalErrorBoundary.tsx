import { Component, ErrorInfo, ReactNode, useEffect } from 'react'
import { Analytics } from '@/app/lib/analytics'
import { trackError } from '@/app/lib/monitoring'
import ErrorBoundary from './ErrorBoundary'

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
  lastError: number;
}

const ERROR_THRESHOLD = 3;
const ERROR_RESET_TIME = 60000; // 1 minute

export default class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { 
      error: null,
      errorInfo: null,
      errorCount: 0,
      lastError: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const now = Date.now()
    
    this.setState(prevState => {
      // Reset error count if enough time has passed
      if (now - prevState.lastError > ERROR_RESET_TIME) {
        return {
          error,
          errorInfo,
          errorCount: 1,
          lastError: now
        }
      }

      // Increment error count
      return {
        error,
        errorInfo,
        errorCount: prevState.errorCount + 1,
        lastError: now
      }
    })

    // Track error with monitoring service
    trackError(error, {
      componentStack: errorInfo.componentStack,
      count: this.state.errorCount,
      timestamp: now
    })

    // Track error analytics
    Analytics.event({
      action: 'global_error',
      category: 'Error',
      label: error.message,
      value: this.state.errorCount
    })

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global Error Caught:', {
        error,
        componentStack: errorInfo.componentStack,
        count: this.state.errorCount
      })
    }
  }

  handleReset = () => {
    this.setState({
      error: null,
      errorInfo: null
    })

    // Track reset attempt
    Analytics.event({
      action: 'global_error_reset',
      category: 'Error',
      value: this.state.errorCount
    })
  }

  render() {
    const { error, errorCount } = this.state
    const { children, fallback } = this.props

    // Return fallback UI if too many errors
    if (errorCount >= ERROR_THRESHOLD) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">
              Zu viele Fehler aufgetreten
            </h1>
            <p className="text-gray-400 mb-4">
              Bitte laden Sie die Seite neu oder versuchen Sie es später erneut.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      )
    }

    // Show error boundary if there's an error
    if (error) {
      return (
        <ErrorBoundary 
          error={error} 
          reset={this.handleReset}
        />
      )
    }

    return children
  }
}

// Hook to initialize error tracking
export function useErrorTracking() {
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      trackError(event.error)
      Analytics.event({
        action: 'unhandled_error',
        category: 'Error',
        label: event.message
      })
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      trackError(event.reason)
      Analytics.event({
        action: 'unhandled_rejection',
        category: 'Error',
        label: event.reason?.message
      })
    }

    // Add global error listeners
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Clean up
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])
}