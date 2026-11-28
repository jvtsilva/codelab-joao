import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAllowedOrigin, isValidEmail, sanitizePlainText } from '@/lib/security'
import { checkRateLimit } from '@/lib/rateLimit'
import { NO_STORE_HEADERS } from '@/lib/apiAuth'
import { getPublicEnv, getServerEnv } from '@/lib/env'
import { logEvent, toPublicErrorMessage } from '@/lib/logger'

const MAX_PASSWORD_LENGTH = 128

function jsonNoStore(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: NO_STORE_HEADERS,
  })
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
  try {
    if (!isAllowedOrigin(request)) {
      return jsonNoStore({ error: 'Origem da requisição não permitida.' }, 403)
    }

    const { supabaseUrl, supabaseAnonKey } = getPublicEnv()
    const { supabaseServiceRoleKey } = getServerEnv()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = createClient<any, 'public', any>(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const rate = await checkRateLimit(adminClient, request, {
      action: 'signup',
      limit: 8,
      windowSeconds: 900,
    })

    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Muitas tentativas de cadastro. Aguarde alguns minutos e tente novamente.' },
        {
          status: 429,
          headers: {
            ...NO_STORE_HEADERS,
            'Retry-After': String(rate.retryAfterSeconds),
          },
        }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return jsonNoStore({ error: 'Dados de cadastro inválidos.' }, 400)
    }

    const raw = body as Record<string, unknown>
    const fullName = sanitizePlainText(raw.fullName ?? raw.full_name ?? raw.name ?? '', 80)
    const email = sanitizePlainText(raw.email ?? '', 160).toLowerCase()
    const password = typeof raw.password === 'string' ? raw.password : ''

    if (fullName.length < 2) {
      return jsonNoStore({ error: 'Informe seu nome com pelo menos 2 caracteres.' }, 400)
    }

    if (!isValidEmail(email)) {
      return jsonNoStore({ error: 'Informe um e-mail válido.' }, 400)
    }

    if (!isStrongPassword(password)) {
      return jsonNoStore(
        {
          error:
            'A senha deve ter entre 8 e 128 caracteres, incluindo maiúscula, número e caractere especial.',
        },
        400
      )
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data, error } = await authClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      logEvent('warn', 'signup_failed', { code: error.code ?? 'auth_error' })
      return jsonNoStore(
        { error: toPublicErrorMessage(error, 'Não foi possível concluir o cadastro.') },
        400
      )
    }

    logEvent('info', 'signup_succeeded', {
      hasUser: Boolean(data.user?.id),
      needsEmailConfirmation: !data.session,
    })

    return jsonNoStore(
      {
        success: true,
        needsEmailConfirmation: !data.session,
        message: data.session
          ? 'Cadastro concluído com sucesso.'
          : 'Cadastro realizado. Verifique seu e-mail para confirmar a conta.',
      },
      201
    )
  } catch (err) {
    logEvent('error', 'signup_unexpected_error', {
      error: err instanceof Error ? err.message : 'unknown',
    })
    return jsonNoStore({ error: 'Erro interno ao processar o cadastro.' }, 500)
  }
}

export async function GET() {
  return jsonNoStore({ error: 'Método não permitido.' }, 405)
}