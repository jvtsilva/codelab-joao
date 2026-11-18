'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { LESSONS_DATABASE } from '@/data/lessonsData'

export default function AulaMinimalistaPage() {
  const params = useParams()
  const router = useRouter()
  const aulaNum = Number(params?.id || 1)

  const currentLesson = LESSONS_DATABASE[aulaNum] || {
    number: aulaNum,
    title: `Aula ${aulaNum}: Trilha Prática`,
    module: "Módulo 1: Fundamentos",
    description: "Estude os conceitos fundamentais e valide seus conhecimentos resolvendo o desafio direto no editor.",
    estimatedTime: "20 min",
    difficulty: "Prático",
    topics: [
      { title: "1. Introdução ao Conceito", desc: "Compreendendo a lógica essencial desta etapa.", codeSnippet: "console.log('Executando...');" }
    ],
    challenge: {
      instruction: "Escreva um comando console.log com qualquer mensagem.",
      initialCode: "// Digite seu código aqui:\n",
      expectedKeywords: ["console.log"],
      successMessage: "Desafio superado com sucesso!",
      hint: "Use console.log(\"sua mensagem\");"
    }
  }

  const [userId, setUserId] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [codigoUsuario, setCodigoUsuario] = useState(currentLesson.challenge.initialCode)
  const [feedbackTerminal, setFeedbackTerminal] = useState<string | null>(null)
  const [sucessoDesafio, setSucessoDesafio] = useState(false)

  useEffect(() => {
    setCodigoUsuario(currentLesson.challenge.initialCode)
    setFeedbackTerminal(null)
    setSucessoDesafio(false)
  }, [aulaNum, currentLesson])

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        const { data } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', session.user.id)
          .eq('lesson_id', `lesson-${aulaNum}`)
          .single()

        if (data?.completed) {
          setIsCompleted(true)
          setSucessoDesafio(true)
        }
      } else if (typeof window !== 'undefined') {
        if (localStorage.getItem(`codelab_aula_${aulaNum}_concluida`)) {
          setIsCompleted(true)
          setSucessoDesafio(true)
        }
      }
    }
    checkAuth()
  }, [aulaNum])

  const handleTestarCodigo = async () => {
    const codigoLimpo = codigoUsuario.trim()
    const palavrasChave = currentLesson.challenge.expectedKeywords

    // Valida se o usuário incluiu as palavras-chave obrigatórias da lógica
    const passouEmTudo = palavrasChave.every(keyword => 
      codigoLimpo.toLowerCase().includes(keyword.toLowerCase())
    )

    if (passouEmTudo) {
      setSucessoDesafio(true)
      setIsCompleted(true)
      setFeedbackTerminal(`✓ ${currentLesson.challenge.successMessage}`)

      if (typeof window !== 'undefined') {
        localStorage.setItem(`codelab_aula_${aulaNum}_concluida`, 'true')
      }

      if (userId) {
        await supabase.from('user_progress').upsert(
          {
            user_id: userId,
            lesson_id: `lesson-${aulaNum}`,
            completed: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' }
        )
      }
    } else {
      setFeedbackTerminal(`✗ Falha na validação: O código precisa conter as instruções corretas. Dica: ${currentLesson.challenge.hint}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 flex flex-col font-sans selection:bg-gray-700 selection:text-white pb-24">
      
      {/* Header Minimalista e Discreto */}
      <header className="border-b border-gray-800/60 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <Link href="/dashboard" className="text-xs font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
          <span>←</span> Voltar
        </Link>
        <div className="text-xs font-mono text-gray-400 tracking-wider">
          AULA <span className="text-white font-bold">{aulaNum}</span> / 14
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-3xl w-full mx-auto p-4 sm:p-8 space-y-8 mt-2">
        
        {/* Bloco de Título Minimalista */}
        <div className="space-y-3">
          <div className="inline-block text-[10px] font-mono tracking-widest text-gray-400 uppercase bg-gray-900 border border-gray-800 px-3 py-1 rounded-md">
            {currentLesson.module}
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug">
            {currentLesson.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            {currentLesson.description}
          </p>
        </div>

        {/* Teoria Raciocinada */}
        <div className="space-y-6 pt-2">
          <h2 className="text-xs font-mono tracking-widest text-gray-400 uppercase border-b border-gray-800/80 pb-2">
            01. Fundamentos Teóricos
          </h2>

          <div className="space-y-4">
            {currentLesson.topics.map((topico, idx) => (
              <div key={idx} className="bg-gray-900/40 border border-gray-800/60 p-5 rounded-xl space-y-3">
                <h3 className="text-sm sm:text-base font-medium text-white">{topico.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{topico.desc}</p>
                {topico.codeSnippet && (
                  <pre className="bg-[#050507] border border-gray-800 p-3.5 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                    <code>{topico.codeSnippet}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor de Código Ativo (Substitui o Quiz) */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xs font-mono tracking-widest text-gray-400 uppercase border-b border-gray-800/80 pb-2">
            02. Desafio Prático de Código
          </h2>

          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              🎯 <strong className="text-white">Missão:</strong> {currentLesson.challenge.instruction}
            </p>

            {/* Caixa do Editor */}
            <div className="rounded-lg border border-gray-800 overflow-hidden bg-[#050507]">
              <div className="bg-gray-900/80 px-4 py-2 border-b border-gray-800 flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>editor.js</span>
                <span className="text-emerald-400">JavaScript Ativo</span>
              </div>
              <textarea
                value={codigoUsuario}
                onChange={(e) => setCodigoUsuario(e.target.value)}
                disabled={sucessoDesafio}
                rows={5}
                className="w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-gray-200 resize-none focus:outline-none leading-relaxed placeholder:text-gray-600"
                placeholder="Escreva seu código aqui..."
              />
            </div>

            {/* Ações e Botão */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              {!sucessoDesafio ? (
                <button
                  onClick={handleTestarCodigo}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-white text-gray-950 font-medium text-xs rounded-lg transition-all cursor-pointer"
                >
                  Executar & Validar Código →
                </button>
              ) : (
                <div className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <span>✓</span> Desafio validado e concluído com sucesso.
                </div>
              )}

              {sucessoDesafio && aulaNum < 14 && (
                <Link
                  href={`/dashboard/aula/${aulaNum + 1}`}
                  className="w-full sm:w-auto text-center px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold text-xs rounded-lg transition-all"
                >
                  Avançar para Aula {aulaNum + 1} →
                </Link>
              )}
            </div>

            {/* Terminal de Feedback Minimalista */}
            {feedbackTerminal && (
              <div className={`p-3.5 rounded-lg border font-mono text-xs ${
                sucessoDesafio 
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' 
                  : 'bg-red-950/20 border-red-800/40 text-red-300'
              }`}>
                {feedbackTerminal}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}