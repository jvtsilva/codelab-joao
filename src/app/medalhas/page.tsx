'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MedalhasPage() {
  const [completedCount, setCompletedCount] = useState<number>(0)
  const [totalXP, setTotalXP] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>('Aluno')
  const [userId, setUserId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const totalLessonsCount = 14

  useEffect(() => {
    async function getProgress() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      } else {
        const currentUserId = session.user.id
        setUserId(currentUserId)
        const metadata = session.user.user_metadata
        setUserName(metadata?.full_name || metadata?.name || 'Aluno')

        let calculatedXp = 0

        // 1. Buscar progresso de aulas concluídas (50 XP por aula)
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('lesson_id, completed')
          .eq('user_id', currentUserId)

        let count = 0
        if (progressData) {
          count = progressData.filter(item => item.completed).length
          setCompletedCount(count)
          calculatedXp += count * 50
        }

        // 2. Buscar XP ganho na Arena de Desafios (tabela user_challenges)
        const { data: challengesData } = await supabase
          .from('user_challenges')
          .select('xp_earned')
          .eq('user_id', currentUserId)

        if (challengesData) {
          challengesData.forEach(item => {
            calculatedXp += item.xp_earned || 0
          })
        }

        setTotalXP(calculatedXp)
        setLoading(false)
      }
    }

    getProgress()
  }, [router])

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('codelab_')) {
          localStorage.removeItem(key)
        }
      })
    }
    await supabase.auth.signOut()
    window.location.href = '/'
  }

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
      
      {/* Header Padronizado e Unificado */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 font-bold text-sm rounded-xl shrink-0 border border-emerald-500/30 flex items-center justify-center select-none shadow-lg shadow-emerald-500/10">
            🎖️
          </div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Medalhas <span className="text-emerald-400 font-normal">Codelab</span>
          </h1>
        </div>

        {/* Menu Desktop Unificado */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link href="/dashboard" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">📖 Trilha</Link>
          <Link href="/desafios" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">⚔️ Arena</Link>
          <Link href="/ranking" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">🏆 Ranking</Link>
          <Link href="/medalhas" className="px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold">🎖️ Medalhas</Link>
          <Link href="/contato" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">💬 Contato</Link>
          {userId ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
              <Link href="/painel" className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold">⚙️ Painel</Link>
              <button onClick={handleLogout} className="px-3.5 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold cursor-pointer">Sair</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
              <Link href="/login" className="px-3.5 py-2 bg-gray-900 text-gray-300 border border-gray-800 rounded-xl text-xs">Entrar</Link>
              <Link href="/cadastro" className="px-3.5 py-2 bg-emerald-500 text-gray-950 font-extrabold rounded-xl text-xs">Criar Conta</Link>
            </div>
          )}
        </div>

        {/* Botão Hambúrguer Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-emerald-400 font-bold">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Menu Dropdown Mobile Unificado */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-2 z-50 shadow-2xl animate-fadeIn">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">📖 Ir para a Trilha</Link>
          <Link href="/desafios" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">⚔️ Arena de Desafios</Link>
          <Link href="/ranking" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">🏆 Ranking Geral</Link>
          <Link href="/medalhas" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold">🎖️ Painel de Medalhas</Link>
          <Link href="/contato" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-medium">💬 Contato</Link>
          {userId ? (
            <>
              <Link href="/painel" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium">⚙️ Meu Painel</Link>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-left px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl text-xs">🚪 Sair da Conta</button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="px-4 py-3 bg-gray-950 border border-gray-800 text-center font-semibold rounded-xl text-xs text-gray-300">Entrar</Link>
              <Link href="/cadastro" onClick={() => setMenuOpen(false)} className="px-4 py-3 bg-emerald-500 text-gray-950 text-center font-extrabold rounded-xl text-xs">Criar Conta</Link>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-20">
        
        <div className="text-center space-y-2 py-4">
            <div>
            <span className="inline-block mt-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px] rounded-full">
              SUAS CONQUISTAS 🏆
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Painel de Medalhas</h1>
          <p className="text-xs sm:text-sm text-gray-400 pt-1">
            Parabéns, <strong className="text-white">{userName}</strong>! Conclua aulas e desafios para acumular XP total e desbloquear suas medalhas.
          </p>
        </div>

        {/* Resumo do Progresso e XP Total */}
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
              <h3 className="text-sm font-bold text-white">XP Total Acumulado</h3>
              <p className="text-xs text-gray-400 mt-0.5">Soma da Trilha + Arena.</p>
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

          {/* Medalha 4 (Com base no XP Total unificado) */}
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
              <p className="text-xs text-gray-400">Atingir 1.500+ XP total na plataforma.</p>
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