'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CadastroPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const router = useRouter()

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      // 1. Cadastra no Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verificar-email`,
        },
      })

      if (error) throw error

      const confirmationUrl = `${window.location.origin}/verificar-email`

      // 2. Dispara o e-mail via Resend
      const res = await window.fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          confirmationUrl 
        }),
      })

      const resData = await res.json()
      console.log('Resposta do Resend:', resData)

      if (!res.ok) {
        throw new Error(resData.error?.message || 'Erro ao enviar o e-mail pelo Resend.')
      }

      setEmailSent(true)
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      setErrorMessage(error.message || 'Ocorreu um erro durante o cadastro.')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center shadow-xl space-y-4">
          <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto text-xl">
            ✉️
          </div>
          <h2 className="text-2xl font-bold">Verifique seu e-mail</h2>
          <p className="text-gray-400 text-sm">
            Enviamos um link de confirmação para <strong>{email}</strong>. Acesse sua caixa de entrada.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      <form onSubmit={handleCadastro} className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl space-y-4">
        <h2 className="template-title text-2xl font-bold text-center mb-2">Crie sua conta</h2>
        
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
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
            placeholder="codelab.joao@gmail.com"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 transition font-medium rounded-lg text-sm disabled:opacity-50"
        >
          {loading ? 'Cadastrando...' : 'Criar conta'}
        </button>
      </form>
    </div>
  )
}