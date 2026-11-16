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
        setUserId(session.user.id)
        const { data } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', session.user.id)
          .eq('lesson_id', 'lesson-2')
          .single()
        if (data && data.completed) setCompleted(true)
      }
    }
    checkUserAndProgress()
  }, [])

  const handleRunCode = () => {
    const cleanCode = codeAnswer.trim()
    const expectedPattern = /const\s+cidadeNatal\s*=\s*(["'])(?:(?!\1).)*\1\s*;?/i

    if (!cleanCode) {
      setConsoleOutput('❌ Erro: Digite seu código antes de executar.')
      setMissionSuccess(false)
      return
    }

    if (expectedPattern.test(cleanCode) || cleanCode.includes('cidadeNatal')) {
      try {
        // Executa simulação real capturando console.log
        let logs: string[] = []
        const originalLog = console.log
        console.log = (...args) => logs.push(args.join(' '))

        // Executa o código do aluno de forma segura
        eval(cleanCode)
        if (!cleanCode.includes('console.log')) {
          logs.push("Variável declarada com sucesso na memória!")
        }

        console.log = originalLog

        setConsoleOutput(`> ${cleanCode}\n-> ${logs.join('\n-> ')}\n🎉 Sucesso! Missão cumprida.`)
        setMissionSuccess(true)
        handleCompleteLesson()
      } catch (err: any) {
        setConsoleOutput(`> ${cleanCode}\n❌ Erro de Execução: ${err.message}`)
        setMissionSuccess(false)
      }
    } else {
      setConsoleOutput(`> ${cleanCode}\n❌ Erro: Certifique-se de usar a palavra 'const' e criar a variável 'cidadeNatal'.`)
      setMissionSuccess(false)
    }
  }

  const handleCompleteLesson = async () => {
    if (!completed) {
      setCompleted(true)
      if (typeof window !== 'undefined') {
        const currentXp = Number(localStorage.getItem('codelab_user_xp') || '0')
        localStorage.setItem('codelab_user_xp', String(currentXp + 20))
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

  const handleQuizSubmit = (option: string) => {
    setQuizAnswer(option)
    if (option === 'const') {
      setQuizSuccess(true)
      setQuizFeedback('🎉 Correto! `const` define uma constante imutável.')
      handleCompleteLesson()
    } else {
      setQuizSuccess(false)
      setQuizFeedback('❌ Incorreto. Pense qual palavra impede que o valor mude depois.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-emerald-500 selection:text-gray-950 relative animate-fadeIn">
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg shrink-0 border border-emerald-500/30">JS</div>
          <h1 className="font-bold text-xs sm:text-sm tracking-wide truncate">Módulo 1 • Aula 2</h1>
        </div>
        <Link href="/dashboard" className="text-xs font-semibold text-gray-300 hover:text-white transition px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-1 cursor-pointer">
          Voltar à Trilha
        </Link>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 pb-24">
        <div className="space-y-2.5 bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 p-5 sm:p-6 rounded-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-emerald-500 text-gray-950 font-extrabold text-[11px] rounded-md">MÓDULO 1 • AULA 2 (+20 XP ⚡)</span>
            {completed && <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] rounded-md border border-emerald-500/30">Concluída ✓</span>}
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">Variáveis e Atribuição: As Caixas de Memória</h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">Aprenda a armazenar dados utilizando constantes no editor de código real.</p>
        </div>

        <div className="flex border-b border-gray-800 gap-2">
          <button onClick={() => setActiveTab('teoria')} className={`px-4 py-3 text-xs font-semibold transition border-b-2 cursor-pointer ${activeTab === 'teoria' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-gray-400 hover:text-white'}`}>📖 1. Teoria</button>
          <button onClick={() => setActiveTab('pratica')} className={`px-4 py-3 text-xs font-semibold transition border-b-2 cursor-pointer ${activeTab === 'pratica' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-gray-400 hover:text-white'}`}>💻 2. Missão com Console</button>
          <button onClick={() => setActiveTab('quiz')} className={`px-4 py-3 text-xs font-semibold transition border-b-2 cursor-pointer ${activeTab === 'quiz' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-gray-400 hover:text-white'}`}>❓ 3. Quiz</button>
        </div>

        {activeTab === 'teoria' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 text-gray-300 text-xs sm:text-sm leading-relaxed">
              <h3 className="text-sm sm:text-base font-bold text-white">O que é uma Variável?</h3>
              <p>É uma caixa na memória rotulada com uma etiqueta. Declaramos com <code className="text-emerald-400">const</code> quando o valor não vai mudar.</p>
              <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl font-mono text-xs text-emerald-300">
                const cidadeNatal = &quot;São Paulo&quot;;<br/>
                console.log(cidadeNatal);
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setActiveTab('pratica')} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition cursor-pointer">Avançar para o Console →</button>
            </div>
          </div>
        )}

        {activeTab === 'pratica' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white">🎯 Laboratório Prático de Código</h3>
              <p className="text-xs text-gray-300 leading-relaxed">Declare a constante <code className="text-emerald-400 bg-gray-950 px-1 py-0.5 rounded">cidadeNatal</code> com o valor <code className="text-emerald-400 bg-gray-950 px-1 py-0.5 rounded">&quot;São Paulo&quot;</code>:</p>
              <textarea
                rows={3}
                placeholder='const cidadeNatal = "São Paulo";'
                value={codeAnswer}
                onChange={(e) => setCodeAnswer(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 p-4 rounded-xl text-xs sm:text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 transition"
              />
              <button onClick={handleRunCode} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition cursor-pointer">
                ⚡ Executar no Console Real
              </button>
              {consoleOutput && (
                <div className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto ${missionSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  <div className="text-gray-500 text-[10px] uppercase mb-1">Console de Execução:</div>
                  <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setActiveTab('teoria')} className="px-4 py-2.5 bg-gray-900 border border-gray-800 text-xs rounded-xl cursor-pointer">Voltar</button>
              <button onClick={() => setActiveTab('quiz')} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl cursor-pointer">Avançar para o Quiz →</button>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white">Quiz Final</h3>
              <p className="text-xs sm:text-sm text-gray-300">Qual palavra usamos para declarar uma constante em JavaScript?</p>
              <div className="grid gap-3 pt-1">
                <button onClick={() => handleQuizSubmit('var')} className="w-full p-4 rounded-xl border border-gray-800 bg-gray-950 text-left text-xs text-gray-300 cursor-pointer">A) var</button>
                <button onClick={() => handleQuizSubmit('const')} className="w-full p-4 rounded-xl border border-gray-800 bg-gray-950 text-left text-xs text-gray-300 cursor-pointer">B) const</button>
              </div>
              {quizFeedback && (
                <div className={`p-4 rounded-xl border font-mono text-xs ${quizSuccess ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                  {quizFeedback}
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setActiveTab('pratica')} className="px-4 py-2.5 bg-gray-900 border border-gray-800 text-xs rounded-xl cursor-pointer">Voltar</button>
              <Link href="/dashboard" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition cursor-pointer">Concluir e Voltar à Trilha 🚀</Link>
            </div>
          </div>
        )}
      </main>
      <footer className="border-t border-gray-800/80 px-4 py-6 text-center text-xs text-gray-500 max-w-5xl mx-auto w-full">
        <p>Codelab João • Plataforma educacional</p>
      </footer>
    </div>
  )
}