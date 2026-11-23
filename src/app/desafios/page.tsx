'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ARENA_CHALLENGES, ArenaChallenge } from '@/data/challenges'
import { Navbar } from '@/components/Navbar'

const STORAGE_KEY = 'codelab_tema_aula'

const MODULE_GROUPS: {
  id: number
  titulo: string
  descricao: string
  match: (ch: ArenaChallenge) => boolean
}[] = [
  {
    id: 1,
    titulo: 'Módulo 1: Lógica e Decomposição',
    descricao: 'Ordem das instruções, condições do dia a dia e decomposição em etapas (Aulas 1 a 3)',
    match: (ch) =>
      ch.subtitle.includes('Aula 1') ||
      ch.subtitle.includes('Aula 2') ||
      ch.subtitle.includes('Aula 3'),
  },
  {
    id: 2,
    titulo: 'Módulo 2: Dados, Tipos e Lógica',
    descricao: 'Variáveis, tipos, comparações, operadores lógicos e regras combinadas (Aulas 4 a 8)',
    match: (ch) =>
      ['Aula 4', 'Aula 5', 'Aula 6', 'Aula 7', 'Aula 8'].some((a) =>
        ch.subtitle.includes(a)
      ),
  },
  {
    id: 3,
    titulo: 'Módulo 3: Fluxo, Loops e Arrays',
    descricao: 'Decisões com if/else, loops for/while, arrays por índice e percurso de listas (Aulas 9 a 12)',
    match: (ch) =>
      ['Aula 9', 'Aula 10', 'Aula 11', 'Aula 12'].some((a) =>
        ch.subtitle.includes(a)
      ),
  },
  {
    id: 4,
    titulo: 'Módulo 4: Funções, Objetos e Projeto',
    descricao: 'Funções com parâmetros e return, objetos, listas de objetos e resumo de pedidos (Aulas 13 a 16)',
    match: (ch) =>
      ['Aula 13', 'Aula 14', 'Aula 15', 'Aula 16'].some((a) =>
        ch.subtitle.includes(a)
      ),
  },
]

