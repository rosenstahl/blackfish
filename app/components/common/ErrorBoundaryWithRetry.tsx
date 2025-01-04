'use client'

import { Component, type ReactNode, createContext, useContext } from 'react'
import { Analytics } from '@/app/lib/analytics'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  retryCount: number
  error?: Error
}

interface RetryContextType {
  retry: () => void
}

const RetryContext = createContext<RetryContextType>({ retry: () => {} })

export class ErrorBoundaryWithRetry extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
    this.retry = this.retry.bind(this)
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      retryCount: 0
    }
  }

  componentDidCatch(error: Error): void {
    if (process.env.NODE_ENV === 'production') {
      Analytics.error('error_boundary_catch', {
        error: error.message,
        stack: error.stack
      })
    }
  }

  retry(): void {
    const newRetryCount = this.state.retryCount + 1
    
    Analytics.event({
      action: 'error_boundary_retry',
      category: 'Error',
      label: this.state.error?.message,
      value: newRetryCount
    })

    this.setState({
      hasError: false,
      retryCount: newRetryCount
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Oops! Something went wrong.</h1>
            <p className="mt-2 text-gray-600">
              Please try again or contact support if the problem persists.
            </p>
            <button
              onClick={this.retry}
              className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return (
      <RetryContext.Provider value={{ retry: this.retry }}>
        {this.props.children}
      </RetryContext.Provider>
    )
  }
}

export function useRetry(): RetryContextType {
  return useContext(RetryContext)
}