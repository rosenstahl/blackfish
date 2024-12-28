interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  [key: string]: any;
}

interface AnalyticsPageView {
  path: string;
  title?: string;
  referrer?: string;
}

interface AnalyticsError {
  error: Error;
  componentStack?: string;
  location?: string;
  timestamp?: string;
  [key: string]: any;
}

class AnalyticsService {
  private queue: Array<() => void> = [];
  private isInitialized = false;
  private debug = process.env.NODE_ENV === 'development';
  private sessionId: string;
  private userId: string;

  constructor() {
    // Generate or retrieve session and user IDs
    this.sessionId = this.getSessionId();
    this.userId = this.getUserId();

    if (typeof window !== 'undefined') {
      // Initialize when window is available
      this.initWhenReady();

      // Set up error boundary
      window.onerror = (message, source, lineno, colno, error) => {
        this.trackError(error || new Error(message as string), {
          source,
          line: lineno,
          column: colno
        });
      };

      // Track unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.trackError(event.reason, {
          type: 'unhandledrejection'
        });
      });

      // Track performance metrics
      if ('performance' in window) {
        this.trackPerformance();
      }
    }
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string {
    if (typeof window === 'undefined') return '';

    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = Math.random().toString(36).substring(2);
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  private initWhenReady() {
    if (document.readyState === 'complete') {
      this.processQueue();
    } else {
      window.addEventListener('load', () => this.processQueue());
    }
  }

  private processQueue() {
    this.isInitialized = true;
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      item?.();
    }
  }

  private enqueue(fn: () => void) {
    if (this.isInitialized) {
      fn();
    } else {
      this.queue.push(fn);
    }
  }

  private trackPerformance() {
    // Track Web Vitals
    const vitalsCallback = (metric: any) => {
      this.event({
        action: metric.name,
        category: 'Web Vitals',
        value: Math.round(metric.value),
        label: metric.id,
        nonInteraction: true
      });
    };

    webVitals.getFID(vitalsCallback);
    webVitals.getLCP(vitalsCallback);
    webVitals.getCLS(vitalsCallback);
    webVitals.getFCP(vitalsCallback);
    webVitals.getTTFB(vitalsCallback);

    // Track navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (timing) {
          this.event({
            action: 'timing',
            category: 'Performance',
            label: 'Navigation',
            navigationTiming: {
              dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
              tcpConnection: timing.connectEnd - timing.connectStart,
              serverResponse: timing.responseStart - timing.requestStart,
              domLoad: timing.domContentLoadedEventEnd - timing.responseEnd,
              fullPageLoad: timing.loadEventEnd - timing.responseEnd
            },
            nonInteraction: true
          });
        }
      }, 0);
    });
  }

  // Track page views
  pageview(path: string, title?: string) {
    const data: AnalyticsPageView = {
      path,
      title: title || document.title,
      referrer: document.referrer
    };

    this.enqueue(() => {
      // Google Analytics
      if (window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
          page_path: path,
          page_title: title,
          user_id: this.userId,
          session_id: this.sessionId
        });
      }

      if (this.debug) {
        console.log('[Analytics] Pageview:', data);
      }
    });
  }

  // Track events
  event({
    action,
    category,
    label,
    value,
    nonInteraction = false,
    ...customData
  }: AnalyticsEvent) {
    const data = {
      action,
      category,
      label,
      value,
      nonInteraction,
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      page: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer
      },
      ...customData
    };

    this.enqueue(() => {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value,
          non_interaction: nonInteraction,
          ...customData
        });
      }

      if (this.debug) {
        console.log('[Analytics] Event:', data);
      }
    });
  }

  // Track errors
  trackError(error: Error, context: Record<string, any> = {}) {
    const data: AnalyticsError = {
      error,
      ...context,
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      location: window.location.href
    };

    this.enqueue(() => {
      // Send to error tracking service (e.g., Sentry)
      if (window.Sentry) {
        window.Sentry.withScope((scope) => {
          scope.setExtras(context);
          window.Sentry.captureException(error);
        });
      }

      // Track in analytics
      this.event({
        action: 'error',
        category: 'Error',
        label: error.message,
        nonInteraction: true,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          ...context
        }
      });

      if (this.debug) {
        console.error('[Analytics] Error:', data);
      }
    });
  }
}

// Export singleton instance
export const Analytics = new AnalyticsService();
