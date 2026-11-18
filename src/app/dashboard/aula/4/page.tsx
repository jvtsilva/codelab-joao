'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AulaQuatroPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'teoria' | 'pratica' | 'quiz'>('teoria')
  const [menuOpen, setMenuOpen] = useState(false)

  // Estados da missão prática da Aula 4 (Criando e imprimindo uma variável)
  const [codeAnswer, setCodeAnswer] = useState('')
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null)
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
          .eq('lesson_id', 'lesson-4')
          .single()

        if (data && data.completed) {
          setCompleted(true)
        }
      } else {
        if (typeof window !== 'undefined' && localStorage.getItem('codelab_visitante_aula_4')) {
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
        localStorage.setItem('codelab_visitante_aula_4', 'true')
      }

      if (userId) {
        await supabase.from('user_progress').upsert({
          user_id: userId,
          lesson_id: 'lesson-4',
          completed: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,lesson_id' })
      }
    }
  }

  // Validação da missão de variáveis no console real
  const handleRunCode = () => {
    const cleanCode = codeAnswer.trim()
    const hasLet = cleanCode.includes('let')
    const hasConsoleLog = cleanCode.includes('console.log')

    if (!cleanCode) {
      setConsoleOutput('💬 O editor está vazio. Declare uma variável com let e imprima com console.log.')
      setMissionSuccess(false)
      return
    }

    if (!hasLet || !hasConsoleLog) {
      setConsoleOutput(`> ${cleanCode}\n❌ Atenção: sua missão exige declarar uma variável usando 'let' e exibi-la utilizando o 'console.log()'. Tente novamente!`)
      setMissionSuccess(false)
      return
    }

    let logs: string[] = []
    const originalLog = console.log

    try {
      console.log = (...args) => logs.push(args.join(' '))
      eval(cleanCode)

      if (logs.length === 0) {
        logs.push("Código executado, mas nenhum dado foi enviado para o console.")
      }

      setConsoleOutput(`> ${cleanCode}\n-> ${logs.join('\n-> ')}\n✨ Perfeito! Você criou sua primeira caixa na memória RAM e leu o valor dela com sucesso!`)
      setMissionSuccess(true)
      handleCompleteLesson()
    } catch (err: any) {
      setConsoleOutput(`> ${cleanCode}\n❌ Erro de sintaxe no interpretador: ${err.message}`)
      setMissionSuccess(false)
    } finally {
      console.log = originalLog
    }
  }

  // Quiz Final
  const handleQuizSubmit = (option: string) => {
    setSelectedQuizOption(option)
    if (option === 'b') {
      setQuizSuccess(true)
      setQuizFeedback('✨ Resposta Correta! Uma variável funciona exatamente como uma caixa etiquetada na memória RAM, permitindo armazenar e recuperar dados durante a execução do programa.')
      handleCompleteLesson()
    } else {
      setQuizSuccess(false)
      setQuizFeedback('💡 Incorreto. Lembre-se de que a variável guarda dados temporariamente na memória RAM do computador, e não em arquivos permanentes de disco rígido ou servidores web. Tente outra alternativa!')
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
            Módulo 1 • Aula 4 (Bloco B)
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
              MÓDULO 1 • AULA 4
            </span>
            {completed && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] sm:text-xs rounded-md border border-emerald-500/30">
                Aula Concluída ✓
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            Como o Computador Lembra das Coisas? (Memória RAM e Variáveis)
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Descubra como a memória RAM armazena informações temporariamente e aprenda a usar o comando <code>let</code> para criar caixas etiquetadas no código.
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
            💻 2. Laboratório de Variáveis
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
                  <span>🧠</span> 1. A Memória RAM e o Armazém de Caixas
                </h3>
                <p>
                  Até agora, vimos como dar ordens sequenciais ao computador. Mas imagine que você pediu para a máquina somar dois números ou guardar o nome de um jogador. Onde ela guarda essa informação? Na <strong className="text-emerald-400">Memória RAM</strong>.
                </p>
                <p>
                  Para facilitar a nossa vida, imaginamos a RAM como um imenso armazém cheio de caixas vazias. Cada caixa precisa de uma etiqueta com um nome exclusivo e de um conteúdo guardado lá dentro. Em programação, chamamos essas caixas de <strong className="text-white">Variáveis</strong>.
                </p>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-5">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>📦</span> 2. Criando uma Caixa com <code>let</code>
                </h3>
                <p>
                  Para criar (ou <em>declarar</em>) uma variável em JavaScript, usamos a palavra-chave <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">let</code> seguida do nome da caixa e do valor que queremos colocar nela.
                </p>
                <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl font-mono text-xs space-y-1">
                  <span className="text-gray-500">// Criando a caixa "pontuacao" e guardando o número 10:</span>
                  <p><span className="text-emerald-400">let</span> pontuacao = <span className="text-amber-300">10</span>;</p>
                  <p><span className="text-emerald-400">console.log</span>(pontuacao); <span className="text-gray-500">// Imprime 10</span></p>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-5">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>🔄</span> 3. O porquê do nome "Variável"
                </h3>
                <p>
                  O nome diz tudo: o valor guardado dentro da caixa <strong className="text-emerald-400">pode variar</strong> ao longo do tempo. Você pode começar o jogo com 0 pontos e atualizar a variável conforme o jogador pontua.
                </p>
              </div>

            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('pratica')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
              >
                Avançar para o Laboratório de Variáveis →
              </button>
            </div>
          </div>
        )}

        {/* ABA 2: LABORATÓRIO DE VARIÁVEIS */}
        {activeTab === 'pratica' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-sm sm:text-base font-bold text-white">💻 Laboratório: Declarando sua Primeira Variável</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                No editor abaixo, crie uma variável chamada <code className="text-emerald-400">nomeDoAluno</code> com o seu nome (usando aspas) e use o <code className="text-emerald-400">console.log()</code> para exibi-la.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono px-1">
                  <span>Editor de Código JS</span>
                  <span>Memória RAM do Navegador</span>
                </div>
                <textarea
                  rows={4}
                  placeholder={'let nomeDoAluno = "João";\nconsole.log(nomeDoAluno);'}
                  value={codeAnswer}
                  onChange={(e) => setCodeAnswer(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-4 rounded-xl text-xs sm:text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 transition leading-relaxed shadow-inner"
                />
              </div>

              <div>
                <button
                  onClick={handleRunCode}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>⚡</span> Executar Código e Testar Memória
                </button>
              </div>

              {consoleOutput && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 overflow-x-auto ${missionSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider flex items-center justify-between">
                    <span>Terminal de Saída</span>
                    <span>{missionSuccess ? 'Status: Sucesso [Variável Criada]' : 'Status: Atenção Requerida'}</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono">{consoleOutput}</pre>
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
              <h3 className="text-sm sm:text-base font-bold text-white">Quiz de Fixação • Aula 4</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Na analogia da programação, para que serve exatamente uma variável declarada com <code>let</code>?
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
                  <span>Para salvar arquivos permanentemente no disco rígido do computador de forma definitiva.</span>
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
                  <span>Para funcionar como uma caixa etiquetada na memória RAM que armazena dados temporários durante a execução.</span>
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
                ← Voltar para Laboratório
              </button>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-1 sm:order-2">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-5 py-3 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 font-bold text-xs rounded-xl transition text-center cursor-pointer"
                >
                  Voltar à Trilha
                </Link>
                <Link
                  href="/dashboard/aula/5"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 text-center cursor-pointer"
                >
                  Próxima Aula (Aula 5) →
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}