/// <reference lib="webworker" />
/// <reference lib="dom" />
/// <reference no-default-lib="true"/>
import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL, PrecacheRoute } from 'workbox-precaching'
import { registerRoute, NavigationRoute, RouteHandlerCallback, Route } from 'workbox-routing'
import { 
  StaleWhileRevalidate, 
  CacheFirst, 
  NetworkFirst,
  NetworkOnly 
} from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { BackgroundSyncPlugin } from 'workbox-background-sync'
import type { PushEvent, SyncEvent } from '@types/serviceworker'

declare const self: ServiceWorkerGlobalScope

// Take control immediately
clientsClaim()
self.skipWaiting()

// Cache Names for different types of content
const CACHE_NAMES = {
  static: 'static-assets-v1',
  images: 'images-v1',
  fonts: 'fonts-v1',
  pages: 'pages-v1',
  api: 'api-cache-v1'
} as const

// Precache critical assets
precacheAndRoute(self.__WB_MANIFEST)

// API Routes - Network First with Cache Fallback
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: CACHE_NAMES.api,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 hour
        purgeOnQuotaError: true
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new BackgroundSyncPlugin('apiQueue', {
        maxRetentionTime: 24 * 60 // Retry for up to 24 hours
      })
    ],
    networkTimeoutSeconds: 10
  })
)

// Static Assets - Cache First Strategy
registerRoute(
  ({ request }) => 
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new CacheFirst({
    cacheName: CACHE_NAMES.static,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

// Image Caching - Cache First with Size Limit
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: CACHE_NAMES.images,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true,
        maxSizeBytes: 10 * 1024 * 1024 // 10MB
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

// Font Caching - Cache First with Long Expiration
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: CACHE_NAMES.fonts,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        purgeOnQuotaError: true
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

// Offline Fallback Configuration
const offlineFallbackPage = '/offline'
const navigationPreload = true

// Configure navigation preload
if (navigationPreload) {
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      Promise.all([
        self.registration.navigationPreload.enable(),
        // Clear old cache versions
        caches.keys().then((keys) => 
          Promise.all(
            keys.map((key) => {
              if (!Object.values(CACHE_NAMES).includes(key)) {
                return caches.delete(key)
              }
              return Promise.resolve()
            })
          )
        )
      ])
    )
  })
}

// Cache offline page on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.pages).then((cache) => 
      cache.add(offlineFallbackPage)
    )
  )
})

// Handle offline navigation
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try navigation preload response first
          const preloadResponse = await event.preloadResponse
          if (preloadResponse) {
            return preloadResponse
          }

          // Then try network
          const networkResponse = await fetch(event.request)
          return networkResponse
        } catch (error) {
          // If both fail, show offline page
          const cache = await caches.open(CACHE_NAMES.pages)
          const cachedResponse = await cache.match(offlineFallbackPage)
          return cachedResponse ?? new Response('Offline')
        }
      })()
    )
  }
})

// Background Sync for Forms
const bgSyncPlugin = new BackgroundSyncPlugin('formQueue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
})

registerRoute(
  ({ url }) => url.pathname === '/api/contact',
  new NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
)

// Periodic Sync for Content Updates
if ('periodicsync' in self.registration) {
  self.addEventListener('periodicsync', (event: SyncEvent) => {
    if (event.tag === 'content-sync') {
      event.waitUntil(syncContent())
    }
  })
}

async function syncContent() {
  // Implement content sync logic here
  const cache = await caches.open(CACHE_NAMES.pages)
  await cache.add('/') // Update home page cache
}

// Handle Push Notifications
self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return

  const data = event.data.json()
  const options: NotificationOptions = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Mehr erfahren'
      },
      {
        action: 'close',
        title: 'Schließen'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Error Handling & Reporting
self.addEventListener('error', (event: ErrorEvent) => {
  // Log error to analytics
  console.error('Service Worker Error:', event.error)
})

self.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  // Log unhandled promise rejection
  console.error('Service Worker Unhandled Rejection:', event.reason)
})
