import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, password, token } = await request.json()

    // Pega o IP real do usuário na Vercel
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

    // 1. Valida o Turnstile na Cloudflare
    const turnstileData = new URLSearchParams()
    turnstileData.append('secret', process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '')
    turnstileData.append('response', token)

    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: turnstileData,
    })

    const turnstileResult = await turnstileResponse.json()

    if (!turnstileResult.success) {
      return NextResponse.json({ error: 'Falha na verificação de segurança (Turnstile). Tente novamente.' }, { status: 400 })
    }

    // 2. Trava de IP (Rate Limit): Verifica cadastros nos últimos 10 minutos
    const dezMinutosAtras = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    
    const { data: existingIps, error: selectError } = await supabaseAdmin
      .from('ip_rate_limit')
      .select('*')
      .eq('ip', ip)
      .gte('created_at', dezMinutosAtras)

    if (selectError) {
      console.error('Erro ao consultar rate limit:', selectError)
    }

    // Se já fez 2 ou mais cadastros nos últimos 10 minutos, bloqueia!
    if (existingIps && existingIps.length >= 2) {
      return NextResponse.json(
        { error: 'Muitos cadastros realizados a partir deste IP. Tente novamente mais tarde.' },
        { status: 429 }
      )
    }

    // 3. Registra o IP atual na tabela para contar nos próximos
    const { error: insertError } = await supabaseAdmin
      .from('ip_rate_limit')
      .insert([{ ip }])

    if (insertError) {
      console.error('Erro ao inserir IP no rate limit:', insertError)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro interno no servidor.' }, { status: 500 })
  }
}