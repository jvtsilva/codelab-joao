'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminResetPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [adminSecret, setAdminSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, adminSecret }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erro ao redefinir.')

      setMessage({ text: 'Senha alterada com sucesso! O aluno já pode logar com a nova senha.', type: 'success' })
      setEmail('')
      setNewPassword('')
      setAdminSecret('')
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-gray-950">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-full">
            Painel Restrito 🔐
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Redefinir Senha de Aluno</h1>
          <p className="text-xs text-gray-400">Digite os dados abaixo para alterar a senha do usuário instantaneamente.</p>
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-xs font-semibold border ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">E-mail do Aluno</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aluno@email.com"
              className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Nova Senha</label>
            <input 
              type="text"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">Senha Mestra do Admin</label>
            <input 
              type="password"
              required
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              placeholder="Sua senha secreta de controle"
              className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Alterando...' : 'Atualizar Senha Agora ⚡'}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/login" className="text-xs text-gray-500 hover:text-gray-300 transition">
            ← Voltar para o Login
          </Link>
        </div>

      </div>
    </div>
  )
}