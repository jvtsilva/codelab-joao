'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/hooks/useTheme'
import { Navbar } from '@/components/Navbar'
import { PageHeaderBanner } from '@/components/PageHeaderBanner'
import { LabSurface } from '@/components/LabSurface'
import {
  aulasData,
  type AcaoSimulador,
  type AulaItem,
  type ItemClassificacao,
  type TopicoTeoria,
} from '@/data/lessonsData'

interface AulaDetalhePageProps {
  concluidasIds?: string[]
  onConcluirAula?: (aulaId: string) => Promise<void> | void
}

type FeedbackStatus = 'idle' | 'ok' | 'erro'

function isSafeImageSrc(url?: string): boolean {
  if (!url) return false
  const trimmed = url.trim()
  return trimmed.startsWith('/') || trimmed.startsWith('https://')
}

function readVisitorLessonCompleted(lessonNumber: number): boolean {
  if (typeof window === 'undefined') return false
  try {
    return (
      window.localStorage.getItem(`codelab_visitante_aula_${lessonNumber}`) ===
      'true'
    )
  } catch {
    return false
  }
}

function writeVisitorLessonCompleted(lessonNumber: number): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(`codelab_visitante_aula_${lessonNumber}`, 'true')
  } catch {
    // Ignora bloqueio de storage pelo navegador
  }
}

interface AulaDetalheContentProps {
  aula: AulaItem
  concluidasIds: string[]
  onConcluirAula?: (aulaId: string) => Promise<void> | void
  userId: string | null
  onUserIdChange: (id: string | null) => void
  onConcluidaChange: (concluida: boolean) => void
}

