'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/hooks/useTheme'
import { ARENA_CHALLENGES, type ArenaChallenge } from '@/data/challenges'
import { Navbar } from '@/components/Navbar'
import { LabSurface } from '@/components/LabSurface'

type DifficultyFilter = 'Todos' | ArenaChallenge['difficulty']
type TypeFilter = 'Todos' | ArenaChallenge['type']

const DIFFICULTIES: DifficultyFilter[] = [
  'Todos',
  'Iniciante',
  'Fácil',
  'Médio',
  'Difícil',
]

function readVisitorCompletedIds(ids: string[]): string[] {
  if (typeof window === 'undefined') return []
  try {
    return ids.filter(
      (id) => window.localStorage.getItem(`codelab_visitante_${id}`) === 'true'
    )
  } catch {
    return []
  }
}

function getDifficultyBadgeClasses(difficulty: ArenaChallenge['difficulty']): string {
  switch (difficulty) {
    case 'Iniciante':
      return 'bg-emerald-500/12 text-emerald-800 border-emerald-600/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
    case 'Fácil':
      return 'bg-sky-500/12 text-sky-800 border-sky-600/30 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30'
    case 'Médio':
      return 'bg-amber-500/15 text-amber-900 border-amber-600/35 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
    case 'Difícil':
      return 'bg-rose-500/12 text-rose-800 border-rose-600/30 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
  }
}

