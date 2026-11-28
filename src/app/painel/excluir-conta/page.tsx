'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useTheme } from '@/hooks/useTheme'
import { LabSurface } from '@/components/LabSurface'

export default function ExcluirContaPage() {
  const router = useRouter()
  const { isDark, alternarTema } = useTheme()

  const [checkingSession, setCheckingSession] = useState(isSupabaseConfigured)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | '' }>(() =>
    isSupabaseConfigured
      ? { text: '', type: '' }
      : { text: 'Configuração do Supabase ausente no ambiente.', type: 'error' }
  )

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true

    async function loadUser() {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (!active) return
        if (error || !data.user) {
          setUserEmail(null)
          setUserId(null)
        } else {
          setUserEmail(data.user.email ?? null)
          setUserId(data.user.id)
        }
      } catch {
        if (!active) return
        setUserEmail(null)
        setUserId(null)
      } finally {
        if (active) {
          setCheckingSession(false)
        }
      }
    }

    void loadUser()

    return () => {
      active = false
    }
  }, [])

  const canConfirm = confirmText.trim().toUpperCase() === 'EXCLUIR' && Boolean(userId)

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting || !canConfirm) return

    setFeedback({ text: '', type: '' })
    setSubmitting(true)

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Configuração do Supabase ausente no ambiente.')
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      if (sessionError || !accessToken) {
        throw new Error('Sessão expirada. Faça login novamente para excluir a conta.')
      }

      const res = await fetch('/api/conta/excluir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
        body: JSON.stringify({ userId }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(
          typeof data?.error === 'string' && data.error.trim()
            ? data.error
            : 'Não foi possível excluir a conta.'
        )
      }

      await supabase.auth.signOut({ scope: 'local' }).catch(() => {})
      setFeedback({
        text: 'Conta e dados excluídos com sucesso. Redirecionando...',
        type: 'success',
      })
      setConfirmText('')

      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1200)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro inesperado ao excluir conta.'
      setFeedback({ text: msg, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const btnClasses =
    'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800'

  const inputClasses =
    'bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-amber-400'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white">
      <header className="max-w-lg w-full mx-auto pt-2 flex items-center justify-between gap-2">
        <Link href="/painel" className="font-bold text-sm tracking-wide">
          Codelab <span className="text-emerald-700 dark:text-emerald-400 font-normal">João</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={alternarTema}
            suppressHydrationWarning
            className={`px-2.5 py-2 border text-xs font-semibold rounded-xl transition cursor-pointer ${btnClasses}`}
            aria-label="Alternar modo claro e escuro"
          >
            {isDark ? '☀ Claro' : '🌙 Escuro'}
          </button>

          <Link
            href="/painel"
            className={`text-xs font-semibold transition px-3.5 py-2 rounded-xl border ${btnClasses}`}
          >
            Voltar ao painel
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center my-auto py-6">
        <LabSurface
          variant="card"
          className="max-w-lg w-full px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6 shadow-xl dark:shadow-2xl"
        >
          <div className="space-y-4">
            <div>
              <span className="inline-block px-3 py-1 border font-bold text-[11px] rounded-full mb-3 bg-amber-50 text-amber-800 border-amber-600/30 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-400/25">
                EXCLUSÃO DEFINITIVA
              </span>
              <h1 className="text-2xl font-black tracking-tight">Excluir minha conta</h1>
              <p className={`text-xs mt-1 leading-relaxed ${textMutedClasses}`}>
                Essa ação remove seu perfil, progresso em aulas, desafios concluídos e sua conta de
                acesso de forma permanente.
              </p>
            </div>

            {feedback.text && (
              <div
                className={`p-3 text-xs rounded-xl border ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-600/30 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400'
                    : 'bg-red-50 border-red-600/30 text-red-700 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-400'
                }`}
              >
                {feedback.text}
              </div>
            )}

            {checkingSession ? (
              <p className={`text-xs py-4 ${textMutedClasses}`}>Verificando sessão ativa...</p>
            ) : !userId ? (
              <div className="space-y-3 py-2">
                <p className={`text-xs ${textMutedClasses}`}>
                  Você precisa estar autenticado para solicitar a exclusão da conta.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                >
                  Ir para o login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div className="p-3 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-100/70 dark:bg-slate-900/60 text-xs">
                  <span className={textMutedClasses}>Conta autenticada: </span>
                  <strong className="font-mono">{userEmail || userId}</strong>
                </div>

                <div className="space-y-1">
                  <label className={`block text-xs font-medium ${textMutedClasses}`}>
                    Digite <strong className="font-mono">EXCLUIR</strong> para confirmar
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    disabled={submitting}
                    placeholder="EXCLUIR"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs font-mono transition ${inputClasses}`}
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <Link
                    href="/painel"
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${btnClasses}`}
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={!canConfirm || submitting}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Excluindo...' : 'Confirmar exclusão'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </LabSurface>
      </main>

      <footer className={`max-w-lg w-full mx-auto pb-2 text-center text-xs ${textMutedClasses}`}>
        <p>
          Dúvidas sobre privacidade? Acesse{' '}
          <Link href="/privacidade" className="underline">
            Política de Privacidade
          </Link>
        </p>
      </footer>
    </div>
  )
}