'use client'

import { useState, useEffect } from 'react'
import { JAVASCRIPT_MODULES } from '@/data/courses'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [lessonStatuses, setLessonStatuses] = useState<Record<string, 'completed' | 'reviewing'>>({})
  
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [welcomeMessage, setWelcomeMessage] = useState('')

  const [selectedModuleId, setSelectedModuleId] = useState(JAVASCRIPT_MODULES[0]?.id || '')

  const motivationalQuotes = [
    "🚀 Programar é a arte de transformar café em código limpo!",
    "💡 Cada bug resolvido é um nível a mais na sua carreira de dev.",
    "🔥 O código de hoje é o sistema incrível de amanhã. Não pare!",
    "⭐ Persistência é o superpoder do programador de sucesso.",
    "💻 Pequenos commits diários constroem grandes softwares."
  ]

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setAuthError('Por favor, digite um e-mail válido.')
      return
    }

    if (isSignUp && password.length < 8) {
      setAuthError('A senha precisa ter pelo menos 8 caracteres.')
      return
    }

    setIsLoading(true)

    try {
      if (isSignUp) {
        setStatusMessage('Fazendo cadastro...')
        const { error } = await supabase.auth.signUp({ email, password })
        await new Promise(resolve => setTimeout(resolve, 1500))

        if (error) {
          setAuthError(error.message)
          setStatusMessage('')
          setIsLoading(false)
        } else {
          setStatusMessage('✨ Conta criada com sucesso!')
          setPassword('')
          await new Promise(resolve => setTimeout(resolve, 1500))
          setIsSignUp(false)
          setIsLoading(false)
          setIsAuthOpen(false)
          triggerWelcome("Bem-vindo ao Codelab! Sua jornada rumo à excelência em programação começa agora.")
        }
      } else {
        setStatusMessage('Verificando credenciais...')
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        await new Promise(resolve => setTimeout(resolve, 1500))

        if (error) {
          setAuthError('E-mail ou senha incorretos.')
          setStatusMessage('')
          setIsLoading(false)
        } else {
          setStatusMessage('✨ Login efetuado com sucesso!')
          await new Promise(resolve => setTimeout(resolve, 1500))
          setIsAuthOpen(false)
          setIsLoading(false)
          const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
          triggerWelcome(randomQuote)
        }
      }
    } catch (err) {
      setStatusMessage('')
      setIsLoading(false)
    }
  }

  const triggerWelcome = (msg: string) => {
    setWelcomeMessage(msg)
    setShowWelcomeModal(true)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setLessonStatuses({})
    setIsProfileOpen(false)
  }

  const currentModule = JAVASCRIPT_MODULES.find(m => m.id === selectedModuleId) || JAVASCRIPT_MODULES[0]

  // Libera exatamente as 3 primeiras lições ativas
  const isFirstModule = currentModule.id === JAVASCRIPT_MODULES[0]?.id
  const activeLessons = isFirstModule ? currentModule.lessons.slice(0, 3) : currentModule.lessons

  const allLessonsCompleted = activeLessons.every(
    lesson => lessonStatuses[lesson.id] === 'completed'
  )

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
                <button 
                  type="button"
                  onClick={() => {
                    setIsSignUp(false)
                    setAuthError('')
                    setStatusMessage('')
                    setIsAuthOpen(true)
                  }}
                  className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-2 rounded-xl cursor-pointer active:scale-95 transition-transform"
                >
                  Entrar
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    setIsSignUp(true)
                    setAuthError('')
                    setStatusMessage('')
                    setIsAuthOpen(true)
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-95 transition-transform"
                >
                  Cadastrar
                </button>
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
            
            {/* Lições Ativas (As 3 primeiras) */}
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

            {/* Bloco Genérico: Novos tópicos em breve e Prova Final bloqueada */}
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

      {/* Modal de Boas-Vindas e Motivação */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-sm sm:max-w-md p-6 space-y-5 text-center shadow-2xl relative my-auto box-border animate-in fade-in zoom-in duration-200">
            
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl mx-auto shadow-inner">
              ⚡
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Bons Estudos, Dev! 🚀
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed px-2">
                {welcomeMessage}
              </p>
            </div>

            <button 
              type="button"
              onClick={() => setShowWelcomeModal(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-95 transition-transform"
            >
              Começar a Praticar →
            </button>

          </div>
        </div>
      )}

      {/* Modal de Auth Responsivo */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 z-50 overflow-y-auto overflow-x-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 space-y-4 shadow-2xl relative my-auto box-border">
            
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {isSignUp ? 'Criar sua conta' : 'Acessar plataforma'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isSignUp ? 'Jornada do zero absoluto.' : 'Entre para salvar seu progresso.'}
                </p>
              </div>
              {!isLoading && (
                <button 
                  type="button"
                  onClick={() => setIsAuthOpen(false)} 
                  className="w-7 h-7 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white font-bold flex items-center justify-center shrink-0 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl mx-auto flex items-center justify-center text-lg font-bold animate-spin">
                  ⏳
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-sm px-2">{statusMessage}</h4>
                  <p className="text-[11px] text-slate-400">Aguarde um instante...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAuth} className="space-y-3.5">
                {authError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs leading-relaxed">
                    {authError}
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">E-mail</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 box-border"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-semibold text-slate-300">Senha</label>
                    {isSignUp && <span className="text-[10px] text-slate-500 font-mono">Mín. 8 caracteres</span>}
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 box-border"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/10 mt-1 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                >
                  <span>{isSignUp ? 'Concluir Cadastro →' : 'Entrar na Trilha →'}</span>
                </button>
              </form>
            )}

            {!isLoading && (
              <div className="text-center pt-2 border-t border-slate-800/80">
                <button 
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setAuthError('')
                  }}
                  className="text-[11px] text-slate-400 hover:text-emerald-400 font-medium px-2 py-1 cursor-pointer"
                >
                  {isSignUp ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}