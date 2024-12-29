import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

// Extend Vitest's expect with testing-library matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock IntersectionObserver
class IntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

// Mock ResizeObserver
class ResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.gtag
Object.defineProperty(window, 'gtag', {
  writable: true,
  value: vi.fn(),
});

// Mock performance API
const mockPerformance = {
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
  now: vi.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  }
};

Object.defineProperty(window, 'performance', {
  writable: true,
  value: mockPerformance,
});

// Mock LocalStorage
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number) {
    return Object.keys(this.store)[index] || null;
  }
}

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: new LocalStorageMock(),
});

Object.defineProperty(window, 'sessionStorage', {
  writable: true,
  value: new LocalStorageMock(),
});

// Mock Navigation API
class MockNavigator {
  sendBeacon = vi.fn(() => true);
  language = 'de';
  languages = ['de', 'en'];
  userAgent = 'test-agent';
  onLine = true;
}

Object.defineProperty(window, 'navigator', {
  writable: true,
  value: new MockNavigator(),
});

// Mock Console
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};

// Mock animation frame
global.requestAnimationFrame = vi.fn(callback => setTimeout(callback, 0));
global.cancelAnimationFrame = vi.fn(id => clearTimeout(id));

// Mock Sentry
Object.defineProperty(window, 'Sentry', {
  writable: true,
  value: {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
    withScope: vi.fn(callback => callback({ setExtras: vi.fn(), setTags: vi.fn() })),
    setUser: vi.fn(),
    setTag: vi.fn(),
    setExtra: vi.fn(),
  },
});

// Set default environment variables
process.env.NEXT_PUBLIC_GA_ID = 'test-ga-id';
process.env.NEXT_PUBLIC_SENTRY_DSN = 'test-sentry-dsn';
process.env.NODE_ENV = 'test';
