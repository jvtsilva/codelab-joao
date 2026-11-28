import Link from 'next/link'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'
import { LabSurface } from '@/components/LabSurface'

export const metadata: Metadata = buildPageMetadata({
  title: 'Política de Privacidade',
  description:
    'Como o Codelab João trata dados de conta, progresso de estudo, cookies e solicitações de exclusão conforme a LGPD.',
  path: '/privacidade',
})

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 selection:bg-emerald-500 selection:text-gray-950 bg-stone-50 bg-lab-dots text-stone-900 dark:bg-gray-950 dark:text-white">
      <header className="max-w-3xl w-full mx-auto pt-2 flex items-center justify-between gap-2 flex-wrap">
        <Link href="/" className="font-bold text-sm tracking-wide">
          Codelab <span className="text-emerald-700 dark:text-emerald-400 font-normal">João</span>
        </Link>

        <nav className="flex items-center gap-2 flex-wrap">
          <Link
            href="/termos"
            className="text-xs font-semibold transition px-3 py-2 rounded-xl border bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800"
          >
            Termos de Uso
          </Link>
          <Link
            href="/contato"
            className="text-xs font-semibold transition px-3 py-2 rounded-xl border bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:border-gray-800"
          >
            Contato
          </Link>
        </nav>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto py-8">
        <LabSurface variant="card" className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-stone-200 dark:border-slate-800 pb-4">
            <span className="inline-block px-3 py-1 border font-bold text-[11px] rounded-full bg-emerald-50 text-emerald-700 border-emerald-600/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              LGPD • TRANSPARÊNCIA
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Política de Privacidade
            </h1>
            <p className="text-xs text-stone-600 dark:text-gray-400">
              Codelab João — Estúdio de código calmo, técnico e gratuito.
            </p>
          </div>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              1. Dados que tratamos
            </h2>
            <p>
              Quando você cria uma conta, registramos seu nome de exibição, endereço de e-mail e
              identificador de autenticação, além do seu progresso nas aulas e desafios concluídos.
              Não vendemos dados pessoais nem exibimos anúncios invasivos.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              2. Finalidade e base legal
            </h2>
            <p>
              Os dados são utilizados estritamente para autenticar o acesso, manter seu progresso
              de estudo, proteger a plataforma contra abuso e cumprir obrigações legais aplicáveis,
              nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              3. Cookies e armazenamento local
            </h2>
            <p>
              Utilizamos armazenamento local e cookies estritamente necessários para manter a sessão,
              preferências de interface (como tema claro ou escuro) e o registro do seu
              consentimento de cookies.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              4. Exclusão de conta e direitos do titular
            </h2>
            <p>
              Você pode solicitar a exclusão definitiva da sua conta e dos dados associados
              diretamente em{' '}
              <Link
                href="/painel/excluir-conta"
                className="font-semibold underline text-emerald-700 dark:text-emerald-400"
              >
                Excluir minha conta
              </Link>{' '}
              ou falar conosco pela página de{' '}
              <Link
                href="/contato"
                className="font-semibold underline text-emerald-700 dark:text-emerald-400"
              >
                Contato
              </Link>
              .
            </p>
          </section>
        </LabSurface>
      </main>

      <footer className="max-w-3xl w-full mx-auto pb-2 text-center text-xs text-stone-600 dark:text-gray-400">
        <p>
          Codelab João •{' '}
          <Link href="/termos" className="underline">
            Termos de Uso
          </Link>{' '}
          •{' '}
          <Link href="/painel/excluir-conta" className="underline">
            Excluir conta
          </Link>
        </p>
      </footer>
    </div>
  )
}