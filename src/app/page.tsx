'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const STORAGE_KEY = 'codelab_tema_aula'

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null)
  const [userXp, setUserXp] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  useEffect(() => {
    async function loadData() {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)

      const savedXp = localStorage.getItem('codelab_user_xp')
      if (savedXp) setUserXp(Number(savedXp))

      setLoading(false)
    }
    loadData()
  }, [])

  const alternarTema = () => {
    setIsDark((atual) => {
      const proximo = !atual
      localStorage.setItem(STORAGE_KEY, proximo ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', proximo)
      document.documentElement.style.backgroundColor = proximo ? '#030712' : '#fafaf9'
      return proximo
    })
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-emerald-500 selection:text-gray-950 relative overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-stone-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2.5 py-1.5 font-bold text-xs rounded-lg border shrink-0 bg-emerald-50 text-emerald-700 border-emerald-600/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
            JS
          </span>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Codelab <span className="text-emerald-700 dark:text-emerald-400 font-normal">João</span>
          </h1>
        </div>

        {/* Menu Desktop */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Link
            href="/contato"
            className="px-3.5 py-2 border font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-950 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white dark:border-gray-800"
          >
            <span>💬</span> Contato
          </Link>

          <button
            type="button"
            onClick={alternarTema}
            suppressHydrationWarning
            className="px-3.5 py-2 border font-semibold text-xs rounded-xl cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-950 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white dark:border-gray-800"
            title="Alternar modo claro e escuro"
          >
            {isDark ? '☀ Claro' : '🌙 Escuro'}
          </button>

          {!loading && (
            session ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Trilha</span> <span>🚀</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 border font-semibold text-xs rounded-xl cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-950 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white dark:border-gray-800"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Criar Conta
                </Link>
              </div>
            )
          )}
        </div>

        {/* Botões Mobile */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={alternarTema}
            suppressHydrationWarning
            className="p-2.5 border rounded-xl text-xs font-bold cursor-pointer active:scale-95 bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 dark:border-gray-800"
            title="Alternar modo claro e escuro"
            aria-label="Alternar modo claro e escuro"
          >
            {isDark ? '☀' : '🌙'}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 border font-bold rounded-xl cursor-pointer active:scale-95 bg-stone-100 hover:bg-stone-200 border-stone-300 text-emerald-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:text-emerald-400"
            aria-label="Menu"
          >
            <span className="text-xl leading-none">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </header>

      {/* Menu Dropdown Mobile */}
      {menuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 border-b border-stone-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3 z-50 shadow-2xl">
          <Link
            href="/contato"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 border rounded-xl text-xs font-medium bg-stone-50 border-stone-200 text-stone-700 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-300"
          >
            <span>💬</span> Contato
          </Link>

          {!loading && (
            session ? (
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 bg-emerald-500 text-gray-950 font-extrabold rounded-xl text-xs"
              >
                <span>Ir para a Trilha</span> <span>🚀</span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 border text-center font-semibold rounded-xl text-xs bg-stone-50 border-stone-200 text-stone-800 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-200"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 bg-emerald-500 text-gray-950 text-center font-extrabold rounded-xl text-xs shadow-lg"
                >
                  Criar Conta
                </Link>
              </div>
            )
          )}
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-14 md:py-16 flex flex-col items-center text-center space-y-6 sm:space-y-8">
        <div
          suppressHydrationWarning
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold bg-emerald-50 border-emerald-600/25 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
        >
          <span>✨</span>
          {userXp > 0 ? `Seu XP atual: ${userXp} XP ⚡` : 'Acesso livre • Aulas + Desafios'}
        </div>

        <div className="space-y-3 sm:space-y-4 max-w-3xl">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            JavaScript na prática,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
              no seu ritmo.
            </span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed text-stone-600 dark:text-gray-400">
            Entenda a lógica por trás do código com aulas diretas, exemplos do dia a dia e prática no navegador.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-xl shadow-emerald-500/20 text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>📖</span> Começar a Trilha
          </Link>

          <Link
            href="/desafios"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 border font-bold text-xs sm:text-sm rounded-xl text-center flex items-center justify-center gap-2 cursor-pointer bg-white hover:bg-stone-100 text-amber-700 border-amber-600/30 shadow-xs dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-amber-400 dark:border-amber-500/30"
          >
            <span>⚔️</span> Desafios de Código
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full pt-8 sm:pt-12 text-left">
          <div className="p-4 sm:p-6 border rounded-2xl space-y-2 bg-white border-stone-200 text-stone-900 shadow-xs dark:bg-gray-900/60 dark:border-gray-800 dark:text-white">
            <div className="text-xl sm:text-2xl">📖</div>
            <h3 className="font-bold text-sm">Trilha Estruturada</h3>
            <p className="text-xs leading-relaxed text-stone-600 dark:text-gray-400">
              Aulas em sequência lógica, com teoria clara e desafio prático no final.
            </p>
          </div>
          <div className="p-4 sm:p-6 border rounded-2xl space-y-2 bg-white border-stone-200 text-stone-900 shadow-xs dark:bg-gray-900/60 dark:border-gray-800 dark:text-white">
            <div className="text-xl sm:text-2xl">⚡</div>
            <h3 className="font-bold text-sm">Sem Travas Pra Começar</h3>
            <p className="text-xs leading-relaxed text-stone-600 dark:text-gray-400">
              Explore as aulas na hora e salve seu progresso localmente ou na sua conta.
            </p>
          </div>
          <div className="p-4 sm:p-6 border rounded-2xl space-y-2 relative overflow-hidden bg-white border-stone-200 text-stone-900 shadow-xs dark:bg-gray-900/60 dark:border-gray-800 dark:text-white">
            <div className="flex items-center justify-between">
              <div className="text-xl sm:text-2xl">🏆</div>
              <span
                suppressHydrationWarning
                className="text-[10px] font-bold border px-2 py-0.5 rounded-md text-amber-700 bg-amber-50 border-amber-600/30 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/30"
              >
                {userXp > 0 ? `${userXp} XP` : 'Prática XP'}
              </span>
            </div>
            <h3 className="font-bold text-sm">Desafios e XP</h3>
            <p className="text-xs leading-relaxed text-stone-600 dark:text-gray-400">
              Resolva missões curtas para testar o que aprendeu e acompanhar seu avanço.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 dark:border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 dark:text-gray-500">
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