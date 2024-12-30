import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Analytics } from '@/app/lib/analytics'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo
    })

    // Log error zu Analytics
    Analytics.event({
      action: 'global_error',
      category: 'Error',
      label: error.message
    })

    // Fehler auch zur Konsole loggen
    console.error('Global error caught:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack
    })
  }

  private handleRetry = (): void => {
    // Reset state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })

    // Log retry zu Analytics
    Analytics.event({
      action: 'global_error_retry',
      category: 'Error'
    })

    // Seite neu laden
    window.location.reload()
  }

  private handleReturn = (): void => {
    // Log return zu Analytics
    Analytics.event({
      action: 'global_error_return',
      category: 'Error'
    })

    // Zur Startseite navigieren
    window.location.href = '/'
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md space-y-6">
            <h1 className="text-3xl font-bold text-white">
              Ups! Da ist etwas schiefgelaufen.
            </h1>

            <p className="text-lg text-gray-400">
              Ein unerwarteter Fehler ist aufgetreten. Wir wurden benachrichtigt
              und kümmern uns darum.
            </p>

            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full rounded-lg bg-blue-500 px-6 py-3 font-medium text-white hover:bg-blue-600"
              >
                Seite neu laden
              </button>

              <button
                onClick={this.handleReturn}
                className="w-full rounded-lg bg-gray-700 px-6 py-3 font-medium text-white hover:bg-gray-600"
              >
                Zurück zur Startseite
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 rounded-lg bg-gray-800 p-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-400">
                  Technische Details
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-gray-400">
                  {this.state.error?.stack}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}