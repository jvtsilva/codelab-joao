'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { JAVASCRIPT_MODULES } from '@/data/courses'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [lessonStatuses, setLessonStatuses] = useState<Record<string, 'completed' | 'reviewing'>>({})
  const [user, setUser] = useState<any>(null)
  
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedModuleId, setSelectedModuleId] = useState(JAVASCRIPT_MODULES[0]?.id || '')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProgress(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProgress(session.user.id)
      } else {
        setLessonStatuses({})
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProgress = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('lesson_id, status')
      .eq('user_id', userId)

    if (data && !error) {
      const statusMap: Record<string, 'completed' | 'reviewing'> = {}
      data.forEach((p) => {
        statusMap[p.lesson_id] = p.status || 'completed'
      })
      setLessonStatuses(statusMap)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setLessonStatuses({})
    setIsProfileOpen(false)
  }

  const currentModule = JAVASCRIPT_MODULES.find(m => m.id === selectedModuleId) || JAVASCRIPT_MODULES[0]
  const isFirstModule = currentModule.id === JAVASCRIPT_MODULES[0]?.id
  const activeLessons = isFirstModule ? currentModule.lessons.slice(0, 3) : currentModule.lessons
  const totalCompletedLessons = Object.values(lessonStatuses).filter(s => s === 'completed').length

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 w-full overflow-x-hidden">
      
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 py-3.5 w-full box-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
              JS
            </div>
            <h1 className="text-xs sm:text-base font-bold tracking-tight text-white truncate">
              Codelab <span className="text-emerald-400 font-normal">João</span>
            </h1>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button 
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer active:scale-95 transition-transform flex items-center gap-1.5"
                >
                  <span>👤</span>
                  <span className="hidden sm:inline">Minha Conta</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* BOTÃO DE ENTRAR DIRECIONANDO PARA /login */}
                <Link 
                  href="/login"
                  className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-2 rounded-xl cursor-pointer active:scale-95 transition-transform inline-flex items-center justify-center no-underline"
                >
                  Entrar
                </Link>

                {/* BOTÃO DE CADASTRAR DIRECIONANDO PARA /cadastro */}
                <Link 
                  href="/cadastro"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-95 transition-transform inline-flex items-center justify-center no-underline"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-5 space-y-6 box-border overflow-x-hidden">
        
        {/* Seletor de Módulos */}
        <div className="space-y-2 w-full max-w-full">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">Trilha de Estudos</span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none w-full max-w-full">
            {JAVASCRIPT_MODULES.map((mod, index) => {
              const isSelected = mod.id === selectedModuleId
              const isFirst = index === 0

              return isFirst ? (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95 ${
                    isSelected 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10 font-bold' 
                      : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 border border-slate-900'
                  }`}
                >
                  {mod.title}
                </button>
              ) : (
                <div
                  key={mod.id}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap bg-slate-900/30 text-slate-500 border border-slate-900/80 cursor-not-allowed flex items-center gap-1.5 opacity-70"
                >
                  <span>🔒</span>
                  <span>{mod.title} (Em breve)</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detalhes do Módulo */}
        <div className="space-y-5 w-full max-w-full">
          <div className="space-y-1.5 border-b border-slate-900 pb-5 w-full">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-words">{currentModule.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed break-words">{currentModule.description}</p>
          </div>

          <div className="space-y-2.5 w-full">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Tópicos e Avaliação</span>
            
            {activeLessons.map((lesson, idx) => {
              const status = lessonStatuses[lesson.id]
              
              return (
                <a 
                  key={lesson.id}
                  href={`/lesson/${lesson.id}`}
                  className="w-full text-left group flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/30 hover:bg-slate-900/80 border border-slate-900 hover:border-emerald-500/40 transition-all cursor-pointer box-border active:scale-[0.99] no-underline block"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-bold text-xs ${
                      status === 'completed' 
                        ? 'bg-emerald-500 text-slate-950 font-black' 
                        : status === 'reviewing'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {status === 'completed' ? '✓' : status === 'reviewing' ? '💡' : `${idx + 1}`}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-200 group-hover:text-emerald-300 text-xs sm:text-sm truncate">
                        {lesson.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {status === 'completed' ? 'Concluído' : status === 'reviewing' ? 'Requer revisão' : 'Teoria e prática'}
                      </p>
                    </div>
                  </div>

                  <span className="text-slate-600 group-hover:text-emerald-400 font-bold text-sm shrink-0 pl-2">
                    →
                  </span>
                </a>
              )
            })}

            {isFirstModule && (
              <>
                <div className="w-full text-left flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/20 border border-slate-900 opacity-60 cursor-not-allowed box-border">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-bold text-xs bg-slate-900 text-slate-600 border border-slate-800">
                      🔒
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-400 text-xs sm:text-sm truncate">
                        Novos tópicos
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        Em breve na plataforma
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-sm shrink-0 pl-2 text-slate-600">
                    🔒
                  </span>
                </div>

                <div className="w-full text-left flex items-center justify-between gap-3 p-4 rounded-2xl border transition-all box-border bg-slate-900/20 border-slate-900 opacity-70 cursor-not-allowed">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-bold text-xs bg-slate-900 text-amber-500/70 border border-slate-800">
                      ⭐
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm truncate text-slate-400">
                        Prova Final: {currentModule.title}
                      </h4>
                      <p className="text-[11px] text-amber-500/80 truncate mt-0.5 font-medium">
                        Em breve — Conteúdo em desenvolvimento
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-sm shrink-0 pl-2 text-slate-600">
                    🔒
                  </span>
                </div>
              </>
            )}

          </div>
        </div>

      </main>

      {/* Modal de Dados da Conta (Perfil) */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 space-y-5 shadow-2xl relative my-auto box-border">
            
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Painel da Conta
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Suas credenciais e estatísticas no Codelab.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsProfileOpen(false)} 
                className="w-7 h-7 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white font-bold flex items-center justify-center shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">E-mail Cadastrado</span>
                <p className="text-xs sm:text-sm font-mono text-emerald-400 truncate">
                  {user?.email || 'Não informado'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-xl font-black text-emerald-400">{totalCompletedLessons}</span>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Tópicos Concluídos</span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-xl font-black text-amber-400">JS</span>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Trilha Ativa</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex gap-2">
              <button 
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Fechar
              </button>
              
              <button 
                type="button"
                onClick={handleLogout}
                className="flex-1 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Sair da Conta
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}