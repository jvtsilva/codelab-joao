'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STORAGE_KEY = 'codelab_tema_aula'
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function ExcluirContaPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('Aluno')
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [isDark, setIsDark] = useState(true)
  const router = useRouter()

  useIsomorphicLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  useEffect(() => {
    let active = true

    async function checkUser() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (!active) return

        if (error || !session) {
          router.push('/login')
          return
        }

        setUserId(session.user.id)
        const meta = session.user.user_metadata
        setUserName(meta?.full_name || meta?.name || 'Aluno')
      } catch (err) {
        console.error('Erro ao verificar sessão na exclusão de conta:', err)
        if (active) router.push('/login')
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active || deleteSuccess) return
      if (!session) {
        router.push('/login')
      } else {
        setUserId(session.user.id)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [router, deleteSuccess])

  const alternarTema = () => {
    setIsDark((atual) => {
      const proximo = !atual
      localStorage.setItem(STORAGE_KEY, proximo ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', proximo)
      document.documentElement.style.backgroundColor = proximo ? '#030712' : '#fafaf9'
      return proximo
    })
  }

  const handleDeleteAccount = async () => {
    if (!userId || !confirmChecked || deleteLoading) return
    setDeleteLoading(true)
    setDeleteError('')

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error('Sessão expirada. Faça login novamente para excluir sua conta.')
      }

      const response = await fetch('/api/deletar-usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao excluir conta.')
      }

      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('codelab_') && key !== STORAGE_KEY) {
            localStorage.removeItem(key)
          }
        })
      }

      await supabase.auth.signOut().catch(() => {})
      setDeleteSuccess(true)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Não foi possível excluir a conta.'
      setDeleteError(msg)
    } finally {
      setDeleteLoading(false)
    }
  }

  const cardClasses =
    'bg-white border-stone-200 text-stone-900 shadow-xl dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:shadow-2xl'

  const btnClasses =
    'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const textBodyClasses = 'text-stone-700 dark:text-gray-300'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'
  const accentRedClasses = 'text-red-700 dark:text-red-400'

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-red-500 selection:text-white bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
      <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 dark:border-gray-800/80 bg-stone-50/95 dark:bg-gray-950/95 backdrop-blur px-4 py-3">
        <div className="max-w-md w-full mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-1.5 font-bold text-xs rounded-lg border shrink-0 bg-emerald-50 text-emerald-700 border-emerald-600/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
              JS
            </span>
            <span className="font-bold text-sm tracking-wide truncate">
              Codelab <span className={`${accentGreenClasses} font-normal`}>João</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={alternarTema}
              className={`px-2.5 py-2 border text-xs font-semibold rounded-xl cursor-pointer ${btnClasses}`}
              title="Alternar modo claro e escuro"
              aria-label="Alternar modo claro e escuro"
            >
              <span className="hidden sm:inline">{isDark ? '☀ Claro' : '🌙 Escuro'}</span>
              <span className="sm:hidden">{isDark ? '☀' : '🌙'}</span>
            </button>

            {!deleteSuccess && (
              <Link
                href="/painel"
                className={`text-xs font-semibold px-3 py-2 rounded-xl border ${btnClasses} ${
                  deleteLoading ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                Painel
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className={`max-w-md w-full border p-5 sm:p-8 rounded-3xl space-y-6 text-center ${cardClasses}`}>
          {deleteSuccess ? (
            <div className="space-y-5 py-4">
              <div className="w-16 h-16 border rounded-full flex items-center justify-center mx-auto text-2xl font-bold bg-emerald-50 border-emerald-600/25 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
                ✓
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Até logo, {userName}! 👋</h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textMutedClasses}`}>
                  Sua conta foi excluída. Obrigado por estudar com a gente no Codelab João e boa jornada! 🚀
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Ir para o Login
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 border rounded-2xl flex items-center justify-center mx-auto text-2xl bg-red-50 border-red-600/25 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-500">
                ⚠️
              </div>

              <div className="space-y-2">
                <h1 className={`text-xl font-black tracking-tight ${accentRedClasses}`}>
                  Excluir sua conta?
                </h1>
                <p className={`text-xs sm:text-sm leading-relaxed ${textBodyClasses}`}>
                  Essa ação é <strong className="text-stone-900 dark:text-white">permanente</strong>, {userName}. Todo o seu progresso, XP e acesso ao Codelab João serão apagados.
                </p>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs cursor-pointer bg-stone-50 border-stone-200 text-stone-700 dark:bg-gray-950/60 dark:border-gray-800 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                  disabled={deleteLoading}
                  className="mt-0.5 accent-red-600 shrink-0 cursor-pointer"
                />
                <span>Entendo que esta exclusão é definitiva e não pode ser desfeita.</span>
              </label>

              {deleteError && (
                <div className="p-3 border text-xs rounded-xl text-left bg-red-50 border-red-600/30 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
                  {deleteError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <Link
                  href="/painel"
                  className={`w-full py-3 border font-semibold rounded-xl text-xs text-center cursor-pointer ${btnClasses} ${
                    deleteLoading ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  Cancelar
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={!confirmChecked || deleteLoading}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                >
                  {deleteLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    'Excluir conta'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <div className="h-4" />
    </div>
  )
}