import type { Metadata } from 'next'

export const SITE_NAME = 'Codelab João'
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://codelabjoao.com.br'
).replace(/\/+$/, '')

export const DEFAULT_DESCRIPTION =
  'Estúdio de código calmo, técnico e gratuito para estudo prático com trilhas, desafios e playground interativo — sem XP, sem ranking e sem cobrança.'

export function buildPageMetadata(options?: {
  title?: string
  description?: string
  path?: string
}): Metadata {
  const title = options?.title ? `${options.title} • ${SITE_NAME}` : `${SITE_NAME} • Estúdio de Código`
  const description = options?.description || DEFAULT_DESCRIPTION
  const canonicalUrl = `${SITE_URL}${options?.path ? (options.path.startsWith('/') ? options.path : `/${options.path}`) : '/'}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export function getOrganizationSchemaJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export function getCourseSchemaJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    inLanguage: 'pt-BR',
    isAccessibleForFree: true,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}