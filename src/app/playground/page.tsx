'use client'

import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

const STORAGE_KEY = 'codelab_tema_aula'

type AbaMobile = 'tudo' | 'html' | 'css' | 'js' | 'resultado'

const HTML_INICIAL = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Playground Codelab</title>
</head>
<body>
  <main class="card">
    <h1>Laboratório HTML, CSS e JS</h1>
    <p id="mensagem">Clique no botão para testar o JavaScript na prática.</p>
    <div class="acoes">
      <button id="btn-contar" type="button">Contar: 0</button>
      <button id="btn-mudar" type="button" class="secundario">Mudar texto</button>
    </div>
  </main>
</body>
</html>`

const CSS_INICIAL = `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 24px;
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f5f4;
  color: #1c1917;
}

.card {
  max-width: 520px;
  margin: 0 auto;
  padding: 24px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e7e5e4;
}

h1 {
  margin-top: 0;
  font-size: 1.5rem;
}

.acoes {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}

button {
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  background: #10b981;
  color: #052e16;
}

button.secundario {
  background: #e7e5e4;
  color: #1c1917;
}`

const JS_INICIAL = `let contador = 0
const btnContar = document.getElementById('btn-contar')
const btnMudar = document.getElementById('btn-mudar')
const mensagem = document.getElementById('mensagem')

btnContar?.addEventListener('click', () => {
  contador += 1
  btnContar.textContent = 'Contar: ' + contador
})

