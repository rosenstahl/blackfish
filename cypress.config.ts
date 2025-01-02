import { defineConfig } from 'cypress'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 30000,
    watchForFileChanges: true,

    setupNodeEvents(on, config) {
      on('task', {
        readFileMaybe(filename) {
          if (existsSync(filename)) {
            return readFileSync(filename, 'utf8')
          }
          return null
        }
      })

      // Umgebungsvariablen für Tests
      const testConfigPath = resolve(__dirname, 'cypress.env.json')
      if (existsSync(testConfigPath)) {
        const testConfig = JSON.parse(readFileSync(testConfigPath, 'utf8'))
        config.env = { ...config.env, ...testConfig }
      }

      // Dynamische Konfiguration basierend auf der Umgebung
      const environmentName = config.env['environmentName'] || 'development'
      
      config.baseUrl = {
        development: 'http://localhost:3000',
        staging: 'https://staging.blackfish.digital',
        production: 'https://blackfish.digital'
      }[environmentName]

      return config
    }
  }
})