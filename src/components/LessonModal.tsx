'use client'

import { useState } from 'react'
import { LessonData } from '@/data/courses'

interface LessonViewProps {
  lesson: LessonData
  onClose: () => void
  onComplete: (status: 'completed' | 'reviewing') => void
}

export default function LessonView({ lesson, onClose, onComplete }: LessonViewProps) {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [userCode, setUserCode] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const challenge = lesson.challenges[currentChallengeIndex]
  const totalChallenges = lesson.challenges.length

  const handleCheckAnswer = () => {
    let correct = false

    if (challenge.type === 'multiple-choice') {
      if (selectedOption === null) return
      correct = selectedOption === challenge.correctAnswer
    } else if (challenge.type === 'code') {
      if (!userCode.trim()) return
      const cleanUserCode = userCode.replace(/\s+/g, '').toLowerCase()
      const expected = (challenge.expectedSnippet || '').replace(/\s+/g, '').toLowerCase()
      correct = cleanUserCode.includes(expected)
    }

    setIsCorrect(correct)
    setIsAnswered(true)

    if (!correct) {
      setHasErrors(true)
    }
  }

  const handleNextChallenge = () => {
    if (currentChallengeIndex < totalChallenges - 1) {
      setCurrentChallengeIndex(prev => prev + 1)
      setSelectedOption(null)
      setUserCode('')
      setIsAnswered(false)
      setIsCorrect(false)
    } else {
      setIsFinished(true)
    }
  }

  const handleFinishLesson = () => {
    const finalStatus = hasErrors ? 'reviewing' : 'completed'
    onComplete(finalStatus)
  }

  // TELA DE CONCLUSÃO LIMPA
  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Tópico Concluído</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {hasErrors 
                ? 'Você completou o estudo! Como houve algumas dúvidas, deixamos marcado para revisão caso queira praticar novamente.' 
                : 'Parabéns! Você leu o material e concluiu todos os exercícios com sucesso.'}
            </p>
          </div>

          <button 
            onClick={handleFinishLesson}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all cursor-pointer text-xs sm:text-sm shadow-lg shadow-emerald-500/10"
          >
            Salvar e Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Minimalista */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              {lesson.title}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Corpo Unificado (Teoria em cima, Prática embaixo em fluxo limpo) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Seção de Teoria (Sem molduras pesadas, apenas texto fluido e código limpo) */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white tracking-tight">Guia de Estudo</h3>
            <div className="text-slate-300 text-sm leading-relaxed space-y-3">
              <p>
                Nesta lição, estude o conceito fundamental abaixo. Leia com atenção as explicações e use-as para responder ao desafio interativo logo em seguida.
              </p>
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-emerald-400 space-y-1">
                <div className="text-slate-500">// Exemplo conceitual:</div>
                <code>{`// Tópico: ${lesson.title}\nconsole.log("Conceito assimilado com sucesso!");`}</code>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80" />

          {/* Seção de Exercícios */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>{challenge.type === 'code' ? 'Desafio de Código' : 'Questão Prática'}</span>
              <span>{currentChallengeIndex + 1} de {totalChallenges}</span>
            </div>

            <h4 className="text-base font-semibold text-slate-200 leading-snug">
              {challenge.question}
            </h4>

            {/* Múltipla Escolha Limpa */}
            {challenge.type === 'multiple-choice' && challenge.options && (
              <div className="space-y-2">
                {challenge.options.map((option, index) => {
                  let optionStyle = "border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-300 cursor-pointer"
                  
                  if (selectedOption === index) {
                    optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  }

                  if (isAnswered) {
                    if (index === challenge.correctAnswer) {
                      optionStyle = "border-emerald-500 bg-emerald-950/30 text-emerald-200"
                    } else if (selectedOption === index && !isCorrect) {
                      optionStyle = "border-rose-500 bg-rose-950/30 text-rose-200"
                    }
                  }

                  return (
                    <button
                      key={index}
                      disabled={isAnswered}
                      onClick={() => setSelectedOption(index)}
                      className={`w-full text-left p-3.5 rounded-xl border font-normal transition-all text-sm ${optionStyle}`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Editor de Código Minimalista */}
            {challenge.type === 'code' && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-900 text-xs text-slate-500 font-mono">
                  <span>script.js</span>
                  <span>JavaScript</span>
                </div>
                <textarea
                  disabled={isAnswered}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="// Digite seu código JavaScript aqui..."
                  rows={4}
                  className="w-full bg-transparent text-emerald-400 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-600 leading-relaxed"
                  spellCheck={false}
                />
              </div>
            )}

            {/* Feedback Educativo Fluido */}
            {isAnswered && (
              <div className={`p-4 rounded-xl border text-sm ${isCorrect ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                <p className="font-semibold">{isCorrect ? '✨ Perfeito! Resposta correta.' : '💡 Entendendo o conceito:'}</p>
                <p className="text-xs sm:text-sm mt-1.5 opacity-90 leading-relaxed"><strong className="text-white">Explicação:</strong> {challenge.explanation}</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer com Botão de Ação */}
        <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-slate-900">
          {!isAnswered ? (
            <button
              disabled={challenge.type === 'multiple-choice' ? selectedOption === null : !userCode.trim()}
              onClick={handleCheckAnswer}
              className={`w-full py-3.5 rounded-xl font-bold transition-all text-xs sm:text-sm ${
                (challenge.type === 'multiple-choice' ? selectedOption !== null : userCode.trim())
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-800'
              }`}
            >
              Verificar Resposta
            </button>
          ) : (
            <button
              onClick={handleNextChallenge}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-colors cursor-pointer text-xs sm:text-sm shadow-lg shadow-emerald-500/10"
            >
              Próxima Questão →
            </button>
          )}
        </div>

      </div>
    </div>
  )
}