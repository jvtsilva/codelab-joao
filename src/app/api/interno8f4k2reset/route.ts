import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { timingSafeEqual } from 'node:crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminSecretKey = process.env.ADMIN_SECRET_KEY

const MAX_FAILED_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000
const MAX_EMAIL_LENGTH = 160
const MAX_PASSWORD_LENGTH = 128
const MAX_PAGES = 25

type AttemptEntry = {
  count: number
  firstAttemptAt: number
}

const failedAttemptsByIp = new Map<string, AttemptEntry>()

function jsonNoStore(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  })
}

function getClientIp(request: Request): string {
  const cfConnectingIp = request.headers.get('cf-connecting-ip')?.trim()
  if (cfConnectingIp) return cfConnectingIp

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const firstIp = forwardedFor
      .split(',')
      .map((part) => part.trim())
      .find(Boolean)
    if (firstIp) return firstIp
  }

  return '127.0.0.1'
}

function pruneExpiredAttempts(now: number): void {
  for (const [key, value] of failedAttemptsByIp.entries()) {
    if (now - value.firstAttemptAt > WINDOW_MS) {
      failedAttemptsByIp.delete(key)
    }
  }
}

function isRateLimited(ip: string, now: number): boolean {
  pruneExpiredAttempts(now)
  const entry = failedAttemptsByIp.get(ip)
  if (!entry) return false
  return entry.count >= MAX_FAILED_ATTEMPTS
}

function registerFailedAttempt(ip: string, now: number): void {
  pruneExpiredAttempts(now)
  const entry = failedAttemptsByIp.get(ip)
  if (!entry) {
    failedAttemptsByIp.set(ip, { count: 1, firstAttemptAt: now })
    return
  }
  entry.count += 1
}

function clearFailedAttempts(ip: string): void {
  failedAttemptsByIp.delete(ip)
}

function isValidSecret(provided: unknown, expected: string | undefined): boolean {
  if (typeof provided !== 'string' || !expected || !provided) return false
  const a = Buffer.from(provided, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function isValidEmail(email: string): boolean {
  if (!email || email.length > MAX_EMAIL_LENGTH || /\s/.test(email)) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    password.length <= MAX_PASSWORD_LENGTH &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const now = Date.now()

  try {
    if (!supabaseUrl || !serviceRoleKey || !adminSecretKey) {
      console.error('Variáveis de ambiente ausentes na rota de reset.')
      return jsonNoStore({ error: 'Não foi possível concluir a solicitação.' }, 500)
    }

    if (isRateLimited(ip, now)) {
      return jsonNoStore(
        { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' },
        429
      )
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      registerFailedAttempt(ip, now)
      return jsonNoStore({ error: 'Não foi possível concluir a solicitação.' }, 400)
    }

    const { email, newPassword, adminSecret } = body as {
      email?: unknown
      newPassword?: unknown
      adminSecret?: unknown
    }

    const providedSecret = request.headers.get('x-admin-secret') ?? adminSecret

    if (!isValidSecret(providedSecret, adminSecretKey)) {
      registerFailedAttempt(ip, now)
      return jsonNoStore({ error: 'Não foi possível concluir a solicitação.' }, 401)
    }

    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return jsonNoStore({ error: 'Dados inválidos para a solicitação.' }, 400)
    }

    if (typeof newPassword !== 'string' || !isStrongPassword(newPassword)) {
      return jsonNoStore(
        {
          error:
            'A nova senha deve ter entre 8 e 128 caracteres, incluindo maiúscula, número e caractere especial.',
        },
        400
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    let targetUserId: string | null = null
    const perPage = 200
    let page = 1

    while (!targetUserId && page <= MAX_PAGES) {
      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      })

      if (listError) {
        console.error('Erro interno ao consultar usuários.')
        return jsonNoStore({ error: 'Não foi possível concluir a solicitação.' }, 500)
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
      return jsonNoStore({ error: 'Não foi possível concluir a solicitação.' }, 400)
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { password: newPassword }
    )

    if (updateError) {
      console.error('Erro interno ao atualizar senha.')
      return jsonNoStore({ error: 'Não foi possível concluir a solicitação.' }, 500)
    }

    clearFailedAttempts(ip)

    return jsonNoStore({
      success: true,
      message: 'Solicitação concluída.',
    })
  } catch {
    console.error('Erro inesperado na rota de reset.')
    return jsonNoStore({ error: 'Não foi possível concluir a solicitação.' }, 500)
  }
}