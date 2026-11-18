'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  // Total de aulas criadas na trilha (14 aulas)
  const totalLessonsCount = 14

  useEffect(() => {
    async function checkUserAndProgress() {
      const { data: { session } } = await supabase.auth.getSession()
      const progressMap: Record<string, boolean> = {}

      if (session) {
        setUserId(session.user.id)
        const { data } = await supabase
          .from('user_progress')
          .select('lesson_id, completed')
          .eq('user_id', session.user.id)

        if (data) {
          data.forEach(item => {
            if (item.completed) {
              progressMap[item.lesson_id] = true
            }
          })
        }
      } else {
        if (typeof window !== 'undefined') {
          for (let i = 1; i <= totalLessonsCount; i++) {
            if (localStorage.getItem(`codelab_visitante_aula_${i}`)) {
              progressMap[`lesson-${i}`] = true
            }
          }
        }
      }

      setCompletedLessons(progressMap)
      setLoading(false)
    }
    checkUserAndProgress()
  }, [])

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('codelab_')) {
          localStorage.removeItem(key)
        }
      })
    }
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Calcula quantas aulas o usuário já concluiu no total
  const totalCompletedCount = Object.values(completedLessons).filter(Boolean).length

  // Estrutura completa dos blocos e aulas da trilha
  const blocks = [
    {
      id: 'bloco-a',
      title: 'Módulo 1 • Bloco A (Fundamentos)',
      lessons: [
        { id: 'lesson-1', number: 1, title: 'O Que É Programação de Verdade?', desc: 'Desmistificando a lógica e hardware vs software' },
        { id: 'lesson-2', number: 2, title: 'O Pensamento Algorítmico', desc: 'Decomposição e missão prática do robô' },
        { id: 'lesson-3', number: 3, title: 'Onde o Código Vive? (Console)', desc: 'Trio da web e comando console.log()' }
      ]
    },
    {
      id: 'bloco-b',
      title: 'Módulo 1 • Bloco B (Memória e Variáveis)',
      lessons: [
        { id: 'lesson-4', number: 4, title: 'Como o Computador Lembra das Coisas?', desc: 'Memória RAM e variáveis com let' },
        { id: 'lesson-5', number: 5, title: 'Constantes vs Variáveis', desc: 'Quando usar const e let com segurança' },
        { id: 'lesson-6', number: 6, title: 'Os Tipos de Dados do Mundo Real', desc: 'Strings, Numbers e Booleans' }
      ]
    },
    {
      id: 'bloco-c',
      title: 'Módulo 1 • Bloco C (Operadores e Interação)',
      lessons: [
        { id: 'lesson-7', number: 7, title: 'Fazendo Contas e Operações Matemáticas', desc: 'Adição, subtração, multiplicação e divisão' },
        { id: 'lesson-8', number: 8, title: 'Operadores de Comparação e Relacionais', desc: 'Maior, menor, igual e estrito (===)' },
        { id: 'lesson-9', number: 9, title: 'Combinando Condições (Operadores Lógicos)', desc: 'Conectando regras com && (E) e || (OU)' },
        { id: 'lesson-10', number: 10, title: 'Tomando Decisões com if e else', desc: 'Criando caminhos condicionais (Se / Senão)' }
      ]
    },
    {
      id: 'bloco-d',
      title: 'Módulo 1 • Bloco D (Laços de Repetição)',
      lessons: [
        { id: 'lesson-11', number: 11, title: 'O Poder da Repetição Automática', desc: 'O loop while e prevenção de loops infinitos' },
        { id: 'lesson-12', number: 12, title: 'O Loop Mais Usado do Mundo', desc: 'Contagens controladas com o comando for' }
      ]
    },
    {
      id: 'bloco-e',
      title: 'Módulo 1 • Bloco E (Coleções de Dados)',
      lessons: [
        { id: 'lesson-13', number: 13, title: 'O Armazém de Múltiplos Itens (Arrays)', desc: 'Listas ordenadas e índices iniciados em zero' },
        { id: 'lesson-14', number: 14, title: 'Manipulando Listas Dinamicamente', desc: 'Adicionando e removendo com .push() e .pop()' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-emerald-500 selection:text-gray-950 relative overflow-x-hidden animate-fadeIn">
      
      {/* Header Responsivo */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-3.5 sm:px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg shrink-0 border border-emerald-500/30">JS</div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Codelab <span className="text-emerald-400 text-xs font-normal">João</span>
          </h1>
        </div>

        {/* Menu Desktop */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Link href="/contato" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">💬 Contato</Link>
          {userId ? (
            <div className="flex items-center gap-2">
              <Link href="/painel" className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold">⚙️ Painel</Link>
              <button onClick={handleLogout} className="px-3.5 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold cursor-pointer">Sair</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-3.5 py-2 bg-gray-900 text-gray-300 border border-gray-800 rounded-xl text-xs">Entrar</Link>
              <Link href="/cadastro" className="px-3.5 py-2 bg-emerald-500 text-gray-950 font-extrabold rounded-xl text-xs">Criar Conta</Link>
            </div>
          )}
        </div>

        {/* Botão Hambúrguer Mobile */}
        <div className="flex sm:hidden items-center shrink-0">
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="p-2 bg-gray-900 border border-gray-800 rounded-xl text-emerald-400 font-bold text-lg active:scale-95 transition cursor-pointer"
            aria-label="Abrir Menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Menu Dropdown Mobile Otimizado */}
      {menuOpen && (
        <div className="sm:hidden absolute top-14 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-2.5 z-50 shadow-2xl animate-fadeIn">
          <Link href="/contato" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-medium">💬 Contato</Link>
          {userId ? (
            <>
              <Link href="/painel" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium">⚙️ Meu Painel de Controle</Link>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-left px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium cursor-pointer">🚪 Sair da Conta</button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-center px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300">Entrar</Link>
              <Link href="/cadastro" onClick={() => setMenuOpen(false)} className="text-center px-4 py-3 bg-emerald-500 text-gray-950 rounded-xl text-xs font-extrabold">Criar Conta</Link>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3.5 sm:p-6 space-y-6 pb-24 overflow-hidden">
        
        {/* Banner de Boas-vindas e Arena em Grid responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-2 space-y-2.5 bg-gradient-to-r from-emerald-500/10 via-gray-900 to-gray-900 border border-emerald-500/20 p-4 sm:p-6 rounded-2xl">
            <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase block">Trilha Completa • Módulo 1 🚀</span>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">Fundamentos de JavaScript ao Avançado</h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Você concluiu <strong className="text-emerald-400">{loading ? '...' : `${totalCompletedCount} de ${totalLessonsCount}`}</strong> aulas. Continue avançando na trilha prática!
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 via-gray-900 to-gray-900 border border-amber-500/20 p-4 sm:p-6 rounded-2xl flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Modo Jogo ⚔️</span>
              <h3 className="font-bold text-sm sm:text-base text-white">Arena de Desafios</h3>
              <p className="text-xs text-gray-400">Resolva missões de código e ganhe XP.</p>
            </div>
            <Link href="/desafios" className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl transition text-center block cursor-pointer">Entrar na Arena ⚡</Link>
          </div>
        </div>

        {/* Renderização Dinâmica de todos os Blocos e Aulas */}
        <div className="space-y-8">
          {blocks.map((block) => (
            <div key={block.id} className="space-y-3.5">
              <div className="flex items-center justify-between px-1 border-b border-gray-800 pb-2">
                <h3 className="text-[11px] sm:text-xs font-bold tracking-wider text-emerald-400 uppercase">{block.title}</h3>
                <span className="text-[11px] sm:text-xs text-gray-500 font-medium">
                  {loading ? '...' : `${block.lessons.filter(l => completedLessons[l.id]).length}/${block.lessons.length} Concluídas`}
                </span>
              </div>

              <div className="space-y-2.5">
                {block.lessons.map((lesson) => {
                  const isCompleted = completedLessons[lesson.id]
                  return (
                    <Link 
                      key={lesson.id} 
                      href={`/dashboard/aula/${lesson.number}`} 
                      className="p-3.5 sm:p-4 rounded-2xl border bg-gray-900/85 border-gray-800 hover:border-emerald-500/50 transition flex items-center justify-between gap-3 cursor-pointer group shadow-md"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition ${isCompleted ? 'bg-emerald-500 text-gray-950 font-black shadow-lg shadow-emerald-500/20' : 'bg-gray-800 text-gray-300 group-hover:bg-gray-700'}`}>
                          {isCompleted ? '✓' : lesson.number}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-base text-white group-hover:text-emerald-400 transition truncate">{lesson.title}</h4>
                          <p className="text-[11px] sm:text-xs text-gray-400 truncate">{lesson.desc}</p>
                        </div>
                      </div>
                      <span className={`text-[11px] sm:text-xs font-semibold shrink-0 pl-1 ${isCompleted ? 'text-emerald-400' : 'text-emerald-400 group-hover:underline'}`}>
                        {isCompleted ? 'Revisar ⚡' : 'Fazer ⚡'}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}