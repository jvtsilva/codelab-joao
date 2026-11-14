'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { JAVASCRIPT_MODULES } from '@/data/courses'
import { supabase } from '@/lib/supabase'

interface ExamPageProps {
  params: Promise<{ id: string }>
}

export default function ExamPage({ params }: ExamPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const moduleId = resolvedParams.id

  const moduleData = JAVASCRIPT_MODULES.find(m => m.id === moduleId) || JAVASCRIPT_MODULES[0]
  
  // Questões da prova baseadas no módulo
  const examQuestions = moduleData.lessons.map((lesson, index) => ({
    id: `q_${index}`,
    question: `Com base no tópico "${lesson.title}", qual é o principal conceito aplicado?`,
    options: [
      `Compreensão correta e prática de ${lesson.title.toLowerCase()}`,
      `Uso incorreto de sintaxe obsoleta`,
      `Declaração vazia sem retorno`,
      `Erro de execução no interpretador`
    ],
    correctAnswer: 0,
    explanation: `O domínio de ${lesson.title} é essencial para avançar na programação em JavaScript de forma limpa e segura.`
  }))

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [scoreErrors, setScoreErrors] = useState(0)
  const [examFinished, setExamFinished] = useState(false)

  const currentQ = examQuestions[currentQuestionIdx]

  const handleCheckAnswer = () => {
    if (selectedOption === null) return
    const correct = selectedOption === currentQ.correctAnswer
    setIsCorrect(correct)
    setIsAnswered(true)

    if (!correct) {
      setScoreErrors(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIdx < examQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
      setIsCorrect(false)
    } else {
      finishExam()
    }
  }

  const finishExam = async () => {
    setExamFinished(true)
    const finalStatus = scoreErrors > 0 ? 'reviewing' : 'completed'

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      // Pega o ID real do módulo de forma limpa, evitando qualquer undefined
      const cleanModuleId = moduleId || moduleData?.id || 'fundamentos'
      const exactExamId = `exam_${cleanModuleId}`

      // Salva apenas o registro exato e limpo no Supabase
      await supabase
        .from('user_progress')
        .upsert(
          { 
            user_id: session.user.id, 
            lesson_id: exactExamId, 
            status: finalStatus,
            completed_at: new Date().toISOString()
          },
          { onConflict: 'user_id, lesson_id' }
        )
    }
  }

  if (examFinished) {
    const passed = scoreErrors === 0
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 space-y-6 text-center w-full overflow-x-hidden box-border">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl">
          {passed ? '🏆' : '💡'}
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-black text-white">
            {passed ? 'Prova Concluída com Sucesso!' : 'Prova Finalizada com Ressalvas'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {passed 
              ? 'Parabéns! Você demonstrou domínio total dos conceitos deste módulo.' 
              : 'Você concluiu a avaliação, mas houve alguns erros. Revise os pontos marcados para fixar o conteúdo!'}
          </p>
        </div>
        <a 
          href="/"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer text-sm shadow-lg shadow-emerald-500/10 no-underline inline-block"
        >
          Voltar para a Trilha →
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans w-full overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Barra de Progresso Superior */}
      <div className="w-full bg-slate-900 h-1.5">
        <div 
          className="h-full bg-emerald-400 transition-all duration-300" 
          style={{ width: `${((currentQuestionIdx + 1) / examQuestions.length) * 100}%` }}
        />
      </div>

      {/* Header Responsivo e Limpo */}
      <header className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-3.5 w-full box-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 w-full">
          <a 
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 shrink-0 no-underline"
          >
            ← Voltar
          </a>
          
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400 truncate max-w-[160px] sm:max-w-[240px] text-center">
            Prova: {moduleData.title}
          </span>

          <span className="text-[11px] text-slate-500 font-mono shrink-0">
            {currentQuestionIdx + 1} de {examQuestions.length}
          </span>
        </div>
      </header>

      {/* Conteúdo da Prova */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3 sm:px-6 py-6 space-y-6 box-border overflow-x-hidden">
        
        <div className="space-y-5 w-full">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block">
              ⚠️ Avaliação Oficial
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words leading-snug">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-2.5 w-full">
            {currentQ.options.map((option, index) => {
              let optionStyle = "border-slate-900 bg-slate-900/40 hover:border-slate-800 text-slate-300 cursor-pointer"
              
              if (selectedOption === index) {
                optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-300"
              }

              if (isAnswered) {
                if (index === currentQ.correctAnswer) {
                  optionStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-200"
                } else if (selectedOption === index && !isCorrect) {
                  optionStyle = "border-rose-500 bg-rose-950/40 text-rose-200"
                }
              }

              return (
                <button
                  key={index}
                  disabled={isAnswered}
                  onClick={() => setSelectedOption(index)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border font-medium transition-all text-xs sm:text-sm box-border break-words ${optionStyle}`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {isAnswered && (
            <div className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 w-full box-border ${isCorrect ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-amber-950/30 border-amber-800/40 text-amber-300'}`}>
              <p className="font-bold">
                {isCorrect ? '✨ Resposta Correta!' : '💡 Resposta Incorreta.'}
              </p>
              <p className="opacity-90 leading-relaxed break-words"><strong className="text-white">Explicação:</strong> {currentQ.explanation}</p>
            </div>
          )}

          <div className="pt-2 w-full">
            {!isAnswered ? (
              <button
                disabled={selectedOption === null}
                onClick={handleCheckAnswer}
                className={`w-full py-3.5 rounded-xl font-bold transition-all text-xs sm:text-sm ${
                  selectedOption !== null 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-lg shadow-emerald-500/10' 
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                }`}
              >
                Confirmar Resposta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-colors cursor-pointer text-xs sm:text-sm shadow-lg shadow-emerald-500/10"
              >
                {currentQuestionIdx < examQuestions.length - 1 ? 'Próxima Questão →' : 'Finalizar Prova →'}
              </button>
            )}
          </div>

        </div>

      </main>

    </div>
  )
}