export default function DesafiosPage() {
  const { isDark, alternarTema } = useTheme()
  const [userId, setUserId] = useState<string | null>(null)
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set())
  const [loadingProgress, setLoadingProgress] = useState(true)

  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>('Todos')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Todos')
  const [onlyPending, setOnlyPending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true
    const allIds = ARENA_CHALLENGES.map((c) => c.id)

    async function loadProgress(sessionUserId: string | null) {
      if (!active) return
      setLoadingProgress(true)

      try {
        if (sessionUserId) {
          setUserId(sessionUserId)

          const { data, error } = await supabase
            .from('user_challenges')
            .select('challenge_id')
            .eq('user_id', sessionUserId)

          if (!active) return

          if (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Erro ao buscar desafios concluídos:', error.message)
            }
            setCompletedIds(new Set(readVisitorCompletedIds(allIds)))
            return
          }

          const idsFromDb = Array.isArray(data)
            ? data
                .map((row) => row.challenge_id)
                .filter((id): id is string => typeof id === 'string')
            : []

          const localIds = readVisitorCompletedIds(allIds)
          setCompletedIds(new Set([...idsFromDb, ...localIds]))
        } else {
          setUserId(null)
          setCompletedIds(new Set(readVisitorCompletedIds(allIds)))
        }
      } catch (err) {
        if (!active) return
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro inesperado ao carregar desafios:', err)
        }
        setCompletedIds(new Set(readVisitorCompletedIds(allIds)))
      } finally {
        if (active) {
          setLoadingProgress(false)
        }
      }
    }

    async function initSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (!active) return
        if (error && process.env.NODE_ENV === 'development') {
          console.error('Erro ao obter sessão na Arena:', error.message)
        }
        await loadProgress(data.session?.user?.id ?? null)
      } catch (err) {
        if (!active) return
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro na sessão da Arena:', err)
        }
        await loadProgress(null)
      }
    }

    void initSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!active) return
        void loadProgress(session?.user?.id ?? null)
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const totalXp = useMemo(
    () => ARENA_CHALLENGES.reduce((acc, c) => acc + c.xp, 0),
    []
  )

  const earnedXp = useMemo(
    () =>
      ARENA_CHALLENGES.reduce(
        (acc, c) => (completedIds.has(c.id) ? acc + c.xp : acc),
        0
      ),
    [completedIds]
  )

  const completedCount = completedIds.size
  const totalCount = ARENA_CHALLENGES.length
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const nextPendingChallenge = useMemo(
    () => ARENA_CHALLENGES.find((c) => !completedIds.has(c.id)) ?? ARENA_CHALLENGES[0],
    [completedIds]
  )

  const filteredChallenges = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return ARENA_CHALLENGES.filter((challenge) => {
      if (difficultyFilter !== 'Todos' && challenge.difficulty !== difficultyFilter) {
        return false
      }
      if (typeFilter !== 'Todos' && challenge.type !== typeFilter) {
        return false
      }
      if (onlyPending && completedIds.has(challenge.id)) {
        return false
      }
      if (normalizedSearch) {
        const haystack = [
          challenge.number,
          challenge.title,
          challenge.subtitle,
          challenge.prompt,
          challenge.difficulty,
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(normalizedSearch)) {
          return false
        }
      }
      return true
    })
  }, [completedIds, difficultyFilter, onlyPending, searchQuery, typeFilter])

  const hasActiveFilters =
    difficultyFilter !== 'Todos' ||
    typeFilter !== 'Todos' ||
    onlyPending ||
    searchQuery.trim().length > 0

  const clearFilters = () => {
    setDifficultyFilter('Todos')
    setTypeFilter('Todos')
    setOnlyPending(false)
    setSearchQuery('')
  }

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const btnSecondaryClasses =
    'press-tactile bg-white/95 hover:bg-stone-100 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-300 dark:bg-gray-900/85 dark:hover:bg-gray-800/90 dark:text-gray-300 dark:hover:text-white dark:border-gray-800/90 dark:hover:border-gray-700 transition-all'

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-amber-500 selection:text-gray-950">
      <Navbar
        activeTab="desafios"
        subtitle="Arena Codelab • 24 Missões Práticas"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-6 pb-14">
        <LabSurface variant="card" className="p-5 sm:p-7 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/12 text-amber-800 border border-amber-600/25 dark:text-amber-300 dark:border-amber-500/30">
                Arena de Desafios
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Pratique lógica, código e web missão por missão
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed ${textMutedClasses}`}>
                Resolva quizzes rápidos e trechos de código cobrindo os 6 módulos da trilha.
                {!userId &&
                  ' Modo visitante ativo: seu progresso fica salvo neste navegador até você entrar com sua conta.'}
              </p>
            </div>

            {nextPendingChallenge && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <Link
                  href={`/desafios/${nextPendingChallenge.slug}`}
                  className="press-tactile inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-gray-950 font-black text-xs shadow-sm transition-all"
                >
                  {completedCount === totalCount
                    ? 'Revisar Desafio #1 →'
                    : `Continuar (${nextPendingChallenge.number}) →`}
                </Link>
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center justify-center px-4 py-3 rounded-xl border font-bold text-xs ${btnSecondaryClasses}`}
                >
                  Ver Trilha de Aulas
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <div className="p-4 rounded-2xl border bg-stone-50/90 border-stone-200/90 dark:bg-gray-950/75 dark:border-gray-800/90 space-y-1">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${textMutedClasses}`}>
                Missões Concluídas
              </span>
              <div className="text-xl sm:text-2xl font-black tabular-nums">
                {loadingProgress ? '...' : `${completedCount} / ${totalCount}`}
              </div>
            </div>

            <div className="p-4 rounded-2xl border bg-stone-50/90 border-stone-200/90 dark:bg-gray-950/75 dark:border-gray-800/90 space-y-1">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${textMutedClasses}`}>
                XP Acumulado
              </span>
              <div className="text-xl sm:text-2xl font-black tabular-nums text-amber-700 dark:text-amber-400">
                {loadingProgress ? '...' : `${earnedXp} / ${totalXp} XP`}
              </div>
            </div>

            <div className="p-4 rounded-2xl border bg-stone-50/90 border-stone-200/90 dark:bg-gray-950/75 dark:border-gray-800/90 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                <span className={textMutedClasses}>Progresso Geral</span>
                <span className="tabular-nums text-emerald-700 dark:text-emerald-400">
                  {loadingProgress ? '...' : `${progressPercent}%`}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full overflow-hidden bg-stone-200 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${loadingProgress ? 0 : progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </LabSurface>

        <LabSurface variant="card" className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <label htmlFor="busca-desafios" className="sr-only">
                Buscar desafio
              </label>
              <input
                id="busca-desafios"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, aula (#12) ou tema..."
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-stone-50/90 border-stone-300/90 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:bg-gray-950/85 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setTypeFilter((prev) => (prev === 'quiz' ? 'Todos' : 'quiz'))
                }
                className={`press-tactile px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                  typeFilter === 'quiz'
                    ? 'bg-amber-500/15 border-amber-600/50 text-amber-950 dark:text-amber-200 dark:border-amber-500/50'
                    : btnSecondaryClasses
                }`}
              >
                Quiz
              </button>

              <button
                type="button"
                onClick={() =>
                  setTypeFilter((prev) => (prev === 'code' ? 'Todos' : 'code'))
                }
                className={`press-tactile px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                  typeFilter === 'code'
                    ? 'bg-amber-500/15 border-amber-600/50 text-amber-950 dark:text-amber-200 dark:border-amber-500/50'
                    : btnSecondaryClasses
                }`}
              >
                Código
              </button>

              <button
                type="button"
                onClick={() => setOnlyPending((prev) => !prev)}
                className={`press-tactile px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                  onlyPending
                    ? 'bg-emerald-500/15 border-emerald-600/50 text-emerald-900 dark:text-emerald-300 dark:border-emerald-500/50'
                    : btnSecondaryClasses
                }`}
              >
                Apenas pendentes
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer ${btnSecondaryClasses}`}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-stone-200/80 dark:border-gray-800/80">
            <span className={`text-[11px] font-bold mr-1 ${textMutedClasses}`}>
              Dificuldade:
            </span>
            {DIFFICULTIES.map((diff) => {
              const active = difficultyFilter === diff
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficultyFilter(diff)}
                  className={`press-tactile px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-gray-950 border-transparent'
                      : btnSecondaryClasses
                  }`}
                >
                  {diff}
                </button>
              )
            })}
          </div>
        </LabSurface>

        {filteredChallenges.length === 0 ? (
          <LabSurface variant="card" className="p-8 text-center space-y-3">
            <p className="text-base font-extrabold">
              Nenhum desafio encontrado com esses filtros.
            </p>
            <p className={`text-sm ${textMutedClasses}`}>
              Tente limpar a busca ou alterar a dificuldade selecionada.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={clearFilters}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${btnSecondaryClasses}`}
              >
                Mostrar todos os desafios
              </button>
            </div>
          </LabSurface>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map((challenge) => {
              const isDone = completedIds.has(challenge.id)

              return (
                <Link
                  key={challenge.id}
                  href={`/desafios/${challenge.slug}`}
                  className="group block focus:outline-none"
                >
                  <LabSurface
                    variant="card"
                    className={`h-full p-5 flex flex-col justify-between gap-4 transition-all duration-200 group-hover:-translate-y-0.5 ${
                      isDone
                        ? 'border-emerald-600/35 dark:border-emerald-500/35'
                        : 'group-hover:border-amber-500/50'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black tabular-nums text-stone-500 dark:text-gray-400">
                            {challenge.number}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-extrabold ${getDifficultyBadgeClasses(
                              challenge.difficulty
                            )}`}
                          >
                            {challenge.difficulty}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg border text-[11px] font-bold bg-stone-100 text-stone-700 border-stone-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800">
                            {challenge.type === 'code' ? 'Código' : 'Quiz'}
                          </span>
                        </div>

                        {isDone ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/12 text-emerald-700 border border-emerald-600/30 dark:text-emerald-400 dark:border-emerald-500/35">
                            Concluído ✓
                          </span>
                        ) : (
                          <span className="text-xs font-extrabold tabular-nums text-amber-700 dark:text-amber-400">
                            +{challenge.xp} XP
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className={`text-[11px] font-bold ${textMutedClasses}`}>
                          {challenge.subtitle}
                        </p>
                        <h2 className="text-base sm:text-lg font-extrabold leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {challenge.title}
                        </h2>
                      </div>

                      <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed ${textMutedClasses}`}>
                        {challenge.prompt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-200/80 dark:border-gray-800/80 flex items-center justify-between text-xs font-extrabold">
                      <span
                        className={
                          isDone
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-stone-700 dark:text-gray-200'
                        }
                      >
                        {isDone ? 'Jogar novamente' : 'Resolver desafio'}
                      </span>
                      <span className="text-amber-700 dark:text-amber-400 transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </div>
                  </LabSurface>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-stone-200 dark:border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 dark:text-gray-500">
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