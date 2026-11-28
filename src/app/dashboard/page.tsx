'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { AuthChangeEvent } from '@supabase/supabase-js'
import { useTheme } from '@/hooks/useTheme'
import Link from 'next/link'
import { aulasData } from '@/data/lessonsData'
import { Navbar } from '@/components/Navbar'
import { PageHeaderBanner } from '@/components/PageHeaderBanner'
import { LabSurface } from '@/components/LabSurface'

interface ModuleTheme {
  titulo: string
  subtitulo: string
  badge: string
  railGradient: string
  barGradient: string
  glowClass: string
  accentText: string
  softBg: string
  borderTone: string
  nodeIdle: string
  cardHover: string
  titleHover: string
}

const MODULE_META: Record<number, ModuleTheme> = {
  1: {
    titulo: 'Módulo 1: Lógica e Decomposição',
    subtitulo: 'Sequência, condições do dia a dia e decomposição',
    badge: 'Base Mental',
    railGradient: 'from-emerald-400 via-teal-400 to-emerald-500/25',
    barGradient: 'from-emerald-500 via-teal-400 to-emerald-300',
    glowClass: 'bg-emerald-500/14',
    accentText: 'text-emerald-700 dark:text-emerald-400',
    softBg: 'bg-emerald-500/10',
    borderTone: 'border-emerald-600/35 dark:border-emerald-500/35',
    nodeIdle:
      'text-emerald-700 dark:text-emerald-300 border-emerald-500/35 bg-emerald-500/8 dark:bg-emerald-500/10',
    cardHover:
      'hover:border-emerald-500/50 hover:shadow-md dark:hover:shadow-emerald-950/30',
    titleHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-400',
  },
  2: {
    titulo: 'Módulo 2: Dados, Tipos e Lógica',
    subtitulo: 'Variáveis, tipos, comparações, operadores e regras',
    badge: 'Fundamentos JS',
    railGradient: 'from-cyan-400 via-sky-400 to-cyan-500/25',
    barGradient: 'from-cyan-500 via-sky-400 to-cyan-300',
    glowClass: 'bg-cyan-500/14',
    accentText: 'text-cyan-700 dark:text-cyan-400',
    softBg: 'bg-cyan-500/10',
    borderTone: 'border-cyan-600/35 dark:border-cyan-500/35',
    nodeIdle:
      'text-cyan-700 dark:text-cyan-300 border-cyan-500/35 bg-cyan-500/8 dark:bg-cyan-500/10',
    cardHover:
      'hover:border-cyan-500/50 hover:shadow-md dark:hover:shadow-cyan-950/30',
    titleHover: 'group-hover:text-cyan-700 dark:group-hover:text-cyan-400',
  },
  3: {
    titulo: 'Módulo 3: Fluxo, Loops e Arrays',
    subtitulo: 'if/else, loops for/while, arrays e listas',
    badge: 'Controle & Listas',
    railGradient: 'from-violet-400 via-purple-400 to-violet-500/25',
    barGradient: 'from-violet-500 via-purple-400 to-violet-300',
    glowClass: 'bg-violet-500/14',
    accentText: 'text-violet-700 dark:text-violet-400',
    softBg: 'bg-violet-500/10',
    borderTone: 'border-violet-600/35 dark:border-violet-500/35',
    nodeIdle:
      'text-violet-700 dark:text-violet-300 border-violet-500/35 bg-violet-500/8 dark:bg-violet-500/10',
    cardHover:
      'hover:border-violet-500/50 hover:shadow-md dark:hover:shadow-violet-950/30',
    titleHover: 'group-hover:text-violet-700 dark:group-hover:text-violet-400',
  },
  4: {
    titulo: 'Módulo 4: Funções, Objetos e Projeto',
    subtitulo: 'Funções, objetos, listas e resumo de pedidos',
    badge: 'Arquitetura',
    railGradient: 'from-amber-400 via-orange-400 to-amber-500/25',
    barGradient: 'from-amber-500 via-orange-400 to-amber-300',
    glowClass: 'bg-amber-500/14',
    accentText: 'text-amber-700 dark:text-amber-400',
    softBg: 'bg-amber-500/10',
    borderTone: 'border-amber-600/35 dark:border-amber-500/35',
    nodeIdle:
      'text-amber-700 dark:text-amber-300 border-amber-500/35 bg-amber-500/8 dark:bg-amber-500/10',
    cardHover:
      'hover:border-amber-500/50 hover:shadow-md dark:hover:shadow-amber-950/30',
    titleHover: 'group-hover:text-amber-700 dark:group-hover:text-amber-400',
  },
  5: {
    titulo: 'Módulo 5: Construindo a Tela (HTML e CSS)',
    subtitulo: 'Tags, semântica, Box Model e Flexbox',
    badge: 'Visual Web',
    railGradient: 'from-fuchsia-400 via-pink-400 to-fuchsia-500/25',
    barGradient: 'from-fuchsia-500 via-pink-400 to-fuchsia-300',
    glowClass: 'bg-fuchsia-500/14',
    accentText: 'text-fuchsia-700 dark:text-fuchsia-400',
    softBg: 'bg-fuchsia-500/10',
    borderTone: 'border-fuchsia-600/35 dark:border-fuchsia-500/35',
    nodeIdle:
      'text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/35 bg-fuchsia-500/8 dark:bg-fuchsia-500/10',
    cardHover:
      'hover:border-fuchsia-500/50 hover:shadow-md dark:hover:shadow-fuchsia-950/30',
    titleHover: 'group-hover:text-fuchsia-700 dark:group-hover:text-fuchsia-400',
  },
  6: {
    titulo: 'Módulo 6: Dando Vida à Página (DOM e Eventos com JS)',
    subtitulo: 'Seleção no DOM, eventos, classes e projeto web',
    badge: 'Interação Real',
    railGradient: 'from-emerald-400 via-cyan-400 to-sky-400/35',
    barGradient: 'from-emerald-500 via-cyan-400 to-sky-300',
    glowClass: 'bg-emerald-500/14',
    accentText: 'text-emerald-700 dark:text-emerald-400',
    softBg: 'bg-emerald-500/10',
    borderTone: 'border-emerald-600/35 dark:border-emerald-500/35',
    nodeIdle:
      'text-emerald-700 dark:text-emerald-300 border-emerald-500/35 bg-emerald-500/8 dark:bg-emerald-500/10',
    cardHover:
      'hover:border-emerald-500/50 hover:shadow-md dark:hover:shadow-emerald-950/30',
    titleHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-400',
  },
}

