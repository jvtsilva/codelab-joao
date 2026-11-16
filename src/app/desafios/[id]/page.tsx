'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ARENA_CHALLENGES } from '@/data/challenges'

export default function DesafioIndividualPage() {
  const params = useParams()
  const slug = String(params?.id || '')
  
  const currentIndex = ARENA_CHALLENGES.findIndex((c) => c.slug === slug)
  const challenge = currentIndex !== -1 ? ARENA_CHALLENGES[currentIndex] : undefined
  const nextChallenge = currentIndex !== -1 && currentIndex + 1 < ARENA_CHALLENGES.length 
    ? ARENA_CHALLENGES[currentIndex + 1] 
    : undefined

  const [userId, setUserId] = useState<string | null>(null)
  const [userXp, setUserXp] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState(false)

  // Estados de resposta
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [codeAnswer, setCodeAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Limpa os campos caso o usuário navegue direto para o próximo desafio
  useEffect(() => {
    setSelectedOption(null)
    setCodeAnswer('')
    setFeedback(null)
    setIsSuccess(false)
    setIsCompleted(false)
  }, [slug])

  useEffect(() => {
    if (!challenge) return

    async function loadChallengeProgress() {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        const currentUserId = session.user.id
        setUserId(currentUserId)

        const { data: challenges } = await supabase
          .from('user_challenges')
          .select('challenge_id, completed, xp_earned')
          .eq('user_id', currentUserId)

        if (challenges) {
          const totalXp = challenges.reduce((acc, curr) => acc + (curr.xp_earned || 0), 0)
          setUserXp(totalXp)

          const current = challenges.find((c) => c.challenge_id === challenge!.id)
          if (current?.completed) setIsCompleted(true)
        }
      } else if (typeof window !== 'undefined') {
        const savedXp = localStorage.getItem('codelab_user_xp')
        if (savedXp) setUserXp(Number(savedXp))

        if (localStorage.getItem(`codelab_visitante_${challenge!.id}`)) {
          setIsCompleted(true)
        }
      }
    }

    loadChallengeProgress()
  }, [challenge])

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-lg font-bold text-amber-400">Desafio não encontrado.</p>
        <Link href="/desafios" className="px-5 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-xs font-semibold">
          ← Voltar para a Arena
        </Link>
      </div>
    )
  }

  const registerVictory = async () => {
    setIsSuccess(true)
    setFeedback(challenge.successMessage)

    if (!isCompleted) {
      setIsCompleted(true)
      const newXp = userXp + challenge.xp
      setUserXp(newXp)

      if (typeof window !== 'undefined') {
        localStorage.setItem('codelab_user_xp', String(newXp))
        if (!userId) {
          localStorage.setItem(`codelab_visitante_${challenge.id}`, 'true')
        }
      }

      if (userId) {
        await supabase.from('user_challenges').upsert(
          {
            user_id: userId,
            challenge_id: challenge.id,
            completed: true,
            xp_earned: challenge.xp,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,challenge_id' }
        )
      }
    }
  }

  const handleSubmit = async () => {
    if (challenge.type === 'quiz') {
      if (!selectedOption) {
        setIsSuccess(false)
        setFeedback('❌ Selecione uma alternativa antes de enviar.')
        return
      }
      if (selectedOption === challenge.correctOptionId) {
        await registerVictory()
      } else {
        setIsSuccess(false)
        setFeedback(challenge.errorMessage)
      }
    } else {
      const cleanCode = codeAnswer.trim().replace(/\s+/g, ' ')
      if (!cleanCode) {
        setIsSuccess(false)
        setFeedback('❌ Escreva seu código no campo acima antes de testar.')
        return
      }

      const matchesRegex = challenge.validationPattern ? challenge.validationPattern.test(cleanCode) : false
      const matchesKeyword = challenge.requiredKeyword ? cleanCode.includes(challenge.requiredKeyword) : false

      if (matchesRegex || matchesKeyword) {
        await registerVictory()
      } else {
        setIsSuccess(false)
        setFeedback(challenge.errorMessage)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-amber-500 selection:text-gray-950 overflow-x-hidden animate-fadeIn">
      
      {/* Header Responsivo */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-3.5 sm:px-6 py-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="px-2.5 py-1.5 bg-amber-500/20 text-amber-400 font-bold text-xs rounded-lg border border-amber-500/30 shrink-0">
            {challenge.number}
          </div>
          <h1 className="font-bold text-xs sm:text-sm tracking-wide truncate">
            Arena • {challenge.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[11px] sm:text-xs rounded-lg">
            ⭐ {userXp} XP
          </div>
          <Link
            href="/desafios"
            className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 font-semibold text-xs rounded-xl transition"
          >
            ← Arena
          </Link>
        </div>
      </header>

      {/* Conteúdo do Desafio */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-3.5 sm:p-6 md:p-8 space-y-5 pb-20">
        
        <div className="p-4 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-500 text-gray-950 font-extrabold text-[11px] rounded-md">
                {challenge.difficulty.toUpperCase()}
              </span>
              <span className="text-xs font-bold text-amber-400">+{challenge.xp} XP</span>
            </div>
            {isCompleted && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] sm:text-xs rounded-md border border-emerald-500/30">
                Desafio Concluído ✓
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
            {challenge.title}
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {challenge.prompt}
          </p>

          {/* Modo Quiz */}
          {challenge.type === 'quiz' && challenge.options && (
            <div className="space-y-2.5 pt-2 text-xs sm:text-sm">
              {challenge.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedOption === opt.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="arena-quiz"
                    value={opt.id}
                    checked={selectedOption === opt.id}
                    onChange={() => setSelectedOption(opt.id)}
                    className="mt-0.5 accent-amber-500 shrink-0"
                  />
                  <span className="leading-relaxed">{opt.text}</span>
                </label>
              ))}
            </div>
          )}

          {/* Modo Código */}
          {challenge.type === 'code' && (
            <div className="space-y-2 pt-2">
              <label className="text-xs text-gray-400 font-medium block">Editor de Código JS:</label>
              <textarea
                rows={4}
                placeholder={challenge.placeholder || 'Digite seu script aqui...'}
                value={codeAnswer}
                onChange={(e) => setCodeAnswer(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 p-4 rounded-xl text-xs sm:text-sm text-amber-400 font-mono focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer text-center"
            >
              🚀 Testar e Enviar Resposta
            </button>

            {isSuccess && nextChallenge && (
              <Link
                href={`/desafios/${nextChallenge.slug}`}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 text-center"
              >
                Próximo Desafio ({nextChallenge.number}) →
              </Link>
            )}
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-xl border font-mono text-xs space-y-1 ${
                isSuccess
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-950/40 border-red-500/30 text-red-400'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Resultado:</div>
              <p className="leading-relaxed">{feedback}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <Link
            href="/desafios"
            className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 font-semibold text-xs rounded-xl transition"
          >
            ← Ver Todos os Desafios
          </Link>
        </div>

      </main>
    </div>
  )
}