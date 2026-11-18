'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ARENA_CHALLENGES } from '@/data/challenges'

export default function ArenaPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userXp, setUserXp] = useState<number>(0)
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function loadUserArena() {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        const currentUserId = session.user.id
        setUserId(currentUserId)

        const { data: challenges, error } = await supabase
          .from('user_challenges')
          .select('challenge_id, completed, xp_earned')
          .eq('user_id', currentUserId)

        if (!error && challenges) {
          const totalXpFromDb = challenges.reduce((acc, curr) => acc + (curr.xp_earned || 0), 0)
          setUserXp(totalXpFromDb)
          setCompletedIds(challenges.filter(c => c.completed).map(c => c.challenge_id))

          if (typeof window !== 'undefined') {
            localStorage.setItem('codelab_user_xp', String(totalXpFromDb))
          }
        }
      } else if (typeof window !== 'undefined') {
        const savedXp = localStorage.getItem('codelab_user_xp')
        if (savedXp) setUserXp(Number(savedXp))

        const localDone: string[] = []
        ARENA_CHALLENGES.forEach((ch) => {
          if (localStorage.getItem(`codelab_visitante_${ch.id}`)) {
            localDone.push(ch.id)
          }
        })
        setCompletedIds(localDone)
      }
    }
    loadUserArena()
  }, [])

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('codelab_user_xp')
    }
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-amber-500 selection:text-gray-950 relative overflow-x-hidden animate-fadeIn">
      
      {/* Header Padronizado e Unificado */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-amber-500/20 text-amber-400 font-bold text-sm rounded-xl shrink-0 border border-amber-500/30 flex items-center justify-center select-none shadow-lg shadow-amber-500/10">
            ⚔️
          </div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Arena <span className="text-amber-400 font-normal">Codelab</span>
          </h1>
        </div>

        {/* Menu Desktop Unificado */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link href="/dashboard" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">📖 Trilha</Link>
          <Link href="/desafios" className="px-3 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold">⚔️ Arena</Link>
          <Link href="/ranking" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">🏆 Ranking</Link>
          <Link href="/medalhas" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">🎖️ Medalhas</Link>
          <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-1.5">
            <span>⭐</span> {userXp} XP
          </div>
          {userId ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
              <Link href="/painel" className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold">⚙️ Painel</Link>
              <button onClick={handleLogout} className="px-3.5 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold cursor-pointer">Sair</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
              <Link href="/login" className="px-3.5 py-2 bg-gray-900 text-gray-300 border border-gray-800 rounded-xl text-xs">Entrar</Link>
              <Link href="/cadastro" className="px-3.5 py-2 bg-emerald-500 text-gray-950 font-extrabold rounded-xl text-xs">Criar Conta</Link>
            </div>
          )}
        </div>

        {/* Botão Hambúrguer Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[11px] rounded-lg">
            {userXp} XP
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-amber-400 font-bold">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Menu Dropdown Mobile Unificado */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-2 z-50 shadow-2xl animate-fadeIn">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">📖 Ir para a Trilha</Link>
          <Link href="/desafios" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-amber-500/30 rounded-xl text-xs text-amber-400 font-semibold">⚔️ Arena de Desafios</Link>
          <Link href="/ranking" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">🏆 Ranking Geral</Link>
          <Link href="/medalhas" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">🎖️ Painel de Medalhas</Link>
          {userId ? (
            <>
              <Link href="/painel" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium">⚙️ Meu Painel</Link>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-left px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl text-xs">🚪 Sair da Conta</button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="px-4 py-3 bg-gray-950 border border-gray-800 text-center font-semibold rounded-xl text-xs text-gray-300">Entrar</Link>
              <Link href="/cadastro" onClick={() => setMenuOpen(false)} className="px-4 py-3 bg-emerald-500 text-gray-950 text-center font-extrabold rounded-xl text-xs">Criar Conta</Link>
            </div>
          )}
        </div>
      )}

      {/* Vitrine dos Desafios */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-20">
        <div className="space-y-3 bg-gradient-to-r from-amber-500/10 via-gray-900 to-gray-900 border border-amber-500/20 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Arena de Desafios • Modo Jogo ⚔️</span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Teste sua Lógica de Programação</h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Escolha um desafio abaixo para entrar na sala de missão, escrever código e acumular XP para subir no ranking.
            </p>
          </div>
          <Link href="/ranking" className="px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-extrabold text-xs rounded-xl transition flex items-center gap-2 shrink-0">
            🏆 Ver Ranking Geral
          </Link>
        </div>

        <div className="space-y-3">
          {ARENA_CHALLENGES.map((challenge) => {
            const isDone = completedIds.includes(challenge.id)
            return (
              <Link
                key={challenge.id}
                href={`/desafios/${challenge.slug}`}
                className="p-4 sm:p-5 bg-gray-900/90 border border-gray-800 hover:border-amber-500/50 rounded-2xl transition flex items-center justify-between gap-3 group block"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                    isDone 
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {isDone ? '✓' : challenge.number}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition truncate">
                        {challenge.title}
                      </h3>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded shrink-0">
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      +{challenge.xp} XP • {challenge.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-400 group-hover:underline shrink-0">
                  {isDone ? 'Revisar ⚡' : 'Jogar ⚡'}
                </span>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}