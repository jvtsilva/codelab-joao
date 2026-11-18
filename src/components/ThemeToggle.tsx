'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    // Verifica o que está salvo no navegador ao carregar a página
    const savedTheme = localStorage.getItem('codelab_theme')
    
    if (savedTheme === 'light') {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    } else {
      // Padrão é escuro
      setDarkMode(true)
      document.documentElement.classList.add('dark')
      localStorage.setItem('codelab_theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    if (darkMode) {
      // Muda para o modo claro
      document.documentElement.classList.remove('dark')
      localStorage.setItem('codelab_theme', 'light')
      setDarkMode(false)
    } else {
      // Muda para o modo escuro
      document.documentElement.classList.add('dark')
      localStorage.setItem('codelab_theme', 'dark')
      setDarkMode(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-amber-600 dark:text-amber-400 font-bold transition hover:scale-105 cursor-pointer flex items-center justify-center shadow-md"
      title="Alternar Tema"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  )
}