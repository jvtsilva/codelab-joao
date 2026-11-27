'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'codelab_tema_aula'
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function randomIndex(max: number): number {
  if (max <= 0) return 0
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const maxUint32 = 0xffffffff
    const limit = maxUint32 - (maxUint32 % max)
    const buffer = new Uint32Array(1)
    let value = 0
    do {
      window.crypto.getRandomValues(buffer)
      value = buffer[0]
    } while (value >= limit)
    return value % max
  }
  return Math.floor(Math.random() * max)
}

function gerarSenhaForte(tamanho = 12): string {
  const maiusculas = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const minusculas = 'abcdefghijkmnopqrstuvwxyz'
  const numeros = '23456789'
  const especiais = '@#$!%*'
  const todos = maiusculas + minusculas + numeros + especiais

  const obrigatorios = [
    maiusculas[randomIndex(maiusculas.length)],
    minusculas[randomIndex(minusculas.length)],
    numeros[randomIndex(numeros.length)],
    especiais[randomIndex(especiais.length)],
  ]

  const restante = Array.from(
    { length: Math.max(4, tamanho - obrigatorios.length) },
    () => todos[randomIndex(todos.length)]
  )

  const combinados = [...obrigatorios, ...restante]
  for (let i = combinados.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1)
    const temp = combinados[i]
    combinados[i] = combinados[j]
    combinados[j] = temp
  }

  return combinados.join('')
}

export default function AdminResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [adminSecret, setAdminSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({
    text: '',
    type: '',
  })
  const [isDark, setIsDark] = useState(true)

  useIsomorphicLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  const alternarTema = () => {
    setIsDark((atual) => {
      const proximo = !atual
      localStorage.setItem(STORAGE_KEY, proximo ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', proximo)
      document.documentElement.style.backgroundColor = proximo ? '#030712' : '#fafaf9'
      return proximo
    })
  }

  const handleGerarSenha = () => {
    setNewPassword(gerarSenhaForte(12))
    setShowPassword(true)
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setMessage({ text: '', type: '' })

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      setMessage({ text: 'Informe um e-mail válido.', type: 'error' })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ text: 'A nova senha precisa ter pelo menos 8 caracteres.', type: 'error' })
      return
    }

    if (!adminSecret.trim()) {
      setMessage({ text: 'Informe a chave mestra do admin.', type: 'error' })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          newPassword,
          adminSecret,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.error || 'Erro ao redefinir senha.')
      }

      setMessage({ text: 'Senha alterada. O aluno já pode entrar.', type: 'success' })
      setEmail('')
      setNewPassword('')
      setAdminSecret('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro inesperado.'
      setMessage({ text: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const btnClasses =
    'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800'

  const cardClasses =
    'bg-white border-stone-200 text-stone-900 shadow-xl dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:shadow-2xl'

  const inputClasses =
    'bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-500'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const textSubtleClasses = 'text-stone-500 dark:text-gray-500'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
      <header className="max-w-md w-full mx-auto pt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2.5 py-1.5 font-bold text-xs rounded-lg border shrink-0 bg-emerald-50 text-emerald-700 border-emerald-600/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
            ADMIN
          </span>
          <h1 className="font-bold text-sm tracking-wide truncate">
            Codelab <span className={`${accentGreenClasses} font-normal`}>Restrito</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={alternarTema}
            suppressHydrationWarning
            className={`px-2.5 py-2 border text-xs font-semibold rounded-xl transition cursor-pointer ${btnClasses}`}
            title="Alternar modo claro e escuro"
            aria-label="Alternar modo claro e escuro"
          >
            <span className="hidden sm:inline" suppressHydrationWarning>
              {isDark ? '☀ Claro' : '🌙 Escuro'}
            </span>
            <span className="sm:hidden" suppressHydrationWarning>
              {isDark ? '☀' : '🌙'}
            </span>
          </button>

          <Link
            href="/login"
            className={`text-xs font-semibold transition px-3.5 py-2 rounded-xl border flex items-center gap-1.5 ${btnClasses}`}
          >
            Login
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center my-auto py-4">
        <form
          onSubmit={handleReset}
          className={`max-w-md w-full border px-6 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-5 rounded-3xl space-y-4 ${cardClasses}`}
        >
          <div className="text-center">
            <span className="inline-block px-3 py-1 border font-bold text-[11px] rounded-full mb-3.5 bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              ÁREA RESTRITA 🔒
            </span>
            <h2 className="text-2xl font-black tracking-tight">Redefinir Senha</h2>
            <p className={`text-xs mt-1 ${textMutedClasses}`}>
              Atualize a senha de acesso do aluno
            </p>
          </div>

          {message.text && (
            <div
              className={`p-3 text-xs rounded-xl border ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-600/30 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                  : 'bg-red-50 border-red-600/30 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-1">
            <label className={`block text-xs font-medium mb-1 ${textMutedClasses}`}>
              E-mail do aluno
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs transition ${inputClasses}`}
              placeholder="aluno@email.com"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
              <label className={`text-xs font-medium ${textMutedClasses}`}>
                Nova senha (mínimo 8 caracteres)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleGerarSenha}
                  disabled={loading}
                  className={`text-[11px] font-semibold cursor-pointer ${accentGreenClasses} hover:underline disabled:opacity-50`}
                >
                  Gerar
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`text-[11px] font-semibold cursor-pointer ${accentGreenClasses} hover:underline`}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs font-mono transition ${inputClasses}`}
              placeholder="Digite a nova senha"
            />
          </div>

          <div className="space-y-1">
            <label className={`block text-xs font-medium mb-1 ${textMutedClasses}`}>
              Chave mestra do admin
            </label>
            <input
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              required
              disabled={loading}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs transition ${inputClasses}`}
              placeholder="Chave secreta"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition-all font-extrabold rounded-xl text-xs disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                Alterando senha...
              </>
            ) : (
              'Atualizar Senha ⚡'
            )}
          </button>
        </form>
      </main>

      <footer className={`max-w-md w-full mx-auto pb-2 text-center text-xs ${textSubtleClasses}`}>
        <p>Codelab João • Uso exclusivo do administrador</p>
      </footer>
    </div>
  )
}