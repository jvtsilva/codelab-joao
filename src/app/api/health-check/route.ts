import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { NO_STORE_HEADERS } from '@/lib/apiAuth'
import { getPublicEnv } from '@/lib/env'
import { logEvent } from '@/lib/logger'

export async function GET() {
  const startedAt = Date.now()

  try {
    const { supabaseUrl, supabaseAnonKey } = getPublicEnv()

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { error } = await supabase.from('profiles').select('id').limit(1)

    if (error) {
      logEvent('warn', 'health_check_db_degraded', { code: error.code })
      return NextResponse.json(
        {
          status: 'degraded',
          service: 'codelab-joao',
          database: 'unreachable',
          latencyMs: Date.now() - startedAt,
          timestamp: new Date().toISOString(),
        },
        {
          status: 503,
          headers: NO_STORE_HEADERS,
        }
      )
    }

    return NextResponse.json(
      {
        status: 'ok',
        service: 'codelab-joao',
        database: 'ok',
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      }
    )
  } catch (err) {
    logEvent('error', 'health_check_failed', {
      error: err instanceof Error ? err.message : 'unknown',
    })
    return NextResponse.json(
      {
        status: 'error',
        service: 'codelab-joao',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: NO_STORE_HEADERS,
      }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Método não permitido.' },
    {
      status: 405,
      headers: NO_STORE_HEADERS,
    }
  )
}