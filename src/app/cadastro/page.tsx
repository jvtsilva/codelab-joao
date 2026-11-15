'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Turnstile } from '@marsidev/react-turnstile'

export default function CadastroPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Cadastrando...')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!hasMinLength || !hasUpperCase || !hasSpecialChar) {
      setErrorMessage('Por favor, atenda a todos os requisitos de segurança da senha.')
      return
    }

    if (!turnstileToken) {
      setErrorMessage('Por favor, aguarde a verificação de segurança (Turnstile).')
      return
    }

    setLoading(true)
    setLoadingText('Cadastrando...')

    try {
      // 1. Valida o Turnstile e o IP na nossa API segura
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, token: turnstileToken }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro na verificação de segurança ou IP.')
      }

      // 2. Cria a conta de fato no Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      // 3. Feedback visual customizado (Passa de Cadastrando para Tudo pronto!)
      setTimeout(() => {
        setLoadingText('Tudo pronto!')
        setSuccessMessage('Cadastro realizado com sucesso! Redirecionando...')
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
        
      }, 1500)

    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao criar conta. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
      <form onSubmit={handleCadastro} className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-2xl font-bold text-center mb-2">Crie sua conta</h2>
        
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg text-center font-medium animate-pulse">
            {successMessage}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm disabled:opacity-50"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm disabled:opacity-50"
            placeholder="••••••••"
          />

          <div className="mt-2 space-y-1 text-xs">
            <p className={hasMinLength ? 'text-emerald-400 font-medium' : 'text-gray-500'}>
              {hasMinLength ? '✓' : '•'} Mínimo de 8 caracteres
            </p>
            <p className={hasUpperCase ? 'text-emerald-400 font-medium' : 'text-gray-500'}>
              {hasUpperCase ? '✓' : '•'} Pelo menos uma letra maiúscula
            </p>
            <p className={hasSpecialChar ? 'text-emerald-400 font-medium' : 'text-gray-500'}>
              {hasSpecialChar ? '✓' : '•'} Pelo menos um caractere especial (!@#$%...)
            </p>
          </div>
        </div>

        {/* Widget do Cloudflare Turnstile */}
        <div className="flex justify-center my-2">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
            onSuccess={(token) => setTurnstileToken(token)}
            options={{ theme: 'dark' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition font-bold rounded-lg text-sm disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></span>
              {loadingText}
            </>
          ) : (
            'Cadastrar'
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  )
}