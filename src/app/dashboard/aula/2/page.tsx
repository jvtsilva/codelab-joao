'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AulaDoisPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'teoria' | 'pratica' | 'quiz'>('teoria')
  const [menuOpen, setMenuOpen] = useState(false)

  // Estados da missão lógica da Aula 2 (Simulador de Robô na Grelha / Passos)
  const [robotSteps, setRobotSteps] = useState([
    { id: 1, action: 'Virar à Direita', correct: false },
    { id: 2, action: 'Dar 3 passos para frente', correct: true },
    { id: 3, action: 'Pegar a chave dourada', correct: true },
    { id: 4, action: 'Pular sem olhar', correct: false }
  ])
  const [selectedRobotActions, setSelectedRobotActions] = useState<number[]>([])
  const [missionOutput, setMissionOutput] = useState<string | null>(null)
  const [missionSuccess, setMissionSuccess] = useState(false)

  // Estados do Quiz Final
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null)
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null)
  const [quizSuccess, setQuizSuccess] = useState(false)

  useEffect(() => {
    async function checkUserAndProgress() {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        const currentUserId = session.user.id
        setUserId(currentUserId)

        const { data } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', currentUserId)
          .eq('lesson_id', 'lesson-2')
          .single()

        if (data && data.completed) {
          setCompleted(true)
        }
      } else {
        if (typeof window !== 'undefined' && localStorage.getItem('codelab_visitante_aula_2')) {
          setCompleted(true)
        }
      }
    }
    checkUserAndProgress()
  }, [])

  const handleCompleteLesson = async () => {
    if (!completed) {
      setCompleted(true)

      if (!userId && typeof window !== 'undefined') {
        localStorage.setItem('codelab_visitante_aula_2', 'true')
      }

      if (userId) {
        await supabase.from('user_progress').upsert({
          user_id: userId,
          lesson_id: 'lesson-2',
          completed: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,lesson_id' })
      }
    }
  }

  // Marcar/desmarcar ações do robô
  const toggleAction = (id: number) => {
    if (selectedRobotActions.includes(id)) {
      setSelectedRobotActions(selectedRobotActions.filter(item => item !== id))
    } else {
      setSelectedRobotActions([...selectedRobotActions, id])
    }
    setMissionOutput(null)
  }

  // Validar o algoritmo do robô (Ações corretas esperadas: IDs 2 e 3)
  const handleValidateRobot = () => {
    const hasTwo = selectedRobotActions.includes(2)
    const hasThree = selectedRobotActions.includes(3)
    const hasWrong = selectedRobotActions.includes(1) || selectedRobotActions.includes(4)

    if (selectedRobotActions.length === 0) {
      setMissionOutput('💬 Selecione pelo menos as instruções necessárias para o robô cumprir a missão.')
      setMissionSuccess(false)
      return
    }

    if (hasTwo && hasThree && !hasWrong) {
      setMissionOutput('✨ Excelente! Você selecionou exatamente os passos atômicos corretos. O robô atravessou o corredor e pegou a chave com sucesso!')
      setMissionSuccess(true)
      handleCompleteLesson()
    } else {
      setMissionOutput('❌ Cuidado! Você incluiu passos desnecessários ou perigosos (como pular sem olhar ou virar sem contexto). Lembre-se que o robô só executa o que é preciso e lógico. Tente novamente!')
      setMissionSuccess(false)
    }
  }

  // Quiz Final
  const handleQuizSubmit = (option: string) => {
    setSelectedQuizOption(option)
    if (option === 'b') {
      setQuizSuccess(true)
      setQuizFeedback('✨ Perfeito! O algoritmo é uma sequência finita de instruções claras e sem ambiguidades que guiam a máquina rumo à solução do problema.')
      handleCompleteLesson()
    } else {
      setQuizSuccess(false)
      setQuizFeedback('💡 Incorreto. Lembre-se de que algoritmos exigem rigor lógico e ordem estrita; eles não funcionam com adivinhações subjetivas. Tente outra alternativa!')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('codelab_')) {
          localStorage.removeItem(key)
        }
      })
    }
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-emerald-500 selection:text-gray-950 relative animate-fadeIn">
      
      {/* Header Responsivo */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg shrink-0 border border-emerald-500/30 select-none">
            JS
          </div>
          <h1 className="font-bold text-xs sm:text-sm tracking-wide truncate">
            Módulo 1 • Aula 2
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 font-semibold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            Voltar à Trilha
          </Link>
          {userId && (
            <Link
              href="/painel"
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-emerald-400 border border-emerald-500/30 transition font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚙️</span> Painel
            </Link>
          )}
        </div>

        <div className="flex sm:hidden items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-emerald-400 font-bold transition cursor-pointer active:scale-95"
            aria-label="Menu"
          >
            <span className="text-xl leading-none">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </header>

      {/* Menu Dropdown Mobile */}
      {menuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-2.5 z-50 shadow-2xl animate-fadeIn">
          <Link 
            href="/dashboard" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300 hover:text-white"
          >
            <span>Voltar para a Trilha de Aulas</span>
            <span>→</span>
          </Link>
          {userId && (
            <Link
              href="/painel"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 bg-gray-950 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-400"
            >
              <span>⚙️ Meu Painel de Controle</span>
              <span>→</span>
            </Link>
          )}
          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl text-xs cursor-pointer"
          >
            <span>🚪 Sair da Conta</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 pb-24">

        <div className="space-y-2.5 bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 p-5 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-emerald-500 text-gray-950 font-extrabold text-[11px] sm:text-xs rounded-md">
              MÓDULO 1 • AULA 2
            </span>
            {completed && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] sm:text-xs rounded-md border border-emerald-500/30">
                Aula Concluída ✓
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            O Pensamento Algorítmico e a Lógica Sequencial
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Mergulhe fundo no conceito de algoritmos, aprenda a decompor problemas complexos em passos atômicos e entenda por que a ordem dos comandos muda tudo.
          </p>
        </div>

        {/* Abas */}
        <div className="flex border-b border-gray-800 gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('teoria')}
            className={`px-4 py-3 text-xs font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'teoria' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            📖 1. Teoria Visual Profunda
          </button>
          <button
            onClick={() => setActiveTab('pratica')}
            className={`px-4 py-3 text-xs font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pratica' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            💻 2. Missão Algorítmica
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-3 text-xs font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'quiz' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            ❓ 3. Quiz Final
          </button>
        </div>

        {/* ABA 1: TEORIA VISUAL PROFUNDA */}
        {activeTab === 'teoria' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-6 text-gray-300 text-xs sm:text-sm leading-relaxed shadow-xl">
              
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>🗺️</span> 1. O Que é um Algoritmo de Verdade?
                </h3>
                <p>
                  A palavra <em>algoritmo</em> parece técnica e distante, mas ela significa algo muito simples: <strong className="text-emerald-400">uma sequência finita de regras bem definidas e sem ambiguidades que resolvem um problema específico</strong>.
                </p>
                <p>
                  Sempre que você segue uma receita de bolo, monta um móvel com manual de instruções ou dá direções de GPS para alguém, você está aplicando um algoritmo na vida real.
                </p>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-5">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>⚙️</span> 2. Decomposição: Quebrando o Monstro em Pedaços
                </h3>
                <p>
                  Quando um programador iniciante olha para um sistema inteiro (como criar um Instagram ou um jogo de tiro), ele se assusta. O segredo dos profissionais é a <strong className="text-white">decomposição</strong>: pegar um problema gigantesco e ir quebrando-o em subtarefas atômicas até que cada pedacinho seja ridiculamente simples de resolver.
                </p>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-5">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>🔄</span> 3. O Fluxo de Execução Sequencial
                </h3>
                <p>
                  O computador lê códigos como quem lê um livro em português: <strong className="text-emerald-400">da esquerda para a direita, de cima para baixo, linha por linha</strong>. Se você colocar a linha 2 antes da linha 1 de forma incorreta, o programa falha ou gera um <em>bug</em>. Garantir essa harmonia sequencial é o núcleo do pensamento lógico.
                </p>
              </div>

            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('pratica')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
              >
                Avançar para a Missão Algorítmica →
              </button>
            </div>
          </div>
        )}

        {/* ABA 2: MISSÃO ALGORÍTMICA INTERATIVA */}
        {activeTab === 'pratica' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-sm sm:text-base font-bold text-white">🎯 Missão Algorítmica: Programando o Robô</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                O robô precisa atravessar o corredor para pegar a chave dourada. Selecione abaixo <strong>apenas as instruções corretas e necessárias</strong> para que o algoritmo cumpra a missão sem falhas:
              </p>

              {/* Lista de seleção de comandos */}
              <div className="space-y-2.5 pt-1">
                {robotSteps.map((step) => {
                  const isSelected = selectedRobotActions.includes(step.id)
                  return (
                    <div 
                      key={step.id} 
                      onClick={() => toggleAction(step.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border text-xs sm:text-sm font-mono cursor-pointer transition ${
                        isSelected 
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200' 
                          : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs border ${
                          isSelected ? 'bg-emerald-500 border-emerald-400 text-gray-950' : 'border-gray-700 bg-gray-900'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </div>
                        <span>{step.action}</span>
                      </div>
                      <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                        {isSelected ? 'Selecionado' : 'Disponível'}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleValidateRobot}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>⚡</span> Enviar Algoritmo para o Robô
                </button>
              </div>

              {missionOutput && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 overflow-x-auto ${missionSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider flex items-center justify-between">
                    <span>Terminal de Execução</span>
                    <span>{missionSuccess ? 'Status: Sucesso [Missão Concluída]' : 'Status: Falha no Algoritmo'}</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono">{missionOutput}</pre>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setActiveTab('teoria')}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 font-semibold text-xs rounded-xl transition text-center cursor-pointer order-2 sm:order-1"
              >
                ← Voltar para Teoria
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center order-1 sm:order-2"
              >
                Avançar para o Quiz Final →
              </button>
            </div>
          </div>
        )}

        {/* ABA 3: QUIZ FINAL */}
        {activeTab === 'quiz' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-5 shadow-xl">
              <h3 className="text-sm sm:text-base font-bold text-white">Quiz de Fixação • Aula 2</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                O que caracteriza essencialmente um algoritmo bem estruturado para ser executado por um computador?
              </p>

              <div className="grid gap-3 pt-1">
                <button
                  onClick={() => handleQuizSubmit('a')}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer flex items-start gap-3 ${
                    selectedQuizOption === 'a' 
                      ? (quizSuccess ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-red-500/20 border-red-500 text-red-200') 
                      : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  <span className="font-bold shrink-0">A)</span>
                  <span>Uma lista de ideias vagas e criativas que a máquina pode interpretar livremente dependendo do seu humor.</span>
                </button>

                <button
                  onClick={() => handleQuizSubmit('b')}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer flex items-start gap-3 ${
                    selectedQuizOption === 'b' 
                      ? (quizSuccess ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-red-500/20 border-red-500 text-red-200') 
                      : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  <span className="font-bold shrink-0">B)</span>
                  <span>Uma sequência finita de instruções claras, ordenadas e sem ambiguidades que levam à resolução de um problema.</span>
                </button>
              </div>

              {quizFeedback && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 ${quizSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-amber-950/40 border-amber-500/30 text-amber-300'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                    <span>💡 Análise do Mentor</span>
                  </div>
                  <p className="leading-relaxed">{quizFeedback}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setActiveTab('pratica')}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 font-semibold text-xs rounded-xl transition text-center cursor-pointer order-2 sm:order-1"
              >
                ← Voltar para Missão
              </button>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-1 sm:order-2">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-5 py-3 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 font-bold text-xs rounded-xl transition text-center cursor-pointer"
                >
                  Voltar à Trilha
                </Link>
                <Link
                  href="/dashboard/aula/3"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 text-center cursor-pointer"
                >
                  Próxima Aula (Aula 3) →
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}