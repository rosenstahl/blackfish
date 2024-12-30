import { Component, type ReactNode } from 'react'
import { Analytics } from '@/app/lib/analytics'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

type ErrorInfo = {
  digest?: string
}

type ErrorEvent = {
  action: string
  category: string
  label?: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  public override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log error zu Analytics
    const errorEvent: ErrorEvent = {
      action: 'error_boundary_caught',
      category: 'Error',
      label: error.message
    }
    Analytics.event(errorEvent)
  }

  private handleReset = (): void => {
    // Reset state
    this.setState({
      hasError: false,
      error: null
    })

    // Log reset zu Analytics
    const resetEvent: ErrorEvent = {
      action: 'error_reset',
      category: 'Error'
    }
    Analytics.event(resetEvent)
  }

  private handleHomeReturn = (): void => {
    const returnEvent: ErrorEvent = {
      action: 'error_home_return',
      category: 'Error'
    }
    Analytics.event(returnEvent)
    window.location.href = '/'
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-white">
              Oops! Etwas ist schiefgelaufen.
            </h1>
            
            <p className="text-gray-400">
              Ein unerwarteter Fehler ist aufgetreten. Wir wurden benachrichtigt und
              arbeiten an einer Lösung.
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={this.handleReset}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Erneut versuchen
              </button>

              <button
                onClick={this.handleHomeReturn}
                className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
              >
                Zur Startseite
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}