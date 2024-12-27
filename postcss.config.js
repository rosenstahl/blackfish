module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace',
    },
    'postcss-preset-env': {
      stage: 3,
      features: {
        'custom-properties': false,
        'nesting-rules': false,
      },
      browsers: [
        'last 2 versions',
        '> 1%',
        'not dead',
        'not IE 11',
      ],
    },
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
            normalizeWhitespace: false,
          },
        ],
      },
      '@fullhuman/postcss-purgecss': {
        content: [
          './pages/**/*.{js,ts,jsx,tsx}',
          './components/**/*.{js,ts,jsx,tsx}',
          './app/**/*.{js,ts,jsx,tsx}',
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: ['html', 'body'],
      },
    } : {}),
  },
}