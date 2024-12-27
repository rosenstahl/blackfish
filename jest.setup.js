import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock IntersectionObserver
class IntersectionObserver {
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
}

window.IntersectionObserver = IntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Setup MSW
require('./mocks/setup');

// Extend expect matchers
expect.extend({
  toHaveBeenCalledAfter(received, expected) {
    const receivedTime = received.mock.invocationCallOrder[0];
    const expectedTime = expected.mock.invocationCallOrder[0];

    return {
      pass: receivedTime > expectedTime,
      message: () => `Expected ${received.getMockName()} to have been called after ${expected.getMockName()}`
    };
  }
});