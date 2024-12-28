import { Analytics } from '../analytics';

describe('Analytics Service', () => {
  beforeEach(() => {
    // Mock window.gtag
    window.gtag = jest.fn();

    // Mock storage
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockStorage });
    Object.defineProperty(window, 'sessionStorage', { value: { ...mockStorage } });

    // Mock navigator.sendBeacon
    Object.defineProperty(window.navigator, 'sendBeacon', {
      value: jest.fn().mockReturnValue(true),
      configurable: true
    });

    // Mock performance
    const mockPerformanceEntry = {
      duration: 1000,
      domContentLoadedEventEnd: 800,
      responseStart: 200
    };
    global.performance.getEntriesByType = jest.fn().mockReturnValue([mockPerformanceEntry]);

    // Reset debug mode
    Analytics['debug'] = process.env.NODE_ENV === 'development';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Page View Tracking', () => {
    it('tracks page views correctly', () => {
      const path = '/test-page';
      const title = 'Test Page';

      Analytics.pageview(path, title);

      expect(window.gtag).toHaveBeenCalledWith('config', expect.any(String), {
        page_path: path,
        page_title: title,
        user_id: expect.any(String),
        session_id: expect.any(String)
      });
    });

    it('includes referrer information', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://example.com',
        configurable: true
      });

      Analytics.pageview('/test');

      expect(window.gtag).toHaveBeenCalledWith(
        'config',
        expect.any(String),
        expect.objectContaining({
          referrer: 'https://example.com'
        })
      );
    });
  });

  describe('Event Tracking', () => {
    it('tracks events with all parameters', () => {
      const event = {
        action: 'test_action',
        category: 'test_category',
        label: 'test_label',
        value: 123,
        nonInteraction: true
      };

      Analytics.event(event);

      expect(window.gtag).toHaveBeenCalledWith('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction
      });
    });

    it('includes timestamp and session data', () => {
      Analytics.event({
        action: 'test',
        category: 'test'
      });

      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        expect.any(String),
        expect.objectContaining({
          timestamp: expect.any(String),
          session_id: expect.any(String),
          user_id: expect.any(String)
        })
      );
    });

    it('sends events immediately after initialization', () => {
      Analytics.event({
        action: 'immediate_test',
        category: 'test'
      });

      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'immediate_test',
        expect.any(Object)
      );
    });

    it('includes page context with events', () => {
      const mockLocation = 'https://example.com/test';
      const mockTitle = 'Test Page';

      Object.defineProperty(window, 'location', {
        value: { href: mockLocation },
        configurable: true
      });
      Object.defineProperty(document, 'title', {
        value: mockTitle,
        configurable: true
      });

      Analytics.event({
        action: 'test',
        category: 'test'
      });

      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        expect.any(String),
        expect.objectContaining({
          page: expect.objectContaining({
            url: mockLocation,
            title: mockTitle
          })
        })
      );
    });
  });

  describe('Error Tracking', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('tracks errors with context', () => {
      const error = new Error('Test error');
      const context = {
        component: 'TestComponent',
        action: 'testAction'
      };

      Analytics.trackError(error, context);

      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'error',
        expect.objectContaining({
          event_category: 'Error',
          event_label: 'Test error',
          error: expect.objectContaining({
            message: 'Test error',
            stack: expect.any(String),
            name: 'Error'
          }),
          context
        })
      );
    });

    it('sanitizes sensitive information from errors', () => {
      const sensitiveError = new Error(
        'Error with email: user@example.com and token: xyz123'
      );

      Analytics.trackError(sensitiveError);

      const calls = window.gtag.mock.calls;
      const eventData = calls[calls.length - 1][2];

      expect(eventData.error.message).not.toContain('user@example.com');
      expect(eventData.error.message).not.toContain('xyz123');
    });

    it('includes performance metrics with error tracking', () => {
      Analytics.trackError(new Error('Test error'));

      const calls = window.gtag.mock.calls;
      const eventData = calls[calls.length - 1][2];

      expect(eventData.performance).toBeDefined();
      expect(eventData.performance.timing).toEqual(
        expect.objectContaining({
          loadTime: expect.any(Number),
          domReady: expect.any(Number)
        })
      );
    });
  });

  describe('Development Mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      Analytics['debug'] = true;
      console.log = jest.fn();
    });

    afterEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('logs events to console in development', () => {
      Analytics.event({
        action: 'test',
        category: 'test'
      });

      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] Event:',
        expect.any(Object)
      );
    });

    it('logs page views to console', () => {
      Analytics.pageview('/test', 'Test Page');

      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] Pageview:',
        expect.any(Object)
      );
    });
  });

  describe('Session and User Management', () => {
    it('maintains consistent session ID within session', () => {
      Analytics.pageview('/page1');
      const firstSessionId = window.gtag.mock.calls[0][2].session_id;

      Analytics.pageview('/page2');
      const secondSessionId = window.gtag.mock.calls[1][2].session_id;

      expect(firstSessionId).toBe(secondSessionId);
    });

    it('generates new session ID after session storage clear', () => {
      Analytics.pageview('/page1');
      const firstSessionId = window.gtag.mock.calls[0][2].session_id;

      sessionStorage.clear();
      Analytics.pageview('/page2');
      const secondSessionId = window.gtag.mock.calls[1][2].session_id;

      expect(firstSessionId).not.toBe(secondSessionId);
    });

    it('maintains user ID across sessions', () => {
      Analytics.pageview('/page1');
      const firstUserId = window.gtag.mock.calls[0][2].user_id;

      sessionStorage.clear();
      Analytics.pageview('/page2');
      const secondUserId = window.gtag.mock.calls[1][2].user_id;

      expect(firstUserId).toBe(secondUserId);
    });
  });
});
