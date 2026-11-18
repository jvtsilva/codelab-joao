'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AulaCincoPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'teoria' | 'pratica' | 'quiz'>('teoria')
  const [menuOpen, setMenuOpen] = useState(false)

  // Estados da missão prática da Aula 5 (Usando const e let corretamente)
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
          .eq('lesson_id', 'lesson-5')
          .single()

        if (data && data.completed) {
          setCompleted(true)
        }
      } else {
        if (typeof window !== 'undefined' && localStorage.getItem('codelab_visitante_aula_5')) {
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
        localStorage.setItem('codelab_visitante_aula_5', 'true')
      }

      if (userId) {
        await supabase.from('user_progress').upsert({
          user_id: userId,
          lesson_id: 'lesson-5',
          completed: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,lesson_id' })
      }
    }
  }

  // Validação da missão de const e let no console real
  const handleRunCode = () => {
    const cleanCode = codeAnswer.trim()
    const hasConst = cleanCode.includes('const')
    const hasLet = cleanCode.includes('let')
    const hasConsoleLog = cleanCode.includes('console.log')

    if (!cleanCode) {
      setConsoleOutput('💬 O editor está vazio. Use const para um valor fixo e let para um valor que muda.')
      setMissionSuccess(false)
      return
    }

    if (!hasConst || !hasLet || !hasConsoleLog) {
      setConsoleOutput(`> ${cleanCode}\n❌ Atenção: sua missão exige declarar pelo menos uma constante com 'const' e uma variável modificável com 'let', exibindo os resultados com 'console.log()'.`)
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

      setConsoleOutput(`> ${cleanCode}\n-> ${logs.join('\n-> ')}\n✨ Show de bola! Você dominou a diferença entre dados fixos (const) e dados mutáveis (let)!`)
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
      setQuizFeedback('✨ Resposta Correta! Usamos `const` para valores que nunca devem mudar ao longo da aplicação (como configurações fixas), e `let` para valores que precisam ser atualizados futuramente.')
      handleCompleteLesson()
    } else {
      setQuizSuccess(false)
      setQuizFeedback('💡 Incorreto. Lembre-se de que o JavaScript proíbe reatribuir novos valores a uma variável declarada com `const`. Tente outra alternativa!')
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
            Módulo 1 • Aula 5 (Bloco B)
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
              MÓDULO 1 • AULA 5
            </span>
            {completed && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] sm:text-xs rounded-md border border-emerald-500/30">
                Aula Concluída ✓
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            Constantes vs Variáveis: Quando usar <code>const</code> e <code>let</code>?
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Entenda a diferença crucial entre dados mutáveis e imutáveis na memória, e descubra por que os programadores modernos evitam o antigo <code>var</code>.
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
            💻 2. Laboratório de Constantes
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
                  <span>🔒</span> 1. A Caixa Forte da Memória (`const`)
                </h3>
                <p>
                  Na programação moderna, nem tudo deve poder ser mudado a qualquer momento. Se você cria uma configuração fixa (como a taxa de juros do sistema ou o nome da sua aplicação), você precisa garantir que nenhuma outra parte do código altere esse valor por engano.
                </p>
                <p>
                  Para isso, usamos a palavra-chave <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">const</code> (abreviação de constante). Ela cria uma <strong className="text-white">caixa forte soldada</strong>: uma vez que você coloca um dado dentro dela, o JavaScript proíbe qualquer tentativa futura de trocar o seu conteúdo.
                </p>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-5">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>📦</span> 2. A Caixa Flexível (`let`)
                </h3>
                <p>
                  Por outro lado, quando sabemos que a informação vai mudar durante a execução do programa (como a pontuação de um jogo, o carrinho de compras de um e-commerce ou o status de login do usuário), usamos o <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">let</code> que aprendemos na aula passada.
                </p>
                <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl font-mono text-xs space-y-1">
                  <span className="text-gray-500">// Exemplo prático:</span>
                  <p><span className="text-emerald-400">const</span> nomeDoJogo = <span className="text-amber-300">&quot;Codelab João&quot;</span>; <span className="text-gray-500">// Nunca muda</span></p>
                  <p><span className="text-emerald-400">let</span> vidasDoJogador = <span className="text-amber-300">3</span>; <span className="text-gray-500">// Pode mudar se tomar dano</span></p>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-5">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>⚠️</span> 3. E o antigo `var`? Esqueça ele!
                </h3>
                <p>
                  Antigamente, usava-se a palavra <code className="text-emerald-400">var</code> para criar variáveis. No entanto, o <code className="text-emerald-400">var</code> tinha falhas graves de comportamento na memória que geravam bugs difíceis de achar. Hoje em dia, no JavaScript moderno, <strong className="text-emerald-400">só usamos const e let</strong>.
                </p>
              </div>

            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('pratica')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
              >
                Avançar para o Laboratório de Constantes →
              </button>
            </div>
          </div>
        )}

        {/* ABA 2: LABORATÓRIO DE CONSTANTES */}
        {activeTab === 'pratica' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-sm sm:text-base font-bold text-white">💻 Laboratório: Praticando `const` e `let`</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                No editor abaixo, declare uma constante <code className="text-emerald-400">const escola = "Codelab";</code> e uma variável <code className="text-emerald-400">let nivel = 1;</code>, e imprima ambas usando o <code className="text-emerald-400">console.log()</code>.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono px-1">
                  <span>Editor de Código JS</span>
                  <span>Ambiente do Navegador</span>
                </div>
                <textarea
                  rows={4}
                  placeholder={'const escola = "Codelab";\nlet nivel = 1;\nconsole.log(escola, nivel);'}
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
                  <span>⚡</span> Executar Código e Testar Regras
                </button>
              </div>

              {consoleOutput && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 overflow-x-auto ${missionSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider flex items-center justify-between">
                    <span>Terminal de Saída</span>
                    <span>{missionSuccess ? 'Status: Sucesso [Regras Aplicadas]' : 'Status: Atenção Requerida'}</span>
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
              <h3 className="text-sm sm:text-base font-bold text-white">Quiz de Fixação • Aula 5</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Qual é a diferença fundamental entre declarar um dado com <code>const</code> em comparação com o <code>let</code>?
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
                  <span>O <code>const</code> cria um valor fixo que não pode ser reatribuído, enquanto o <code>let</code> permite atualizar o valor quando necessário.</span>
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
                  <span>O <code>const</code> serve apenas para números decimais, enquanto o <code>let</code> serve exclusivamente para textos.</span>
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
                  href="/dashboard/aula/6"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 text-center cursor-pointer"
                >
                  Próxima Aula (Aula 6) →
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}