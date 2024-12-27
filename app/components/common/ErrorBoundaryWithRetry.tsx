import { Component, ReactNode, createContext, useContext } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { trackError } from '@/app/lib/monitoring'
import { Analytics } from '@/app/lib/analytics'

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  retryCount: number;
}

// Context for error handling
const ErrorBoundaryContext = createContext<{
  retryCount: number;
  maxRetries: number;
}>({
  retryCount: 0,
  maxRetries: 3,
})

export function useErrorBoundary() {
  return useContext(ErrorBoundaryContext)
}

export default class ErrorBoundaryWithRetry extends Component<Props, State> {
  public static defaultProps = {
    maxRetries: 3,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error 
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Track error with additional context
    trackError(error, {
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount,
    })

    // Call custom error handler if provided
    this.props.onError?.(error)

    // Track error analytics
    Analytics.event({
      action: 'error_boundary_catch',
      category: 'Error',
      label: error.message,
      value: this.state.retryCount
    })

    this.setState({
      errorInfo
    })
  }

  retry = () => {
    this.setState(state => {
      const newRetryCount = state.retryCount + 1

      // Track retry attempt
      Analytics.event({
        action: 'error_boundary_retry',
        category: 'Error',
        label: state.error?.message,
        value: newRetryCount
      })

      return {
        hasError: false,
        retryCount: newRetryCount,
      }
    })
  }

  render() {
    const { hasError, error, retryCount } = this.state
    const { children, fallback, maxRetries = 3 } = this.props

    if (hasError) {
      if (fallback) {
        return fallback
      }

      return (
        <div className="min-h-[400px] p-6 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4"
            >
              <AlertCircle className="w-8 h-8 text-red-500" />
            </motion.div>

            <h2 className="text-xl font-semibold text-white mb-2">
              Etwas ist schiefgelaufen
            </h2>

            <p className="text-gray-400 mb-6">
              {error?.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
            </p>

            {retryCount < maxRetries ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.retry}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Erneut versuchen ({maxRetries - retryCount} Versuche übrig)
              </motion.button>
            ) : (
              <div className="text-gray-500 text-sm">
                Maximale Anzahl an Wiederholungsversuchen erreicht. 
                Bitte laden Sie die Seite neu oder versuchen Sie es später erneut.
              </div>
            )}

            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 p-4 bg-gray-900 rounded-lg text-left text-xs text-gray-400 overflow-auto">
                {error?.stack}
              </pre>
            )}
          </motion.div>
        </div>
      )
    }

    return (
      <ErrorBoundaryContext.Provider 
        value={{
          retryCount,
          maxRetries,
        }}
      >
        {children}
      </ErrorBoundaryContext.Provider>
    )
  }
}
