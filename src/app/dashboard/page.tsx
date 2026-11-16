'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [lessonOneCompleted, setLessonOneCompleted] = useState(false)
  const [lessonTwoCompleted, setLessonTwoCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function checkUserAndProgress() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        const { data } = await supabase.from('user_progress').select('lesson_id, completed').eq('user_id', session.user.id)
        if (data) {
          if (data.find(i => i.lesson_id === 'lesson-1')?.completed) setLessonOneCompleted(true)
          if (data.find(i => i.lesson_id === 'lesson-2')?.completed) setLessonTwoCompleted(true)
        }
      } else {
        if (typeof window !== 'undefined') {
          if (localStorage.getItem('codelab_visitante_aula_1')) setLessonOneCompleted(true)
          if (localStorage.getItem('codelab_visitante_aula_2')) setLessonTwoCompleted(true)
        }
      }
      setLoading(false)
    }
    checkUserAndProgress()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const totalCompleted = (lessonOneCompleted ? 1 : 0) + (lessonTwoCompleted ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-emerald-500 selection:text-gray-950 relative overflow-x-hidden animate-fadeIn">
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg shrink-0 border border-emerald-500/30">JS</div>
          <h1 className="font-bold text-base sm:text-lg tracking-wide truncate">Codelab <span className="text-emerald-400 text-xs sm:text-sm font-normal">João</span></h1>
        </div>
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Link href="/contato" className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">💬 Contato</Link>
          {userId ? (
            <div className="flex items-center gap-2">
              <Link href="/painel" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold">⚙️ Painel</Link>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold cursor-pointer">Sair</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 bg-gray-900 text-gray-300 border border-gray-800 rounded-xl text-xs">Entrar</Link>
              <Link href="/cadastro" className="px-4 py-2 bg-emerald-500 text-gray-950 font-extrabold rounded-xl text-xs">Criar Conta</Link>
            </div>
          )}
        </div>
        <div className="flex sm:hidden items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-emerald-400 font-bold">☰</button>
        </div>
      </header>

      {menuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-3 z-50 shadow-2xl animate-fadeIn">
          <Link href="/contato" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 rounded-xl text-xs text-gray-300">💬 Contato</Link>
          {userId && <Link href="/painel" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 rounded-xl text-xs text-emerald-400">⚙️ Painel</Link>}
        </div>
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-3 bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 p-5 sm:p-6 rounded-2xl">
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase block">Trilha de Ensino • Módulo 1 🚀</span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Fundamentos de JavaScript</h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">Aprenda a lógica de programação passo a passo nas aulas e teste suas habilidades na Arena.</p>
          </div>
          <div className="bg-gradient-to-r from-amber-500/10 via-gray-900 to-gray-900 border border-amber-500/20 p-5 sm:p-6 rounded-2xl flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Modo Jogo ⚔️</span>
              <h3 className="font-bold text-base text-white">Arena de Desafios</h3>
              <p className="text-xs text-gray-400">Resolva missões de código e ganhe XP.</p>
            </div>
            <Link href="/desafios" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl transition text-center block cursor-pointer">Entrar na Arena ⚡</Link>
          </div>
        </div>

        {/* Módulo 1 */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Módulo 1 • Aulas Disponíveis</h3>
            <span className="text-xs text-gray-500">{loading ? 'Carregando...' : `${totalCompleted}/2 Aulas concluídas`}</span>
          </div>
          <div className="space-y-3">
            <Link href="/dashboard/aula/1" className="p-4 rounded-2xl border bg-gray-900/80 border-gray-800 hover:border-emerald-500/50 transition flex items-center justify-between gap-3 cursor-pointer group block">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${lessonOneCompleted ? 'bg-emerald-500 text-gray-950' : 'bg-gray-800 text-gray-300'}`}>{lessonOneCompleted ? '✓' : '1'}</div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-400 transition truncate">O que é Programação e Como o Computador Pensa?</h4>
                  <p className="text-xs text-gray-400">Fundamentos teóricos e introdução do zero (+20 XP)</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-emerald-400">Assistir →</span>
            </Link>

            <Link href="/dashboard/aula/2" className="p-4 rounded-2xl border bg-gray-900/80 border-gray-800 hover:border-emerald-500/50 transition flex items-center justify-between gap-3 cursor-pointer group block">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${lessonTwoCompleted ? 'bg-emerald-500 text-gray-950' : 'bg-gray-800 text-gray-300'}`}>{lessonTwoCompleted ? '✓' : '2'}</div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-400 transition truncate">Variáveis e Atribuição: As Caixas de Memória</h4>
                  <p className="text-xs text-gray-400">Console real de código e missão prática guiada (+20 XP)</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-emerald-400">Assistir →</span>
            </Link>
          </div>
        </div>

        {/* Módulo 2 (Em Breve) */}
        <div className="space-y-4 pt-4 opacity-75">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Módulo 2 • Em Breve 🔒</h3>
          </div>
          <div className="p-4 rounded-2xl border bg-gray-900/40 border-gray-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gray-800/50 text-gray-500 flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-gray-400">Condicionais e Tomada de Decisão (If / Else)</h4>
                <p className="text-xs text-gray-600">Conteúdo avançado em desenvolvimento</p>
              </div>
            </div>
            <span className="text-xs text-gray-600 font-bold uppercase">Em Breve</span>
          </div>
        </div>
      </main>
    </div>
  )
}