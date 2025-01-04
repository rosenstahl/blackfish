import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://blackfish.digital'

  const routes = [
    '',
    '/contact',
    '/impressum',
    '/datenschutz',
    '/agb'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8
  }))

  return routes
}