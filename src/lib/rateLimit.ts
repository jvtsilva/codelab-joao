import { createHash } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { sanitizePlainText } from '@/lib/security'
import { logEvent } from '@/lib/logger'

export interface RateLimitConfig {
  action: string
  limit: number
  windowSeconds: number
  scopeId?: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
  reason?: 'limited' | 'storage_error'
}

export function extractClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for') || ''
  const firstIp = forwardedFor.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip')?.trim()
  const rawIp = sanitizePlainText(firstIp || realIp || 'unknown-client', 100)

  return createHash('sha256').update(rawIp).digest('hex').slice(0, 32)
}

export async function checkRateLimit(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminClient: SupabaseClient<any, 'public', any>,
  request: Request,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const safeLimit = Math.max(1, Math.floor(config.limit))
  const safeWindowSec = Math.max(10, Math.floor(config.windowSeconds))

  if (process.env.NODE_ENV !== 'production') {
    return {
      allowed: true,
      remaining: safeLimit,
      retryAfterSeconds: 0,
    }
  }

  const windowMs = safeWindowSec * 1000
  const now = Date.now()
  const nowIso = new Date(now).toISOString()

  const clientHash = extractClientIdentifier(request)
  const actorPart = config.scopeId ? `:${config.scopeId}` : ''
  const key = `${config.action}${actorPart}:${clientHash}`

  const { data: existing, error: selectError } = await adminClient
    .from('ip_rate_limit')
    .select('key, count, window_start')
    .eq('key', key)
    .maybeSingle()

  if (selectError) {
    logEvent('error', 'rate_limit_select_failed', {
      action: config.action,
      code: selectError.code,
      message: selectError.message,
    })
    return {
      allowed: true,
      remaining: safeLimit,
      retryAfterSeconds: 0,
      reason: 'storage_error',
    }
  }

  if (!existing) {
    const { error: insertError } = await adminClient
      .from('ip_rate_limit')
      .insert({
        key,
        count: 1,
        window_start: nowIso,
        updated_at: nowIso,
      })

    if (insertError) {
      logEvent('error', 'rate_limit_insert_failed', {
        action: config.action,
        code: insertError.code,
        message: insertError.message,
      })
      return {
        allowed: true,
        remaining: safeLimit,
        retryAfterSeconds: 0,
        reason: 'storage_error',
      }
    }

    return {
      allowed: true,
      remaining: Math.max(0, safeLimit - 1),
      retryAfterSeconds: 0,
    }
  }

  const windowStartMs = new Date(existing.window_start as string).getTime()
  const elapsedMs = Number.isFinite(windowStartMs) ? now - windowStartMs : windowMs + 1

  if (elapsedMs >= windowMs) {
    const { error: resetError } = await adminClient
      .from('ip_rate_limit')
      .update({
        count: 1,
        window_start: nowIso,
        updated_at: nowIso,
      })
      .eq('key', key)

    if (resetError) {
      logEvent('error', 'rate_limit_reset_failed', {
        action: config.action,
        code: resetError.code,
        message: resetError.message,
      })
      return {
        allowed: true,
        remaining: safeLimit,
        retryAfterSeconds: 0,
        reason: 'storage_error',
      }
    }

    return {
      allowed: true,
      remaining: Math.max(0, safeLimit - 1),
      retryAfterSeconds: 0,
    }
  }

  const currentCount = Number(existing.count ?? 0)
  const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - elapsedMs) / 1000))

  if (currentCount >= safeLimit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
      reason: 'limited',
    }
  }

  const nextCount = currentCount + 1
  const { error: updateError } = await adminClient
    .from('ip_rate_limit')
    .update({
      count: nextCount,
      updated_at: nowIso,
    })
    .eq('key', key)

  if (updateError) {
    logEvent('error', 'rate_limit_update_failed', {
      action: config.action,
      code: updateError.code,
      message: updateError.message,
    })
    return {
      allowed: true,
      remaining: Math.max(0, safeLimit - nextCount),
      retryAfterSeconds: 0,
      reason: 'storage_error',
    }
  }

  return {
    allowed: true,
    remaining: Math.max(0, safeLimit - nextCount),
    retryAfterSeconds: 0,
  }
}