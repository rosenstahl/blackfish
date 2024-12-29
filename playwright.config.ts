import { defineConfig, devices } from '@playwright/test'
import path from 'path'

const CI = process.env.CI === 'true'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  timeout: 30000,
  globalTimeout: CI ? 60 * 60 * 1000 : undefined,
  retries: CI ? 2 : 0,
  fullyParallel: true,
  workers: CI ? 1 : '50%',
  maxFailures: CI ? 10 : undefined,
  
  reporter: [
    ['html', { open: CI ? 'never' : 'on-failure' }],
    ['line'],
    ['list'],
    ['junit', { 
      outputFile: 'test-results/junit.xml',
      embedAnnotationsAsProperties: true,
      attachments: true
    }],
    ['json', { 
      outputFile: 'test-results/test-results.json',
      embedAnnotationsAsProperties: true
    }],
    ['blob']
  ],
  
  /* Output Settings */
  outputDir: path.join(process.cwd(), 'test-results'),
  snapshotDir: path.join(process.cwd(), 'test-snapshots'),
  
  /* Shared Settings */
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled'
    },
    toMatchSnapshot: {
      threshold: 0.2,
      maxDiffPixelRatio: 0.1
    },
  },

  /* Global Setup */
  globalSetup: require.resolve('./e2e/global-setup'),
  
  /* Use Options */
  use: {
    // Browser Configuration
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: CI,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Artifacts
    screenshot: 'only-on-failure',
    trace: CI ? 'retain-on-failure' : 'on-first-retry',
    video: CI ? 'retain-on-failure' : 'on-first-retry',
    
    // Test Utilities
    testIdAttribute: 'data-testid',
    
    // Timeouts
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    // Automatic Features
    bypassCSP: true,
    acceptDownloads: true,
    isMobile: false,
    hasTouch: false,
    javaScriptEnabled: true,
    
    // Browser Launch Options
    launchOptions: {
      slowMo: CI ? 0 : process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 0,
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-extensions'
      ],
      firefoxUserPrefs: {
        'media.navigator.streams.fake': true,
        'media.navigator.permission.disabled': true
      },
      chromiumSandbox: false,
      handleSIGINT: true,
      handleSIGTERM: true,
      handleSIGHUP: true,
      timeout: 60000
    },
  },

  /* Projects for Different Browsers & Devices */
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        permissions: ['geolocation', 'notifications']
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        permissions: ['geolocation', 'notifications']
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        permissions: ['geolocation', 'notifications']
      },
    },
    
    // Mobile Devices
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        permissions: ['geolocation', 'notifications'],
        isMobile: true,
        hasTouch: true
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 13'],
        permissions: ['geolocation', 'notifications'],
        isMobile: true,
        hasTouch: true
      },
    },
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro 11'],
        permissions: ['geolocation', 'notifications'],
        isMobile: true,
        hasTouch: true
      },
    },
    
    // Special Configurations
    {
      name: 'accessibility',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
        reducedMotion: 'reduce',
        forcedColors: 'active'
      },
    }
  ],

  /* Development Server Configuration */
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !CI,
    env: {
      NODE_ENV: 'test',
      POSTGRES_URL: process.env.TEST_DATABASE_URL || 'mock://postgres',
      REDIS_URL: process.env.TEST_REDIS_URL || 'mock://redis',
      TEST_MODE: 'true'
    },
  },

  /* Output Preservation */
  preserveOutput: CI ? 'failures-only' : 'always',
  
  /* Slow Test Reporting */
  reportSlowTests: {
    max: 5,
    threshold: 15000
  },
  
  /* Additional Configuration */
  forbidOnly: CI,
  globalTeardown: require.resolve('./e2e/global-teardown'),
  grepInvert: null,
  quiet: CI,
  updateSnapshots: CI ? 'none' : 'all',
})
