import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const errorParam = requestUrl.searchParams.get('error')

  if (errorParam) {
    return NextResponse.redirect(new URL('/login?error=auth-failed', requestUrl.origin))
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variáveis públicas do Supabase ausentes na rota /auth/callback.')
    return NextResponse.redirect(new URL('/login?error=auth-failed', requestUrl.origin))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }

  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignora falhas de escrita fora de contexto mutável de cookies
          }
        },
      },
    })

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Erro ao trocar código por sessão:', error.message)
      return NextResponse.redirect(new URL('/login?error=auth-failed', requestUrl.origin))
    }

    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
  } catch (err) {
    console.error('Erro inesperado na rota /auth/callback:', err)
    return NextResponse.redirect(new URL('/login?error=auth-failed', requestUrl.origin))
  }
}