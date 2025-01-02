import { defineConfig, devices } from '@playwright/test'

const CI = process.env['CI'] === 'true'
const PORT = process.env['PORT'] || 3000

const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  timeout: 30 * 1000,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  reporter: CI ? 'dot' : 'list',
  use: {
    baseURL: process.env['BASE_URL'] || 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'Chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: ['--no-sandbox'],
          slowMo: CI ? 0 : process.env['SLOW_MO'] ? parseInt(process.env['SLOW_MO'], 10) : 0
        }
      }
    },
    {
      name: 'Firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'Webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5']
      }
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12']
      }
    }
  ],
  webServer: {
    command: 'npm run start',
    url: baseURL,
    reuseExistingServer: !CI,
    timeout: 120 * 1000
  },
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  outputDir: 'test-results',
  reportSlowTests: {
    max: 5,
    threshold: 15000
  },
  expect: {
    timeout: 10000,
    toMatchSnapshot: {
      maxDiffPixels: 50
    }
  }
})