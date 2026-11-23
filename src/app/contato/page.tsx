'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'

const STORAGE_KEY = 'codelab_tema_aula'

export default function ContatoPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(true)
  const [copiado, setCopiado] = useState(false)

  const whatsappNumber = '5519995200014'
  const instagramUser = 'jvsilva.dev'
  const emailContato = 'codelab.joao@gmail.com'

  const mensagemWhatsapp = encodeURIComponent(
    'Olá João, estou entrando em contato através da plataforma Codelab.'
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensagemWhatsapp}`
  const instagramUrl = `https://instagram.com/${instagramUser}`

  useLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  useEffect(() => {
    let active = true

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!active) return
      setUserId(session?.user?.id ?? null)
    }

    loadSession()

    return () => {
      active = false
    }
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

  const handleVoltar = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/dashboard')
    }
  }

  const handleCopiarEmail = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(emailContato)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-emerald-500 selection:text-gray-950">
      <Navbar
        subtitle="Contato e Suporte"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center gap-4">
        <div className="w-full flex items-center justify-start">
          <button
            type="button"
            onClick={handleVoltar}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl border flex items-center gap-1.5 cursor-pointer active:scale-95 bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-950 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white dark:border-gray-800"
          >
            <span>← Voltar</span>
          </button>
        </div>

        <div className="w-full border p-5 sm:p-8 rounded-3xl space-y-6 bg-white border-stone-200 text-stone-900 shadow-xl dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:shadow-2xl">
          <div className="text-center space-y-3 flex flex-col items-center">
            <span className="inline-block px-3.5 py-1 border font-bold text-[11px] uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              Contato e Suporte 💬
            </span>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight">
              Fale com o Codelab
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed max-w-sm mx-auto text-stone-600 dark:text-gray-400">
              Dúvidas sobre alguma aula, problemas na plataforma ou sugestões? Escolha o canal que preferir.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-4 border rounded-2xl flex items-center gap-3.5 sm:gap-4 group cursor-pointer bg-emerald-50/70 hover:bg-emerald-50 border-emerald-600/25 hover:border-emerald-600/50 text-emerald-900 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/15 dark:border-emerald-500/30 dark:hover:border-emerald-500/60 dark:text-emerald-300 dark:shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0 bg-emerald-100 border-emerald-600/25 dark:bg-emerald-500/20 dark:border-emerald-500/30">
                💬
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 dark:text-gray-400">
                  Atendimento direto
                </p>
                <p className="font-bold text-sm sm:text-base truncate text-stone-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                  WhatsApp
                </p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-4 border rounded-2xl flex items-center gap-3.5 sm:gap-4 group cursor-pointer bg-pink-50/70 hover:bg-pink-50 border-pink-600/25 hover:border-pink-600/50 text-pink-900 dark:bg-pink-500/5 dark:hover:bg-pink-500/15 dark:border-pink-500/30 dark:hover:border-pink-500/60 dark:text-pink-300 dark:shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0 bg-pink-100 border-pink-600/25 dark:bg-pink-500/20 dark:border-pink-500/30">
                📸
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 dark:text-gray-400">
                  Instagram
                </p>
                <p className="font-bold text-sm sm:text-base truncate text-stone-900 group-hover:text-pink-700 dark:text-white dark:group-hover:text-pink-400">
                  @{instagramUser}
                </p>
              </div>
            </a>

            {/* E-mail + Copiar */}
            <div className="w-full py-4 px-4 border rounded-2xl flex items-center justify-between gap-3 bg-blue-50/70 border-blue-600/25 text-blue-900 dark:bg-blue-500/5 dark:border-blue-500/30 dark:text-blue-300 dark:shadow-lg">
              <a
                href={`mailto:${emailContato}`}
                className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0 bg-blue-100 border-blue-600/25 dark:bg-blue-500/20 dark:border-blue-500/30">
                  ✉️
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 dark:text-gray-400">
                    E-mail
                  </p>
                  <p className="font-bold text-xs sm:text-sm truncate text-stone-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                    {emailContato}
                  </p>
                </div>
              </a>

              <button
                type="button"
                onClick={handleCopiarEmail}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-950 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white dark:border-gray-800"
              >
                {copiado ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-stone-200 dark:border-gray-800/80">
            <p className="text-[11px] pt-3 text-stone-500 dark:text-gray-500">
              Respondo assim que possível. Bons estudos!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 dark:text-gray-500">
        <p>Codelab João • Aprendizado prático de JavaScript</p>
      </footer>
    </div>
  )
}