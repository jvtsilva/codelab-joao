'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/hooks/useTheme'
import { Navbar } from '@/components/Navbar'
import { stripDangerousHtml } from '@/lib/security'

type PlaygroundMode = 'js' | 'web'

const STARTER_JS = `// Experimente escrever JavaScript no seu ritmo
const topicos = ['Variáveis', 'Funções', 'Arrays', 'DOM']

function resumirTopicos(lista) {
  return lista.map((item, indice) => \`\${indice + 1}. \${item}\`)
}

console.log('Tópicos da trilha:')
resumirTopicos(topicos).forEach((linha) => console.log(linha))
`

const STARTER_HTML = `<main class="card">
  <span class="tag">Preview Web</span>
  <h1>Estúdio de Código</h1>
  <p id="status">Clique no botão para testar o JavaScript na página.</p>
  <button id="btn-acao" type="button">Atualizar mensagem</button>
</main>`

const STARTER_CSS = `body {
  margin: 0;
  padding: 24px;
  font-family: system-ui, -apple-system, sans-serif;
  background: #f8f7f4;
  color: #18181b;
}

.card {
  max-width: 420px;
  margin: 0 auto;
  padding: 24px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e7e5e4;
}

.tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  color: #047857;
  margin-bottom: 8px;
}

button {
  margin-top: 12px;
  padding: 10px 16px;
  border-radius: 10px;
  border: 0;
  background: #047857;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}`

const STARTER_WEB_JS = `let cliques = 0
const btn = document.getElementById('btn-acao')
const statusEl = document.getElementById('status')

if (btn && statusEl) {
  btn.addEventListener('click', () => {
    cliques += 1
    statusEl.textContent = 'Interação registrada ' + cliques + ' vez(es) no preview.'
  })
}`

function buildJsSandboxDoc(code: string, runId: number): string {
  const safeCode = code.replace(/<\/script/gi, '<\\/script')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
</head>
<body>
  <script>
    (function () {
      const runId = ${runId};
      const logs = [];

      function formatArg(value) {
        if (typeof value === 'string') return value;
        if (value === undefined) return 'undefined';
        if (typeof value === 'function') return value.toString();
        try {
          return JSON.stringify(value);
        } catch {
          return String(value);
        }
      }

      const sandboxConsole = {
        log: (...args) => logs.push(args.map(formatArg).join(' ')),
        warn: (...args) => logs.push('[Aviso] ' + args.map(formatArg).join(' ')),
        error: (...args) => logs.push('[Erro] ' + args.map(formatArg).join(' ')),
      };

      try {
        const fn = new Function('console', ${JSON.stringify(safeCode)});
        fn(sandboxConsole);
        parent.postMessage(
          {
            source: 'codelab-js-sandbox',
            runId,
            logs: logs.length > 0 ? logs : ['Código executado sem saída no console.'],
          },
          '*'
        );
      } catch (err) {
        const msg = err && err.message ? err.message : 'Erro ao executar JavaScript.';
        parent.postMessage(
          {
            source: 'codelab-js-sandbox',
            runId,
            logs: ['Erro: ' + msg],
          },
          '*'
        );
      }
    })();
  </script>
</body>
</html>`
}

function buildWebPreviewDoc(html: string, css: string, js: string): string {
  const cleanHtml = stripDangerousHtml(html)
  const cleanCss = css.replace(/<\/style/gi, '<\\/style')
  const cleanScript = js.replace(/<\/script/gi, '<\\/script')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${cleanCss}</style>
</head>
<body>
  ${cleanHtml}
  <script>
    try {
      ${cleanScript}
    } catch (err) {
      const pre = document.createElement('pre');
      pre.style.color = '#b45309';
      pre.style.fontFamily = 'monospace';
      pre.textContent = 'Erro no script: ' + (err && err.message ? err.message : String(err));
      document.body.appendChild(pre);
    }
  </script>
</body>
</html>`
}

