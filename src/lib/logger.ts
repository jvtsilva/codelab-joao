export type LogLevel = 'info' | 'warn' | 'error'

const SENSITIVE_KEYS = [
  'password',
  'senha',
  'token',
  'access_token',
  'refresh_token',
  'authorization',
  'cookie',
  'secret',
  'service_role',
  'api_key',
  'apikey',
  'email',
]

function maskString(value: string): string {
  if (!value) return ''
  if (value.includes('@')) {
    const [local, domain] = value.split('@')
    const head = local.slice(0, 2)
    return `${head}${'*'.repeat(Math.max(1, local.length - 2))}@${domain || '***'}`
  }
  if (value.length <= 6) return '***'
  return `${value.slice(0, 3)}***${value.slice(-2)}`
}

export function redactSensitiveData(input: unknown, depth = 0): unknown {
  if (depth > 5 || input === null || input === undefined) return input

  if (typeof input === 'string') {
    return input.replace(
      /(bearer\s+)[a-z0-9\-._~+/]+=*/gi,
      '$1***REDACTED***'
    )
  }

  if (typeof input !== 'object') return input

  if (Array.isArray(input)) {
    return input.map((item) => redactSensitiveData(item, depth + 1))
  }

  const source = input as Record<string, unknown>
  const output: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(source)) {
    const lowerKey = key.toLowerCase()
    const isSensitive = SENSITIVE_KEYS.some((s) => lowerKey.includes(s))

    if (isSensitive) {
      output[key] =
        typeof value === 'string' && value.length > 0
          ? maskString(value)
          : '***REDACTED***'
    } else if (value instanceof Error) {
      output[key] = {
        name: value.name,
        message: value.message,
      }
    } else {
      output[key] = redactSensitiveData(value, depth + 1)
    }
  }

  return output
}

export function logEvent(
  level: LogLevel,
  event: string,
  meta?: Record<string, unknown>
): void {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...(meta ? { meta: redactSensitiveData(meta) } : {}),
  }

  const serialized = JSON.stringify(payload)

  if (level === 'error') {
    console.error(serialized)
  } else if (level === 'warn') {
    console.warn(serialized)
  } else {
    console.info(serialized)
  }
}

export function toPublicErrorMessage(
  err: unknown,
  fallback = 'Não foi possível concluir a operação agora.'
): string {
  if (err && typeof err === 'object' && 'publicMessage' in err) {
    const msg = (err as { publicMessage?: unknown }).publicMessage
    if (typeof msg === 'string' && msg.trim()) {
      return msg.trim()
    }
  }
  return fallback
}