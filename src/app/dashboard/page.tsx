'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { aulasData } from '@/data/lessonsData'
import { Navbar } from '@/components/Navbar'

const STORAGE_KEY = 'codelab_tema_aula'
const XP_POR_AULA = 50

const LESSONS_BASE = [
  { id: 'lesson-1', number: 1, title: 'Como o Computador Segue Instruções', desc: 'Entenda programação, algoritmos e a importância da ordem das instruções.' },
  { id: 'lesson-2', number: 2, title: 'Pensamento Algorítmico na Prática', desc: 'Quebrando problemas do dia a dia em passos simples' },
  { id: 'lesson-3', number: 3, title: 'Onde o Código Roda e o Console', desc: 'Conhecendo o ambiente e testando com console.log()' },
  { id: 'lesson-4', number: 4, title: 'Variáveis: Guardando Valores na Memória', desc: 'Entendendo caixinhas de memória com let na prática' },
  { id: 'lesson-5', number: 5, title: 'let vs const Sem Confusão', desc: 'Quando o valor pode mudar e quando deve ficar fixo' },
  { id: 'lesson-6', number: 6, title: 'Tipos de Dados: Textos, Números e Booleanos', desc: 'Strings, numbers e true/false sem mistério' },
  { id: 'lesson-7', number: 7, title: 'Contas e Operadores Matemáticos', desc: 'Adição, subtração, multiplicação, divisão e resto (%)' },
  { id: 'lesson-8', number: 8, title: 'Comparações e Valores Booleanos', desc: 'Comparando valores com segurança usando === e !==' },
  { id: 'lesson-9', number: 9, title: 'Operadores Lógicos: E (&&), OU (||) e NÃO (!)', desc: 'Combinando e invertendo condições para decisões melhores' },
  { id: 'lesson-10', number: 10, title: 'Decisões com if e else', desc: 'Fazendo o código escolher caminhos com if, else if e else' },
  { id: 'lesson-11', number: 11, title: 'Escolhas Múltiplas com switch', desc: 'Tratando valores exatos com switch, case, break e default' },
  { id: 'lesson-12', number: 12, title: 'Repetição com while', desc: 'Repetindo enquanto uma condição for verdadeira sem loop infinito' },
  { id: 'lesson-13', number: 13, title: 'Contagens com for', desc: 'Contando passo a passo com início, condição e incremento' },
  { id: 'lesson-14', number: 14, title: 'Listas com Arrays', desc: 'Listas ordenadas, índice começando em 0 e tamanho com .length' },
  { id: 'lesson-15', number: 15, title: 'Alterando e Percorrendo Arrays com for', desc: 'Adicionando com .push(), alterando itens e percorrendo com for' },
  { id: 'lesson-16', number: 16, title: 'Funções: Reutilizando Blocos de Código', desc: 'Criando funções com parâmetros e return para evitar repetição' },
  { id: 'lesson-17', number: 17, title: 'Objetos: Organizando Dados com Propriedades', desc: 'Agrupando dados com chave: valor, notação de ponto e atualização' },
  { id: 'lesson-18', number: 18, title: 'Mini-Projeto: Integrando Tudo do Módulo 1', desc: 'Juntando variáveis, condições, repetições, arrays, funções e objetos' },
]

const AVAILABLE_NUMBERS = new Set(aulasData.map((item) => item.numero))

