'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AulaUmPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'teoria' | 'pratica' | 'quiz'>('teoria')

  // Estados interativos da Missão Prática
  const [variableName, setVariableName] = useState('')
  const [variableValue, setVariableValue] = useState('')
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

        // Buscar progresso salvo no Supabase se houver sessão
        const { data } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', currentUserId)
          .eq('lesson_id', 'lesson-1')
          .single()

        if (data && data.completed) {
          setCompleted(true)
        }
      }
    }
    checkUserAndProgress()
  }, [])

  const handleRunCode = () => {
    const nameClean = variableName.trim()
    const valClean = variableValue.trim()

    if (!nameClean || !valClean) {
      setConsoleOutput('❌ Erro: Preencha o nome da variável e o valor antes de executar.')
      setMissionSuccess(false)
      return
    }

    if (nameClean.includes(' ') || !isNaN(Number(nameClean[0]))) {
      setConsoleOutput('❌ Erro de Sintaxe: O nome da variável não pode conter espaços ou começar com números.')
      setMissionSuccess(false)
      return
    }

    setConsoleOutput(`> const ${nameClean} = ${valClean};\n> console.log(${nameClean});\n-> ${valClean}`)
    setMissionSuccess(true)
  }

  const handleCompleteLesson = async () => {
    setCompleted(true)

    if (userId) {
      // Salvar progresso no Supabase se estiver logado
      await supabase.from('user_progress').upsert({
        user_id: userId,
        lesson_id: 'lesson-1',
        completed: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' })
    }
  }

  const handleQuizSubmit = (option: string) => {
    setQuizAnswer(option)
    if (option === 'const') {
      setQuizSuccess(true)
      setQuizFeedback('🎉 Resposta Correta! A palavra-chave `const` cria uma caixa lacrada que não pode ter o valor alterado depois.')
      handleCompleteLesson()
    } else {
      setQuizSuccess(false)
      setQuizFeedback('❌ Incorreto. Lembre-se: queremos uma caixa que NÃO mude de valor (constante). Tente novamente!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-emerald-500 selection:text-gray-950 overflow-x-hidden">
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/dashboard" className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-md">
            JS
          </Link>
          <h1 className="font-bold text-base sm:text-lg tracking-wide truncate">
            Módulo 1 <span className="text-emerald-400 font-normal text-xs sm:text-sm">• Aula 1</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/dashboard"
            className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800 shrink-0"
          >
            ← Voltar para Trilha
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 pb-24">

        {!userId && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-emerald-300">Modo Visitante Ativo: você pode estudar e testar os códigos livremente, mas faça login para salvar seu progresso oficial.</span>
            <Link href="/login" className="px-3.5 py-1.5 bg-emerald-500 text-gray-950 font-bold rounded-lg shrink-0">
              Fazer Login
            </Link>
          </div>
        )}

        {/* Título da Aula */}
        <div className="space-y-2 bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 p-5 sm:p-6 rounded-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-emerald-500 text-gray-950 font-bold text-xs rounded-md">
              MÓDULO 1 • AULA 1
            </span>
            {completed && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-md border border-emerald-500/30">
                Concluída ✓
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Variáveis e Atribuição: As Caixas de Memória
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Compreenda como o computador armazena informações na memória utilizando caixas rotuladas com <code className="text-emerald-400 bg-gray-900 px-1.5 py-0.5 rounded">const</code>.
          </p>
        </div>

        {/* Abas de Navegação da Aula */}
        <div className="flex border-b border-gray-800 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('teoria')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'teoria' 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            📖 1. Teoria Visual
          </button>
          <button
            onClick={() => setActiveTab('pratica')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pratica' 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            💻 2. Missão Prática
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'quiz' 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            ❓ 3. Quiz Final
          </button>
        </div>

        {/* Conteúdo da Aba 1: Teoria */}
        {activeTab === 'teoria' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 text-gray-300 text-xs sm:text-sm leading-relaxed">
              <h3 className="text-base font-bold text-white">O que é uma Variável?</h3>
              <p>
                Imagine que você tem uma estante cheia de caixas organizadoras. Para não esquecer o que tem dentro de cada caixa, você coloca uma etiqueta com um nome. Na programação, <strong>variável</strong> é exatamente isso: uma caixa na memória do computador com um rótulo para guardar dados.
              </p>
              
              <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl font-mono text-xs text-emerald-300 space-y-1">
                <span className="text-gray-500">// Exemplo prático de criação de variável:</span>
                <p>const nomeDoAluno = "João";</p>
                <p>const pontuacaoMaxima = 150;</p>
              </div>

              <p>
                Utilizamos a palavra-chave <code className="text-emerald-400">const</code> para declarar uma constante (uma caixa cujos dados não serão alterados posteriormente no código).
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('pratica')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Avançar para a Missão Prática →
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba 2: Prática */}
        {activeTab === 'pratica' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Laboratório de Código Interativo</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Crie sua primeira variável escrevendo o nome da etiqueta e o valor correspondente abaixo:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-medium">Nome da Variável (Etiqueta):</label>
                  <input
                    type="text"
                    placeholder="ex: idade"
                    value={variableName}
                    onChange={(e) => setVariableName(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-medium">Valor Armazenado:</label>
                  <input
                    type="text"
                    placeholder='ex: 20 ou "Texto"'
                    value={variableValue}
                    onChange={(e) => setVariableValue(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRunCode}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  ⚡ Executar Código
                </button>
              </div>

              {consoleOutput && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1 ${missionSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider">Console do Navegador:</div>
                  <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setActiveTab('teoria')}
                className="text-xs text-gray-400 hover:text-white transition"
              >
                ← Voltar para Teoria
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Avançar para o Quiz Final →
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba 3: Quiz Final */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Quiz de Fixação</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Qual palavra-chave devemos utilizar em JavaScript para declarar uma constante (uma variável cujo valor não pode ser alterado)?
              </p>

              <div className="grid gap-3 pt-2">
                <button
                  onClick={() => handleQuizSubmit('let')}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                    quizAnswer === 'let' 
                      ? (quizSuccess ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300')
                      : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  A) <code>let</code>
                </button>
                <button
                  onClick={() => handleQuizSubmit('const')}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                    quizAnswer === 'const' 
                      ? (quizSuccess ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300')
                      : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  B) <code>const</code>
                </button>
                <button
                  onClick={() => handleQuizSubmit('variable')}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                    quizAnswer === 'variable' 
                      ? (quizSuccess ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300')
                      : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  C) <code>variable</code>
                </button>
              </div>

              {quizFeedback && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1 ${quizSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider">Resultado da Avaliação:</div>
                  <p>{quizFeedback}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setActiveTab('pratica')}
                className="text-xs text-gray-400 hover:text-white transition"
              >
                ← Voltar para Prática
              </button>

              <Link
                href="/dashboard"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20"
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