'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MedalhasPage() {
  const [completedCount, setCompletedCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>('Aluno')
  const router = useRouter()
  const totalLessonsCount = 14

  useEffect(() => {
    async function getProgress() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      } else {
        const metadata = session.user.user_metadata
        setUserName(metadata?.full_name || metadata?.name || 'Aluno')

        // Buscar progresso de aulas concluídas
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('lesson_id, completed')
          .eq('user_id', session.user.id)

        if (progressData) {
          const count = progressData.filter(item => item.completed).length
          setCompletedCount(count)
        }
        setLoading(false)
      }
    }

    getProgress()
  }, [router])

  // Cálculo de XP (50 XP por aula concluída)
  const totalXP = completedCount * 50

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
          <span className="text-sm text-gray-400">Carregando suas conquistas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-x-hidden animate-fadeIn">
      
      {/* Header Superior */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link 
            href="/painel" 
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-xs font-semibold text-gray-200 transition shrink-0 cursor-pointer"
          >
            <span>← Voltar para o Painel</span>
          </Link>

          <Link 
            href="/dashboard" 
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-400 transition shrink-0 cursor-pointer"
          >
            <span>⚡ Ir para a Trilha</span>
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        
        <div className="text-center space-y-2 py-4">
            <div>
            <span className="inline-block mt-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px] rounded-full">
              SUAS CONQUISTAS 🏆
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Painel de Medalhas</h1>
          <p className="text-xs sm:text-sm text-gray-400 pt-1">
            Parabéns, <strong className="text-white">{userName}</strong>! Conclua aulas e acumule XP para desbloquear todas as medalhas da trilha.
          </p>
        </div>

        {/* Resumo do Progresso e XP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Progresso Módulo 1</h3>
              <p className="text-xs text-gray-400 mt-0.5">{completedCount} de {totalLessonsCount} aulas concluídas.</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-400">
                {Math.round((completedCount / totalLessonsCount) * 100)}%
              </span>
              <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Concluído</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">XP Acumulado</h3>
              <p className="text-xs text-gray-400 mt-0.5">Pontuação total na plataforma.</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-amber-400">
                {totalXP} XP
              </span>
              <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Total</span>
            </div>
          </div>
        </div>

        {/* Grid de Medalhas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Medalha 1 */}
          <div className={`border rounded-2xl p-5 flex items-center gap-4 transition-all ${
            completedCount >= 1 ? 'bg-emerald-500/10 border-emerald-500/30 text-white' : 'bg-gray-900/60 border-gray-800 text-gray-500 opacity-60'
          }`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${
              completedCount >= 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-600'
            }`}>
              🚀
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Primeiro Passo</h4>
              <p className="text-xs text-gray-400">Concluir a primeira aula da trilha.</p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                completedCount >= 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'
              }`}>
                {completedCount >= 1 ? '✓ Conquistada' : 'Bloqueada'}
              </span>
            </div>
          </div>

          {/* Medalha 2 */}
          <div className={`border rounded-2xl p-5 flex items-center gap-4 transition-all ${
            completedCount >= 7 ? 'bg-emerald-500/10 border-emerald-500/30 text-white' : 'bg-gray-900/60 border-gray-800 text-gray-500 opacity-60'
          }`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${
              completedCount >= 7 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-600'
            }`}>
              ⚙️
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Lógica Afiada</h4>
              <p className="text-xs text-gray-400">Concluir pelo menos 7 aulas (Metade do Módulo 1).</p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                completedCount >= 7 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'
              }`}>
                {completedCount >= 7 ? '✓ Conquistada' : 'Bloqueada'}
              </span>
            </div>
          </div>

          {/* Medalha 3 */}
          <div className={`border rounded-2xl p-5 flex items-center gap-4 transition-all ${
            completedCount >= 14 ? 'bg-emerald-500/10 border-emerald-500/30 text-white' : 'bg-gray-900/60 border-gray-800 text-gray-500 opacity-60'
          }`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${
              completedCount >= 14 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-600'
            }`}>
              🎓
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Mestre dos Fundamentos</h4>
              <p className="text-xs text-gray-400">Concluir todas as 14 aulas do Módulo 1.</p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                completedCount >= 14 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'
              }`}>
                {completedCount >= 14 ? '✓ Conquistada' : 'Bloqueada'}
              </span>
            </div>
          </div>

          {/* Medalha 4 (Preparada para os próximos módulos / Nível Máximo) */}
          <div className={`border rounded-2xl p-5 flex items-center gap-4 transition-all ${
            totalXP >= 1500 ? 'bg-amber-500/10 border-amber-500/30 text-white' : 'bg-gray-900/60 border-gray-800 text-gray-500 opacity-60'
          }`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${
              totalXP >= 1500 ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-600'
            }`}>
              👑
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Mestre do Código</h4>
              <p className="text-xs text-gray-400">Atingir 1.500+ XP ao longo de toda a trilha.</p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                totalXP >= 1500 ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-500'
              }`}>
                {totalXP >= 1500 ? '✓ Conquistada' : 'Bloqueada (1500 XP)'}
              </span>
            </div>
          </div>

        </div>

      </main>
    </div>
  )
}