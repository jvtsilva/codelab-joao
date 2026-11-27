'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  full_name?: string | null
  xp: number | string | null
  streak?: number | string | null
}

interface LeaderboardEntry {
  id: string
  displayName: string
  xp: number
  streak: number
}

interface LeaderboardProps {
  isOpen: boolean
  onClose: () => void
}

type TemaLeaderboard = 'dark' | 'light'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const MAX_NOME_EXIBICAO = 60

function sanitizeName(rawName: unknown): string {
  const cleaned = String(rawName || '').trim().slice(0, MAX_NOME_EXIBICAO)
  return cleaned || 'Estudante Codelab'
}

function sanitizeNonNegativeInt(rawValue: unknown): number {
  const parsed = Number(rawValue)
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0
}

export default function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const [ranking, setRanking] = useState<LeaderboardEntry[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [tema, setTema] = useState<TemaLeaderboard>('dark')

  useIsomorphicLayoutEffect(() => {
    const temaSalvo = localStorage.getItem('codelab_tema_aula')
    if (temaSalvo === 'light' || temaSalvo === 'dark') {
      setTema(temaSalvo)
    } else if (typeof document !== 'undefined') {
      setTema(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    let active = true

    async function loadRanking() {
      setLoading(true)
      setErrorMessage('')

      try {
        const [{ data: sessionData }, { data, error }] = await Promise.all([
          supabase.auth.getSession(),
          supabase
            .from('profiles')
            .select('id, full_name, xp, streak')
            .order('xp', { ascending: false })
            .limit(10),
        ])

        if (!active) return

        setCurrentUserId(sessionData?.session?.user?.id ?? null)

        if (error) {
          console.error('Erro ao carregar ranking no modal:', error.message)
          setErrorMessage('Não foi possível carregar o ranking.')
          setRanking([])
        } else if (Array.isArray(data)) {
          const sanitizedRows: LeaderboardEntry[] = (data as Profile[])
            .filter((row) => typeof row?.id === 'string' && row.id.trim().length > 0)
            .map((row) => ({
              id: row.id.trim(),
              displayName: sanitizeName(row.full_name),
              xp: sanitizeNonNegativeInt(row.xp),
              streak: sanitizeNonNegativeInt(row.streak),
            }))
          setRanking(sanitizedRows)
        } else {
          setRanking([])
        }
      } catch (err) {
        console.error('Erro inesperado ao carregar ranking:', err)
        if (active) {
          setErrorMessage('Não foi possível carregar o ranking.')
          setRanking([])
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadRanking()

    return () => {
      active = false
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isLight = tema === 'light'

  const modalClasses = isLight
    ? 'bg-white border-stone-200 text-stone-900 shadow-2xl duration-0'
    : 'bg-gray-900 border-gray-800 text-white shadow-2xl duration-0'

  const rowClasses = isLight
    ? 'bg-stone-50 border-stone-200 duration-0'
    : 'bg-gray-800/80 border-gray-700/60 duration-0'

  const currentUserRowClasses = isLight
    ? 'bg-emerald-50/80 border-emerald-600/30 duration-0'
    : 'bg-emerald-500/10 border-emerald-500/30 duration-0'

  const xpBadgeClasses = isLight
    ? 'bg-amber-50 border-amber-600/30 text-amber-700 duration-0'
    : 'bg-gray-950/80 border-gray-800 text-amber-400 duration-0'

  const closeBtnClasses = isLight
    ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 duration-0'
    : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700 duration-0'

  const textMutedClasses = isLight ? 'text-stone-600 duration-0' : 'text-gray-400 duration-0'
  const accentAmberClasses = isLight ? 'text-amber-700 duration-0' : 'text-amber-400 duration-0'
  const accentOrangeClasses = isLight ? 'text-orange-700 duration-0' : 'text-orange-400 duration-0'
  const accentGreenClasses = isLight ? 'text-emerald-700 duration-0' : 'text-emerald-400 duration-0'
  const accentRedClasses = isLight ? 'text-red-700 duration-0' : 'text-red-400'

  return (
    <div
      className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={`border rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 relative ${modalClasses}`}>
        <div
          className={`flex justify-between items-center border-b pb-4 duration-0 ${
            isLight ? 'border-stone-200' : 'border-gray-800'
          }`}
        >
          <h2 id="leaderboard-modal-title" className="text-xl font-black flex items-center gap-2">
            <span>🏆</span>
            <span>Ranking de XP</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer ${closeBtnClasses}`}
            aria-label="Fechar ranking"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className={`py-8 flex items-center justify-center gap-2 text-xs font-medium ${textMutedClasses}`}>
            <span
              className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                isLight ? 'border-emerald-700' : 'border-emerald-500'
              }`}
            />
            <span>Carregando o ranking...</span>
          </div>
        ) : errorMessage ? (
          <div className={`p-3 rounded-xl border text-xs font-medium ${accentRedClasses} ${rowClasses}`}>
            {errorMessage}
          </div>
        ) : ranking.length === 0 ? (
          <div className={`text-center py-8 text-xs font-medium ${textMutedClasses}`}>
            Nenhuma pontuação encontrada no ranking.
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {ranking.map((user, index) => {
              let medal = `${index + 1}º`
              if (index === 0) medal = '🥇'
              else if (index === 1) medal = '🥈'
              else if (index === 2) medal = '🥉'

              const isCurrentUser = Boolean(currentUserId && user.id === currentUserId)

              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border ${
                    isCurrentUser ? currentUserRowClasses : rowClasses
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-8 text-center font-black text-base shrink-0 ${accentAmberClasses}`}>
                      {medal}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm truncate">
                          {user.displayName}
                        </h4>
                        {isCurrentUser && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${accentGreenClasses} ${
                              isLight
                                ? 'bg-emerald-100/80 border-emerald-600/30'
                                : 'bg-emerald-500/15 border-emerald-500/30'
                            }`}
                          >
                            Você
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${accentOrangeClasses}`}>
                        🔥 {user.streak} dias de ofensiva
                      </span>
                    </div>
                  </div>

                  <div className={`px-3 py-1.5 rounded-xl border font-black text-xs shrink-0 ${xpBadgeClasses}`}>
                    {user.xp.toLocaleString('pt-BR')} XP
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className={`w-full font-bold py-3 rounded-xl text-xs border cursor-pointer ${closeBtnClasses}`}
        >
          Fechar
        </button>
      </div>
    </div>
  )
}