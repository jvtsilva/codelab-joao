'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

const STORAGE_KEY = 'codelab_tema_aula'
const TOTAL_AULAS_MODULO_1 = 18
const METADE_AULAS_MODULO_1 = 9
const XP_POR_AULA = 50
const META_XP_MESTRE = 1500

export default function MedalhasPage() {
  const [completedCount, setCompletedCount] = useState<number>(0)
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

      let calculatedXp = 0

      // 1. Progresso de aulas concluídas (50 XP por aula)
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', currentUserId)

      if (!active) return

      if (progressData) {
        const count = progressData.filter((item) => item.completed).length
        setCompletedCount(count)
        calculatedXp += count * XP_POR_AULA
      }

      // 2. XP ganho na Arena de Desafios
      const { data: challengesData } = await supabase
        .from('user_challenges')
        .select('xp_earned')
        .eq('user_id', currentUserId)

      if (!active) return

      if (challengesData) {
        challengesData.forEach((item) => {
          calculatedXp += item.xp_earned || 0
        })
      }

      setTotalXP(calculatedXp)
      setLoading(false)
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

  const progressPercent = Math.min(100, Math.round((completedCount / TOTAL_AULAS_MODULO_1) * 100))
  const xpRestante = Math.max(0, META_XP_MESTRE - totalXP)

  const navBtnClasses =
    'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800'

  const cardClasses =
    'bg-white border-stone-200 text-stone-900 shadow-xs dark:bg-gray-900 dark:border-gray-800 dark:text-white'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const textSubtleClasses = 'text-stone-500 dark:text-gray-500'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'
  const accentAmberClasses = 'text-amber-700 dark:text-amber-400'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-emerald-700 dark:border-emerald-500" />
          <span className={`text-sm ${textMutedClasses}`}>Carregando conquistas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
      <Navbar
        activeTab="medalhas"
        subtitle="Conquistas Codelab"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-20">
        <div className="text-center space-y-2 py-4">
          <span className="inline-block px-3 py-1 border font-bold text-[11px] rounded-full bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
            CONQUISTAS 🏆
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Painel de Medalhas
          </h2>
          <p className={`text-xs sm:text-sm pt-1 ${textMutedClasses}`}>
            Bom ver você por aqui, <strong className="text-stone-900 dark:text-white">{userName}</strong>! Conclua aulas e desafios para acumular XP e desbloquear medalhas.
          </p>
        </div>

        {/* Resumo do Progresso e XP Total */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`border rounded-2xl p-5 space-y-3 ${cardClasses}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold">Progresso Módulo 1</h3>
                <p className={`text-xs mt-0.5 ${textMutedClasses}`}>
                  {completedCount} de {TOTAL_AULAS_MODULO_1} aulas concluídas.
                </p>
              </div>
              <div className="text-right">
                <span className={`text-lg font-black ${accentGreenClasses}`}>
                  {progressPercent}%
                </span>
                <span className={`block text-[10px] uppercase tracking-wider ${textSubtleClasses}`}>
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

          <div className={`border rounded-2xl p-5 flex items-center justify-between gap-4 ${cardClasses}`}>
            <div>
              <h3 className="text-sm font-bold">XP Total</h3>
              <p className={`text-xs mt-0.5 ${textMutedClasses}`}>
                Soma da Trilha e da Arena.
              </p>
            </div>
            <div className="text-right">
              <span className={`text-lg font-black ${accentAmberClasses}`}>
                {totalXP} XP
              </span>
              <span className={`block text-[10px] uppercase tracking-wider ${textSubtleClasses}`}>
                Acumulado
              </span>
            </div>
          </div>
        </div>

        {/* Grid de Medalhas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Medalha 1 */}
          <div
            className={`border rounded-2xl p-5 flex items-center gap-4 ${
              completedCount >= 1
                ? 'bg-emerald-50/70 border-emerald-600/30 dark:bg-emerald-500/10 dark:border-emerald-500/30'
                : `${cardClasses} opacity-65`
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                completedCount >= 1
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                  : 'bg-stone-100 text-stone-400 dark:bg-gray-800 dark:text-gray-600'
              }`}
            >
              🚀
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Primeiro Passo</h4>
              <p className={`text-xs ${textMutedClasses}`}>
                Concluir a primeira aula da trilha.
              </p>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                  completedCount >= 1
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                    : 'bg-stone-100 text-stone-500 dark:bg-gray-800 dark:text-gray-500'
                }`}
              >
                {completedCount >= 1 ? '✓ Conquistada' : 'Bloqueada'}
              </span>
            </div>
          </div>

          {/* Medalha 2 */}
          <div
            className={`border rounded-2xl p-5 flex items-center gap-4 ${
              completedCount >= METADE_AULAS_MODULO_1
                ? 'bg-emerald-50/70 border-emerald-600/30 dark:bg-emerald-500/10 dark:border-emerald-500/30'
                : `${cardClasses} opacity-65`
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                completedCount >= METADE_AULAS_MODULO_1
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                  : 'bg-stone-100 text-stone-400 dark:bg-gray-800 dark:text-gray-600'
              }`}
            >
              ⚙️
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Lógica Afiada</h4>
              <p className={`text-xs ${textMutedClasses}`}>
                Concluir pelo menos {METADE_AULAS_MODULO_1} aulas do Módulo 1.
              </p>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                  completedCount >= METADE_AULAS_MODULO_1
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                    : 'bg-stone-100 text-stone-500 dark:bg-gray-800 dark:text-gray-500'
                }`}
              >
                {completedCount >= METADE_AULAS_MODULO_1 ? '✓ Conquistada' : 'Bloqueada'}
              </span>
            </div>
          </div>

          {/* Medalha 3 */}
          <div
            className={`border rounded-2xl p-5 flex items-center gap-4 ${
              completedCount >= TOTAL_AULAS_MODULO_1
                ? 'bg-emerald-50/70 border-emerald-600/30 dark:bg-emerald-500/10 dark:border-emerald-500/30'
                : `${cardClasses} opacity-65`
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                completedCount >= TOTAL_AULAS_MODULO_1
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                  : 'bg-stone-100 text-stone-400 dark:bg-gray-800 dark:text-gray-600'
              }`}
            >
              🎓
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Mestre dos Fundamentos</h4>
              <p className={`text-xs ${textMutedClasses}`}>
                Concluir todas as {TOTAL_AULAS_MODULO_1} aulas do Módulo 1.
              </p>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                  completedCount >= TOTAL_AULAS_MODULO_1
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                    : 'bg-stone-100 text-stone-500 dark:bg-gray-800 dark:text-gray-500'
                }`}
              >
                {completedCount >= TOTAL_AULAS_MODULO_1 ? '✓ Conquistada' : 'Bloqueada'}
              </span>
            </div>
          </div>

          {/* Medalha 4 */}
          <div
            className={`border rounded-2xl p-5 flex items-center gap-4 ${
              totalXP >= META_XP_MESTRE
                ? 'bg-amber-50/80 border-amber-600/30 dark:bg-amber-500/10 dark:border-amber-500/30'
                : `${cardClasses} opacity-65`
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                totalXP >= META_XP_MESTRE
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                  : 'bg-stone-100 text-stone-400 dark:bg-gray-800 dark:text-gray-600'
              }`}
            >
              👑
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Mestre do Código</h4>
              <p className={`text-xs ${textMutedClasses}`}>
                Atingir {META_XP_MESTRE.toLocaleString('pt-BR')}+ XP total na plataforma.
              </p>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                  totalXP >= META_XP_MESTRE
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'
                    : 'bg-stone-100 text-stone-500 dark:bg-gray-800 dark:text-gray-500'
                }`}
              >
                {totalXP >= META_XP_MESTRE
                  ? '✓ Conquistada'
                  : `Faltam ${xpRestante.toLocaleString('pt-BR')} XP`}
              </span>
            </div>
          </div>
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
    </div>
  )
}