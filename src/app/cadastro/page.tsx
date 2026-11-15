'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Turnstile } from '@marsidev/react-turnstile'

export default function CadastroPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  // Validações em tempo real para o checklist
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  // Validação estrita de formato de e-mail (exigindo domínio e extensão válida)
  const isValidEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    return emailRegex.test(emailStr)
  }

  // Função para Cadastro / Login com o Google via Supabase OAuth
  const handleGoogleLogin = async () => {
    setErrorMessage('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao continuar com o Google.')
    }
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!isValidEmail(email)) {
      setErrorMessage('Por favor, insira um e-mail válido com extensão (ex: seu@email.com).')
      return
    }

    if (!turnstileToken) {
      setErrorMessage('Por favor, aguarde a verificação de segurança (Turnstile).')
      return
    }

    if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      setErrorMessage('Por favor, atenda a todos os requisitos de segurança da senha.')
      return
    }

    setLoading(true)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (signUpError) throw signUpError

      setSuccessMessage(true)

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao criar conta. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-gray-950 text-white animate-fadeIn">
      
      {/* Header Simples com Botão Voltar */}
      <header className="max-w-md w-full mx-auto pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg border border-emerald-500/30">
            JS
          </span>
          <h1 className="font-bold text-sm tracking-wide">
            Codelab <span className="text-emerald-400 font-normal">João</span>
          </h1>
        </div>
        <Link 
          href="/"
          className="text-xs font-semibold text-gray-300 hover:text-white transition px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-1.5 cursor-pointer"
        >
         Início
        </Link>
      </header>

      {/* Formulário Centralizado */}
      <main className="flex-1 flex items-center justify-center my-auto py-6">
        <form 
          onSubmit={handleCadastro} 
          className="max-w-md w-full bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4 transition-all duration-300"
        >
          <div className="text-center space-y-1">
            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px] rounded-full mb-1">
              COMECE DO ZERO ⚡
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">Criar Conta Gratuita</h2>
            <p className="text-xs text-gray-400">Crie sua conta para acessar a trilha de estudos</p>
          </div>
          
          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center justify-center gap-2 font-medium transition-all">
              <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
              Conta criada com sucesso! Redirecionando...
            </div>
          )}

          {/* Botão de Cadastro/Login com o Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || successMessage}
            className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-medium rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-3 cursor-pointer shadow-md disabled:opacity-50"
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

          {/* Divisor "ou" */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-500">Ou com e-mail</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-400 mb-1">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading || successMessage}
              className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs disabled:opacity-50 transition"
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-400 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || successMessage}
              className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs disabled:opacity-50 transition"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-400 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || successMessage}
              className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs disabled:opacity-50 transition"
              placeholder="••••••••"
            />
            
            {/* Checklist fixo e sempre visível */}
            <div className="mt-2.5 p-3 bg-gray-950/60 border border-gray-800 rounded-xl space-y-1.5 text-xs">
              <p className="text-gray-400 font-medium mb-1">A senha deve conter:</p>
              <div className={`flex items-center gap-2 transition-colors ${hasMinLength ? 'text-emerald-400' : 'text-gray-500'}`}>
                <span>{hasMinLength ? '✓' : '○'}</span>
                <span>Mínimo de 8 caracteres</span>
              </div>
              <div className={`flex items-center gap-2 transition-colors ${hasUpperCase ? 'text-emerald-400' : 'text-gray-500'}`}>
                <span>{hasUpperCase ? '✓' : '○'}</span>
                <span>Pelo menos uma letra maiúscula</span>
              </div>
              <div className={`flex items-center gap-2 transition-colors ${hasNumber ? 'text-emerald-400' : 'text-gray-500'}`}>
                <span>{hasNumber ? '✓' : '○'}</span>
                <span>Pelo menos um número</span>
              </div>
              <div className={`flex items-center gap-2 transition-colors ${hasSpecialChar ? 'text-emerald-400' : 'text-gray-500'}`}>
                <span>{hasSpecialChar ? '✓' : '○'}</span>
                <span>Pelo menos um caracter especial (ex: @, #, $, !)</span>
              </div>
            </div>
          </div>

          {/* Widget do Cloudflare Turnstile */}
          <div className="flex justify-center my-3">
            <Turnstile
              siteKey="0x4AAAAAAGB6hl7FfTuEMZ36"
              onSuccess={(token) => setTurnstileToken(token)}
              options={{ theme: 'dark' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || successMessage || !hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition-all font-extrabold rounded-xl text-xs disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading && !successMessage ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></span>
                Cadastrando...
              </>
            ) : successMessage ? (
              'Tudo pronto!'
            ) : (
              'Criar Conta com E-mail ⚡'
            )}
          </button>

          <p className="text-center text-xs text-gray-500 pt-2 border-t border-gray-800/80">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-emerald-400 hover:underline font-bold transition">
              Faça login
            </Link>
          </p>
        </form>
      </main>

      <footer className="max-w-md w-full mx-auto pb-2 text-center text-xs text-gray-500">
        <p>Codelab João • Plataforma educacional voltada para o aprendizado prático</p>
      </footer>

    </div>
  )
}