export default function ArenaPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [userXp, setUserXp] = useState<number>(0)
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [isDark, setIsDark] = useState(true)
  const [modulosAbertos, setModulosAbertos] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  })

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

  const toggleModulo = (moduloId: number) => {
    setModulosAbertos((prev) => ({
      ...prev,
      [moduloId]: !prev[moduloId],
    }))
  }

  const handleProtectedNav = (e: React.MouseEvent<HTMLAnchorElement>, targetHref: string) => {
    if (!userId) {
      e.preventDefault()
      router.push('/login')
      return
    }
    router.push(targetHref)
  }

  const groupedModules = MODULE_GROUPS.map((group) => ({
    ...group,
    challenges: ARENA_CHALLENGES.filter(group.match),
  })).filter((group) => group.challenges.length > 0)

  const totalChallenges = ARENA_CHALLENGES.length
  const progressPercent =
    totalChallenges > 0 ? Math.min(100, Math.round((completedIds.length / totalChallenges) * 100)) : 0

  const cardClasses =
    'bg-white border-stone-200 text-stone-900 shadow-xs dark:bg-gray-900/90 dark:border-gray-800 dark:text-white dark:shadow-none'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const accentAmberClasses = 'text-amber-700 dark:text-amber-400'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-amber-500 selection:text-gray-950 relative">
      <Navbar
        activeTab="desafios"
        subtitle="Arena Codelab"
        userId={userId}
        userXp={userXp}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      {/* Vitrine dos Desafios */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3.5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 pb-12">
        {/* Banner */}
        <div className="space-y-3 border p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-50/50 border-amber-600/25 dark:bg-gray-900 dark:border-amber-500/20">
          <div className="space-y-1.5">
            <span className={`text-xs font-bold uppercase tracking-wider block ${accentAmberClasses}`}>
              Desafios de Código • Prática XP
            </span>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-snug">
              Pratique sua lógica por módulo
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${textMutedClasses}`}>
              Abra um módulo, resolva as missões no editor ou no quiz e acumule XP no seu ritmo.
            </p>
          </div>
          <Link
            href="/ranking"
            onClick={(e) => handleProtectedNav(e, '/ranking')}
            className="w-full sm:w-auto justify-center px-4 py-3 border font-extrabold text-xs rounded-xl flex items-center gap-2 shrink-0 cursor-pointer bg-amber-100 hover:bg-amber-200/80 border-amber-600/35 text-amber-900 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:border-amber-500/40 dark:text-amber-300"
          >
            🏆 Ranking Geral
          </Link>
        </div>

        {/* Barra de Progresso */}
        <div
          className={`border p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${cardClasses}`}
        >
          <div className="space-y-1">
            <span className={`text-xs font-medium ${textMutedClasses}`}>
              Progresso nos desafios
            </span>
            <p suppressHydrationWarning className="text-sm font-bold tabular-nums">
              {completedIds.length} de {totalChallenges} concluídos
            </p>
          </div>
          <div className="w-full sm:w-48 h-3 rounded-full overflow-hidden border p-0.5 bg-stone-100 border-stone-200 dark:bg-gray-950 dark:border-gray-800">
            <div
              suppressHydrationWarning
              className="bg-amber-500 h-full rounded-full transition-[width] duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Desafios agrupados por módulo */}
        <div className="space-y-4">
          {groupedModules.map((modulo) => {
            const modDoneCount = modulo.challenges.filter((ch) =>
              completedIds.includes(ch.id)
            ).length
            const modTotalCount = modulo.challenges.length
            const isModDone = modTotalCount > 0 && modDoneCount === modTotalCount
            const isOpen = Boolean(modulosAbertos[modulo.id])

            return (
              <div key={modulo.id} className={`border rounded-2xl overflow-hidden ${cardClasses}`}>
                <button
                  type="button"
                  onClick={() => toggleModulo(modulo.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 text-left cursor-pointer hover:bg-stone-50 dark:hover:bg-gray-800/60"
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                    <div
                      suppressHydrationWarning
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isModDone
                          ? 'bg-emerald-500 text-gray-950 font-black'
                          : 'bg-amber-50 text-amber-800 border border-amber-600/30 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                      }`}
                    >
                      {isModDone ? '✓' : modulo.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base leading-snug break-words">
                        {modulo.titulo}
                      </h3>
                      <p className={`text-xs leading-relaxed break-words mt-0.5 ${textMutedClasses}`}>
                        {modulo.descricao}
                      </p>
                      <p
                        suppressHydrationWarning
                        className={`text-[11px] mt-1 font-medium tabular-nums ${accentAmberClasses}`}
                      >
                        {modDoneCount} de {modTotalCount} missões concluídas
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 font-semibold text-xs ${textMutedClasses}`}>
                    {isOpen ? 'Recolher' : 'Abrir'}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-3.5 sm:p-5 border-t space-y-2.5 border-stone-200 bg-stone-50/70 dark:border-gray-800/80 dark:bg-gray-950/40">
                    {modulo.challenges.map((challenge) => {
                      const isDone = completedIds.includes(challenge.id)
                      return (
                        <Link
                          key={challenge.id}
                          href={`/desafios/${challenge.slug}`}
                          className="p-3.5 sm:p-4 border rounded-xl flex items-center justify-between gap-2.5 sm:gap-3 group bg-white border-stone-200 hover:border-amber-600/50 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-amber-500/50"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
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
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-xs sm:text-sm font-bold leading-snug break-words text-stone-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                                  {challenge.title}
                                </h4>
                                <span className="px-2 py-0.5 border text-[10px] font-bold rounded shrink-0 bg-amber-50 text-amber-800 border-amber-600/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
                                  {challenge.difficulty}
                                </span>
                              </div>
                              <p className={`text-xs mt-0.5 leading-relaxed break-words ${textMutedClasses}`}>
                                <strong className={accentAmberClasses}>+{challenge.xp} XP</strong> •{' '}
                                {challenge.subtitle}
                              </p>
                            </div>
                          </div>

                          <span
                            suppressHydrationWarning
                            className={`text-xs font-bold group-hover:underline shrink-0 ${accentAmberClasses}`}
                          >
                            {isDone ? 'Revisar' : 'Jogar'}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      <footer className="border-t border-stone-200 dark:border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 dark:text-gray-500">
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