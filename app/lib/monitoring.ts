import { performanceMonitor } from './performance';
import { errorTracker } from './errorTracking';
import { analytics } from './analytics';

type PerformanceMetrics = {
  fcp: number;  // First Contentful Paint
  lcp: number;  // Largest Contentful Paint
  fid: number;  // First Input Delay
  cls: number;  // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  pageLoads: number;
  resourceLoads: PerformanceResourceTiming[];
  longTasks: number;
  memoryUsage: number;
  jsHeapSize: number;
  domNodes: number;
  fps: number[];
};

class RealUserMonitoring {
  private static instance: RealUserMonitoring;
  private metrics: PerformanceMetrics = {
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    pageLoads: 0,
    resourceLoads: [],
    longTasks: 0,
    memoryUsage: 0,
    jsHeapSize: 0,
    domNodes: 0,
    fps: []
  };

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring() {
    // Core Web Vitals Monitoring
    const webVitals = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.processWebVitalEntry(entry);
      }
    });

    webVitals.observe({ 
      entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] 
    });

    // Resource Timing
    const resources = new PerformanceObserver((entryList) => {
      this.processResourceEntries(entryList.getEntries() as PerformanceResourceTiming[]);
    });

    resources.observe({ entryTypes: ['resource'] });

    // Long Tasks
    const longTasks = new PerformanceObserver((entryList) => {
      this.processLongTasks(entryList.getEntries());
    });

    longTasks.observe({ entryTypes: ['longtask'] });

    // Memory Usage
    this.monitorMemoryUsage();

    // DOM Size
    this.monitorDOMSize();

    // FPS Monitoring
    this.monitorFPS();

    // Error Monitoring
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));
  }

  private processWebVitalEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.reportMetric('FCP', entry.startTime);
        }
        break;
      case 'largest-contentful-paint':
        this.metrics.lcp = entry.startTime;
        this.reportMetric('LCP', entry.startTime);
        break;
      case 'first-input':
        this.metrics.fid = (entry as any).processingStart - entry.startTime;
        this.reportMetric('FID', this.metrics.fid);
        break;
      case 'layout-shift':
        if (!(entry as any).hadRecentInput) {
          this.metrics.cls += (entry as any).value;
          this.reportMetric('CLS', this.metrics.cls);
        }
        break;
    }
  }

  private processResourceEntries(entries: PerformanceResourceTiming[]) {
    entries.forEach(entry => {
      const timing = {
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize,
        type: entry.initiatorType
      };

      if (entry.duration > 1000) {
        this.reportSlowResource(timing);
      }

      this.metrics.resourceLoads.push(entry);
    });
  }

  private processLongTasks(entries: PerformanceEntry[]) {
    entries.forEach(entry => {
      this.metrics.longTasks++;
      this.reportLongTask({
        duration: entry.duration,
        timestamp: entry.startTime
      });
    });
  }

  private monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.jsHeapSize = memory.usedJSHeapSize;
        this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

        if (this.metrics.memoryUsage > 0.9) {
          this.reportHighMemoryUsage({
            usedHeap: this.metrics.jsHeapSize,
            totalHeap: memory.jsHeapSizeLimit
          });
        }
      }, 10000);
    }
  }

  private monitorDOMSize() {
    const observer = new MutationObserver(() => {
      this.metrics.domNodes = document.getElementsByTagName('*').length;
      if (this.metrics.domNodes > 1500) {
        this.reportLargeDOMSize(this.metrics.domNodes);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private monitorFPS() {
    let lastTime = performance.now();
    let frames = 0;

    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round(frames * 1000 / (currentTime - lastTime));
        this.metrics.fps.push(fps);
        
        if (fps < 30) {
          this.reportLowFPS(fps);
        }

        frames = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  private handleError(event: ErrorEvent) {
    errorTracker.captureError({
      message: event.message,
      stack: event.error?.stack,
      severity: 'high',
      tags: {
        type: 'runtime_error'
      }
    });
  }

  private handlePromiseError(event: PromiseRejectionEvent) {
    errorTracker.captureError({
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      severity: 'high',
      tags: {
        type: 'promise_rejection'
      }
    });
  }

  private reportMetric(name: string, value: number) {
    analytics.trackEvent('performance_metric', {
      metric_name: name,
      value: value
    });
  }

  private reportSlowResource(timing: any) {
    analytics.trackEvent('slow_resource', timing);
  }

  private reportLongTask(task: any) {
    analytics.trackEvent('long_task', task);
  }

  private reportHighMemoryUsage(memory: any) {
    analytics.trackEvent('high_memory_usage', memory);
  }

  private reportLargeDOMSize(size: number) {
    analytics.trackEvent('large_dom_size', { size });
  }

  private reportLowFPS(fps: number) {
    analytics.trackEvent('low_fps', { fps });
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
}

export const monitoring = RealUserMonitoring.getInstance();