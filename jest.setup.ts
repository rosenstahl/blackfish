import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { handlers } from './__mocks__/handlers'
import { TextEncoder, TextDecoder } from 'util'

// MSW Server Setup
export const server = setupServer(...handlers)

// Global Setup
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback: any) {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return [] }
} as any

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
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
})

// Mock console methods for tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn
const originalConsoleLog = console.log

beforeAll(() => {
  console.error = jest.fn()
  console.warn = jest.fn()
  console.log = jest.fn()
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
  console.log = originalConsoleLog
  server.close()
})

// Custom Jest Matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
})

// Error handling for unhandled rejections and exceptions
process.on('unhandledRejection', (reason: string) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...', reason)
  throw new Error(reason)
})

// Custom Environment Variables for Testing
process.env = {
  ...process.env,
  NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
  NODE_ENV: 'test',
}