import React, { Component, ErrorInfo, useCallback, memo } from 'react';
import { Analytics } from '@/app/lib/analytics';
import { X, RefreshCcw, ChevronLeft } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
  retry?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Memoized Error UI Components
const ErrorActions = memo(({ onRetry, onBack, canRetry = true }: { 
  onRetry: () => void;
  onBack: () => void;
  canRetry?: boolean;
}) => (
  <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
    {canRetry && (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRetry}
        className={cn(
          "inline-flex items-center rounded-md border border-transparent",
          "bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm",
          "hover:bg-blue-700 focus:outline-none focus:ring-2",
          "focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        )}
      >
        <RefreshCcw className="mr-2 h-4 w-4" />
        Erneut versuchen
      </motion.button>
    )}
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onBack}
      className={cn(
        "inline-flex items-center rounded-md border",
        "border-gray-200 bg-white px-4 py-2 text-sm",
        "font-medium text-gray-700 shadow-sm",
        "hover:bg-gray-50 focus:outline-none focus:ring-2",
        "focus:ring-blue-500 focus:ring-offset-2"
      )}
    >
      <ChevronLeft className="mr-2 h-4 w-4" />
      Zurück
    </motion.button>
  </div>
));

ErrorActions.displayName = 'ErrorActions';

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to analytics
    Analytics.trackError(error, {
      componentStack: errorInfo.componentStack,
      location: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString()
    });

    // Optional: Send to error tracking service
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.withScope((scope) => {
        scope.setExtras(errorInfo);
        window.Sentry.captureException(error);
      });
    }

    this.setState({ errorInfo });
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private handleRetry = () => {
    const { onReset } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= MAX_RETRIES) {
      console.warn('Maximum retry attempts reached');
      return;
    }

    this.setState(
      prevState => ({ 
        hasError: false,
        retryCount: prevState.retryCount + 1 
      }),
      () => {
        if (onReset) {
          this.retryTimeoutId = setTimeout(onReset, RETRY_DELAY);
        }
      }
    );
  };

  private handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback, retry = true } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="mx-auto max-w-max">
            <main className="sm:flex">
              <p className="text-4xl font-bold tracking-tight text-blue-600 sm:text-5xl">500</p>
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Ein Fehler ist aufgetreten
                  </h1>
                  <p className="mt-1 text-base text-gray-500">
                    {error?.message || 'Bitte versuchen Sie es später erneut.'}
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <pre className="mt-4 max-h-96 overflow-auto rounded bg-gray-100 p-4 text-sm text-gray-700">
                      {error?.stack}
                    </pre>
                  )}
                </div>
                <ErrorActions 
                  onRetry={this.handleRetry} 
                  onBack={this.handleBack}
                  canRetry={retry && retryCount < MAX_RETRIES}
                />
              </div>
            </main>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Performance Optimierung durch Memoization
export default memo(ErrorBoundary);