const LESSONS = LESSONS_BASE.map((lesson) => {
  const aula = aulasData.find((item) => item.numero === lesson.number)
  return aula
    ? { ...lesson, title: aula.titulo, desc: aula.resumo, available: true }
    : { ...lesson, available: false }
})

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(true)
  const [moduloAberto, setModuloAberto] = useState(true)

  const totalLessonsCount = LESSONS.length

  useLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  useEffect(() => {
    let active = true

    async function checkUserAndProgress() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const progressMap: Record<string, boolean> = {}

      if (session) {
        if (active) setUserId(session.user.id)
        const { data } = await supabase
          .from('user_progress')
          .select('lesson_id, completed')
          .eq('user_id', session.user.id)

        if (data) {
          data.forEach((item) => {
            if (item.completed) progressMap[item.lesson_id] = true
          })
        }
      }

      if (typeof window !== 'undefined') {
        for (let i = 1; i <= totalLessonsCount; i++) {
          if (localStorage.getItem(`codelab_visitante_aula_${i}`) === 'true') {
            progressMap[`lesson-${i}`] = true
          }
        }
      }

      if (!active) return
      setCompletedLessons(progressMap)
      setLoading(false)
    }

    checkUserAndProgress()

    return () => {
      active = false
    }
  }, [totalLessonsCount])

  const alternarTema = () => {
    setIsDark((atual) => {
      const proximo = !atual
      localStorage.setItem(STORAGE_KEY, proximo ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', proximo)
      document.documentElement.style.backgroundColor = proximo ? '#030712' : '#fafaf9'
      return proximo
    })
  }

  const totalCompletedCount = Object.values(completedLessons).filter(Boolean).length
  const percentualConcluido =
    totalLessonsCount > 0 ? Math.round((totalCompletedCount / totalLessonsCount) * 100) : 0

  const nextLessonToStudy =
    LESSONS.find((l) => l.available && !completedLessons[l.id]) ||
    LESSONS.find((l) => l.available) ||
    LESSONS[0]

  const isFullyCompleted = totalCompletedCount === totalLessonsCount

  const cardClasses =
    'bg-white border-stone-200 text-stone-900 shadow-xs dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:shadow-none'
  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'
  const accentAmberClasses = 'text-amber-700 dark:text-amber-400'

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-emerald-500 selection:text-gray-950 relative overflow-x-hidden">
      <Navbar
        activeTab="trilha"
        subtitle="Aprenda no seu ritmo"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto p-3.5 sm:p-6 space-y-6 pb-24 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div
            className={`sm:col-span-2 space-y-3 border p-4 sm:p-6 rounded-2xl flex flex-col justify-between ${cardClasses}`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[11px] font-semibold tracking-wider uppercase ${accentGreenClasses}`}
                >
                  Módulo 1 • Fundamentos de JavaScript
                </span>
                <span suppressHydrationWarning className={`text-xs font-bold ${accentGreenClasses}`}>
                  {loading ? '...' : `${percentualConcluido}%`}
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
                Aprenda do zero, no seu tempo e sem pressa
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
                Concluídas:{' '}
                <strong suppressHydrationWarning className={accentGreenClasses}>
                  {loading ? '...' : `${totalCompletedCount} de ${totalLessonsCount}`}
                </strong>{' '}
                aulas. Todas liberadas para você estudar na ordem que preferir ou revisar quando quiser.
              </p>

              <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-gray-800 overflow-hidden pt-0">
                <div
                  className="h-full bg-emerald-500 transition-[width] duration-300"
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
                      className={`text-[10px] font-bold uppercase tracking-wider block ${accentGreenClasses}`}
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
          </div>

          <div className="border p-4 sm:p-6 rounded-2xl flex flex-col justify-between space-y-3 bg-amber-50/50 border-amber-600/25 text-stone-900 shadow-xs dark:bg-gray-900 dark:border-amber-500/20 dark:text-white dark:shadow-none">
            <div className="space-y-1">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${accentAmberClasses}`}>
                Prática extra
              </span>
              <h3 className="font-bold text-sm sm:text-base">Desafios de Código</h3>
              <p className={`text-xs leading-relaxed ${textMutedClasses}`}>
                Resolva exercícios curtos para fixar o que você já aprendeu.
              </p>
            </div>
            <Link
              href="/desafios"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl text-center block cursor-pointer"
            >
              Ver desafios →
            </Link>
          </div>
        </div>

        <div className={`border rounded-2xl overflow-hidden ${cardClasses}`}>
          <button
            type="button"
            onClick={() => setModuloAberto((prev) => !prev)}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-stone-50 dark:hover:bg-gray-800/60"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                suppressHydrationWarning
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isFullyCompleted
                    ? 'bg-emerald-500 text-gray-950 font-black'
                    : 'bg-stone-100 text-emerald-700 border border-emerald-600/30 dark:bg-gray-800 dark:text-emerald-400 dark:border-emerald-500/30'
                }`}
              >
                {isFullyCompleted ? '✓' : '1'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm sm:text-base truncate">
                    Módulo 1: Fundamentos de JavaScript
                  </h3>
                  <span className="px-2 py-0.5 border text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                    Todas liberadas
                  </span>
                </div>
                <p suppressHydrationWarning className={`text-xs ${textMutedClasses}`}>
                  {loading ? '...' : `${totalCompletedCount} de ${totalLessonsCount} aulas concluídas`}
                </p>
              </div>
            </div>
            <span className={`shrink-0 font-semibold text-xs ${textMutedClasses}`}>
              {moduloAberto ? 'Recolher' : 'Abrir'}
            </span>
          </button>

          {moduloAberto && (
            <div className="p-4 sm:p-5 border-t space-y-2 border-stone-200 bg-stone-50/70 dark:border-gray-800/80 dark:bg-gray-950/40">
              {LESSONS.map((lesson) => {
                const isCompleted = Boolean(completedLessons[lesson.id])
                const aulaDisponivel = AVAILABLE_NUMBERS.has(lesson.number)

                return aulaDisponivel ? (
                  <Link
                    key={lesson.id}
                    href={`/dashboard/aula/${lesson.number}`}
                    className="p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer group bg-white border-stone-200 hover:border-emerald-600/50 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-emerald-500/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        suppressHydrationWarning
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
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
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className={`text-[11px] font-bold ${accentAmberClasses}`}>
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
                    className="w-full p-3.5 rounded-xl border flex items-center justify-between gap-3 text-left opacity-70 bg-stone-100/80 border-stone-200 text-stone-500 dark:bg-gray-900/50 dark:border-gray-800/70 dark:text-gray-500"
                  >
                    <div className="flex items-center gap-3 min-w-0">
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
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] font-semibold">{XP_POR_AULA} XP</span>
                      <span className="text-[11px] font-semibold">Em breve</span>
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