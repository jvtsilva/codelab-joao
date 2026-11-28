import { isSafeHttpUrl, isValidEmail, sanitizePlainText } from '@/lib/security'

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export interface ProfileUpdateInput {
  fullName: string
  bio: string
  website: string
}

export interface ProgressToggleInput {
  lessonSlug: string
  completed: boolean
}

export interface ChallengeToggleInput {
  challengeSlug: string
  completed: boolean
}

export interface ContactRequestInput {
  name: string
  email: string
  topic: 'duvida' | 'bug' | 'lgpd' | 'parceria'
  message: string
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidSlug(value: unknown, maxLength = 80): value is string {
  if (typeof value !== 'string') return false
  const clean = value.trim()
  if (!clean || clean.length > maxLength) return false
  return SLUG_PATTERN.test(clean)
}

export function validateProfileUpdate(raw: unknown): ValidationResult<ProfileUpdateInput> {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Payload de perfil inválido.' }
  }

  const obj = raw as Record<string, unknown>
  const fullName = sanitizePlainText(obj.fullName ?? obj.full_name ?? '', 80)
  const bio = sanitizePlainText(obj.bio ?? '', 240)
  const rawWebsite = typeof obj.website === 'string' ? obj.website.trim() : ''

  if (fullName.length > 0 && fullName.length < 2) {
    return { ok: false, error: 'O nome deve ter pelo menos 2 caracteres.' }
  }

  let website = ''
  if (rawWebsite.length > 0) {
    if (!isSafeHttpUrl(rawWebsite)) {
      return { ok: false, error: 'Informe uma URL válida começando com http:// ou https://.' }
    }
    website = rawWebsite.slice(0, 200)
  }

  return {
    ok: true,
    data: {
      fullName,
      bio,
      website,
    },
  }
}

export function validateProgressToggle(raw: unknown): ValidationResult<ProgressToggleInput> {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Dados de progresso inválidos.' }
  }

  const obj = raw as Record<string, unknown>
  const lessonSlug = obj.lessonSlug ?? obj.lesson_slug

  if (!isValidSlug(lessonSlug)) {
    return { ok: false, error: 'Identificador de aula inválido.' }
  }

  if (typeof obj.completed !== 'boolean') {
    return { ok: false, error: 'Estado de conclusão deve ser booleano.' }
  }

  return {
    ok: true,
    data: {
      lessonSlug: lessonSlug.trim(),
      completed: obj.completed,
    },
  }
}

export function validateChallengeToggle(raw: unknown): ValidationResult<ChallengeToggleInput> {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Dados de desafio inválidos.' }
  }

  const obj = raw as Record<string, unknown>
  const challengeSlug = obj.challengeSlug ?? obj.challenge_slug

  if (!isValidSlug(challengeSlug)) {
    return { ok: false, error: 'Identificador de desafio inválido.' }
  }

  if (typeof obj.completed !== 'boolean') {
    return { ok: false, error: 'Estado de conclusão deve ser booleano.' }
  }

  return {
    ok: true,
    data: {
      challengeSlug: challengeSlug.trim(),
      completed: obj.completed,
    },
  }
}

export function validateContactRequest(raw: unknown): ValidationResult<ContactRequestInput> {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Dados de contato inválidos.' }
  }

  const obj = raw as Record<string, unknown>
  const name = sanitizePlainText(obj.name ?? '', 80)
  const email = sanitizePlainText(obj.email ?? '', 254).toLowerCase()
  const rawTopic = typeof obj.topic === 'string' ? obj.topic.trim() : 'duvida'
  const message = sanitizePlainText(obj.message ?? '', 1000)

  if (name.length < 2) {
    return { ok: false, error: 'Informe seu nome (mínimo de 2 caracteres).' }
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: 'Informe um endereço de e-mail válido.' }
  }

  const allowedTopics: ContactRequestInput['topic'][] = [
    'duvida',
    'bug',
    'lgpd',
    'parceria',
  ]
  const topic = allowedTopics.includes(rawTopic as ContactRequestInput['topic'])
    ? (rawTopic as ContactRequestInput['topic'])
    : 'duvida'

  if (message.length < 10) {
    return { ok: false, error: 'Escreva uma mensagem com pelo menos 10 caracteres.' }
  }

  return {
    ok: true,
    data: {
      name,
      email,
      topic,
      message,
    },
  }
}