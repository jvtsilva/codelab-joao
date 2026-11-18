'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  // Estado para controlar quais módulos estão abertos (todos começam fechados/recolhidos)
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    'modulo-1': false,
    'modulo-2': false,
    'modulo-3': false,
    'modulo-4': false,
    'modulo-5': false,
  })

  const totalLessonsCount = 36

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

  const toggleModule = (modId: string) => {
    setOpenModules(prev => ({ ...prev, [modId]: !prev[modId] }))
  }

  const totalCompletedCount = Object.values(completedLessons).filter(Boolean).length

  // Estrutura agrupada por Módulos Oficiais
  const modules = [
    {
      id: 'modulo-1',
      title: 'Módulo 1: Fundamentos de JavaScript',
      badge: 'Iniciante',
      blocks: [
        {
          id: 'bloco-a-m1',
          title: 'Bloco A (Fundamentos)',
          lessons: [
            { id: 'lesson-1', number: 1, title: 'O Que É Programação de Verdade?', desc: 'Desmistificando a lógica e hardware vs software' },
            { id: 'lesson-2', number: 2, title: 'O Pensamento Algorítmico', desc: 'Decomposição e missão prática do robô' },
            { id: 'lesson-3', number: 3, title: 'Onde o Código Vive? (Console)', desc: 'Trio da web e comando console.log()' }
          ]
        },
        {
          id: 'bloco-b-m1',
          title: 'Bloco B (Memória e Variáveis)',
          lessons: [
            { id: 'lesson-4', number: 4, title: 'Como o Computador Lembra das Coisas?', desc: 'Memória RAM e variáveis com let' },
            { id: 'lesson-5', number: 5, title: 'Constantes vs Variáveis', desc: 'Quando usar const e let com segurança' },
            { id: 'lesson-6', number: 6, title: 'Os Tipos de Dados do Mundo Real', desc: 'Strings, Numbers e Booleans' }
          ]
        },
        {
          id: 'bloco-c-m1',
          title: 'Bloco C (Operadores e Interação)',
          lessons: [
            { id: 'lesson-7', number: 7, title: 'Fazendo Contas e Operações Matemáticas', desc: 'Adição, subtração, multiplicação e divisão' },
            { id: 'lesson-8', number: 8, title: 'Operadores de Comparação e Relacionais', desc: 'Maior, menor, igual e estrito (===)' },
            { id: 'lesson-9', number: 9, title: 'Combinando Condições (Operadores Lógicos)', desc: 'Conectando regras com && (E) e || (OU)' },
            { id: 'lesson-10', number: 10, title: 'Tomando Decisões com if e else', desc: 'Criando caminhos condicionais (Se / Senão)' }
          ]
        },
        {
          id: 'bloco-d-m1',
          title: 'Bloco D (Laços de Repetição)',
          lessons: [
            { id: 'lesson-11', number: 11, title: 'O Poder da Repetição Automática', desc: 'O loop while e prevenção de loops infinitos' },
            { id: 'lesson-12', number: 12, title: 'O Loop Mais Usado do Mundo', desc: 'Contagens controladas com o comando for' }
          ]
        },
        {
          id: 'bloco-e-m1',
          title: 'Bloco E (Coleções de Dados)',
          lessons: [
            { id: 'lesson-13', number: 13, title: 'O Armazém de Múltiplos Itens (Arrays)', desc: 'Listas ordenadas e índices iniciados em zero' },
            { id: 'lesson-14', number: 14, title: 'Manipulando Listas Dinamicamente', desc: 'Adicionando e removendo com .push() e .pop()' }
          ]
        }
      ]
    },
    {
      id: 'modulo-2',
      title: 'Módulo 2: O Poder das Funções',
      badge: 'Intermediário',
      blocks: [
        {
          id: 'bloco-a-m2',
          title: 'Bloco A (Introdução a Funções)',
          lessons: [
            { id: 'lesson-15', number: 15, title: 'O Que É uma Função?', desc: 'Declarando e chamando blocos de código' },
            { id: 'lesson-16', number: 16, title: 'Parâmetros e Argumentos', desc: 'Enviando dados para dentro da função' },
            { id: 'lesson-17', number: 17, title: 'A Instrução return', desc: 'Fazendo a função devolver resultados úteis' }
          ]
        },
        {
          id: 'bloco-b-m2',
          title: 'Bloco B (Escopo e Boas Práticas)',
          lessons: [
            { id: 'lesson-18', number: 18, title: 'Escopo Global vs Escopo Local', desc: 'let, const e o ciclo de vida das variáveis' },
            { id: 'lesson-19', number: 19, title: 'Funções Anônimas e Arrow Functions', desc: 'A sintaxe moderna => do JavaScript' },
            { id: 'lesson-20', number: 20, title: 'Projeto: Calculadora de IMC Modularizada', desc: 'Prática integradora do Módulo 2' }
          ]
        }
      ]
    },
    {
      id: 'modulo-3',
      title: 'Módulo 3: Manipulação do DOM',
      badge: 'Front-End',
      blocks: [
        {
          id: 'bloco-a-m3',
          title: 'Bloco A (Conectando ao HTML)',
          lessons: [
            { id: 'lesson-21', number: 21, title: 'O Que É o DOM?', desc: 'A árvore de elementos da página web' },
            { id: 'lesson-22', number: 22, title: 'Selecionando Elementos', desc: 'getElementById e querySelector' },
            { id: 'lesson-23', number: 23, title: 'Modificando Textos e Conteúdos', desc: 'innerText, innerHTML e atributos' }
          ]
        },
        {
          id: 'bloco-b-m3',
          title: 'Bloco B (Eventos e Interatividade)',
          lessons: [
            { id: 'lesson-24', number: 24, title: 'Ouvindo o Usuário com addEventListener', desc: 'O evento de clique (click)' },
            { id: 'lesson-25', number: 25, title: 'Manipulando Classes CSS Dinamicamente', desc: 'classList.add, remove e toggle' },
            { id: 'lesson-26', number: 26, title: 'Projeto: Lista de Tarefas Interativa', desc: 'To-Do List funcional no Front-End' }
          ]
        }
      ]
    },
    {
      id: 'modulo-4',
      title: 'Módulo 4: Assincronicidade e APIs',
      badge: 'Avançado',
      blocks: [
        {
          id: 'bloco-a-m4',
          title: 'Bloco A (Programação Assíncrona)',
          lessons: [
            { id: 'lesson-27', number: 27, title: 'O Tempo no JavaScript', desc: 'setTimeout e setInterval' },
            { id: 'lesson-28', number: 28, title: 'O Conceito de Promessas (Promises)', desc: 'Pendente, Realizada e Rejeitada' },
            { id: 'lesson-29', number: 29, title: 'O Poder do async / await', desc: 'Escrevendo código assíncrono limpo' }
          ]
        },
        {
          id: 'bloco-b-m4',
          title: 'Bloco B (Consumindo APIs)',
          lessons: [
            { id: 'lesson-30', number: 30, title: 'O Que É uma API e o Formato JSON?', desc: 'Comunicação entre sistemas' },
            { id: 'lesson-31', number: 31, title: 'Buscando Dados com fetch()', desc: 'Fazendo requisições HTTP reais' },
            { id: 'lesson-32', number: 32, title: 'Projeto: Consulta de CEP Automática', desc: 'Buscando endereços via API pública' }
          ]
        }
      ]
    },
    {
      id: 'modulo-5',
      title: 'Módulo 5: Full-Stack e Projetos Reais',
      badge: 'Master',
      blocks: [
        {
          id: 'bloco-a-m5',
          title: 'Bloco A (Aplicações com Banco de Dados)',
          lessons: [
            { id: 'lesson-33', number: 33, title: 'Autenticação com Supabase', desc: 'Login e cadastro reais no Front-End' },
            { id: 'lesson-34', number: 34, title: 'Salvando e Carregando Dados', desc: 'Trabalhando com tabelas relacionais' }
          ]
        },
        {
          id: 'bloco-b-m5',
          title: 'Bloco B (O Futuro com Frameworks)',
          lessons: [
            { id: 'lesson-35', number: 35, title: 'Por Que Usamos React e Next.js?', desc: 'Componentes reutilizáveis' },
            { id: 'lesson-36', number: 36, title: 'Projeto Final: Publicação na Web', desc: 'Deploy completo da sua aplicação na Vercel' }
          ]
        }
      ]
    }
  ]

  const allLessonsFlat = modules.flatMap(m => m.blocks.flatMap(b => b.lessons))
  const nextLessonToStudy = allLessonsFlat.find(l => !completedLessons[l.id]) || allLessonsFlat[0]

  // Regra de Liberação: A aula 1 é sempre livre. A aula N exige que a aula N-1 esteja concluída.
  const isLessonUnlocked = (lessonNumber: number) => {
    if (lessonNumber === 1) return true
    const prevLessonId = `lesson-${lessonNumber - 1}`
    return !!completedLessons[prevLessonId]
  }

  // Função auxiliar para descobrir a qual Módulo pertence a aula atual
  const getModuleTitleForLesson = (lessonNumber: number) => {
    if (lessonNumber <= 14) return 'Módulo 1'
    if (lessonNumber <= 20) return 'Módulo 2'
    if (lessonNumber <= 26) return 'Módulo 3'
    if (lessonNumber <= 32) return 'Módulo 4'
    return 'Módulo 5'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col selection:bg-emerald-500 selection:text-gray-950 relative overflow-x-hidden animate-fadeIn">
      
      {/* Header Padronizado e Unificado */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50 px-3.5 sm:px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-lg shrink-0 border border-emerald-500/30">JS</div>
          <h1 className="font-bold text-sm sm:text-base tracking-wide truncate">
            Codelab <span className="text-emerald-400 text-xs font-normal">João</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link href="/dashboard" className="px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold">📖 Trilha</Link>
          <Link href="/desafios" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">⚔️ Arena</Link>
          <Link href="/ranking" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">🏆 Ranking</Link>
          <Link href="/medalhas" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">🎖️ Medalhas</Link>
          <Link href="/contato" className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-xs font-semibold">💬 Contato</Link>
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

        <div className="flex md:hidden items-center shrink-0">
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="p-2 bg-gray-900 border border-gray-800 rounded-xl text-emerald-400 font-bold text-lg active:scale-95 transition cursor-pointer"
            aria-label="Abrir Menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 space-y-2 z-50 shadow-2xl animate-fadeIn">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold">📖 Ir para a Trilha</Link>
          <Link href="/desafios" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">⚔️ Arena de Desafios</Link>
          <Link href="/ranking" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">🏆 Ranking Geral</Link>
          <Link href="/medalhas" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-semibold">🎖️ Painel de Medalhas</Link>
          <Link href="/contato" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 font-medium">💬 Contato</Link>
          {userId ? (
            <>
              <Link href="/painel" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gray-950 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium">⚙️ Meu Painel de Controle</Link>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-left px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-400 font-medium cursor-pointer">🚪 Sair da Conta</button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-center px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300">Entrar</Link>
              <Link href="/cadastro" onClick={() => setMenuOpen(false)} className="text-center px-4 py-3 bg-emerald-500 text-gray-950 rounded-xl text-xs font-extrabold">Criar Conta</Link>
            </div>
          )}
        </div>
      )}

      {/* Alerta de Aula Bloqueada */}
      {alertMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500/10 border border-amber-500/40 text-amber-300 px-4 py-3 rounded-xl text-xs font-bold shadow-2xl animate-bounce flex items-center gap-2">
          <span>🔒</span> {alertMessage}
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3.5 sm:p-6 space-y-6 pb-24 overflow-hidden">
        
        {/* Banner de Trilha e Card Inteligente */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-2 space-y-2.5 bg-gray-900 border border-gray-800 p-4 sm:p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase block">Trilha Completa • 5 Módulos 🚀</span>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">Fundamentos de JavaScript ao Avançado</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Você concluiu <strong className="text-emerald-400">{loading ? '...' : `${totalCompletedCount} de ${totalLessonsCount}`}</strong> aulas. Continue avançando na trilha prática!
              </p>
            </div>

            {!loading && nextLessonToStudy && (
              <div className="pt-2">
                <Link
                  href={`/dashboard/aula/${nextLessonToStudy.number}`}
                  className="flex items-center justify-between gap-3 p-3.5 bg-gray-950/80 hover:bg-gray-950 border border-emerald-500/30 rounded-xl transition group shadow-md"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Continuar de Onde Parou ⚡ ({getModuleTitleForLesson(nextLessonToStudy.number)} • Aula {nextLessonToStudy.number})
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition truncate">
                      {nextLessonToStudy.title}
                    </p>
                  </div>
                  <span className="px-3 py-2 bg-emerald-500 text-gray-950 font-extrabold text-xs rounded-lg shrink-0 group-hover:bg-emerald-400 transition">
                    Estudar →
                  </span>
                </Link>
              </div>
            )}
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

        {/* 📚 MÓDULOS EM CARDS RETRÁTEIS COM SISTEMA DE CADEADOS */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase px-1">Selecione um Módulo para Explorar</h3>
          
          {modules.map((mod) => {
            const isOpen = openModules[mod.id]
            const modLessons = mod.blocks.flatMap(b => b.lessons)
            const completedModLessons = modLessons.filter(l => completedLessons[l.id]).length
            const isFullyCompleted = completedModLessons === modLessons.length

            return (
              <div key={mod.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl transition">
                
                {/* Cabeçalho do Card do Módulo */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-gray-850 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${isFullyCompleted ? 'bg-emerald-500 text-gray-950 font-black' : 'bg-gray-800 text-emerald-400 border border-emerald-500/30'}`}>
                      {isFullyCompleted ? '✓' : '📦'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm sm:text-base text-white truncate">{mod.title}</h4>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-md">
                          {mod.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {loading ? '...' : `${completedModLessons} de ${modLessons.length} aulas concluídas`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-gray-400 font-bold text-xs">
                    <span>{isOpen ? 'Recolher ▲' : 'Expandir ▼'}</span>
                  </div>
                </button>

                {/* Conteúdo Interno Retrátil (Blocos e Aulas com Cadeado) */}
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-gray-800/80 space-y-6 bg-gray-950/40 animate-fadeIn">
                    {mod.blocks.map((block) => (
                      <div key={block.id} className="space-y-3 pt-4">
                        <div className="flex items-center justify-between px-1 border-b border-gray-800/60 pb-1.5">
                          <h5 className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">{block.title}</h5>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {loading ? '...' : `${block.lessons.filter(l => completedLessons[l.id]).length}/${block.lessons.length}`}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {block.lessons.map((lesson) => {
                            const isCompleted = completedLessons[lesson.id]
                            const unlocked = isLessonUnlocked(lesson.number)

                            return unlocked ? (
                              <Link 
                                key={lesson.id} 
                                href={`/dashboard/aula/${lesson.number}`} 
                                className="p-3.5 rounded-xl border bg-gray-900 border-gray-800 hover:border-emerald-500/50 transition flex items-center justify-between gap-3 cursor-pointer group shadow-sm"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${isCompleted ? 'bg-emerald-500 text-gray-950 font-black' : 'bg-gray-800 text-gray-300 group-hover:bg-gray-700'}`}>
                                    {isCompleted ? '✓' : lesson.number}
                                  </div>
                                  <div className="min-w-0">
                                    <h6 className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-400 transition truncate">{lesson.title}</h6>
                                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">{lesson.desc}</p>
                                  </div>
                                </div>
                                <span className={`text-[11px] font-semibold shrink-0 pl-1 ${isCompleted ? 'text-emerald-400' : 'text-emerald-400 group-hover:underline'}`}>
                                  {isCompleted ? 'Revisar ⚡' : 'Fazer ⚡'}
                                </span>
                              </Link>
                            ) : (
                              <div 
                                key={lesson.id}
                                onClick={() => {
                                  setAlertMessage(`Conclua a Aula ${lesson.number - 1} para desbloquear esta aula!`)
                                  setTimeout(() => setAlertMessage(null), 3500)
                                }}
                                className="p-3.5 rounded-xl border bg-gray-900/50 border-gray-800/60 opacity-60 flex items-center justify-between gap-3 cursor-not-allowed group shadow-sm"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-gray-800/80 text-gray-500 font-bold text-xs flex items-center justify-center shrink-0 border border-gray-700/50">
                                    🔒
                                  </div>
                                  <div className="min-w-0">
                                    <h6 className="font-bold text-xs sm:text-sm text-gray-400 truncate">{lesson.title}</h6>
                                    <p className="text-[10px] sm:text-xs text-gray-600 truncate">{lesson.desc}</p>
                                  </div>
                                </div>
                                <span className="text-[11px] font-semibold text-gray-500 shrink-0 pl-1">
                                  Bloqueada 🔒
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )
          })}
        </div>

      </main>
    </div>
  )
}