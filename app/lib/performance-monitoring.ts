export class PerformanceMonitoring {
  private readonly observer: PerformanceObserver | null;

  constructor() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      this.observer = null;
      return;
    }

    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(this.handlePerformanceEntry.bind(this));
    });

    this.observer.observe({
      entryTypes: ['paint', 'largest-contentful-paint', 'navigation']
    });
  }

  private handlePerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.trackMetric('FCP', entry.startTime);
        }
        break;
        
      case 'largest-contentful-paint':
        const lcp = entry as PerformanceEntry & { startTime: number };
        if (lcp?.startTime) {
          this.trackMetric('LCP', lcp.startTime);
        }
        break;

      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        this.trackMetric('TTFB', navEntry.responseStart);
        break;
    }
  }

  private trackMetric(name: string, value: number): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      window.gtag('event', 'performance_metric', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value)
      });
    }
  }

  measurePageLoad(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    window.addEventListener('load', () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        this.trackMetric('PageLoadTime', navigationTiming.loadEventEnd);
      }
    });
  }

  trackResources(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    const resources = performance.getEntriesByType('resource');
    resources.forEach((resource) => {
      this.trackMetric('ResourceLoadTime', resource.duration);
    });
  }

  trackErrors(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      if ('gtag' in window) {
        window.gtag('event', 'javascript_error', {
          event_category: 'Error',
          event_label: event.error?.message || 'Unknown error',
          value: 1
        });
      }
    });
  }
}