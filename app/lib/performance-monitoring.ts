import { Analytics } from './analytics';

interface PerformanceMetric {
  name: string;
  value: number;
  category: string;
  timestamp: number;
  [key: string]: any;
}

export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, PerformanceMetric> = new Map();
  private observers: PerformanceObserver[] = [];
  private isEnabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupObservers();
      this.trackInitialLoad();
      this.trackResourceLoading();
    }
  }

  private setupObservers() {
    // Resource Timing
    this.createObserver('resource', (entry) => {
      const resource = entry as PerformanceResourceTiming;
      if (resource.duration > 1000) {
        this.trackMetric({
          name: 'slow_resource',
          value: resource.duration,
          category: 'Resource',
          url: resource.name,
          type: resource.initiatorType
        });
      }
    });

    // Long Tasks
    this.createObserver('longtask', (entry) => {
      this.trackMetric({
        name: 'long_task',
        value: entry.duration,
        category: 'Performance',
        startTime: entry.startTime
      });
    });

    // Layout Shifts
    this.createObserver('layout-shift', (entry: any) => {
      if (!entry.hadRecentInput) {
        this.trackMetric({
          name: 'layout_shift',
          value: entry.value,
          category: 'Layout',
          sources: entry.sources
        });
      }
    });

    // First Paint & First Contentful Paint
    this.createObserver('paint', (entry) => {
      this.trackMetric({
        name: entry.name,
        value: entry.startTime,
        category: 'Paint'
      });
    });

    // Element Timing
    this.createObserver('element', (entry: any) => {
      this.trackMetric({
        name: 'element_timing',
        value: entry.startTime,
        category: 'Element',
        element: entry.identifier || entry.id,
        renderTime: entry.renderTime
      });
    });

    // Largest Contentful Paint
    this.createObserver('largest-contentful-paint', (entry: any) => {
      this.trackMetric({
        name: 'largest_contentful_paint',
        value: entry.startTime,
        category: 'Paint',
        element: entry.element?.tagName,
        size: entry.size
      });
    });
  }

  private createObserver(entryType: string, callback: (entry: PerformanceEntry) => void) {
    if (!this.isEnabled || !PerformanceObserver.supportedEntryTypes?.includes(entryType)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });

      observer.observe({ entryTypes: [entryType] });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to create observer for ${entryType}:`, error);
    }
  }

  private trackInitialLoad() {
    window.addEventListener('load', () => {
      // Navigation Timing
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (timing) {
        this.trackMetric({
          name: 'page_load',
          value: timing.loadEventEnd - timing.navigationStart,
          category: 'Navigation',
          navigationTiming: {
            domComplete: timing.domComplete,
            domInteractive: timing.domInteractive,
            domContentLoaded: timing.domContentLoadedEventEnd,
            firstByte: timing.responseStart,
            loadEvent: timing.loadEventEnd
          }
        });
      }

      // Memory Usage
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.trackMetric({
          name: 'memory_usage',
          value: memory.usedJSHeapSize,
          category: 'Memory',
          totalHeapSize: memory.totalJSHeapSize,
          heapLimit: memory.jsHeapSizeLimit
        });
      }
    }, { once: true });
  }

  private trackResourceLoading() {
    const resources = performance.getEntriesByType('resource');
    const slowResources = resources.filter(r => r.duration > 1000);

    slowResources.forEach(resource => {
      this.trackMetric({
        name: 'initial_slow_resource',
        value: resource.duration,
        category: 'Resource',
        url: resource.name,
        type: resource.initiatorType,
        size: (resource as PerformanceResourceTiming).transferSize
      });
    });
  }

  private trackMetric(data: Omit<PerformanceMetric, 'timestamp'>) {
    const metric: PerformanceMetric = {
      ...data,
      timestamp: Date.now()
    };

    this.measures.set(`${metric.category}_${metric.name}`, metric);

    Analytics.event({
      action: 'performance_metric',
      category: metric.category,
      label: metric.name,
      value: Math.round(metric.value),
      nonInteraction: true,
      ...metric
    });

    if (metric.value > 3000 || metric.category === 'Error') {
      console.warn(`Performance issue detected: ${metric.name}`, metric);
    }
  }

  // Public API
  mark(name: string) {
    if (!this.isEnabled) return;
    const time = performance.now();
    this.marks.set(name, time);
    performance.mark(name);
  }

  measure(name: string, startMark: string, endMark?: string) {
    if (!this.isEnabled) return;

    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();

    if (start && end) {
      const duration = end - start;
      this.trackMetric({
        name,
        value: duration,
        category: 'Custom',
        startMark,
        endMark,
        start,
        end
      });

      try {
        performance.measure(name, startMark, endMark);
      } catch (error) {
        console.warn(`Failed to create performance measure: ${name}`, error);
      }
    }
  }

  getMetrics() {
    return Array.from(this.measures.values());
  }

  getMetricsByCategory(category: string) {
    return this.getMetrics().filter(metric => metric.category === category);
  }

  clearMetrics() {
    this.measures.clear();
    this.marks.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }

  enable() {
    this.isEnabled = true;
    this.setupObservers();
  }

  disable() {
    this.isEnabled = false;
    this.disconnect();
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clearMetrics();
  }
}

// Export singleton instance
export const Performance = new PerformanceMonitor();
