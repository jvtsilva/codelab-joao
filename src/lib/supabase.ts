import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

type SupabaseBrowserClient = ReturnType<typeof createBrowserClient>

const globalForSupabase = globalThis as typeof globalThis & {
  __codelabSupabaseClient?: SupabaseBrowserClient
}

function getSupabaseClient(): SupabaseBrowserClient {
  if (typeof window !== 'undefined' && globalForSupabase.__codelabSupabaseClient) {
    return globalForSupabase.__codelabSupabaseClient
  }

  const client = createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-anon-key'
  )

  if (typeof window !== 'undefined') {
    globalForSupabase.__codelabSupabaseClient = client
  }

  return client
}

export const supabase = getSupabaseClient()