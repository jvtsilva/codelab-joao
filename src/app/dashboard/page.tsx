'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUserEmail(session.user.email || '')
      }
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col transition-opacity duration-700 opacity-100 overflow-x-hidden">
      {/* Header / Navbar Responsivo */}
      <header className="border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-md">
            JS
          </span>
          <h1 className="font-bold text-base sm:text-lg tracking-wide truncate">
            Codelab <span className="text-emerald-400 text-xs sm:text-sm font-normal">João</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Link para ir pro Painel de Controle */}
          <Link 
            href="/painel" 
            className="text-xs text-gray-400 hover:text-emerald-400 transition flex items-center gap-1 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800 shrink-0"
          >
            <span>📊</span>
            <span className="hidden sm:inline">Painel de Controle</span>
            <span className="sm:hidden">Painel</span>
          </Link>

          <span className="text-xs text-gray-400 hidden lg:inline truncate max-w-[150px]">{userEmail}</span>
          
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition font-medium rounded-lg text-xs cursor-pointer shrink-0"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Content - Trilha de Estudos */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Topo da Trilha */}
        <div className="space-y-3">
          <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block">
            Área do Aluno • Estudos
          </span>
          <div className="flex flex-col sm:flex-row gap-3">
            <span className="px-4 py-2 bg-emerald-500 text-gray-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 text-center sm:text-left">
              Fundamentos de JavaScript
            </span>
            <span className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-500 font-medium rounded-xl text-sm flex items-center justify-center sm:justify-start gap-2">
              🔒 Controle de Fluxo e Lógica (Em breve)
            </span>
          </div>
        </div>

        {/* Descrição do Curso */}
        <div className="space-y-2 pt-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Fundamentos de JavaScript</h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Os primeiros passos essenciais para entender como a linguagem funciona e como estruturar dados na memória do computador.
          </p>
        </div>

        {/* Lista de Tópicos */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Tópicos e Aulas
          </h3>

          <div className="space-y-3">
            {/* Tópico 1 */}
            <div className="p-4 bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition rounded-xl flex items-center justify-between gap-3 cursor-pointer">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center font-bold text-sm text-gray-300 shrink-0">
                  1
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-white truncate">Variáveis e Atribuição</h4>
                  <p className="text-xs text-gray-400">Teoria e prática</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm shrink-0">→</span>
            </div>

            {/* Tópico 2 */}
            <div className="p-4 bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition rounded-xl flex items-center justify-between gap-3 cursor-pointer">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center font-bold text-sm text-gray-300 shrink-0">
                  2
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-white truncate">Tipos de Dados Básicos</h4>
                  <p className="text-xs text-gray-400">Teoria e prática</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm shrink-0">→</span>
            </div>

            {/* Tópico 3 */}
            <div className="p-4 bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition rounded-xl flex items-center justify-between gap-3 cursor-pointer">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center font-bold text-sm text-gray-300 shrink-0">
                  3
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-white truncate">Operadores Matemáticos</h4>
                  <p className="text-xs text-gray-400">Teoria e prática</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm shrink-0">→</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}