'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    // Verifica se já existe preferência salva ou usa o escuro como padrão
    const savedTheme = localStorage.getItem('codelab_theme')
    if (savedTheme === 'light') {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    } else {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('codelab_theme', 'light')
      setDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('codelab_theme', 'dark')
      setDarkMode(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 bg-gray-900 dark:bg-gray-800 border border-gray-800 dark:border-gray-700 rounded-xl text-amber-400 font-bold transition hover:scale-105 cursor-pointer flex items-center justify-center shadow-md"
      title="Alternar Tema"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  )
}