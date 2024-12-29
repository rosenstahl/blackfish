// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  // Test Environment
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Module Resolution
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/app/components/$1',
    '^@lib/(.*)$': '<rootDir>/app/lib/$1',
    '^@hooks/(.*)$': '<rootDir>/app/hooks/$1',
    '^@context/(.*)$': '<rootDir>/app/context/$1',
    '^@utils/(.*)$': '<rootDir>/app/utils/$1',
    '^@styles/(.*)$': '<rootDir>/app/styles/$1',
    '^@types/(.*)$': '<rootDir>/app/types/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$': '<rootDir>/__mocks__/fileMock.js'
  },

  // Test Files Pattern
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  
  // Coverage Configuration
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/__tests__/**',
    '!**/__mocks__/**',
    '!**/jest.config.js',
    '!**/jest.setup.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './app/components/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    }
  },
  coverageReporters: [
    'json',
    'lcov',
    'text',
    'clover',
    'cobertura'
  ],
  
  // Performance Optimization
  maxWorkers: '50%',
  maxConcurrency: 5,
  detectOpenHandles: true,
  detectLeaks: true,
  
  // Test Utilities
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-select-projects',
    'jest-watch-suspend',
  ],
  
  // Reporter Configuration
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'coverage/junit',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true,
      addFileAttribute: true,
      reportTestSuiteErrors: true,
    }],
    ['jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: 'coverage/test-report.html',
      includeFailureMsg: true,
      includeSuiteFailure: true,
    }],
  ],
  
  // Other Options
  verbose: true,
  testTimeout: 10000,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  errorOnDeprecated: true,
  notify: true,
  notifyMode: 'failure-change',
  
  // Transform Configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    '^.+\\.module\\.(css|sass|scss)$': 'jest-css-modules-transform',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@.*)/).+\.js$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  // Global Configuration
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
      diagnostics: false,
      isolatedModules: true,
    },
    'jest-runner': {
      showMultipleWorkerWarning: true,
    },
  },

  // Environment Variables
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
}

module.exports = createJestConfig(customJestConfig)