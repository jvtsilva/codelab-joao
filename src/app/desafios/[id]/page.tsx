'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/hooks/useTheme'
import Link from 'next/link'
import { ARENA_CHALLENGES } from '@/data/challenges'
import { Navbar } from '@/components/Navbar'
import { LabSurface } from '@/components/LabSurface'

const MAX_CODE_ANSWER_LENGTH = 4000

type ChallengeItem = (typeof ARENA_CHALLENGES)[number]

function readVisitorChallengeCompleted(challengeId: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(`codelab_visitante_${challengeId}`) === 'true'
  } catch {
    return false
  }
}

function writeVisitorChallengeCompleted(challengeId: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(`codelab_visitante_${challengeId}`, 'true')
  } catch {
    // Ignora bloqueio de storage pelo navegador
  }
}

interface DesafioMissionContentProps {
  challenge: ChallengeItem
  nextChallenge: ChallengeItem | undefined
  userId: string | null
  onUserIdChange: (id: string | null) => void
  btnClasses: string
  textMutedClasses: string
  textBodyClasses: string
  accentAmberClasses: string
  accentGreenClasses: string
}

function DesafioMissionContent({
  challenge,
  nextChallenge,
  userId,
  onUserIdChange,
  btnClasses,
  textMutedClasses,
  textBodyClasses,
  accentAmberClasses,
  accentGreenClasses,
}: DesafioMissionContentProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [spotPos, setSpotPos] = useState<{ x: number; y: number }>({
    x: 82,
    y: 20,
  })

  // Estados de resposta
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [codeAnswer, setCodeAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    let active = true
    const currentChallenge = challenge

    async function loadChallengeProgress(sessionUserId: string | null) {
      try {
        if (sessionUserId) {
          onUserIdChange(sessionUserId)

          const { data: challenges, error } = await supabase
            .from('user_challenges')
            .select('challenge_id')
            .eq('user_id', sessionUserId)

          if (!active) return

          if (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Erro ao buscar desafios no Supabase:', error.message)
            }
            return
          }

          if (Array.isArray(challenges)) {
            const found = challenges.some(
              (c) => c.challenge_id === currentChallenge.id
            )
            if (found) {
              setIsCompleted(true)
            }
          }
        } else {
          onUserIdChange(null)
          if (readVisitorChallengeCompleted(currentChallenge.id)) {
            setIsCompleted(true)
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro ao carregar progresso do desafio:', error)
        }
      }
    }

    async function initSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (!active) return
        if (error && process.env.NODE_ENV === 'development') {
          console.error('Erro ao obter sessão no desafio:', error.message)
        }
        await loadChallengeProgress(data.session?.user?.id ?? null)
      } catch (err) {
        if (!active) return
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro inesperado na sessão do desafio:', err)
        }
      }
    }

    void initSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!active) return
        void loadChallengeProgress(session?.user?.id ?? null)
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [challenge, onUserIdChange])

  const handleCardMouseMove = (ev: React.MouseEvent<HTMLElement>) => {
    const rect = ev.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const x = Math.round(((ev.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((ev.clientY - rect.top) / rect.height) * 100)
    setSpotPos({ x, y })
  }

  const registerVictory = useCallback(async () => {
    setIsSuccess(true)
    setFeedback(challenge.successMessage)

    if (userId) {
      const { error: rpcError } = await supabase.rpc('complete_challenge', {
        p_challenge_id: challenge.id,
      })

      if (rpcError) {
        const { error: upsertError } = await supabase
          .from('user_challenges')
          .upsert(
            {
              user_id: userId,
              challenge_id: challenge.id,
            },
            { onConflict: 'user_id,challenge_id' }
          )

        if (upsertError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Erro ao salvar conclusão do desafio:', upsertError.message)
          }
          return
        }
      }

      setIsCompleted(true)
      return
    }

    if (!isCompleted) {
      setIsCompleted(true)
      writeVisitorChallengeCompleted(challenge.id)
    }
  }, [challenge, isCompleted, userId])

  const handleSubmit = useCallback(async () => {
    if (submitting) return

    setSubmitting(true)
    try {
      if (challenge.type === 'quiz') {
        if (!selectedOption) {
          setIsSuccess(false)
          setFeedback('Escolha uma opção antes de testar.')
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
          setFeedback('Escreva sua resposta antes de testar.')
          return
        }

        const matchesRegex = challenge.validationPattern
          ? challenge.validationPattern.test(cleanCode)
          : false
        const matchesKeyword = challenge.requiredKeyword
          ? cleanCode.toLowerCase().includes(challenge.requiredKeyword.toLowerCase())
          : false

        if (matchesRegex || matchesKeyword) {
          await registerVictory()
        } else {
          setIsSuccess(false)
          setFeedback(challenge.errorMessage)
        }
      }
    } finally {
      setSubmitting(false)
    }
  }, [challenge, codeAnswer, registerVictory, selectedOption, submitting])

  const handleResetAnswer = () => {
    setSelectedOption(null)
    setCodeAnswer('')
    setFeedback(null)
    setIsSuccess(false)
  }

  const hintText =
    (challenge as { hint?: string; dica?: string }).hint ||
    (challenge as { hint?: string; dica?: string }).dica

  const hasAnswerInput =
    challenge.type === 'quiz' ? Boolean(selectedOption) : codeAnswer.trim().length > 0

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-5 pb-14">
      <LabSurface
        variant="card"
        className="p-5 sm:p-7 space-y-5 transition-all duration-300"
      >
        <section
          onMouseMove={handleCardMouseMove}
          style={
            {
              '--spot-x': `${spotPos.x}%`,
              '--spot-y': `${spotPos.y}%`,
            } as React.CSSProperties
          }
          className="relative overflow-hidden -m-5 sm:-m-7 p-5 sm:p-7 space-y-5"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/14 blur-3xl"
          />

          <div className="relative flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-400 text-gray-950 font-black text-[11px] rounded-xl shadow-2xs">
                {challenge.difficulty.toUpperCase()}
              </span>
              <span className={`text-xs font-bold tabular-nums ${textMutedClasses}`}>
                Missão #{challenge.number}
              </span>
            </div>

            {isCompleted && (
              <span
                className={`px-3 py-1 font-extrabold text-[11px] sm:text-xs rounded-full border bg-emerald-500/12 border-emerald-600/30 ${accentGreenClasses} dark:border-emerald-500/35`}
              >
                Concluído ✓
              </span>
            )}
          </div>

          <div className="relative space-y-2">
            <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-snug">
              {challenge.title}
            </h1>
            <p className={`whitespace-pre-line max-w-4xl ${textBodyClasses}`}>
              {challenge.prompt}
            </p>
          </div>

          {hintText && !isSuccess && (
            <div className="relative space-y-2">
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className={`press-tactile inline-flex items-center gap-1.5 text-xs font-extrabold underline underline-offset-4 cursor-pointer ${accentAmberClasses}`}
              >
                {showHint ? 'Esconder dica' : '💡 Precisa de uma dica?'}
              </button>
              {showHint && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs sm:text-sm leading-relaxed bg-amber-500/8 border-amber-500/30 ${textBodyClasses}`}
                >
                  {hintText}
                </div>
              )}
            </div>
          )}

          {challenge.type === 'quiz' && challenge.options && (
            <div className="relative space-y-2.5 pt-1">
              {challenge.options.map((opt) => {
                const checked = selectedOption === opt.id
                return (
                  <label
                    key={opt.id}
                    className={`press-tactile flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                      checked
                        ? 'bg-amber-500/12 border-amber-600/55 text-stone-950 font-semibold ring-1 ring-amber-500/30 dark:border-amber-500/55 dark:text-white'
                        : 'bg-stone-50/90 border-stone-200/90 text-stone-700 hover:border-amber-500/40 hover:bg-white dark:bg-gray-950/75 dark:border-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="arena-quiz"
                      value={opt.id}
                      checked={checked}
                      onChange={() => {
                        setSelectedOption(opt.id)
                        setFeedback(null)
                      }}
                      className="mt-1 accent-amber-500 shrink-0"
                    />
                    <span className="text-[15px] sm:text-base leading-relaxed">
                      {opt.text}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {challenge.type === 'code' && (
            <div className="relative space-y-2 pt-1">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="arena-code-editor"
                  className={`text-xs font-bold ${textMutedClasses}`}
                >
                  Seu código JavaScript:
                </label>
                <span
                  className={`text-[11px] font-medium hidden sm:inline ${textMutedClasses}`}
                >
                  Ctrl/Cmd + Enter para testar
                </span>
              </div>
              <textarea
                id="arena-code-editor"
                rows={8}
                maxLength={MAX_CODE_ANSWER_LENGTH}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                placeholder={challenge.placeholder || 'Escreva seu código aqui...'}
                value={codeAnswer}
                onChange={(e) => {
                  setCodeAnswer(e.target.value)
                  if (feedback) setFeedback(null)
                }}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault()
                    void handleSubmit()
                  }
                }}
                className="w-full border p-4 rounded-2xl text-[13px] sm:text-sm font-mono leading-relaxed tabular-nums focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-stone-50/90 border-stone-300/90 text-amber-900 dark:bg-gray-950/90 dark:border-gray-800 dark:text-amber-300 transition-all"
              />
            </div>
          )}

          <div className="relative pt-1 flex flex-col sm:flex-row flex-wrap gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleSubmit()}
              className="press-tactile w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 disabled:opacity-60 text-gray-950 font-black text-xs rounded-xl shadow-sm cursor-pointer text-center transition-all"
            >
              {submitting ? 'Testando...' : '🚀 Testar Resposta'}
            </button>

            {hasAnswerInput && !isSuccess && (
              <button
                type="button"
                onClick={handleResetAnswer}
                className={`w-full sm:w-auto px-4 py-3 border text-xs font-bold rounded-xl text-center ${btnClasses}`}
              >
                Limpar
              </button>
            )}

            {isSuccess && nextChallenge && (
              <Link
                href={`/desafios/${nextChallenge.slug}`}
                className="press-tactile w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-gray-950 font-black text-xs rounded-xl shadow-sm text-center transition-all"
              >
                Próximo Desafio ({nextChallenge.number}) →
              </Link>
            )}
          </div>

          {feedback && (
            <div
              role={isSuccess ? 'status' : 'alert'}
              aria-live="polite"
              className={`relative p-4 rounded-2xl border font-mono text-[13px] sm:text-sm space-y-1 transition-all ${
                isSuccess
                  ? `bg-emerald-500/10 border-emerald-600/35 ${accentGreenClasses} dark:border-emerald-500/35`
                  : 'bg-red-500/10 border-red-600/35 text-red-800 dark:text-red-300 dark:border-red-500/35'
              }`}
            >
              <div
                className={`text-[10px] font-black uppercase tracking-wider ${textMutedClasses}`}
              >
                Resultado:
              </div>
              <p className="leading-relaxed font-medium">{feedback}</p>
            </div>
          )}
        </section>
      </LabSurface>

      <div className="flex flex-wrap justify-between items-center gap-3">
        <Link
          href="/desafios"
          className={`px-4 py-2.5 border font-bold text-xs rounded-xl ${btnClasses}`}
        >
          ← Todos os Desafios
        </Link>

        <Link
          href="/playground"
          className={`px-4 py-2.5 border font-bold text-xs rounded-xl ${btnClasses}`}
        >
          Testar no Playground →
        </Link>
      </div>
    </main>
  )
}

