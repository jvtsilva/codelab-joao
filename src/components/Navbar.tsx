'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type NavTab =
  | 'home'
  | 'trilha'
  | 'desafios'
  | 'playground'
  | 'conta'
  | 'aula'
  | 'medalhas'
  | 'contato'
  | 'painel'

interface NavbarProps {
  activeTab?: NavTab
  subtitle?: string
  lessonTitle?: string
  userId?: string | null
  isDark?: boolean
  onToggleTheme?: () => void
}

function resolveActiveTab(pathname: string | null, explicitTab?: NavTab): NavTab | 'outro' {
  if (pathname) {
    if (pathname === '/') return 'home'
    if (pathname.startsWith('/dashboard/aula')) return 'aula'
    if (pathname.startsWith('/dashboard')) return 'trilha'
    if (pathname.startsWith('/desafios')) return 'desafios'
    if (pathname.startsWith('/playground')) return 'playground'
    if (pathname.startsWith('/medalhas')) return 'medalhas'
    if (pathname.startsWith('/contato')) return 'contato'
    if (pathname.startsWith('/painel')) return 'painel'
    if (pathname.startsWith('/login') || pathname.startsWith('/cadastro')) return 'conta'
    return explicitTab ?? 'outro'
  }

  return explicitTab ?? 'trilha'
}

