'use client'

import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { aulasData } from '@/data/lessonsData'
import { Navbar } from '@/components/Navbar'

const STORAGE_KEY = 'codelab_tema_aula'
const XP_POR_AULA = 50

const MODULES_BASE = [
  {
    id: 1,
    titulo: 'Módulo 1: Lógica e Decomposição',
    aulas: [
      {
        id: 'lesson-1',
        number: 1,
        title: 'Como o Computador Segue Instruções',
        desc: 'Entenda ordem de execução, clareza de passos e por que a sequência muda o resultado.',
      },
      {
        id: 'lesson-2',
        number: 2,
        title: 'Condições no Dia a Dia e Regras de Decisão',
        desc: 'Reconheça regras que dependem de cenários e aprenda a avaliar condições com clareza.',
      },
      {
        id: 'lesson-3',
        number: 3,
        title: 'Decompondo Problemas em Etapas',
        desc: 'Quebre problemas em entradas, regras/transformações e resultados esperados.',
      },
    ],
  },
  {
    id: 2,
    titulo: 'Módulo 2: Dados, Tipos e Lógica',
    aulas: [
      {
        id: 'lesson-4',
        number: 4,
        title: 'Variáveis, const e let: Guardando Valores',
        desc: 'Aprenda a nomear e guardar informações em variáveis e saiba quando escolher const ou let.',
      },
      {
        id: 'lesson-5',
        number: 5,
        title: 'Tipos de Dados e Operações: Textos, Números e Booleanos',
        desc: 'Reconheça string, number e boolean e entenda como o tipo muda o resultado das operações.',
      },
      {
        id: 'lesson-6',
        number: 6,
        title: 'Comparações: Produzindo true ou false',
        desc: 'Compare valores com ===, !==, >, <, >= e <= e entenda como toda comparação gera um booleano.',
      },
      {
        id: 'lesson-7',
        number: 7,
        title: 'Operadores Lógicos: Combinando Regras com &&, || e !',
        desc: 'Combine condições com && (E) e || (OU) e inverta booleanos com ! (NÃO).',
      },
      {
        id: 'lesson-8',
        number: 8,
        title: 'Prática Combinada de Dados e Regras',
        desc: 'Junte variáveis, tipos, comparações e operadores lógicos para avaliar regras completas.',
      },
    ],
  },
  {
    id: 3,
    titulo: 'Módulo 3: Fluxo, Loops e Arrays',
    aulas: [
      {
        id: 'lesson-9',
        number: 9,
        title: 'Decisões com if, else if e else: Direcionando o Fluxo',
        desc: 'Use if, else if e else para escolher caminhos e entenda por que a ordem das condições importa.',
      },
      {
        id: 'lesson-10',
        number: 10,
        title: 'Loops com for e while: Repetindo com Segurança',
        desc: 'Repita ações com for e while, entenda contador e parada e evite loops infinitos.',
      },
      {
        id: 'lesson-11',
        number: 11,
        title: 'Arrays e Acesso por Índice: Listas em Ordem',
        desc: 'Crie arrays, entenda por que o índice começa em 0 e use .length com segurança.',
      },
      {
        id: 'lesson-12',
        number: 12,
        title: 'Percorrendo Listas e Tomando Decisões',
        desc: 'Combine for, índices de array e if para visitar cada item e somar ou contar resultados.',
      },
    ],
  },
  {
    id: 4,
    titulo: 'Módulo 4: Funções, Objetos e Projeto',
    aulas: [
      {
        id: 'lesson-13',
        number: 13,
        title: 'Funções: Parâmetros e return',
        desc: 'Crie funções reutilizáveis, entenda parâmetros e argumentos e use return para devolver resultados.',
      },
      {
        id: 'lesson-14',
        number: 14,
        title: 'Objetos: Chave, Valor e Atualização',
        desc: 'Agrupe dados nomeados em objetos com chave e valor, acesse com ponto e atualize estados.',
      },
      {
        id: 'lesson-15',
        number: 15,
        title: 'Funções Trabalhando com Objetos e Arrays',
        desc: 'Passe objetos e arrays para funções, aplique regras sobre propriedades e retorne resultados.',
      },
      {
        id: 'lesson-16',
        number: 16,
        title: 'Projeto Integrador da Base: Resumo de Pedidos',
        desc: 'Integre funções, objetos, arrays, loops, condições e lógica para resumir pedidos.',
      },
    ],
  },
  {
    id: 5,
    titulo: 'Módulo 5: Construindo a Tela (HTML e CSS)',
    aulas: [
      {
        id: 'lesson-17',
        number: 17,
        title: 'O que é HTML: Estrutura e Tags Essenciais',
        desc: 'Títulos, parágrafos, botões, inputs e listas com tags básicas da web.',
      },
      {
        id: 'lesson-18',
        number: 18,
        title: 'Organizando Blocos com div, section e Semântica',
        desc: 'Como agrupar elementos na página com clareza e estrutura.',
      },
      {
        id: 'lesson-19',
        number: 19,
        title: 'Primeiros Passos no CSS: Cores, Fontes e Espaçamento',
        desc: 'Trabalhe cores, fundos, margens, preenchimento interno e bordas.',
      },
      {
        id: 'lesson-20',
        number: 20,
        title: 'Alinhando Elementos com Flexbox',
        desc: 'Centralize, organize itens lado a lado e monte cards limpos.',
      },
    ],
  },
  {
    id: 6,
    titulo: 'Módulo 6: Dando Vida à Página (DOM e Eventos com JS)',
    aulas: [
      {
        id: 'lesson-21',
        number: 21,
        title: 'O que é o DOM e Como Selecionar Elementos',
        desc: 'Entenda a árvore da página e selecione elementos com querySelector.',
      },
      {
        id: 'lesson-22',
        number: 22,
        title: 'Reagindo ao Usuário com Eventos',
        desc: 'Cliques e digitação disparando funções que você já sabe criar.',
      },
      {
        id: 'lesson-23',
        number: 23,
        title: 'Mudando Texto, Classes e Estilos na Tela',
        desc: 'Atualize conteúdos, alterne classes CSS e reaja ao estado da página.',
      },
      {
        id: 'lesson-24',
        number: 24,
        title: 'Projeto Web Integrado: Lista ou Card Interativo',
        desc: 'Junte HTML, CSS, arrays, objetos e eventos em uma mini-interface funcional.',
      },
    ],
  },
]

