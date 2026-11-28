'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useTheme } from '@/hooks/useTheme'
import { Navbar } from '@/components/Navbar'
import { LabSurface } from '@/components/LabSurface'

type ProfileRow = {
  id: string
  full_name: string | null
  created_at: string | null
}

export default function PainelPage() {
  const router = useRouter()
  const { isDark, alternarTema } = useTheme()

  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [completedLessons, setCompletedLessons] = useState<number>(0)
  const [completedChallenges, setCompletedChallenges] = useState<number>(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(() =>
    isSupabaseConfigured ? null : 'Configuração do Supabase ausente no ambiente.'
  )

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true

    async function fetchUserData(uid: string, email: string | null) {
      setUserId(uid)
      setUserEmail(email)

      const [profileRes, lessonsRes, challengesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, created_at')
          .eq('id', uid)
          .maybeSingle(),
        supabase
          .from('user_progress')
          .select('lesson_id', { count: 'exact', head: true })
          .eq('user_id', uid),
        supabase
          .from('user_challenges')
          .select('challenge_id', { count: 'exact', head: true })
          .eq('user_id', uid),
      ])

      if (!active) return

      if (profileRes.error || lessonsRes.error || challengesRes.error) {
        setErrorMsg('Não foi possível carregar parte dos dados do painel.')
      }

      setProfile((profileRes.data as ProfileRow | null) ?? null)
      setCompletedLessons(lessonsRes.count ?? 0)
      setCompletedChallenges(challengesRes.count ?? 0)
      setLoading(false)
    }

    async function loadPainel() {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (!active) return

      if (userError || !userData.user) {
        setUserId(null)
        setUserEmail(null)
        setLoading(false)
        return
      }

      await fetchUserData(userData.user.id, userData.user.email ?? null)
    }

    void loadPainel()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!active) return
        const nextUid = session?.user?.id ?? null
        const nextEmail = session?.user?.email ?? null

        if (!nextUid) {
          queueMicrotask(() => {
            if (!active) return
            setUserId(null)
            setUserEmail(null)
            setProfile(null)
            setCompletedLessons(0)
            setCompletedChallenges(0)
            setLoading(false)
          })
        } else {
          void fetchUserData(nextUid, nextEmail)
        }
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut({ scope: 'local' }).catch(() => {})
    router.push('/login')
    router.refresh()
  }

  const btnClasses =
    'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'

  const displayName =
    profile?.full_name?.trim() ||
    (userEmail ? userEmail.split('@')[0] : 'Aluno')

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white">
      <Navbar
        activeTab="painel"
        subtitle="• Meu Painel"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <LabSurface variant="card" className="p-6">
            <p className={`text-xs ${textMutedClasses}`}>Carregando dados do painel...</p>
          </LabSurface>
        ) : !userEmail ? (
          <LabSurface variant="card" className="p-6 space-y-4">
            <h1 className="text-xl font-black tracking-tight">Acesso ao painel</h1>
            <p className={`text-xs ${textMutedClasses}`}>
              Faça login para visualizar seu perfil, progresso e opções da conta.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${btnClasses}`}
              >
                Criar conta
              </Link>
            </div>
          </LabSurface>
        ) : (
          <>
            <LabSurface variant="card" className="p-6 space-y-2">
              <span className="inline-block px-3 py-1 border font-bold text-[11px] rounded-full bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                PAINEL DO ALUNO
              </span>
              <h1 className="text-2xl font-black tracking-tight">Olá, {displayName}</h1>
              <p className={`text-xs font-mono ${textMutedClasses}`}>{userEmail}</p>
              {errorMsg && (
                <p className="text-xs text-amber-700 dark:text-amber-300 pt-1">{errorMsg}</p>
              )}
            </LabSurface>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabSurface variant="card" className="p-5 space-y-1">
                <p className={`text-xs font-medium ${textMutedClasses}`}>Aulas concluídas</p>
                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
                  {completedLessons}
                </p>
              </LabSurface>

              <LabSurface variant="card" className="p-5 space-y-1">
                <p className={`text-xs font-medium ${textMutedClasses}`}>Desafios concluídos</p>
                <p className="text-3xl font-black text-amber-700 dark:text-amber-400">
                  {completedChallenges}
                </p>
              </LabSurface>
            </div>

            <LabSurface variant="card" className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-sm font-bold">Privacidade e conta</h2>
                <p className={`text-xs ${textMutedClasses}`}>
                  Gerencie sua conta ou solicite a exclusão definitiva dos seus dados.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${btnClasses}`}
                >
                  Sair
                </button>
                <Link
                  href="/painel/excluir-conta"
                  className="px-4 py-2.5 rounded-xl border border-amber-600/40 bg-amber-50 hover:bg-amber-100 text-amber-900 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-300 text-xs font-bold transition text-center"
                >
                  Excluir conta
                </Link>
              </div>
            </LabSurface>
          </>
        )}
      </main>

      <footer className={`max-w-3xl w-full mx-auto px-4 pb-6 text-center text-xs ${textMutedClasses}`}>
        <p>
          Codelab João •{' '}
          <Link href="/privacidade" className="underline">
            Privacidade
          </Link>{' '}
          •{' '}
          <Link href="/termos" className="underline">
            Termos
          </Link>
        </p>
      </footer>
    </div>
  )
}