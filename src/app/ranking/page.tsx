'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface LeaderboardUser {
  user_id: string
  name: string
  total_xp: number
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const xpMap: { [key: string]: number } = {}

        // 1. Busca o XP dos desafios da Arena (tabela user_challenges)
        const { data: challengesData } = await supabase
          .from('user_challenges')
          .select('user_id, xp_earned')

        if (challengesData) {
          challengesData.forEach((item) => {
            if (!item.user_id) return
            if (!xpMap[item.user_id]) xpMap[item.user_id] = 0
            xpMap[item.user_id] += item.xp_earned || 0
          })
        }

        // 2. Busca as aulas concluídas na Trilha (tabela user_progress -> 50 XP por aula)
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('user_id, completed')

        if (progressData) {
          progressData.forEach((item) => {
            if (!item.user_id || !item.completed) return
            if (!xpMap[item.user_id]) xpMap[item.user_id] = 0
            xpMap[item.user_id] += 50 // Cada aula concluída vale 50 XP
          })
        }

        const uniqueUserIds = Object.keys(xpMap)
        const { data: sessionData } = await supabase.auth.getSession()
        let currentUserName = 'Estudante Codelab'
        let currentUserId = ''

        if (sessionData?.session?.user) {
          currentUserId = sessionData.session.user.id
          setUserId(currentUserId)
          const meta = sessionData.session.user.user_metadata
          currentUserName = meta?.full_name || meta?.name || 'Estudante Codelab'
        }

        const formattedRanking: LeaderboardUser[] = uniqueUserIds.map((id) => {
          let name = 'Estudante Codelab'
          if (id === currentUserId) {
            name = currentUserName
          } else if (id === 'a7ee38e0-6a2a-4b76-88b3-9a7eae68c2d9') {
            name = 'João'
          }

          return {
            user_id: id,
            name: name,
            total_xp: xpMap[id],
          }
        }).sort((a, b) => b.total_xp - a.total_xp)

        setRanking(formattedRanking)
      } catch (err) {
        console.error('Erro ao carregar ranking:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('codelab_')) {
          localStorage.removeItem(key)
        }
      })
    }
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-amber-500 selection:text-gray-950 relative overflow-x-hidden animate-fadeIn">
      
      {/* Header Padronizado e Unificado */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-amber-500/20 text-amber-400 font-bold text-sm rounded-xl shrink-0 border border-amber-500/30 flex items-center justify-center select-none shadow-lg shadow-amber-500/10">
            🏆
          </div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Ranking <span className="text-amber-400 font-normal">Codelab</span>
          </h1>
        </div>

        {/* Menu Desktop Unificado */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link href="/dashboard" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">📖 Trilha</Link>
          <Link href="/desafios" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">⚔️ Arena</Link>
          <Link href="/ranking" className="px-3 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold">🏆 Ranking</Link>
          <Link href="/medalhas" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">🎖️ Medalhas</Link>
          <Link href="/contato" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">💬 Contato</Link>
          {userId ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
              <Link href="/painel" className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold">⚙️ Painel</Link>
              <button onClick={handleLogout} className="px-3.5 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold cursor-pointer">Sair</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
              <Link href="/login" className="px-3.5 py-2 bg-gray-900 text-gray-300 border border-gray-800 rounded-xl text-xs">Entrar</Link>
              <Link href="/cadastro" className="px-3.5 py-2 bg-emerald-500 text-gray-950 font-extrabold rounded-xl text-xs">Criar Conta</Link>
            </div>
          )}
        </div>

        {/* Botão Hambúrguer Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-amber-400 font-bold">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Menu Dropdown Mobile Unificado */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-2 z-50 shadow-2xl animate-fadeIn">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">📖 Ir para a Trilha</Link>
          <Link href="/desafios" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">⚔️ Arena de Desafios</Link>
          <Link href="/ranking" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-amber-500/30 rounded-xl text-xs text-amber-400 font-semibold">🏆 Ranking Geral</Link>
          <Link href="/medalhas" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">🎖️ Painel de Medalhas</Link>
          <Link href="/contato" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-medium">💬 Contato</Link>
          {userId ? (
            <>
              <Link href="/painel" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium">⚙️ Meu Painel</Link>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-left px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl text-xs">🚪 Sair da Conta</button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="px-4 py-3 bg-gray-950 border border-gray-800 text-center font-semibold rounded-xl text-xs text-gray-300">Entrar</Link>
              <Link href="/cadastro" onClick={() => setMenuOpen(false)} className="px-4 py-3 bg-emerald-500 text-gray-950 text-center font-extrabold rounded-xl text-xs">Criar Conta</Link>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-20">
        
        <div className="space-y-2.5 bg-gradient-to-r from-amber-500/10 via-gray-900 to-gray-900 border border-amber-500/20 p-5 sm:p-6 rounded-2xl text-center shadow-sm">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Placar de Líderes 🏆</span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Os Melhores Programadores</h2>
          <p className="text-gray-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Pontuação unificada somando o XP das aulas concluídas na trilha e dos desafios resolvidos na Arena!
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Posição / Aluno</span>
            <span>XP Total</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-gray-400">
              Carregando placar unificado...
            </div>
          ) : ranking.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-xs text-gray-400">Ainda não há pontuações registradas no ranking.</p>
              <Link href="/dashboard" className="inline-block px-4 py-2 bg-amber-500 text-gray-950 font-extrabold text-xs rounded-xl">
                Começar a estudar ⚡
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/60">
              {ranking.map((user, index) => {
                const position = index + 1
                let badgeColor = 'bg-gray-800 text-gray-300 border-gray-700'
                if (position === 1) badgeColor = 'bg-amber-500 text-gray-950 border-amber-400 font-black'
                if (position === 2) badgeColor = 'bg-gray-300 text-gray-950 border-gray-200 font-bold'
                if (position === 3) badgeColor = 'bg-amber-700 text-white border-amber-600 font-bold'

                return (
                  <div key={user.user_id} className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-gray-850 transition">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 border ${badgeColor}`}>
                        {position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `#${position}`}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                          {user.name}
                        </h4>
                        <p className="text-[11px] text-gray-400 truncate">Estudante Codelab</p>
                      </div>
                    </div>

                    <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-xl shrink-0">
                      ⭐ {user.total_xp} XP
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}