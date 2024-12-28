import { Performance } from '../performance-monitoring';
import { Analytics } from '../analytics';

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    // Clear performance entries
    Performance.clearMetrics();
    
    // Mock performance APIs
    const mockPerformance = {
      now: jest.fn(() => Date.now()),
      mark: jest.fn(),
      measure: jest.fn(),
      clearMarks: jest.fn(),
      clearMeasures: jest.fn(),
      getEntriesByType: jest.fn().mockReturnValue([]),
      getEntries: jest.fn().mockReturnValue([])
    };
    global.performance = mockPerformance as any;

    // Mock PerformanceObserver
    global.PerformanceObserver = class {
      observe = jest.fn();
      disconnect = jest.fn();
      takeRecords = jest.fn();
    } as any;

    // Mock Analytics
    jest.spyOn(Analytics, 'event').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic functionality', () => {
    it('creates performance marks', () => {
      Performance.mark('test-mark');
      expect(performance.mark).toHaveBeenCalledWith('test-mark');
    });

    it('measures between marks', () => {
      Performance.mark('start');
      Performance.mark('end');
      Performance.measure('test-measure', 'start', 'end');
      expect(performance.measure).toHaveBeenCalledWith('test-measure', 'start', 'end');
    });

    it('tracks metrics', () => {
      Performance.mark('start');
      Performance.measure('test-measure', 'start');
      const metrics = Performance.getMetrics();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].name).toBe('test-measure');
    });

    it('clears all metrics', () => {
      Performance.mark('test');
      Performance.clearMetrics();
      expect(Performance.getMetrics()).toHaveLength(0);
      expect(performance.clearMarks).toHaveBeenCalled();
      expect(performance.clearMeasures).toHaveBeenCalled();
    });
  });

  describe('Resource monitoring', () => {
    beforeEach(() => {
      // Mock resource timing entries
      const mockResourceEntry = {
        name: 'https://example.com/script.js',
        initiatorType: 'script',
        duration: 1500,
        transferSize: 50000,
        nextHopProtocol: 'h2',
        redirectStart: 0,
        redirectEnd: 0,
        domainLookupStart: 100,
        domainLookupEnd: 150,
        connectStart: 150,
        connectEnd: 200,
        requestStart: 200,
        responseStart: 300,
        responseEnd: 400
      };

      performance.getEntriesByType.mockReturnValue([mockResourceEntry]);
    });

    it('tracks slow resources', () => {
      // Simulate resource load
      const observer = new PerformanceObserver(() => {});
      observer.observe({ entryTypes: ['resource'] });

      const metrics = Performance.getMetricsByCategory('Resource');
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].name).toBe('initial_slow_resource');
      expect(metrics[0].value).toBe(1500);
    });

    it('includes resource timing information', () => {
      const metrics = Performance.getMetricsByCategory('Resource');
      expect(metrics[0].timing).toEqual({
        redirect: 0,
        dns: 50,
        tcp: 50,
        request: 100,
        response: 100
      });
    });
  });

  describe('Error handling', () => {
    it('handles failed performance measurements gracefully', () => {
      performance.measure.mockImplementation(() => {
        throw new Error('Measurement failed');
      });

      expect(() => {
        Performance.measure('test', 'nonexistent-mark');
      }).not.toThrow();
    });

    it('warns about performance issues', () => {
      const consoleSpy = jest.spyOn(console, 'warn');
      Performance.mark('start');
      Performance.measure('slow-operation', 'start');
      
      // Simulate a very slow operation
      const metrics = Performance.getMetrics();
      metrics[0].value = 4000; // 4 seconds

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Performance issue detected'),
        expect.any(Object)
      );
    });
  });

  describe('Analytics integration', () => {
    it('sends metrics to analytics', () => {
      Performance.mark('start');
      Performance.measure('test-operation', 'start');

      expect(Analytics.event).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'performance_metric',
          category: 'Custom',
          label: 'test-operation'
        })
      );
    });

    it('includes detailed metric data', () => {
      Performance.mark('start');
      Performance.measure('test-operation', 'start');

      expect(Analytics.event).toHaveBeenCalledWith(
        expect.objectContaining({
          metric: expect.objectContaining({
            name: 'test-operation',
            category: 'Custom',
            startMark: 'start'
          })
        })
      );
    });
  });

  describe('Category filtering', () => {
    it('filters metrics by category', () => {
      // Add metrics of different categories
      Performance.mark('start');
      Performance.measure('perf-test', 'start');
      
      // Mock a resource metric
      const metrics = Performance.getMetrics();
      metrics.push({
        name: 'resource-test',
        value: 1000,
        category: 'Resource',
        timestamp: Date.now()
      });

      expect(Performance.getMetricsByCategory('Custom')).toHaveLength(1);
      expect(Performance.getMetricsByCategory('Resource')).toHaveLength(1);
    });
  });

  describe('Enable/Disable functionality', () => {
    it('can be disabled and enabled', () => {
      Performance.disable();
      Performance.mark('test');
      expect(performance.mark).not.toHaveBeenCalled();

      Performance.enable();
      Performance.mark('test');
      expect(performance.mark).toHaveBeenCalled();
    });

    it('cleans up observers when disabled', () => {
      const disconnectSpy = jest.spyOn(PerformanceObserver.prototype, 'disconnect');
      Performance.disable();
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});
