export interface LessonContent {
  number: number
  title: string
  module: string
  description: string
  estimatedTime: string
  difficulty: string
  topics: { 
    title: string 
    desc: string 
    codeSnippet?: string 
    tip?: string 
  }[]
  challenge: {
    instruction: string
    initialCode: string
    expectedKeywords: string[] // Palavras-chave que o código digitado precisa conter para passar
    successMessage: string
    hint: string
  }
}

export const LESSONS_DATABASE: Record<number, LessonContent> = {
  1: {
    number: 1,
    title: "O Que É Programação de Verdade?",
    module: "Módulo 1: Fundamentos de JavaScript",
    description: "O computador não tem intuição. Ele é uma máquina puramente literal que executa ordens estritas baseadas em lógica binária.",
    estimatedTime: "15 min",
    difficulty: "Zero Absoluto",
    topics: [
      { 
        title: "1. Hardware vs Software", 
        desc: "O hardware é o corpo físico (silício, eletricidade, cobre). O software é a mente, o conjunto de instruções lógicas que diz ao hardware exatamente o que fazer a cada microssegundo.",
        tip: "Um computador sem software é apenas um peso de papel caro."
      },
      { 
        title: "2. O Que é um Algoritmo?", 
        desc: "Um algoritmo é uma sequência finita, ordenada e sem ambiguidades de passos para resolver um problema. Se a ordem muda, o resultado quebra.",
        codeSnippet: `// Exemplo de micro-algoritmo lógico:
const ingredientePronto = true;
if (ingredientePronto) {
    console.log("Iniciando execução do sistema...");
}`
      }
    ],
    challenge: {
      instruction: "Escreva um comando console.log imprimindo exatamente a frase: 'Iniciando sistema'",
      initialCode: `// Digite seu código abaixo:\n`,
      expectedKeywords: ["console.log", "Iniciando sistema"],
      successMessage: "Excelente! Você executou sua primeira instrução de saída no console.",
      hint: "Use o comando console.log(\"Iniciando sistema\") para registrar a mensagem."
    }
  },
  2: {
    number: 2,
    title: "O Pensamento Algorítmico e Decomposição",
    module: "Módulo 1: Fundamentos de JavaScript",
    description: "Aprenda a fatiar problemas gigantescos em micro-tarefas simples que qualquer máquina consegue processar.",
    estimatedTime: "18 min",
    difficulty: "Mentalidade",
    topics: [
      { 
        title: "1. Decomposição de Problemas", 
        desc: "Nunca encare um problema inteiro de uma vez. O segredo dos engenheiros é fatiar o monstro em dezenas de pequenas partes fáceis de resolver.",
        tip: "Se o código está complexo demais, você tentou abraçar o problema grande demais. Fatie mais."
      },
      { 
        title: "2. Entrada, Processamento e Saída", 
        desc: "Todo e qualquer software do mundo segue rigorosamente o ciclo: Entrada (Input) ➔ Processamento (Lógica) ➔ Saída (Output).",
        codeSnippet: `// Ciclo básico:\nconst entrada = 10; // Input\nconst processamento = entrada * 2; // Lógica\nconsole.log(processamento); // Output`
      }
    ],
    challenge: {
      instruction: "Crie uma variável chamada 'resultado' que armazene a multiplicação de 5 por 4 e imprima o valor no console.",
      initialCode: `// Escreva seu código:\n`,
      expectedKeywords: ["const", "resultado", "5", "4", "console.log"],
      successMessage: "Perfeito! Você estruturou entrada, processamento matemático e saída.",
      hint: "Lembre-se: const resultado = 5 * 4; seguido de console.log(resultado);"
    }
  },
  3: {
    number: 3,
    title: "O Console e Variáveis (let e const)",
    module: "Módulo 1: Fundamentos de JavaScript",
    description: "Como a memória RAM guarda dados temporários? Conheça as caixas rotuladas chamadas variáveis.",
    estimatedTime: "20 min",
    difficulty: "Essencial",
    topics: [
      {
        title: "1. const vs let",
        desc: "Use `const` para valores imutáveis (constantes) e `let` para variáveis cujos valores vão mudar ao longo da execução do programa.",
        codeSnippet: `const nomeDoSistema = "Codelab";\nlet pontuacao = 0;\npontuacao = 10; // Permitido com let`
      }
    ],
    challenge: {
      instruction: "Declare uma variável chamada 'nivel' usando let e atribua o texto 'Iniciante' a ela.",
      initialCode: `// Declare sua variável let aqui:\n`,
      expectedKeywords: ["let", "nivel", "Iniciante"],
      successMessage: "Boa! Variável declarada corretamente com let.",
      hint: "Escreva: let nivel = \"Iniciante\";"
    }
  }
  // As demais aulas seguem essa mesma estrutura cirúrgica de código ativo...
}