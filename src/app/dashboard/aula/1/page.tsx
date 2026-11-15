'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Aula1Page() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkProgress() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setUserId(session.user.id)
        const { data } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', session.user.id)
          .eq('lesson_id', 'lesson-1')
          .single()

        if (data && data.completed) setCompleted(true)
      } else {
        if (typeof window !== 'undefined' && localStorage.getItem('codelab_visitante_aula_1')) {
          setCompleted(true)
        }
      }
      setLoading(false)
    }
    checkProgress()
  }, [])

  const handleCompleteLesson = async () => {
    setCompleted(true)
    if (!userId) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('codelab_visitante_aula_1', 'true')
      }
      return
    }

    try {
      await supabase.from('user_progress').upsert({
        user_id: userId,
        lesson_id: 'lesson-1',
        completed: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' })
    } catch (error) {
      console.error('Erro ao salvar progresso:', error)
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
            MÓDULO 1 • AULA 1 🚀
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            O que é Programação e Como o Computador Pensa?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Descubra do absoluto zero o que significa programar e qual o papel do JavaScript na internet.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed shadow-xl">
          <h3 className="text-base font-bold text-white">1. Afinal, o que é programar?</h3>
          <p>
            Programar é simplesmente <strong className="text-emerald-400">dar instruções passo a passo para o computador executar tarefas</strong> e resolver problemas. 
          </p>
          <p>
            Assim como uma receita de bolo, se você alterar a ordem dos ingredientes ou esquecer um passo, o resultado final sai errado. O computador executa exatamente o que você mandar, na ordem exata.
          </p>

          <h3 className="text-base font-bold text-white pt-2">2. O papel do JavaScript</h3>
          <p>
            O <strong>JavaScript</strong> é a linguagem responsável por dar vida e inteligência às páginas web. Enquanto o HTML cria a estrutura e o CSS a aparência, o JavaScript faz os cálculos, valida formulários, anima elementos e interage com o usuário.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900/60 border border-gray-800 p-5 rounded-2xl">
          <div>
            <h4 className="font-bold text-sm text-white">Finalizou a leitura?</h4>
            <p className="text-xs text-gray-400">Marque como concluída para avançar para a Aula 2.</p>
          </div>
          <button
            onClick={handleCompleteLesson}
            className={`w-full sm:w-auto px-6 py-3 font-extrabold text-xs rounded-xl transition shadow-lg cursor-pointer ${
              completed ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-emerald-500 hover:bg-emerald-400 text-gray-950 shadow-emerald-500/20'
            }`}
          >
            {completed ? 'Aula Concluída ✓' : 'Marcar Aula como Concluída ⚡'}
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <Link href="/dashboard/aula/2" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
            Ir para a Aula 2: Variáveis e Atribuição →
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-800/80 px-4 py-6 text-center text-xs text-gray-500 max-w-5xl mx-auto w-full">
        <p>Codelab João • Plataforma educacional voltada para o aprendizado prático</p>
      </footer>
    </div>
  )
}