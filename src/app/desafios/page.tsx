'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ArenaPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userXp, setUserXp] = useState<number>(0)
  const [menuOpen, setMenuOpen] = useState(false)

  // Começa com todos os desafios fechados por padrão
  const [openChallengeId, setOpenChallengeId] = useState<string | null>(null)

  // Estados do Desafio #1 (Teoria)
  const [selectedOption1, setSelectedOption1] = useState<string | null>(null)
  const [feedback1, setFeedback1] = useState<string | null>(null)
  const [success1, setSuccess1] = useState(false)
  const [challenge1Completed, setChallenge1Completed] = useState(false)

  // Estados do Desafio #2 (Prática - Criar variável de idade)
  const [codeAnswer2, setCodeAnswer2] = useState('')
  const [feedback2, setFeedback2] = useState<string | null>(null)
  const [success2, setSuccess2] = useState(false)
  const [challenge2Completed, setChallenge2Completed] = useState(false)

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

        if (!error && challenges && challenges.length > 0) {
          const totalXpFromDb = challenges.reduce((acc, curr) => acc + (curr.xp_earned || 0), 0)
          setUserXp(totalXpFromDb)
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('codelab_user_xp', String(totalXpFromDb))
          }

          const c1 = challenges.find(c => c.challenge_id === 'challenge-1')
          if (c1 && c1.completed) setChallenge1Completed(true)

          const c2 = challenges.find(c => c.challenge_id === 'challenge-2')
          if (c2 && c2.completed) setChallenge2Completed(true)
        }
      } else {
        if (typeof window !== 'undefined') {
          const savedXp = localStorage.getItem('codelab_user_xp')
          if (savedXp) setUserXp(Number(savedXp))
          
          if (localStorage.getItem('codelab_visitante_desafio_1')) setChallenge1Completed(true)
          if (localStorage.getItem('codelab_visitante_desafio_2')) setChallenge2Completed(true)
        }
      }
    }
    loadUserArena()
  }, [])

  // Validação do Desafio #1 (Teoria)
  const handleTestChallenge1 = async () => {
    if (!selectedOption1) {
      setFeedback1('❌ Selecione uma alternativa antes de enviar.')
      setSuccess1(false)
      return
    }

    if (selectedOption1 === 'b') {
      setSuccess1(true)
      setFeedback1('🎉 Parabéns! Resposta correta. A programação consiste em dar instruções lógicas passo a passo.')

      if (!challenge1Completed) {
        setChallenge1Completed(true)
        const newXp = userXp + 30
        setUserXp(newXp)

        if (!userId && typeof window !== 'undefined') {
          localStorage.setItem('codelab_visitante_desafio_1', 'true')
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('codelab_user_xp', String(newXp))
        }

        if (userId) {
          await supabase.from('user_challenges').upsert({
            user_id: userId,
            challenge_id: 'challenge-1',
            completed: true,
            xp_earned: 30,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,challenge_id' })
        }
      }
    } else {
      setSuccess1(false)
      setFeedback1('❌ Incorreto. Pense na programação como uma sequência lógica de passos para o computador.')
    }
  }

  // Validação do Desafio #2 (Prática - idade)
  const handleTestChallenge2 = async () => {
    const cleanCode = codeAnswer2.trim().replace(/\s+/g, ' ')
    // Valida se o usuário criou a constante 'idade' com um valor numérico ou string
    const expectedPattern = /const\s+idade\s*=\s*\d+\s*;?/i

    if (!cleanCode) {
      setFeedback2('❌ Escreva seu código no campo acima antes de testar.')
      setSuccess2(false)
      return
    }

    if (expectedPattern.test(cleanCode) || cleanCode.includes('idade')) {
      setSuccess2(true)
      setFeedback2('🎉 Parabéns! Resposta correta. Variável "idade" criada com sucesso na Arena!')
      
      if (!challenge2Completed) {
        setChallenge2Completed(true)
        const newXp = userXp + 50
        setUserXp(newXp)

        if (!userId && typeof window !== 'undefined') {
          localStorage.setItem('codelab_visitante_desafio_2', 'true')
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('codelab_user_xp', String(newXp))
        }

        if (userId) {
          await supabase.from('user_challenges').upsert({
            user_id: userId,
            challenge_id: 'challenge-2',
            completed: true,
            xp_earned: 50,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,challenge_id' })
        }
      }
    } else {
      setSuccess2(false)
      setFeedback2('❌ Incorreto. Lembre-se de utilizar a palavra-chave `const` e nomear a variável exatamente como `idade`.')
    }
  }

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('codelab_user_xp')
    }
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-amber-500 selection:text-gray-950 relative overflow-x-hidden animate-fadeIn">
      
      {/* Header Responsivo da Arena */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-amber-500/20 text-amber-400 font-bold text-sm rounded-xl shrink-0 border border-amber-500/30 flex items-center justify-center select-none shadow-lg shadow-amber-500/10">
            ⚔️
          </div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Arena <span className="text-amber-400 font-normal">Codelab</span>
          </h1>
        </div>

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
            Resolva missões exclusivas na Arena para testar seus conhecimentos e acumular XP no seu perfil.
          </p>
        </div>

        {/* Lista de Desafios */}
        <div className="space-y-4">
          
          {/* Desafio #1: Teoria (Aula 1) */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl transition">
            <button
              onClick={() => setOpenChallengeId(openChallengeId === 'challenge-1' ? null : 'challenge-1')}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-gray-850 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                  #1
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-white">O que é Programação e Lógica</h3>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded">
                      Iniciante
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">+30 XP • Fundamentos Teóricos</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {challenge1Completed && (
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] rounded-md border border-emerald-500/30 hidden sm:inline-block">
                    Concluído ✓
                  </span>
                )}
                <span className="text-amber-400 font-bold text-sm transition-transform duration-300">
                  {openChallengeId === 'challenge-1' ? '▲' : '▼'}
                </span>
              </div>
            </button>

            {openChallengeId === 'challenge-1' && (
              <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-gray-800 space-y-4 animate-fadeIn">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-2">
                  Como podemos definir o conceito básico de programação de computadores?
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${selectedOption1 === 'a' ? 'bg-amber-500/10 border-amber-500/50 text-white' : 'bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700'}`}>
                    <input type="radio" name="challenge1" value="a" checked={selectedOption1 === 'a'} onChange={() => setSelectedOption1('a')} className="mt-0.5 accent-amber-500" />
                    <span>a) Um cabo elétrico que transmite energia para a placa de vídeo.</span>
                  </label>
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${selectedOption1 === 'b' ? 'bg-amber-500/10 border-amber-500/50 text-white' : 'bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700'}`}>
                    <input type="radio" name="challenge1" value="b" checked={selectedOption1 === 'b'} onChange={() => setSelectedOption1('b')} className="mt-0.5 accent-amber-500" />
                    <span>b) Dar instruções lógicas passo a passo para o computador resolver tarefas.</span>
                  </label>
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${selectedOption1 === 'c' ? 'bg-amber-500/10 border-amber-500/50 text-white' : 'bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700'}`}>
                    <input type="radio" name="challenge1" value="c" checked={selectedOption1 === 'c'} onChange={() => setSelectedOption1('c')} className="mt-0.5 accent-amber-500" />
                    <span>c) Um antivírus automático para navegadores web.</span>
                  </label>
                </div>

                <div>
                  <button
                    onClick={handleTestChallenge1}
                    className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer text-center"
                  >
                    🚀 Enviar Resposta
                  </button>
                </div>

                {feedback1 && (
                  <div className={`p-4 rounded-xl border font-mono text-xs space-y-1 ${success1 ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500">Resultado:</div>
                    <p>{feedback1}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desafio #2: Prática - Armazenando a Idade (Diferente da aula) */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl transition">
            <button
              onClick={() => setOpenChallengeId(openChallengeId === 'challenge-2' ? null : 'challenge-2')}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-gray-850 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                  #2
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-white">Armazenando a Idade do Usuário</h3>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded">
                      Fácil
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">+50 XP • Prática de Variável Numérica</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {challenge2Completed && (
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] rounded-md border border-emerald-500/30 hidden sm:inline-block">
                    Concluído ✓
                  </span>
                )}
                <span className="text-amber-400 font-bold text-sm transition-transform duration-300">
                  {openChallengeId === 'challenge-2' ? '▲' : '▼'}
                </span>
              </div>
            </button>

            {openChallengeId === 'challenge-2' && (
              <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-gray-800 space-y-4 animate-fadeIn">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-2">
                  Escreva um código em JavaScript declarando uma constante chamada <code className="text-amber-400 bg-gray-950 px-1.5 py-0.5 rounded">idade</code> contendo o seu valor de idade (ex: <code className="text-amber-400 bg-gray-950 px-1.5 py-0.5 rounded">25</code>).
                </p>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Editor de Código:</label>
                  <textarea
                    rows={3}
                    placeholder=';'
                    value={codeAnswer2}
                    onChange={(e) => setCodeAnswer2(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 p-4 rounded-xl text-xs sm:text-sm text-amber-400 font-mono focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <button
                    onClick={handleTestChallenge2}
                    className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer text-center"
                  >
                    🚀 Testar e Enviar Código
                  </button>
                </div>

                {feedback2 && (
                  <div className={`p-4 rounded-xl border font-mono text-xs space-y-1 ${success2 ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500">Resultado da Execução:</div>
                    <p>{feedback2}</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  )
}