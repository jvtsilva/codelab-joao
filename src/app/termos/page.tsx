import Link from 'next/link'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'
import { LabSurface } from '@/components/LabSurface'

export const metadata: Metadata = buildPageMetadata({
  title: 'Termos de Uso',
  description:
    'Condições de utilização do Codelab João, regras de conduta, uso do ambiente de código e disposições do Marco Civil da Internet.',
  path: '/termos',
})

export default function TermosPage() {
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
              MARCO CIVIL • CONDIÇÕES DE USO
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Termos de Uso</h1>
            <p className="text-xs text-stone-600 dark:text-gray-400">
              Regras de acesso e utilização do ambiente educacional do Codelab João.
            </p>
          </div>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              1. Finalidade educacional
            </h2>
            <p>
              O Codelab João oferece trilhas, desafios e espaços interativos de prática de
              programação com foco didático. O conteúdo é disponibilizado no estado em que se
              encontra para fins de estudo e experimentação.
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              2. Uso adequado e segurança da plataforma
            </h2>
            <p>
              É proibido utilizar a plataforma para tentativas de acesso não autorizado,
              sobrecarga intencional, distribuição de código malicioso ou violação de direitos de
              terceiros, em conformidade com a legislação brasileira, incluindo o Marco Civil da
              Internet (Lei nº 12.965/2014).
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              3. Conta, progresso e encerramento
            </h2>
            <p>
              Você é responsável por manter a confidencialidade das credenciais da sua conta e pode
              encerrá-la a qualquer momento em{' '}
              <Link
                href="/painel/excluir-conta"
                className="font-semibold underline text-emerald-700 dark:text-emerald-400"
              >
                Excluir minha conta
              </Link>
              .
            </p>
          </section>

          <section className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-gray-300">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              4. Atualizações destes termos
            </h2>
            <p>
              Estes termos podem ser atualizados para refletir melhorias técnicas ou exigências
              legais. Em caso de dúvida ou solicitação formal, utilize a página de{' '}
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
          <Link href="/privacidade" className="underline">
            Política de Privacidade
          </Link>{' '}
          •{' '}
          <Link href="/contato" className="underline">
            Contato
          </Link>
        </p>
      </footer>
    </div>
  )
}