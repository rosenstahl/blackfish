import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals';

type MetricName = 'CLS' | 'FID' | 'LCP' | 'TTFB' | 'FCP';

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]>;
  private callbacks: Map<string, Function[]>;

  private constructor() {
    this.metrics = new Map();
    this.callbacks = new Map();
    this.initializeWebVitals();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeWebVitals() {
    if (typeof window !== 'undefined') {
      onCLS(this.handleMetric('CLS'));
      onFID(this.handleMetric('FID'));
      onLCP(this.handleMetric('LCP'));
      onTTFB(this.handleMetric('TTFB'));
    }
  }

  private handleMetric(metricName: MetricName) {
    return (metric: any) => {
      const currentValues = this.metrics.get(metricName) || [];
      currentValues.push(metric.value);
      this.metrics.set(metricName, currentValues);

      const callbacks = this.callbacks.get(metricName) || [];
      callbacks.forEach(callback => callback(metric.value));

      // Report to analytics if threshold exceeded
      this.checkThresholds(metricName, metric.value);
    };
  }

  private checkThresholds(metricName: MetricName, value: number) {
    const thresholds: Record<MetricName, number> = {
      CLS: 0.1,    // Good CLS threshold
      FID: 100,    // Good FID threshold (ms)
      LCP: 2500,   // Good LCP threshold (ms)
      TTFB: 600,   // Good TTFB threshold (ms)
      FCP: 1800    // Good FCP threshold (ms)
    };

    if (value > thresholds[metricName]) {
      console.warn(`Performance warning: ${metricName} value (${value}) exceeds threshold (${thresholds[metricName]})`);
      // Send to analytics or monitoring service
    }
  }

  public subscribe(metricName: MetricName, callback: Function) {
    const currentCallbacks = this.callbacks.get(metricName) || [];
    currentCallbacks.push(callback);
    this.callbacks.set(metricName, currentCallbacks);
  }

  public getMetrics() {
    const result: Record<string, { current: number; average: number }> = {};

    this.metrics.forEach((values, key) => {
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      result[key] = {
        current: values[values.length - 1],
        average
      };
    });

    return result;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();