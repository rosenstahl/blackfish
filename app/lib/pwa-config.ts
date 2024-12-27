// PWA Konfiguration
export const PWAConfig = {
  register: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('ServiceWorker registration successful')
        return registration
      } catch (err) {
        console.error('ServiceWorker registration failed:', err)
        return null
      }
    }
  }
}