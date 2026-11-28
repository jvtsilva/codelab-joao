'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const MAX_NAME_LENGTH = 80
const MAX_EMAIL_LENGTH = 160
const MAX_PASSWORD_LENGTH = 128

function sanitizeDisplayName(rawName: string): string {
  return rawName
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
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

function formatAuthError(err: unknown, isLogin: boolean): string {
  const raw = err instanceof Error ? err.message : ''
  const lower = raw.toLowerCase()

  if (lower.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.'
  }
  if (lower.includes('already registered') || lower.includes('already exists')) {
    return 'Este e-mail já está cadastrado. Tente entrar.'
  }
  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Muitas tentativas seguidas. Aguarde um instante e tente novamente.'
  }

  return isLogin
    ? 'Não foi possível entrar. Verifique seus dados e tente novamente.'
    : 'Não foi possível concluir o cadastro. Verifique os dados e tente novamente.'
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        setErrorMsg(null)
        setPassword('')
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, loading, onClose])

  if (!isOpen) return null

  const fecharModal = () => {
    if (loading) return
    setErrorMsg(null)
    setPassword('')
    onClose()
  }

  const alternarModo = () => {
    if (loading) return
    setIsLogin((prev) => !prev)
    setErrorMsg(null)
    setPassword('')
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setErrorMsg(null)

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = sanitizeDisplayName(fullName)

    if (!cleanEmail || cleanEmail.length > MAX_EMAIL_LENGTH || /\s/.test(cleanEmail)) {
      setErrorMsg('Informe um e-mail válido.')
      return
    }

    if (!isLogin) {
      if (cleanName.length < 2 || cleanName.length > MAX_NAME_LENGTH || /[<>]/.test(cleanName)) {
        setErrorMsg('Informe um nome válido entre 2 e 80 caracteres.')
        return
      }
      if (!isStrongPassword(password)) {
        setErrorMsg(
          'A senha deve ter entre 8 e 128 caracteres, com maiúscula, número e caractere especial.'
        )
        return
      }
    } else if (!password) {
      setErrorMsg('Informe sua senha.')
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
            },
          },
        })
        if (error) throw error
      }

      setPassword('')
      setErrorMsg(null)
      onSuccess()
      onClose()
    } catch (err: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro na autenticação via modal:', err)
      }
      setErrorMsg(formatAuthError(err, isLogin))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl relative">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h2 className="text-xl font-black text-white">
            {isLogin ? 'Entrar no Codelab-João' : 'Criar Conta Gratuita'}
          </h2>
          <button
            type="button"
            onClick={fecharModal}
            disabled={loading}
            aria-label="Fechar janela de autenticação"
            className="text-slate-400 hover:text-white font-bold cursor-pointer disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="bg-rose-950/40 border border-rose-800/60 p-3 rounded-xl text-rose-300 text-sm"
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} noValidate className="space-y-4">
          {!isLogin && (
            <div>
              <label
                htmlFor="modal-fullname"
                className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
              >
                Nome Completo
              </label>
              <input
                id="modal-fullname"
                type="text"
                required
                maxLength={MAX_NAME_LENGTH}
                disabled={loading}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="modal-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
            >
              E-mail
            </label>
            <input
              id="modal-email"
              type="email"
              required
              maxLength={MAX_EMAIL_LENGTH}
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="modal-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
            >
              Senha
            </label>
            <input
              id="modal-password"
              type="password"
              required
              maxLength={MAX_PASSWORD_LENGTH}
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-900/30 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={alternarModo}
            disabled={loading}
            className="text-sm text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
          </button>
        </div>
      </div>
    </div>
  )
}