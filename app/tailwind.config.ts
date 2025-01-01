import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'
import aspectRatio from '@tailwindcss/aspect-ratio'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
  },
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
        primary: colors.blue,
        success: colors.green,
        warning: colors.yellow,
        error: colors.red,
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      spacing: {
        18: '4.5rem',
        112: '28rem',
        120: '30rem',
      },
      opacity: {
        15: '0.15',
      },
      zIndex: {
        1: '1',
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          },
        },
      }),
    },
  },
  plugins: [aspectRatio, forms, typography],
} satisfies Config