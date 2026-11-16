'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AulaUmPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'teoria' | 'pratica' | 'quiz'>('teoria')
  const [menuOpen, setMenuOpen] = useState(false)

  // Estados da missão interativa da Aula 1
  const [userConcept, setUserConcept] = useState('')
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null)
  const [missionSuccess, setMissionSuccess] = useState(false)

  // Estados do Quiz Final
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)
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
          .eq('lesson_id', 'lesson-1')
          .single()

        if (data && data.completed) {
          setCompleted(true)
        }
      } else {
        if (typeof window !== 'undefined' && localStorage.getItem('codelab_visitante_aula_1')) {
          setCompleted(true)
        }
      }
    }
    checkUserAndProgress()
  }, [])

  const handleCompleteLesson = async () => {
    if (!completed) {
      setCompleted(true)

      if (typeof window !== 'undefined') {
        const currentXp = Number(localStorage.getItem('codelab_user_xp') || '0')
        localStorage.setItem('codelab_user_xp', String(currentXp + 20))
        localStorage.setItem('codelab_visitante_aula_1', 'true')
      }

      if (userId) {
        await supabase.from('user_progress').upsert({
          user_id: userId,
          lesson_id: 'lesson-1',
          completed: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,lesson_id' })
      }
    }
  }

  const handleRunCode = () => {
    const text = userConcept.trim().toLowerCase()

    if (!text) {
      setConsoleOutput('❌ Erro: Escreva sua definição no campo acima.')
      setMissionSuccess(false)
      return
    }

    // Valida se o aluno entendeu a lógica de dar instruções / passo a passo
    if (text.includes('passo') || text.includes('instrução') || text.includes('ordem') || text.includes('lógica') || text.includes('tarefa')) {
      setConsoleOutput(`> Analisando conceito: "${userConcept}"\n-> Perfeito! O computador seguiu sua lógica.\n🎉 Missão Teórica Concluída com Sucesso!`)
      setMissionSuccess(true)
      handleCompleteLesson()
    } else {
      setConsoleOutput(`> Analisando conceito: "${userConcept}"\n❌ Quase lá! Pense na programação como uma sequência de passos lógicos para o computador.`)
      setMissionSuccess(false)
    }
  }

  const handleQuizSubmit = (option: string) => {
    setQuizAnswer(option)
    if (option === 'b') {
      setQuizSuccess(true)
      setQuizFeedback('🎉 Resposta Correta! Programação é exatamente dar instruções lógicas passo a passo.')
      handleCompleteLesson()
    } else {
      setQuizSuccess(false)
      setQuizFeedback('❌ Incorreto. Pense na programação como uma receita lógica passo a passo.')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
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
            Módulo 1 • Aula 1
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

        <div className="space-y-2.5 bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 p-5 sm:p-6 rounded-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-emerald-500 text-gray-950 font-extrabold text-[11px] sm:text-xs rounded-md">
              MÓDULO 1 • AULA 1 (+20 XP ⚡)
            </span>
            {completed && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] sm:text-xs rounded-md border border-emerald-500/30">
                Concluída ✓
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            O que é Programação e Como o Computador Pensa?
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Descubra do absoluto zero os fundamentos da lógica de programação e qual o papel do JavaScript na web.
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
            📖 1. Teoria Visual
          </button>
          <button
            onClick={() => setActiveTab('pratica')}
            className={`px-4 py-3 text-xs font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pratica' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            💻 2. Missão Lógica
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

        {activeTab === 'teoria' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 text-gray-300 text-xs sm:text-sm leading-relaxed">
              <h3 className="text-sm sm:text-base font-bold text-white">1. Afinal, o que é programar?</h3>
              <p>
                Programar não é mágica e nem exige superpoderes matemáticos. <strong className="text-emerald-400">Programar é dar instruções lógicas passo a passo</strong> para o computador executar tarefas.
              </p>
              <p>
                Pense em uma receita de bolo: se você colocar o fermento antes de misturar a massa ou esquecer de assar, o bolo estraga. Para o computador, a lógica é idêntica: ele faz exatamente o que você mandar, na ordem exata.
              </p>

              <h3 className="text-sm sm:text-base font-bold text-white pt-2">2. Onde o JavaScript entra nisso?</h3>
              <p>
                O <strong>JavaScript</strong> é a linguagem responsável por dar inteligência e interatividade à internet. Enquanto o HTML monta a estrutura e o CSS cuida da beleza, o JavaScript faz os cálculos, valida dados e anima as telas.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('pratica')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
              >
                Avançar para a Missão Lógica →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'pratica' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white">🎯 Missão Teórica: Explicando a Lógica</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Com suas próprias palavras, descreva brevemente como você explicaria para um amigo o que significa dar instruções passo a passo para o computador (use palavras como <em>passo, ordem ou lógica</em>):
              </p>

              <div className="space-y-2">
                <textarea
                  rows={3}
                  placeholder='Ex: É dar uma sequência de passos lógicos para resolver algo...'
                  value={userConcept}
                  onChange={(e) => setUserConcept(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-4 rounded-xl text-xs sm:text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <button
                  onClick={handleRunCode}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
                >
                  ⚡ Validar Raciocínio
                </button>
              </div>

              {consoleOutput && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 overflow-x-auto ${missionSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider">Simulador de Avaliação:</div>
                  <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setActiveTab('teoria')}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 font-semibold text-xs rounded-xl transition text-center cursor-pointer order-2 sm:order-1"
              >
                Voltar para Teoria
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

        {activeTab === 'quiz' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white">Quiz de Fixação da Aula 1</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Em essência, como podemos definir o que é a programação de computadores?
              </p>

              <div className="grid gap-3 pt-1">
                <button
                  onClick={() => handleQuizSubmit('a')}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                    quizAnswer === 'a' ? (quizSuccess ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300') : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  A) Um componente de hardware que gera energia para a placa-mãe.
                </button>
                <button
                  onClick={() => handleQuizSubmit('b')}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                    quizAnswer === 'b' ? (quizSuccess ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300') : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  B) Dar instruções lógicas passo a passo para o computador resolver tarefas.
                </button>
              </div>

              {quizFeedback && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 ${quizSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider">Resultado:</div>
                  <p>{quizFeedback}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setActiveTab('pratica')}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 font-semibold text-xs rounded-xl transition text-center cursor-pointer order-2 sm:order-1"
              >
                Voltar para Missão
              </button>

              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 text-center cursor-pointer order-1 sm:order-2"
              >
                Concluir Aula e Voltar à Trilha 🚀
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}