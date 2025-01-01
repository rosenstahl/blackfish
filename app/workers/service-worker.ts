import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst
} from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { BackgroundSyncPlugin } from 'workbox-background-sync'

// Precache und Route setzen
precacheAndRoute(self.__WB_MANIFEST)

// API Cache Strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 24 Stunden
        purgeOnQuotaError: true
      })
    ]
  })
)

// Statische Assets Cache Strategy
registerRoute(
  ({ request }) => request.destination === 'style' || 
                   request.destination === 'script' || 
                   request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Tage
        purgeOnQuotaError: true
      })
    ]
  })
)

// Bilder Cache Strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Tage
        purgeOnQuotaError: true
      })
    ]
  })
)

// Fonts Cache Strategy
registerRoute(
  ({ request }) => request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'fonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 Jahr
        purgeOnQuotaError: true
      })
    ]
  })
)

// Background Sync für API Requests
const bgSyncPlugin = new BackgroundSyncPlugin('apiQueue', {
  maxRetentionTime: 24 * 60 // Retry für bis zu 24 Stunden (in Minuten)
})

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [bgSyncPlugin]
  }),
  'POST'
)

// Content Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent())
  }
})

async function syncContent() {
  try {
    const cache = await caches.open('content-cache')
    const keys = await cache.keys()
    
    return Promise.all(
      keys.map(async (request) => {
        try {
          const response = await fetch(request)
          return cache.put(request, response)
        } catch (error) {
          console.error('Content sync error:', error)
          return Promise.reject(error)
        }
      })
    )
  } catch (error) {
    console.error('Content sync error:', error)
    return Promise.reject(error)
  }
}

// Cache Cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!['api-cache', 'static-resources', 'images', 'fonts'].includes(cacheName)) {
            return caches.delete(cacheName)
          }
          return Promise.resolve()
        })
      )
    })
  )
})