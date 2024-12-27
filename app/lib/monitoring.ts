// app/lib/monitoring.ts
import * as Sentry from "@sentry/nextjs";

// Initialize Performance Monitoring
export function initMonitoring() {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    enabled: process.env.NODE_ENV === 'production',
  });
}

// Error Tracking
export function trackError(error: Error, context?: Record<string, any>) {
  try {
    Sentry.captureException(error, {
      extra: context
    });
  } catch (e) {
    console.error('Failed to track error:', e);
  }
}

// Event Tracking
export function trackEvent(name: string, data?: Record<string, any>) {
  try {
    Sentry.captureEvent({
      message: name,
      level: 'info',
      extra: {
        ...data,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

// Performance Monitoring
export const Performance = {
  measurePageLoad: () => {
    if (typeof window === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          trackEvent('performance_metric', {
            name: entry.name,
            value: entry.startTime,
            duration: entry.duration
          });
        });
      });

      observer.observe({ entryTypes: ['navigation', 'resource'] });
    } catch (error) {
      console.error('Performance monitoring failed:', error);
    }
  },

  trackResources: () => {
    if (typeof window === 'undefined') return;

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            trackEvent('resource_timing', {
              name: entry.name,
              duration: entry.duration,
              type: (entry as PerformanceResourceTiming).initiatorType
            });
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.error('Resource tracking failed:', error);
    }
  }
};