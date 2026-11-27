import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { timingSafeEqual } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminSecretKey = process.env.ADMIN_SECRET_KEY

function isValidSecret(provided: unknown, expected: string | undefined): boolean {
  if (typeof provided !== 'string' || !expected || !provided) return false
  const a = Buffer.from(provided, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey || !adminSecretKey) {
      console.error('Variáveis de ambiente ausentes na rota /api/admin/reset-password.')
      return NextResponse.json(
        { error: 'Erro interno na configuração do servidor.' },
        { status: 500 }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Requisição inválida.' },
        { status: 400 }
      )
    }

    const { email, newPassword, adminSecret } = body as {
      email?: unknown
      newPassword?: unknown
      adminSecret?: unknown
    }

    if (!isValidSecret(adminSecret, adminSecretKey)) {
      return NextResponse.json(
        { error: 'Senha mestra do admin inválida!' },
        { status: 401 }
      )
    }

    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Informe um e-mail válido.' },
        { status: 400 }
      )
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'A nova senha precisa ter pelo menos 8 caracteres.' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // Busca o usuário paginando para não depender apenas da primeira página
    let targetUserId: string | null = null
    const perPage = 200
    let page = 1

    while (!targetUserId) {
      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      })

      if (listError) {
        console.error('Erro ao listar usuários no Admin Reset:', listError.message)
        return NextResponse.json(
          { error: 'Não foi possível consultar o usuário.' },
          { status: 500 }
        )
      }

      const users = usersData?.users ?? []
      const match = users.find((u) => (u.email || '').toLowerCase() === normalizedEmail)
      if (match?.id) {
        targetUserId = match.id
        break
      }

      if (users.length < perPage) {
        break
      }

      page += 1
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Usuário não encontrado com esse e-mail.' },
        { status: 404 }
      )
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { password: newPassword }
    )

    if (updateError) {
      console.error('Erro ao atualizar senha no Auth:', updateError.message)
      return NextResponse.json(
        { error: 'Erro ao alterar senha.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso!',
    })
  } catch (err: unknown) {
    console.error('Erro inesperado na rota /api/admin/reset-password:', err)
    return NextResponse.json(
      { error: 'Erro ao alterar senha.' },
      { status: 500 }
    )
  }
}