import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/dashboard',
          '/desafios',
          '/playground',
          '/medalhas',
          '/privacidade',
          '/termos',
          '/contato',
        ],
        disallow: ['/api/', '/login', '/cadastro', '/painel'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}