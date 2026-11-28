export interface PublicEnv {
  supabaseUrl: string
  supabaseAnonKey: string
  siteUrl: string
}

export interface ServerEnv extends PublicEnv {
  supabaseServiceRoleKey: string
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`)
  }
  return value
}

export function getPublicEnv(): PublicEnv {
  return {
    supabaseUrl: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    siteUrl:
      process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://codelabjoao.com.br',
  }
}

export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() só pode ser executado no servidor.')
  }

  return {
    ...getPublicEnv(),
    supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  }
}