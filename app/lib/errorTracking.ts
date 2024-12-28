type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

type ErrorDetails = {
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
};

class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorDetails[] = [];
  private MAX_ERRORS = 100;

  private constructor() {
    this.initializeErrorListeners();
  }

  public static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  private initializeErrorListeners() {
    if (typeof window !== 'undefined') {
      // Global error handler
      window.onerror = (message, source, lineno, colno, error) => {
        this.captureError({
          message: String(message),
          stack: error?.stack,
          severity: 'high',
          tags: {
            source: source || 'unknown',
            type: 'uncaught_error'
          },
          extra: {
            lineno,
            colno
          }
        });
        return false;
      };

      // Unhandled promise rejection handler
      window.onunhandledrejection = (event) => {
        this.captureError({
          message: String(event.reason),
          stack: event.reason?.stack,
          severity: 'high',
          tags: {
            type: 'unhandled_promise_rejection'
          }
        });
      };

      // React error boundary fallback
      if (process.env.NODE_ENV === 'production') {
        console.error = (message, ...args) => {
          this.captureError({
            message: String(message),
            severity: 'medium',
            tags: {
              type: 'console_error'
            },
            extra: { args }
          });
        };
      }
    }
  }

  public captureError(details: ErrorDetails) {
    // Add timestamp and user info
    const enrichedError = {
      ...details,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    // Store error
    this.errors.push(enrichedError);
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors.shift();
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(enrichedError);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', enrichedError);
    }
  }

  private async sendToErrorService(error: any) {
    try {
      // Implementation for your error tracking service
      // Example: Sentry, LogRocket, etc.
      console.log('Sending error to tracking service:', error);
    } catch (e) {
      console.error('Failed to send error to tracking service:', e);
    }
  }

  public getErrors() {
    return this.errors;
  }

  public clearErrors() {
    this.errors = [];
  }
}

export const errorTracker = ErrorTracker.getInstance();