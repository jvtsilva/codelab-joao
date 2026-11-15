'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CadastroPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    // 🛡️ Regra de segurança para a senha (mínimo 8 caracteres)
    if (password.length < 8) {
      setErrorMessage('A senha precisa ter no mínimo 8 caracteres.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Cadastro bem-sucedido, vai direto para o dashboard
      router.push('/dashboard')
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
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

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
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
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="••••••••"
          />
          {/* Dica visual em tempo real */}
          <p className={`text-[11px] mt-1.5 ${password.length >= 8 ? 'text-emerald-400' : 'text-gray-500'}`}>
            {password.length >= 8 ? '✓ Senha válida (mínimo de 8 caracteres)' : 'Mínimo de 8 caracteres'}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition font-bold rounded-lg text-sm disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
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