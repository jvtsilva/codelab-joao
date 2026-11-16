'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [lessonOneCompleted, setLessonOneCompleted] = useState(false)
  const [lessonTwoCompleted, setLessonTwoCompleted] = useState(false)
  const [lessonThreeCompleted, setLessonThreeCompleted] = useState(false)
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
          if (data.find(i => i.lesson_id === 'lesson-3')?.completed) setLessonThreeCompleted(true)
        }
      } else {
        if (typeof window !== 'undefined') {
          if (localStorage.getItem('codelab_visitante_aula_1')) setLessonOneCompleted(true)
          if (localStorage.getItem('codelab_visitante_aula_2')) setLessonTwoCompleted(true)
          if (localStorage.getItem('codelab_visitante_aula_3')) setLessonThreeCompleted(true)
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

  const totalCompleted = (lessonOneCompleted ? 1 : 0) + (lessonTwoCompleted ? 1 : 0) + (lessonThreeCompleted ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-emerald-500 selection:text-gray-950 relative overflow-x-hidden animate-fadeIn">
      
      {/* Header Responsivo com quebra segura */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-3.5 sm:px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg shrink-0 border border-emerald-500/30">JS</div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Codelab <span className="text-emerald-400 text-xs font-normal">João</span>
          </h1>
        </div>

        {/* Menu Desktop */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Link href="/contato" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">💬 Contato</Link>
          {userId ? (
            <div className="flex items-center gap-2">
              <Link href="/painel" className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold">⚙️ Painel</Link>
              <button onClick={handleLogout} className="px-3.5 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold cursor-pointer">Sair</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-3.5 py-2 bg-gray-900 text-gray-300 border border-gray-800 rounded-xl text-xs">Entrar</Link>
              <Link href="/cadastro" className="px-3.5 py-2 bg-emerald-500 text-gray-950 font-extrabold rounded-xl text-xs">Criar Conta</Link>
            </div>
          )}
        </div>

        {/* Botão Hambúrguer Mobile */}
        <div className="flex sm:hidden items-center shrink-0">
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="p-2 bg-gray-900 border border-gray-800 rounded-xl text-emerald-400 font-bold text-lg active:scale-95 transition"
            aria-label="Abrir Menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Menu Dropdown Mobile Otimizado */}
      {menuOpen && (
        <div className="sm:hidden absolute top-14 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-2.5 z-50 shadow-2xl animate-fadeIn">
          <Link href="/contato" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-medium">💬 Contato</Link>
          {userId ? (
            <>
              <Link href="/painel" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium">⚙️ Meu Painel de Controle</Link>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-left px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium cursor-pointer">🚪 Sair da Conta</button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-center px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300">Entrar</Link>
              <Link href="/cadastro" onClick={() => setMenuOpen(false)} className="text-center px-4 py-3 bg-emerald-500 text-gray-950 rounded-xl text-xs font-extrabold">Criar Conta</Link>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo Principal com espaçamento seguro para mobile */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3.5 sm:p-6 space-y-5 pb-20 overflow-hidden">
        
        {/* Banner de Boas-vindas e Arena em Grid responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-2 space-y-2.5 bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 p-4 sm:p-6 rounded-2xl">
            <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase block">Trilha de Ensino • Módulo 1 🚀</span>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">Fundamentos de JavaScript</h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">Aprenda a lógica de programação passo a passo nas aulas práticas e teste suas habilidades na Arena.</p>
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 via-gray-900 to-gray-900 border border-amber-500/20 p-4 sm:p-6 rounded-2xl flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Modo Jogo ⚔️</span>
              <h3 className="font-bold text-sm sm:text-base text-white">Arena de Desafios</h3>
              <p className="text-xs text-gray-400">Resolva missões de código e ganhe XP.</p>
            </div>
            <Link href="/desafios" className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl transition text-center block cursor-pointer">Entrar na Arena ⚡</Link>
          </div>
        </div>

        {/* Lista de Aulas do Bloco A */}
        <div className="space-y-3.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] sm:text-xs font-semibold tracking-wider text-gray-400 uppercase">Módulo 1 • Bloco A (Fundamentos)</h3>
            <span className="text-[11px] sm:text-xs text-gray-500 font-medium">{loading ? 'Carregando...' : `${totalCompleted}/3 Concluídas`}</span>
          </div>

          <div className="space-y-2.5">
            
            {/* Aula 1 */}
            <Link href="/dashboard/aula/1" className="p-3.5 sm:p-4 rounded-2xl border bg-gray-900/80 border-gray-800 hover:border-emerald-500/50 transition flex items-center justify-between gap-3 cursor-pointer group">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ${lessonOneCompleted ? 'bg-emerald-500 text-gray-950' : 'bg-gray-800 text-gray-300'}`}>
                  {lessonOneCompleted ? '✓' : '1'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-base text-white group-hover:text-emerald-400 transition truncate">O Que É Programação de Verdade?</h4>
                  <p className="text-[11px] sm:text-xs text-gray-400 truncate">Desmistificando a lógica e hardware vs software</p>
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-emerald-400 group-hover:underline shrink-0 pl-1">Fazer ⚡</span>
            </Link>

            {/* Aula 2 */}
            <Link href="/dashboard/aula/2" className="p-3.5 sm:p-4 rounded-2xl border bg-gray-900/80 border-gray-800 hover:border-emerald-500/50 transition flex items-center justify-between gap-3 cursor-pointer group">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ${lessonTwoCompleted ? 'bg-emerald-500 text-gray-950' : 'bg-gray-800 text-gray-300'}`}>
                  {lessonTwoCompleted ? '✓' : '2'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-base text-white group-hover:text-emerald-400 transition truncate">O Pensamento Algorítmico</h4>
                  <p className="text-[11px] sm:text-xs text-gray-400 truncate">Decomposição e missão prática do robô</p>
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-emerald-400 group-hover:underline shrink-0 pl-1">Fazer ⚡</span>
            </Link>

            {/* Aula 3 */}
            <Link href="/dashboard/aula/3" className="p-3.5 sm:p-4 rounded-2xl border bg-gray-900/80 border-gray-800 hover:border-emerald-500/50 transition flex items-center justify-between gap-3 cursor-pointer group">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ${lessonThreeCompleted ? 'bg-emerald-500 text-gray-950' : 'bg-gray-800 text-gray-300'}`}>
                  {lessonThreeCompleted ? '✓' : '3'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-base text-white group-hover:text-emerald-400 transition truncate">Onde o Código Vive? (Console)</h4>
                  <p className="text-[11px] sm:text-xs text-gray-400 truncate">Trio da web e comando console.log()</p>
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-emerald-400 group-hover:underline shrink-0 pl-1">Fazer ⚡</span>
            </Link>

          </div>
        </div>

        {/* Próximos Blocos (Em Breve) */}
        <div className="space-y-3 pt-2 opacity-75">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] sm:text-xs font-semibold tracking-wider text-gray-500 uppercase">Bloco B • Memória e Variáveis (Em Breve 🔒)</h3>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl border bg-gray-900/40 border-gray-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-800/50 text-gray-500 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">4+</div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-base text-gray-400 truncate">Variáveis, let, const e Tipos de Dados</h4>
                <p className="text-[11px] text-gray-600 truncate">Próximas aulas em desenvolvimento</p>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-600 font-bold uppercase shrink-0">Em Breve</span>
          </div>
        </div>

      </main>
    </div>
  )
}