'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

interface ChallengeProgressRow {
  challenge_id: string
  completed: boolean | null
  xp_earned: number | null
}

const STORAGE_KEY = 'codelab_tema_aula'
const TOTAL_AULAS_MODULO_1 = 3
const METADE_AULAS_MODULO_1 = Math.ceil(TOTAL_AULAS_MODULO_1 / 2)
const TOTAL_AULAS_TRILHA = 16
const METADE_AULAS_TRILHA = Math.ceil(TOTAL_AULAS_TRILHA / 2)
const META_AULAS_MODULO_2 = 6
const META_AULAS_MODULO_4 = 12
const XP_POR_AULA = 50
const META_XP_MESTRE = 1500
const META_DESAFIOS_INICIANTE = 3
const META_DESAFIOS_MESTRE = 10

export default function MedalhasPage() {
  const [completedCount, setCompletedCount] = useState<number>(0)
  const [challengesCompletedCount, setChallengesCompletedCount] = useState<number>(0)
  const [totalXP, setTotalXP] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>('Aluno')
  const [userId, setUserId] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(true)
  const router = useRouter()

  useLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  useEffect(() => {
    let active = true

    async function getProgress() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!active) return

        if (!session) {
          router.push('/login')
          return
        }

        const currentUserId = session.user.id
        setUserId(currentUserId)
        const metadata = session.user.user_metadata
        setUserName(metadata?.full_name || metadata?.name || 'Aluno')

        const completedSet = new Set<string>()
        let calculatedXp = 0

        // 1. Progresso de aulas concluídas no Supabase (50 XP por aula)
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('lesson_id, completed')
          .eq('user_id', currentUserId)

        if (!active) return

        if (progressData) {
          progressData.forEach((item) => {
            if (item.completed && item.lesson_id) {
              completedSet.add(item.lesson_id)
            }
          })
        }

        // Fallback/complemento local de aulas concluídas
        if (typeof window !== 'undefined') {
          for (let i = 1; i <= TOTAL_AULAS_TRILHA; i++) {
            if (localStorage.getItem(`codelab_visitante_aula_${i}`) === 'true') {
              completedSet.add(`lesson-${i}`)
            }
          }
        }

        const count = completedSet.size
        setCompletedCount(count)
        calculatedXp += count * XP_POR_AULA

        // 2. Desafios concluídos e XP ganho na Arena de Desafios
        const { data: challengesData } = await supabase
          .from('user_challenges')
          .select('challenge_id, completed, xp_earned')
          .eq('user_id', currentUserId)

        if (!active) return

        let doneChallenges = 0
        if (challengesData) {
          const rows = challengesData as ChallengeProgressRow[]
          rows.forEach((item) => {
            calculatedXp += item.xp_earned || 0
            if (item.completed || (item.xp_earned && item.xp_earned > 0)) {
              doneChallenges += 1
            }
          })
        }

        setChallengesCompletedCount(doneChallenges)
        setTotalXP(calculatedXp)
      } catch (error) {
        console.error('Erro ao carregar conquistas:', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    getProgress()

    return () => {
      active = false
    }
  }, [router])

  const alternarTema = () => {
    setIsDark((atual) => {
      const proximo = !atual
      localStorage.setItem(STORAGE_KEY, proximo ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', proximo)
      document.documentElement.style.backgroundColor = proximo ? '#030712' : '#fafaf9'
      return proximo
    })
  }

  const progressPercent = Math.min(
    100,
    Math.round((completedCount / TOTAL_AULAS_TRILHA) * 100),
  )
  const xpRestante = Math.max(0, META_XP_MESTRE - totalXP)

  const navBtnClasses =
    'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800'

  const cardClasses =
    'bg-white border-stone-200 text-stone-900 shadow-xs dark:bg-gray-900 dark:border-gray-800 dark:text-white'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const textSubtleClasses = 'text-stone-500 dark:text-gray-500'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'
  const accentAmberClasses = 'text-amber-700 dark:text-amber-400'

  const medals = [
    {
      id: 'primeiro-passo',
      icon: '🚀',
      title: 'Primeiro Passo',
      description: 'Concluir a primeira aula da trilha.',
      unlocked: completedCount >= 1,
      statusText: completedCount >= 1 ? '✓ Conquistada' : 'Bloqueada',
      tone: 'emerald' as const,
    },
    {
      id: 'logica-afiada',
      icon: '⚙️',
      title: 'Lógica Afiada',
      description: `Concluir pelo menos ${METADE_AULAS_MODULO_1} aulas do Módulo 1.`,
      unlocked: completedCount >= METADE_AULAS_MODULO_1,
      statusText:
        completedCount >= METADE_AULAS_MODULO_1 ? '✓ Conquistada' : 'Bloqueada',
      tone: 'emerald' as const,
    },
    {
      id: 'mestre-fundamentos',
      icon: '🎓',
      title: 'Mestre dos Fundamentos',
      description: `Concluir todas as ${TOTAL_AULAS_MODULO_1} aulas do Módulo 1.`,
      unlocked: completedCount >= TOTAL_AULAS_MODULO_1,
      statusText:
        completedCount >= TOTAL_AULAS_MODULO_1 ? '✓ Conquistada' : 'Bloqueada',
      tone: 'emerald' as const,
    },
    {
      id: 'explorador-dados',
      icon: '⚡',
      title: 'Explorador de Dados',
      description: `Concluir pelo menos ${META_AULAS_MODULO_2} aulas na trilha.`,
      unlocked: completedCount >= META_AULAS_MODULO_2,
      statusText:
        completedCount >= META_AULAS_MODULO_2
          ? '✓ Conquistada'
          : `${completedCount}/${META_AULAS_MODULO_2} aulas`,
      tone: 'emerald' as const,
    },
    {
      id: 'ritmo-constante',
      icon: '🔥',
      title: 'Ritmo Constante',
      description: `Concluir pelo menos ${METADE_AULAS_TRILHA} aulas da trilha (metade do caminho).`,
      unlocked: completedCount >= METADE_AULAS_TRILHA,
      statusText:
        completedCount >= METADE_AULAS_TRILHA
          ? '✓ Conquistada'
          : `${completedCount}/${METADE_AULAS_TRILHA} aulas`,
      tone: 'emerald' as const,
    },
    {
      id: 'arquiteto-codigo',
      icon: '🧩',
      title: 'Arquiteto de Código',
      description: `Concluir pelo menos ${META_AULAS_MODULO_4} aulas na trilha.`,
      unlocked: completedCount >= META_AULAS_MODULO_4,
      statusText:
        completedCount >= META_AULAS_MODULO_4
          ? '✓ Conquistada'
          : `${completedCount}/${META_AULAS_MODULO_4} aulas`,
      tone: 'emerald' as const,
    },
    {
      id: 'desafiante-arena',
      icon: '🏹',
      title: 'Desafiante da Arena',
      description: `Concluir ${META_DESAFIOS_INICIANTE} desafios práticos na Arena.`,
      unlocked: challengesCompletedCount >= META_DESAFIOS_INICIANTE,
      statusText:
        challengesCompletedCount >= META_DESAFIOS_INICIANTE
          ? '✓ Conquistada'
          : `${challengesCompletedCount}/${META_DESAFIOS_INICIANTE} desafios`,
      tone: 'amber' as const,
    },
    {
      id: 'cacador-missao',
      icon: '🎯',
      title: 'Caçador de Missões',
      description: `Concluir ${META_DESAFIOS_MESTRE} desafios na Arena de Código.`,
      unlocked: challengesCompletedCount >= META_DESAFIOS_MESTRE,
      statusText:
        challengesCompletedCount >= META_DESAFIOS_MESTRE
          ? '✓ Conquistada'
          : `${challengesCompletedCount}/${META_DESAFIOS_MESTRE} desafios`,
      tone: 'amber' as const,
    },
    {
      id: 'trilha-completa',
      icon: '🏅',
      title: 'Trilha Completa',
      description: `Concluir todas as ${TOTAL_AULAS_TRILHA} aulas dos 4 módulos.`,
      unlocked: completedCount >= TOTAL_AULAS_TRILHA,
      statusText:
        completedCount >= TOTAL_AULAS_TRILHA
          ? '✓ Conquistada'
          : `${completedCount}/${TOTAL_AULAS_TRILHA} aulas`,
      tone: 'emerald' as const,
    },
    {
      id: 'mestre-codigo',
      icon: '👑',
      title: 'Mestre do Código',
      description: `Atingir ${META_XP_MESTRE.toLocaleString('pt-BR')}+ XP total na plataforma.`,
      unlocked: totalXP >= META_XP_MESTRE,
      statusText:
        totalXP >= META_XP_MESTRE
          ? '✓ Conquistada'
          : `Faltam ${xpRestante.toLocaleString('pt-BR')} XP`,
      tone: 'amber' as const,
    },
  ]

  const unlockedCount = medals.filter((m) => m.unlocked).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-emerald-700 dark:border-emerald-500" />
          <span className={`text-sm ${textMutedClasses}`}>
            Carregando conquistas...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
      <Navbar
        activeTab="medalhas"
        subtitle="Conquistas Codelab"
        userId={userId}
        userXp={totalXP}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3.5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 pb-12">
        <div className="text-center space-y-2 py-3 sm:py-4">
          <span className="inline-block px-3 py-1 border font-bold text-[11px] rounded-full bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
            CONQUISTAS 🏆 • {unlockedCount}/{medals.length} MEDALHAS
          </span>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Painel de Medalhas
          </h2>
          <p className={`text-[15px] sm:text-base pt-1 leading-relaxed ${textMutedClasses}`}>
            Bom ver você por aqui,{' '}
            <strong className="text-stone-900 dark:text-white">{userName}</strong>!
            Conclua aulas e desafios para acumular XP e desbloquear medalhas.
          </p>
        </div>

        {/* Resumo do Progresso e XP Total */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`border rounded-2xl p-4 sm:p-5 space-y-3 ${cardClasses}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold">Progresso na Trilha</h3>
                <p className={`text-xs sm:text-sm mt-0.5 tabular-nums ${textMutedClasses}`}>
                  {completedCount} de {TOTAL_AULAS_TRILHA} aulas concluídas.
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`text-lg sm:text-xl font-black tabular-nums ${accentGreenClasses}`}
                >
                  {progressPercent}%
                </span>
                <span
                  className={`block text-[10px] uppercase tracking-wider ${textSubtleClasses}`}
                >
                  Concluído
                </span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-stone-100 dark:bg-gray-950">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div
            className={`border rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 ${cardClasses}`}
          >
            <div>
              <h3 className="text-sm sm:text-base font-bold">XP Total</h3>
              <p className={`text-xs sm:text-sm mt-0.5 tabular-nums ${textMutedClasses}`}>
                Soma da Trilha ({completedCount * XP_POR_AULA} XP) e da Arena.
              </p>
            </div>
            <div className="text-right">
              <span
                className={`text-lg sm:text-xl font-black tabular-nums ${accentAmberClasses}`}
              >
                {totalXP.toLocaleString('pt-BR')} XP
              </span>
              <span
                className={`block text-[10px] uppercase tracking-wider ${textSubtleClasses}`}
              >
                Acumulado
              </span>
            </div>
          </div>
        </div>

        {/* Grid de Medalhas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {medals.map((medal) => {
            const isEmerald = medal.tone === 'emerald'
            const unlockedBox = isEmerald
              ? 'bg-emerald-50/70 border-emerald-600/30 dark:bg-emerald-500/10 dark:border-emerald-500/30'
              : 'bg-amber-50/80 border-amber-600/30 dark:bg-amber-500/10 dark:border-amber-500/30'

            const unlockedIcon = isEmerald
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'

            const unlockedBadge = isEmerald
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'

            return (
              <div
                key={medal.id}
                className={`border rounded-2xl p-4 sm:p-5 flex items-center gap-4 ${
                  medal.unlocked ? unlockedBox : `${cardClasses} opacity-65`
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    medal.unlocked
                      ? unlockedIcon
                      : 'bg-stone-100 text-stone-400 dark:bg-gray-800 dark:text-gray-600'
                  }`}
                >
                  {medal.icon}
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold leading-snug">
                    {medal.title}
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed tabular-nums ${textMutedClasses}`}>
                    {medal.description}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 tabular-nums ${
                      medal.unlocked
                        ? unlockedBadge
                        : 'bg-stone-100 text-stone-500 dark:bg-gray-800 dark:text-gray-500'
                    }`}
                  >
                    {medal.statusText}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Atalho para continuar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <Link
            href="/dashboard"
            className={`w-full sm:w-auto text-center px-4 py-2.5 border rounded-xl text-xs font-semibold ${navBtnClasses}`}
          >
            ← Continuar na Trilha
          </Link>
          <Link
            href="/desafios"
            className="w-full sm:w-auto text-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold rounded-xl text-xs"
          >
            Ganhar XP nos Desafios ⚡
          </Link>
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