'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ArenaPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('Visitante')
  const [userXp, setUserXp] = useState<number>(0)
  const [menuOpen, setMenuOpen] = useState(false)

  // Estados do desafio interativo
  const [codeAnswer, setCodeAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [challengeCompleted, setChallengeCompleted] = useState(false)

  useEffect(() => {
    async function loadUserArena() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const currentUserId = session.user.id
        setUserId(currentUserId)
        const meta = session.user.user_metadata
        setUserName(meta?.full_name || meta?.name || 'Aluno')

        // Verificar se já concluiu este desafio no Supabase
        const { data } = await supabase
          .from('user_challenges')
          .select('completed')
          .eq('user_id', currentUserId)
          .eq('challenge_id', 'challenge-1')
          .single()

        if (data && data.completed) {
          setChallengeCompleted(true)
        }
      }

      if (typeof window !== 'undefined') {
        const savedXp = localStorage.getItem('codelab_user_xp')
        if (savedXp) setUserXp(Number(savedXp))
      }
    }
    loadUserArena()
  }, [])

  const handleTestChallenge = async () => {
    const cleanCode = codeAnswer.trim().replace(/\s+/g, ' ')

    // Validação do código esperado: const cidadeNatal = "..."
    const expectedPattern = /const\s+cidadeNatal\s*=\s*(["'])(?:(?!\1).)*\1\s*;?/i

    if (!cleanCode) {
      setFeedback('❌ Escreva seu código no campo acima antes de testar.')
      setSuccess(false)
      return
    }

    if (expectedPattern.test(cleanCode) || cleanCode.includes('cidadeNatal')) {
      setSuccess(true)
      setFeedback('🎉 Parabéns! Resposta correta. Missão concluída com sucesso!')
      
      if (!challengeCompleted) {
        setChallengeCompleted(true)
        const newXp = userXp + 50
        setUserXp(newXp)

        if (typeof window !== 'undefined') {
          localStorage.setItem('codelab_user_xp', String(newXp))
        }

        if (userId) {
          await supabase.from('user_challenges').upsert({
            user_id: userId,
            challenge_id: 'challenge-1',
            completed: true,
            xp_earned: 50,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,challenge_id' })
        }
      }
    } else {
      setSuccess(false)
      setFeedback('❌ Incorreto. Lembre-se de utilizar a palavra-chave `const` e a variável `cidadeNatal`.')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-amber-500 selection:text-gray-950 relative overflow-x-hidden">
      
      {/* Header Responsivo da Arena */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        
        {/* Lado Esquerdo: Ícone de Espada Estático + Título */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-amber-500/20 text-amber-400 font-bold text-sm rounded-xl shrink-0 border border-amber-500/30 flex items-center justify-center select-none shadow-lg shadow-amber-500/10">
            ⚔️
          </div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Arena <span className="text-amber-400 font-normal">Codelab</span>
          </h1>
        </div>

        {/* Badges e Botões Desktop */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-inner">
            <span>⭐</span> {userXp} XP
          </div>

          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 font-semibold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            Trilha
          </Link>

          {userId ? (
            <Link
              href="/painel"
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-emerald-400 border border-emerald-500/30 transition font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚙️</span> Painel
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold transition rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Entrar
            </Link>
          )}
        </div>

        {/* Botão Menu Hamburguer (Mobile) */}
        <div className="flex sm:hidden items-center gap-2">
          <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[11px] rounded-lg">
            {userXp} XP
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-amber-400 font-bold transition cursor-pointer active:scale-95"
            aria-label="Menu"
          >
            <span className="text-xl leading-none">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </header>

      {/* Menu Dropdown Mobile */}
      {menuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-2.5 z-50 shadow-2xl animate-fadeIn">
          <Link 
            href="/dashboard" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300 hover:text-white"
          >
            <span>📖 Voltar para a Trilha</span>
            <span>→</span>
          </Link>

          {userId ? (
            <>
              <Link
                href="/painel"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 bg-gray-950 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-400"
              >
                <span>⚙️ Meu Painel de Controle</span>
                <span>→</span>
              </Link>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl text-xs"
              >
                <span>🚪 Sair da Conta</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link 
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 bg-gray-950 border border-gray-800 text-center font-semibold rounded-xl text-xs text-gray-300"
              >
                Entrar
              </Link>
              <Link 
                href="/cadastro"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 bg-emerald-500 text-gray-950 text-center font-extrabold rounded-xl text-xs shadow-lg"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Main Content da Arena */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-20">
        
        <div className="space-y-3 bg-gradient-to-r from-amber-500/10 via-gray-900 to-gray-900 border border-amber-500/20 p-5 sm:p-6 rounded-2xl">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            Arena de Desafios • Modo Jogo ⚔️
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Teste sua Lógica de Programação
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Resolva o desafio de código abaixo, pratique seus conhecimentos em JavaScript e acumule pontos de XP para o seu perfil.
          </p>
        </div>

        {/* Card do Desafio Prático */}
        <div className="p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold rounded-md">
              Desafio #1 • Fácil ⚡
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">+50 XP</span>
              {challengeCompleted && (
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] rounded-md border border-emerald-500/30">
                  Concluído ✓
                </span>
              )}
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white">Criando e Exibindo Variáveis</h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Escreva um trecho de código JavaScript que declare uma constante chamada <code className="text-amber-400 bg-gray-950 px-1.5 py-0.5 rounded">cidadeNatal</code> com o valor <code className="text-amber-400 bg-gray-950 px-1.5 py-0.5 rounded">&quot;São Paulo&quot;</code>.
          </p>

          <div className="space-y-2 pt-2">
            <label className="text-xs text-gray-400 font-medium">Editor de Código:</label>
            <textarea
              rows={3}
              placeholder='const cidadeNatal = "São Paulo";'
              value={codeAnswer}
              onChange={(e) => setCodeAnswer(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 p-4 rounded-xl text-xs sm:text-sm text-amber-400 font-mono focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="pt-1">
            <button
              onClick={handleTestChallenge}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer text-center"
            >
              🚀 Testar e Enviar Código
            </button>
          </div>

          {feedback && (
            <div className={`p-4 rounded-xl border font-mono text-xs space-y-1 ${success ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Resultado da Execução:</div>
              <p>{feedback}</p>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}