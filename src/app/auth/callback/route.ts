import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { NO_STORE_HEADERS } from '@/lib/apiAuth'
import { getPublicEnv } from '@/lib/env'
import { logEvent } from '@/lib/logger'

function sanitizeNextPath(rawNext: string | null): string {
  if (!rawNext) return '/painel'
  const trimmed = rawNext.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return '/painel'
  }
  return trimmed
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')?.trim() ?? ''
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get('next'))

  try {
    if (!code) {
      return NextResponse.redirect(new URL('/login?erro=codigo_ausente', requestUrl.origin), {
        headers: NO_STORE_HEADERS,
      })
    }

    const { supabaseUrl, supabaseAnonKey } = getPublicEnv()
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      logEvent('warn', 'auth_callback_exchange_failed', { code: error.code ?? 'auth_error' })
      return NextResponse.redirect(new URL('/login?erro=sessao_invalida', requestUrl.origin), {
        headers: NO_STORE_HEADERS,
      })
    }

    return NextResponse.redirect(new URL(nextPath, requestUrl.origin), {
      headers: NO_STORE_HEADERS,
    })
  } catch (err) {
    logEvent('error', 'auth_callback_unexpected_error', {
      error: err instanceof Error ? err.message : 'unknown',
    })
    return NextResponse.redirect(new URL('/login?erro=erro_interno', requestUrl.origin), {
      headers: NO_STORE_HEADERS,
    })
  }
}