interface TrilhaAula {
  id: string
  number: number
  modulo: number
  title: string
  desc: string
  available: boolean
}

interface TrilhaModulo {
  id: number
  theme: ModuleTheme
  aulas: TrilhaAula[]
}

const MODULES: TrilhaModulo[] = Object.entries(MODULE_META).map(
  ([modKey, theme]) => {
    const moduloNum = Number(modKey)
    const aulasDoModulo = aulasData
      .filter((item) => Number(item.modulo) === moduloNum)
      .sort((a, b) => Number(a.numero) - Number(b.numero))
      .map((item) => ({
        id: item.id || `lesson-${item.numero}`,
        number: Number(item.numero),
        modulo: moduloNum,
        title: item.titulo,
        desc: item.resumo,
        available: Boolean(item.titulo),
      }))

    return {
      id: moduloNum,
      theme,
      aulas: aulasDoModulo,
    }
  }
)

const ALL_LESSONS = MODULES.flatMap((mod) => mod.aulas)

function normalizeLessonKey(rawId: unknown): string | null {
  if (typeof rawId === 'number' && Number.isFinite(rawId)) {
    return `lesson-${Math.floor(rawId)}`
  }
  if (typeof rawId === 'string') {
    const trimmed = rawId.trim()
    if (/^lesson-\d+$/.test(trimmed)) return trimmed
    if (/^\d+$/.test(trimmed)) return `lesson-${Number(trimmed)}`
  }
  return null
}

