'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function PainelPage() {
  const [userEmail, setUserEmail] = useState<string>('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserEmail(session.user.email || '')
      } else {
        window.location.href = '/login'
      }
    }
    loadUser()
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!newPassword || newPassword.length < 6) {
      setMessage({ text: 'A nova senha precisa ter pelo menos 6 caracteres.', type: 'error' })
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setMessage({ text: `Erro ao atualizar senha: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: 'Senha alterada com sucesso! 🚀', type: 'success' })
      setNewPassword('')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-gray-950 relative overflow-x-hidden">
      
      {/* Header Responsivo com Menu Mobile */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link href="/dashboard" className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg shrink-0 hover:bg-emerald-500/35 transition cursor-pointer">
            JS
          </Link>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Painel do <span className="text-emerald-400 font-normal">Aluno</span>
          </h1>
        </div>

        {/* Menu Desktop */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            ← Voltar à Trilha
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            Sair
          </button>
        </div>

        {/* Botão Hambúrguer Mobile */}
        <div className="flex sm:hidden items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-emerald-400 font-bold transition cursor-pointer active:scale-95"
            aria-label="Menu"
          >
            <span className="text-xl leading-none">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </header>

      {/* Menu Dropdown Mobile */}
      {menuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-2.5 z-50 shadow-2xl animate-fadeIn">
          <Link 
            href="/dashboard" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300 hover:text-white"
          >
            <span>←</span> Voltar para a Trilha de Aulas
          </Link>

          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl text-xs"
          >
            <span>🚪 Sair da Conta</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 py-10">
        
        {/* Info do Aluno */}
        <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-2">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Conta Conectada</span>
          <h2 className="text-base sm:text-lg font-bold text-white truncate">{userEmail || 'Carregando e-mail...'}</h2>
          <p className="text-xs text-gray-400">Gerencie suas credenciais de acesso à plataforma Codelab João.</p>
        </div>

        {/* Formulário de Alteração de Senha */}
        <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm sm:text-base text-white">Alterar Senha de Acesso</h3>
            <p className="text-xs text-gray-400">Escolha uma nova senha forte com pelo menos 6 caracteres.</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-medium">Nova Senha:</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 px-4 py-3 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {message && (
              <div className={`p-3.5 rounded-xl border text-xs font-medium ${message.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-red-950/40 border-red-500/30 text-red-300'}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Salvando alteração...' : '🔒 Atualizar Senha'}
            </button>
          </form>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs text-gray-500 max-w-2xl mx-auto w-full">
        <p>Codelab João • Painel de Controle do Aluno</p>
      </footer>

    </div>
  )
}