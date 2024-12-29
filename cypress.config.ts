import { defineConfig } from 'cypress'
import path from 'path'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    
    // Viewport Configuration
    viewportWidth: 1280,
    viewportHeight: 720,
    viewportPreset: {
      mobile: {
        width: 375,
        height: 667
      },
      tablet: {
        width: 768,
        height: 1024
      },
      desktop: {
        width: 1280,
        height: 720
      }
    },
    
    // Test Configuration
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    testIsolation: true,
    
    // Video & Screenshot Settings
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    videoUploadOnPasses: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: true,
    
    // Timeouts & Retries
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    execTimeout: 60000,
    taskTimeout: 60000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    // Experimental Features
    experimentalStudio: true,
    experimentalWebKitSupport: true,
    experimentalSessionAndOrigin: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    
    // Browser Configuration
    chromeWebSecurity: false,
    blockHosts: ['*google-analytics.com', '*hotjar.com'],
    userAgent: 'cypress',
    
    // Test Execution
    watchForFileChanges: true,
    numTestsKeptInMemory: 50,
    includeShadowDom: true,
    waitForAnimations: true,
    scrollBehavior: 'center',
    
    // Reporter Configuration
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'reporter-config.json',
      reporterEnabled: 'mochawesome, mocha-junit-reporter',
      mochawesomeReporterOptions: {
        reportDir: 'cypress/reports/mocha',
        quite: true,
        overwrite: false,
        html: true,
        json: true
      },
      mochaJunitReporterReporterOptions: {
        mochaFile: 'cypress/reports/junit/results-[hash].xml'
      }
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
        readFileMaybe(filename) {
          if (fs.existsSync(filename)) {
            return fs.readFileSync(filename, 'utf8')
          }

          return null
        },
      })

      // File Preprocessor with Better TypeScript Support
      on('file:preprocessor', require('@cypress/webpack-preprocessor')({
        webpackOptions: {
          resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: {
              '@': path.resolve(__dirname),
              '@components': path.resolve(__dirname, './app/components'),
              '@lib': path.resolve(__dirname, './app/lib'),
              '@hooks': path.resolve(__dirname, './app/hooks'),
              '@context': path.resolve(__dirname, './app/context'),
              '@utils': path.resolve(__dirname, './app/utils'),
              '@styles': path.resolve(__dirname, './app/styles'),
              '@types': path.resolve(__dirname, './app/types'),
            },
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
                      configFile: 'tsconfig.cypress.json',
                    },
                  },
                ],
              },
              {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
              },
            ],
          },
        },
      }))

      // Environment Handling
      const environmentName = config.env.environmentName || 'development'
      const environmentFilename = `cypress/config/${environmentName}.json`
      
      require('@cypress/code-coverage/task')(on, config)
      
      return require(environmentFilename)
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
      webpackConfig: {
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          alias: {
            '@': path.resolve(__dirname),
            '@components': path.resolve(__dirname, './app/components'),
            '@lib': path.resolve(__dirname, './app/lib'),
            '@hooks': path.resolve(__dirname, './app/hooks'),
            '@context': path.resolve(__dirname, './app/context'),
            '@utils': path.resolve(__dirname, './app/utils'),
            '@styles': path.resolve(__dirname, './app/styles'),
            '@types': path.resolve(__dirname, './app/types'),
          },
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
                    configFile: 'tsconfig.cypress.json',
                  },
                },
              ],
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
          ],
        },
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
    
    // Component Testing Specific
    experimentalSingleTabRunMode: true,
  },

  // Global Settings
  env: {
    apiUrl: 'http://localhost:3000/api',
    coverage: true,
    codeCoverage: {
      exclude: [
        'cypress/**/*.*',
        'coverage/**/*.*'
      ]
    }
  },

  // Project Settings
  projectId: 'your-project-id',
  fixturesFolder: 'cypress/fixtures',
  downloadsFolder: 'cypress/downloads',
})