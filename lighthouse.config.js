const MOBILE_THROTTLING = {
  rttMs: 150,
  throughputKbps: 1638.4,
  requestLatencyMs: 562.5,
  downloadThroughputKbps: 1474.56,
  uploadThroughputKbps: 675.84,
  cpuSlowdownMultiplier: 4
}

const DESKTOP_THROTTLING = {
  rttMs: 40,
  throughputKbps: 10240,
  requestLatencyMs: 0,
  downloadThroughputKbps: 10240,
  uploadThroughputKbps: 10240,
  cpuSlowdownMultiplier: 1
}

module.exports = {
  ci: {
    collect: {
      // Server und URL Configuration
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready started server',
      startServerReadyTimeout: 30000,
      maxAutodiscoverUrls: 20,
      numberOfRuns: 3,
      url: [
        'http://localhost:3000',
        'http://localhost:3000/contact',
        'http://localhost:3000/impressum',
        'http://localhost:3000/datenschutz',
        'http://localhost:3000/agb'
      ],
      settings: {
        preset: 'desktop',
        // Performance Settings
        throttling: DESKTOP_THROTTLING,
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        },
        // Enable Additional Audits
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
        },
        // Additional Settings
        maxWaitForFcp: 15000,
        maxWaitForLoad: 35000,
        debugNavigation: true,
        pauseAfterFcpMs: 1000,
        pauseAfterLoadMs: 1000,
        networkQuietThresholdMs: 1000,
        cpuQuietThresholdMs: 1000
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
        'max-potential-fid': ['error', { maxNumericValue: 100 }],
        'first-meaningful-paint': ['error', { maxNumericValue: 2000 }],

        // PWA Checks
        'installable-manifest': 'error',
        'service-worker': 'error',
        'works-offline': 'warning',
        'offline-start-url': 'warning',
        'pwa-cross-browser': 'warning',
        'pwa-page-transitions': 'warning',
        'pwa-each-page-has-url': 'error',

        // Best Practices
        'uses-text-compression': 'error',
        'uses-responsive-images': 'error',
        'uses-optimized-images': 'error',
        'uses-rel-preconnect': 'error',
        'uses-rel-preload': 'warning',
        'efficient-animated-content': 'warning',
        'js-libraries': 'warning',
        'no-document-write': 'error',
        'uses-http2': 'error',
        'uses-long-cache-ttl': 'warning',
        'dom-size': ['error', { maxNumericValue: 1500 }],

        // Accessibility
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'link-name': 'error',
        'meta-viewport': 'error',
        'heading-order': 'error',
        'tap-targets': 'error',
        'aria-*': 'error',
        'html-lang-valid': 'error',
        'image-alt': 'error',

        // SEO
        'meta-description': 'error',
        'font-size': 'error',
        'link-text': 'error',
        'crawlable-anchors': 'error',
        'robots-txt': 'error',
        'hreflang': 'error',
        'canonical': 'error',
        'structured-data': 'warning',

        // Budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 300000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 200000 }],
        'resource-summary:third-party:count': ['error', { maxNumericValue: 10 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 1000000 }],
        'mainthread-work-breakdown': ['error', { maxNumericValue: 4000 }],

        // Additional Performance Metrics
        'network-requests': ['error', { maxNumericValue: 100 }],
        'network-rtt': ['error', { maxNumericValue: 150 }],
        'network-server-latency': ['error', { maxNumericValue: 100 }],
        'total-byte-weight': ['error', { maxNumericValue: 1600000 }]
      }
    },

    upload: {
      // Upload Configuration
      target: 'temporary-public-storage',
      githubStatusContextSuffix: 'lighthouse-ci',
      githubToken: process.env.GITHUB_TOKEN,
      serverBaseUrl: process.env.LHCI_SERVER_URL,
      basicAuth: {
        username: process.env.LHCI_BUILD_CONTEXT__CURRENT_HASH,
        password: process.env.LHCI_TOKEN,
      },
      outputDir: '.lighthouseci',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%'
    },

    server: {
      // Server Configuration
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './.lighthouseci/db.sql',
      },
      port: process.env.LHCI_SERVER_PORT || 9001,
    },
  },
};