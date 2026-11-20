'use client'

import { useEffect, useLayoutEffect, useMemo, useState, Suspense } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type TemaVerificar = 'dark' | 'light'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function VerificarEmailContent({
  tema,
  alternarTema,
}: {
  tema: TemaVerificar
  alternarTema: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  const handleConfirmarConta = async () => {
    if (!code) {
      setErrorMessage('Código de confirmação não encontrado ou inválido.')
      return
    }

    setLoading(true)
    setErrorMessage('')

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error

      router.push('/dashboard')
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Erro ao confirmar a conta. O link pode ter expirado.'
      setErrorMessage(msg)
      setLoading(false)
    }
  }

  const isLight = tema === 'light'

  const cardClasses = isLight
    ? 'bg-white border-stone-200 text-stone-900 shadow-xl duration-0'
    : 'bg-gray-900 border-gray-800 text-white shadow-2xl duration-0'

  const btnClasses = isLight
    ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 duration-0'
    : 'bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border-gray-800 duration-0'

  const textMutedClasses = isLight ? 'text-stone-600 duration-0' : 'text-gray-400 duration-0'
  const textSubtleClasses = isLight ? 'text-stone-500 duration-0' : 'text-gray-500 duration-0'
  const accentGreenClasses = isLight ? 'text-emerald-700 duration-0' : 'text-emerald-400 duration-0'
  const accentAmberClasses = isLight ? 'text-amber-700 duration-0' : 'text-amber-400'
  const accentRedClasses = isLight ? 'text-red-700 duration-0' : 'text-red-400'

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-4 duration-0 selection:bg-emerald-500 selection:text-gray-950 ${
        isLight ? 'bg-stone-50 text-stone-900' : 'bg-gray-950 text-white'
      }`}
    >
      {/* Topo discreto */}
      <header className="max-w-md w-full mx-auto pt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`px-2.5 py-1.5 font-bold text-xs rounded-lg border shrink-0 duration-0 ${
              isLight
                ? 'bg-emerald-50 text-emerald-700 border-emerald-600/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
          >
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
            <span className="hidden sm:inline">{isLight ? '🌙 Escuro' : '☀ Claro'}</span>
            <span className="sm:hidden">{isLight ? '🌙' : '☀'}</span>
          </button>

          <Link
            href="/login"
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl border ${btnClasses}`}
          >
            Login
          </Link>
        </div>
      </header>

      {/* Card Central */}
      <main className="flex-1 flex flex-col items-center justify-center my-auto py-4">
        <div className={`max-w-md w-full border p-6 sm:p-8 rounded-3xl text-center space-y-6 ${cardClasses}`}>
          <div
            className={`w-14 h-14 border rounded-2xl flex items-center justify-center mx-auto text-2xl duration-0 ${
              isLight
                ? 'bg-emerald-50 border-emerald-600/25 text-emerald-700'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            ✉️
          </div>

          <div className="space-y-2">
            <span
              className={`inline-block px-3 py-1 border font-bold text-[11px] uppercase tracking-wider rounded-full duration-0 ${
                isLight
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-600/25'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              Ativação de conta
            </span>
            <h1 className="text-2xl font-black tracking-tight">Confirmação de E-mail</h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${textMutedClasses}`}>
              Confirme seu e-mail para ativar sua conta e acessar a plataforma.
            </p>
          </div>

          {errorMessage && (
            <div
              className={`p-3 text-xs rounded-xl border text-left duration-0 ${
                isLight
                  ? 'bg-red-50 border-red-600/30 text-red-700'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              <span className={accentRedClasses}>{errorMessage}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirmarConta}
            disabled={loading || !code}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold rounded-xl text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                Confirmando conta...
              </>
            ) : (
              'Confirmar e acessar ⚡'
            )}
          </button>

          {!code && (
            <div className="space-y-2">
              <p className={`text-xs ${accentAmberClasses}`}>
                Link sem código de verificação. Abra o link mais recente enviado ao seu e-mail.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs">
                <Link href="/login" className={`${accentGreenClasses} font-semibold hover:underline`}>
                  Ir para o Login
                </Link>
                <Link href="/cadastro" className={`${textMutedClasses} hover:underline`}>
                  Criar nova conta
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className={`max-w-md w-full mx-auto pb-2 text-center text-xs ${textSubtleClasses}`}>
        <p>Codelab João • Aprendizado prático de JavaScript</p>
      </footer>
    </div>
  )
}

export default function VerificarEmailPage() {
  const [tema, setTema] = useState<TemaVerificar>('dark')

  useIsomorphicLayoutEffect(() => {
    const temaSalvo = localStorage.getItem('codelab_tema_aula')
    if (temaSalvo === 'light' || temaSalvo === 'dark') {
      setTema(temaSalvo)
    }
  }, [])

  const alternarTema = () => {
    setTema((atual) => {
      const proximo: TemaVerificar = atual === 'dark' ? 'light' : 'dark'
      if (typeof window !== 'undefined') {
        localStorage.setItem('codelab_tema_aula', proximo)
      }
      return proximo
    })
  }

  const isLight = tema === 'light'

  return (
    <Suspense
      fallback={
        <div
          className={`min-h-screen flex items-center justify-center text-xs duration-0 ${
            isLight ? 'bg-stone-50 text-stone-600' : 'bg-gray-950 text-gray-400'
          }`}
        >
          Carregando verificação...
        </div>
      }
    >
      <VerificarEmailContent tema={tema} alternarTema={alternarTema} />
    </Suspense>
  )
}