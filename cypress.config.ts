import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    
    // Viewport Configuration
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test Configuration
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    
    // Video & Screenshot Settings
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    videoUploadOnPasses: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    
    // Timeouts & Retries
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    // Experimental Features
    experimentalStudio: true,
    experimentalWebKitSupport: true,
    
    // Browser Configuration
    chromeWebSecurity: false,
    blockHosts: ['*google-analytics.com', '*hotjar.com'],
    
    // Test Execution
    watchForFileChanges: true,
    numTestsKeptInMemory: 50,
    includeShadowDom: true,
    waitForAnimations: true,
    
    // Reporter Configuration
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
    },
    
    // Custom Setup
    setupNodeEvents(on, config) {
      // Task Configuration
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        },
      })

      // File Preprocessor
      on('file:preprocessor', require('@cypress/webpack-preprocessor')({
        webpackOptions: {
          resolve: {
            extensions: ['.ts', '.tsx', '.js'],
          },
          module: {
            rules: [
              {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                use: [
                  {
                    loader: 'ts-loader',
                    options: {
                      transpileOnly: true,
                    },
                  },
                ],
              },
            ],
          },
        },
      }))

      // Environment Handling
      const environmentName = config.env.environmentName || 'development'
      const environmentFilename = `cypress/config/${environmentName}.json`
      
      return require(environmentFilename)
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
      webpackConfig: {
        resolve: {
          alias: {
            '@': '.'
          }
        }
      }
    },
    
    // Component Testing Settings
    specPattern: '**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
    
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },

  // Global Settings
  env: {
    apiUrl: 'http://localhost:3000/api',
    coverage: false,
  },

  // Project Settings
  projectId: 'your-project-id',
  fixturesFolder: 'cypress/fixtures',
  downloadsFolder: 'cypress/downloads',
})