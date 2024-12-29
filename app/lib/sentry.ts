import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

interface UserContext {
  id?: string;
  email?: string;
  role?: string;
}

export function initSentry() {
  if (typeof window === 'undefined') return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_VERSION,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', /^\/api/],
      }),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    beforeSend(event) {
      // Don't send events in development
      if (process.env.NODE_ENV === 'development') {
        return null;
      }

      // Sanitize error messages
      if (event.exception) {
        event.exception.values = event.exception.values?.map(value => ({
          ...value,
          value: sanitizeErrorMessage(value.value)
        }));
      }

      // Add user context if available
      const user = getUserContext();
      if (user) {
        event.user = user;
      }

      return event;
    },

    beforeBreadcrumb(breadcrumb) {
      // Sanitize URLs in breadcrumbs
      if (breadcrumb.category === 'navigation') {
        breadcrumb.data = {
          ...breadcrumb.data,
          to: sanitizeUrl(breadcrumb.data?.to),
          from: sanitizeUrl(breadcrumb.data?.from)
        };
      }

      // Sanitize console breadcrumbs
      if (breadcrumb.category === 'console') {
        breadcrumb.message = sanitizeErrorMessage(breadcrumb.message);
      }

      return breadcrumb;
    },
  });
}

function sanitizeErrorMessage(message?: string): string {
  if (!message) return 'Unknown error';

  // Remove sensitive data patterns
  return message
    .replace(/([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, '[EMAIL]')
    .replace(/(\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4})/g, '[CARD]')
    .replace(/(\b\d{10,11}\b)/g, '[PHONE]')
    .replace(/(Bearer\s+[\w-]+\.([\w-]+\.)?[\w-]+)/gi, '[TOKEN]')
    .replace(/([0-9a-fA-F]{24})/g, '[ID]')
    .replace(/(password["']?\s*[:=]\s*["']?[^"'\s]+)/gi, 'password=[FILTERED]');
}

function sanitizeUrl(url?: string): string {
  if (!url) return '';

  try {
    const parsedUrl = new URL(url);
    
    // Remove query parameters that might contain sensitive data
    const sensitiveParams = ['token', 'key', 'password', 'secret', 'auth'];
    sensitiveParams.forEach(param => {
      if (parsedUrl.searchParams.has(param)) {
        parsedUrl.searchParams.set(param, '[FILTERED]');
      }
    });

    // Remove potential sensitive data from path segments
    const pathSegments = parsedUrl.pathname.split('/');
    const sanitizedSegments = pathSegments.map(segment => {
      // Replace potential IDs or tokens in path
      if (/^[0-9a-f]{24}$/.test(segment)) return '[ID]';
      if (/^[A-Za-z0-9-_]{21}$/.test(segment)) return '[TOKEN]';
      return segment;
    });

    parsedUrl.pathname = sanitizedSegments.join('/');
    return parsedUrl.toString();
  } catch {
    // If URL parsing fails, return sanitized version of original
    return url
      .replace(/([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, '[EMAIL]')
      .replace(/token=[^&]+/gi, 'token=[FILTERED]')
      .replace(/key=[^&]+/gi, 'key=[FILTERED]')
      .replace(/password=[^&]+/gi, 'password=[FILTERED]')
      .replace(/secret=[^&]+/gi, 'secret=[FILTERED]')
      .replace(/auth=[^&]+/gi, 'auth=[FILTERED]');
  }
}

function getUserContext(): UserContext | null {
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return null;

    const user = JSON.parse(userString);
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  } catch {
    return null;
  }
}

// Helper functions for manual error tracking
export const ErrorTracking = {
  captureError(error: Error, context?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', error, context);
      return;
    }

    Sentry.withScope(scope => {
      if (context) {
        scope.setExtras(context);
      }

      // Add current route
      scope.setTag('route', window.location.pathname);

      // Add performance metrics if available
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        scope.setExtra('performance', {
          loadTime: navigationEntry.duration,
          domContentLoaded: (navigationEntry as PerformanceNavigationTiming).domContentLoadedEventEnd,
          firstByte: (navigationEntry as PerformanceNavigationTiming).responseStart
        });
      }

      Sentry.captureException(error);
    });
  },

  captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level}] ${message}`);
      return;
    }

    Sentry.captureMessage(message, level);
  },

  setUser(user: UserContext | null) {
    Sentry.setUser(user);
  },

  setTag(key: string, value: string) {
    Sentry.setTag(key, value);
  },

  setExtra(key: string, value: any) {
    Sentry.setExtra(key, value);
  }
};
