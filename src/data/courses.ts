export interface Challenge {
  id: string
  type: 'multiple-choice' | 'code'
  question: string
  options?: string[]
  correctAnswer?: number
  expectedSnippet?: string
  explanation: string
}

export interface LessonData {
  id: string
  title: string
  challenges: Challenge[]
}

export interface ExamQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface ModuleData {
  id: string
  title: string
  description: string
  lessons: LessonData[]
  exam: ExamQuestion[]
}

export const JAVASCRIPT_MODULES: ModuleData[] = [
  {
    id: 'fundamentos',
    title: 'Fundamentos de JavaScript',
    description: 'Os primeiros passos essenciais para entender como a linguagem funciona e como estruturar dados na memória do computador.',
    lessons: [
      {
        id: 'variaveis-e-atribuicao',
        title: 'Variáveis e Atribuição',
        challenges: [
          {
            id: 'c-1',
            type: 'multiple-choice',
            question: 'Com base no que estudamos sobre caixinhas na memória, qual palavra-chave usamos para criar uma variável cujo valor pode mudar ao longo do programa?',
            options: ['const', 'let', 'static', 'fixed'],
            correctAnswer: 1,
            explanation: 'O `let` é a palavra-chave que avisa o computador que aquela caixinha é flexível e pode receber novos valores futuramente.'
          }
        ]
      },
      {
        id: 'tipos-de-dados',
        title: 'Tipos de Dados Básicos',
        challenges: [
          {
            id: 'c-2',
            type: 'multiple-choice',
            question: 'Se você quiser guardar uma frase ou um nome em uma variável, qual é a regra obrigatória de sintaxe que precisamos usar em volta do texto?',
            options: ['Colocar colchetes []', 'Colocar aspas (" ou \')', 'Deixar sem nada', 'Usar parênteses ()'],
            correctAnswer: 1,
            explanation: 'Textos (Strings) em JavaScript exigem o uso obrigatório de aspas simples ou duplas para o computador não confundir com comandos do sistema.'
          }
        ]
      },
      {
        id: 'operadores-matematicos',
        title: 'Operadores Matemáticos',
        challenges: [
          {
            id: 'c-3',
            type: 'code',
            question: 'Escreva um comando utilizando o console.log para o computador exibir o resultado da soma de 20 + 30.',
            expectedSnippet: 'console.log(20 + 30)',
            explanation: 'Para imprimir qualquer resultado na tela, combinamos a ferramenta console.log com os operadores matemáticos tradicionais dentro dos parênteses.'
          }
        ]
      }
    ],
    exam: [
      {
        id: 'ex-1',
        question: 'Qual palavra-chave devemos usar ao criar uma variável que terá seu valor alterado depois?',
        options: ['let', 'const', 'var-fixed', 'static'],
        correctAnswer: 0,
        explanation: 'O `let` permite reatribuição de valores.'
      },
      {
        id: 'ex-2',
        question: 'Como o JavaScript identifica um dado do tipo String (texto)?',
        options: ['Usando parênteses', 'Usando chaves', 'Entre aspas simples ou duplas', 'Sem nenhuma marcação'],
        correctAnswer: 2,
        explanation: 'Strings são delimitadas por aspas.'
      },
      {
        id: 'ex-3',
        question: 'O que o comando console.log() faz?',
        options: ['Apaga o computador', 'Imprime/exibe informações na tela', 'Cria uma variável automática', 'Cria uma condição if'],
        correctAnswer: 1,
        explanation: 'Ele envia a saída de dados para o console.'
      }
    ]
  },
  {
    id: 'controle-de-fluxo',
    title: 'Controle de Fluxo e Lógica',
    description: 'Aprenda a dar inteligência ao programa para que ele tome decisões e faça comparações com segurança.',
    lessons: [
      {
        id: 'condicionais-if-else',
        title: 'Condicionais com If / Else',
        challenges: [
          {
            id: 'c-4',
            type: 'multiple-choice',
            question: 'Qual palavra-chave usamos para indicar o "plano B"?',
            options: ['when', 'else', 'other', 'switch'],
            correctAnswer: 1,
            explanation: 'O `else` é o plano B.'
          }
        ]
      }
    ],
    exam: []
  }
];