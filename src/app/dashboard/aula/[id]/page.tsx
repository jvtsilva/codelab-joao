'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import {
  aulasData,
  type AcaoSimulador,
  type AulaItem,
  type ItemClassificacao,
  type TopicoTeoria,
} from '@/data/lessonsData'

interface AulaDetalhePageProps {
  concluidasIds?: string[]
  onConcluirAula?: (aulaId: string, xpGanho: number) => Promise<void> | void
}

type FeedbackStatus = 'idle' | 'ok' | 'erro'

const STORAGE_KEY = 'codelab_tema_aula'
const XP_POR_AULA = 50

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

function lerTemaInicial(): boolean {
  if (typeof window === 'undefined') return true
  const salvo = window.localStorage.getItem(STORAGE_KEY)
  return salvo !== 'light'
}

export default function AulaDetalhePage({
  concluidasIds = [],
  onConcluirAula,
}: AulaDetalhePageProps) {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const rawId = typeof params?.id === 'string' ? params.id : undefined

  const aula: AulaItem | undefined =
    aulasData.find(
      (item: AulaItem) =>
        item.id === rawId || String(item.numero) === rawId,
    ) || aulasData[0]

  const [userId, setUserId] = useState<string | null>(null)
  const [isDark, setIsDark] = useState<boolean>(() => lerTemaInicial())
  const [etapaAtual, setEtapaAtual] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const [concluidaLocal, setConcluidaLocal] = useState<boolean>(false)
  const [erroSalvar, setErroSalvar] = useState<string | null>(null)

  // Prática 1: Ordenar frases / passos
  const [itensOrdenados, setItensOrdenados] = useState<string[]>([])
  const [feedbackOrdem, setFeedbackOrdem] = useState<FeedbackStatus>('idle')

  // Prática 2: Classificação por toque
  const [selecoesClassificacao, setSelecoesClassificacao] = useState<
    Record<number, string>
  >({})
  const [feedbackClassificacao, setFeedbackClassificacao] =
    useState<FeedbackStatus>('idle')

  // Prática 3: Montar blocos de código
  const [blocosSelecionados, setBlocosSelecionados] = useState<string[]>([])
  const [feedbackBlocos, setFeedbackBlocos] = useState<FeedbackStatus>('idle')

  // Prática 4: Caça ao erro
  const [indiceErroSelecionado, setIndiceErroSelecionado] = useState<
    number | null
  >(null)
  const [feedbackCacaErro, setFeedbackCacaErro] =
    useState<FeedbackStatus>('idle')

  // Prática 5: Simulador de estado
  const [valorSimulador, setValorSimulador] = useState<number>(0)
  const [feedbackSimulador, setFeedbackSimulador] =
    useState<FeedbackStatus>('idle')

  // Quiz interativo (uma questão por vez)
  const [indicePergunta, setIndicePergunta] = useState<number>(0)
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(
    null,
  )
  const [respostasCorretas, setRespostasCorretas] = useState<boolean[]>([])

  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.style.backgroundColor = isDark
      ? '#030712'
      : '#fafaf9'
  }, [isDark])

  useEffect(() => {
    if (!aula) return
    let active = true

    async function carregarSessaoEProgresso() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!active) return

      let jaConcluida = false

      if (typeof window !== 'undefined') {
        if (
          window.localStorage.getItem(
            `codelab_visitante_aula_${aula!.numero}`,
          ) === 'true'
        ) {
          jaConcluida = true
        }
      }

      if (session) {
        setUserId(session.user.id)
        const { data } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', session.user.id)
          .eq('lesson_id', aula!.id)
          .maybeSingle()

        if (!active) return
        if (data?.completed) {
          jaConcluida = true
        }
      }

      if (active && jaConcluida) {
        setConcluidaLocal(true)
      }
    }

    carregarSessaoEProgresso()

    return () => {
      active = false
    }
  }, [aula])

  const alternarTema = () => {
    setIsDark((atual: boolean) => {
      const proximo = !atual
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, proximo ? 'dark' : 'light')
      }
      document.documentElement.classList.toggle('dark', proximo)
      document.documentElement.style.backgroundColor = proximo
        ? '#030712'
        : '#fafaf9'
      return proximo
    })
  }

  const completed =
    concluidaLocal ||
    (aula
      ? concluidasIds.includes(aula.id) ||
        concluidasIds.includes(String(aula.numero))
      : false)

  useEffect(() => {
    if (!aula) return
    setEtapaAtual(0)
    setConcluidaLocal(false)
    setErroSalvar(null)
    setSaving(false)

    setItensOrdenados(aula.pratica.frases ? [...aula.pratica.frases] : [])
    setFeedbackOrdem('idle')

    setSelecoesClassificacao({})
    setFeedbackClassificacao('idle')

    setBlocosSelecionados([])
    setFeedbackBlocos('idle')

    setIndiceErroSelecionado(null)
    setFeedbackCacaErro('idle')

    setValorSimulador(aula.pratica.simuladorEstado?.valorInicial ?? 0)
    setFeedbackSimulador('idle')

    setIndicePergunta(0)
    setRespostaSelecionada(null)
    setRespostasCorretas([])
  }, [aula?.id])

  const caixa =
    'rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-900'
  const subcaixa =
    'rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-gray-800 dark:bg-gray-950/70'
  const destaque = 'text-stone-900 dark:text-white'
  const texto =
    'text-xs sm:text-sm leading-relaxed text-stone-600 dark:text-gray-300'
  const botao =
    'rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-800 hover:bg-stone-100 disabled:opacity-45 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 cursor-pointer'

  if (!aula) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
        <div className="relative">
          <Navbar
            activeTab="trilha"
            subtitle="Aprenda no seu ritmo"
            userId={userId}
            isDark={isDark}
            onToggleTheme={alternarTema}
          />
        </div>
        <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-10">
          <div className={caixa}>
            <p className="text-sm font-semibold text-stone-800 dark:text-gray-200">
              Aula não encontrada.
            </p>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="mt-4 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-gray-950 cursor-pointer"
            >
              Voltar à trilha
            </button>
          </div>
        </main>
      </div>
    )
  }

  const etapas = ['Introdução', 'Teoria', 'Prática', 'Quiz', 'Conclusão']

  const progressoPercentual = Math.round(
    ((etapaAtual + 1) / etapas.length) * 100,
  )

  const temOrdenacao =
    Array.isArray(aula.pratica.frases) &&
    Array.isArray(aula.pratica.ordemCorreta) &&
    aula.pratica.frases.length > 0
  const temClassificacao = Boolean(aula.pratica.classificacao)
  const temMontarBlocos = Boolean(aula.pratica.montarBlocos)
  const temCacaErro = Boolean(aula.pratica.cacaErro)
  const temSimulador = Boolean(aula.pratica.simuladorEstado)

  const moverItem = (index: number, direcao: -1 | 1) => {
    const novoIndice = index + direcao
    if (novoIndice < 0 || novoIndice >= itensOrdenados.length) return
    const copia = [...itensOrdenados]
    const temp = copia[index]
    copia[index] = copia[novoIndice]
    copia[novoIndice] = temp
    setItensOrdenados(copia)
    setFeedbackOrdem('idle')
  }

  const conferirOrdem = () => {
    if (!aula.pratica.ordemCorreta) return
    const acertou = aula.pratica.ordemCorreta.every(
      (item: string, idx: number) => itensOrdenados[idx] === item,
    )
    setFeedbackOrdem(acertou ? 'ok' : 'erro')
  }

  const selecionarCategoria = (itemIdx: number, categoria: string) => {
    setSelecoesClassificacao((prev: Record<number, string>) => ({
      ...prev,
      [itemIdx]: categoria,
    }))
    setFeedbackClassificacao('idle')
  }

  const conferirClassificacao = () => {
    const cfg = aula.pratica.classificacao
    if (!cfg) return
    const todosRespondidos = cfg.itens.every(
      (_: ItemClassificacao, idx: number) =>
        Boolean(selecoesClassificacao[idx]),
    )
    if (!todosRespondidos) {
      setFeedbackClassificacao('erro')
      return
    }
    const acertouTodos = cfg.itens.every(
      (item: ItemClassificacao, idx: number) =>
        selecoesClassificacao[idx] === item.categoriaCorreta,
    )
    setFeedbackClassificacao(acertouTodos ? 'ok' : 'erro')
  }

  const conferirBlocos = () => {
    const cfg = aula.pratica.montarBlocos
    if (!cfg) return
    const acertou =
      blocosSelecionados.length === cfg.respostaCorreta.length &&
      cfg.respostaCorreta.every(
        (bloco: string, idx: number) => blocosSelecionados[idx] === bloco,
      )
    setFeedbackBlocos(acertou ? 'ok' : 'erro')
  }

  const conferirCacaErro = () => {
    const cfg = aula.pratica.cacaErro
    if (!cfg || indiceErroSelecionado === null) return
    setFeedbackCacaErro(
      indiceErroSelecionado === cfg.indiceErro ? 'ok' : 'erro',
    )
  }

  const conferirSimulador = () => {
    const cfg = aula.pratica.simuladorEstado
    if (!cfg) return
    const comp = cfg.comparador || '>='
    let atingiu = false
    if (comp === '>=') atingiu = valorSimulador >= cfg.alvo
    else if (comp === '<=') atingiu = valorSimulador <= cfg.alvo
    else atingiu = valorSimulador === cfg.alvo
    setFeedbackSimulador(atingiu ? 'ok' : 'erro')
  }

  const perguntaAtual = aula.quiz[indicePergunta]

  const responderQuiz = (opcaoIdx: number) => {
    if (respostaSelecionada !== null || !perguntaAtual) return
    setRespostaSelecionada(opcaoIdx)
    const acertou = opcaoIdx === perguntaAtual.respostaCorreta
    setRespostasCorretas((prev: boolean[]) => [...prev, acertou])
  }

  const avancarQuiz = () => {
    if (indicePergunta + 1 < aula.quiz.length) {
      setIndicePergunta((prev: number) => prev + 1)
      setRespostaSelecionada(null)
    } else {
      setEtapaAtual(4)
    }
  }

  const handleConcluirAula = async () => {
    if (saving || completed) return
    setSaving(true)
    setErroSalvar(null)

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          `codelab_visitante_aula_${aula.numero}`,
          'true',
        )
      }

      let currentUserId = userId
      if (!currentUserId) {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        currentUserId = session?.user?.id ?? null
        if (currentUserId) setUserId(currentUserId)
      }

      if (currentUserId) {
        const { error } = await supabase.from('user_progress').upsert(
          {
            user_id: currentUserId,
            lesson_id: aula.id,
            completed: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' },
        )
        if (error) {
          throw error
        }
      }

      if (onConcluirAula) {
        await onConcluirAula(aula.id, XP_POR_AULA)
      }

      setConcluidaLocal(true)
    } catch (error) {
      console.error('Erro ao salvar conclusão da aula:', error)
      setErroSalvar(
        'Não foi possível salvar no banco agora, mas o progresso local foi registrado.',
      )
      setConcluidaLocal(true)
    } finally {
      setSaving(false)
    }
  }

  const totalAcertosQuiz = respostasCorretas.filter(Boolean).length

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-emerald-500 selection:text-gray-950">
      <div className="relative">
        <Navbar
          activeTab="trilha"
          subtitle={`Aula ${aula.numero} • ${aula.titulo}`}
          userId={userId}
          isDark={isDark}
          onToggleTheme={alternarTema}
        />
      </div>

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-6 sm:py-8 space-y-5 pb-12">
        {/* Cabeçalho e progresso da aula */}
        <div className={caixa}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="rounded-lg border border-stone-300 bg-stone-50 px-2.5 py-1 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              ← Voltar à trilha
            </button>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Módulo {aula.modulo} • Aula {aula.numero} • +{XP_POR_AULA} XP
            </span>
            <span className="text-xs font-semibold text-stone-500 dark:text-gray-400 tabular-nums">
              Etapa {etapaAtual + 1} de {etapas.length} ({progressoPercentual}%)
            </span>
          </div>

          <h1 className={`mt-2 text-xl sm:text-2xl font-extrabold leading-snug ${destaque}`}>
            {aula.titulo}
          </h1>
          <p className={`mt-1 ${texto}`}>{aula.resumo}</p>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${progressoPercentual}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {etapas.map((nomeEtapa: string, idx: number) => (
              <button
                key={nomeEtapa}
                type="button"
                onClick={() => setEtapaAtual(idx)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer ${
                  etapaAtual === idx
                    ? 'bg-emerald-500 text-gray-950'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {nomeEtapa}
              </button>
            ))}
          </div>
        </div>

        {/* Etapa 0: Introdução */}
        {etapaAtual === 0 && (
          <div className={`${caixa} space-y-4`}>
            <h2 className={`text-lg font-extrabold ${destaque}`}>
              Objetivo e Contexto
            </h2>

            <div className={subcaixa}>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Objetivo da aula
              </span>
              <p className={`mt-1 font-medium ${destaque}`}>
                {aula.introducao.objetivo}
              </p>
            </div>

            <div className={subcaixa}>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400">
                Contexto
              </span>
              <p className={`mt-1 ${texto}`}>{aula.introducao.contexto}</p>
            </div>

            {aula.introducao.imagemUrl && (
              <img
                src={aula.introducao.imagemUrl}
                alt={aula.introducao.imagemAlt || aula.titulo}
                className="w-full rounded-xl border border-stone-200 dark:border-gray-800 object-cover"
              />
            )}
          </div>
        )}

        {/* Etapa 1: Teoria */}
        {etapaAtual === 1 && (
          <div className="space-y-4">
            <div className={caixa}>
              <h2 className={`text-lg font-extrabold ${destaque}`}>
                Conceitos Essenciais
              </h2>

              <div className="mt-4 space-y-3">
                {aula.teoria.topicos.map(
                  (topico: TopicoTeoria, idx: number) => (
                    <div key={`${topico.titulo}-${idx}`} className={subcaixa}>
                      <h3
                        className={`text-sm sm:text-base font-bold ${destaque}`}
                      >
                        {topico.titulo}
                      </h3>
                      <p className={`mt-1.5 whitespace-pre-line ${texto}`}>
                        {topico.explicacao}
                      </p>
                      {topico.imagemUrl && (
                        <img
                          src={topico.imagemUrl}
                          alt={topico.imagemAlt || topico.titulo}
                          className="mt-3 w-full rounded-xl border border-stone-200 dark:border-gray-800 object-cover"
                        />
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className={`${caixa} space-y-4`}>
              <div className={subcaixa}>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400">
                  Aplicação prática
                </span>
                <p className={`mt-1.5 whitespace-pre-line ${texto}`}>
                  {aula.teoria.exemploCotidiano}
                </p>
              </div>

              {aula.teoria.exemploCodigo && (
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1.5">
                    Exemplo de código
                  </span>
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-gray-950 p-4 text-xs leading-relaxed text-emerald-300">
                    <code>{aula.teoria.exemploCodigo}</code>
                  </pre>
                </div>
              )}

              <div className={subcaixa}>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Síntese
                </span>
                <p className={`mt-1 font-semibold ${destaque}`}>
                  {aula.teoria.resumo}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Etapa 2: Prática Interativa */}
        {etapaAtual === 2 && (
          <div className={`${caixa} space-y-4`}>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Prática guiada
              </span>
              <h2 className={`mt-1 text-lg font-extrabold ${destaque}`}>
                {aula.pratica.titulo}
              </h2>
              <p className={`mt-1.5 whitespace-pre-line ${texto}`}>
                {aula.pratica.enunciado}
              </p>
            </div>

            {aula.pratica.codigoInicial && (
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-gray-950 p-3.5 text-xs leading-relaxed text-emerald-300">
                <code>{aula.pratica.codigoInicial}</code>
              </pre>
            )}

            {aula.pratica.imagemUrl && (
              <img
                src={aula.pratica.imagemUrl}
                alt={aula.pratica.imagemAlt || aula.pratica.titulo}
                className="w-full rounded-xl border border-stone-200 dark:border-gray-800 object-cover"
              />
            )}

            {temOrdenacao ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  {itensOrdenados.map((item: string, idx: number) => (
                    <div
                      key={`${item}-${idx}`}
                      className={`${subcaixa} flex items-center justify-between gap-3 py-3`}
                    >
                      <span
                        className={`text-xs sm:text-sm font-semibold ${destaque}`}
                      >
                        {item}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moverItem(idx, -1)}
                          disabled={idx === 0}
                          aria-label="Mover para cima"
                          className="rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-stone-700 disabled:opacity-35 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 cursor-pointer"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moverItem(idx, 1)}
                          disabled={idx === itensOrdenados.length - 1}
                          aria-label="Mover para baixo"
                          className="rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-stone-700 disabled:opacity-35 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 cursor-pointer"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={conferirOrdem}
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-gray-950 cursor-pointer"
                  >
                    Conferir ordem
                  </button>
                </div>

                {feedbackOrdem === 'ok' && (
                  <div className={subcaixa}>
                    <p
                      className={`text-xs sm:text-sm font-semibold ${destaque}`}
                    >
                      ✓{' '}
                      {aula.pratica.acertoMsg ||
                        'Sequência organizada corretamente.'}
                    </p>
                  </div>
                )}

                {feedbackOrdem === 'erro' && (
                  <div className={`${subcaixa} space-y-1`}>
                    <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400">
                      {aula.pratica.erroMsg ||
                        'A sequência ainda precisa de ajustes. Revise a ordem das etapas.'}
                    </p>
                    {aula.pratica.dica && (
                      <p className={texto}>
                        <strong className={destaque}>Dica:</strong>{' '}
                        {aula.pratica.dica}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : temClassificacao ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {aula.pratica.classificacao!.itens.map(
                    (item: ItemClassificacao, itemIdx: number) => {
                      const escolhida = selecoesClassificacao[itemIdx]
                      return (
                        <div
                          key={`${item.texto}-${itemIdx}`}
                          className={`${subcaixa} space-y-2.5`}
                        >
                          <p
                            className={`font-mono text-xs sm:text-sm font-bold ${destaque}`}
                          >
                            {item.texto}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {aula.pratica.classificacao!.categorias.map(
                              (cat: string) => {
                                const ativa = escolhida === cat
                                return (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() =>
                                      selecionarCategoria(itemIdx, cat)
                                    }
                                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                                      ativa
                                        ? 'border-emerald-500 bg-emerald-500 text-gray-950'
                                        : 'border-stone-300 bg-white text-stone-700 hover:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
                                    }`}
                                  >
                                    {cat}
                                  </button>
                                )
                              },
                            )}
                          </div>
                        </div>
                      )
                    },
                  )}
                </div>

                <button
                  type="button"
                  onClick={conferirClassificacao}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-gray-950 cursor-pointer"
                >
                  Conferir classificação
                </button>

                {feedbackClassificacao === 'ok' && (
                  <div className={subcaixa}>
                    <p
                      className={`text-xs sm:text-sm font-semibold ${destaque}`}
                    >
                      ✓{' '}
                      {aula.pratica.classificacao!.acertoMsg ||
                        'Classificação concluída corretamente.'}
                    </p>
                  </div>
                )}

                {feedbackClassificacao === 'erro' && (
                  <div className={`${subcaixa} space-y-1`}>
                    <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400">
                      {aula.pratica.classificacao!.erroMsg ||
                        'Há itens pendentes ou classificados de forma incorreta.'}
                    </p>
                    {aula.pratica.dica && (
                      <p className={texto}>
                        <strong className={destaque}>Dica:</strong>{' '}
                        {aula.pratica.dica}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : temMontarBlocos ? (
              <div className="space-y-4">
                <div className={`${subcaixa} space-y-3`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400">
                      Montagem
                    </span>
                    {blocosSelecionados.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFeedbackBlocos('idle')
                          setBlocosSelecionados((prev: string[]) =>
                            prev.slice(0, -1),
                          )
                        }}
                        className="text-xs font-bold text-stone-600 hover:text-stone-900 dark:text-gray-400 dark:hover:text-white cursor-pointer"
                      >
                        Desfazer último
                      </button>
                    )}
                  </div>

                  {blocosSelecionados.length === 0 ? (
                    <p className="font-mono text-xs sm:text-sm text-stone-400 dark:text-gray-500">
                      ...
                    </p>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {blocosSelecionados.map(
                          (bloco: string, idx: number) => (
                            <button
                              key={`${bloco}-${idx}`}
                              type="button"
                              onClick={() => {
                                setFeedbackBlocos('idle')
                                setBlocosSelecionados((prev: string[]) =>
                                  prev.filter(
                                    (_: string, i: number) => i !== idx,
                                  ),
                                )
                              }}
                              title="Toque para remover"
                              className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs sm:text-sm font-bold text-emerald-900 hover:bg-emerald-500/20 dark:text-emerald-200 cursor-pointer"
                            >
                              {bloco}
                            </button>
                          ),
                        )}
                      </div>

                      <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-gray-950 px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-emerald-300">
                        <code>{blocosSelecionados.join('')}</code>
                      </pre>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {aula.pratica.montarBlocos!.blocosDisponiveis.map(
                    (bloco: string, idx: number) => (
                      <button
                        key={`${bloco}-${idx}`}
                        type="button"
                        onClick={() => {
                          setFeedbackBlocos('idle')
                          setBlocosSelecionados((prev: string[]) => [
                            ...prev,
                            bloco,
                          ])
                        }}
                        className="rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono text-xs sm:text-sm font-bold text-stone-800 hover:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 cursor-pointer"
                      >
                        {bloco}
                      </button>
                    ),
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={conferirBlocos}
                    disabled={blocosSelecionados.length === 0}
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-45 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-gray-950 cursor-pointer"
                  >
                    Conferir
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBlocosSelecionados([])
                      setFeedbackBlocos('idle')
                    }}
                    disabled={blocosSelecionados.length === 0}
                    className={botao}
                  >
                    Limpar
                  </button>
                </div>

                {feedbackBlocos === 'ok' && (
                  <div className={subcaixa}>
                    <p
                      className={`text-xs sm:text-sm font-semibold ${destaque}`}
                    >
                      ✓{' '}
                      {aula.pratica.montarBlocos!.acertoMsg ||
                        'Estrutura montada corretamente.'}
                    </p>
                  </div>
                )}

                {feedbackBlocos === 'erro' && (
                  <div className={`${subcaixa} space-y-1`}>
                    <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400">
                      {aula.pratica.montarBlocos!.erroMsg ||
                        'Ainda não ficou certo. Tente montar novamente.'}
                    </p>
                    {aula.pratica.dica && (
                      <p className={texto}>
                        <strong className={destaque}>Dica:</strong>{' '}
                        {aula.pratica.dica}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : temCacaErro ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  {aula.pratica.cacaErro!.etapas.map(
                    (etapaLinha: string, idx: number) => {
                      const selecionada = indiceErroSelecionado === idx
                      return (
                        <button
                          key={`${etapaLinha}-${idx}`}
                          type="button"
                          onClick={() => {
                            setIndiceErroSelecionado(idx)
                            setFeedbackCacaErro('idle')
                          }}
                          className={`w-full text-left rounded-xl border p-3 font-mono text-xs sm:text-sm cursor-pointer ${
                            selecionada
                              ? 'border-emerald-500 bg-emerald-500/15 font-bold text-emerald-900 dark:text-emerald-200'
                              : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-emerald-500 dark:border-gray-800 dark:bg-gray-950/70 dark:text-gray-200'
                          }`}
                        >
                          {etapaLinha}
                        </button>
                      )
                    },
                  )}
                </div>

                <button
                  type="button"
                  onClick={conferirCacaErro}
                  disabled={indiceErroSelecionado === null}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-45 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-gray-950 cursor-pointer"
                >
                  Conferir linha com erro
                </button>

                {feedbackCacaErro === 'ok' && (
                  <div className={subcaixa}>
                    <p
                      className={`text-xs sm:text-sm font-semibold ${destaque}`}
                    >
                      ✓{' '}
                      {aula.pratica.cacaErro!.acertoMsg ||
                        'Você encontrou o ponto problemático corretamente.'}
                    </p>
                  </div>
                )}

                {feedbackCacaErro === 'erro' && (
                  <div className={`${subcaixa} space-y-1`}>
                    <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400">
                      {aula.pratica.cacaErro!.erroMsg ||
                        'Essa linha não é o erro principal. Tente outra.'}
                    </p>
                    {aula.pratica.dica && (
                      <p className={texto}>
                        <strong className={destaque}>Dica:</strong>{' '}
                        {aula.pratica.dica}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : temSimulador ? (
              <div className="space-y-4">
                <div className={`${subcaixa} space-y-2`}>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {aula.pratica.simuladorEstado!.rotuloEstado}
                  </span>
                  <p className={`text-xl font-black tabular-nums ${destaque}`}>
                    {valorSimulador}
                  </p>
                  <p className={texto}>
                    {aula.pratica.simuladorEstado!.descricaoMeta}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {aula.pratica.simuladorEstado!.acoes.map(
                    (acao: AcaoSimulador, idx: number) => (
                      <button
                        key={`${acao.rotulo}-${idx}`}
                        type="button"
                        onClick={() => {
                          setValorSimulador((prev: number) => prev + acao.delta)
                          setFeedbackSimulador('idle')
                        }}
                        className={botao}
                      >
                        {acao.rotulo}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setValorSimulador(
                        aula.pratica.simuladorEstado!.valorInicial,
                      )
                      setFeedbackSimulador('idle')
                    }}
                    className={botao}
                  >
                    Reiniciar
                  </button>
                </div>

                <button
                  type="button"
                  onClick={conferirSimulador}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-gray-950 cursor-pointer"
                >
                  Conferir estado
                </button>

                {feedbackSimulador === 'ok' && (
                  <div className={subcaixa}>
                    <p
                      className={`text-xs sm:text-sm font-semibold ${destaque}`}
                    >
                      ✓{' '}
                      {aula.pratica.simuladorEstado!.acertoMsg ||
                        'Meta atingida com sucesso.'}
                    </p>
                  </div>
                )}

                {feedbackSimulador === 'erro' && (
                  <div className={`${subcaixa} space-y-1`}>
                    <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400">
                      {aula.pratica.simuladorEstado!.erroMsg ||
                        'Ainda não atingiu a meta esperada.'}
                    </p>
                    {aula.pratica.dica && (
                      <p className={texto}>
                        <strong className={destaque}>Dica:</strong>{' '}
                        {aula.pratica.dica}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className={subcaixa}>
                <p className={texto}>{aula.pratica.resultadoEsperado}</p>
                {aula.pratica.dica && (
                  <p className={`mt-2 ${texto}`}>
                    <strong className={destaque}>Dica:</strong> {aula.pratica.dica}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Etapa 3: Quiz */}
        {etapaAtual === 3 && perguntaAtual && (
          <div className={`${caixa} space-y-4`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Verificação rápida
              </span>
              <span className="text-xs font-semibold text-stone-500 dark:text-gray-400 tabular-nums">
                Pergunta {indicePergunta + 1} de {aula.quiz.length}
              </span>
            </div>

            <h2 className={`text-base sm:text-lg font-extrabold ${destaque}`}>
              {perguntaAtual.pergunta}
            </h2>

            <div className="space-y-2.5">
              {perguntaAtual.opcoes.map((opcao: string, idx: number) => {
                const selecionada = respostaSelecionada === idx
                const ehCorreta = idx === perguntaAtual.respostaCorreta
                let estiloOpcao =
                  'border-stone-200 bg-stone-50 text-stone-800 hover:border-emerald-500 dark:border-gray-800 dark:bg-gray-950/70 dark:text-gray-200'

                if (respostaSelecionada !== null) {
                  if (ehCorreta) {
                    estiloOpcao =
                      'border-emerald-500 bg-emerald-500/15 font-bold text-emerald-900 dark:text-emerald-200'
                  } else if (selecionada) {
                    estiloOpcao =
                      'border-red-500 bg-red-500/15 text-red-900 dark:text-red-200'
                  }
                }

                return (
                  <button
                    key={`${opcao}-${idx}`}
                    type="button"
                    onClick={() => responderQuiz(idx)}
                    disabled={respostaSelecionada !== null}
                    className={`w-full text-left rounded-xl border p-3.5 text-xs sm:text-sm cursor-pointer ${estiloOpcao}`}
                  >
                    {opcao}
                  </button>
                )
              })}
            </div>

            {respostaSelecionada !== null && (
              <div className={`${subcaixa} space-y-3`}>
                <p
                  className={`text-xs sm:text-sm font-semibold ${
                    respostaSelecionada === perguntaAtual.respostaCorreta
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {respostaSelecionada === perguntaAtual.respostaCorreta
                    ? '✓ Resposta correta!'
                    : 'Atenção à explicação:'}
                </p>
                <p className={texto}>{perguntaAtual.explicacao}</p>
                <button
                  type="button"
                  onClick={avancarQuiz}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs sm:text-sm font-extrabold text-gray-950 cursor-pointer"
                >
                  {indicePergunta + 1 < aula.quiz.length
                    ? 'Próxima pergunta →'
                    : 'Ir para a conclusão →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Etapa 4: Conclusão */}
        {etapaAtual === 4 && (
          <div className={`${caixa} space-y-4`}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className={`text-lg font-extrabold ${destaque}`}>
                Resumo e Conclusão
              </h2>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                Quiz: {totalAcertosQuiz}/{aula.quiz.length}
              </span>
            </div>

            <div className={subcaixa}>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                O que você trabalhou nesta aula
              </span>
              <ul className="space-y-1.5 list-disc list-inside">
                {aula.conclusao.aprendizados.map(
                  (item: string, idx: number) => (
                    <li key={`${item}-${idx}`} className={texto}>
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className={subcaixa}>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400">
                Para refletir
              </span>
              <p className={`mt-1 ${texto}`}>{aula.conclusao.reflexao}</p>
            </div>

            {erroSalvar && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-50 p-3 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                {erroSalvar}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {completed ? (
                <span className="rounded-xl border border-emerald-600/30 bg-emerald-50 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
                  ✓ Aula concluída (+{XP_POR_AULA} XP)
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleConcluirAula()}
                  disabled={saving}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-gray-950 cursor-pointer"
                >
                  {saving
                    ? 'Salvando...'
                    : `Concluir aula e ganhar +${XP_POR_AULA} XP`}
                </button>
              )}

              <div className="flex flex-wrap gap-2">
                {aula.conclusao.proximaAulaId ? (
                  <button
                    type="button"
                    onClick={() => {
                      const prox = aulasData.find(
                        (item) => item.id === aula.conclusao.proximaAulaId,
                      )
                      router.push(
                        prox
                          ? `/dashboard/aula/${prox.numero}`
                          : '/dashboard',
                      )
                    }}
                    className={botao}
                  >
                    Próxima aula →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className={botao}
                  >
                    Voltar à trilha
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navegação entre etapas */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              setEtapaAtual((prev: number) => Math.max(0, prev - 1))
            }
            disabled={etapaAtual === 0}
            className={botao}
          >
            ← Etapa anterior
          </button>

          {etapaAtual < etapas.length - 1 && (
            <button
              type="button"
              onClick={() =>
                setEtapaAtual((prev: number) =>
                  Math.min(etapas.length - 1, prev + 1),
                )
              }
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-gray-950 cursor-pointer"
            >
              Próxima etapa →
            </button>
          )}
        </div>
      </main>

      <footer className="border-t border-stone-200 dark:border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs max-w-3xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 dark:text-gray-500">
        <p>Codelab João • Aprendizado prático de JavaScript</p>
        <Link
          href="/contato"
          className="font-medium hover:text-emerald-700 text-stone-600 dark:hover:text-emerald-400 dark:text-gray-400"
        >
          💬 Contato e Suporte
        </Link>
      </footer>
    </div>
  )
}