export default function PlaygroundPage() {
  const { isDark, alternarTema } = useTheme()
  const [userId, setUserId] = useState<string | null>(null)
  const [mode, setMode] = useState<PlaygroundMode>('js')

  // Estado modo JS
  const [jsCode, setJsCode] = useState<string>(STARTER_JS)
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const [jsSandboxDoc, setJsSandboxDoc] = useState<string>('')
  const [jsSandboxKey, setJsSandboxKey] = useState<number>(0)
  const runCounterRef = useRef(0)
  const activeRunIdRef = useRef(0)

  // Estado modo HTML/CSS/JS
  const [htmlCode, setHtmlCode] = useState<string>(STARTER_HTML)
  const [cssCode, setCssCode] = useState<string>(STARTER_CSS)
  const [webJsCode, setWebJsCode] = useState<string>(STARTER_WEB_JS)
  const [previewDoc, setPreviewDoc] = useState<string>(() =>
    buildWebPreviewDoc(STARTER_HTML, STARTER_CSS, STARTER_WEB_JS)
  )

  useEffect(() => {
    let active = true

    async function initSession() {
      try {
        const { data } = await supabase.auth.getSession()
        if (!active) return
        setUserId(data.session?.user?.id ?? null)
      } catch {
        // Ignora falha de leitura de sessão
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
      const data = event.data
      if (!data || data.source !== 'codelab-js-sandbox') return
      if (data.runId !== activeRunIdRef.current) return
      if (Array.isArray(data.logs)) {
        setConsoleLogs(data.logs.map(String))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const runJsPlayground = useCallback(() => {
    runCounterRef.current += 1
    const nextRunId = runCounterRef.current
    activeRunIdRef.current = nextRunId
    setJsSandboxKey(nextRunId)
    setConsoleLogs(['Executando...'])
    setJsSandboxDoc(buildJsSandboxDoc(jsCode, nextRunId))
  }, [jsCode])

  const buildWebPreview = useCallback(() => {
    setPreviewDoc(buildWebPreviewDoc(htmlCode, cssCode, webJsCode))
  }, [htmlCode, cssCode, webJsCode])

  const resetWebPlayground = useCallback(() => {
    setHtmlCode(STARTER_HTML)
    setCssCode(STARTER_CSS)
    setWebJsCode(STARTER_WEB_JS)
    setPreviewDoc(buildWebPreviewDoc(STARTER_HTML, STARTER_CSS, STARTER_WEB_JS))
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F7F4] bg-lab-dots text-[#18181B] dark:bg-[#0B0F14] dark:text-[#F1F5F9]">
      <Navbar
        subtitle="Playground de Código"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 space-y-6">
        <section className="border rounded-2xl p-6 sm:p-7 bg-white border-[#E7E5E4] dark:bg-[#121821] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-semibold bg-[#047857]/10 border-[#047857]/25 text-[#047857] dark:bg-[#34D399]/10 dark:border-[#34D399]/25 dark:text-[#34D399]">
              Ambiente isolado • Prática livre
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Playground Interativo
            </h1>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8]">
              Teste lógica em JavaScript puro ou monte pequenas interfaces com HTML, CSS e JS em preview isolado.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Modo do playground"
            className="inline-flex rounded-xl p-1 border bg-[#F8F7F4] border-[#E7E5E4] dark:bg-[#0E131A] dark:border-[#1E293B] shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'js'}
              onClick={() => setMode('js')}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                mode === 'js'
                  ? 'bg-[#047857] dark:bg-[#34D399] text-white dark:text-[#0B0F14]'
                  : 'text-[#57534E] dark:text-[#94A3B8]'
              }`}
            >
              JavaScript
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'web'}
              onClick={() => setMode('web')}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                mode === 'web'
                  ? 'bg-[#047857] dark:bg-[#34D399] text-white dark:text-[#0B0F14]'
                  : 'text-[#57534E] dark:text-[#94A3B8]'
              }`}
            >
              HTML / CSS / JS
            </button>
          </div>
        </section>

        {mode === 'js' ? (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 border rounded-2xl p-5 sm:p-6 bg-white border-[#E7E5E4] dark:bg-[#121821] dark:border-[#1E293B] space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <label
                  htmlFor="pg-js-editor"
                  className="text-xs font-mono font-semibold text-[#57534E] dark:text-[#94A3B8]"
                >
                  Editor JavaScript (Ctrl/Cmd + Enter)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setJsCode(STARTER_JS)
                      setConsoleLogs([])
                      setJsSandboxDoc('')
                      setJsSandboxKey(0)
                    }}
                    className="press-tactile px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer bg-[#F8F7F4] hover:bg-[#F1EFEA] border-[#E7E5E4] dark:bg-[#0E131A] dark:hover:bg-[#121821] dark:border-[#1E293B]"
                  >
                    Resetar
                  </button>
                  <button
                    type="button"
                    onClick={runJsPlayground}
                    className="press-tactile px-4 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer bg-[#047857] hover:bg-[#065F46] dark:bg-[#34D399] dark:hover:bg-[#6EE7B7] text-white dark:text-[#0B0F14]"
                  >
                    Executar
                  </button>
                </div>
              </div>

              <textarea
                id="pg-js-editor"
                rows={15}
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault()
                    runJsPlayground()
                  }
                }}
                spellCheck={false}
                className="w-full p-4 rounded-xl border font-mono text-xs sm:text-sm leading-relaxed bg-[#F8F7F4] border-[#E7E5E4] text-[#18181B] dark:bg-[#0E131A] dark:border-[#1E293B] dark:text-[#F1F5F9]"
              />

              {jsSandboxDoc && (
                <iframe
                  key={jsSandboxKey}
                  title="Executor isolado de JavaScript"
                  sandbox="allow-scripts"
                  srcDoc={jsSandboxDoc}
                  className="hidden"
                />
              )}
            </div>

            <div className="lg:col-span-5 border rounded-2xl p-5 sm:p-6 bg-white border-[#E7E5E4] dark:bg-[#121821] dark:border-[#1E293B] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#57534E] dark:text-[#94A3B8]">
                  <span>Console</span>
                  <button
                    type="button"
                    onClick={() => setConsoleLogs([])}
                    className="underline cursor-pointer hover:text-[#18181B] dark:hover:text-[#F1F5F9]"
                  >
                    Limpar saída
                  </button>
                </div>

                <div className="min-h-64 p-4 rounded-xl border font-mono text-xs space-y-1.5 bg-[#F8F7F4] border-[#E7E5E4] dark:bg-[#0E131A] dark:border-[#1E293B]">
                  {consoleLogs.length === 0 ? (
                    <p className="text-[#57534E] dark:text-[#94A3B8]">
                      Clique em “Executar” para rodar o código.
                    </p>
                  ) : (
                    consoleLogs.map((line, i) => (
                      <p key={i} className="whitespace-pre-wrap break-words">
                        {line}
                      </p>
                    ))
                  )}
                </div>
              </div>

              <div className="text-xs text-[#57534E] dark:text-[#94A3B8] flex items-center justify-between pt-2 border-t border-[#E7E5E4] dark:border-[#1E293B]">
                <span>Precisa de roteiro?</span>
                <Link
                  href="/dashboard"
                  className="font-bold text-[#047857] dark:text-[#34D399] hover:underline"
                >
                  Ir para a Trilha →
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="border rounded-2xl p-4 bg-white border-[#E7E5E4] dark:bg-[#121821] dark:border-[#1E293B] space-y-2">
                <label
                  htmlFor="pg-html"
                  className="block text-xs font-mono font-semibold text-[#57534E] dark:text-[#94A3B8]"
                >
                  HTML
                </label>
                <textarea
                  id="pg-html"
                  rows={6}
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      e.preventDefault()
                      buildWebPreview()
                    }
                  }}
                  spellCheck={false}
                  className="w-full p-3 rounded-xl border font-mono text-xs bg-[#F8F7F4] border-[#E7E5E4] text-[#18181B] dark:bg-[#0E131A] dark:border-[#1E293B] dark:text-[#F1F5F9]"
                />
              </div>

              <div className="border rounded-2xl p-4 bg-white border-[#E7E5E4] dark:bg-[#121821] dark:border-[#1E293B] space-y-2">
                <label
                  htmlFor="pg-css"
                  className="block text-xs font-mono font-semibold text-[#57534E] dark:text-[#94A3B8]"
                >
                  CSS
                </label>
                <textarea
                  id="pg-css"
                  rows={6}
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      e.preventDefault()
                      buildWebPreview()
                    }
                  }}
                  spellCheck={false}
                  className="w-full p-3 rounded-xl border font-mono text-xs bg-[#F8F7F4] border-[#E7E5E4] text-[#18181B] dark:bg-[#0E131A] dark:border-[#1E293B] dark:text-[#F1F5F9]"
                />
              </div>

              <div className="border rounded-2xl p-4 bg-white border-[#E7E5E4] dark:bg-[#121821] dark:border-[#1E293B] space-y-2">
                <label
                  htmlFor="pg-web-js"
                  className="block text-xs font-mono font-semibold text-[#57534E] dark:text-[#94A3B8]"
                >
                  JavaScript (Ctrl/Cmd + Enter atualiza)
                </label>
                <textarea
                  id="pg-web-js"
                  rows={6}
                  value={webJsCode}
                  onChange={(e) => setWebJsCode(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      e.preventDefault()
                      buildWebPreview()
                    }
                  }}
                  spellCheck={false}
                  className="w-full p-3 rounded-xl border font-mono text-xs bg-[#F8F7F4] border-[#E7E5E4] text-[#18181B] dark:bg-[#0E131A] dark:border-[#1E293B] dark:text-[#F1F5F9]"
                />
              </div>
            </div>

            <div className="lg:col-span-6 border rounded-2xl p-4 sm:p-5 bg-white border-[#E7E5E4] dark:bg-[#121821] dark:border-[#1E293B] flex flex-col space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-semibold text-[#57534E] dark:text-[#94A3B8]">
                  Preview isolado (sandbox)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetWebPlayground}
                    className="press-tactile px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer bg-[#F8F7F4] hover:bg-[#F1EFEA] border-[#E7E5E4] dark:bg-[#0E131A] dark:hover:bg-[#121821] dark:border-[#1E293B]"
                  >
                    Resetar
                  </button>
                  <button
                    type="button"
                    onClick={buildWebPreview}
                    className="press-tactile px-4 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer bg-[#047857] hover:bg-[#065F46] dark:bg-[#34D399] dark:hover:bg-[#6EE7B7] text-white dark:text-[#0B0F14]"
                  >
                    Atualizar preview
                  </button>
                </div>
              </div>

              <iframe
                title="Preview HTML, CSS e JavaScript"
                sandbox="allow-scripts"
                srcDoc={previewDoc}
                className="w-full flex-1 min-h-96 rounded-xl border border-[#E7E5E4] dark:border-[#1E293B] bg-[#F8F7F4]"
              />
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[#E7E5E4] dark:border-[#1E293B] px-4 sm:px-8 py-6 text-center text-xs max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-[#57534E] dark:text-[#94A3B8]">
        <p>Codelab João • Playground educativo</p>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-[#047857] dark:hover:text-[#34D399]">
            Trilha
          </Link>
          <Link href="/desafios" className="hover:text-[#047857] dark:hover:text-[#34D399]">
            Desafios
          </Link>
          <Link href="/privacidade" className="hover:text-[#047857] dark:hover:text-[#34D399]">
            Privacidade e LGPD
          </Link>
        </div>
      </footer>
    </div>
  )
}