function clearGuestLessonStorage(totalLessons: number) {
  if (typeof window === 'undefined') return
  try {
    for (let i = 1; i <= totalLessons; i++) {
      localStorage.removeItem(`codelab_visitante_aula_${i}`)
    }
  } catch {
    // Ignora falha de storage
  }
}

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<
    Record<string, boolean>
  >({})
  const [loading, setLoading] = useState(true)
  const { isDark, alternarTema } = useTheme()
  const [autoOpenedModule, setAutoOpenedModule] = useState<number | null>(null)
  const [modulosOverride, setModulosOverride] = useState<
    Record<number, boolean>
  >({})

  const totalLessonsCount = ALL_LESSONS.length

  const loadProgress = useCallback(
    async (isCancelled: () => boolean) => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError && process.env.NODE_ENV === 'development') {
          console.error(
            'Erro ao obter sessão no dashboard:',
            sessionError.message
          )
        }

        const progressMap: Record<string, boolean> = {}
        const currentUserId = session?.user?.id ?? null

        if (currentUserId) {
          clearGuestLessonStorage(totalLessonsCount)

          const { data, error: progressError } = await supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', currentUserId)

          if (progressError) {
            if (process.env.NODE_ENV === 'development') {
              console.error(
                'Erro ao carregar user_progress:',
                progressError.message
              )
            }
          } else if (Array.isArray(data)) {
            data.forEach((item) => {
              const key = normalizeLessonKey(item?.lesson_id)
              if (key) {
                progressMap[key] = true
              }
            })
          }
        } else if (typeof window !== 'undefined') {
          for (let i = 1; i <= totalLessonsCount; i++) {
            try {
              if (
                localStorage.getItem(`codelab_visitante_aula_${i}`) === 'true'
              ) {
                progressMap[`lesson-${i}`] = true
              }
            } catch {
              // Ignora bloqueio de storage pelo navegador
            }
          }
        }

        if (isCancelled()) return
        setUserId(currentUserId)
        setCompletedLessons(progressMap)
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro inesperado ao carregar progresso:', err)
        }
      } finally {
        if (!isCancelled()) {
          setLoading(false)
        }
      }
    },
    [totalLessonsCount]
  )

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (!cancelled) {
        void loadProgress(() => cancelled)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (cancelled) return
      if (event === 'SIGNED_IN') {
        clearGuestLessonStorage(totalLessonsCount)
      }
      void loadProgress(() => cancelled)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [loadProgress, totalLessonsCount])

  const totalCompletedCount = ALL_LESSONS.filter(
    (l) => completedLessons[l.id]
  ).length
  const percentualConcluido =
    totalLessonsCount > 0
      ? Math.round((totalCompletedCount / totalLessonsCount) * 100)
      : 0

  const completedModulesCount = MODULES.filter(
    (mod) =>
      mod.aulas.length > 0 &&
      mod.aulas.every((lesson) => completedLessons[lesson.id])
  ).length

  const nextLessonToStudy =
    ALL_LESSONS.find((l) => l.available && !completedLessons[l.id]) ||
    ALL_LESSONS.find((l) => l.available) ||
    ALL_LESSONS[0] ||
    null

  const targetAutoModule =
    !loading && nextLessonToStudy ? nextLessonToStudy.modulo : null

  useEffect(() => {
    if (targetAutoModule !== null) {
      queueMicrotask(() => {
        setAutoOpenedModule((prev) => prev ?? targetAutoModule)
      })
    }
  }, [targetAutoModule])

  const isModuloAberto = (moduloId: number) => {
    if (moduloId in modulosOverride) {
      return Boolean(modulosOverride[moduloId])
    }
    if (autoOpenedModule !== null) {
      return moduloId === autoOpenedModule
    }
    return moduloId === 1
  }

  const toggleModulo = (moduloId: number) => {
    setModulosOverride((prev) => ({
      ...prev,
      [moduloId]: !isModuloAberto(moduloId),
    }))
  }

  const textMuted = 'text-stone-600 dark:text-gray-400'
  const accentGreen = 'text-emerald-700 dark:text-emerald-400'
  const accentAmber = 'text-amber-700 dark:text-amber-400'

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-emerald-500 selection:text-gray-950">
      <Navbar
        activeTab="trilha"
        subtitle="Estúdio de Trilha"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 pb-16">
        <LabSurface variant="card" className="p-5 sm:p-7 space-y-5">
          <PageHeaderBanner
            tone="emerald"
            badge={`Trilha JavaScript • ${totalLessonsCount} Aulas`}
            title="Trilha interativa de JavaScript & Web"
            description="Avance passo a passo no seu ritmo ou pule direto para revisar qualquer aula — todas ficam abertas para você explorar."
            className="border-0 bg-transparent p-0 sm:p-0 shadow-none dark:bg-transparent"
            rightSlot={
              <div className="grid grid-cols-3 gap-2 shrink-0">
                <div className="press-tactile rounded-2xl px-3 py-2.5 bg-stone-100/90 dark:bg-gray-950/80 border border-stone-200/80 dark:border-gray-800 hover:border-emerald-500/40">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block ${textMuted}`}
                  >
                    Progresso
                  </span>
                  <span
                    suppressHydrationWarning
                    className={`text-sm sm:text-base font-black tabular-nums ${accentGreen}`}
                  >
                    {loading ? '...' : `${percentualConcluido}%`}
                  </span>
                </div>

                <div className="press-tactile rounded-2xl px-3 py-2.5 bg-stone-100/90 dark:bg-gray-950/80 border border-stone-200/80 dark:border-gray-800 hover:border-cyan-500/40">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block ${textMuted}`}
                  >
                    Aulas
                  </span>
                  <span
                    suppressHydrationWarning
                    className="text-sm sm:text-base font-black tabular-nums"
                  >
                    {loading
                      ? '...'
                      : `${totalCompletedCount}/${totalLessonsCount}`}
                  </span>
                </div>

                <div className="press-tactile rounded-2xl px-3 py-2.5 bg-stone-100/90 dark:bg-gray-950/80 border border-stone-200/80 dark:border-gray-800 hover:border-emerald-500/40">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block ${textMuted}`}
                  >
                    Módulos
                  </span>
                  <span
                    suppressHydrationWarning
                    className={`text-sm sm:text-base font-black tabular-nums ${accentGreen}`}
                  >
                    {loading
                      ? '...'
                      : `${completedModulesCount}/${MODULES.length}`}
                  </span>
                </div>
              </div>
            }
          />

          <div className="relative w-full h-2.5 rounded-full bg-stone-200/90 dark:bg-gray-800/90 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-teal-300 transition-[width] duration-700 ease-out"
              style={{ width: `${loading ? 0 : percentualConcluido}%` }}
            />
          </div>

          {!loading && nextLessonToStudy && (
            <Link
              href={`/dashboard/aula/${nextLessonToStudy.number}`}
              className="relative press-tactile group flex items-center justify-between gap-4 p-4 rounded-2xl border border-emerald-600/35 bg-gradient-to-r from-emerald-500/14 via-cyan-500/8 to-transparent hover:from-emerald-500/20 hover:via-cyan-500/12 dark:border-emerald-500/35 shadow-xs"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span
                    suppressHydrationWarning
                    className={`text-[10px] font-black uppercase tracking-[0.14em] tabular-nums ${accentGreen}`}
                  >
                    {completedLessons[nextLessonToStudy.id]
                      ? `Revisar • Aula ${nextLessonToStudy.number}`
                      : `Próxima aula • Aula ${nextLessonToStudy.number}`}
                  </span>
                </div>
                <p
                  suppressHydrationWarning
                  className="text-sm sm:text-base font-extrabold truncate text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors"
                >
                  {nextLessonToStudy.title}
                </p>
              </div>

              <span className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 group-hover:from-emerald-400 group-hover:to-teal-300 text-gray-950 font-black text-xs shrink-0 transition-all shadow-xs group-hover:translate-x-0.5">
                Continuar →
              </span>
            </Link>
          )}
        </LabSurface>

        <div className="space-y-5">
          {MODULES.map((modulo) => {
            const { theme } = modulo
            const modCompletedCount = modulo.aulas.filter(
              (l) => completedLessons[l.id]
            ).length
            const modTotalCount = modulo.aulas.length
            const isModCompleted =
              modTotalCount > 0 && modCompletedCount === modTotalCount
            const isOpen = isModuloAberto(modulo.id)
            const modPercent =
              modTotalCount > 0
                ? Math.round((modCompletedCount / modTotalCount) * 100)
                : 0

            return (
              <LabSurface
                key={modulo.id}
                variant="card"
                className={`relative overflow-hidden transition-all duration-300 ${
                  isModCompleted
                    ? 'border-emerald-600/35 dark:border-emerald-500/35'
                    : ''
                }`}
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl transition-opacity duration-500 ${theme.glowClass}`}
                />

                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleModulo(modulo.id)}
                  className="relative w-full p-4 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-stone-50/90 dark:hover:bg-gray-800/45 transition-colors"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                    <div
                      suppressHydrationWarning
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm tabular-nums shrink-0 border transition-transform duration-300 ${
                        isModCompleted
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-400 text-gray-950 border-emerald-300 shadow-xs'
                          : theme.nodeIdle
                      }`}
                    >
                      {isModCompleted ? '✓' : `0${modulo.id}`}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${theme.softBg} ${theme.borderTone} ${theme.accentText}`}
                        >
                          {theme.badge}
                        </span>
                        {isModCompleted && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                            Módulo Concluído
                          </span>
                        )}
                        <span
                          suppressHydrationWarning
                          className={`text-[11px] font-bold tabular-nums ${textMuted}`}
                        >
                          {loading
                            ? '...'
                            : `${modCompletedCount}/${modTotalCount} concluídas (${modPercent}%)`}
                        </span>
                      </div>

                      <h2 className="font-extrabold text-sm sm:text-lg tracking-tight leading-snug">
                        {theme.titulo}
                      </h2>

                      <p className={`text-xs truncate ${textMuted}`}>
                        {theme.subtitulo}
                      </p>

                      <div className="w-full max-w-xs h-1.5 rounded-full bg-stone-200/90 dark:bg-gray-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${theme.barGradient} transition-[width] duration-700 ease-out`}
                          style={{ width: `${loading ? 0 : modPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl border border-stone-200/80 dark:border-gray-800 bg-stone-50 dark:bg-gray-950/70 transition-colors ${textMuted}`}
                  >
                    {isOpen ? 'Recolher' : 'Abrir'}
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="relative px-4 sm:px-7 pt-3 pb-7 border-t border-stone-200/80 dark:border-gray-800/80 bg-stone-50/65 dark:bg-gray-950/40">
                      <div>
                        {modulo.aulas.map((lesson, idx) => {
                          const isCompleted = Boolean(
                            completedLessons[lesson.id]
                          )
                          const isCurrent =
                            !loading &&
                            nextLessonToStudy?.id === lesson.id &&
                            !isCompleted
                          const isLastInModule = idx === modulo.aulas.length - 1
                          const connectorActive = isCompleted || isCurrent

                          return (
                            <div
                              key={lesson.id}
                              className="flex items-stretch gap-3.5 sm:gap-5"
                            >
                              <div className="flex flex-col items-center shrink-0 pt-3.5">
                                <div
                                  suppressHydrationWarning
                                  className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm tabular-nums border-2 z-10 transition-all duration-200 ${
                                    isCompleted
                                      ? 'bg-gradient-to-br from-emerald-500 to-teal-400 text-gray-950 border-emerald-300 shadow-xs'
                                      : isCurrent
                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-400 text-gray-950 border-white dark:border-gray-950 ring-4 ring-emerald-500/25 scale-105'
                                        : lesson.available
                                          ? `bg-white dark:bg-gray-900 ${theme.nodeIdle}`
                                          : 'bg-stone-200 text-stone-500 border-stone-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
                                  }`}
                                >
                                  {isCompleted
                                    ? '✓'
                                    : lesson.available
                                      ? lesson.number
                                      : '•'}
                                </div>

                                {!isLastInModule && (
                                  <div
                                    aria-hidden="true"
                                    className={`w-0.5 flex-1 my-1.5 rounded-full transition-colors duration-300 ${
                                      connectorActive
                                        ? `bg-gradient-to-b ${theme.railGradient}`
                                        : 'bg-stone-300/90 dark:bg-gray-800'
                                    }`}
                                  />
                                )}
                              </div>

                              <div
                                className={`flex-1 min-w-0 pt-2.5 ${
                                  !isLastInModule ? 'pb-4' : ''
                                }`}
                              >
                                {lesson.available ? (
                                  <div
                                    className={`press-tactile group rounded-2xl border p-4 sm:p-4.5 transition-all duration-200 ${
                                      isCurrent
                                        ? `bg-white dark:bg-gray-900 ${theme.borderTone} shadow-md ring-1 ring-emerald-500/25`
                                        : isCompleted
                                          ? 'bg-white/95 dark:bg-gray-900/85 border-emerald-600/25 dark:border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-sm'
                                          : `bg-white/95 dark:bg-gray-900/80 border-stone-200/90 dark:border-gray-800 ${theme.cardHover}`
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3.5">
                                      <Link
                                        href={`/dashboard/aula/${lesson.number}`}
                                        className="min-w-0 flex-1 space-y-1"
                                      >
                                        <div className="flex items-center gap-2 flex-wrap">
                                          {isCurrent && (
                                            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 text-gray-950 shadow-2xs">
                                              Atual
                                            </span>
                                          )}
                                          <span
                                            className={`text-[11px] font-bold tabular-nums ${textMuted}`}
                                          >
                                            Aula {lesson.number}
                                          </span>
                                          {isCompleted && (
                                            <span
                                              className={`text-[10px] font-extrabold uppercase tracking-wider ${accentGreen}`}
                                            >
                                              • Concluída
                                            </span>
                                          )}
                                        </div>

                                        <h3
                                          className={`font-extrabold text-sm sm:text-base leading-snug text-stone-900 dark:text-white transition-colors ${theme.titleHover}`}
                                        >
                                          {lesson.title}
                                        </h3>

                                        <p
                                          className={`text-xs leading-relaxed line-clamp-2 ${textMuted}`}
                                        >
                                          {lesson.desc}
                                        </p>
                                      </Link>

                                      <div className="flex flex-col items-end justify-between gap-2.5 shrink-0">
                                        <Link
                                          href={`/dashboard/aula/${lesson.number}`}
                                          suppressHydrationWarning
                                          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 group-hover:translate-x-0.5 ${
                                            isCurrent
                                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-gray-950 shadow-2xs'
                                              : isCompleted
                                                ? 'bg-emerald-500/12 hover:bg-emerald-500/20 ' +
                                                  accentGreen
                                                : 'bg-stone-100 hover:bg-stone-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-stone-800 dark:text-gray-200'
                                          }`}
                                        >
                                          {isCompleted ? 'Revisar' : 'Abrir →'}
                                        </Link>

                                        <Link
                                          href={`/desafios/${lesson.number}`}
                                          className={`text-[11px] font-bold hover:underline transition-opacity ${accentAmber}`}
                                        >
                                          Desafio #{lesson.number}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    suppressHydrationWarning
                                    className="rounded-2xl border p-4 opacity-65 bg-stone-100/80 border-stone-200 dark:bg-gray-900/50 dark:border-gray-800/70 flex items-center justify-between gap-3"
                                  >
                                    <div className="min-w-0">
                                      <h3 className="font-bold text-xs sm:text-sm truncate">
                                        {lesson.title}
                                      </h3>
                                      <p
                                        className={`text-xs truncate ${textMuted}`}
                                      >
                                        {lesson.desc}
                                      </p>
                                    </div>
                                    <span
                                      className={`text-[11px] font-semibold shrink-0 ${textMuted}`}
                                    >
                                      Em breve
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </LabSurface>
            )
          })}
        </div>
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