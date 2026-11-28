export type CookieConsentChoice = 'essential_only' | 'all_preferences'

export interface CookieConsentRecord {
  choice: CookieConsentChoice
  updatedAt: string
}

const STORAGE_KEY = 'codelab_joao_cookie_consent_v1'
const COOKIE_NAME = 'cl_cookie_consent'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180 // 180 dias

function isValidChoice(value: unknown): value is CookieConsentChoice {
  return value === 'essential_only' || value === 'all_preferences'
}

export function getCookieConsent(): CookieConsentRecord | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CookieConsentRecord>
      if (isValidChoice(parsed?.choice) && typeof parsed?.updatedAt === 'string') {
        return {
          choice: parsed.choice,
          updatedAt: parsed.updatedAt,
        }
      }
    }
  } catch {
    // Fallback para cookie se localStorage estiver bloqueado
  }

  try {
    const match = document.cookie
      .split('; ')
      .find((item) => item.startsWith(`${COOKIE_NAME}=`))
    if (!match) return null

    const value = decodeURIComponent(match.split('=')[1] || '')
    if (!isValidChoice(value)) return null

    return {
      choice: value,
      updatedAt: '',
    }
  } catch {
    return null
  }
}

export function setCookieConsent(choice: CookieConsentChoice): CookieConsentRecord {
  const record: CookieConsentRecord = {
    choice,
    updatedAt: new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
    } catch {
      // Ignora erro de storage
    }

    try {
      const secureAttr = window.location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(choice)}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax${secureAttr}`
    } catch {
      // Ignora erro de cookie
    }

    window.dispatchEvent(
      new CustomEvent<CookieConsentRecord>('codelab:cookie-consent-changed', {
        detail: record,
      })
    )
  }

  return record
}

export function resetCookieConsent(): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignora erro de storage
  }

  try {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`
  } catch {
    // Ignora erro de cookie
  }

  window.dispatchEvent(
    new CustomEvent('codelab:cookie-consent-changed', {
      detail: null,
    })
  )
}