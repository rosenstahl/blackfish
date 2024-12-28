module.exports = {\n  ci: {\n    collect: {\n      numberOfRuns: 3,\n      startServerCommand: 'npm run start',\n      url: ['http://localhost:3000'],\n      settings: {\n        preset: 'desktop',\n        chromeFlags: ['--no-sandbox']\n      }\n    },\n    assert: {\n      assertions: {\n        'categories:performance': ['error', { minScore: 0.9 }],\n        'categories:accessibility': ['error', { minScore: 0.9 }],\n        'categories:best-practices': ['error', { minScore: 0.9 }],\n        'categories:seo': ['error', { minScore: 0.9 }]\n      }\n    },\n    upload: {\n      target: 'temporary-public-storage'\n    }\n  }\n}