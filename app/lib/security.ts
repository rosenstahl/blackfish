// Zentrale Sicherheitskonfiguration
export const SecurityConfig = {
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.analytics.com"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
    permissions: {
      camera: [],
      microphone: [],
      geolocation: []
    }
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 100 // Limit pro IP
  }
}
