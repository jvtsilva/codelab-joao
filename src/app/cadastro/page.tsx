'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { useTheme } from '@/hooks/useTheme'
import { LabSurface } from '@/components/LabSurface'

function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  return createClient(url, anonKey)
}

function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    password.length <= 128 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

export default function CadastroPage() {
  const router = useRouter()
  const { isDark, alternarTema } = useTheme()

  const [fullName, setFullName] = useState('')
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
    const supabase = getBrowserSupabase()
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      if (data.session?.user) {
        router.replace('/painel')
      }
    })

    return () => {
      active = false
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setFeedback({ text: '', type: '' })

    const cleanName = fullName.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (cleanName.length < 2) {
      setFeedback({ text: 'Informe seu nome com pelo menos 2 caracteres.', type: 'error' })
      return
    }

    if (!cleanEmail) {
      setFeedback({ text: 'Informe um e-mail válido.', type: 'error' })
      return
    }

    if (!isStrongPassword(password)) {
      setFeedback({
        text: 'A senha deve ter entre 8 e 128 caracteres, incluindo letra maiúscula, número e caractere especial.',
        type: 'error',
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          fullName: cleanName,
          email: cleanEmail,
          password,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(
          typeof data?.error === 'string' && data.error.trim()
            ? data.error
            : 'Não foi possível concluir o cadastro.'
        )
      }

      setFullName('')
      setEmail('')
      setPassword('')
      setShowPassword(false)

      if (data?.needsEmailConfirmation) {
        setFeedback({
          text:
            typeof data?.message === 'string' && data.message.trim()
              ? data.message
              : 'Cadastro realizado. Verifique seu e-mail para confirmar a conta.',
          type: 'success',
        })
      } else {
        const supabase = getBrowserSupabase()
        if (supabase) {
          await supabase.auth.signInWithPassword({ email: cleanEmail, password }).catch(() => {})
        }
        setFeedback({
          text: 'Conta criada com sucesso. Redirecionando...',
          type: 'success',
        })
        setTimeout(() => {
          router.push('/painel')
          router.refresh()
        }, 900)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar conta.'
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
            href="/login"
            className={`text-xs font-semibold transition px-3.5 py-2 rounded-xl border ${btnClasses}`}
          >
            Entrar
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
                CADASTRO GRATUITO
              </span>
              <h1 className="text-2xl font-black tracking-tight">Criar conta</h1>
              <p className={`text-xs mt-1 ${textMutedClasses}`}>
                Salve seu progresso nas trilhas e desafios do Codelab João
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
              <label className={`block text-xs font-medium ${textMutedClasses}`}>Nome</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength={2}
                maxLength={80}
                disabled={loading}
                autoComplete="name"
                placeholder="Seu nome"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs transition ${inputClasses}`}
              />
            </div>

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
                minLength={8}
                disabled={loading}
                autoComplete="new-password"
                placeholder="Mín. 8 chars, maiúscula, número e símbolo"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs font-mono transition ${inputClasses}`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition-all font-extrabold rounded-xl text-xs disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </LabSurface>
      </main>

      <footer className={`max-w-md w-full mx-auto pb-2 text-center text-xs ${textMutedClasses}`}>
        <p>
          Ao criar sua conta, você concorda com os{' '}
          <Link href="/termos" className="underline">
            Termos de Uso
          </Link>{' '}
          e a{' '}
          <Link href="/privacidade" className="underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </footer>
    </div>
  )
}