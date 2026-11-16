'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AulaUmPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'teoria' | 'pratica' | 'quiz'>('teoria')
  const [menuOpen, setMenuOpen] = useState(false)

  // Estados da missão lógica interativa (Ordenação do algoritmo do café)
  const [steps, setSteps] = useState([
    { id: 1, text: '2. Ferver a água no fogão' },
    { id: 2, text: '3. Passar a água quente pelo coador com pó' },
    { id: 3, text: '1. Colocar o pó de café no coador' },
    { id: 4, text: '4. Servir a xícara de café quente' }
  ])
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

      if (!userId && typeof window !== 'undefined') {
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

  // Função para mover os passos do mini-game de lógica
  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newSteps.length) return

    const temp = newSteps[index]
    newSteps[index] = newSteps[targetIndex]
    newSteps[targetIndex] = temp

    setSteps(newSteps)
    setMissionOutput(null)
  }

  // Validação da ordem correta do algoritmo (IDs esperados: 3, 1, 2, 4)
  const handleValidateAlgorithm = () => {
    const currentOrder = steps.map(s => s.id)
    const expectedOrder = [3, 1, 2, 4]

    const isCorrect = currentOrder.every((val, idx) => val === expectedOrder[idx])

    if (isCorrect) {
      setMissionOutput('✨ Perfeito! Sequência lógica executada com sucesso. O café foi passado na ordem correta!')
      setMissionSuccess(true)
      handleCompleteLesson()
    } else {
      setMissionOutput('❌ Ops! A ordem dos passos está invertida. Pense: o que vem primeiro antes de ferver a água? Tente reorganizar!')
      setMissionSuccess(false)
    }
  }

  // Quiz Final com explicação pedagógica
  const handleQuizSubmit = (option: string) => {
    setSelectedQuizOption(option)
    if (option === 'b') {
      setQuizSuccess(true)
      setQuizFeedback('✨ Resposta Correta! A programação consiste em traduzir ideias e resolver problemas estruturando instruções lógicas em sequências ordenadas que a máquina executa com precisão.')
      handleCompleteLesson()
    } else {
      setQuizSuccess(false)
      setQuizFeedback('💡 Incorreto. Lembre-se de que o computador não possui intuição ou livre-arbítrio; ele depende estritamente da ordem lógica dos comandos que você fornece. Tente outra alternativa!')
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

        <div className="space-y-2.5 bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 p-5 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-emerald-500 text-gray-950 font-extrabold text-[11px] sm:text-xs rounded-md">
              MÓDULO 1 • AULA 1
            </span>
            {completed && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] sm:text-xs rounded-md border border-emerald-500/30">
                Aula Concluída ✓
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            O Que É Programação de Verdade? (Desmistificando a Lógica)
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Esqueça qualquer mito sobre matemática avançada. Vamos entender o que é um computador por dentro, a diferença entre corpo e alma (Hardware e Software) e como funciona o pensamento lógico.
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

        {/* ABA 1: TEORIA VISUAL PROFUNDA */}
        {activeTab === 'teoria' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-6 text-gray-300 text-xs sm:text-sm leading-relaxed shadow-xl">
              
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>🧠</span> 1. Quebrando o Mito da Matemática
                </h3>
                <p>
                  Existe um mito gigantesco de que para programar você precisa ser um gênio da matemática ou resolver equações complexas o dia todo. A verdade nua e crua é bem diferente: <strong className="text-emerald-400">programar tem muito mais a ver com criatividade e organização de ideias do que com contas mirabolantes</strong>.
                </p>
                <p>
                  Na essência, programar é a arte de pegar um problema grande do mundo real (ex: calcular frete, organizar uma lista de tarefas, mover um personagem na tela) e dividi-lo em pedaços tão pequenos e simples que uma máquina consegue executar.
                </p>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-5">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>🖥️</span> 2. Hardware vs Software (O Corpo e a Alma)
                </h3>
                <p>
                  Para entender a computação, pense nela como um ser humano:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
                  <li><strong className="text-white">Hardware:</strong> É o corpo físico (o processador, a placa-mãe, a memória RAM, o monitor, o teclado). Sozinho, o hardware é apenas um pedaço de metal e silício morto.</li>
                  <li><strong className="text-white">Software:</strong> É a alma, o conjunto de instruções lógicas que dão vida ao hardware. O software diz ao processador o que fazer quando você clica em um botão.</li>
                </ul>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-5">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>🤖</span> 3. A Máquina sem Intuição
                </h3>
                <p>
                  O computador é a ferramenta mais rápida e poderosa já inventada pela humanidade, mas ele possui uma característica imutável: <strong className="text-emerald-400">ele tem zero intuição</strong>. 
                </p>
                <p>
                  Se você pedir para um amigo "traga um copo d'água", ele entende o contexto mesmo se você esquecer de detalhar. Se você der essa mesma ordem vaga para um robô sem instruções atômicas, ele trava ou bate na parede. O computador faz <em>exatamente</em> o que você manda, na ordem exata em que você manda — nem mais, nem menos.
                </p>
              </div>

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

        {/* ABA 2: MISSÃO LÓGICA INTERATIVA */}
        {activeTab === 'pratica' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-sm sm:text-base font-bold text-white">🎯 Missão Lógica: Montando o Algoritmo do Café</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Como vimos, o computador depende estritamente da ordem dos passos. Utilize os botões <span className="text-emerald-400 font-bold">↑</span> e <span className="text-emerald-400 font-bold">↓</span> para organizar as instruções na <strong>ordem lógica correta</strong> de execução para o robô passar o café:
              </p>

              {/* Lista interativa de passos */}
              <div className="space-y-2 pt-1">
                {steps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className="flex items-center justify-between p-3.5 bg-gray-950 border border-gray-800 rounded-xl text-xs sm:text-sm font-mono text-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-gray-800 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </span>
                      <span>{step.text}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => moveStep(index, 'up')}
                        disabled={index === 0}
                        className="px-2.5 py-1.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-30 text-gray-300 rounded-lg text-xs font-bold cursor-pointer transition"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveStep(index, 'down')}
                        disabled={index === steps.length - 1}
                        className="px-2.5 py-1.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-30 text-gray-300 rounded-lg text-xs font-bold cursor-pointer transition"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleValidateAlgorithm}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>⚡</span> Testar Sequência no Robô
                </button>
              </div>

              {missionOutput && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 overflow-x-auto ${missionSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider flex items-center justify-between">
                    <span>Terminal de Execução</span>
                    <span>{missionSuccess ? 'Status: Sucesso [Algoritmo Válido]' : 'Status: Erro na Ordem'}</span>
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
              <h3 className="text-sm sm:text-base font-bold text-white">Quiz de Fixação • Aula 1</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Considerando como o hardware e o software se relacionam e a total falta de intuição das máquinas, qual das alternativas abaixo define com exatidão o que é a programação?
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
                  <span>Um processo intuitivo onde o computador descobre sozinho o que você quer fazer através dos seus sentimentos.</span>
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
                  <span>A criação de sequências de instruções lógicas ordenadas passo a passo para que o hardware execute tarefas e resolva problemas.</span>
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