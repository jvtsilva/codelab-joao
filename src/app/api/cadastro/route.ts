import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, password, token } = await request.json()

    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1'

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

    const umDiaAtras = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: existingIps } = await supabaseAdmin
      .from('ip_rate_limit')
      .select('*')
      .eq('ip', ip)
      .gte('created_at', umDiaAtras)

    if (existingIps && existingIps.length >= 3) {
      return NextResponse.json({ error: 'Muitos cadastros realizados a partir deste IP. Tente mais tarde.' }, { status: 429 })
    }

    await supabaseAdmin.from('ip_rate_limit').insert([{ ip }])

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro interno no servidor.' }, { status: 500 })
  }
}