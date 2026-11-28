import Link from 'next/link'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'
import { LabSurface } from '@/components/LabSurface'

export const metadata: Metadata = buildPageMetadata({
  title: 'Contato',
  description:
    'Canais de atendimento, suporte e solicitações relacionadas à conta e privacidade no Codelab João.',
  path: '/contato',
})

export default function ContatoPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white">
      <header className="max-w-3xl w-full mx-auto pt-2 flex items-center justify-between gap-2 flex-wrap">
        <Link href="/" className="font-bold text-sm tracking-wide">
          Codelab <span className="text-emerald-700 dark:text-emerald-400 font-normal">João</span>
        </Link>

        <nav className="flex items-center gap-2 flex-wrap">
          <Link
            href="/privacidade"
            className="text-xs font-semibold transition px-3 py-2 rounded-xl border bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800"
          >
            Política de Privacidade
          </Link>
          <Link
            href="/termos"
            className="text-xs font-semibold transition px-3 py-2 rounded-xl border bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800"
          >
            Termos de Uso
          </Link>
        </nav>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto py-8">
        <LabSurface variant="card" className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-stone-200 dark:border-slate-800 pb-4">
            <span className="inline-block px-3 py-1 border font-bold text-[11px] rounded-full bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              ATENDIMENTO E SUPORTE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Contato</h1>
            <p className="text-xs text-stone-600 dark:text-gray-400">
              Fale com o Codelab João sobre acesso, dúvidas didáticas, privacidade ou direitos
              previstos na LGPD.
            </p>
          </div>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              1. Canal de contato
            </h2>
            <p>
              Para suporte técnico, sugestões de desafios ou solicitações relacionadas aos seus
              dados pessoais, entre em contato pelo e-mail oficial da plataforma:{' '}
              <a
                href="mailto:contato@codelabjoao.com.br"
                className="font-mono font-semibold underline text-emerald-700 dark:text-emerald-400"
              >
                contato@codelabjoao.com.br
              </a>
              .
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              2. Exclusão de conta e dados
            </h2>
            <p>
              Se você já possui acesso à sua conta, pode solicitar a exclusão definitiva de forma
              direta em{' '}
              <Link
                href="/painel/excluir-conta"
                className="font-semibold underline text-emerald-700 dark:text-emerald-400"
              >
                Excluir minha conta
              </Link>
              . Caso não consiga acessar a conta, informe o e-mail cadastrado na mensagem enviada
              ao canal de contato.
            </p>
          </section>
        </LabSurface>
      </main>

      <footer className="max-w-3xl w-full mx-auto pb-2 text-center text-xs text-stone-600 dark:text-gray-400">
        <p>
          Codelab João •{' '}
          <Link href="/privacidade" className="underline">
            Política de Privacidade
          </Link>{' '}
          •{' '}
          <Link href="/termos" className="underline">
            Termos de Uso
          </Link>
        </p>
      </footer>
    </div>
  )
}