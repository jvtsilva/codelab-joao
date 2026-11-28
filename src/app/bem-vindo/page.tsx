'use client'

import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import { LabSurface } from '@/components/LabSurface'

export default function WelcomePage() {
  const { isDark, alternarTema } = useTheme()

  const btnTemaClasses =
    'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800'

  const textMutedClasses = 'text-stone-600 dark:text-gray-400'
  const textSubtleClasses = 'text-stone-500 dark:text-gray-500'
  const accentGreenClasses = 'text-emerald-700 dark:text-emerald-400'

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white">
      <header className="max-w-md w-full mx-auto pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1.5 font-bold text-xs rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-600/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
            JS
          </span>
          <span className="font-bold text-sm tracking-wide">
            Codelab <span className={`${accentGreenClasses} font-normal`}>João</span>
          </span>
        </div>

        <button
          type="button"
          onClick={alternarTema}
          suppressHydrationWarning
          className={`px-3 py-2 border text-xs font-semibold rounded-xl cursor-pointer transition-colors ${btnTemaClasses}`}
          title="Alternar modo claro e escuro"
          aria-label="Alternar modo claro e escuro"
        >
          <span suppressHydrationWarning>{isDark ? '☀ Claro' : '🌙 Escuro'}</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center my-auto py-4">
        <LabSurface
          variant="card"
          className="max-w-md w-full p-8 text-center space-y-6 shadow-xl dark:shadow-2xl"
        >
          <div className="w-16 h-16 border rounded-2xl flex items-center justify-center mx-auto text-2xl font-black bg-emerald-50 border-emerald-600/25 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400">
            🎉
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 border font-bold text-[11px] uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              Conta criada
            </span>
            <h1 className="text-2xl font-black tracking-tight">
              Bem-vindo ao Codelab!
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${textMutedClasses}`}>
              Tudo pronto por aqui. Comece pela trilha prática de JavaScript no seu ritmo.
            </p>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/dashboard"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-500/20 block cursor-pointer transition-colors"
            >
              Ir para a Trilha ⚡
            </Link>

            <Link
              href="/desafios"
              className={`w-full py-2.5 border font-semibold rounded-xl text-xs block cursor-pointer transition-colors ${btnTemaClasses}`}
            >
              Explorar Desafios ⚔️
            </Link>
          </div>
        </LabSurface>
      </main>

      <footer className={`max-w-md w-full mx-auto pb-2 text-center text-xs ${textSubtleClasses}`}>
        <p>Codelab João • Aprendizado prático de JavaScript</p>
      </footer>
    </div>
  )
}