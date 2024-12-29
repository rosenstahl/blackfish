import { initSentry, ErrorTracking } from '../sentry';
import * as Sentry from '@sentry/nextjs';

jest.mock('@sentry/nextjs', () => ({
  init: jest.fn(),
  withScope: jest.fn((cb) => cb({ setExtras: jest.fn(), setTag: jest.fn(), setExtra: jest.fn() })),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setExtra: jest.fn(),
  BrowserTracing: jest.fn(),
  Replay: jest.fn()
}));

describe('Sentry Integration', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'test-dsn';
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_VERSION = '1.0.0';

    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    // Mock performance API
    const mockPerformanceEntry = {
      duration: 1000,
      domContentLoadedEventEnd: 800,
      responseStart: 200
    };
    global.performance.getEntriesByType = jest.fn().mockReturnValue([mockPerformanceEntry]);
  });

  describe('Initialization', () => {
    it('initializes Sentry with correct configuration', () => {
      initSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          dsn: 'test-dsn',
          environment: 'production',
          release: '1.0.0'
        })
      );
    });

    it('sets up integrations correctly', () => {
      initSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          integrations: expect.arrayContaining([
            expect.any(Sentry.BrowserTracing),
            expect.any(Sentry.Replay)
          ])
        })
      );
    });
  });

  describe('Error Tracking', () => {
    it('captures errors with context', () => {
      const error = new Error('Test error');
      const context = { additionalInfo: 'test' };

      ErrorTracking.captureError(error, context);

      expect(Sentry.withScope).toHaveBeenCalled();
      expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });

    it('captures messages with severity', () => {
      ErrorTracking.captureMessage('Test message', 'warning');

      expect(Sentry.captureMessage).toHaveBeenCalledWith('Test message', 'warning');
    });

    it('sets user context', () => {
      const user = { id: '123', email: 'test@example.com' };

      ErrorTracking.setUser(user);

      expect(Sentry.setUser).toHaveBeenCalledWith(user);
    });

    it('sets tags and extras', () => {
      ErrorTracking.setTag('key', 'value');
      ErrorTracking.setExtra('details', { test: true });

      expect(Sentry.setTag).toHaveBeenCalledWith('key', 'value');
      expect(Sentry.setExtra).toHaveBeenCalledWith('details', { test: true });
    });
  });

  describe('Data Sanitization', () => {
    it('sanitizes error messages', () => {
      const sensitiveError = new Error('Error with email@test.com and card 4111-1111-1111-1111');

      ErrorTracking.captureError(sensitiveError);

      expect(Sentry.captureException).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.not.stringContaining('email@test.com')
        })
      );
    });

    it('sanitizes URLs in breadcrumbs', () => {
      initSentry();
      const config = Sentry.init.mock.calls[0][0];
      const breadcrumb = {
        category: 'navigation',
        data: {
          to: 'https://example.com?token=secret123',
          from: 'https://example.com/users?password=123456'
        }
      };

      const sanitizedBreadcrumb = config.beforeBreadcrumb?.(breadcrumb);

      expect(sanitizedBreadcrumb?.data.to).not.toContain('secret123');
      expect(sanitizedBreadcrumb?.data.from).not.toContain('123456');
    });
  });

  describe('Development Mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      console.error = jest.fn();
      console.log = jest.fn();
    });

    it('logs to console instead of sending to Sentry', () => {
      const error = new Error('Test error');
      ErrorTracking.captureError(error);

      expect(Sentry.captureException).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it('logs messages to console', () => {
      ErrorTracking.captureMessage('Test message', 'info');

      expect(Sentry.captureMessage).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });
  });
});
