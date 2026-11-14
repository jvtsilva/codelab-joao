'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header / Navbar */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-md">
            JS
          </span>
          <h1 className="font-bold text-lg tracking-wide">
            Codelab <span className="text-emerald-400 text-sm font-normal">João</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:inline">{userEmail}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition font-medium rounded-lg text-xs cursor-pointer"
          >
            Sair da conta
          </button>
        </div>
      </header>

      {/* Main Content - Trilha de Estudos */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        {/* Topo da Trilha */}
        <div className="space-y-3">
          <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Trilha de Estudos
          </span>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-emerald-500 text-gray-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20">
              Fundamentos de JavaScript
            </span>
            <span className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-500 font-medium rounded-xl text-sm flex items-center gap-2">
              🔒 Controle de Fluxo e Lógica (Em breve)
            </span>
          </div>
        </div>

        {/* Descrição do Curso */}
        <div className="space-y-2 pt-2">
          <h2 className="text-3xl font-extrabold text-white">Fundamentos de JavaScript</h2>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            Os primeiros passos essenciais para entender como a linguagem funciona e como estruturar dados na memória do computador.
          </p>
        </div>

        {/* Lista de Tópicos */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Tópicos e Avaliação
          </h3>

          <div className="space-y-3">
            {/* Tópico 1 */}
            <div className="p-4 bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center font-bold text-sm text-gray-300">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Variáveis e Atribuição</h4>
                  <p className="text-xs text-gray-400">Teoria e prática</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">→</span>
            </div>

            {/* Tópico 2 */}
            <div className="p-4 bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center font-bold text-sm text-gray-300">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Tipos de Dados Básicos</h4>
                  <p className="text-xs text-gray-400">Teoria e prática</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">→</span>
            </div>

            {/* Tópico 3 */}
            <div className="p-4 bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center font-bold text-sm text-gray-300">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Operadores Matemáticos</h4>
                  <p className="text-xs text-gray-400">Teoria e prática</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">→</span>
            </div>

            {/* Tópico Bloqueado */}
            <div className="p-4 bg-gray-900/40 border border-gray-800/50 rounded-xl flex items-center justify-between opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center text-sm">
                  🔒
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-400">Novos tópicos</h4>
                  <p className="text-xs text-gray-500">Em breve na plataforma</p>
                </div>
              </div>
              <span className="text-gray-600 text-sm">🔒</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}