btnMudar?.addEventListener('click', () => {
  if (mensagem) {
    mensagem.textContent = 'JS rodando ao vivo! Cliques registrados: ' + contador
  }
})`

export default function PlaygroundPage() {
  const [html, setHtml] = useState(HTML_INICIAL)
  const [css, setCss] = useState(CSS_INICIAL)
  const [js, setJs] = useState(JS_INICIAL)
  const [resetKey, setResetKey] = useState(0)
  const [expandido, setExpandido] = useState(false)
  const [abaMobile, setAbaMobile] = useState<AbaMobile>('tudo')
  const [userId, setUserId] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(true)

  useLayoutEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const escuro = salvo !== 'light'
    setIsDark(escuro)
    document.documentElement.classList.toggle('dark', escuro)
    document.documentElement.style.backgroundColor = escuro ? '#030712' : '#fafaf9'
  }, [])

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setUserId(data.session?.user?.id ?? null)
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setAbaMobile('html')
    }
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

  const srcDoc = useMemo(() => {
    const scriptTag = `<script>\n${js}\n</script>`
    const styleTag = `<style>\n${css}\n</style>`

    const trimmed = html.trimStart().toLowerCase()
    const temDocumentoCompleto =
      trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')

    if (temDocumentoCompleto) {
      let documento = html
      if (/<\/head>/i.test(documento)) {
        documento = documento.replace(/<\/head>/i, `${styleTag}\n</head>`)
      } else {
        documento = `${styleTag}\n${documento}`
      }

      if (/<\/body>/i.test(documento)) {
        return documento.replace(/<\/body>/i, `${scriptTag}\n</body>`)
      }
      return `${documento}\n${scriptTag}`
    }

    return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${styleTag}
  </head>
  <body>
    ${html}
    ${scriptTag}
  </body>
</html>`
  }, [html, css, js])

  function resetarTudo() {
    setHtml(HTML_INICIAL)
    setCss(CSS_INICIAL)
    setJs(JS_INICIAL)
    setResetKey((prev) => prev + 1)
  }

  const mostrarHtml = abaMobile === 'tudo' || abaMobile === 'html'
  const mostrarCss = abaMobile === 'tudo' || abaMobile === 'css'
  const mostrarJs = abaMobile === 'tudo' || abaMobile === 'js'
  const mostrarResultado = abaMobile === 'tudo' || abaMobile === 'resultado'

  const editorClasse =
    'w-full flex-1 min-h-[170px] sm:min-h-[200px] resize-y rounded-xl border border-stone-300 bg-white p-3 font-mono text-xs sm:text-sm leading-relaxed text-stone-900 focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-emerald-300'

  const workspaceClasse = expandido
    ? 'fixed inset-0 z-50 flex flex-col overflow-y-auto bg-stone-50 px-3.5 pb-6 pt-0 sm:px-6 text-stone-900 dark:bg-gray-950 dark:text-white'
    : 'flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-3.5 sm:p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900'

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 text-stone-900 dark:bg-gray-950 dark:text-white">
      <Navbar
        activeTab="playground"
        subtitle="Playground Livre"
        userId={userId}
        isDark={isDark}
        onToggleTheme={alternarTema}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-5 sm:space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 dark:border-gray-800 pb-4">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 border font-bold text-[11px] rounded-full bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              LABORATÓRIO LIVRE • HTML + CSS + JS
            </span>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight">
              Playground de Código
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-gray-400">
              Escreva HTML, CSS e JavaScript à vontade e veja o resultado ao vivo no navegador.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-semibold text-stone-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 shrink-0"
          >
            ← Voltar para a Trilha
          </Link>
        </div>

        <div className={workspaceClasse}>
          {/* Barra superior */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 dark:border-gray-800 ${
              expandido
                ? 'sticky top-0 z-10 -mx-3.5 sm:-mx-6 bg-stone-50/95 px-3.5 py-2.5 sm:px-6 backdrop-blur dark:bg-gray-950/95'
                : 'pb-3'
            }`}
          >
            <div className="flex items-center gap-1.5 overflow-x-auto md:hidden">
              {(
                [
                  { id: 'tudo', rotulo: 'Tudo' },
                  { id: 'html', rotulo: 'HTML' },
                  { id: 'css', rotulo: 'CSS' },
                  { id: 'js', rotulo: 'JS' },
                  { id: 'resultado', rotulo: 'Resultado' },
                ] as const
              ).map((aba) => (
                <button
                  key={aba.id}
                  type="button"
                  onClick={() => setAbaMobile(aba.id)}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer ${
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
              Ambiente ao Vivo • HTML + CSS + JavaScript
            </span>

            <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:items-center">
              <button
                type="button"
                onClick={resetarTudo}
                className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              >
                Resetar
              </button>

              <button
                type="button"
                onClick={() => setExpandido((prev) => !prev)}
                className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 text-xs font-extrabold text-gray-950 cursor-pointer"
              >
                {expandido ? 'Fechar tela cheia' : 'Expandir tela'}
              </button>
            </div>
          </div>

          {!expandido && (
            <p className="text-[11px] sm:text-xs text-stone-500 dark:text-gray-400">
              Dica: clique em{' '}
              <strong className="font-semibold text-stone-700 dark:text-gray-200">
                Expandir tela
              </strong>{' '}
              para ter mais espaço ao testar HTML, CSS e JavaScript.
            </p>
          )}

          {/* Editores + Resultado */}
          <div
            className={`grid gap-4 pt-1 grid-cols-1 lg:grid-cols-12 ${
              expandido ? 'flex-1 min-h-[500px]' : ''
            }`}
          >
            <div
              className={`flex flex-col gap-3 lg:col-span-6 ${
                !mostrarHtml && !mostrarCss && !mostrarJs ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div className={`${mostrarHtml ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
                <label className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-gray-400">
                  HTML
                </label>
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  spellCheck={false}
                  className={editorClasse}
                />
              </div>

              <div className={`${mostrarCss ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
                <label className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-gray-400">
                  CSS
                </label>
                <textarea
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  spellCheck={false}
                  className={editorClasse}
                />
              </div>

              <div className={`${mostrarJs ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
                <label className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-gray-400">
                  JavaScript
                </label>
                <textarea
                  value={js}
                  onChange={(e) => setJs(e.target.value)}
                  spellCheck={false}
                  className={editorClasse}
                />
              </div>
            </div>

            <div
              className={`${
                mostrarResultado ? 'flex' : 'hidden md:flex'
              } flex-col flex-1 lg:col-span-6`}
            >
              <span className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-gray-400">
                Resultado na tela
              </span>
              <iframe
                key={resetKey}
                title="Preview HTML, CSS e JavaScript"
                srcDoc={srcDoc}
                sandbox="allow-scripts"
                className={`w-full flex-1 rounded-xl border border-stone-300 bg-white dark:border-gray-700 ${
                  expandido
                    ? 'min-h-[340px] lg:min-h-[540px]'
                    : 'min-h-[280px] sm:min-h-[380px] lg:min-h-[540px]'
                }`}
              />
            </div>
          </div>
        </div>
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