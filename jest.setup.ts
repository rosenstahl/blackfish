import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { server } from './__mocks__/server'

// Polyfills
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// Mocken von window.matchMedia
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
})

// Mocken von window.scrollTo
window.scrollTo = jest.fn()

class ResizeObserverMock {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

window.ResizeObserver = ResizeObserverMock

// Intersections Observer Mock
class IntersectionObserverMock {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

window.IntersectionObserver = IntersectionObserverMock

// MSW Setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Custom matchers
expect.extend({
  toHaveBeenCalledAfter(received: jest.Mock, expected: jest.Mock) {
    const receivedCalls = received.mock.invocationCallOrder
    const expectedCalls = expected.mock.invocationCallOrder

    if (receivedCalls.length === 0) {
      return {
        pass: false,
        message: () => `Expected ${received.getMockName()} to be called after ${expected.getMockName()}, but it was never called`
      }
    }

    if (expectedCalls.length === 0) {
      return {
        pass: false,
        message: () => `Expected ${received.getMockName()} to be called after ${expected.getMockName()}, but ${expected.getMockName()} was never called`
      }
    }

    const lastExpectedCall = Math.max(...expectedCalls)
    const firstReceivedCall = Math.min(...receivedCalls)

    return {
      pass: firstReceivedCall > lastExpectedCall,
      message: () => `Expected ${received.getMockName()} to be called after ${expected.getMockName()}`
    }
  }
})