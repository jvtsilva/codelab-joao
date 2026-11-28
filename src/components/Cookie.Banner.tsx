'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  getCookieConsent,
  resetCookieConsent,
  setCookieConsent,
  type CookieConsentChoice,
} from '@/lib/cookieConsent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const syncState = () => {
      const current = getCookieConsent()
      setVisible(!current)
    }

    syncState()

    const handleChange = () => {
      syncState()
    }

    window.addEventListener('codelab:cookie-consent-changed', handleChange)
    window.addEventListener('storage', handleChange)

    return () => {
      window.removeEventListener('codelab:cookie-consent-changed', handleChange)
      window.removeEventListener('storage', handleChange)
    }
  }, [])

  function handleSelect(choice: CookieConsentChoice) {
    setCookieConsent(choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      aria-label="Aviso de cookies e preferências"
      className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-3xl rounded-2xl border p-4 sm:p-5 shadow-lg bg-white/95 border-[#E7E5E4] text-[#18181B] dark:bg-[#121821]/95 dark:border-[#1E293B] dark:text-[#F1F5F9] backdrop-blur"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-extrabold text-sm">
            Cookies e armazenamento local
          </p>
          <p className="text-[#57534E] dark:text-[#94A3B8]">
            Usamos apenas recursos essenciais para sessão e funcionamento do estúdio, além de preferências opcionais de interface. Veja os detalhes na{' '}
            <Link
              href="/privacidade"
              className="underline font-semibold text-[#047857] dark:text-[#34D399]"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleSelect('essential_only')}
            className="press-tactile px-3.5 py-2 rounded-xl text-xs font-bold border border-[#E7E5E4] dark:border-[#1E293B] bg-[#F8F7F4] dark:bg-[#0E131A] text-[#18181B] dark:text-[#F1F5F9] hover:border-[#047857] dark:hover:border-[#34D399] transition-colors cursor-pointer"
          >
            Apenas essenciais
          </button>

          <button
            type="button"
            onClick={() => handleSelect('all_preferences')}
            className="press-tactile px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer bg-[#047857] hover:bg-[#065F46] dark:bg-[#34D399] dark:hover:bg-[#6EE7B7] text-white dark:text-[#0B0F14] transition-colors"
          >
            Aceitar preferências
          </button>
        </div>
      </div>
    </aside>
  )
}

export { resetCookieConsent }