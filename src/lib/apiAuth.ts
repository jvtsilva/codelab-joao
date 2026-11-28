import { createClient, type User } from '@supabase/supabase-js'
import { isAllowedOrigin } from '@/lib/security'
import { getPublicEnv, getServerEnv } from '@/lib/env'

export const NO_STORE_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminSupabaseClient = ReturnType<typeof createClient<any, 'public', any>>

export type AuthGuardResult =
  | {
      ok: true
      user: User
      accessToken: string
      adminClient: AdminSupabaseClient
    }
  | {
      ok: false
      status: number
      error: string
    }

export function extractBearerToken(request: Request): string {
  const header = request.headers.get('authorization') || ''
  if (!header.startsWith('Bearer ')) return ''
  return header.slice(7).trim()
}

export async function requireAuthenticatedUser(
  request: Request,
  options?: { requireSameOrigin?: boolean }
): Promise<AuthGuardResult> {
  if (options?.requireSameOrigin !== false && !isAllowedOrigin(request)) {
    return {
      ok: false,
      status: 403,
      error: 'Origem da requisição não permitida.',
    }
  }

  const token = extractBearerToken(request)
  if (!token) {
    return {
      ok: false,
      status: 401,
      error: 'Autenticação obrigatória.',
    }
  }

  try {
    const { supabaseUrl, supabaseAnonKey } = getPublicEnv()
    const { supabaseServiceRoleKey } = getServerEnv()

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const {
      data: { user },
      error,
    } = await authClient.auth.getUser(token)

    if (error || !user?.id) {
      return {
        ok: false,
        status: 401,
        error: 'Sessão inválida ou expirada.',
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminClient = createClient<any, 'public', any>(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    return {
      ok: true,
      user,
      accessToken: token,
      adminClient,
    }
  } catch {
    return {
      ok: false,
      status: 500,
      error: 'Erro interno na verificação de autorização.',
    }
  }
}

export function isResourceOwner(actorUserId: string, resourceUserId: string): boolean {
  return Boolean(actorUserId) && actorUserId === resourceUserId
}