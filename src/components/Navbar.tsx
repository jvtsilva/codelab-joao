'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface NavbarProps {
  activeTab?: 'trilha' | 'desafios' | 'conta' | 'aula' | 'ranking' | 'medalhas' | 'contato' | 'painel'
  subtitle?: string
  lessonTitle?: string
  userId?: string | null
  userXp?: number
  isDark?: boolean
  onToggleTheme?: () => void
}

export function Navbar({
  activeTab = 'trilha',
  subtitle = 'Aprenda no seu ritmo',
  lessonTitle,
  userId,
  isDark = true,
  onToggleTheme,
}: NavbarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    setMenuOpen(false)
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleProtectedNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!userId) {
      e.preventDefault()
      setMenuOpen(false)
      router.push('/login')
      return
    }
    setMenuOpen(false)
  }

  const isTrilhaAtiva = activeTab === 'trilha' || activeTab === 'aula'

  const navBtnClasses =
    'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 dark:border-gray-800'
  const activeNavBtnClasses =
    'bg-emerald-50 text-emerald-700 border-emerald-600/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
  const mobileItemClasses =
    'bg-stone-50 border-stone-200 text-stone-700 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-300'

  return (
    <header className="border-b border-stone-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-3.5 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="px-2 py-1 font-bold text-xs rounded-lg shrink-0 border bg-emerald-50 text-emerald-700 border-emerald-600/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30"
          >
            JS
          </Link>
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base tracking-wide truncate flex items-center gap-1.5">
              <span>Codelab</span>
              {lessonTitle && (
                <span className="hidden lg:inline text-xs font-normal truncate text-stone-500 dark:text-gray-400">
                  - {lessonTitle}
                </span>
              )}
              {subtitle && (
                <span className="hidden sm:inline text-xs font-normal truncate text-stone-500 dark:text-gray-400">
                  {lessonTitle ? '' : subtitle}
                </span>
              )}
            </h1>
            {subtitle && (
              <p className="sm:hidden text-[11px] truncate text-stone-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2 shrink-0">
          <Link
            href="/dashboard"
            className={`px-3 py-2 rounded-xl text-xs font-semibold border whitespace-nowrap ${
              isTrilhaAtiva ? activeNavBtnClasses : navBtnClasses
            }`}
          >
            Trilha
          </Link>
          <Link
            href="/desafios"
            className={`px-3 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap ${
              activeTab === 'desafios' ? activeNavBtnClasses : navBtnClasses
            }`}
          >
            Desafios
          </Link>
          <Link
            href="/ranking"
            onClick={handleProtectedNav}
            className={`px-3 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap ${
              activeTab === 'ranking' ? activeNavBtnClasses : navBtnClasses
            }`}
          >
            Ranking
          </Link>
          <Link
            href="/medalhas"
            onClick={handleProtectedNav}
            className={`px-3 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap ${
              activeTab === 'medalhas' ? activeNavBtnClasses : navBtnClasses
            }`}
          >
            Medalhas
          </Link>
          <Link
            href="/contato"
            className={`px-3 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap ${
              activeTab === 'contato' ? activeNavBtnClasses : navBtnClasses
            }`}
          >
            Contato
          </Link>
          <Link
            href="/painel"
            onClick={handleProtectedNav}
            className={`px-3 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap ${
              activeTab === 'painel' ? activeNavBtnClasses : navBtnClasses
            }`}
          >
            Painel
          </Link>

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              suppressHydrationWarning
              className={`px-3 py-2 border rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap ${navBtnClasses}`}
              title="Alternar modo claro e escuro"
            >
              <span suppressHydrationWarning>{isDark ? '☀ Claro' : '🌙 Escuro'}</span>
            </button>
          )}

          {userId ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-gray-800">
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2 border rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap bg-red-50 text-red-700 border-red-600/30 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-gray-800">
              <Link
                href="/login"
                className={`px-3.5 py-2 border rounded-xl text-xs whitespace-nowrap ${navBtnClasses}`}
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold rounded-xl text-xs whitespace-nowrap"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>

        {/* Barra Mobile */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              suppressHydrationWarning
              className={`px-2.5 py-1.5 border rounded-xl text-xs font-bold cursor-pointer ${navBtnClasses}`}
              title="Alternar modo claro e escuro"
              aria-label="Alternar modo claro e escuro"
            >
              <span suppressHydrationWarning>{isDark ? '☀' : '🌙'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`px-2.5 py-1.5 border rounded-xl font-bold text-xs active:scale-95 cursor-pointer ${navBtnClasses} text-emerald-700 dark:text-emerald-400`}
            aria-label="Abrir Menu"
          >
            {menuOpen ? 'Fechar' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 border-b p-4 space-y-2 z-50 shadow-2xl bg-white border-stone-200 dark:bg-gray-900 dark:border-gray-800">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={`block px-4 py-3 border rounded-xl text-xs font-semibold ${
              isTrilhaAtiva ? activeNavBtnClasses : mobileItemClasses
            }`}
          >
            Trilha de Estudos
          </Link>
          <Link
            href="/desafios"
            onClick={() => setMenuOpen(false)}
            className={`block px-4 py-3 border rounded-xl text-xs font-semibold ${
              activeTab === 'desafios' ? activeNavBtnClasses : mobileItemClasses
            }`}
          >
            Desafios Práticos
          </Link>
          <Link
            href="/ranking"
            onClick={handleProtectedNav}
            className={`block px-4 py-3 border rounded-xl text-xs font-semibold ${
              activeTab === 'ranking' ? activeNavBtnClasses : mobileItemClasses
            }`}
          >
            Ranking
          </Link>
          <Link
            href="/medalhas"
            onClick={handleProtectedNav}
            className={`block px-4 py-3 border rounded-xl text-xs font-semibold ${
              activeTab === 'medalhas' ? activeNavBtnClasses : mobileItemClasses
            }`}
          >
            Medalhas
          </Link>
          <Link
            href="/contato"
            onClick={() => setMenuOpen(false)}
            className={`block px-4 py-3 border rounded-xl text-xs font-medium ${
              activeTab === 'contato' ? activeNavBtnClasses : mobileItemClasses
            }`}
          >
            Contato
          </Link>
          <Link
            href="/painel"
            onClick={handleProtectedNav}
            className={`block px-4 py-3 border rounded-xl text-xs font-medium ${
              activeTab === 'painel' ? activeNavBtnClasses : mobileItemClasses
            }`}
          >
            Meu Painel
          </Link>
          {userId ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 border rounded-xl text-xs font-medium cursor-pointer bg-red-50 border-red-600/25 text-red-700 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-400"
            >
              Sair da Conta
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className={`text-center px-4 py-3 border rounded-xl text-xs font-semibold ${mobileItemClasses}`}
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                onClick={() => setMenuOpen(false)}
                className="text-center px-4 py-3 bg-emerald-500 text-gray-950 rounded-xl text-xs font-extrabold"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}