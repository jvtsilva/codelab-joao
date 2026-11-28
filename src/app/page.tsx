'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/hooks/useTheme'
import { aulasData } from '@/data/lessonsData'
import { ARENA_CHALLENGES } from '@/data/challenges'
import { LabSurface } from '@/components/LabSurface'
import { JsonLd } from '@/components/JsonLd'
import { getCourseSchemaJsonLd } from '@/lib/seo'

const HIGHLIGHTS = [
  {
    tag: 'Trilha Guiada',
    title: '24 aulas em 6 módulos',
    description:
      'Da lógica inicial e variáveis até funções, arrays, objetos, HTML/CSS e manipulação do DOM com JavaScript.',
    href: '/dashboard',
    cta: 'Abrir Trilha',
  },
  {
    tag: 'Arena Prática',
    title: '24 desafios de lógica e código',
    description:
      'Teste seus conhecimentos com quizzes e trechos de código com dicas, feedback imediato e acompanhamento de progresso.',
    href: '/desafios',
    cta: 'Ir para Desafios',
  },
  {
    tag: 'Laboratório Livre',
    title: 'Playground JS e Web isolado',
    description:
      'Escreva JavaScript puro com console ou monte pequenas páginas com HTML, CSS e JS em ambiente seguro.',
    href: '/playground',
    cta: 'Abrir Playground',
  },
]

