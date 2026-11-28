'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/hooks/useTheme'
import { aulasData } from '@/data/lessonsData'
import { ARENA_CHALLENGES } from '@/data/challenges'
import { Navbar } from '@/components/Navbar'

interface BadgeRule {
  id: string
  title: string
  description: string
  unlocked: boolean
}

function countGuestLessons(totalLessons: number): number {
  if (typeof window === 'undefined') return 0
  let count = 0
  for (let i = 1; i <= totalLessons; i++) {
    try {
      if (window.localStorage.getItem(`codelab_visitante_aula_${i}`) === 'true') {
        count += 1
      }
    } catch {
      // Ignora bloqueio de storage
    }
  }
  return count
}

function countGuestChallenges(challengeIds: string[]): number {
  if (typeof window === 'undefined') return 0
  let count = 0
  for (const id of challengeIds) {
    try {
      if (window.localStorage.getItem(`codelab_visitante_${id}`) === 'true') {
        count += 1
      }
    } catch {
      // Ignora bloqueio de storage
    }
  }
  return count
}

export default function MedalhasPage() {
  const { isDark, alternarTema } = useTheme()
  const [userId, setUserId] = useState<string | null>(null)
  const [lessonsCount, setLessonsCount] = useState<number>(0)
  const [challengesCount, setChallengesCount] = useState<number>(0)

  const totalLessons = aulasData.length || 24
  const challengeIds = ARENA_CHALLENGES.map((c) => c.id)

  useEffect(() => {
    let active = true

    async function loadMilestones(sessionUserId: string | null) {
      if (!active) return
      setUserId(sessionUserId)

      try {
        if (!sessionUserId) {
          setLessonsCount(countGuestLessons(totalLessons))
          setChallengesCount(countGuestChallenges(challengeIds))
          return
        }

        const [lRes, cRes] = await Promise.all([
          supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', sessionUserId),
          supabase
            .from('user_challenges')
            .select('challenge_id')
            .eq('user_id', sessionUserId),
        ])

        if (!active) return

        const dbLessons = Array.isArray(lRes.data) ? lRes.data.length : 0
        const dbChallenges = Array.isArray(cRes.data) ? cRes.data.length : 0

        setLessonsCount(Math.max(dbLessons, countGuestLessons(totalLessons)))
        setChallengesCount(
          Math.max(dbChallenges, countGuestChallenges(challengeIds))
        )
      } catch {
        if (!active) return
        setLessonsCount(countGuestLessons(totalLessons))
        setChallengesCount(countGuestChallenges(challengeIds))
      }
    }

    async function initSession() {
      try {
        const { data } = await supabase.auth.getSession()
        if (!active) return
        await loadMilestones(data.session?.user?.id ?? null)
      } catch {
        if (!active) return
        await loadMilestones(null)
      }
    }

    void initSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!active) return
        void loadMilestones(session?.user?.id ?? null)
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [challengeIds, totalLessons])

  const badges: BadgeRule[] = [
    {
      id: 'primeiro-passo',
      title: 'Primeiro Passo',
      description: 'Concluiu a primeira aula da trilha no seu próprio ritmo.',
      unlocked: lessonsCount >= 1,
    },
    {
      id: 'base-firme',
      title: 'Base Firme',
      description: 'Concluiu 6 ou mais aulas da trilha de JavaScript.',
      unlocked: lessonsCount >= 6,
    },
    {
      id: 'mao-na-massa',
      title: 'Mão na Massa',
      description: 'Concluiu pelo menos 1 desafio prático na Arena.',
      unlocked: challengesCount >= 1,
    },
    {
      id: 'trilha-completa',
      title: 'Trilha Concluída',
      description: `Concluiu todas as ${totalLessons} aulas da trilha.`,
      unlocked: lessonsCount >= totalLessons,
    },
  ]

  const unlockedTotal = badges.filter((b) => b.unlocked).length

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F7F4] bg-lab-dots text-[#18181B] dark:bg-[#0B0F14] dark:text-[#F1F5F9]">
      <Navbar
        subtitle="Medalhas e Marcos"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 space-y-6">
        <section className="border rounded-2xl p-6 sm:p-8 bg-white border-[#E7E5E4] dark:bg-[#121821] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-semibold bg-[#047857]/10 border-[#047857]/25 text-[#047857] dark:bg-[#34D399]/10 dark:border-[#34D399]/25 dark:text-[#34D399]">
              Marcos pessoais • Sem disputa ou ranking
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Medalhas de Progresso
            </h1>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8]">
              Registro simbólico das etapas que você alcançou, no seu ritmo.
            </p>
          </div>

          <div className="text-xs font-mono px-3.5 py-2 rounded-xl border bg-[#F8F7F4] border-[#E7E5E4] dark:bg-[#0E131A] dark:border-[#1E293B] shrink-0">
            <span className="font-bold text-[#047857] dark:text-[#34D399]">
              {unlockedTotal}
            </span>{' '}
            / {badges.length} conquistadas
          </div>
        </section>

        <section
          aria-label="Lista de medalhas"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {badges.map((badge) => (
            <article
              key={badge.id}
              className={`border rounded-2xl p-5 sm:p-6 space-y-2 transition-colors ${
                badge.unlocked
                  ? 'bg-white dark:bg-[#121821] border-[#047857]/40 dark:border-[#34D399]/40'
                  : 'bg-white/70 dark:bg-[#121821]/70 border-[#E7E5E4] dark:border-[#1E293B] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span aria-hidden="true" className="text-xl">
                  {badge.unlocked ? '🏅' : '○'}
                </span>
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold ${
                    badge.unlocked
                      ? 'bg-[#047857]/10 text-[#047857] dark:bg-[#34D399]/10 dark:text-[#34D399]'
                      : 'bg-[#F8F7F4] text-[#57534E] dark:bg-[#0E131A] dark:text-[#94A3B8]'
                  }`}
                >
                  {badge.unlocked ? 'Conquistada' : 'Em andamento'}
                </span>
              </div>

              <h2 className="text-base font-bold">{badge.title}</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#57534E] dark:text-[#94A3B8]">
                {badge.description}
              </p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-t border-[#E7E5E4] dark:border-[#1E293B] px-4 sm:px-8 py-6 text-xs max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-[#57534E] dark:text-[#94A3B8]">
        <p>Codelab João • Cada passo no seu tempo</p>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-[#047857] dark:hover:text-[#34D399]">
            Trilha
          </Link>
          <Link href="/desafios" className="hover:text-[#047857] dark:hover:text-[#34D399]">
            Desafios
          </Link>
          <Link href="/privacidade" className="hover:text-[#047857] dark:hover:text-[#34D399]">
            Privacidade e LGPD
          </Link>
        </div>
      </footer>
    </div>
  )
}