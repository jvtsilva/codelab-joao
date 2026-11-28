'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/hooks/useTheme'
import { Navbar } from '@/components/Navbar'
import { PageHeaderBanner } from '@/components/PageHeaderBanner'
import { LabSurface } from '@/components/LabSurface'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'

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
const EXTENSOES_JS = [javascript()]

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
        if (
          typeof val === 'number' ||
          typeof val === 'boolean' ||
          val === null ||
          val === undefined
        ) {
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
        const fn = new Function(userCode);
        const resultado = fn();

        if (typeof resultado !== 'undefined') {
          emit('result', [resultado]);
        }
      } catch (err) {
        const msg =
          err && err.name && err.message
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
  const [runnerSrcDoc, setRunnerSrcDoc] = useState(() =>
    buildJsRunnerSrcDoc(JS_INICIAL, 1)
  )
  const [runId, setRunId] = useState(1)
  const [logs, setLogs] = useState<LinhaConsole[]>([])
  const [expandido, setExpandido] = useState(false)
  const [abaMobile, setAbaMobile] = useState<AbaMobileJs>(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'codigo' : 'tudo'
  )
  const [userId, setUserId] = useState<string | null>(null)
  const { isDark, alternarTema } = useTheme()

  const runIdRef = useRef(1)
  const logCounterRef = useRef(0)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const executarCodigo = useCallback((codigoParaRodar: string) => {
    const proximoRunId = runIdRef.current + 1
    runIdRef.current = proximoRunId
    setRunId(proximoRunId)
    setLogs([])
    setRunnerSrcDoc(buildJsRunnerSrcDoc(codigoParaRodar, proximoRunId))
  }, [])

  useEffect(() => {
    let active = true

    async function initSession() {
      try {
        const { data } = await supabase.auth.getSession()
        if (!active) return
        setUserId(data.session?.user?.id ?? null)
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro ao obter sessão no playground JS:', err)
        }
      }
    }

    void initSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!active) return
        setUserId(session?.user?.id ?? null)
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        iframeRef.current?.contentWindow &&
        event.source !== iframeRef.current.contentWindow
      ) {
        return
      }
      if (event.origin !== 'null' && event.origin !== window.location.origin) {
        return
      }

      const payload = event.data
      if (!payload || payload.source !== 'codelab-js-runner') return
      if (payload.runId !== runIdRef.current) return

      logCounterRef.current += 1
      const novaLinha: LinhaConsole = {
        id: logCounterRef.current,
        tipo:
          payload.tipo === 'warn' ||
          payload.tipo === 'error' ||
          payload.tipo === 'result'
            ? payload.tipo
            : 'log',
        texto: String(payload.texto ?? ''),
      }

      setLogs((prev) => [...prev, novaLinha])
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

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

  const workspaceContent = (
    <>
      <div
        className={`flex flex-col gap-3 border-b border-stone-200/90 dark:border-gray-800/90 ${
          expandido
            ? 'sticky top-0 z-10 -mx-3.5 sm:-mx-6 bg-stone-50/95 px-3.5 py-3 sm:px-6 backdrop-blur dark:bg-gray-950/95'
            : 'pb-3.5'
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
                className={`press-tactile h-9 w-full inline-flex items-center justify-center rounded-xl px-2 text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                  abaMobile === aba.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-gray-950 font-black shadow-2xs'
                    : 'bg-stone-100 text-stone-700 border border-stone-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                }`}
              >
                {aba.rotulo}
              </button>
            ))}
          </div>

          <span className="hidden md:inline text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-gray-400">
            Editor JS + Console de Saída • Ctrl/Cmd + Enter para rodar
          </span>

          <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:w-auto sm:items-center shrink-0">
            <button
              type="button"
              onClick={() => executarCodigo(codigo)}
              className="press-tactile h-9 w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 px-4 text-xs font-black whitespace-nowrap text-gray-950 shadow-xs cursor-pointer transition-all"
            >
              ▶ Executar
            </button>

            <button
              type="button"
              onClick={resetarPadrao}
              className="press-tactile h-9 w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-3 text-xs font-bold whitespace-nowrap text-stone-700 hover:bg-stone-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              Resetar
            </button>

            <button
              type="button"
              onClick={() => setExpandido((prev) => !prev)}
              className="press-tactile h-9 w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-3 text-xs font-bold whitespace-nowrap text-stone-700 hover:bg-stone-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              {expandido ? 'Fechar tela' : 'Expandir tela'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-stone-500 dark:text-gray-400 mr-1">
            Exemplos rápidos:
          </span>
          {EXEMPLOS_JS.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => aplicarExemplo(ex.codigo)}
              className="press-tactile rounded-xl border border-stone-300/90 bg-stone-100/90 hover:bg-emerald-500/12 hover:border-emerald-500/40 dark:border-gray-700/90 dark:bg-gray-800/80 dark:hover:bg-emerald-500/15 dark:hover:border-emerald-500/40 px-2.5 py-1 text-[11px] font-bold text-stone-700 dark:text-gray-200 cursor-pointer transition-all"
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
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault()
              executarCodigo(codigo)
            }
          }}
        >
          <span className="mb-1.5 text-xs font-extrabold uppercase tracking-wider text-stone-600 dark:text-gray-400">
            Código JavaScript
          </span>
          <div className="w-full flex-1 overflow-hidden rounded-2xl border border-stone-300/90 dark:border-gray-800 shadow-2xs">
            <CodeMirror
              value={codigo}
              height={expandido ? '520px' : '420px'}
              theme={isDark ? 'dark' : 'light'}
              extensions={EXTENSOES_JS}
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
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-stone-600 dark:text-gray-400">
              Console / Resultado{' '}
              <span className="tabular-nums text-emerald-700 dark:text-emerald-400">
                ({logs.length})
              </span>
            </span>
            <button
              type="button"
              onClick={() => setLogs([])}
              className="text-[11px] font-bold text-stone-500 hover:text-stone-800 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors"
            >
              Limpar saída
            </button>
          </div>

          <div
            aria-live="polite"
            className="w-full flex-1 min-h-[300px] sm:min-h-[420px] rounded-2xl border border-stone-300/90 bg-gray-950 p-3.5 font-mono text-xs sm:text-sm leading-relaxed text-gray-100 dark:border-gray-800 overflow-y-auto space-y-2 shadow-2xs"
          >
            {logs.length === 0 ? (
              <p className="text-gray-500 text-xs">
                Use <code className="text-emerald-400">console.log(...)</code> ou
                clique em <strong className="text-gray-300">Executar</strong> para
                ver o resultado aqui.
              </p>
            ) : (
              logs.map((linha) => {
                let estiloLinha =
                  'text-emerald-300 border-gray-800/80 bg-gray-900/50'
                let prefixo = '›'

                if (linha.tipo === 'warn') {
                  estiloLinha =
                    'text-amber-300 border-amber-500/25 bg-amber-500/8'
                  prefixo = '⚠'
                } else if (linha.tipo === 'error') {
                  estiloLinha = 'text-rose-400 border-rose-500/30 bg-rose-500/8'
                  prefixo = '✕'
                } else if (linha.tipo === 'result') {
                  estiloLinha = 'text-cyan-300 border-cyan-500/25 bg-cyan-500/8'
                  prefixo = '←'
                }

                return (
                  <div
                    key={linha.id}
                    className={`flex items-start gap-2 rounded-xl border px-3 py-2 whitespace-pre-wrap break-words transition-all ${estiloLinha}`}
                  >
                    <span className="shrink-0 select-none opacity-85">
                      {prefixo}
                    </span>
                    <span className="min-w-0 flex-1">{linha.texto}</span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white">
      <Navbar
        activeTab="playground"
        subtitle="Playground JS"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-5 sm:space-y-6 pb-14">
        <PageHeaderBanner
          tone="amber"
          badge="Ambiente Só JavaScript • Lógica e Console"
          title="Playground JavaScript"
          description={
            <>
              Escreva JavaScript normal com variáveis, condições{' '}
              <code className="font-mono text-xs text-stone-800 dark:text-gray-200">
                if/else
              </code>{' '}
              e funções, e veja o resultado no console.
            </>
          }
          rightSlot={
            <Link
              href="/playground"
              className="press-tactile inline-flex items-center justify-center rounded-xl bg-emerald-500/12 hover:bg-emerald-500/20 border border-emerald-600/25 dark:border-emerald-500/30 px-4 py-2.5 text-xs sm:text-sm font-extrabold whitespace-nowrap text-emerald-700 dark:text-emerald-400 transition-all"
            >
              Modo HTML + CSS + JS →
            </Link>
          }
        />

        {expandido ? (
          <div className="fixed inset-0 z-50 flex flex-col gap-3.5 overflow-y-auto bg-stone-50 bg-lab-dots px-3.5 pb-6 pt-0 sm:px-6 text-stone-900 dark:bg-gray-950 dark:text-white">
            {workspaceContent}
          </div>
        ) : (
          <LabSurface
            variant="card"
            className="flex flex-col gap-3.5 p-4 sm:p-6 transition-all duration-300"
          >
            {workspaceContent}
          </LabSurface>
        )}

        <div className="flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="press-tactile inline-flex items-center justify-center rounded-xl border border-stone-200/90 dark:border-gray-800 bg-white/95 dark:bg-gray-900/85 px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            ← Trilha
          </Link>
        </div>

        <iframe
          ref={iframeRef}
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