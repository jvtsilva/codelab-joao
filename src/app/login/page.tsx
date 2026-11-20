'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

const STORAGE_KEY = 'codelab_tema_aula'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isDark, setIsDark] = useState(true)
  const turnstileRef = useRef<TurnstileInstance | null>(null)
  const router = useRouter()

  const whatsappEsqueciSenha = `https://wa.me/5519995200014?text=${encodeURIComponent(
    'Olá João, esqueci minha senha do Codelab!'
  )}`

  useLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  const isValidEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    return emailRegex.test(emailStr)
  }

  const alternarTema = () => {
    setIsDark((atual) => {
      const proximo = !atual
      localStorage.setItem(STORAGE_KEY, proximo ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', proximo)
      document.documentElement.style.backgroundColor = proximo ? '#030712' : '#fafaf9'
      return proximo
    })
  }

  const handleGoogleLogin = async () => {
    setErrorMessage('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro ao entrar com o Google.'
      setErrorMessage(msg)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    const cleanEmail = email.trim()

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Insira um e-mail válido (ex: seu@email.com).')
      return
    }

    if (!turnstileToken) {
      setErrorMessage('Aguarde a verificação de segurança.')
      return
    }

    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (signInError) throw signInError

      setSuccessMessage(true)
      router.refresh()

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Erro ao fazer login. Verifique suas credenciais.'
      setErrorMessage(msg)
      setTurnstileToken(null)
      turnstileRef.current?.reset()
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-emerald-500 selection:text-gray-950">
      {/* Header */}
      <header className="max-w-md w-full mx-auto pt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2.5 py-1.5 font-bold text-xs rounded-lg border shrink-0 bg-emerald-50 text-emerald-700 border-emerald-600/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
            JS
          </span>
          <h1 className="font-bold text-sm tracking-wide truncate">
            Codelab <span className="text-emerald-700 dark:text-emerald-400 font-normal">João</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={alternarTema}
            suppressHydrationWarning
            className="px-2.5 py-2 border text-xs font-semibold rounded-xl cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-950 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white dark:border-gray-800"
            title="Alternar modo claro e escuro"
            aria-label="Alternar modo claro e escuro"
          >
            <span suppressHydrationWarning className="hidden sm:inline">
              {isDark ? '☀ Claro' : '🌙 Escuro'}
            </span>
            <span suppressHydrationWarning className="sm:hidden">
              {isDark ? '☀' : '🌙'}
            </span>
          </button>

          <Link
            href="/"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl border flex items-center gap-1.5 cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-950 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white dark:border-gray-800"
          >
            Início
          </Link>
        </div>
      </header>

      {/* Formulário Centralizado */}
      <main className="flex-1 flex items-center justify-center my-auto py-4">
        <form
          onSubmit={handleLogin}
          className="max-w-md w-full border px-6 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-5 rounded-3xl space-y-4 bg-white border-stone-200 text-stone-900 shadow-xl dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:shadow-2xl"
        >
          <div className="text-center">
            <span className="inline-block px-3 py-1 border font-bold text-[11px] rounded-full mb-3.5 bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              BEM-VINDO DE VOLTA 🚀
            </span>
            <h2 className="text-2xl font-black tracking-tight">Entrar</h2>
            <p className="text-xs mt-1 text-stone-600 dark:text-gray-400">
              Acesse sua conta para continuar a trilha
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 border text-xs rounded-xl bg-red-50 border-red-600/30 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 border text-xs rounded-xl flex items-center justify-center gap-2 font-medium bg-emerald-50 border-emerald-600/30 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
              <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-emerald-700 dark:border-emerald-400" />
              Login realizado. Redirecionando...
            </div>
          )}

          {/* Botão Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || successMessage}
            className="w-full py-3 px-4 border font-medium rounded-xl text-xs sm:text-sm flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 bg-stone-50 hover:bg-stone-100 border-stone-300 text-stone-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-white dark:shadow-md"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.23v3.15C3.21 21.32 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.23C.44 8.16 0 9.94 0 11.8s.44 3.64 1.23 5.22l4.05-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.21 2.68 1.23 6.58l4.05 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Continuar com o Google
          </button>

          {/* Divisor */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-stone-500 dark:bg-gray-900 dark:text-gray-500">
                Ou com e-mail
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium mb-1 text-stone-600 dark:text-gray-400">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || successMessage}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs disabled:opacity-50 bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-500"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-x-3 gap-y-1 mb-1">
              <label className="text-xs font-medium text-stone-600 dark:text-gray-400">
                Senha
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[11px] font-semibold cursor-pointer text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
                <a
                  href={whatsappEsqueciSenha}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] hover:underline font-medium text-emerald-700 dark:text-emerald-400"
                >
                  Esqueceu a senha?
                </a>
              </div>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || successMessage}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs disabled:opacity-50 bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>

          {/* Cloudflare Turnstile */}
          <div className="flex justify-center my-3" suppressHydrationWarning>
            <Turnstile
              ref={turnstileRef}
              siteKey="0x4AAAAAAGB6hl7FfTuEMZ36"
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(null)}
              options={{ theme: isDark ? 'dark' : 'light' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || successMessage}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold rounded-xl text-xs disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading && !successMessage ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                Entrando...
              </>
            ) : successMessage ? (
              'Tudo pronto!'
            ) : (
              'Entrar ⚡'
            )}
          </button>

          <p className="text-center text-xs pt-2 border-t text-stone-500 dark:text-gray-500 border-stone-200 dark:border-gray-800/80">
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold">
              Criar conta
            </Link>
          </p>
        </form>
      </main>

      <footer className="max-w-md w-full mx-auto pb-2 text-center text-xs text-stone-500 dark:text-gray-500">
        <p>Codelab João • Aprendizado prático de JavaScript</p>
      </footer>
    </div>
  )
}