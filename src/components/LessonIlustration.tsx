// src/components/LessonIllustration.tsx
'use client'

interface LessonIllustrationProps {
  lessonNumber: number
}

export function LessonIllustration({ lessonNumber }: LessonIllustrationProps) {
  if (!Number.isInteger(lessonNumber) || lessonNumber !== 1) {
    return null
  }

  return (
    <figure className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-gray-800 dark:bg-gray-950">
      <svg
        viewBox="0 0 640 150"
        className="w-full h-auto"
        role="img"
        aria-label="Fluxo de um algoritmo: 1. Início, 2. Passo a passo, 3. Execução e 4. Resultado"
      >
        <title>Fluxo de um algoritmo</title>

        {/* Linha conectora decorativa */}
        <line
          x1="80"
          y1="75"
          x2="560"
          y2="75"
          aria-hidden="true"
          className="stroke-emerald-500/50"
          strokeWidth="3"
          strokeDasharray="6 4"
        />

        {/* Bloco 1 */}
        <rect
          x="20"
          y="45"
          width="120"
          height="60"
          rx="14"
          className="fill-white stroke-stone-300 dark:fill-gray-900 dark:stroke-gray-700"
          strokeWidth="2"
        />
        <text
          x="80"
          y="72"
          textAnchor="middle"
          className="fill-emerald-700 dark:fill-emerald-400 text-[11px] font-bold"
        >
          1. INÍCIO
        </text>
        <text
          x="80"
          y="90"
          textAnchor="middle"
          className="fill-stone-500 dark:fill-gray-400 text-[10px]"
        >
          Objetivo claro
        </text>

        {/* Bloco 2 */}
        <rect
          x="180"
          y="45"
          width="120"
          height="60"
          rx="14"
          className="fill-white stroke-stone-300 dark:fill-gray-900 dark:stroke-gray-700"
          strokeWidth="2"
        />
        <text
          x="240"
          y="72"
          textAnchor="middle"
          className="fill-stone-900 dark:fill-white text-[11px] font-bold"
        >
          2. PASSO A PASSO
        </text>
        <text
          x="240"
          y="90"
          textAnchor="middle"
          className="fill-stone-500 dark:fill-gray-400 text-[10px]"
        >
          Ordem lógica
        </text>

        {/* Bloco 3 */}
        <rect
          x="340"
          y="45"
          width="120"
          height="60"
          rx="14"
          className="fill-white stroke-stone-300 dark:fill-gray-900 dark:stroke-gray-700"
          strokeWidth="2"
        />
        <text
          x="400"
          y="72"
          textAnchor="middle"
          className="fill-stone-900 dark:fill-white text-[11px] font-bold"
        >
          3. EXECUÇÃO
        </text>
        <text
          x="400"
          y="90"
          textAnchor="middle"
          className="fill-stone-500 dark:fill-gray-400 text-[10px]"
        >
          Sem adivinhar
        </text>

        {/* Bloco 4 */}
        <rect
          x="500"
          y="45"
          width="120"
          height="60"
          rx="14"
          className="fill-emerald-500/15 stroke-emerald-500"
          strokeWidth="2"
        />
        <text
          x="560"
          y="72"
          textAnchor="middle"
          className="fill-emerald-700 dark:fill-emerald-400 text-[11px] font-bold"
        >
          4. RESULTADO
        </text>
        <text
          x="560"
          y="90"
          textAnchor="middle"
          className="fill-stone-600 dark:fill-gray-300 text-[10px]"
        >
          Tarefa concluída
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-stone-500 dark:text-gray-400">
        Fluxo de um algoritmo: cada etapa prepara a próxima até o resultado final.
      </figcaption>
    </figure>
  )
}