function AulaDetalheContent({
  aula,
  concluidasIds,
  onConcluirAula,
  userId,
  onUserIdChange,
  onConcluidaChange,
}: AulaDetalheContentProps) {
  const router = useRouter()

  const [etapaAtual, setEtapaAtual] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const [concluidaLocal, setConcluidaLocal] = useState<boolean>(false)
  const [erroSalvar, setErroSalvar] = useState<string | null>(null)

  // Prática 1: Ordenar frases / passos
  const [itensOrdenados, setItensOrdenados] = useState<string[]>(() =>
    aula.pratica.frases ? [...aula.pratica.frases] : []
  )
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
  const [valorSimulador, setValorSimulador] = useState<number>(
    () => aula.pratica.simuladorEstado?.valorInicial ?? 0
  )
  const [feedbackSimulador, setFeedbackSimulador] =
    useState<FeedbackStatus>('idle')

  // Quiz interativo (uma questão por vez)
  const [indicePergunta, setIndicePergunta] = useState<number>(0)
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(
    null
  )
  const [respostasCorretas, setRespostasCorretas] = useState<boolean[]>([])

  const aulaId = aula.id
  const aulaNumero = aula.numero

  useEffect(() => {
    let active = true

    async function carregarSessaoEProgresso() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()
        if (!active) return

        if (sessionError && process.env.NODE_ENV === 'development') {
          console.error('Erro ao obter sessão na aula:', sessionError.message)
        }

        let jaConcluida = readVisitorLessonCompleted(aulaNumero)

        const currentUserId = session?.user?.id ?? null
        onUserIdChange(currentUserId)

        if (currentUserId) {
          const { data, error: progressError } = await supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', currentUserId)
            .eq('lesson_id', aulaId)
            .maybeSingle()

          if (!active) return
          if (progressError && process.env.NODE_ENV === 'development') {
            console.error(
              'Erro ao consultar progresso da aula:',
              progressError.message
            )
          } else if (data?.lesson_id) {
            jaConcluida = true
          }
        }

        if (active && jaConcluida) {
          setConcluidaLocal(true)
          onConcluidaChange(true)
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro inesperado ao carregar progresso da aula:', err)
        }
      }
    }

    void carregarSessaoEProgresso()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!active) return
        const nextUserId = session?.user?.id ?? null
        onUserIdChange(nextUserId)
        if (event === 'SIGNED_OUT') {
          setConcluidaLocal(false)
          onConcluidaChange(false)
        }
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [aulaId, aulaNumero, onConcluidaChange, onUserIdChange])

  const completed =
    concluidaLocal ||
    concluidasIds.includes(aula.id) ||
    concluidasIds.includes(String(aula.numero))

  const caixa = 'p-5 sm:p-7 transition-all duration-300'
  const subcaixa =
    'rounded-2xl border border-stone-200/85 bg-stone-50/90 p-4 transition-colors duration-200 dark:border-gray-800/85 dark:bg-gray-950/75'
  const destaque = 'text-stone-900 dark:text-white'
  const texto =
    'text-xs sm:text-sm leading-relaxed text-stone-600 dark:text-gray-300'
  const botao =
    'press-tactile rounded-xl border border-stone-300/90 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-800 hover:bg-stone-100 hover:border-stone-400 disabled:opacity-45 dark:border-gray-700/90 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:border-gray-600 cursor-pointer'
  const botaoPrimario =
    'press-tactile rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-45 px-4 py-2.5 text-xs sm:text-sm font-black text-gray-950 shadow-xs cursor-pointer transition-all'

  const indiceAtual = aulasData.findIndex(
    (item: AulaItem) => item.id === aula.id
  )
  const proximaAula: AulaItem | undefined =
    aulasData.find(
      (item: AulaItem) => item.id === aula.conclusao?.proximaAulaId
    ) ||
    (indiceAtual !== -1 && indiceAtual + 1 < aulasData.length
      ? aulasData[indiceAtual + 1]
      : undefined)

  const etapas = ['Introdução', 'Teoria', 'Prática', 'Quiz', 'Conclusão']

  const progressoPercentual = Math.round(
    ((etapaAtual + 1) / etapas.length) * 100
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
      (item: string, idx: number) => itensOrdenados[idx] === item
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
        Boolean(selecoesClassificacao[idx])
    )
    if (!todosRespondidos) {
      setFeedbackClassificacao('erro')
      return
    }
    const acertouTodos = cfg.itens.every(
      (item: ItemClassificacao, idx: number) =>
        selecoesClassificacao[idx] === item.categoriaCorreta
    )
    setFeedbackClassificacao(acertouTodos ? 'ok' : 'erro')
  }

  const conferirBlocos = () => {
    const cfg = aula.pratica.montarBlocos
    if (!cfg) return
    const acertou =
      blocosSelecionados.length === cfg.respostaCorreta.length &&
      cfg.respostaCorreta.every(
        (bloco: string, idx: number) => blocosSelecionados[idx] === bloco
      )
    setFeedbackBlocos(acertou ? 'ok' : 'erro')
  }

  const conferirCacaErro = () => {
    const cfg = aula.pratica.cacaErro
    if (!cfg || indiceErroSelecionado === null) return
    setFeedbackCacaErro(
      indiceErroSelecionado === cfg.indiceErro ? 'ok' : 'erro'
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
      writeVisitorLessonCompleted(aula.numero)

      let currentUserId = userId
      if (!currentUserId) {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        currentUserId = session?.user?.id ?? null
        if (currentUserId) onUserIdChange(currentUserId)
      }

      if (currentUserId) {
        const { error: rpcError } = await supabase.rpc('complete_lesson', {
          p_lesson_id: aula.id,
        })

        if (rpcError) {
          const { error: upsertError } = await supabase
            .from('user_progress')
            .upsert(
              {
                user_id: currentUserId,
                lesson_id: aula.id,
              },
              { onConflict: 'user_id,lesson_id' }
            )

          if (upsertError) {
            throw upsertError
          }
        }
      }

      if (onConcluirAula) {
        await onConcluirAula(aula.id)
      }

      setConcluidaLocal(true)
      onConcluidaChange(true)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao salvar conclusão da aula:', error)
      }
      setErroSalvar(
        'Não foi possível sincronizar agora, mas o seu progresso local foi salvo.'
      )
      setConcluidaLocal(true)
      onConcluidaChange(true)
    } finally {
      setSaving(false)
    }
  }

  const totalAcertosQuiz = respostasCorretas.filter(Boolean).length

  return (
    <main className="flex-1 mx-auto max-w-7xl w-full px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 pb-14">
      <LabSurface variant="card" className={`${caixa} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="press-tactile rounded-xl border border-stone-300/90 bg-stone-50/90 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-gray-700/90 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800 cursor-pointer"
          >
            ← Voltar à trilha
          </button>

          <span className="text-xs font-bold text-stone-500 dark:text-gray-400 tabular-nums">
            Etapa {etapaAtual + 1} de {etapas.length} ({progressoPercentual}%)
          </span>
        </div>

        <PageHeaderBanner
          tone="emerald"
          badge={`Módulo ${aula.modulo} • Aula ${aula.numero}`}
          title={aula.titulo}
          description={aula.resumo}
          className="border-0 bg-transparent p-0 sm:p-0 shadow-none dark:bg-transparent"
        />

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-200/90 dark:bg-gray-800/90">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-teal-300 transition-[width] duration-500 ease-out"
            style={{ width: `${progressoPercentual}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {etapas.map((nomeEtapa: string, idx: number) => {
            const ativa = etapaAtual === idx
            const passada = idx < etapaAtual
            return (
              <button
                key={nomeEtapa}
                type="button"
                onClick={() => setEtapaAtual(idx)}
                className={`press-tactile rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-all ${
                  ativa
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-gray-950 font-black shadow-2xs'
                    : passada
                      ? 'bg-emerald-500/12 text-emerald-800 border border-emerald-600/25 dark:text-emerald-300 dark:border-emerald-500/25'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {passada ? `✓ ${nomeEtapa}` : nomeEtapa}
              </button>
            )
          })}
        </div>
      </LabSurface>

      {/* Etapa 0: Introdução */}
      {etapaAtual === 0 && (
        <LabSurface variant="card" className={`${caixa} space-y-4`}>
          <div className="flex items-center justify-between gap-2">
            <h2
              className={`text-lg sm:text-xl font-extrabold tracking-tight ${destaque}`}
            >
              Objetivo e Contexto
            </h2>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
              Etapa 1 • Base
            </span>
          </div>

          <div className={`${subcaixa} border-l-4 border-l-emerald-500`}>
            <span className="block text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Objetivo da aula
            </span>
            <p className={`mt-1.5 font-semibold ${destaque}`}>
              {aula.introducao?.objetivo}
            </p>
          </div>

          <div className={subcaixa}>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400">
              Contexto
            </span>
            <p className={`mt-1.5 ${texto}`}>{aula.introducao?.contexto}</p>
          </div>

          {isSafeImageSrc(aula.introducao?.imagemUrl) && (
            <img
              src={aula.introducao!.imagemUrl!}
              alt={aula.introducao?.imagemAlt || aula.titulo}
              className="w-full rounded-2xl border border-stone-200 dark:border-gray-800 object-cover shadow-xs"
            />
          )}
        </LabSurface>
      )}

      {/* Etapa 1: Teoria */}
      {etapaAtual === 1 && (
        <div className="space-y-4">
          <LabSurface variant="card" className={caixa}>
            <div className="flex items-center justify-between gap-2">
              <h2
                className={`text-lg sm:text-xl font-extrabold tracking-tight ${destaque}`}
              >
                Conceitos Essenciais
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300">
                Teoria Aplicada
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              {(aula.teoria?.topicos ?? []).map(
                (topico: TopicoTeoria, idx: number) => (
                  <div
                    key={`${topico.titulo}-${idx}`}
                    className={`${subcaixa} hover:border-emerald-500/35`}
                  >
                    <h3
                      className={`text-sm sm:text-base font-extrabold ${destaque}`}
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
                )
              )}
            </div>
          </LabSurface>

          <LabSurface variant="card" className={`${caixa} space-y-4`}>
            <div className={subcaixa}>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
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
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-gray-800 bg-gray-950 p-4 text-xs leading-relaxed text-emerald-300 shadow-xs">
                  <code>{aula.teoria.exemploCodigo}</code>
                </pre>
              </div>
            )}

            <div className={`${subcaixa} border-l-4 border-l-emerald-500`}>
              <span className="block text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Síntese
              </span>
              <p className={`mt-1.5 font-semibold ${destaque}`}>
                {aula.teoria?.resumo}
              </p>
            </div>
          </LabSurface>
        </div>
      )}

      {/* Etapa 2: Prática Interativa */}
      {etapaAtual === 2 && (
        <LabSurface variant="card" className={`${caixa} space-y-5`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Prática guiada
              </span>
              <h2
                className={`mt-1 text-lg sm:text-xl font-extrabold ${destaque}`}
              >
                {aula.pratica?.titulo}
              </h2>
              <p className={`mt-1.5 whitespace-pre-line ${texto}`}>
                {aula.pratica?.enunciado}
              </p>
            </div>

            <Link
              href="/playground"
              className="press-tactile rounded-xl border border-emerald-600/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-extrabold text-emerald-800 hover:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 shrink-0"
            >
              Ir para o Playground →
            </Link>
          </div>

          {aula.pratica?.codigoInicial && (
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-gray-800 bg-gray-950 p-4 text-xs leading-relaxed text-emerald-300">
              <code>{aula.pratica.codigoInicial}</code>
            </pre>
          )}

          {isSafeImageSrc(aula.pratica?.imagemUrl) && (
            <img
              src={aula.pratica!.imagemUrl!}
              alt={aula.pratica?.imagemAlt || aula.pratica?.titulo || aula.titulo}
              className="w-full rounded-2xl border border-stone-200 dark:border-gray-800 object-cover"
            />
          )}

          {temOrdenacao ? (
            <div className="space-y-3">
              <div className="space-y-2">
                {itensOrdenados.map((item: string, idx: number) => (
                  <div
                    key={`${item}-${idx}`}
                    className={`${subcaixa} flex items-center justify-between gap-3 py-3 hover:border-emerald-500/40`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center justify-center tabular-nums shrink-0">
                        {idx + 1}
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-semibold ${destaque}`}
                      >
                        {item}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moverItem(idx, -1)}
                        disabled={idx === 0}
                        aria-label="Mover para cima"
                        className="press-tactile rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-35 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 cursor-pointer"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moverItem(idx, 1)}
                        disabled={idx === itensOrdenados.length - 1}
                        aria-label="Mover para baixo"
                        className="press-tactile rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-35 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 cursor-pointer"
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
                  className={botaoPrimario}
                >
                  Conferir ordem
                </button>
              </div>

              {feedbackOrdem === 'ok' && (
                <div
                  className={`${subcaixa} border-emerald-500/40 bg-emerald-500/10`}
                >
                  <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    ✓{' '}
                    {aula.pratica.acertoMsg ||
                      'Sequência organizada corretamente.'}
                  </p>
                </div>
              )}

              {feedbackOrdem === 'erro' && (
                <div
                  className={`${subcaixa} border-amber-500/40 bg-amber-500/8 space-y-1`}
                >
                  <p className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300">
                    {aula.pratica.erroMsg ||
                      'A sequência ainda precisa de ajustes. Revê a ordem das etapas.'}
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
                                  className={`press-tactile rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer transition-all ${
                                    ativa
                                      ? 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-400 text-gray-950 font-black shadow-2xs'
                                      : 'border-stone-300 bg-white text-stone-700 hover:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
                                  }`}
                                >
                                  {cat}
                                </button>
                              )
                            }
                          )}
                        </div>
                      </div>
                    )
                  }
                )}
              </div>

              <button
                type="button"
                onClick={conferirClassificacao}
                className={botaoPrimario}
              >
                Conferir classificação
              </button>

              {feedbackClassificacao === 'ok' && (
                <div
                  className={`${subcaixa} border-emerald-500/40 bg-emerald-500/10`}
                >
                  <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    ✓{' '}
                    {aula.pratica.classificacao!.acertoMsg ||
                      'Classificação concluída corretamente.'}
                  </p>
                </div>
              )}

              {feedbackClassificacao === 'erro' && (
                <div
                  className={`${subcaixa} border-amber-500/40 bg-amber-500/8 space-y-1`}
                >
                  <p className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300">
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
                          prev.slice(0, -1)
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
                    Toca nos blocos abaixo para montar a solução...
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {blocosSelecionados.map((bloco: string, idx: number) => (
                        <button
                          key={`${bloco}-${idx}`}
                          type="button"
                          onClick={() => {
                            setFeedbackBlocos('idle')
                            setBlocosSelecionados((prev: string[]) =>
                              prev.filter((_: string, i: number) => i !== idx)
                            )
                          }}
                          title="Toca para remover"
                          className="press-tactile rounded-lg border border-emerald-500/45 bg-emerald-500/12 px-2.5 py-1 font-mono text-xs sm:text-sm font-bold text-emerald-900 hover:bg-emerald-500/20 dark:text-emerald-200 cursor-pointer"
                        >
                          {bloco}
                        </button>
                      ))}
                    </div>

                    <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-emerald-300">
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
                      className="press-tactile rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono text-xs sm:text-sm font-bold text-stone-800 hover:border-emerald-500 hover:bg-emerald-500/5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 cursor-pointer"
                    >
                      {bloco}
                    </button>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={conferirBlocos}
                  disabled={blocosSelecionados.length === 0}
                  className={botaoPrimario}
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
                <div
                  className={`${subcaixa} border-emerald-500/40 bg-emerald-500/10`}
                >
                  <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    ✓{' '}
                    {aula.pratica.montarBlocos!.acertoMsg ||
                      'Estrutura montada corretamente.'}
                  </p>
                </div>
              )}

              {feedbackBlocos === 'erro' && (
                <div
                  className={`${subcaixa} border-amber-500/40 bg-amber-500/8 space-y-1`}
                >
                  <p className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300">
                    {aula.pratica.montarBlocos!.erroMsg ||
                      'A montagem ainda não corresponde ao esperado. Tenta ajustar os blocos.'}
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
                      className={`press-tactile w-full text-left rounded-xl border px-3.5 py-2.5 font-mono text-xs sm:text-sm cursor-pointer transition-all ${
                        selecionada
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-950 font-bold ring-1 ring-emerald-500/30 dark:text-emerald-200'
                          : 'border-stone-300 bg-stone-50 text-stone-800 hover:border-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200'
                      }`}
                    >
                      <span className="mr-2.5 text-stone-400 dark:text-gray-500 tabular-nums">
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
                className={botaoPrimario}
              >
                Conferir linha com erro
              </button>

              {feedbackCacaErro === 'ok' && (
                <div
                  className={`${subcaixa} border-emerald-500/40 bg-emerald-500/10`}
                >
                  <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    ✓{' '}
                    {aula.pratica.cacaErro!.acertoMsg ||
                      'Erro identificado corretamente.'}
                  </p>
                </div>
              )}

              {feedbackCacaErro === 'erro' && (
                <div
                  className={`${subcaixa} border-amber-500/40 bg-amber-500/8 space-y-1`}
                >
                  <p className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300">
                    {aula.pratica.cacaErro!.erroMsg ||
                      'Essa linha não é a que contém o problema. Observa com calma.'}
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
              <div className={`${subcaixa} space-y-3.5`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400">
                    {aula.pratica.simuladorEstado!.rotulo ||
                      aula.pratica.simuladorEstado!.rotuloEstado ||
                      'Estado atual'}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/12 border border-emerald-500/30 font-mono text-base sm:text-lg font-black text-emerald-800 dark:text-emerald-300 tabular-nums">
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
                              : atual + (acao.delta ?? 0)
                          )
                          setFeedbackSimulador('idle')
                        }}
                        className={botao}
                      >
                        {acao.rotulo}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setValorSimulador(
                        aula.pratica.simuladorEstado!.valorInicial ?? 0
                      )
                      setFeedbackSimulador('idle')
                    }}
                    className={botao}
                  >
                    Repor valor
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={conferirSimulador}
                className={botaoPrimario}
              >
                Verificar meta
              </button>

              {feedbackSimulador === 'ok' && (
                <div
                  className={`${subcaixa} border-emerald-500/40 bg-emerald-500/10`}
                >
                  <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    ✓{' '}
                    {aula.pratica.simuladorEstado!.acertoMsg ||
                      'Meta atingida corretamente.'}
                  </p>
                </div>
              )}

              {feedbackSimulador === 'erro' && (
                <div
                  className={`${subcaixa} border-amber-500/40 bg-amber-500/8 space-y-1`}
                >
                  <p className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300">
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
                  'Revê os conceitos da etapa anterior e avança para o quiz.'}
              </p>
              <Link
                href="/playground"
                className={`inline-flex items-center justify-center ${botaoPrimario}`}
              >
                Testar no Playground →
              </Link>
            </div>
          )}
        </LabSurface>
      )}

      {/* Etapa 3: Quiz */}
      {etapaAtual === 3 && (
        <LabSurface variant="card" className={`${caixa} space-y-4`}>
          {perguntaAtual ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/12 text-violet-700 dark:text-violet-300">
                  Quiz da aula
                </span>
                <span className="text-xs font-bold text-stone-500 dark:text-gray-400 tabular-nums">
                  Pergunta {indicePergunta + 1} de {listaQuiz.length}
                </span>
              </div>

              <h2 className={`text-base sm:text-xl font-extrabold ${destaque}`}>
                {perguntaAtual.pergunta}
              </h2>

              <div className="space-y-2">
                {perguntaAtual.opcoes.map((opcao: string, idx: number) => {
                  const respondida = respostaSelecionada !== null
                  const escolhida = respostaSelecionada === idx
                  const correta = perguntaAtual.respostaCorreta === idx

                  let estiloOpcao =
                    'border-stone-300 bg-stone-50 text-stone-800 hover:border-emerald-500 hover:bg-emerald-500/5 dark:border-gray-700 dark:bg-gray-950/70 dark:text-gray-200'

                  if (respondida) {
                    if (correta) {
                      estiloOpcao =
                        'border-emerald-500 bg-emerald-500/15 text-emerald-950 font-bold ring-1 ring-emerald-500/30 dark:text-emerald-200'
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
                      className={`press-tactile w-full text-left rounded-xl border px-4 py-3 text-xs sm:text-sm cursor-pointer disabled:cursor-default transition-all ${estiloOpcao}`}
                    >
                      {opcao}
                    </button>
                  )
                })}
              </div>

              {respostaSelecionada !== null && (
                <div className={`${subcaixa} space-y-3`}>
                  <p
                    className={`text-xs sm:text-sm font-bold ${
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
                    className={botaoPrimario}
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
                Nenhuma pergunta registada nesta aula. Podes avançar para a
                conclusão.
              </p>
              <button
                type="button"
                onClick={() => setEtapaAtual(4)}
                className={botaoPrimario}
              >
                Ir para conclusão →
              </button>
            </div>
          )}
        </LabSurface>
      )}

      {/* Etapa 4: Conclusão */}
      {etapaAtual === 4 && (
        <LabSurface
          variant="card"
          className={`relative overflow-hidden ${caixa} space-y-4`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-500/14 blur-3xl"
          />
          <span className="relative inline-block text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/12 text-emerald-700 dark:text-emerald-400">
            Conclusão da aula
          </span>
          <h2
            className={`relative text-lg sm:text-2xl font-black tracking-tight ${destaque}`}
          >
            {aula.conclusao?.titulo || 'Aula concluída'}
          </h2>
          <p className={`relative whitespace-pre-line ${texto}`}>
            {aula.conclusao?.mensagem ||
              (aula.conclusao?.aprendizados ?? []).join('\n')}
          </p>

          {listaQuiz.length > 0 && respostasCorretas.length > 0 && (
            <div className={`relative ${subcaixa}`}>
              <p className={`text-xs sm:text-sm font-bold ${destaque}`}>
                Desempenho no quiz: {totalAcertosQuiz} de {listaQuiz.length}{' '}
                acertos
              </p>
            </div>
          )}

          <div className={`relative ${subcaixa}`}>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400">
              Próximo passo
            </span>
            <p className={`mt-1 text-xs sm:text-sm font-medium ${destaque}`}>
              {aula.conclusao?.proximoPasso ||
                aula.conclusao?.reflexao ||
                'Continua a avançar na trilha ou testa as tuas ideias no Playground.'}
            </p>
          </div>

          {erroSalvar && (
            <p className="relative text-xs font-semibold text-amber-700 dark:text-amber-400">
              {erroSalvar}
            </p>
          )}

          <div className="relative flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 pt-2">
            {completed ? (
              <span className="inline-flex items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/12 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                ✓ Aula concluída
              </span>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleConcluirAula()}
                className={`inline-flex items-center justify-center ${botaoPrimario}`}
              >
                {saving ? 'A guardar...' : 'Concluir aula'}
              </button>
            )}

            {proximaAula && (
              <Link
                href={`/dashboard/aula/${proximaAula.id}`}
                className={`press-tactile inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs sm:text-sm font-black transition-all ${
                  completed
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-gray-950 shadow-xs'
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
        </LabSurface>
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
              Math.min(etapas.length - 1, prev + 1)
            )
          }
          className={botao}
        >
          Próxima etapa →
        </button>
      </div>
    </main>
  )
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
      (item: AulaItem) => item.id === rawId || String(item.numero) === rawId
    ) || aulasData[0]

  const [userId, setUserId] = useState<string | null>(null)
  const [, setConcluidaNaShell] = useState<boolean>(false)
  const { isDark, alternarTema } = useTheme()

  if (!aula) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white">
        <Navbar
          activeTab="trilha"
          subtitle="Aprenda no seu ritmo"
          userId={userId}
          isDark={isDark}
          onToggleTheme={alternarTema}
        />
        <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
          <LabSurface variant="card" className="p-5 sm:p-7">
            <p className="text-sm font-semibold text-stone-800 dark:text-gray-200">
              Aula não encontrada.
            </p>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="mt-4 press-tactile rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 px-4 py-2.5 text-xs sm:text-sm font-black text-gray-950 shadow-xs cursor-pointer transition-all"
            >
              Voltar à trilha
            </button>
          </LabSurface>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white selection:bg-emerald-500 selection:text-gray-950">
      <Navbar
        activeTab="trilha"
        subtitle={`Aula ${aula.numero} • ${aula.titulo}`}
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <AulaDetalheContent
        key={aula.id}
        aula={aula}
        concluidasIds={concluidasIds}
        onConcluirAula={onConcluirAula}
        userId={userId}
        onUserIdChange={setUserId}
        onConcluidaChange={setConcluidaNaShell}
      />
    </div>
  )
}