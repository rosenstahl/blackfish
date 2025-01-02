export const pwaConfig = {
  register: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js')
        console.log('ServiceWorker registration successful')
        return registration
      } catch (err) {
        console.error('ServiceWorker registration failed:', err)
        return null
      }
    }
    return null
  },
  unregister: async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      await registration.unregister()
    }
  }
}