const AVAILABLE_NUMBERS = new Set(aulasData.map((item) => Number(item.numero)))

const MODULES = MODULES_BASE.map((mod) => ({
  ...mod,
  aulas: mod.aulas.map((lesson) => {
    const aula = aulasData.find((item) => Number(item.numero) === lesson.number)
    return aula
      ? { ...lesson, title: aula.titulo, desc: aula.resumo, available: true }
      : { ...lesson, available: false }
  }),
}))

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
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(true)
  const [modulosAbertos, setModulosAbertos] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  })

  const totalLessonsCount = ALL_LESSONS.length

  useLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  const loadProgress = useCallback(
    async (isCancelled: () => boolean) => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Erro ao obter sessão no dashboard:', sessionError.message)
        }

        const progressMap: Record<string, boolean> = {}
        const currentUserId = session?.user?.id ?? null

        if (currentUserId) {
          clearGuestLessonStorage(totalLessonsCount)

          const { data, error: progressError } = await supabase
            .from('user_progress')
            .select('lesson_id, completed')
            .eq('user_id', currentUserId)

          if (progressError) {
            console.error('Erro ao carregar user_progress:', progressError.message)
          } else if (Array.isArray(data)) {
            data.forEach((item) => {
              const key = normalizeLessonKey(item?.lesson_id)
              if (key && item?.completed === true) {
                progressMap[key] = true
              }
            })
          }
        } else if (typeof window !== 'undefined') {
          for (let i = 1; i <= totalLessonsCount; i++) {
            if (localStorage.getItem(`codelab_visitante_aula_${i}`) === 'true') {
              progressMap[`lesson-${i}`] = true
            }
          }
        }

        if (isCancelled()) return
        setUserId(currentUserId)
        setCompletedLessons(progressMap)
      } catch (err) {
        console.error('Erro inesperado ao carregar progresso:', err)
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

    void loadProgress(() => cancelled)

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return
      if (event === 'SIGNED_OUT') {
        clearGuestLessonStorage(totalLessonsCount)
      }
      void loadProgress(() => cancelled)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [loadProgress, totalLessonsCount])

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

  const totalCompletedCount = ALL_LESSONS.filter((l) => completedLessons[l.id]).length
  const percentualConcluido =
    totalLessonsCount > 0 ? Math.round((totalCompletedCount / totalLessonsCount) * 100) : 0

  const nextLessonToStudy =
    ALL_LESSONS.find((l) => l.available && !completedLessons[l.id]) ||
    ALL_LESSONS.find((l) => l.available) ||
    ALL_LESSONS[0]

  const cardClasses =
    'bg-white border-stone-200 text-stone-900 shadow-xs dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:shadow-none'
  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'
  const accentAmberClasses = 'text-amber-700 dark:text-amber-400'

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-emerald-500 selection:text-gray-950">
      <Navbar
        activeTab="trilha"
        subtitle="Aprenda no seu ritmo"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 pb-10">
        <section className={`space-y-3.5 border p-4 sm:p-6 rounded-2xl ${cardClasses}`}>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[11px] font-semibold tracking-wider uppercase ${accentGreenClasses}`}
              >
                Trilha JavaScript • Do Zero à Prática
              </span>
              <span
                suppressHydrationWarning
                className={`text-xs font-bold tabular-nums ${accentGreenClasses}`}
              >
                {loading ? '...' : `${percentualConcluido}%`}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
              Aprenda do zero, no seu tempo e sem pressa
            </h2>

            <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
              Concluídas:{' '}
              <strong
                suppressHydrationWarning
                className={`tabular-nums ${accentGreenClasses}`}
              >
                {loading ? '...' : `${totalCompletedCount} de ${totalLessonsCount}`}
              </strong>{' '}
              aulas. Todas liberadas para você estudar na ordem que preferir ou revisar quando quiser.
            </p>

            <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${loading ? 0 : percentualConcluido}%` }}
              />
            </div>
          </div>

          {!loading && nextLessonToStudy && (
            <div className="pt-1">
              <Link
                href={`/dashboard/aula/${nextLessonToStudy.number}`}
                className="flex items-center justify-between gap-3 p-3.5 border rounded-xl group bg-stone-50 hover:bg-stone-100 border-emerald-600/30 dark:bg-gray-950/80 dark:hover:bg-gray-950 dark:border-emerald-500/30"
              >
                <div className="min-w-0">
                  <span
                    suppressHydrationWarning
                    className={`text-[10px] font-bold uppercase tracking-wider block tabular-nums ${accentGreenClasses}`}
                  >
                    {completedLessons[nextLessonToStudy.id]
                      ? `Revisar • Aula ${nextLessonToStudy.number}`
                      : `Continuar • Aula ${nextLessonToStudy.number}`}
                  </span>
                  <p
                    suppressHydrationWarning
                    className="text-xs sm:text-sm font-bold truncate text-stone-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400"
                  >
                    {nextLessonToStudy.title}
                  </p>
                </div>
                <span className="px-3 py-2 bg-emerald-500 text-gray-950 font-extrabold text-xs rounded-lg shrink-0 group-hover:bg-emerald-400">
                  Continuar →
                </span>
              </Link>
            </div>
          )}
        </section>

        <div className="space-y-4">
          {MODULES.map((modulo) => {
            const modCompletedCount = modulo.aulas.filter((l) => completedLessons[l.id]).length
            const modTotalCount = modulo.aulas.length
            const isModCompleted = modCompletedCount === modTotalCount
            const isOpen = Boolean(modulosAbertos[modulo.id])

            return (
              <div key={modulo.id} className={`border rounded-2xl overflow-hidden ${cardClasses}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleModulo(modulo.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 text-left cursor-pointer hover:bg-stone-50 dark:hover:bg-gray-800/60"
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                    <div
                      suppressHydrationWarning
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs tabular-nums shrink-0 ${
                        isModCompleted
                          ? 'bg-emerald-500 text-gray-950 font-black'
                          : 'bg-stone-100 text-emerald-700 border border-emerald-600/30 dark:bg-gray-800 dark:text-emerald-400 dark:border-emerald-500/30'
                      }`}
                    >
                      {isModCompleted ? '✓' : modulo.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm sm:text-base leading-snug break-words">
                          {modulo.titulo}
                        </h3>
                        <span className="px-2 py-0.5 border text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                          Todas liberadas
                        </span>
                      </div>
                      <p
                        suppressHydrationWarning
                        className={`text-xs tabular-nums mt-0.5 ${textMutedClasses}`}
                      >
                        {loading ? '...' : `${modCompletedCount} de ${modTotalCount} aulas concluídas`}
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 font-semibold text-xs ${textMutedClasses}`}>
                    {isOpen ? 'Recolher' : 'Abrir'}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-3.5 sm:p-5 border-t space-y-2 border-stone-200 bg-stone-50/70 dark:border-gray-800/80 dark:bg-gray-950/40">
                    {modulo.aulas.map((lesson) => {
                      const isCompleted = Boolean(completedLessons[lesson.id])
                      const aulaDisponivel = AVAILABLE_NUMBERS.has(lesson.number)

                      return aulaDisponivel ? (
                        <Link
                          key={lesson.id}
                          href={`/dashboard/aula/${lesson.number}`}
                          className="p-3 sm:p-3.5 rounded-xl border flex items-center justify-between gap-2.5 sm:gap-3 cursor-pointer group bg-white border-stone-200 hover:border-emerald-600/50 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-emerald-500/50"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <div
                              suppressHydrationWarning
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs tabular-nums shrink-0 ${
                                isCompleted
                                  ? 'bg-emerald-500 text-gray-950 font-black'
                                  : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200 dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-gray-700'
                              }`}
                            >
                              {isCompleted ? '✓' : lesson.number}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs sm:text-sm truncate text-stone-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                                {lesson.title}
                              </h4>
                              <p className={`text-[10px] sm:text-xs truncate ${textMutedClasses}`}>
                                {lesson.desc}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                            <span
                              className={`hidden sm:inline text-[11px] font-bold tabular-nums ${accentAmberClasses}`}
                            >
                              {XP_POR_AULA} XP
                            </span>
                            <span
                              suppressHydrationWarning
                              className={`text-[11px] font-bold ${accentGreenClasses}`}
                            >
                              {isCompleted ? 'Revisar →' : 'Iniciar →'}
                            </span>
                          </div>
                        </Link>
                      ) : (
                        <div
                          key={lesson.id}
                          suppressHydrationWarning
                          className="w-full p-3 sm:p-3.5 rounded-xl border flex items-center justify-between gap-2.5 sm:gap-3 text-left opacity-70 bg-stone-100/80 border-stone-200 text-stone-500 dark:bg-gray-900/50 dark:border-gray-800/70 dark:text-gray-500"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <div
                              suppressHydrationWarning
                              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 bg-stone-200 text-stone-500 dark:bg-gray-800 dark:text-gray-500"
                            >
                              {isCompleted ? '✓' : '•'}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs sm:text-sm truncate">{lesson.title}</h4>
                              <p className="text-[10px] sm:text-xs truncate">{lesson.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                            <span className="hidden sm:inline text-[11px] font-semibold tabular-nums">
                              {XP_POR_AULA} XP
                            </span>
                            <span className="text-[11px] font-semibold">Em breve</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
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