export function Navbar({
  activeTab,
  subtitle = 'Aprenda no seu ritmo',
  lessonTitle,
  userId,
  isDark = true,
  onToggleTheme,
}: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const currentTab = resolveActiveTab(pathname, activeTab)

  const handleLogout = async () => {
    if (signingOut) return
    setSigningOut(true)
    setMenuOpen(false)
    try {
      await supabase.auth.signOut()
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao encerrar sessão:', err)
      }
    } finally {
      window.location.href = '/'
    }
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

  const isTrilhaAtiva = currentTab === 'trilha' || currentTab === 'aula'
  const brandHref = currentTab === 'home' ? '/' : '/dashboard'

  const navBtnClasses =
    'press-tactile bg-white hover:bg-[#F1EFEA] text-[#18181B] border-[#E7E5E4] dark:bg-[#121821] dark:hover:bg-[#0E131A] dark:text-[#F1F5F9] dark:border-[#1E293B] transition-colors'
  const activeNavBtnClasses =
    'bg-[#047857]/10 text-[#047857] border-[#047857]/30 dark:bg-[#34D399]/10 dark:text-[#34D399] dark:border-[#34D399]/30'
  const mobileItemClasses =
    'bg-[#F1EFEA] border-[#E7E5E4] text-[#18181B] dark:bg-[#0E131A] dark:border-[#1E293B] dark:text-[#F1F5F9]'

  return (
    <header className="relative border-b border-[#E7E5E4] dark:border-[#1E293B] bg-[#F8F7F4]/95 dark:bg-[#0B0F14]/95 backdrop-blur sticky top-0 z-50 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href={brandHref}
            onClick={() => setMenuOpen(false)}
            className="px-2 py-1 font-mono font-semibold text-xs rounded-lg shrink-0 border bg-[#047857]/10 text-[#047857] border-[#047857]/25 dark:bg-[#34D399]/10 dark:text-[#34D399] dark:border-[#34D399]/25"
          >
            JS
          </Link>
          <div className="min-w-0">
            <p className="font-extrabold text-sm sm:text-base tracking-tight truncate flex items-center gap-1.5">
              <span>Codelab</span>
              {lessonTitle && (
                <span className="hidden lg:inline text-xs font-normal truncate text-[#57534E] dark:text-[#94A3B8]">
                  - {lessonTitle}
                </span>
              )}
              {subtitle && (
                <span className="hidden sm:inline text-xs font-normal truncate text-[#57534E] dark:text-[#94A3B8]">
                  {lessonTitle ? '' : subtitle}
                </span>
              )}
            </p>
            {subtitle && (
              <p className="sm:hidden text-[11px] leading-tight truncate text-[#57534E] dark:text-[#94A3B8]">
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
              currentTab === 'desafios' ? activeNavBtnClasses : navBtnClasses
            }`}
          >
            Desafios
          </Link>
          <Link
            href="/playground"
            className={`px-3 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap ${
              currentTab === 'playground' ? activeNavBtnClasses : navBtnClasses
            }`}
          >
            Playground
          </Link>
          <Link
            href="/medalhas"
            onClick={handleProtectedNav}
            className={`px-3 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap ${
              currentTab === 'medalhas' ? activeNavBtnClasses : navBtnClasses
            }`}
          >
            Medalhas
          </Link>
          <Link
            href="/contato"
            className={`px-3 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap ${
              currentTab === 'contato' ? activeNavBtnClasses : navBtnClasses
            }`}
          >
            Contato
          </Link>
          <Link
            href="/painel"
            onClick={handleProtectedNav}
            className={`px-3 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap ${
              currentTab === 'painel' ? activeNavBtnClasses : navBtnClasses
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
            <div className="flex items-center gap-2 pl-2 border-l border-[#E7E5E4] dark:border-[#1E293B]">
              <button
                type="button"
                disabled={signingOut}
                onClick={() => void handleLogout()}
                className="press-tactile px-3.5 py-2 border rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap disabled:opacity-60 bg-[#B91C1C]/10 text-[#B91C1C] border-[#B91C1C]/25 dark:bg-[#F87171]/10 dark:text-[#F87171] dark:border-[#F87171]/25 transition-colors"
              >
                {signingOut ? 'Saindo...' : 'Sair'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E7E5E4] dark:border-[#1E293B]">
              <Link
                href="/login"
                className={`px-3.5 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap ${navBtnClasses}`}
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="press-tactile px-3.5 py-2 bg-[#047857] hover:bg-[#065F46] dark:bg-[#34D399] dark:hover:bg-[#6EE7B7] text-white dark:text-[#0B0F14] font-extrabold rounded-xl text-xs whitespace-nowrap transition-colors"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>

        {/* Barra Mobile */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              suppressHydrationWarning
              className={`px-2.5 py-2 border rounded-xl text-xs font-bold cursor-pointer ${navBtnClasses}`}
              title="Alternar modo claro e escuro"
              aria-label="Alternar modo claro e escuro"
            >
              <span suppressHydrationWarning>{isDark ? '☀' : '🌙'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Fechar Menu' : 'Abrir Menu'}
            className={`px-3 py-2 border rounded-xl font-bold text-xs cursor-pointer ${navBtnClasses} text-[#047857] dark:text-[#34D399]`}
          >
            {menuOpen ? 'Fechar' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b p-4 space-y-2 z-50 shadow-2xl bg-white border-[#E7E5E4] dark:bg-[#121821] dark:border-[#1E293B]">
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
              currentTab === 'desafios' ? activeNavBtnClasses : mobileItemClasses
            }`}
          >
            Desafios Práticos
          </Link>
          <Link
            href="/playground"
            onClick={() => setMenuOpen(false)}
            className={`block px-4 py-3 border rounded-xl text-xs font-semibold ${
              currentTab === 'playground' ? activeNavBtnClasses : mobileItemClasses
            }`}
          >
            Playground
          </Link>
          <Link
            href="/medalhas"
            onClick={handleProtectedNav}
            className={`block px-4 py-3 border rounded-xl text-xs font-semibold ${
              currentTab === 'medalhas' ? activeNavBtnClasses : mobileItemClasses
            }`}
          >
            Medalhas
          </Link>
          <Link
            href="/contato"
            onClick={() => setMenuOpen(false)}
            className={`block px-4 py-3 border rounded-xl text-xs font-medium ${
              currentTab === 'contato' ? activeNavBtnClasses : mobileItemClasses
            }`}
          >
            Contato
          </Link>
          <Link
            href="/painel"
            onClick={handleProtectedNav}
            className={`block px-4 py-3 border rounded-xl text-xs font-medium ${
              currentTab === 'painel' ? activeNavBtnClasses : mobileItemClasses
            }`}
          >
            Meu Painel
          </Link>
          {userId ? (
            <button
              type="button"
              disabled={signingOut}
              onClick={() => void handleLogout()}
              className="w-full text-left px-4 py-3 border rounded-xl text-xs font-medium cursor-pointer disabled:opacity-60 bg-[#B91C1C]/10 border-[#B91C1C]/25 text-[#B91C1C] dark:bg-[#F87171]/10 dark:border-[#F87171]/25 dark:text-[#F87171]"
            >
              {signingOut ? 'Saindo...' : 'Sair da Conta'}
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
                className="text-center px-4 py-3 bg-[#047857] hover:bg-[#065F46] dark:bg-[#34D399] dark:hover:bg-[#6EE7B7] text-white dark:text-[#0B0F14] rounded-xl text-xs font-extrabold transition-colors"
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