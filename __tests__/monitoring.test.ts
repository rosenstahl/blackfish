import { monitoring } from '../app/lib/monitoring';

describe('RealUserMonitoring', () => {
  beforeEach(() => {
    // Mock PerformanceObserver
    global.PerformanceObserver = class {
      constructor(callback: any) {
        this.callback = callback;
      }
      observe() {}
      disconnect() {}
    } as any;

    // Mock performance.memory
    Object.defineProperty(global.performance, 'memory', {
      value: {
        jsHeapSizeLimit: 2048 * 1024 * 1024,
        totalJSHeapSize: 1024 * 1024 * 1024,
        usedJSHeapSize: 512 * 1024 * 1024
      },
      configurable: true
    });
  });

  it('should initialize correctly', () => {
    const metrics = monitoring.getMetrics();
    expect(metrics).toBeDefined();
    expect(metrics.pageLoads).toBe(0);
    expect(metrics.resourceLoads).toEqual([]);
  });

  it('should track web vitals', () => {
    const observer = new PerformanceObserver(() => {});
    const entries = [
      {
        entryType: 'paint',
        name: 'first-contentful-paint',
        startTime: 1000,
        duration: 0
      },
      {
        entryType: 'largest-contentful-paint',
        startTime: 2000,
        duration: 0
      }
    ];

    observer.callback({ getEntries: () => entries });
    const metrics = monitoring.getMetrics();

    expect(metrics.fcp).toBe(1000);
    expect(metrics.lcp).toBe(2000);
  });

  it('should track memory usage', () => {
    jest.useFakeTimers();
    const metrics = monitoring.getMetrics();
    
    jest.advanceTimersByTime(10000);
    
    expect(metrics.jsHeapSize).toBeGreaterThan(0);
    expect(metrics.memoryUsage).toBeGreaterThan(0);
  });

  it('should track DOM size changes', () => {
    const observer = new MutationObserver(() => {});
    document.body.innerHTML = '<div><span></span></div>';
    
    observer.callback([{ type: 'childList' }]);
    const metrics = monitoring.getMetrics();
    
    expect(metrics.domNodes).toBeGreaterThan(0);
  });

  it('should track FPS', () => {
    jest.useFakeTimers();
    const metrics = monitoring.getMetrics();
    
    // Simulate 60 frames in 1 second
    for (let i = 0; i < 60; i++) {
      jest.advanceTimersByTime(1000 / 60);
      jest.runOnlyPendingTimers();
    }
    
    expect(metrics.fps.length).toBeGreaterThan(0);
    expect(Math.max(...metrics.fps)).toBeLessThanOrEqual(60);
  });

  it('should handle errors', () => {
    const error = new Error('Test error');
    window.dispatchEvent(new ErrorEvent('error', { error }));
    
    // Check if error was tracked
    const metrics = monitoring.getMetrics();
    expect(metrics.errors).toBeDefined();
  });
});
