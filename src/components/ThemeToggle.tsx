'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('codelab_theme')
    if (savedTheme === 'light') {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
      document.body.style.backgroundColor = '#f9fafb'
      document.body.style.color = '#030712'
    } else {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
      document.body.style.backgroundColor = '#030712'
      document.body.style.color = '#f9fafb'
    }
  }, [])

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('codelab_theme', 'light')
      document.body.style.backgroundColor = '#f9fafb'
      document.body.style.color = '#030712'
      setDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('codelab_theme', 'dark')
      document.body.style.backgroundColor = '#030712'
      document.body.style.color = '#f9fafb'
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