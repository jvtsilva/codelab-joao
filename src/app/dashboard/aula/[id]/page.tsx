'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
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

function isSafeImageSrc(url?: string): boolean {
  if (!url) return false
  const trimmed = url.trim()
  return trimmed.startsWith('/') || trimmed.startsWith('https://')
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

  const aulaId = aula?.id
  const aulaNumero = aula?.numero

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

  const aulaRef = useRef<AulaItem | undefined>(aula)
  aulaRef.current = aula

  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.style.backgroundColor = isDark
      ? '#030712'
      : '#fafaf9'
  }, [isDark])

  useEffect(() => {
    if (!aulaId || aulaNumero === undefined) return
    let active = true

    async function carregarSessaoEProgresso() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()
        if (!active) return

        if (sessionError) {
          console.error('Erro ao obter sessão na aula:', sessionError.message)
        }

        let jaConcluida = false

        if (typeof window !== 'undefined') {
          if (
            window.localStorage.getItem(
              `codelab_visitante_aula_${aulaNumero}`,
            ) === 'true'
          ) {
            jaConcluida = true
          }
        }

        const currentUserId = session?.user?.id ?? null
        setUserId(currentUserId)

        if (currentUserId) {
          const { data, error: progressError } = await supabase
            .from('user_progress')
            .select('completed')
            .eq('user_id', currentUserId)
            .eq('lesson_id', aulaId!)
            .maybeSingle()

          if (!active) return
          if (progressError) {
            console.error('Erro ao consultar user_progress:', progressError.message)
          } else if (data?.completed) {
            jaConcluida = true
          }
        }

        if (active && jaConcluida) {
          setConcluidaLocal(true)
        }
      } catch (err) {
        console.error('Erro inesperado ao carregar progresso da aula:', err)
      }
    }

    void carregarSessaoEProgresso()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      const nextUserId = session?.user?.id ?? null
      setUserId(nextUserId)
      if (event === 'SIGNED_OUT') {
        setConcluidaLocal(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [aulaId, aulaNumero])

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
    const atualAula = aulaRef.current
    if (!atualAula) return
    setEtapaAtual(0)
    setConcluidaLocal(false)
    setErroSalvar(null)
    setSaving(false)

    setItensOrdenados(
      atualAula.pratica.frases ? [...atualAula.pratica.frases] : [],
    )
    setFeedbackOrdem('idle')

    setSelecoesClassificacao({})
    setFeedbackClassificacao('idle')

    setBlocosSelecionados([])
    setFeedbackBlocos('idle')

    setIndiceErroSelecionado(null)
    setFeedbackCacaErro('idle')

    setValorSimulador(atualAula.pratica.simuladorEstado?.valorInicial ?? 0)
    setFeedbackSimulador('idle')

    setIndicePergunta(0)
    setRespostaSelecionada(null)
    setRespostasCorretas([])
  }, [aulaId])

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
        <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-10">
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

  const indiceAtual = aulasData.findIndex(
    (item: AulaItem) => item.id === aula.id,
  )
  const proximaAula: AulaItem | undefined =
    aulasData.find(
      (item: AulaItem) => item.id === aula.conclusao?.proximaAulaId,
    ) ||
    (indiceAtual !== -1 && indiceAtual + 1 < aulasData.length
      ? aulasData[indiceAtual + 1]
      : undefined)

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
  const listaQuiz = Array.isArray(aula.quiz) ? aula.quiz : []
  const linhasCacaErro =
    aula.pratica.cacaErro?.linhas ?? aula.pratica.cacaErro?.etapas ?? []

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

  const perguntaAtual = listaQuiz[indicePergunta]

  const responderQuiz = (opcaoIdx: number) => {
    if (respostaSelecionada !== null || !perguntaAtual) return
    setRespostaSelecionada(opcaoIdx)
    const acertou = opcaoIdx === perguntaAtual.respostaCorreta
    setRespostasCorretas((prev: boolean[]) => [...prev, acertou])
  }

  const avancarQuiz = () => {
    if (indicePergunta + 1 < listaQuiz.length) {
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
        const { error } = await supabase.rpc('complete_lesson', {
          p_lesson_id: aula.id,
        })
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

      <main className="flex-1 mx-auto max-w-6xl w-full px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 pb-12">
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

          <h1
            className={`mt-2 text-xl sm:text-2xl font-extrabold leading-snug ${destaque}`}
          >
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
                {aula.introducao?.objetivo}
              </p>
            </div>

            <div className={subcaixa}>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400">
                Contexto
              </span>
              <p className={`mt-1 ${texto}`}>{aula.introducao?.contexto}</p>
            </div>

            {isSafeImageSrc(aula.introducao?.imagemUrl) && (
              <img
                src={aula.introducao!.imagemUrl!}
                alt={aula.introducao?.imagemAlt || aula.titulo}
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
                {(aula.teoria?.topicos ?? []).map(
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
                      {isSafeImageSrc(topico.imagemUrl) && (
                        <img
                          src={topico.imagemUrl!}
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
                  {aula.teoria?.exemploCotidiano}
                </p>
              </div>

              {aula.teoria?.exemploCodigo && (
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
                  {aula.teoria?.resumo}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Etapa 2: Prática Interativa */}
        {etapaAtual === 2 && (
          <div className={`${caixa} space-y-5`}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Prática guiada
                </span>
                <h2 className={`mt-1 text-lg font-extrabold ${destaque}`}>
                  {aula.pratica?.titulo}
                </h2>
                <p className={`mt-1.5 whitespace-pre-line ${texto}`}>
                  {aula.pratica?.enunciado}
                </p>
              </div>

              <Link
                href="/playground"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 shrink-0"
              >
                Ir para o Playground →
              </Link>
            </div>

            {aula.pratica?.codigoInicial && (
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-gray-950 p-3.5 text-xs leading-relaxed text-emerald-300">
                <code>{aula.pratica.codigoInicial}</code>
              </pre>
            )}

            {isSafeImageSrc(aula.pratica?.imagemUrl) && (
              <img
                src={aula.pratica!.imagemUrl!}
                alt={aula.pratica?.imagemAlt || aula.pratica?.titulo || aula.titulo}
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
                        'A montagem ainda não corresponde ao esperado. Tente ajustar os blocos.'}
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
              <div className="space-y-4">
                <div className="space-y-2">
                  {linhasCacaErro.map((linha: string, idx: number) => {
                    const selecionada = indiceErroSelecionado === idx
                    return (
                      <button
                        key={`${linha}-${idx}`}
                        type="button"
                        onClick={() => {
                          setIndiceErroSelecionado(idx)
                          setFeedbackCacaErro('idle')
                        }}
                        className={`w-full text-left rounded-xl border px-3.5 py-2.5 font-mono text-xs sm:text-sm cursor-pointer ${
                          selecionada
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-950 font-bold dark:text-emerald-200'
                            : 'border-stone-300 bg-stone-50 text-stone-800 hover:border-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200'
                        }`}
                      >
                        <span className="mr-2 text-stone-400 dark:text-gray-500">
                          {idx + 1}.
                        </span>
                        {linha}
                      </button>
                    )
                  })}
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
                        'Erro identificado corretamente.'}
                    </p>
                  </div>
                )}

                {feedbackCacaErro === 'erro' && (
                  <div className={`${subcaixa} space-y-1`}>
                    <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400">
                      {aula.pratica.cacaErro!.erroMsg ||
                        'Essa linha não é a que contém o problema. Observe com calma.'}
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
                <div className={`${subcaixa} space-y-3`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400">
                      {aula.pratica.simuladorEstado!.rotulo ||
                        aula.pratica.simuladorEstado!.rotuloEstado ||
                        'Estado atual'}
                    </span>
                    <span
                      className={`font-mono text-base sm:text-lg font-black tabular-nums ${destaque}`}
                    >
                      {valorSimulador}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {aula.pratica.simuladorEstado!.acoes.map(
                      (acao: AcaoSimulador, idx: number) => (
                        <button
                          key={`${acao.rotulo}-${idx}`}
                          type="button"
                          onClick={() => {
                            setValorSimulador((atual: number) =>
                              acao.definirPara !== undefined
                                ? acao.definirPara
                                : atual + (acao.delta ?? 0),
                            )
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
                          aula.pratica.simuladorEstado!.valorInicial ?? 0,
                        )
                        setFeedbackSimulador('idle')
                      }}
                      className={botao}
                    >
                      Resetar valor
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={conferirSimulador}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-gray-950 cursor-pointer"
                >
                  Verificar meta
                </button>

                {feedbackSimulador === 'ok' && (
                  <div className={subcaixa}>
                    <p
                      className={`text-xs sm:text-sm font-semibold ${destaque}`}
                    >
                      ✓{' '}
                      {aula.pratica.simuladorEstado!.acertoMsg ||
                        'Meta atingida corretamente.'}
                    </p>
                  </div>
                )}

                {feedbackSimulador === 'erro' && (
                  <div className={`${subcaixa} space-y-1`}>
                    <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400">
                      {aula.pratica.simuladorEstado!.erroMsg ||
                        'O valor ainda não atingiu o objetivo da prática.'}
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
              <div className={`${subcaixa} space-y-3`}>
                <p className={texto}>
                  {aula.pratica?.dica ||
                    'Revise os conceitos da etapa anterior e avance para o quiz.'}
                </p>
                <Link
                  href="/playground"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs sm:text-sm font-extrabold text-gray-950"
                >
                  Testar no Playground →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Etapa 3: Quiz */}
        {etapaAtual === 3 && (
          <div className={`${caixa} space-y-4`}>
            {perguntaAtual ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Quiz da aula
                  </span>
                  <span className="text-xs font-semibold text-stone-500 dark:text-gray-400 tabular-nums">
                    Pergunta {indicePergunta + 1} de {listaQuiz.length}
                  </span>
                </div>

                <h2 className={`text-base sm:text-lg font-extrabold ${destaque}`}>
                  {perguntaAtual.pergunta}
                </h2>

                <div className="space-y-2">
                  {perguntaAtual.opcoes.map((opcao: string, idx: number) => {
                    const respondida = respostaSelecionada !== null
                    const escolhida = respostaSelecionada === idx
                    const correta = perguntaAtual.respostaCorreta === idx

                    let estiloOpcao =
                      'border-stone-300 bg-stone-50 text-stone-800 hover:border-emerald-500 dark:border-gray-700 dark:bg-gray-950/70 dark:text-gray-200'

                    if (respondida) {
                      if (correta) {
                        estiloOpcao =
                          'border-emerald-500 bg-emerald-500/15 text-emerald-950 font-bold dark:text-emerald-200'
                      } else if (escolhida) {
                        estiloOpcao =
                          'border-red-500 bg-red-500/15 text-red-900 font-semibold dark:text-red-300'
                      }
                    }

                    return (
                      <button
                        key={`${opcao}-${idx}`}
                        type="button"
                        disabled={respondida}
                        onClick={() => responderQuiz(idx)}
                        className={`w-full text-left rounded-xl border px-4 py-3 text-xs sm:text-sm cursor-pointer disabled:cursor-default ${estiloOpcao}`}
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
                      {indicePergunta + 1 < listaQuiz.length
                        ? 'Próxima pergunta →'
                        : 'Ir para conclusão →'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <p className={texto}>
                  Nenhuma pergunta cadastrada nesta aula. Você pode avançar
                  para a conclusão.
                </p>
                <button
                  type="button"
                  onClick={() => setEtapaAtual(4)}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs sm:text-sm font-extrabold text-gray-950 cursor-pointer"
                >
                  Ir para conclusão →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Etapa 4: Conclusão */}
        {etapaAtual === 4 && (
          <div className={`${caixa} space-y-4`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Conclusão da aula
            </span>
            <h2 className={`text-lg sm:text-xl font-extrabold ${destaque}`}>
              {aula.conclusao?.titulo || 'Aula concluída'}
            </h2>
            <p className={`whitespace-pre-line ${texto}`}>
              {aula.conclusao?.mensagem ||
                (aula.conclusao?.aprendizados ?? []).join('\n')}
            </p>

            {listaQuiz.length > 0 && respostasCorretas.length > 0 && (
              <div className={subcaixa}>
                <p className={`text-xs sm:text-sm font-semibold ${destaque}`}>
                  Desempenho no quiz: {totalAcertosQuiz} de {listaQuiz.length}{' '}
                  acertos
                </p>
              </div>
            )}

            <div className={subcaixa}>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400">
                Próximo passo
              </span>
              <p className={`mt-1 text-xs sm:text-sm ${destaque}`}>
                {aula.conclusao?.proximoPasso ||
                  aula.conclusao?.reflexao ||
                  'Continue avançando na trilha ou teste suas ideias no Playground.'}
              </p>
            </div>

            {erroSalvar && (
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                {erroSalvar}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 pt-2">
              {completed ? (
                <span className="inline-flex items-center justify-center rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  ✓ Aula concluída (+{XP_POR_AULA} XP)
                </span>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleConcluirAula()}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-gray-950 cursor-pointer"
                >
                  {saving
                    ? 'Salvando...'
                    : `Concluir aula (+${XP_POR_AULA} XP)`}
                </button>
              )}

              {proximaAula && (
                <Link
                  href={`/dashboard/aula/${proximaAula.id}`}
                  className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs sm:text-sm font-extrabold ${
                    completed
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-gray-950'
                      : 'border border-emerald-500/50 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300'
                  }`}
                >
                  Próxima aula ({proximaAula.numero}) →
                </Link>
              )}

              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className={`${botao} inline-flex items-center justify-center`}
              >
                Voltar à trilha
              </button>

              <Link
                href="/playground"
                className={`${botao} inline-flex items-center justify-center`}
              >
                Ir para o Playground →
              </Link>
            </div>
          </div>
        )}

        {/* Navegação entre etapas */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={etapaAtual === 0}
            onClick={() => setEtapaAtual((prev: number) => Math.max(0, prev - 1))}
            className={botao}
          >
            ← Etapa anterior
          </button>

          <button
            type="button"
            disabled={etapaAtual === etapas.length - 1}
            onClick={() =>
              setEtapaAtual((prev: number) =>
                Math.min(etapas.length - 1, prev + 1),
              )
            }
            className={botao}
          >
            Próxima etapa →
          </button>
        </div>
      </main>
    </div>
  )
}