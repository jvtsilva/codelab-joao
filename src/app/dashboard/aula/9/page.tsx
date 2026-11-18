'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AulaNovePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'teoria' | 'pratica' | 'quiz'>('teoria')
  const [menuOpen, setMenuOpen] = useState(false)

  // Estados da missão prática da Aula 9 (Operadores lógicos)
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
          .eq('lesson_id', 'lesson-9')
          .single()

        if (data && data.completed) {
          setCompleted(true)
        }
      } else {
        if (typeof window !== 'undefined' && localStorage.getItem('codelab_visitante_aula_9')) {
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
        localStorage.setItem('codelab_visitante_aula_9', 'true')
      }

      if (userId) {
        await supabase.from('user_progress').upsert({
          user_id: userId,
          lesson_id: 'lesson-9',
          completed: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,lesson_id' })
      }
    }
  }

  // Validação da missão de operadores lógicos no console real
  const handleRunCode = () => {
    const cleanCode = codeAnswer.trim()
    const hasLogicalOp = cleanCode.includes('&&') || cleanCode.includes('||')
    const hasConsoleLog = cleanCode.includes('console.log')

    if (!cleanCode) {
      setConsoleOutput('💬 O editor está vazio. Combine condições usando && (E) ou || (OU) e exiba no console.')
      setMissionSuccess(false)
      return
    }

    if (!hasLogicalOp || !hasConsoleLog) {
      setConsoleOutput(`> ${cleanCode}\n❌ Atenção: sua missão exige combinar condições lógicas usando '&&' ou '||' e exibi-las utilizando o 'console.log()'.`)
      setMissionSuccess(false)
      return
    }

    let logs: string[] = []
    const originalLog = console.log

    try {
      console.log = (...args) => logs.push(args.join(' '))
      eval(cleanCode)

      if (logs.length === 0) {
        logs.push("Código executado, mas nenhum resultado booleano foi enviado para o console.")
      }

      setConsoleOutput(`> ${cleanCode}\n-> ${logs.join('\n-> ')}\n✨ Show de bola! Os operadores lógicos avaliaram as regras perfeitamente!`)
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
    if (option === 'b') {
      setQuizSuccess(true)
      setQuizFeedback('✨ Resposta Correta! O operador E (`&&`) exige que todas as condições envolvidas sejam verdadeiras para que o resultado final seja true.')
      handleCompleteLesson()
    } else {
      setQuizSuccess(false)
      setQuizFeedback('💡 Incorreto. Lembre-se de que o operador `&&` só retorna true se *todas* as condições forem verdadeiras. Se apenas uma falhar, o resultado é false. Tente outra alternativa!')
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
            Módulo 1 • Aula 9
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
              MÓDULO 1 • AULA 9
            </span>
            {completed && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] sm:text-xs rounded-md border border-emerald-500/30">
                Aula Concluída ✓
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            Combinando Condições: Operadores Lógicos (&& e ||)
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Aprenda a conectar múltiplas comparações utilizando o "E" comercial (<code>&&</code>) e o "OU" (<code>||</code>) para criar regras de decisão avançadas.
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
            💻 2. Laboratório Lógico
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
                  <span>🔗</span> 1. O Operador E (`&&`)
                </h3>
                <p>
                  O operador <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">&amp;&amp;</code> (E comercial duplo) conecta duas condições exigindo que <strong className="text-white">ambas sejam verdadeiras</strong> para que o resultado final seja <code className="text-emerald-400">true</code>. Se apenas uma for falsa, tudo falha.
                </p>
                <p className="text-xs text-gray-400">Exemplo: Ter idade maior que 18 <strong>E</strong> ter saldo na conta.</p>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-5">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>🔀</span> 2. O Operador OU (`||`)
                </h3>
                <p>
                  O operador <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">||</code> (duas barras verticais) exige que <strong className="text-white">pelo menos uma das condições</strong> seja verdadeira para que o resultado geral seja <code className="text-emerald-400">true</code>.
                </p>
                <p className="text-xs text-gray-400">Exemplo: Ser assinante VIP <strong>OU</strong> ter um cupom de desconto válido.</p>
                <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl font-mono text-xs space-y-1 mt-2">
                  <span className="text-gray-500">// Exemplo prático combinando regras:</span>
                  <p><span className="text-emerald-400">let</span> temIdade = <span className="text-emerald-400">true</span>;</p>
                  <p><span className="text-emerald-400">let</span> temIngresso = <span className="text-emerald-400">true</span>;</p>
                  <p><span className="text-emerald-400">let</span> podeEntrar = temIdade &amp;&amp; temIngresso;</p>
                  <p><span className="text-emerald-400">console.log</span>(podeEntrar); <span className="text-gray-500">// Imprime true</span></p>
                </div>
              </div>

            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('pratica')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
              >
                Avançar para o Laboratório Lógico →
              </button>
            </div>
          </div>
        )}

        {/* ABA 2: LABORATÓRIO LÓGICO */}
        {activeTab === 'pratica' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-sm sm:text-base font-bold text-white">💻 Laboratório: Avaliando Regras de Acesso</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                No editor abaixo, crie duas variáveis booleanas e combine-as usando <code className="text-emerald-400">&amp;&amp;</code> ou <code className="text-emerald-400">||</code>, exibindo o resultado booleano no <code className="text-emerald-400">console.log()</code>.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono px-1">
                  <span>Editor de Código JS</span>
                  <span>Ambiente do Navegador</span>
                </div>
                <textarea
                  rows={4}
                  placeholder={'let admin = true;\nlet logado = true;\nlet painelLiberado = admin && logado;\nconsole.log(painelLiberado);'}
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
                  <span>⚡</span> Executar Operador Lógico
                </button>
              </div>

              {consoleOutput && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 overflow-x-auto ${missionSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider flex items-center justify-between">
                    <span>Terminal de Saída</span>
                    <span>{missionSuccess ? 'Status: Sucesso [Regras Combinadas]' : 'Status: Atenção Requerida'}</span>
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
              <h3 className="text-sm sm:text-base font-bold text-white">Quiz de Fixação • Aula 9</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Considerando o uso do operador lógico E (<code>&amp;&amp;</code>), qual é o resultado de uma expressão onde uma das condições é <code>true</code> e a outra é <code>false</code>?
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
                  <span>O resultado é sempre <code>true</code> porque há um valor verdadeiro na expressão.</span>
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
                  <span>O resultado é <code>false</code> porque o operador E exige que todas as condições envolvidas sejam verdadeiras.</span>
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
                  href="/dashboard/aula/10"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 text-center cursor-pointer"
                >
                  Próxima Aula (Aula 10) →
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}