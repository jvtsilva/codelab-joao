import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta.' },
        { status: 500 }
      )
    }

    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : ''

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    let requestedUserId: string | undefined
    try {
      const body = await request.json()
      if (body && typeof body.userId === 'string') {
        requestedUserId = body.userId
      }
    } catch {
      // Corpo vazio ou não-JSON é aceitável; a identidade vem do token
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: userData, error: userError } = await adminClient.auth.getUser(token)

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: 'Sessão inválida ou expirada.' },
        { status: 401 }
      )
    }

    const targetUserId = userData.user.id

    if (requestedUserId && requestedUserId !== targetUserId) {
      return NextResponse.json(
        { error: 'Você só pode excluir a própria conta.' },
        { status: 403 }
      )
    }

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(targetUserId)

    if (deleteError) {
      console.error('Erro ao excluir usuário no Supabase Auth:', deleteError.message)
      return NextResponse.json(
        { error: 'Não foi possível excluir a conta.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('Erro inesperado em POST /api/deletar-usuario:', err)
    return NextResponse.json(
      { error: 'Erro interno ao excluir conta.' },
      { status: 500 }
    )
  }
}