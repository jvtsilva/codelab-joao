'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

interface LeaderboardUser {
  user_id: string
  name: string
  total_xp: number
}

const STORAGE_KEY = 'codelab_tema_aula'
const INSTRUTOR_ID = 'a7ee38e0-6a2a-4b76-88b3-9a7eae68c2d9'
const XP_POR_AULA = 50

export default function RankingPage() {
  const [ranking, setRanking] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(true)

  useLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  useEffect(() => {
    let active = true

    async function fetchLeaderboard() {
      try {
        const xpMap: Record<string, number> = {}

        // 1. XP dos desafios da Arena
        const { data: challengesData, error: challengesError } = await supabase
          .from('user_challenges')
          .select('user_id, xp_earned')

        if (!active) return

        if (!challengesError && challengesData) {
          challengesData.forEach((item) => {
            if (!item.user_id) return
            xpMap[item.user_id] = (xpMap[item.user_id] || 0) + (item.xp_earned || 0)
          })
        }

        // 2. XP das aulas concluídas na Trilha
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('user_id, completed')

        if (!active) return

        if (!progressError && progressData) {
          progressData.forEach((item) => {
            if (!item.user_id || !item.completed) return
            xpMap[item.user_id] = (xpMap[item.user_id] || 0) + XP_POR_AULA
          })
        }

        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!active) return

        let currentUserId: string | null = null
        let currentUserName = 'Estudante Codelab'

        if (session?.user) {
          currentUserId = session.user.id
          setUserId(currentUserId)
          const meta = session.user.user_metadata
          currentUserName = meta?.full_name || meta?.name || 'Estudante Codelab'
        }

        const formattedRanking: LeaderboardUser[] = Object.keys(xpMap)
          .map((id) => {
            let name = 'Estudante Codelab'
            if (currentUserId && id === currentUserId) {
              name = currentUserName
            } else if (id === INSTRUTOR_ID) {
              name = 'João'
            }

            return {
              user_id: id,
              name,
              total_xp: xpMap[id],
            }
          })
          .sort((a, b) => b.total_xp - a.total_xp)

        setRanking(formattedRanking)
      } catch (err) {
        console.error('Erro ao carregar ranking:', err)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchLeaderboard()

    return () => {
      active = false
    }
  }, [])

  const alternarTema = () => {
    setIsDark((atual) => {
      const proximo = !atual
      localStorage.setItem(STORAGE_KEY, proximo ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', proximo)
      document.documentElement.style.backgroundColor = proximo ? '#030712' : '#fafaf9'
      return proximo
    })
  }

  const currentUserIndex = userId ? ranking.findIndex((item) => item.user_id === userId) : -1
  const currentUserEntry = currentUserIndex >= 0 ? ranking[currentUserIndex] : null

  const cardClasses =
    'bg-white border-stone-200 text-stone-900 shadow-xs dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:shadow-xl'
  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const textSubtleClasses = 'text-stone-500 dark:text-gray-500'
  const accentAmberClasses = 'text-amber-700 dark:text-amber-400'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-amber-500 selection:text-gray-950 bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
      <Navbar
        activeTab="ranking"
        subtitle="Placar Codelab"
        userId={userId}
        userXp={currentUserEntry?.total_xp}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-20">
        <div className="space-y-2 border p-5 sm:p-6 rounded-2xl text-center bg-white border-amber-600/25 shadow-sm dark:bg-gray-900 dark:border-amber-500/25 dark:shadow-xl">
          <span className={`text-xs font-bold uppercase tracking-wider block ${accentAmberClasses}`}>
            Placar Geral 🏆
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-white">
            Ranking de XP
          </h2>
          <p className={`text-xs sm:text-sm max-w-lg mx-auto leading-relaxed ${textMutedClasses}`}>
            Soma das aulas concluídas na trilha ({XP_POR_AULA} XP por aula) e dos desafios resolvidos na plataforma.
          </p>
        </div>

        {currentUserEntry && (
          <div className="border rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 text-xs bg-emerald-50 border-emerald-600/25 text-stone-900 dark:bg-gray-900 dark:border-emerald-500/25 dark:text-white">
            <div>
              <span className={`font-bold ${accentGreenClasses}`}>Sua posição atual:</span>{' '}
              <span className="font-extrabold">#{currentUserIndex + 1}</span>
              <span className={textMutedClasses}> de {ranking.length} no placar</span>
            </div>
            <span className={`font-extrabold ${accentAmberClasses}`}>
              ⭐ {currentUserEntry.total_xp.toLocaleString('pt-BR')} XP
            </span>
          </div>
        )}

        <div className={`border rounded-2xl overflow-hidden ${cardClasses}`}>
          <div
            className={`p-4 sm:p-5 border-b flex items-center justify-between text-xs font-bold uppercase tracking-wider ${textSubtleClasses} border-stone-200 dark:border-gray-800`}
          >
            <span>Posição / Aluno</span>
            <span>XP Total</span>
          </div>

          {loading ? (
            <div className={`p-8 flex items-center justify-center gap-2 text-xs ${textMutedClasses}`}>
              <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-amber-700 dark:border-amber-400" />
              <span>Carregando ranking...</span>
            </div>
          ) : ranking.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className={`text-xs ${textMutedClasses}`}>
                Ainda não há pontuações registradas no ranking.
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl"
              >
                Começar a estudar ⚡
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-200 dark:divide-gray-800/60">
              {ranking.map((user, index) => {
                const position = index + 1
                const isCurrentUser = Boolean(userId && user.user_id === userId)
                const isInstructor = user.user_id === INSTRUTOR_ID

                let badgeColor =
                  'bg-stone-100 text-stone-700 border-stone-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                if (position === 1) badgeColor = 'bg-amber-500 text-gray-950 border-amber-400 font-black'
                if (position === 2) badgeColor = 'bg-gray-300 text-gray-950 border-gray-200 font-bold'
                if (position === 3) badgeColor = 'bg-amber-700 text-white border-amber-600 font-bold'

                return (
                  <div
                    key={user.user_id}
                    className={`p-4 sm:p-5 flex items-center justify-between gap-3 ${
                      isCurrentUser
                        ? 'bg-emerald-50/70 dark:bg-emerald-500/5'
                        : 'hover:bg-stone-50 dark:hover:bg-gray-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 border ${badgeColor}`}
                      >
                        {position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `#${position}`}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm truncate">
                            {user.name}
                          </h4>
                          {isCurrentUser && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-emerald-50 text-emerald-700 border-emerald-600/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
                              Você
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] truncate ${textMutedClasses}`}>
                          {isInstructor ? 'Instrutor • Codelab João' : 'Estudante Codelab'}
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-1.5 border font-bold text-xs rounded-xl shrink-0 bg-amber-50 border-amber-600/30 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400">
                      ⭐ {user.total_xp.toLocaleString('pt-BR')} XP
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