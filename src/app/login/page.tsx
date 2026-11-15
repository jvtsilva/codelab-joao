'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Logando...')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoadingText('Logando...')
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // 1️⃣ O botão fica mais tempo no estado "Logando..." (ex: 2.5 segundos)
      setTimeout(() => {
        setLoadingText('Tudo pronto!')
        
        // 2️⃣ Depois mostra a mensagem de sucesso como antes e segura mais um tempo
        setSuccessMessage('Logado com sucesso! Redirecionando...')
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 2500) // Tempo da mensagem de sucesso na tela
        
      }, 2500) // Tempo que o botão fica rodando "Logando..."

    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
      <form onSubmit={handleLogin} className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-2xl font-bold text-center mb-2">Acesse sua conta</h2>
        
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
            'Entrar'
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Não tem uma conta?{' '}
          <Link href="/cadastro" className="text-emerald-400 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  )
}