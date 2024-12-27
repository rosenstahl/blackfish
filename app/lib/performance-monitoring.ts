// app/lib/monitoring.ts
import { Analytics } from './analytics';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

const thresholds = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 }
};

export class PerformanceMonitoring {
  private static metrics: Map<string, PerformanceMetric> = new Map();
  private static observers: PerformanceObserver[] = [];

  static init() {
    if (typeof window === 'undefined') return;

    this.observeFCP();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeTTFB();
    this.observeMemory();
    this.observeResourceTiming();
  }

  private static observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[entries.length - 1];
        this.trackMetric('FCP', fcp.startTime);
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.error('FCP observation failed:', e);
    }
  }

  private static observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        this.trackMetric('LCP', lcp.startTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.error('LCP observation failed:', e);
    }
  }

  private static observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fid = entries[entries.length - 1] as PerformanceEventTiming;
        this.trackMetric('FID', fid.processingStart - fid.startTime);
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (e) {
      console.error('FID observation failed:', e);
    }
  }

  private static observeCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as LayoutShift;
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
            this.trackMetric('CLS', clsValue);
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (e) {
      console.error('CLS observation failed:', e);
    }
  }

  private static observeTTFB() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const navigation = entries[entries.length - 1] as PerformanceNavigationTiming;
        this.trackMetric('TTFB', navigation.responseStart - navigation.requestStart);
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (e) {
      console.error('TTFB observation failed:', e);
    }
  }

  private static observeMemory() {
    try {
      if ('memory' in performance) {
        setInterval(() => {
          const memory = (performance as any).memory;
          this.trackMetric('JSHeapSize', memory.usedJSHeapSize);
        }, 5000);
      }
    } catch (e) {
      console.error('Memory observation failed:', e);
    }
  }

  private static observeResourceTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'resource') {
            this.trackMetric(
              `Resource-${entry.name}`,
              entry.duration
            );
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (e) {
      console.error('Resource timing observation failed:', e);
    }
  }

  private static getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private static trackMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      rating: this.getRating(name, value)
    };

    this.metrics.set(name, metric);
    this.reportMetric(metric);
  }

  private static reportMetric(metric: PerformanceMetric) {
    Analytics.event({
      action: 'performance_metric',
      category: 'Performance',
      label: metric.name,
      value: Math.round(metric.value),
      metric_rating: metric.rating
    });
  }

  public static cleanup() {
    if (typeof window === 'undefined') return;
    
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers = [];
    this.metrics.clear();
  }

  public static getMetrics() {
    return Array.from(this.metrics.values());
  }
}