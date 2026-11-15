'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [lessonOneCompleted, setLessonOneCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUserAndProgress() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const currentUserId = session.user.id
        setUserId(currentUserId)

        // Buscar progresso da Aula 1 no Supabase se estiver logado
        const { data } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', currentUserId)
          .eq('lesson_id', 'lesson-1')
          .single()

        if (data && data.completed) {
          setLessonOneCompleted(true)
        }
      }

      setLoading(false)
    }
    checkUserAndProgress()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col transition-opacity duration-700 opacity-100 overflow-x-hidden selection:bg-emerald-500 selection:text-gray-950">
      
      {/* Header Responsivo */}
      <header className="border-b border-gray-800 bg-gray-950/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-md shrink-0">
            JS
          </span>
          <h1 className="font-bold text-base sm:text-lg tracking-wide truncate">
            Codelab <span className="text-emerald-400 text-xs sm:text-sm font-normal">João</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link 
            href="/contato" 
            className="text-xs text-gray-400 hover:text-emerald-400 transition flex items-center gap-1 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800 shrink-0 hidden xs:flex"
          >
            <span>💬</span>
            <span className="hidden sm:inline">Contato</span>
          </Link>

          {userId ? (
            <div className="flex items-center gap-2">
              <Link
                href="/painel"
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-emerald-400 border border-emerald-500/30 transition font-semibold rounded-lg text-xs shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>⚙️</span> Painel
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition font-medium rounded-lg text-xs cursor-pointer shrink-0"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold transition rounded-lg text-xs shrink-0"
            >
              Entrar
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6 pb-20">
        
        {!userId && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-emerald-300 text-center sm:text-left">
              Modo Visitante Ativo: você pode navegar livremente pela trilha de estudos, mas faça login para registrar suas conclusões oficiais.
            </span>
            <Link href="/login" className="px-3.5 py-1.5 bg-emerald-500 text-gray-950 font-bold rounded-lg shrink-0 text-center">
              Fazer Login / Cadastro
            </Link>
          </div>
        )}

        {/* Banner de Boas-Vindas & Arena */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-3 bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 p-5 sm:p-6 rounded-2xl">
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase block">
              Trilha de Ensino • Módulo 1 🚀
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Fundamentos de JavaScript</h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Aprenda a lógica de programação passo a passo nas aulas e teste suas habilidades na Arena de Desafios.
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 via-gray-900 to-gray-900 border border-amber-500/20 p-5 sm:p-6 rounded-2xl flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Modo Jogo ⚔️</span>
              <h3 className="font-bold text-base text-white">Arena de Desafios</h3>
              <p className="text-xs text-gray-400">Resolva missões de código e ganhe XP.</p>
            </div>
            <Link 
              href="/desafios"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs rounded-xl transition text-center shadow-lg shadow-amber-500/20 block"
            >
              Entrar na Arena ⚡
            </Link>
          </div>
        </div>

        {/* Lista de Aulas do Módulo 1 */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Módulo 1 • Aulas Disponíveis
            </h3>
            <span className="text-xs text-gray-500">
              {loading ? 'Carregando...' : lessonOneCompleted ? '1/1 Aula concluída' : '0/1 Aula concluída'}
            </span>
          </div>

          <div className="space-y-3">
            <Link 
              href="/dashboard/aula/1"
              className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer group block ${
                lessonOneCompleted 
                  ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60' 
                  : 'bg-gray-900/80 border-gray-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition shrink-0 ${
                  lessonOneCompleted
                    ? 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-gray-800 border border-gray-700 text-gray-300 group-hover:text-emerald-400 group-hover:border-emerald-500/40'
                }`}>
                  {lessonOneCompleted ? '✓' : '1'}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-400 transition truncate">
                      Variáveis e Atribuição: As Caixas de Memória
                    </h4>
                    {lessonOneCompleted && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-full border border-emerald-500/30 shrink-0">
                        Concluída
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">Teoria leve e missão prática guiada</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 group-hover:text-emerald-400 transition shrink-0">
                <span className="hidden sm:inline">Assistir Aula</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}