import { defineConfig, type PlaywrightTestConfig, type devices } from '@playwright/test'

const CI = process.env['CI'] === 'true'
const PORT = process.env['PORT'] || 3000

const baseURL = `http://localhost:${PORT}`

const config: PlaywrightTestConfig = {
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
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: ['--no-sandbox'],
          slowMo: CI ? 0 : process.env['SLOW_MO'] ? parseInt(process.env['SLOW_MO'], 10) : 0,
        }
      }
    },
    {
      name: 'Firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'Webkit',
      use: {
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'Mobile Chrome',
      use: {
        browserName: 'chromium',
        ...devices['Pixel 5']
      }
    },
    {
      name: 'Mobile Safari',
      use: {
        browserName: 'webkit',
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
  preserveOutput: 'failures-only',
  reportSlowTests: {
    max: 5,
    threshold: 15000
  },
  expect: {
    timeout: 10000,
    toMatchSnapshot: {
      maxDiffPixels: 50
    }
  },
  env: {
    POSTGRES_URL: process.env['TEST_DATABASE_URL'] || 'mock://postgres',
    REDIS_URL: process.env['TEST_REDIS_URL'] || 'mock://redis'
  },
  forbidOnly: CI,
  maxFailures: CI ? 1 : undefined,
  globalTimeout: CI ? 60 * 60 * 1000 : undefined
}

export default defineConfig(config)