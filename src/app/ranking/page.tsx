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

interface RankingRpcRow {
  user_id: string
  name: string | null
  total_xp: number | string | null
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
        const [{ data: xpRows, error: rpcError }, { data: sessionData }] = await Promise.all([
          supabase.rpc('get_ranking_xp'),
          supabase.auth.getSession(),
        ])

        if (!active) return

        if (rpcError) {
          console.error('Erro ao buscar XP do ranking:', rpcError)
        }

        const currentUserId = sessionData?.session?.user?.id ?? null
        setUserId(currentUserId)

        const formattedRanking: LeaderboardUser[] = ((xpRows as RankingRpcRow[] | null) || [])
          .filter((row) => Boolean(row.user_id))
          .map((row) => ({
            user_id: row.user_id,
            name: (row.name || '').trim() || 'Estudante Codelab',
            total_xp: Number(row.total_xp || 0),
          }))
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
    <div className="min-h-screen flex flex-col relative selection:bg-amber-500 selection:text-gray-950 bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
      <Navbar
        activeTab="ranking"
        subtitle="Placar Codelab"
        userId={userId}
        userXp={currentUserEntry?.total_xp}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto p-3.5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <Link
            href="/desafios"
            className="text-xs sm:text-sm font-semibold text-stone-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 py-1"
          >
            ← Voltar para Desafios
          </Link>
        </div>

        <div className="space-y-2 border p-4 sm:p-6 rounded-2xl text-center bg-white border-amber-600/25 shadow-sm dark:bg-gray-900 dark:border-amber-500/25 dark:shadow-xl">
          <span className={`text-xs font-bold uppercase tracking-wider block ${accentAmberClasses}`}>
            Placar Geral 🏆
          </span>
          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-stone-900 dark:text-white">
            Ranking de XP
          </h2>
          <p className={`text-[15px] sm:text-base max-w-lg mx-auto leading-relaxed tabular-nums ${textMutedClasses}`}>
            Soma das aulas concluídas na trilha ({XP_POR_AULA} XP por aula) e dos desafios resolvidos na plataforma.
          </p>
        </div>

        {currentUserEntry && (
          <div className="border rounded-2xl px-3.5 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between gap-2.5 text-xs sm:text-sm tabular-nums bg-emerald-50 border-emerald-600/25 text-stone-900 dark:bg-gray-900 dark:border-emerald-500/25 dark:text-white">
            <div className="min-w-0">
              <span className={`font-bold ${accentGreenClasses}`}>Sua posição:</span>{' '}
              <span className="font-extrabold">#{currentUserIndex + 1}</span>
              <span className={textMutedClasses}> de {ranking.length}</span>
            </div>
            <span className={`font-extrabold shrink-0 ${accentAmberClasses}`}>
              ⭐ {currentUserEntry.total_xp.toLocaleString('pt-BR')} XP
            </span>
          </div>
        )}

        <div className={`border rounded-2xl overflow-hidden ${cardClasses}`}>
          <div
            className={`px-3.5 sm:px-5 py-3.5 sm:py-4 border-b flex items-center justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wider ${textSubtleClasses} border-stone-200 dark:border-gray-800`}
          >
            <span>Posição / Aluno</span>
            <span>XP Total</span>
          </div>

          {loading ? (
            <div className={`p-8 flex items-center justify-center gap-2 text-xs sm:text-sm ${textMutedClasses}`}>
              <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-amber-700 dark:border-amber-400" />
              <span>Carregando ranking...</span>
            </div>
          ) : ranking.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className={`text-xs sm:text-sm ${textMutedClasses}`}>
                Ainda não há pontuações registradas no ranking.
              </p>
              <Link
                href="/desafios"
                className="inline-block px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl"
              >
                Ir para Desafios ⚡
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
                    className={`p-3.5 sm:p-5 flex items-center justify-between gap-2.5 sm:gap-3 ${
                      isCurrentUser
                        ? 'bg-emerald-50/70 dark:bg-emerald-500/5'
                        : 'hover:bg-stone-50 dark:hover:bg-gray-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs tabular-nums shrink-0 border ${badgeColor}`}
                      >
                        {position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `#${position}`}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <h4 className="font-bold text-sm sm:text-base leading-snug break-words">
                            {user.name}
                          </h4>
                          {isCurrentUser && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-emerald-50 text-emerald-700 border-emerald-600/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
                              Você
                            </span>
                          )}
                        </div>
                        <p className={`text-xs leading-snug break-words mt-0.5 ${textMutedClasses}`}>
                          {isInstructor ? 'Instrutor • Codelab João' : 'Estudante Codelab'}
                        </p>
                      </div>
                    </div>

                    <div className="px-2.5 sm:px-3 py-1.5 border font-bold text-xs tabular-nums rounded-xl shrink-0 bg-amber-50 border-amber-600/30 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400">
                      ⭐ {user.total_xp.toLocaleString('pt-BR')} XP
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-stone-200 dark:border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs max-w-3xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 dark:text-gray-500">
        <p>Codelab João • Aprendizado prático de JavaScript</p>
        <Link
          href="/contato"
          className="font-medium hover:text-emerald-700 text-stone-600 dark:hover:text-emerald-400 dark:text-gray-400"
        >
          💬 Contato e Suporte
        </Link>
      </footer>
    </div>
  )
}