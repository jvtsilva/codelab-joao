'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ArenaDesafiosPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([])

  // Controle do Desafio Selecionado
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)
  const [userCode, setUserCode] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Banco de Desafios da Arena (Com XP)
  const desafios = [
    {
      id: 1,
      titulo: 'Missão 1: O Resgate da String',
      nivel: 'Fácil 🟢',
      xp: 50,
      descricao: 'Crie uma variável chamada `mensagem` usando `const` e guarde o texto exato: "Olá Mundo"',
      codigoInicial: '// Escreva seu código aqui:\n',
      validar: (codigo: string) => {
        const clean = codigo.replace(/\s+/g, '')
        return clean.includes('constmensagem="OláMundo"') || clean.includes("constmensagem='OláMundo'") || clean.includes('constmensagem=`OláMundo`')
      }
    },
    {
      id: 2,
      titulo: 'Missão 2: Variável Mutável',
      nivel: 'Médio 🟡',
      xp: 100,
      descricao: 'Crie uma variável comum usando `let` chamada `nivel` e atribua o número `5` a ela.',
      codigoInicial: '// Escreva seu código aqui:\n',
      validar: (codigo: string) => {
        const clean = codigo.replace(/\s+/g, '')
        return clean.includes('letnivel=5')
      }
    },
    {
      id: 3,
      titulo: 'Missão 3: Caça ao Erro (Bugfix)',
      nivel: 'Desafiador 🔴',
      xp: 150,
      descricao: 'O código abaixo tenta mudar uma caixa lacrada (`const`), o que gera erro. Corrija a palavra-chave para que o código funcione!',
      codigoInicial: 'const pontuacao = 10;\npontuacao = 20;',
      validar: (codigo: string) => {
        const clean = codigo.replace(/\s+/g, '')
        return clean.includes('letpontuacao=10') || clean.includes('letpontuacao=10;')
      }
    }
  ]

  useEffect(() => {
    async function initArena() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const currentUserId = session.user.id
        setUserId(currentUserId)

        // Buscar missões já concluídas pelo usuário no Supabase
        const { data } = await supabase
          .from('user_challenges')
          .select('challenge_id')
          .eq('user_id', currentUserId)
          .eq('completed', true)

        if (data) {
          setCompletedChallenges(data.map(item => item.challenge_id))
        }
      }

      setLoading(false)
    }
    initArena()
  }, [])

  const handleSelectChallenge = (desafio: typeof desafios[0]) => {
    setSelectedChallenge(desafio.id)
    setUserCode(desafio.codigoInicial)
    const jaConcluiu = completedChallenges.includes(desafio.id)
    setIsSuccess(jaConcluiu)
    
    if (jaConcluiu) {
      setFeedback('🎉 Você já concluiu esta missão e garantiu o seu XP!')
    } else {
      setFeedback('Aguardando sua resposta...')
    }
  }

  const handleRunChallenge = async () => {
    if (selectedChallenge === null) return
    const desafioAtual = desafios.find(d => d.id === selectedChallenge)
    if (!desafioAtual) return

    try {
      const acertou = desafioAtual.validar(userCode)
      if (acertou) {
        setIsSuccess(true)

        if (userId) {
          setFeedback(`🎉 Missão concluída com sucesso! +${desafioAtual.xp} XP adicionados!`)
          
          // Salvar progresso no Supabase se estiver logado
          await supabase.from('user_challenges').upsert({
            user_id: userId,
            challenge_id: desafioAtual.id,
            completed: true,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,challenge_id' })

          if (!completedChallenges.includes(desafioAtual.id)) {
            setCompletedChallenges([...completedChallenges, desafioAtual.id])
          }
        } else {
          // Modo Visitante (Não logado)
          setFeedback(`🎉 Missão concluída com sucesso! (Modo Visitante: crie uma conta para salvar seu XP permanentemente).`)
        }

      } else {
        setIsSuccess(false)
        setFeedback('❌ Resposta incorreta ou incompleta. Revise os conceitos e tente novamente!')
      }
    } catch (err: any) {
      setIsSuccess(false)
      setFeedback(`❌ Erro no código:\n${err.message}`)
    }
  }

  const totalXP = completedChallenges.reduce((acc, id) => {
    const d = desafios.find(item => item.id === id)
    return acc + (d ? d.xp : 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-amber-500 selection:text-gray-950 overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/" className="px-2.5 py-1 bg-amber-500/20 text-amber-400 font-bold text-xs rounded-md">
            ⚔️
          </Link>
          <h1 className="font-bold text-base sm:text-lg tracking-wide truncate">
            Arena <span className="text-amber-400 text-xs sm:text-sm font-normal">Codelab</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-lg">
            ⭐ {totalXP} XP
          </div>
          <Link 
            href="/dashboard"
            className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800 shrink-0"
          >
            Trilha
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 sm:space-y-8 pb-24">
        
        {!userId && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-amber-300">Você está navegando como <strong>Visitante</strong>. Teste os códigos livremente, mas faça login para salvar seu XP!</span>
            <Link href="/login" className="px-3 py-1.5 bg-amber-500 text-gray-950 font-bold rounded-lg shrink-0">
              Criar Conta / Login
            </Link>
          </div>
        )}

        {/* Capa da Arena */}
        <div className="space-y-3 bg-gradient-to-r from-amber-500/10 via-gray-900 to-gray-900 border border-amber-500/20 p-5 sm:p-8 rounded-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-amber-500 text-gray-950 font-bold text-xs rounded-md">
              ARENA DE DESAFIOS ⚔️
            </span>
            <span className="text-xs text-gray-400">Total de XP: {totalXP} pontos</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            Resolva missões e ganhe XP
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Teste sua lógica no interpretador interativo de código em tempo real.
          </p>
        </div>

        {selectedChallenge === null ? (
          <div className="space-y-4">
            <h2 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Missões Disponíveis
            </h2>

            <div className="grid gap-3">
              {desafios.map((desafio) => {
                const jaConcluiu = completedChallenges.includes(desafio.id)
                return (
                  <div 
                    key={desafio.id}
                    onClick={() => handleSelectChallenge(desafio)}
                    className={`p-4 sm:p-5 border transition rounded-2xl flex items-center justify-between gap-4 cursor-pointer group ${
                      jaConcluiu 
                        ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/60' 
                        : 'bg-gray-900/80 border-gray-800 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-amber-400">{desafio.nivel}</span>
                        <span className="text-xs font-bold text-emerald-400">+{desafio.xp} XP</span>
                        {jaConcluiu && (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[10px] rounded-full border border-amber-500/30">
                            Concluída ✓
                          </span>
                        )}
                        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition truncate">
                          {desafio.titulo}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">{desafio.descricao}</p>
                    </div>

                    <span className="px-4 py-2 bg-gray-800 group-hover:bg-amber-500 group-hover:text-gray-950 text-xs font-bold rounded-xl transition shrink-0">
                      Jogar →
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {desafios.find(d => d.id === selectedChallenge)?.nivel}
                </span>
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="text-xs text-gray-400 hover:text-white transition bg-gray-950 px-3 py-1 rounded-lg border border-gray-800"
                >
                  ← Voltar para a Lista
                </button>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {desafios.find(d => d.id === selectedChallenge)?.titulo}
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {desafios.find(d => d.id === selectedChallenge)?.descricao}
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-gray-950 px-4 py-3 border-b border-gray-800 flex items-center justify-between text-xs text-gray-400">
                <span className="font-mono text-amber-400">arena.js</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">Validador de Código ⚡</span>
              </div>

              <div className="p-3 sm:p-4">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={5}
                  className="w-full bg-gray-950 font-mono text-xs sm:text-sm text-amber-300 p-3 sm:p-4 rounded-xl border border-gray-800 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                />
              </div>

              <div className="px-3 sm:px-4 pb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={handleRunChallenge}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer text-center"
                >
                  ⚡ Validar Código
                </button>
                <span className="text-[11px] sm:text-xs text-gray-500 text-center sm:text-right">Teste livremente no navegador</span>
              </div>

              <div className={`border-t border-gray-800 p-4 font-mono text-xs space-y-1 ${isSuccess ? 'bg-emerald-950/40' : 'bg-gray-950'}`}>
                <div className="text-gray-500 text-[10px] uppercase tracking-wider">Resultado:</div>
                <div className={`font-bold text-xs sm:text-sm whitespace-pre-line break-all ${isSuccess ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {feedback}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  )
}