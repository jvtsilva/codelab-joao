'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useTheme } from '@/hooks/useTheme'
import { LabSurface } from '@/components/LabSurface'

export default function LoginPage() {
  const router = useRouter()
  const { isDark, alternarTema } = useTheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | '' }>({
    text: '',
    type: '',
  })

  useEffect(() => {
    let active = true
    if (!isSupabaseConfigured) return

    async function checkExistingSession() {
      try {
        const { data } = await supabase.auth.getSession()
        if (!active) return
        if (data.session?.user) {
          router.replace('/painel')
        }
      } catch {
        // Ignora falha inicial de leitura de sessão
      }
    }

    void checkExistingSession()

    return () => {
      active = false
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setFeedback({ text: '', type: '' })

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      setFeedback({ text: 'Informe seu e-mail.', type: 'error' })
      return
    }

    if (!password) {
      setFeedback({ text: 'Informe sua senha.', type: 'error' })
      return
    }

    setLoading(true)

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Configuração do Supabase ausente no ambiente.')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error || !data.session) {
        throw new Error('E-mail ou senha inválidos.')
      }

      setFeedback({ text: 'Login realizado. Redirecionando...', type: 'success' })
      setPassword('')
      router.push('/painel')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao entrar.'
      setFeedback({ text: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const btnClasses =
    'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800'

  const inputClasses =
    'bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-500'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white">
      <header className="max-w-md w-full mx-auto pt-2 flex items-center justify-between gap-2">
        <Link href="/" className="font-bold text-sm tracking-wide">
          Codelab <span className={`${accentGreenClasses} font-normal`}>João</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={alternarTema}
            suppressHydrationWarning
            className={`px-2.5 py-2 border text-xs font-semibold rounded-xl transition cursor-pointer ${btnClasses}`}
            aria-label="Alternar modo claro e escuro"
          >
            {isDark ? '☀ Claro' : '🌙 Escuro'}
          </button>

          <Link
            href="/cadastro"
            className={`text-xs font-semibold transition px-3.5 py-2 rounded-xl border ${btnClasses}`}
          >
            Criar conta
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center my-auto py-6">
        <LabSurface
          variant="card"
          className="max-w-md w-full px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6 shadow-xl dark:shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <span className="inline-block px-3 py-1 border font-bold text-[11px] rounded-full mb-3 bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                ESTÚDIO DE CÓDIGO
              </span>
              <h1 className="text-2xl font-black tracking-tight">Entrar</h1>
              <p className={`text-xs mt-1 ${textMutedClasses}`}>
                Acesse suas trilhas, desafios e painel
              </p>
            </div>

            {feedback.text && (
              <div
                className={`p-3 text-xs rounded-xl border ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-600/30 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                    : 'bg-red-50 border-red-600/30 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <div className="space-y-1">
              <label className={`block text-xs font-medium ${textMutedClasses}`}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
                placeholder="seu@email.com"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs transition ${inputClasses}`}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <label className={`text-xs font-medium ${textMutedClasses}`}>Senha</label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`text-[11px] font-semibold cursor-pointer ${accentGreenClasses} hover:underline`}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                placeholder="Sua senha"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs font-mono transition ${inputClasses}`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition-all font-extrabold rounded-xl text-xs disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </LabSurface>
      </main>

      <footer className={`max-w-md w-full mx-auto pb-2 text-center text-xs ${textMutedClasses}`}>
        <p>
          Não tem conta?{' '}
          <Link href="/cadastro" className={`font-semibold underline ${accentGreenClasses}`}>
            Cadastre-se gratuitamente
          </Link>
        </p>
      </footer>
    </div>
  )
}