export default function DesafioIndividualPage() {
  const params = useParams<{ slug?: string; id?: string }>()
  const rawSlug = params?.slug || params?.id || ''
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : String(rawSlug)

  const currentIndex = ARENA_CHALLENGES.findIndex(
    (c) => c.slug === slug || c.id === slug || String(c.number) === slug
  )
  const challenge = currentIndex !== -1 ? ARENA_CHALLENGES[currentIndex] : undefined
  const nextChallenge =
    currentIndex !== -1 && currentIndex + 1 < ARENA_CHALLENGES.length
      ? ARENA_CHALLENGES[currentIndex + 1]
      : undefined

  const [userId, setUserId] = useState<string | null>(null)
  const { isDark, alternarTema } = useTheme()

  const btnClasses =
    'press-tactile bg-white/95 hover:bg-stone-100 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-300 dark:bg-gray-900/85 dark:hover:bg-gray-800/90 dark:text-gray-300 dark:hover:text-white dark:border-gray-800/90 dark:hover:border-gray-700 transition-all'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const textBodyClasses =
    'text-[15px] sm:text-base leading-relaxed text-stone-700 dark:text-gray-300'
  const accentAmberClasses = 'text-amber-700 dark:text-amber-400'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white">
        <Navbar
          activeTab="desafios"
          subtitle="Arena Codelab"
          userId={userId}
          isDark={isDark}
          onToggleTheme={alternarTema}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <LabSurface variant="card" className="p-7 max-w-md w-full space-y-4">
            <p className={`text-lg font-extrabold ${accentAmberClasses}`}>
              Desafio não encontrado.
            </p>
            <Link
              href="/desafios"
              className={`inline-flex items-center justify-center px-5 py-2.5 border rounded-xl text-xs font-bold ${btnClasses}`}
            >
              ← Voltar para a Arena
            </Link>
          </LabSurface>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-amber-500 selection:text-gray-950">
      <Navbar
        activeTab="desafios"
        subtitle={`Desafio ${challenge.number} • ${challenge.title}`}
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <DesafioMissionContent
        key={challenge.id}
        challenge={challenge}
        nextChallenge={nextChallenge}
        userId={userId}
        onUserIdChange={setUserId}
        btnClasses={btnClasses}
        textMutedClasses={textMutedClasses}
        textBodyClasses={textBodyClasses}
        accentAmberClasses={accentAmberClasses}
        accentGreenClasses={accentGreenClasses}
      />

      <footer className="border-t border-stone-200 dark:border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 dark:text-gray-500">
        <p>Codelab João • Aprendizado prático de JavaScript</p>
        <Link
          href="/contato"
          className="font-medium hover:text-emerald-700 text-stone-600 dark:hover:text-emerald-400 dark:text-gray-400"
        >
          💬 Contato e Suporte
        </Link>
      </footer>
    </div>
  )
}