export default function HomePage() {
  const { isDark, alternarTema } = useTheme()
  const [userId, setUserId] = useState<string | null>(null)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    let active = true

    async function loadSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (!active) return
        if (!error) {
          setUserId(data.session?.user?.id ?? null)
        }
      } catch {
        // Ignora falha na leitura de sessão inicial
      }
    }

    void loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!active) return
        setUserId(session?.user?.id ?? null)
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    if (signingOut) return
    setSigningOut(true)
    try {
      await supabase.auth.signOut()
    } catch {
      // Ignora erro ao encerrar sessão
    } finally {
      window.location.href = '/'
    }
  }

  const lessonsCount = aulasData.length || 24
  const challengesCount = ARENA_CHALLENGES.length || 24

  return (
    <div className="min-h-screen flex flex-col justify-between bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-amber-500 selection:text-gray-950">
      <JsonLd data={getCourseSchemaJsonLd()} />

      <header className="border-b border-stone-200 dark:border-gray-800/90 bg-stone-50/95 dark:bg-gray-950/95 backdrop-blur sticky top-0 z-40 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <span className="px-2.5 py-1 font-mono font-bold text-xs rounded-lg border bg-emerald-500/10 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25 shrink-0">
              JS
            </span>
            <span className="font-extrabold text-sm sm:text-base tracking-tight truncate">
              Codelab
            </span>
          </Link>

          <nav aria-label="Navegação principal da home" className="flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard"
              className="press-tactile px-3.5 py-2 rounded-xl text-xs font-bold border border-stone-200/90 bg-white hover:bg-stone-100 text-stone-800 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors"
            >
              Trilha
            </Link>

            <button
              type="button"
              onClick={alternarTema}
              suppressHydrationWarning
              className="press-tactile px-3 py-2 rounded-xl text-xs font-bold border border-stone-200/90 bg-white hover:bg-stone-100 text-stone-800 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 cursor-pointer transition-colors"
              title="Alternar modo claro e escuro"
              aria-label="Alternar modo claro e escuro"
            >
              <span suppressHydrationWarning>{isDark ? '☀ Claro' : '🌙 Escuro'}</span>
            </button>

            {userId ? (
              <button
                type="button"
                disabled={signingOut}
                onClick={() => void handleLogout()}
                className="press-tactile px-3.5 py-2 rounded-xl text-xs font-bold border bg-rose-500/10 text-rose-700 border-rose-600/25 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/25 cursor-pointer disabled:opacity-60 transition-colors"
              >
                {signingOut ? 'Saindo...' : 'Sair'}
              </button>
            ) : (
              <Link
                href="/login"
                className="press-tactile px-3.5 py-2 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-gray-950 transition-colors"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <LabSurface variant="card" className="p-6 sm:p-10 space-y-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider bg-amber-500/12 text-amber-800 border-amber-600/25 dark:text-amber-300 dark:border-amber-500/30">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-400"
              />
              Codelab João • JavaScript & Web no seu ritmo
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Aprenda lógica, JavaScript e interface web praticando de verdade
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-stone-600 dark:text-gray-400">
              Siga a trilha completa de {lessonsCount} aulas, resolva{' '}
              {challengesCount} desafios interativos e experimente código
              livremente no playground — com sincronização na sua conta ou modo
              visitante no navegador.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
            <Link
              href="/dashboard"
              className="press-tactile inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-gray-950 font-black text-xs sm:text-sm shadow-sm transition-all"
            >
              Começar na Trilha →
            </Link>

            <Link
              href="/desafios"
              className="press-tactile inline-flex items-center justify-center px-5 py-3 rounded-xl border border-stone-200/90 hover:border-stone-300 bg-white/95 hover:bg-stone-100 text-stone-700 hover:text-stone-950 dark:border-gray-800/90 dark:hover:border-gray-700 dark:bg-gray-900/85 dark:hover:bg-gray-800/90 dark:text-gray-300 dark:hover:text-white font-bold text-xs sm:text-sm transition-all"
            >
              Explorar Desafios
            </Link>

            <Link
              href="/playground"
              className="press-tactile inline-flex items-center justify-center px-5 py-3 rounded-xl border border-stone-200/90 hover:border-stone-300 bg-white/95 hover:bg-stone-100 text-stone-700 hover:text-stone-950 dark:border-gray-800/90 dark:hover:border-gray-700 dark:bg-gray-900/85 dark:hover:bg-gray-800/90 dark:text-gray-300 dark:hover:text-white font-bold text-xs sm:text-sm transition-all"
            >
              Abrir Playground
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-stone-200/80 dark:border-gray-800/80">
            <div className="p-4 rounded-2xl border bg-stone-50/90 border-stone-200/90 dark:bg-gray-950/75 dark:border-gray-800/90 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-gray-400 block">
                Conteúdo Estruturado
              </span>
              <span className="text-xl font-black tabular-nums text-emerald-700 dark:text-emerald-400">
                {lessonsCount} Aulas • 6 Módulos
              </span>
            </div>

            <div className="p-4 rounded-2xl border bg-stone-50/90 border-stone-200/90 dark:bg-gray-950/75 dark:border-gray-800/90 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-gray-400 block">
                Prática Contínua
              </span>
              <span className="text-xl font-black tabular-nums text-amber-700 dark:text-amber-400">
                {challengesCount} Desafios
              </span>
            </div>

            <div className="p-4 rounded-2xl border bg-stone-50/90 border-stone-200/90 dark:bg-gray-950/75 dark:border-gray-800/90 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-gray-400 block">
                Ambiente de Testes
              </span>
              <span className="text-xl font-black text-cyan-700 dark:text-cyan-400">
                JS + HTML/CSS
              </span>
            </div>
          </div>
        </LabSurface>

        <section
          aria-label="Áreas da plataforma"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {HIGHLIGHTS.map((item) => (
            <LabSurface
              key={item.title}
              variant="card"
              className="p-5 sm:p-6 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800">
                  {item.tag}
                </span>
                <h2 className="text-lg font-extrabold tracking-tight">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/80 dark:border-gray-800/80">
                <Link
                  href={item.href}
                  className="inline-flex items-center text-xs sm:text-sm font-extrabold text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                >
                  {item.cta} →
                </Link>
              </div>
            </LabSurface>
          ))}
        </section>
      </main>

      <footer className="border-t border-stone-200 dark:border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 dark:text-gray-500">
        <p>Codelab João • Aprendizado prático de JavaScript</p>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            Trilha
          </Link>
          <Link
            href="/medalhas"
            className="hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            Medalhas
          </Link>
          <Link
            href="/privacidade"
            className="hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            Privacidade e LGPD
          </Link>
          <Link
            href="/contato"
            className="hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            Contato
          </Link>
        </div>
      </footer>
    </div>
  )
}