'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function HomePage() {
  const [session, setSession] = useState<any>(null)
  const [userXp, setUserXp] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (typeof window !== 'undefined') {
        const savedXp = localStorage.getItem('codelab_user_xp')
        if (savedXp) setUserXp(Number(savedXp))
      }
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-gray-950 relative overflow-x-hidden">
      
      {/* Header Responsivo */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg border border-emerald-500/30 shrink-0">
            JS
          </span>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Codelab <span className="text-emerald-400 font-normal">João</span>
          </h1>
        </div>

        {/* Menu Desktop */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Link 
            href="/contato" 
            className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>💬</span> Contato
          </Link>

          {!loading && (
            session ? (
              <Link 
                href="/dashboard"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Painel</span> <span>🚀</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login"
                  className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Entrar
                </Link>
                <Link 
                  href="/cadastro"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Criar Conta
                </Link>
              </div>
            )
          )}
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
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-3 z-50 shadow-2xl animate-fadeIn">
          <Link 
            href="/contato" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-medium text-gray-300 hover:text-white"
          >
            <span>💬</span> Central de Contato
          </Link>

          {!loading && (
            session ? (
              <Link 
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 bg-emerald-500 text-gray-950 font-extrabold rounded-xl text-xs"
              >
                <span>Acessar Painel</span> <span>🚀</span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link 
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 bg-gray-950 border border-gray-800 text-center font-semibold rounded-xl text-xs text-gray-300"
                >
                  Entrar
                </Link>
                <Link 
                  href="/cadastro"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 bg-emerald-500 text-gray-950 text-center font-extrabold rounded-xl text-xs shadow-lg"
                >
                  Criar Conta
                </Link>
              </div>
            )
          )}
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-14 md:py-16 flex flex-col items-center text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span>✨</span> 
          {userXp > 0 ? `Seu XP Atual: ${userXp} XP ⚡` : 'Modo Visitante Ativo • Aulas + Arena XP'}
        </div>

        <div className="space-y-3 sm:space-y-4 max-w-3xl">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Aprenda JavaScript de verdade, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">sem complicação.</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Desenvolvido para iniciantes. Domine a lógica de programação através de trilhas de aulas interativas e missões práticas no navegador.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs sm:text-sm rounded-xl transition shadow-xl shadow-emerald-500/20 text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>📖</span> Acessar Trilha de Aulas
          </Link>

          <Link 
            href="/desafios"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-amber-400 border border-amber-500/30 font-bold text-xs sm:text-sm rounded-xl transition text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>⚔️</span> Arena de Desafios (XP)
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full pt-8 sm:pt-12 text-left">
          <div className="p-4 sm:p-6 bg-gray-900/60 border border-gray-800 rounded-2xl space-y-2">
            <div className="text-xl sm:text-2xl">📖</div>
            <h3 className="font-bold text-white text-sm">Trilha de Aulas</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Conteúdos organizados passo a passo com teoria visual e laboratório.</p>
          </div>
          <div className="p-4 sm:p-6 bg-gray-900/60 border border-gray-800 rounded-2xl space-y-2">
            <div className="text-xl sm:text-2xl">⚡</div>
            <h3 className="font-bold text-white text-sm">Modo Visitante Livre</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Experimente as aulas imediatamente, sem login obrigatório.</p>
          </div>
          <div className="p-4 sm:p-6 bg-gray-900/60 border border-gray-800 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="text-xl sm:text-2xl">🏆</div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                {userXp > 0 ? `${userXp} XP` : 'Até 500+ XP'}
              </span>
            </div>
            <h3 className="font-bold text-white text-sm">Arena com XP</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Teste sua lógica em desafios práticos e acumule pontos.</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs text-gray-500 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>Codelab João • Plataforma educacional voltada para o aprendizado prático</p>
        <Link href="/contato" className="hover:text-emerald-400 transition font-medium text-gray-400">
          💬 Central de Atendimento e Suporte
        </Link>
      </footer>
    </div>
  )
}