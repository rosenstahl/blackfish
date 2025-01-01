/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { BackgroundSyncPlugin, Queue } from 'workbox-background-sync'
import type { Plugin } from 'workbox-core'

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<{ revision: string, url: string }> }

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
      }) as Plugin,
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 24 Stunden
      }) as Plugin
    ]
  })
)

// Statische Assets Cache Strategy
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }) as Plugin,
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Tage
      }) as Plugin
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
      }) as Plugin,
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Tage
      }) as Plugin
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
      }) as Plugin,
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 Jahr
      }) as Plugin
    ]
  })
)

// Background Sync für API Requests
const bgSyncPlugin = new BackgroundSyncPlugin('apiQueue', {
  maxRetentionTime: 24 * 60 // Retry für bis zu 24 Stunden (in Minuten)
}) as Plugin

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [bgSyncPlugin]
  }),
  'POST'
)

// Content Sync
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent())
  }
})

async function syncContent(): Promise<void> {
  try {
    const cache = await caches.open('content-cache')
    const keys = await cache.keys()

    await Promise.all(
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
self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = ['api-cache', 'static-resources', 'images', 'fonts']
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName)
          }
          return Promise.resolve()
        })
      )
    })
  )
})