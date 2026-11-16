import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // 1. Aguarda a Promise dos cookies (essencial nas versões atuais do Next.js)[cite: 1]
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Tratamento para evitar erros de escrita de cookies em Server Components estritos
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Tratamento para evitar erros de remoção de cookies
            }
          },
        },
      }
    )
    
    // 2. Troca o código temporário pela sessão definitiva do usuário[cite: 1]
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Erro ao trocar código por sessão:', error.message)
      return NextResponse.redirect(new URL('/login?error=auth-failed', requestUrl.origin))
    }
  }

  // 3. Redireciona o usuário para o dashboard após confirmar com sucesso[cite: 1]
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}