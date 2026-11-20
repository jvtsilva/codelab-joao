'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ARENA_CHALLENGES } from '@/data/challenges'
import { Navbar } from '@/components/Navbar'

const STORAGE_KEY = 'codelab_tema_aula'

export default function ArenaPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [userXp, setUserXp] = useState<number>(0)
  const [completedIds, setCompletedIds] = useState<string[]>([])
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

    async function loadUserArena() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!active) return

      if (session) {
        const currentUserId = session.user.id
        setUserId(currentUserId)

        const { data: challenges, error } = await supabase
          .from('user_challenges')
          .select('challenge_id, completed, xp_earned')
          .eq('user_id', currentUserId)

        if (!active) return

        if (!error && challenges) {
          const totalXpFromDb = challenges.reduce((acc, curr) => acc + (curr.xp_earned || 0), 0)
          setUserXp(totalXpFromDb)
          setCompletedIds(challenges.filter((c) => c.completed).map((c) => c.challenge_id))

          if (typeof window !== 'undefined') {
            localStorage.setItem('codelab_user_xp', String(totalXpFromDb))
          }
        }
      } else if (typeof window !== 'undefined') {
        const savedXp = localStorage.getItem('codelab_user_xp')
        if (savedXp) setUserXp(Number(savedXp))

        const localDone: string[] = []
        ARENA_CHALLENGES.forEach((ch) => {
          if (localStorage.getItem(`codelab_visitante_${ch.id}`)) {
            localDone.push(ch.id)
          }
        })
        setCompletedIds(localDone)
      }
    }

    loadUserArena()

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

  const handleProtectedNav = (e: React.MouseEvent<HTMLAnchorElement>, targetHref: string) => {
    if (!userId) {
      e.preventDefault()
      router.push('/login')
      return
    }
    router.push(targetHref)
  }

  const totalChallenges = ARENA_CHALLENGES.length
  const progressPercent =
    totalChallenges > 0 ? Math.min(100, Math.round((completedIds.length / totalChallenges) * 100)) : 0

  const cardClasses =
    'bg-white border-stone-200 text-stone-900 shadow-xs dark:bg-gray-900/90 dark:border-gray-800 dark:text-white dark:shadow-none'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const accentAmberClasses = 'text-amber-700 dark:text-amber-400'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-amber-500 selection:text-gray-950 relative overflow-x-hidden">
      <Navbar
        activeTab="desafios"
        subtitle="Arena Codelab"
        userId={userId}
        userXp={userXp}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      {/* Vitrine dos Desafios */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-20">
        {/* Banner */}
        <div className="space-y-3 border p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-50/50 border-amber-600/25 dark:bg-gray-900 dark:border-amber-500/20">
          <div className="space-y-1.5">
            <span className={`text-xs font-bold uppercase tracking-wider block ${accentAmberClasses}`}>
              Desafios de Código • Prática XP
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Pratique sua lógica em missões curtas
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${textMutedClasses}`}>
              Escolha um desafio, escreva sua solução no editor e ganhe XP para acompanhar sua evolução.
            </p>
          </div>
          <Link
            href="/ranking"
            onClick={(e) => handleProtectedNav(e, '/ranking')}
            className="px-4 py-3 border font-extrabold text-xs rounded-xl flex items-center gap-2 shrink-0 cursor-pointer bg-amber-100 hover:bg-amber-200/80 border-amber-600/35 text-amber-900 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:border-amber-500/40 dark:text-amber-300"
          >
            🏆 Ranking Geral
          </Link>
        </div>

        {/* Barra de Progresso */}
        <div className={`border p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${cardClasses}`}>
          <div className="space-y-1">
            <span className={`text-xs font-medium ${textMutedClasses}`}>
              Progresso nos desafios
            </span>
            <p suppressHydrationWarning className="text-sm font-bold">
              {completedIds.length} de {totalChallenges} concluídos
            </p>
          </div>
          <div className="w-full sm:w-48 h-3 rounded-full overflow-hidden border p-0.5 bg-stone-100 border-stone-200 dark:bg-gray-950 dark:border-gray-800">
            <div
              suppressHydrationWarning
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Lista de Desafios */}
        <div className="space-y-3">
          {ARENA_CHALLENGES.map((challenge) => {
            const isDone = completedIds.includes(challenge.id)
            return (
              <Link
                key={challenge.id}
                href={`/desafios/${challenge.slug}`}
                className={`p-4 sm:p-5 border rounded-2xl flex items-center justify-between gap-3 group block ${cardClasses} hover:border-amber-600/50 dark:hover:border-amber-500/50`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    suppressHydrationWarning
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                      isDone
                        ? `bg-emerald-50 border-emerald-600/35 ${accentGreenClasses} dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-400`
                        : `bg-amber-50 border-amber-600/30 ${accentAmberClasses} dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400`
                    }`}
                  >
                    {isDone ? '✓' : challenge.number}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold truncate text-stone-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                        {challenge.title}
                      </h3>
                      <span className="px-2 py-0.5 border text-[10px] font-bold rounded shrink-0 bg-amber-50 text-amber-800 border-amber-600/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${textMutedClasses}`}>
                      <strong className={accentAmberClasses}>+{challenge.xp} XP</strong> • {challenge.subtitle}
                    </p>
                  </div>
                </div>

                <span suppressHydrationWarning className={`text-xs font-bold group-hover:underline shrink-0 ${accentAmberClasses}`}>
                  {isDone ? 'Revisar' : 'Jogar'}
                </span>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}