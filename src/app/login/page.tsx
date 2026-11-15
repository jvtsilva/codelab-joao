'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Turnstile } from '@marsidev/react-turnstile'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false) // Estado para o sucesso
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!turnstileToken) {
      setErrorMessage('Por favor, aguarde a verificação de segurança (Turnstile).')
      return
    }

    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Ativa o estado de sucesso visual antes de redirecionar
      setSuccessMessage(true)

      // Pequeno delay para o usuário ver a mensagem de sucesso e animação suave
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)

    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
      setLoading(false) // Libera o botão se der erro
    }
  }

  return (
    // 'animate-fade-in' traz a transição suave de entrada na tela
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white transition-opacity duration-500">
      <form 
        onSubmit={handleLogin} 
        className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl space-y-4 transform transition-all duration-300 scale-100 hover:border-gray-700"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Acesse sua conta</h2>
          <p className="text-xs text-gray-400">Entre com seus dados para continuar</p>
        </div>
        
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg animate-shake">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center justify-center gap-2 font-medium">
            <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
            Logado com sucesso! Redirecionando...
          </div>
        )}

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
          disabled={loading || successMessage}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition-all font-bold rounded-lg text-sm disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
        >
          {loading && !successMessage ? (
            <>
              <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></span>
              Autenticando...
            </>
          ) : successMessage ? (
            'Tudo pronto!'
          ) : (
            'Entrar'
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Ainda não tem uma conta?{' '}
          <Link href="/cadastro" className="text-emerald-400 hover:underline transition">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  )
}