module.exports = {
  ci: {
    collect: {
      // Server und URL Konfiguration
      startServerCommand: 'npm run start',
      url: [
        'http://localhost:3000',
        'http://localhost:3000/contact',
        'http://localhost:3000/impressum',
        'http://localhost:3000/datenschutz',
        'http://localhost:3000/agb'
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        // Optimierte Performance-Settings
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        },
        // Zusätzliche Audits aktivieren
        skipAudits: ['uses-http2'],
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
          'pwa'
        ],
        extraHeaders: {
          'Cookie': ''
        }
      }
    },

    assert: {
      // Performance Metrics
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['warn', { minScore: 0.9 }],

        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'interactive': ['error', { maxNumericValue: 3000 }],
        'speed-index': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // PWA Checks
        'installable-manifest': 'error',
        'service-worker': 'error',
        'works-offline': 'warning',
        'offline-start-url': 'warning',

        // Best Practices
        'uses-text-compression': 'error',
        'uses-responsive-images': 'error',
        'uses-optimized-images': 'error',
        'uses-rel-preconnect': 'error',
        'uses-rel-preload': 'warning',
        'efficient-animated-content': 'warning',
        'js-libraries': 'warning',

        // Accessibility
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'link-name': 'error',
        'meta-viewport': 'error',
        'heading-order': 'error',
        'tap-targets': 'error',

        // SEO
        'meta-description': 'error',
        'font-size': 'error',
        'link-text': 'error',
        'crawlable-anchors': 'error',
        'robots-txt': 'error',

        // Budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 300000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 200000 }],
        'resource-summary:third-party:count': ['error', { maxNumericValue: 10 }]
      }
    },

    upload: {
      // Upload-Konfiguration
      target: 'temporary-public-storage',
      githubStatusContextSuffix: 'lighthouse-ci',
      githubToken: process.env.GITHUB_TOKEN,
      serverBaseUrl: process.env.LHCI_SERVER_URL,
      basicAuth: {
        username: process.env.LHCI_BUILD_CONTEXT__CURRENT_HASH,
        password: process.env.LHCI_TOKEN,
      },
    },

    server: {
      // Server-Konfiguration
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './.lighthouseci/db.sql',
      },
      port: process.env.LHCI_SERVER_PORT || 9001,
    },
  },
};