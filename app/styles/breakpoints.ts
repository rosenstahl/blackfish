// Standardized breakpoints based on common device sizes
export const breakpoints = {
  xs: 0,       // Extra small devices (portrait phones)
  sm: 640,     // Small devices (landscape phones)
  md: 768,     // Medium devices (tablets)
  lg: 1024,    // Large devices (desktops)
  xl: 1280,    // Extra large devices (large desktops)
  '2xl': 1536, // Ultra wide devices
} as const;

// Media query helpers
export const mediaQueries = {
  up: (breakpoint: keyof typeof breakpoints) =>
    `@media (min-width: ${breakpoints[breakpoint]}px)`,
  down: (breakpoint: keyof typeof breakpoints) =>
    `@media (max-width: ${breakpoints[breakpoint] - 0.1}px)`,
  between: (start: keyof typeof breakpoints, end: keyof typeof breakpoints) =>
    `@media (min-width: ${breakpoints[start]}px) and (max-width: ${breakpoints[end] - 0.1}px)`,
};

// Device-specific styles
export const deviceStyles = {
  // Touch device optimizations
  touch: {
    tapHighlightColor: 'transparent',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
  },
  // High-DPI screen optimizations
  retina: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  // Print optimizations
  print: {
    '@media print': {
      backgroundColor: '#fff',
      color: '#000',
    },
  },
  // Mobile-specific styles
  mobile: {
    WebkitOverflowScrolling: 'touch',
    overflowScrolling: 'touch',
  },
};

// Browser-specific CSS variables
export const browserVariables = {
  // Safari-specific variables
  safari: {
    '--webkit-overflow-scrolling': 'touch',
    '--webkit-tap-highlight-color': 'transparent',
  },
  // Firefox-specific variables
  firefox: {
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(0,0,0,0.3) transparent',
  },
  // Edge-specific variables
  edge: {
    '-ms-overflow-style': '-ms-autohiding-scrollbar',
  },
};

// Common layout containers
export const containers = {
  sm: {
    maxWidth: breakpoints.sm + 'px',
    padding: '0 1rem',
  },
  md: {
    maxWidth: breakpoints.md + 'px',
    padding: '0 1.5rem',
  },
  lg: {
    maxWidth: breakpoints.lg + 'px',
    padding: '0 2rem',
  },
  xl: {
    maxWidth: breakpoints.xl + 'px',
    padding: '0 2.5rem',
  },
};

// Device detection utilities
export const deviceDetection = {
  isMobile: typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  isIOS: typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent),
  isSafari: typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  isFirefox: typeof window !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
  isEdge: typeof window !== 'undefined' && navigator.userAgent.indexOf('Edge') > -1,
};