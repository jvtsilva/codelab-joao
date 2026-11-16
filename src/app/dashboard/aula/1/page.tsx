'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AulaDoisPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'teoria' | 'pratica' | 'quiz'>('teoria')
  const [menuOpen, setMenuOpen] = useState(false)

  const [codeAnswer, setCodeAnswer] = useState('')
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null)
  const [missionSuccess, setMissionSuccess] = useState(false)

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

  const handleRunCode = () => {
    const cleanCode = codeAnswer.trim()
    const expectedPattern = /const\s+cidadeNatal\s*=\s*(["'])(?:(?!\1).)*\1\s*;?/i

    if (!cleanCode) {
      setConsoleOutput('💬 Escreva seu código no campo acima antes de testar.')
      setMissionSuccess(false)
      return
    }

    if (expectedPattern.test(cleanCode) || cleanCode.includes('cidadeNatal')) {
      try {
        let logs: string[] = []
        const originalLog = console.log
        console.log = (...args) => logs.push(args.join(' '))

        eval(cleanCode)
        if (!cleanCode.includes('console.log')) {
          logs.push("Variável 'cidadeNatal' alocada e guardada com sucesso na memória!")
        }

        console.log = originalLog

        setConsoleOutput(`> ${cleanCode}\n-> ${logs.join('\n-> ')}\n✨ Esplêndido! O interpretador executou seu código sem erros.`)
        setMissionSuccess(true)
        handleCompleteLesson()
      } catch (err: any) {
        setConsoleOutput(`> ${cleanCode}\n💡 Erro de sintaxe detectado: ${err.message}`)
        setMissionSuccess(false)
      }
    } else {
      setConsoleOutput(`> ${cleanCode}\n💡 Dica do mentor: Lembre-se de utilizar a palavra-chave 'const' seguida de 'cidadeNatal' e atribuir um texto entre aspas.`)
      setMissionSuccess(false)
    }
  }

  const handleQuizSubmit = (option: string) => {
    setQuizAnswer(option)
    if (option === 'const') {
      setQuizSuccess(true)
      setQuizFeedback('✨ Perfeito! `const` define uma constante imutável, garantindo que o valor protegido não seja sobrescrito por engano.')
      handleCompleteLesson()
    } else {
      setQuizSuccess(false)
      setQuizFeedback('💡 Incorreto. Pense qual palavra reservada do JavaScript utilizamos para caixas cujos dados não podem mudar.')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-emerald-500 selection:text-gray-950 relative animate-fadeIn">
      
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

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 pb-24">

        <div className="space-y-2.5 bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 p-5 sm:p-6 rounded-2xl">
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
            Variáveis e Atribuição: As Caixas de Memória
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Compreenda a fundo como armazenar, nomear e recuperar dados utilizando constantes em JavaScript.
          </p>
        </div>

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
            💻 2. Missão com Console
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
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-5 text-gray-300 text-xs sm:text-sm leading-relaxed shadow-xl">
              
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>📦</span> 1. O Conceito de Variável na Prática
                </h3>
                <p>
                  Imagine que a memória RAM do seu computador é um grande armazém cheio de gavetas. Quando criamos um programa, precisamos guardar informações temporárias (como o nome de um usuário logado, o placar de um jogo ou o preço de um produto).
                </p>
                <p>
                  Uma <strong className="text-emerald-400">variável</strong> é justamente uma gaveta desse armazém à qual damos um nome (uma etiqueta) para conseguirmos achar o conteúdo facilmente depois.
                </p>
              </div>

              <div className="space-y-2 border-t border-gray-800 pt-4">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>🔑</span> 2. A Palavra-Chave <code>const</code>
                </h3>
                <p>
                  Em JavaScript moderno, usamos a palavra <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">const</code> (abreviação de constante) para declarar gavetas cujos valores não serão alterados ao longo da execução do programa. É a forma mais segura e recomendada de começar.
                </p>
                <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl font-mono text-xs text-emerald-300 space-y-1.5">
                  <span className="text-gray-500">// Anatomia de uma declaração:</span>
                  <p><span className="text-blue-400">const</span> nomeDoUsuario = <span className="text-amber-300">&quot;Mariana&quot;</span>;</p>
                  <p><span className="text-blue-400">const</span> pontuacaoTotal = <span className="text-purple-400">120</span>;</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-800 pt-4">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>⚠️</span> 3. Regras de Ouro para Nomear Variáveis
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
                  <li><strong>Sem espaços:</strong> Use camelCase para juntar palavras (ex: <code className="text-emerald-400">cidadeNatal</code> em vez de <code className="text-red-400">cidade natal</code>).</li>
                  <li><strong>Sem números no início:</strong> O nome nunca pode começar com dígitos (ex: <code className="text-red-400">1lugar</code> é inválido, mas <code className="text-emerald-400">lugar1</code> é válido).</li>
                  <li><strong>Letras maiúsculas e minúsculas importam:</strong> <code className="text-emerald-400">idade</code> e <code className="text-emerald-400">Idade</code> são tratadas como duas gavetas totalmente diferentes.</li>
                </ul>
              </div>

            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('pratica')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
              >
                Avançar para a Missão Prática →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'pratica' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-sm sm:text-base font-bold text-white">🎯 Missão Prática: Declarando sua Primeira Constante</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                No editor abaixo, escreva um código em JavaScript declarando uma constante chamada <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">cidadeNatal</code> atribuindo a ela o valor em texto <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">&quot;São Paulo&quot;</code> (ou a sua própria cidade):
              </p>

              <div className="space-y-2">
                <textarea
                  rows={3}
                  placeholder='const cidadeNatal = "São Paulo";'
                  value={codeAnswer}
                  onChange={(e) => setCodeAnswer(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-4 rounded-xl text-xs sm:text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <button
                  onClick={handleRunCode}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
                >
                  ⚡ Executar no Console Real
                </button>
              </div>

              {consoleOutput && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 overflow-x-auto ${missionSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-amber-950/40 border-amber-500/30 text-amber-300'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider">Console de Execução:</div>
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
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-sm sm:text-base font-bold text-white">Quiz de Fixação da Aula 2</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Qual palavra-chave padrão em JavaScript utilizamos para declarar uma constante cujo valor não pode ser modificado após a atribuição inicial?
              </p>

              <div className="grid gap-3 pt-1">
                <button
                  onClick={() => handleQuizSubmit('var')}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                    quizAnswer === 'var' ? (quizSuccess ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300') : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  A) <code>var</code> (variável global antiga)
                </button>
                <button
                  onClick={() => handleQuizSubmit('const')}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                    quizAnswer === 'const' ? (quizSuccess ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300') : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  B) <code>const</code> (constante imutável)
                </button>
              </div>

              {quizFeedback && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 ${quizSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-amber-950/40 border-amber-500/30 text-amber-300'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider">Feedback do Mentor:</div>
                  <p>{quizFeedback}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setActiveTab('pratica')}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 font-semibold text-xs rounded-xl transition text-center cursor-pointer order-2 sm:order-1"
              >
                Voltar para Prática
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