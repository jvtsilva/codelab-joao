'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { Prec } from '@codemirror/state'
import { keymap } from '@codemirror/view'

const STORAGE_KEY = 'codelab_tema_aula'

type AbaMobileJs = 'tudo' | 'codigo' | 'console'
type TipoLog = 'log' | 'warn' | 'error' | 'result'

interface LinhaConsole {
  id: number
  tipo: TipoLog
  texto: string
}

interface ExemploJs {
  id: string
  rotulo: string
  codigo: string
}

const EXEMPLOS_JS: ExemploJs[] = [
  {
    id: 'maioridade',
    rotulo: 'if / else (Idade)',
    codigo: `const nome = "João"
const idade = 18 // mude o número para testar

if (idade >= 18) {
  console.log(nome + " tem " + idade + " anos: maior de idade.")
} else {
  console.log(nome + " tem " + idade + " anos: menor de idade.")
}`,
  },
  {
    id: 'variaveis',
    rotulo: 'let e const',
    codigo: `const nomeAluno = "João"
const xpPorAula = 50
let xpAtual = 0

xpAtual = xpAtual + xpPorAula
xpAtual = xpAtual + xpPorAula

console.log("Aluno:", nomeAluno)
console.log("XP acumulado:", xpAtual)`,
  },
  {
    id: 'funcao',
    rotulo: 'Função',
    codigo: `function calcularXpTotal(aulasConcluidas, desafiosFeitos) {
  const xpAulas = aulasConcluidas * 50
  const xpDesafios = desafiosFeitos * 30
  return xpAulas + xpDesafios
}

const total = calcularXpTotal(3, 2)
console.log("Total de XP:", total)`,
  },
]

const JS_INICIAL = EXEMPLOS_JS[0].codigo

