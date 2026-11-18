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

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        // 1. Busca todos os registros de XP da tabela user_challenges
        const { data, error } = await supabase
          .from('user_challenges')
          .select('user_id, xp_earned')

        if (error) throw error

        if (data && data.length > 0) {
          // 2. Agrupa o XP somando por user_id
          const xpMap: { [key: string]: number } = {}
          data.forEach((item) => {
            if (!item.user_id) return
            if (!xpMap[item.user_id]) {
              xpMap[item.user_id] = 0
            }
            xpMap[item.user_id] += item.xp_earned || 0
          })

          const uniqueUserIds = Object.keys(xpMap)

          // 3. Tenta buscar os dados dos usuários na sessão atual ou via API se permitido, 
          // ou mapeia de forma inteligente. Como o cliente web comum não lê auth.users direto,
          // podemos armazenar/ler do cache ou usar uma rota segura, ou mapear IDs conhecidos.
          // Para garantir que o nome alterado no painel apareça, vamos buscar o perfil ativo se for o próprio usuário,
          // ou atribuir o nome customizado.
          
          const { data: sessionData } = await supabase.auth.getSession()
          let currentUserName = 'Estudante Codelab'
          let currentUserId = ''

          if (sessionData?.session?.user) {
            currentUserId = sessionData.session.user.id
            const meta = sessionData.session.user.user_metadata
            currentUserName = meta?.full_name || meta?.name || 'Estudante Codelab'
          }

          // 4. Monta o ranking final ordenado do maior para o menor XP
          const formattedRanking: LeaderboardUser[] = uniqueUserIds.map((id) => {
            let name = 'Estudante Codelab'
            
            // Se for o usuário logado atualmente, usa o nome atualizado dele
            if (id === currentUserId) {
              name = currentUserName
            } else if (id === 'a7ee38e0-6a2a-4b76-88b3-9a7eae68c2d9') {
              name = 'João' // Fallback para o seu ID principal do print
            }

            return {
              user_id: id,
              name: name,
              total_xp: xpMap[id],
            }
          }).sort((a, b) => b.total_xp - a.total_xp)

          setRanking(formattedRanking)
        }
      } catch (err) {
        console.error('Erro ao carregar ranking:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-amber-500 selection:text-gray-950 relative overflow-x-hidden animate-fadeIn">
      
      {/* Header Responsivo */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-amber-500/20 text-amber-400 font-bold text-sm rounded-xl shrink-0 border border-amber-500/30 flex items-center justify-center select-none shadow-lg shadow-amber-500/10">
            🏆
          </div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Ranking <span className="text-amber-400 font-normal">Codelab</span>
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link href="/desafios" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 font-semibold text-xs rounded-xl transition">
            ⚔️ Arena
          </Link>
          <Link href="/dashboard" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 font-semibold text-xs rounded-xl transition">
            📖 Trilha
          </Link>
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-amber-400 font-bold">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-2.5 z-50 shadow-2xl animate-fadeIn">
          <Link href="/desafios" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300">
            ⚔️ Ir para a Arena
          </Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300">
            📖 Voltar para a Trilha
          </Link>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-20">
        
        <div className="space-y-2.5 bg-gradient-to-r from-amber-500/10 via-gray-900 to-gray-900 border border-amber-500/20 p-5 sm:p-6 rounded-2xl text-center">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Placar de Líderes 🏆</span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Os Melhores Programadores</h2>
          <p className="text-gray-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Veja quem está acumulando mais XP resolvendo desafios na Arena. Responda missões para garantir o seu lugar no pódio!
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>Posição / Aluno</span>
            <span>XP Acumulado</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-gray-500">
              Carregando placar...
            </div>
          ) : ranking.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-xs text-gray-400">Ainda não há pontuações registradas no ranking.</p>
              <Link href="/desafios" className="inline-block px-4 py-2 bg-amber-500 text-gray-950 font-extrabold text-xs rounded-xl">
                Seja o primeiro a pontuar ⚡
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
                        <p className="text-[11px] text-gray-500 truncate">Membro ativo da Arena</p>
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