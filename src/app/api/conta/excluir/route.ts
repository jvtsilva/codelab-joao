import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuthenticatedUser, isResourceOwner, NO_STORE_HEADERS } from '@/lib/apiAuth'
import { checkRateLimit } from '@/lib/rateLimit'
import { logEvent, toPublicErrorMessage } from '@/lib/logger'
import { getPublicEnv, getServerEnv } from '@/lib/env'

function jsonNoStore(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: NO_STORE_HEADERS,
  })
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request, { requireSameOrigin: true })

    if (!auth.ok) {
      return jsonNoStore({ error: auth.error }, auth.status)
    }

    const rate = await checkRateLimit(auth.adminClient, request, {
      action: 'delete_account',
      scopeId: auth.user.id,
      limit: 5,
      windowSeconds: 900,
    })

    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Muitas tentativas de exclusão. Aguarde alguns minutos e tente novamente.' },
        {
          status: 429,
          headers: {
            ...NO_STORE_HEADERS,
            'Retry-After': String(rate.retryAfterSeconds),
          },
        }
      )
    }

    const body = await request.json().catch(() => ({}))
    const requestedUserId =
      body && typeof body === 'object' && 'userId' in body && typeof body.userId === 'string'
        ? body.userId.trim()
        : ''

    if (requestedUserId && !isResourceOwner(auth.user.id, requestedUserId)) {
      logEvent('warn', 'account_delete_owner_mismatch', {
        actorId: auth.user.id,
        requestedUserId,
      })
      return jsonNoStore({ error: 'Acesso negado para excluir outra conta.' }, 403)
    }

    const { supabaseUrl, supabaseAnonKey } = getPublicEnv()
    const { supabaseServiceRoleKey } = getServerEnv()

    const userScopedClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      },
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { error: rpcError } = await userScopedClient.rpc('delete_own_user_data')

    if (rpcError) {
      logEvent('error', 'account_delete_rpc_failed', {
        userId: auth.user.id,
        code: rpcError.code,
      })
      return jsonNoStore(
        { error: toPublicErrorMessage(rpcError, 'Não foi possível excluir os dados da conta.') },
        500
      )
    }

    const { error: deleteAuthError } = await auth.adminClient.auth.admin.deleteUser(
      auth.user.id
    )

    if (deleteAuthError && supabaseServiceRoleKey) {
      logEvent('error', 'account_delete_auth_failed', {
        userId: auth.user.id,
      })
      return jsonNoStore(
        { error: 'Seus dados foram removidos, mas houve falha ao encerrar o acesso de autenticação.' },
        500
      )
    }

    logEvent('info', 'account_deleted', { userId: auth.user.id })

    return jsonNoStore({
      success: true,
      message: 'Conta e dados excluídos com sucesso.',
    })
  } catch (err) {
    logEvent('error', 'account_delete_unexpected_error', {
      error: err instanceof Error ? err.message : 'unknown',
    })
    return jsonNoStore({ error: 'Erro interno ao processar a exclusão da conta.' }, 500)
  }
}

export async function GET() {
  return jsonNoStore({ error: 'Método não permitido.' }, 405)
}