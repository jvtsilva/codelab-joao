export interface ArenaChallenge {
  id: string // Ex: 'challenge-1', 'challenge-2'
  slug: string // URL amigável: '1', '2', '3'...
  number: string // Ex: '#1', '#2'
  title: string
  subtitle: string
  difficulty: 'Iniciante' | 'Fácil' | 'Médio' | 'Difícil'
  xp: number
  type: 'quiz' | 'code'
  prompt: string
  // Para desafios de múltipla escolha (quiz)
  options?: { id: string; text: string }[]
  correctOptionId?: string
  // Para desafios de código (code)
  placeholder?: string
  validationPattern?: RegExp
  requiredKeyword?: string
  successMessage: string
  errorMessage: string
}

export const ARENA_CHALLENGES: ArenaChallenge[] = [
  {
    id: 'challenge-1',
    slug: '1',
    number: '#1',
    title: 'O que é Programação e Lógica',
    subtitle: 'Fundamentos Teóricos • Aula 1',
    difficulty: 'Iniciante',
    xp: 30,
    type: 'quiz',
    prompt: 'Como podemos definir o conceito básico de programação de computadores?',
    options: [
      { id: 'a', text: 'a) Um cabo elétrico que transmite energia para a placa de vídeo.' },
      { id: 'b', text: 'b) Dar instruções lógicas passo a passo para o computador resolver tarefas.' },
      { id: 'c', text: 'c) Um antivírus automático para navegadores web.' }
    ],
    correctOptionId: 'b',
    successMessage: '🎉 Parabéns! Resposta correta. A programação consiste em dar instruções lógicas passo a passo.',
    errorMessage: '❌ Incorreto. Pense na programação como uma sequência lógica de passos para o computador.'
  },
  {
    id: 'challenge-2',
    slug: '2',
    number: '#2',
    title: 'Hardware vs Software',
    subtitle: 'Arquitetura Básica • Aula 1',
    difficulty: 'Iniciante',
    xp: 30,
    type: 'quiz',
    prompt: 'Na analogia entre o computador e o ser humano, qual opção representa corretamente o papel do Software?',
    options: [
      { id: 'a', text: 'a) As peças físicas como teclado, monitor e memória RAM.' },
      { id: 'b', text: 'b) A parte lógica e os programas que dão instruções para o hardware trabalhar.' },
      { id: 'c', text: 'c) A fonte de energia que liga o computador na tomada.' }
    ],
    correctOptionId: 'b',
    successMessage: '🎉 Mandou bem! O software é a parte lógica que comanda o hardware.',
    errorMessage: '❌ Quase lá! Lembre-se: hardware é o que você pode tocar (corpo), software é a lógica (mente).'
  },
  {
    id: 'challenge-3',
    slug: '3',
    number: '#3',
    title: 'Imprimindo no Console',
    subtitle: 'Primeiro Comando • Aula 3',
    difficulty: 'Fácil',
    xp: 40,
    type: 'code',
    prompt: 'Utilize o comando `console.log()` para exibir a frase `"Olá, Arena!"` no terminal.',
    placeholder: 'Ex: console.log("...")',
    validationPattern: /console\.log\s*\(\s*['"`].+['"`]\s*\)\s*;?/i,
    requiredKeyword: 'console.log',
    successMessage: '🎉 Excelente! Seu comando `console.log()` foi executado com sucesso.',
    errorMessage: '❌ Faltou usar `console.log("sua mensagem")` com o texto entre aspas.'
  },
  {
    id: 'challenge-4',
    slug: '4',
    number: '#4',
    title: 'Armazenando a Idade do Usuário',
    subtitle: 'Prática de Variável Numérica',
    difficulty: 'Fácil',
    xp: 50,
    type: 'code',
    prompt: 'Escreva um código em JavaScript declarando uma constante chamada `idade` contendo um valor numérico (ex: `const idade = 25;`).',
    placeholder: 'Digite seu script aqui...',
    validationPattern: /const\s+idade\s*=\s*\d+\s*;?/i,
    requiredKeyword: 'idade',
    successMessage: '🎉 Parabéns! Resposta correta. Variável "idade" criada com sucesso na Arena!',
    errorMessage: '❌ Incorreto. Lembre-se de utilizar a palavra-chave `const` e nomear a variável exatamente como `idade`.'
  },
  {
    id: 'challenge-5',
    slug: '5',
    number: '#5',
    title: 'Calculadora Rápida no Console',
    subtitle: 'Operações Básicas no Terminal',
    difficulty: 'Fácil',
    xp: 60,
    type: 'code',
    prompt: 'Peça para o JavaScript calcular e exibir no console a soma de `15 + 25` usando `console.log()`.',
    placeholder: 'Ex: console.log(10 + 5)',
    validationPattern: /console\.log\s*\(\s*15\s*\+\s*25\s*\)\s*;?/i,
    requiredKeyword: '15 + 25',
    successMessage: '🎉 Perfeito! O JavaScript calculou e exibiu 40 no console.',
    errorMessage: '❌ Quase! Escreva `console.log(15 + 25)` sem aspas para o computador realizar a soma.'
  }
]