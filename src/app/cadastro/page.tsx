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

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white animate-fade-in">
      <form 
        onSubmit={handleCadastro} 
        className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl space-y-4 transition-all duration-300"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Codelab João</h2>
          <p className="text-xs text-gray-400">Crie sua conta para acessar a trilha de estudos</p>
        </div>
        
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center justify-center gap-2 font-medium transition-all">
            <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
            Conta criada com sucesso! Redirecionando...
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Nome Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading || successMessage}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm disabled:opacity-50 transition"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || successMessage}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm disabled:opacity-50 transition"
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
            disabled={loading || successMessage}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm disabled:opacity-50 transition"
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
        <div className="flex justify-center my-2">
          <Turnstile
            siteKey="0x4AAAAAAGB6hl7FfTuEMZ36"
            onSuccess={(token) => setTurnstileToken(token)}
            options={{ theme: 'dark' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || successMessage || !hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition-all font-bold rounded-lg text-sm disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading && !successMessage ? (
            <>
              <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></span>
              Cadastrando...
            </>
          ) : successMessage ? (
            'Tudo pronto!'
          ) : (
            'Criar Conta'
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-emerald-400 hover:underline transition">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  )
}