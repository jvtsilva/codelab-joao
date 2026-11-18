'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [adminSecret, setAdminSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    // Validação de segurança extra no front-end
    if (newPassword.length < 8) {
      setMessage({ text: 'A nova senha precisa ter pelo menos 8 caracteres.', type: 'error' })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, adminSecret }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao redefinir senha.')
      }

      setMessage({ text: 'Senha alterada com sucesso! O aluno já pode fazer login.', type: 'success' })
      setEmail('')
      setNewPassword('')
      setAdminSecret('')
    } catch (err: any) {
      setMessage({ text: err.message || 'Erro inesperado.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-gray-950 text-white">
      
      {/* Header simples */}
      <header className="max-w-md w-full mx-auto pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg border border-emerald-500/30">
            ADMIN
          </span>
          <h1 className="font-bold text-sm tracking-wide">
            Codelab <span className="text-emerald-400 font-normal">Painel Restrito</span>
          </h1>
        </div>
        <Link 
          href="/login"
          className="text-xs font-semibold text-gray-300 hover:text-white transition px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-1.5"
        >
          Ir para Login
        </Link>
      </header>

      {/* Formulário Centralizado */}
      <main className="flex-1 flex items-center justify-center my-auto py-4">
        <form 
          onSubmit={handleReset} 
          className="max-w-md w-full bg-gray-900 border border-gray-800 px-6 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-5 rounded-3xl shadow-2xl space-y-4"
        >
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px] rounded-full mb-3.5">
              ÁREA RESTRITA 🔒
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">Redefinir Senha</h2>
            <p className="text-xs text-gray-400 mt-1">Atualize a senha de acesso do aluno manualmente</p>
          </div>

          {message.text && (
            <div className={`p-3 text-xs rounded-xl border ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-400 mb-1">E-mail do Aluno</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs transition"
              placeholder="aluno@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-400 mb-1">Nova Senha (Mínimo 8 caracteres)</label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs transition"
              placeholder="Digite a nova senha forte"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-400 mb-1">Chave Mestra do Admin (ADMIN_SECRET_KEY)</label>
            <input
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs transition"
              placeholder="Sua senha mestra secreta"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition-all font-extrabold rounded-xl text-xs disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></span>
                Alterando senha...
              </>
            ) : (
              'Atualizar Senha do Aluno ⚡'
            )}
          </button>
        </form>
      </main>

      <footer className="max-w-md w-full mx-auto pb-2 text-center text-xs text-gray-500">
        <p>Codelab João • Uso exclusivo do administrador</p>
      </footer>

    </div>
  )
}