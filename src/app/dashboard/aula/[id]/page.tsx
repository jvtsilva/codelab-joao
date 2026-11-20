'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { aulasData } from '@/data/lessonsData'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'

const STORAGE_KEY = 'codelab_tema_aula'

export default function AulaDetalhePage() {
  const params = useParams<{ id: string }>()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const aulaIdParam = rawId ?? '1'
  const numeroAula = Number(aulaIdParam.replace('lesson-', '')) || 1

  const aula =
    aulasData.find(
      (item) => item.numero === numeroAula || item.id === aulaIdParam,
    ) ?? aulasData[0]

  const [isDark, setIsDark] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [userXp, setUserXp] = useState(0)
  const [code, setCode] = useState(aula.pratica.codigoInicial)
  const [copied, setCopied] = useState(false)
  const [praticaFeitaLocal, setPraticaFeitaLocal] = useState(false)
  const [mostrarExemplo, setMostrarExemplo] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({})
  const [completed, setCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [progressoLeitura, setProgressoLeitura] = useState(0)

  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY)
    const dark = savedTheme !== 'light'
    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.backgroundColor = dark ? '#030712' : '#fafaf9'
  }, [])

  useEffect(() => {
    const atualizarLeitura = () => {
      const scrollTop = window.scrollY
      const alturaTotal =
        document.documentElement.scrollHeight - window.innerHeight
      if (alturaTotal <= 0) {
        setProgressoLeitura(100)
        return
      }
      const pct = Math.min(100, Math.max(0, Math.round((scrollTop / alturaTotal) * 100)))
      setProgressoLeitura(pct)
    }

    atualizarLeitura()
    window.addEventListener('scroll', atualizarLeitura, { passive: true })
    window.addEventListener('resize', atualizarLeitura)
    return () => {
      window.removeEventListener('scroll', atualizarLeitura)
      window.removeEventListener('resize', atualizarLeitura)
    }
  }, [aula.id])

  useEffect(() => {
    let active = true

    const localDone =
      localStorage.getItem(`codelab_visitante_aula_${aula.numero}`) === 'true'

    setCode(aula.pratica.codigoInicial)
    setCopied(false)
    setPraticaFeitaLocal(localDone)
    setMostrarExemplo(false)
    setSelectedAnswers({})
    setSubmittedAnswers({})
    setSaveError('')
    setCompleted(localDone)

    async function loadProgress() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!active) return

        if (session) {
          setUserId(session.user.id)

          const { data: xpRows, error: xpError } = await supabase
            .from('user_challenges')
            .select('xp_earned')
            .eq('user_id', session.user.id)

          if (active && !xpError && xpRows) {
            const totalXp = xpRows.reduce((total, row) => total + (row.xp_earned || 0), 0)
            setUserXp(totalXp)
            localStorage.setItem('codelab_user_xp', String(totalXp))
          }
        } else {
          const savedXp = localStorage.getItem('codelab_user_xp')
          if (savedXp) setUserXp(Number(savedXp))
        }

        if (!session) return

        const { data } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', session.user.id)
          .eq('lesson_id', `lesson-${aula.numero}`)
          .maybeSingle()

        if (!active) return

        if (data?.completed) {
          localStorage.setItem(`codelab_visitante_aula_${aula.numero}`, 'true')
          setCompleted(true)
          setPraticaFeitaLocal(true)
        }
      } catch (error) {
        console.error('Não foi possível carregar o progresso:', error)
      }
    }

    loadProgress()
    return () => {
      active = false
    }
  }, [aula.id, aula.numero, aula.pratica.codigoInicial])

  const alternarTema = () => {
    setIsDark((current) => {
      const next = !current
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', next)
      document.documentElement.style.backgroundColor = next ? '#030712' : '#fafaf9'
      return next
    })
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard?.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const marcarAulaConcluida = async () => {
    setSaving(true)
    setSaveError('')

    try {
      localStorage.setItem(`codelab_visitante_aula_${aula.numero}`, 'true')

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const { error } = await supabase.from('user_progress').upsert(
          {
            user_id: session.user.id,
            lesson_id: `lesson-${aula.numero}`,
            completed: true,
          },
          { onConflict: 'user_id,lesson_id' },
        )

        if (error) throw error
      }

      setCompleted(true)
      setPraticaFeitaLocal(true)
    } catch (error) {
      console.error('Erro ao salvar conclusão:', error)
      setSaveError(
        'Não foi possível sincronizar com sua conta. Seu progresso local foi mantido.',
      )
      setCompleted(true)
      setPraticaFeitaLocal(true)
    } finally {
      setSaving(false)
    }
  }

  const quizCompleto =
    aula.quiz.length > 0 &&
    aula.quiz.every((_, index) => submittedAnswers[index] === true)

  const quizAcertos = aula.quiz.reduce(
    (total, pergunta, index) =>
      total +
      (selectedAnswers[index] === pergunta.respostaCorreta && submittedAnswers[index]
        ? 1
        : 0),
    0,
  )

  const proximaAula = aula.conclusao.proximaAulaId
    ? aulasData.find((item) => item.id === aula.conclusao.proximaAulaId)
    : aulasData.find((item) => item.numero === aula.numero + 1)

  const caixa =
    'rounded-2xl border border-stone-200 bg-white p-5 text-stone-900 dark:border-gray-800 dark:bg-gray-900 dark:text-stone-100 sm:p-6'
  const subcaixa =
    'rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-gray-800 dark:bg-gray-950'
  const texto = 'text-sm leading-relaxed text-stone-700 dark:text-stone-300'
  const destaque = 'text-emerald-700 dark:text-emerald-400'
  const botao =
    'rounded-xl border border-stone-300 bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 cursor-pointer'

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-stone-100">
      <Navbar
        activeTab="aula"
        subtitle={`Aula ${aula.numero} • ${aula.titulo}`}
        userId={userId}
        userXp={userXp}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <div className="sticky top-[57px] z-40 h-1 w-full bg-stone-200 dark:bg-gray-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-150"
          style={{ width: `${progressoLeitura}%` }}
        />
      </div>

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 p-4 pb-20 sm:p-6 md:p-8">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-stone-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            ← Voltar para a trilha
          </Link>
          {completed && (
            <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-semibold">
              ✓ Aula concluída
            </span>
          )}
        </div>

        {/* 01 · Introdução */}
        <section
          className={`${caixa} border-emerald-600/25 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-gray-900`}
        >
          <span className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
            01 · Introdução · Aula {aula.numero}
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            {aula.titulo}
          </h2>
          <p className={`${texto} mt-3`}>{aula.resumo}</p>
          <div className={`${subcaixa} mt-5`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
              O que você vai aprender
            </h3>
            <p className={`${texto} mt-2`}>{aula.introducao.objetivo}</p>
            <p className={`${texto} mt-3`}>{aula.introducao.contexto}</p>
          </div>
        </section>

        {/* 02 · Teoria */}
        <section className={caixa}>
          <span className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
            02 · Teoria
          </span>
          <h2 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">
            Entenda o conceito
          </h2>

          <div className="mt-5 space-y-5">
            {aula.teoria.topicos.map((topico, index) => (
              <article key={`${index}-${topico.titulo}`} className="space-y-2">
                <h3 className="font-bold">{topico.titulo}</h3>
                <p className={`${texto} whitespace-pre-line`}>{topico.explicacao}</p>
              </article>
            ))}
          </div>

          <div className={`${subcaixa} mt-6 space-y-2`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
              Exemplo do cotidiano
            </h3>
            <p className={`${texto} whitespace-pre-line`}>
              {aula.teoria.exemploCotidiano}
            </p>
          </div>

          <div className={`${subcaixa} mt-4 space-y-2`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
              Exemplo em código
            </h3>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-gray-950 p-4 text-xs leading-relaxed text-emerald-300 sm:text-sm">
              <code>{aula.teoria.exemploCodigo}</code>
            </pre>
          </div>

          <div className="mt-5 border-l-4 border-emerald-500 pl-4">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
              Resumo da teoria
            </h3>
            <p className={`${texto} mt-1 font-medium`}>{aula.teoria.resumo}</p>
          </div>
        </section>

        {/* 03 · Prática */}
        <section className={caixa}>
          <span className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
            03 · Prática
          </span>
          <h2 className="mt-2 text-xl font-black">Agora é sua vez!</h2>
          <h3 className="mt-3 font-bold">{aula.pratica.titulo}</h3>
          <p className={`${texto} mt-2 whitespace-pre-line`}>
            {aula.pratica.enunciado}
          </p>

          <div className={`${subcaixa} mt-4 space-y-2`}>
            <label htmlFor="lesson-code" className="text-xs font-bold uppercase tracking-wider">
              Seu espaço de prática
            </label>
            <textarea
              id="lesson-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              rows={9}
              spellCheck={false}
              className="w-full rounded-xl border border-gray-800 bg-gray-950 p-4 font-mono text-xs leading-relaxed text-emerald-300 focus:border-emerald-500 focus:outline-none sm:text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCode(aula.pratica.codigoInicial)}
                className={botao}
              >
                Restaurar modelo
              </button>
              <button type="button" onClick={handleCopyCode} className={botao}>
                {copied ? '✓ Copiado!' : 'Copiar texto'}
              </button>
              {aula.pratica.exemploSolucao && (
                <button
                  type="button"
                  onClick={() => setMostrarExemplo((prev) => !prev)}
                  className={botao}
                >
                  {mostrarExemplo ? 'Esconder exemplo de solução' : 'Ver exemplo de solução'}
                </button>
              )}
            </div>
          </div>

          {mostrarExemplo && aula.pratica.exemploSolucao && (
            <div className={`${subcaixa} mt-4 space-y-2 border-emerald-600/30 dark:border-emerald-500/30`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
                Uma referência possível
              </h3>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-gray-950 p-4 text-xs leading-relaxed text-emerald-300 sm:text-sm">
                <code>{aula.pratica.exemploSolucao}</code>
              </pre>
            </div>
          )}

          <div className={`${subcaixa} mt-4 space-y-2`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
              Resultado esperado
            </h3>
            <p className={texto}>{aula.pratica.resultadoEsperado}</p>
            <p className={texto}>
              <strong className={destaque}>Dica:</strong> {aula.pratica.dica}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPraticaFeitaLocal(true)}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-extrabold text-gray-950 cursor-pointer"
            >
              {praticaFeitaLocal ? '✓ Prática registrada' : 'Registrar prática feita'}
            </button>
            <span className="text-xs text-stone-500 dark:text-gray-400">
              A conclusão oficial da aula fica na seção 05 após o quiz.
            </span>
          </div>
        </section>

        {/* 04 · Quiz */}
        <section className={caixa}>
          <span className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
            04 · Quiz
          </span>
          <h2 className="mt-2 text-xl font-black">Teste seus conhecimentos</h2>
          <p className={`${texto} mt-2`}>
            Responda às perguntas e confira a explicação de cada resposta.
          </p>

          <div className="mt-5 space-y-5">
            {aula.quiz.map((pergunta, questionIndex) => {
              const selected = selectedAnswers[questionIndex]
              const submitted = submittedAnswers[questionIndex]
              const acertou = selected === pergunta.respostaCorreta

              return (
                <div key={questionIndex} className={`${subcaixa} space-y-3`}>
                  <h3 className="text-sm font-bold">
                    {questionIndex + 1}. {pergunta.pergunta}
                  </h3>
                  <div className="space-y-2">
                    {pergunta.opcoes.map((opcao, optionIndex) => {
                      const isSelected = selected === optionIndex
                      const isCorrect = optionIndex === pergunta.respostaCorreta
                      let style =
                        'border-stone-200 bg-white dark:border-gray-800 dark:bg-gray-900'

                      if (submitted && isSelected) {
                        style = isCorrect
                          ? 'border-emerald-600 bg-emerald-500/10'
                          : 'border-red-500 bg-red-500/10'
                      } else if (!submitted && isSelected) {
                        style = 'border-emerald-500 bg-emerald-500/10'
                      }

                      return (
                        <button
                          key={optionIndex}
                          type="button"
                          disabled={submitted}
                          onClick={() =>
                            setSelectedAnswers((current) => ({
                              ...current,
                              [questionIndex]: optionIndex,
                            }))
                          }
                          className={`w-full rounded-xl border p-3 text-left text-sm ${style} ${
                            !submitted ? 'hover:border-emerald-500 cursor-pointer' : ''
                          }`}
                        >
                          {opcao}
                        </button>
                      )
                    })}
                  </div>

                  {!submitted ? (
                    <button
                      type="button"
                      disabled={selected === undefined}
                      onClick={() =>
                        setSubmittedAnswers((current) => ({
                          ...current,
                          [questionIndex]: true,
                        }))
                      }
                      className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3 py-2 text-xs font-bold text-gray-950 disabled:opacity-40 cursor-pointer"
                    >
                      Conferir resposta
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <p
                        className={`text-sm font-medium ${
                          acertou
                            ? destaque
                            : 'text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {acertou ? 'Resposta correta! ' : 'Quase! '}
                        {pergunta.explicacao}
                      </p>
                      {!acertou && (
                        <button
                          type="button"
                          onClick={() => {
                            setSubmittedAnswers((current) => ({
                              ...current,
                              [questionIndex]: false,
                            }))
                          }}
                          className={botao}
                        >
                          Tentar novamente
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {quizCompleto && (
            <div className={`${subcaixa} mt-5`}>
              <p className="font-bold">
                Resultado: {quizAcertos} de {aula.quiz.length} acertos
              </p>
              <p className={`${texto} mt-1`}>
                {quizAcertos === aula.quiz.length
                  ? 'Excelente! Você demonstrou que entendeu o conteúdo.'
                  : 'Revise os pontos explicados nas respostas e tente novamente nas próximas aulas.'}
              </p>
            </div>
          )}
        </section>

        {/* 05 · Conclusão */}
        <section className={caixa}>
          <span className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
            05 · Conclusão
          </span>
          <h2 className="mt-2 text-xl font-black">O que fica desta aula?</h2>

          <ul className="mt-4 space-y-2">
            {aula.conclusao.aprendizados.map((item, index) => (
              <li key={index} className="flex gap-3 text-sm leading-relaxed">
                <span className={`font-black ${destaque}`}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className={`${subcaixa} mt-5`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${destaque}`}>
              Pense sobre isso
            </h3>
            <p className={`${texto} mt-2`}>{aula.conclusao.reflexao}</p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={marcarAulaConcluida}
              disabled={saving || completed}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-3 text-sm font-extrabold text-gray-950 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {saving
                ? 'Salvando...'
                : completed
                  ? '✓ Aula concluída'
                  : 'Marcar aula como concluída'}
            </button>

            {proximaAula ? (
              <Link
                href={`/dashboard/aula/${proximaAula.numero}`}
                className={`text-center ${botao}`}
              >
                Próxima aula: {proximaAula.titulo} →
              </Link>
            ) : (
              <Link href="/dashboard" className={botao}>
                Voltar à trilha
              </Link>
            )}
          </div>

          {saveError && (
            <p className="mt-3 text-xs text-amber-700 dark:text-amber-400">{saveError}</p>
          )}
        </section>
      </main>
    </div>
  )
}