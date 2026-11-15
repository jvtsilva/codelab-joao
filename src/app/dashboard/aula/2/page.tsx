'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Aula2Page() {
  const [userId, setUserId] = useState<string | null>(null)
  const [codeAnswer, setCodeAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    async function checkProgress() {
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
      } else {
        if (typeof window !== 'undefined' && localStorage.getItem('codelab_visitante_aula_2')) {
          setCompleted(true)
        }
      }
    }
    checkProgress()
  }, [])

  const handleTestCode = async () => {
    const cleanCode = codeAnswer.trim().replace(/\s+/g, ' ')
    const expectedPattern = /const\s+cidadeNatal\s*=\s*(["'])(?:(?!\1).)*\1\s*;?/i

    if (!cleanCode) {
      setFeedback('❌ Escreva seu código no campo acima antes de testar.')
      setSuccess(false)
      return
    }

    if (expectedPattern.test(cleanCode) || cleanCode.includes('cidadeNatal')) {
      setSuccess(true)
      setFeedback('🎉 Perfeito! Código correto. Você criou a variável com sucesso!')
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
    } else {
      setSuccess(false)
      setFeedback('❌ Incorreto. Lembre-se de usar a palavra-chave `const` e a variável `cidadeNatal`.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-gray-950 animate-fadeIn">
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg border border-emerald-500/30">JS</span>
          <h1 className="font-bold text-sm tracking-wide">Codelab <span className="text-emerald-400 font-normal">João</span></h1>
        </div>
        <Link href="/dashboard" className="text-xs font-semibold text-gray-300 hover:text-white transition px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-1.5 cursor-pointer">
          ← Voltar ao Painel
        </Link>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <div className="space-y-2">
          <span className="inline-block px-3.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs rounded-full">
            MÓDULO 1 • AULA 2 ⚡
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Variáveis e Atribuição: As Caixas de Memória
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Aprenda a armazenar dados na memória do computador usando constantes e variáveis.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed shadow-xl">
          <h3 className="text-base font-bold text-white">O que é uma Variável?</h3>
          <p>
            Imagine uma variável como uma <strong className="text-emerald-400">caixa de papelão onde você guarda um valor</strong> para usar depois. No JavaScript, usamos a palavra <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">const</code> para criar uma caixa cujo valor não vai mudar.
          </p>
          <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl font-mono text-xs text-emerald-400">
            const idade = 25;<br/>
            const nome = &quot;João&quot;;
          </div>
        </div>

        {/* Missão Prática */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white">🎯 Missão Prática</h3>
          <p className="text-xs sm:text-sm text-gray-300">
            Escreva um código em JavaScript declarando uma constante chamada <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">cidadeNatal</code> com o valor <code className="text-emerald-400 bg-gray-950 px-1.5 py-0.5 rounded">&quot;São Paulo&quot;</code>.
          </p>

          <textarea
            rows={3}
            placeholder='const cidadeNatal = "São Paulo";'
            value={codeAnswer}
            onChange={(e) => setCodeAnswer(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 p-4 rounded-xl text-xs sm:text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 transition"
          />

          <button
            onClick={handleTestCode}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
          >
            🚀 Testar e Concluir Aula
          </button>

          {feedback && (
            <div className={`p-4 rounded-xl border font-mono text-xs space-y-1 ${success ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Resultado:</div>
              <p>{feedback}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-2">
          <Link href="/dashboard/aula/1" className="text-xs font-bold text-gray-400 hover:underline">
            ← Voltar para a Aula 1
          </Link>
          <Link href="/dashboard" className="text-xs font-bold text-emerald-400 hover:underline">
            Voltar ao Painel Geral →
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-800/80 px-4 py-6 text-center text-xs text-gray-500 max-w-5xl mx-auto w-full">
        <p>Codelab João • Plataforma educacional voltada para o aprendizado prático</p>
      </footer>
    </div>
  )
}