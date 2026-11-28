'use client'

import { useCallback, useLayoutEffect, useState } from 'react'

export const THEME_STORAGE_KEY = 'codelab_tema_aula'

function applyDocumentTheme(escuro: boolean) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', escuro)
  document.documentElement.style.backgroundColor = escuro ? '#0B0F14' : '#F8F7F4'
}

function readStoredTheme(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const salvo = window.localStorage.getItem(THEME_STORAGE_KEY)
    return salvo !== 'light'
  } catch {
    return true
  }
}

function writeStoredTheme(escuro: boolean) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, escuro ? 'dark' : 'light')
  } catch {
    // Ignora bloqueio de storage pelo navegador
  }
}

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => readStoredTheme())

  useLayoutEffect(() => {
    applyDocumentTheme(isDark)
    writeStoredTheme(isDark)
  }, [isDark])

  const alternarTema = useCallback(() => {
    setIsDark((atual) => !atual)
  }, [])

  return { isDark, alternarTema }
}