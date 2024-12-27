import { defineConfig, devices } from '@playwright/test'
import path from 'path'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  timeout: 30000,
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined,
  retries: process.env.CI ? 2 : 0,
    fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  maxFailures: process.env.CI ? 10 : undefined,
  
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],
  
  /* Output Settings */
  outputDir: 'test-results/',
  snapshotDir: 'test-snapshots/',
  
  /* Shared Settings */
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
    toMatchSnapshot: {
      threshold: 0.2,
    },
  },

  /* Global Setup */
  globalSetup: require.resolve('./global-setup'),
  
  /* Use Options */
  use: {
    // Browser Configuration
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Artifacts
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    
    // Test Utilities
    testIdAttribute: 'data-testid',
    
    // Timeouts
    actionTimeout: 10000,
    navigationTimeout: 15000,
    
    // Automatic Features
    bypassCSP: true,
    acceptDownloads: true,
    
    // Browser Launch Options
    launchOptions: {
      slowMo: process.env.CI ? 0 : 0,
      args: ['--disable-dev-shm-usage']
    },
  },

  /* Projects for Different Browsers & Devices */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad Pro 11'] },
    }
  ],

  /* Development Server Configuration */
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    env: {
      NODE_ENV: 'test',
      POSTGRES_URL: 'mock://postgres',
      TEST_MODE: 'true'
    },
  },

  /* Output Preservation */
  preserveOutput: process.env.CI ? 'failures-only' : 'always',
  
  /* Slow Test Reporting */
  reportSlowTests: {
    max: 5,
    threshold: 15000
  },
})

// Optional Custom Global Setup
async function globalSetup() {
  // Custom setup code here
  // For example, database seeding, authentication setup, etc.
}