function buildJsRunnerSrcDoc(code: string, runId: number): string {
  const safeCode = JSON.stringify(code)
  const safeRunId = JSON.stringify(runId)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
</head>
<body>
  <script>
    (function () {
      const runId = ${safeRunId};
      let seq = 0;

      function formatValue(val) {
        if (typeof val === 'string') return val;
        if (typeof val === 'number' || typeof val === 'boolean' || val === null || val === undefined) {
          return String(val);
        }
        try {
          return JSON.stringify(val, null, 2);
        } catch (_e) {
          return String(val);
        }
      }

      function emit(tipo, args) {
        seq += 1;
        const texto = Array.from(args).map(formatValue).join(' ');
        parent.postMessage(
          {
            source: 'codelab-js-runner',
            runId,
            entryId: runId + '-' + seq,
            tipo,
            texto,
          },
          '*'
        );
      }

      console.log = function () {
        emit('log', arguments);
      };
      console.warn = function () {
        emit('warn', arguments);
      };
      console.error = function () {
        emit('error', arguments);
      };

      window.addEventListener('error', function (event) {
        emit('error', [event.message || 'Erro de execução no JavaScript']);
      });

      window.addEventListener('unhandledrejection', function (event) {
        emit('error', ['Promise rejeitada: ' + formatValue(event.reason)]);
      });

      const userCode = ${safeCode};

      try {
        let resultado;
        try {
          resultado = (0, eval)('(' + userCode + ')');
        } catch (_exprErr) {
          resultado = (0, eval)(userCode);
        }

        if (typeof resultado !== 'undefined') {
          emit('result', [resultado]);
        }
      } catch (err) {
        const msg = err && err.name && err.message
          ? err.name + ': ' + err.message
          : formatValue(err);
        emit('error', [msg]);
      }
    })();
  </script>
</body>
</html>`
}

export default function PlaygroundJsPage() {
  const [codigo, setCodigo] = useState(JS_INICIAL)
  const [runnerSrcDoc, setRunnerSrcDoc] = useState(() => buildJsRunnerSrcDoc(JS_INICIAL, 1))
  const [runId, setRunId] = useState(1)
  const [logs, setLogs] = useState<LinhaConsole[]>([])
  const [expandido, setExpandido] = useState(false)
  const [abaMobile, setAbaMobile] = useState<AbaMobileJs>('tudo')
  const [userId, setUserId] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(true)

  const runIdRef = useRef(1)
  const logCounterRef = useRef(0)
  const codigoAtualRef = useRef(JS_INICIAL)

  codigoAtualRef.current = codigo

  const executarCodigo = useCallback((codigoParaRodar: string) => {
    const proximoRunId = runIdRef.current + 1
    runIdRef.current = proximoRunId
    setRunId(proximoRunId)
    setLogs([])
    setRunnerSrcDoc(buildJsRunnerSrcDoc(codigoParaRodar, proximoRunId))
  }, [])

  const extensoesEditor = useMemo(() => {
    const atalhoExecutar = Prec.highest(
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            executarCodigo(codigoAtualRef.current)
            return true
          },
        },
      ])
    )

    return [javascript(), atalhoExecutar]
  }, [executarCodigo])

  useLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  useEffect(() => {
    let active = true

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return
        setUserId(data.session?.user?.id ?? null)
      })
      .catch((err) => {
        console.error('Erro ao obter sessão no playground JS:', err)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setUserId(session?.user?.id ?? null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setAbaMobile('codigo')
    }
  }, [])

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const payload = event.data
      if (!payload || payload.source !== 'codelab-js-runner') return
      if (payload.runId !== runIdRef.current) return

      logCounterRef.current += 1
      const novaLinha: LinhaConsole = {
        id: logCounterRef.current,
        tipo:
          payload.tipo === 'warn' || payload.tipo === 'error' || payload.tipo === 'result'
            ? payload.tipo
            : 'log',
        texto: String(payload.texto ?? ''),
      }

      setLogs((prev) => [...prev, novaLinha])
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const alternarTema = () => {
    setIsDark((atual) => {
      const proximo = !atual
      localStorage.setItem(STORAGE_KEY, proximo ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', proximo)
      document.documentElement.style.backgroundColor = proximo ? '#030712' : '#fafaf9'
      return proximo
    })
  }

  function aplicarExemplo(novoCodigo: string) {
    setCodigo(novoCodigo)
    executarCodigo(novoCodigo)
  }

  function resetarPadrao() {
    setCodigo(JS_INICIAL)
    executarCodigo(JS_INICIAL)
  }

  const mostrarCodigo = abaMobile === 'tudo' || abaMobile === 'codigo'
  const mostrarConsole = abaMobile === 'tudo' || abaMobile === 'console'

  const workspaceClasse = expandido
    ? 'fixed inset-0 z-50 flex flex-col overflow-y-auto bg-stone-50 px-3.5 pb-6 pt-0 sm:px-6 text-stone-900 dark:bg-gray-950 dark:text-white'
    : 'flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-3.5 sm:p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900'

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
      <Navbar
        activeTab="playground"
        subtitle="Playground JS"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-5 sm:space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 dark:border-gray-800 pb-4">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 border font-bold text-[11px] rounded-full bg-amber-50 text-amber-700 border-amber-600/25 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
              AMBIENTE SÓ JAVASCRIPT • LÓGICA E CONSOLE
            </span>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight">
              Playground JavaScript
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-gray-400">
              Escreva JavaScript normal com variáveis, condições{' '}
              <code className="font-mono text-xs sm:text-sm">if/else</code> e funções, e veja o
              resultado no console.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/playground"
              className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Modo HTML + CSS + JS →
            </Link>
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-semibold text-stone-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              ← Trilha
            </Link>
          </div>
        </div>

        <div className={workspaceClasse}>
          <div
            className={`flex flex-col gap-2.5 border-b border-stone-200 dark:border-gray-800 ${
              expandido
                ? 'sticky top-0 z-10 -mx-3.5 sm:-mx-6 bg-stone-50/95 px-3.5 py-2.5 sm:px-6 backdrop-blur dark:bg-gray-950/95'
                : 'pb-3'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div className="grid grid-cols-3 gap-1.5 w-full md:hidden">
                {(
                  [
                    { id: 'tudo', rotulo: 'Tudo' },
                    { id: 'codigo', rotulo: 'Código JS' },
                    { id: 'console', rotulo: 'Console' },
                  ] as const
                ).map((aba) => (
                  <button
                    key={aba.id}
                    type="button"
                    onClick={() => setAbaMobile(aba.id)}
                    className={`h-9 w-full inline-flex items-center justify-center rounded-lg px-2 text-[11px] font-bold whitespace-nowrap cursor-pointer ${
                      abaMobile === aba.id
                        ? 'bg-emerald-500 text-gray-950'
                        : 'bg-stone-100 text-stone-700 border border-stone-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {aba.rotulo}
                  </button>
                ))}
              </div>

              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400">
                Editor JS + Console de Saída • Ctrl/Cmd + Enter para rodar
              </span>

              <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:w-auto sm:items-center shrink-0">
                <button
                  type="button"
                  onClick={() => executarCodigo(codigo)}
                  className="h-9 w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3.5 text-xs font-extrabold whitespace-nowrap text-gray-950 cursor-pointer"
                >
                  ▶ Executar
                </button>

                <button
                  type="button"
                  onClick={resetarPadrao}
                  className="h-9 w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-3 text-xs font-bold whitespace-nowrap text-stone-700 hover:bg-stone-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Resetar
                </button>

                <button
                  type="button"
                  onClick={() => setExpandido((prev) => !prev)}
                  className="h-9 w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-3 text-xs font-bold whitespace-nowrap text-stone-700 hover:bg-stone-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {expandido ? 'Fechar tela' : 'Expandir tela'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-stone-500 dark:text-gray-400 mr-1">
                Exemplos rápidos:
              </span>
              {EXEMPLOS_JS.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => aplicarExemplo(ex.codigo)}
                  className="rounded-lg border border-stone-300 bg-stone-100 hover:bg-stone-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 px-2.5 py-1 text-[11px] font-bold text-stone-700 dark:text-gray-200 cursor-pointer"
                >
                  {ex.rotulo}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`grid gap-4 pt-1 grid-cols-1 lg:grid-cols-12 ${
              expandido ? 'flex-1 min-h-[500px]' : ''
            }`}
          >
            <div
              className={`${
                mostrarCodigo ? 'flex' : 'hidden md:flex'
              } flex-col flex-1 lg:col-span-7`}
            >
              <span className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-gray-400">
                Código JavaScript
              </span>
              <div className="w-full flex-1 overflow-hidden rounded-xl border border-stone-300 dark:border-gray-700">
                <CodeMirror
                  value={codigo}
                  height={expandido ? '520px' : '420px'}
                  theme={isDark ? 'dark' : 'light'}
                  extensions={extensoesEditor}
                  onChange={(valor) => setCodigo(valor)}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    foldGutter: false,
                    autocompletion: true,
                    closeBrackets: true,
                    indentOnInput: true,
                  }}
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>

            <div
              className={`${
                mostrarConsole ? 'flex' : 'hidden md:flex'
              } flex-col flex-1 lg:col-span-5`}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-gray-400">
                  Console / Resultado
                </span>
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="text-[11px] font-bold text-stone-500 hover:text-stone-800 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                >
                  Limpar saída
                </button>
              </div>

              <div className="w-full flex-1 min-h-[300px] sm:min-h-[420px] rounded-xl border border-stone-300 bg-stone-950 p-3.5 font-mono text-xs sm:text-sm leading-relaxed text-gray-100 dark:border-gray-800 overflow-y-auto space-y-2">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-xs">
                    Use <code className="text-emerald-400">console.log(...)</code> ou clique em{' '}
                    <strong className="text-gray-300">Executar</strong> para ver o resultado aqui.
                  </p>
                ) : (
                  logs.map((linha) => {
                    let estiloLinha = 'text-emerald-300 border-gray-800/80'
                    let prefixo = '›'

                    if (linha.tipo === 'warn') {
                      estiloLinha = 'text-amber-300 border-amber-500/20 bg-amber-500/5'
                      prefixo = '⚠'
                    } else if (linha.tipo === 'error') {
                      estiloLinha = 'text-rose-400 border-rose-500/25 bg-rose-500/5'
                      prefixo = '✕'
                    } else if (linha.tipo === 'result') {
                      estiloLinha = 'text-amber-300 border-gray-800/80'
                      prefixo = '←'
                    }

                    return (
                      <div
                        key={linha.id}
                        className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 whitespace-pre-wrap break-words ${estiloLinha}`}
                      >
                        <span className="shrink-0 select-none opacity-80">{prefixo}</span>
                        <span className="min-w-0 flex-1">{linha.texto}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <iframe
          key={runId}
          title="Executor isolado de JavaScript"
          srcDoc={runnerSrcDoc}
          sandbox="allow-scripts"
          className="hidden"
        />
      </main>

      <footer className="border-t border-stone-200 dark:border-gray-800/80 px-4 sm:px-8 py-6 text-center text-xs max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 dark:text-gray-500">
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