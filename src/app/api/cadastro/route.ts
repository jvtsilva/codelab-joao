import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseServer = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null

const MAX_CADASTROS_POR_HORA = 3
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const parts = forwardedFor
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }

  return '127.0.0.1'
}

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !supabaseServer) {
      console.error('Variáveis do Supabase (URL ou SERVICE_ROLE_KEY) ausentes no servidor.')
      return NextResponse.json(
        { error: 'Erro interno na configuração do servidor.' },
        { status: 500 }
      )
    }

    const body = await request.json().catch(() => null)
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''
    const token = typeof body?.token === 'string' ? body.token.trim() : ''

    if (!EMAIL_REGEX.test(email) || password.length < 8 || !token) {
      return NextResponse.json(
        { error: 'Dados inválidos ou verificação de segurança pendente.' },
        { status: 400 }
      )
    }

    const ip = getClientIp(request)
    const umaHoraAtras = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    // 1. Consulta tentativas do IP na última 1 hora
    const { count, error: selectError } = await supabaseServer
      .from('ip_rate_limit')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip)
      .gte('created_at', umaHoraAtras)

    if (selectError) {
      console.error('Erro ao consultar ip_rate_limit:', selectError.message)
      return NextResponse.json(
        { error: 'Erro interno no servidor.' },
        { status: 500 }
      )
    }

    if ((count ?? 0) >= MAX_CADASTROS_POR_HORA) {
      return NextResponse.json(
        { error: 'Muitas tentativas a partir deste IP. Tente novamente mais tarde.' },
        { status: 429 }
      )
    }

    // 2. Registra tentativa do IP na tabela ip_rate_limit
    const { error: insertError } = await supabaseServer
      .from('ip_rate_limit')
      .insert([{ ip }])

    if (insertError) {
      console.error('Erro ao registrar IP em ip_rate_limit:', insertError.message)
      return NextResponse.json(
        { error: 'Erro interno no servidor.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Erro inesperado em POST /api/cadastro:', err)
    return NextResponse.json(
      { error: 'Erro interno no servidor.' },
      { status: 500 }
    )
  }
}