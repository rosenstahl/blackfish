import { reportWebVitals } from 'next/web-vitals';

export class Performance {
  static marks: Set<string> = new Set();

  static initialize() {
    if (typeof window === 'undefined') return () => {};

    // Web Vitals
    reportWebVitals((metric) => {
      const { id, name, value, rating } = metric;
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', name, {
          event_category: 'Web Vitals',
          event_label: id,
          value: Math.round(value),
          non_interaction: true,
        });
      }
    });

    // Performance marks
    this.mark('app_init');
    
    window.addEventListener('load', () => {
      this.mark('app_loaded');
      this.measure('app_total_load', 'app_init', 'app_loaded');
    });

    // Resource timing
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (resourceEntry.duration > 1000) {
            console.warn(`Slow resource load: ${resourceEntry.name} - ${Math.round(resourceEntry.duration)}ms`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
    };
  }

  static mark(name: string) {
    if (typeof performance === 'undefined') return;
    if (this.marks.has(name)) return;

    performance.mark(name);
    this.marks.add(name);
  }

  static measure(name: string, startMark: string, endMark: string) {
    if (typeof performance === 'undefined') return;

    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      
      if (window.gtag) {
        window.gtag('event', 'performance_measure', {
          event_category: 'Performance',
          event_label: name,
          value: Math.round(measure.duration),
        });
      }
    } catch (error) {
      console.error(`Error measuring ${name}:`, error);
    }
  }

  static trackResources() {
    if (typeof window === 'undefined') return;

    const resources = performance.getEntriesByType('resource');
    const slowResources = resources.filter(r => r.duration > 1000);

    slowResources.forEach(resource => {
      console.warn(`Slow resource: ${resource.name} - ${Math.round(resource.duration)}ms`);
    });
  }
}