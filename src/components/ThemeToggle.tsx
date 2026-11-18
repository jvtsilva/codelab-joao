'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setMounted(true)
    const currentTheme = localStorage.getItem('codelab_theme')
    if (currentTheme === 'light') {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    } else {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('codelab_theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('codelab_theme', 'dark')
      setIsDark(true)
    }
  }

  // Evita renderizar desalinhado no servidor
  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-amber-600 dark:text-amber-400 font-bold transition hover:scale-105 cursor-pointer flex items-center justify-center shadow-md"
      title="Alternar Tema"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}