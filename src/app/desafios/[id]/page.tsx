'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ARENA_CHALLENGES } from '@/data/challenges'
import { Navbar } from '@/components/Navbar'

const STORAGE_KEY = 'codelab_tema_aula'

export default function DesafioIndividualPage() {
  const params = useParams<{ slug?: string; id?: string }>()
  const rawSlug = params?.slug || params?.id || ''
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : String(rawSlug)

  const currentIndex = ARENA_CHALLENGES.findIndex((c) => c.slug === slug)
  const challenge = currentIndex !== -1 ? ARENA_CHALLENGES[currentIndex] : undefined
  const nextChallenge =
    currentIndex !== -1 && currentIndex + 1 < ARENA_CHALLENGES.length
      ? ARENA_CHALLENGES[currentIndex + 1]
      : undefined

  const [userId, setUserId] = useState<string | null>(null)
  const [userXp, setUserXp] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isDark, setIsDark] = useState(true)

  // Estados de resposta
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [codeAnswer, setCodeAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  useEffect(() => {
    setSelectedOption(null)
    setCodeAnswer('')
    setFeedback(null)
    setIsSuccess(false)
    setIsCompleted(false)
  }, [slug])

  useEffect(() => {
    if (!challenge) return
    let active = true

    async function loadChallengeProgress() {
      const currentChallenge = challenge!
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!active) return

      if (session) {
        const currentUserId = session.user.id
        setUserId(currentUserId)

        const { data: challenges } = await supabase
          .from('user_challenges')
          .select('challenge_id, completed, xp_earned')
          .eq('user_id', currentUserId)

        if (!active) return

        if (challenges) {
          const totalXp = challenges.reduce((acc, curr) => acc + (curr.xp_earned || 0), 0)
          setUserXp(totalXp)
          localStorage.setItem('codelab_user_xp', String(totalXp))

          const current = challenges.find((c) => c.challenge_id === currentChallenge.id)
          if (current?.completed) setIsCompleted(true)
        }
      } else if (typeof window !== 'undefined') {
        const savedXp = Number(localStorage.getItem('codelab_user_xp') || '0')
        setUserXp(Number.isNaN(savedXp) ? 0 : savedXp)

        if (localStorage.getItem(`codelab_visitante_${currentChallenge.id}`)) {
          setIsCompleted(true)
        }
      }
    }

    loadChallengeProgress()

    return () => {
      active = false
    }
  }, [challenge])

  const alternarTema = () => {
    setIsDark((atual) => {
      const proximo = !atual
      localStorage.setItem(STORAGE_KEY, proximo ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', proximo)
      document.documentElement.style.backgroundColor = proximo ? '#030712' : '#fafaf9'
      return proximo
    })
  }

  const btnClasses =
    'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800'

  const cardClasses =
    'bg-white border-stone-200 text-stone-900 shadow-lg dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:shadow-xl'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const textBodyClasses = 'text-stone-700 dark:text-gray-300'
  const accentAmberClasses = 'text-amber-700 dark:text-amber-400'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
        <Navbar
          activeTab="desafios"
          subtitle="Arena Codelab"
          userId={userId}
          userXp={userXp}
          isDark={isDark}
          onToggleTheme={alternarTema}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <p className={`text-lg font-bold ${accentAmberClasses}`}>Desafio não encontrado.</p>
          <Link href="/desafios" className={`px-5 py-2.5 border rounded-xl text-xs font-semibold ${btnClasses}`}>
            ← Voltar para a Arena
          </Link>
        </div>
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
        setFeedback('Selecione uma alternativa antes de enviar.')
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
        setFeedback('Escreva seu código antes de testar.')
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
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-amber-500 selection:text-gray-950 overflow-x-hidden">
      <Navbar
        activeTab="desafios"
        subtitle={`Desafio ${challenge.number} • ${challenge.title}`}
        userId={userId}
        userXp={userXp}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      {/* Conteúdo do Desafio */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-3.5 sm:p-6 md:p-8 space-y-5 pb-20">
        <div className={`p-4 sm:p-6 border rounded-2xl space-y-4 ${cardClasses}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-500 text-gray-950 font-extrabold text-[11px] rounded-md">
                {challenge.difficulty.toUpperCase()}
              </span>
              <span className={`text-xs font-bold ${accentAmberClasses}`}>+{challenge.xp} XP</span>
            </div>
            {isCompleted && (
              <span
                className={`px-2.5 py-1 font-bold text-[11px] sm:text-xs rounded-md border bg-emerald-50 border-emerald-600/30 ${accentGreenClasses} dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400`}
              >
                Concluído ✓
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
            {challenge.title}
          </h2>

          <p className={`text-xs sm:text-sm leading-relaxed ${textBodyClasses}`}>
            {challenge.prompt}
          </p>

          {/* Modo Quiz */}
          {challenge.type === 'quiz' && challenge.options && (
            <div className="space-y-2.5 pt-2 text-xs sm:text-sm">
              {challenge.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer ${
                    selectedOption === opt.id
                      ? 'bg-amber-50 border-amber-600/50 text-stone-900 font-medium dark:bg-amber-500/10 dark:border-amber-500/50 dark:text-white'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-300 dark:hover:border-gray-700'
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
              <label className={`text-xs font-medium block ${textMutedClasses}`}>
                Editor de Código JS:
              </label>
              <textarea
                rows={4}
                placeholder={challenge.placeholder || 'Digite seu código aqui...'}
                value={codeAnswer}
                onChange={(e) => setCodeAnswer(e.target.value)}
                className="w-full border p-4 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-500 bg-stone-50 border-stone-300 text-amber-800 dark:bg-gray-950 dark:border-gray-800 dark:text-amber-400"
              />
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer text-center"
            >
              🚀 Testar Resposta
            </button>

            {isSuccess && nextChallenge && (
              <Link
                href={`/desafios/${nextChallenge.slug}`}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 text-center"
              >
                Próximo Desafio ({nextChallenge.number}) →
              </Link>
            )}
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-xl border font-mono text-xs space-y-1 ${
                isSuccess
                  ? `bg-emerald-50 border-emerald-600/30 ${accentGreenClasses} dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-400`
                  : 'bg-red-50 border-red-600/30 text-red-700 dark:bg-red-950/40 dark:border-red-500/30 dark:text-red-400'
              }`}
            >
              <div className={`text-[10px] uppercase tracking-wider ${textMutedClasses}`}>
                Resultado:
              </div>
              <p className="leading-relaxed">{feedback}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <Link
            href="/desafios"
            className={`px-4 py-2.5 border font-semibold text-xs rounded-xl ${btnClasses}`}
          >
            ← Todos os Desafios
          </Link>
        </div>
      </main>
    </div>
  )
}