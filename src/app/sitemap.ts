import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const publicRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/dashboard', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/desafios', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/playground', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/medalhas', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/privacidade', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: '/termos', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: '/contato', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  return publicRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}