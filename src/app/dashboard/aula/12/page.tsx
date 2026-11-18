'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AulaDozePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'teoria' | 'pratica' | 'quiz'>('teoria')
  const [menuOpen, setMenuOpen] = useState(false)

  // Estados da missão prática da Aula 12 (Loop for)
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
          .eq('lesson_id', 'lesson-12')
          .single()

        if (data && data.completed) {
          setCompleted(true)
        }
      } else {
        if (typeof window !== 'undefined' && localStorage.getItem('codelab_visitante_aula_12')) {
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
        localStorage.setItem('codelab_visitante_aula_12', 'true')
      }

      if (userId) {
        await supabase.from('user_progress').upsert({
          user_id: userId,
          lesson_id: 'lesson-12',
          completed: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,lesson_id' })
      }
    }
  }

  // Validação do loop for no console real
  const handleRunCode = () => {
    const cleanCode = codeAnswer.trim()
    const hasFor = cleanCode.includes('for')
    const hasConsoleLog = cleanCode.includes('console.log')

    if (!cleanCode) {
      setConsoleOutput('💬 O editor está vazio. Escreva um loop for e exiba os valores no console.')
      setMissionSuccess(false)
      return
    }

    if (!hasFor || !hasConsoleLog) {
      setConsoleOutput(`> ${cleanCode}\n❌ Atenção: sua missão exige utilizar a estrutura de repetição 'for' acompanhada do 'console.log()'.`)
      setMissionSuccess(false)
      return
    }

    let logs: string[] = []
    const originalLog = console.log

    try {
      console.log = (...args) => logs.push(args.join(' '))
      eval(cleanCode)

      if (logs.length === 0) {
        logs.push("Código executado, mas nenhuma linha foi enviada para o console.")
      }

      setConsoleOutput(`> ${cleanCode}\n-> ${logs.join('\n-> ')}\n✨ Show de bola! O loop for executou as repetições de forma limpa e estruturada!`)
      setMissionSuccess(true)
      handleCompleteLesson()
    } catch (err: any) {
      setConsoleOutput(`> ${cleanCode}\n❌ Erro no interpretador: ${err.message}`)
      setMissionSuccess(false)
    } finally {
      console.log = originalLog
    }
  }

  // Quiz Final
  const handleQuizSubmit = (option: string) => {
    setSelectedQuizOption(option)
    if (option === 'a') {
      setQuizSuccess(true)
      setQuizFeedback('✨ Resposta Correta! A estrutura do loop `for` agrupa em uma única linha a inicialização do contador, a condição de parada e o incremento automático.')
      handleCompleteLesson()
    } else {
      setQuizSuccess(false)
      setQuizFeedback('💡 Incorreto. Lembre-se de que o `for` foi desenhado justamente para agrupar inicialização, condição e incremento em seu cabeçalho, evitando esquecimentos. Tente outra alternativa!')
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
      
      {/* Header Padronizado e Unificado */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg shrink-0 border border-emerald-500/30 select-none">
            JS
          </div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Módulo 1 • Aula 12
          </h1>
        </div>

        {/* Menu Desktop Unificado */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link href="/dashboard" className="px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold">📖 Trilha</Link>
          <Link href="/desafios" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">⚔️ Arena</Link>
          <Link href="/ranking" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">🏆 Ranking</Link>
          <Link href="/medalhas" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">🎖️ Medalhas</Link>
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
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-emerald-400 font-bold transition cursor-pointer active:scale-95"
            aria-label="Menu"
          >
            <span className="text-xl leading-none">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </header>

      {/* Menu Dropdown Mobile Unificado */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-2 z-50 shadow-2xl animate-fadeIn">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold">📖 Ir para a Trilha</Link>
          <Link href="/desafios" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">⚔️ Arena de Desafios</Link>
          <Link href="/ranking" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">🏆 Ranking Geral</Link>
          <Link href="/medalhas" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">🎖️ Painel de Medalhas</Link>
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

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 pb-24">

        <div className="space-y-2.5 bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 p-5 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-emerald-500 text-gray-950 font-extrabold text-[11px] sm:text-xs rounded-md">
              MÓDULO 1 • AULA 12
            </span>
            {completed && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] sm:text-xs rounded-md border border-emerald-500/30">
                Aula Concluída ✓
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            O Loop Mais Usado do Mundo (O Comando <code>for</code>)
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Conheça a estrutura de repetição favorita dos desenvolvedores para contagens controladas e varreduras em lote.
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
            💻 2. Laboratório do For
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
                  <span>⚙️</span> 1. A Estrutura Compacta do `for`
                </h3>
                <p>
                  Embora o <code className="text-emerald-400">while</code> seja ótimo para condições genéricas, o <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">for</code> foi desenhado especificamente para repetições onde sabemos quantas vezes queremos iterar. 
                </p>
                <p>
                  Ele agrupa três pilares essenciais separados por ponto e vírgula (<code className="text-emerald-400">;</code>) dentro dos parênteses:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-gray-400">
                  <li><strong>Inicialização:</strong> Criação da variável contadora (ex: <code className="text-emerald-400">let i = 1</code>).</li>
                  <li><strong>Condição:</strong> O limite de parada (ex: <code className="text-emerald-400">i &lt;= 5</code>).</li>
                  <li><strong>Incremento:</strong> O passo dado a cada volta (ex: <code className="text-emerald-400">i++</code>).</li>
                </ol>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-5">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>💻</span> 2. Anatomia Prática
                </h3>
                <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl font-mono text-xs space-y-1">
                  <p><span className="text-gray-500">// Contando de 1 a 3 em uma única linha de cabeçalho:</span></p>
                  <p><span className="text-emerald-400">for</span> (<span className="text-emerald-400">let</span> i = <span className="text-amber-300">1</span>; i &lt;= <span className="text-amber-300">3</span>; i++) {'{'}</p>
                  <p className="pl-4"><span className="text-emerald-400">console.log</span>(<span className="text-amber-300">&quot;Passo atual: &quot;</span> + i);</p>
                  <p>{'}'}</p>
                </div>
              </div>

            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('pratica')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
              >
                Avançar para o Laboratório do For →
              </button>
            </div>
          </div>
        )}

        {/* ABA 2: LABORATÓRIO DO FOR */}
        {activeTab === 'pratica' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-sm sm:text-base font-bold text-white">💻 Laboratório: Dominando o Loop `for`</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                No editor abaixo, escreva um loop <code className="text-emerald-400">for</code> para contar de 1 a 5 e exiba cada número utilizando o <code className="text-emerald-400">console.log()</code>.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono px-1">
                  <span>Editor de Código JS</span>
                  <span>Ambiente do Navegador</span>
                </div>
                <textarea
                  rows={5}
                  placeholder={'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}'}
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
                  <span>⚡</span> Executar Loop For no Console
                </button>
              </div>

              {consoleOutput && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 overflow-x-auto ${missionSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider flex items-center justify-between">
                    <span>Terminal de Saída</span>
                    <span>{missionSuccess ? 'Status: Sucesso [Loop Executado]' : 'Status: Atenção Requerida'}</span>
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
              <h3 className="text-sm sm:text-base font-bold text-white">Quiz de Fixação • Aula 12</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Quais são os três elementos fundamentais que compõem o cabeçalho de um loop <code>for</code> padrão em JavaScript?
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
                  <span>A inicialização do contador, a condição de parada e o incremento automático.</span>
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
                  <span>O nome da função, os parâmetros de entrada e a instrução de retorno de valor.</span>
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
                  className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition text-center cursor-pointer"
                >
                  Concluir Bloco D e Voltar à Trilha 🚀
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}