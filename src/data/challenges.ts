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
  },
  {
    id: 'challenge-6',
    slug: '6',
    number: '#6',
    title: 'Constantes vs Variáveis Reutilizáveis',
    subtitle: 'Memória e Variáveis • Aula 5',
    difficulty: 'Fácil',
    xp: 50,
    type: 'quiz',
    prompt: 'Qual é a principal diferença conceitual entre declarar uma variável com `let` e uma constante com `const`?',
    options: [
      { id: 'a', text: 'a) `const` roda mais rápido que o `let` no navegador.' },
      { id: 'b', text: 'b) `let` permite alterar (reatribuir) o valor guardado posteriormente, enquanto `const` bloqueia novas atribuições.' },
      { id: 'c', text: 'c) `const` só aceita números e `let` só aceita textos.' }
    ],
    correctOptionId: 'b',
    successMessage: '🎉 Exato! O `let` é maleável para valores que mudam, e o `const` protege o dado contra alterações.',
    errorMessage: '❌ Incorreto. Lembre-se: `const` vem de constante, ou seja, seu valor não pode ser reatribuído.'
  },
  {
    id: 'challenge-7',
    slug: '7',
    number: '#7',
    title: 'Operador de Comparação Estrita',
    subtitle: 'Lógica Relacional • Aula 8',
    difficulty: 'Médio',
    xp: 70,
    type: 'quiz',
    prompt: 'Por que recomendamos utilizar o operador estrito de igualdade tripla (`===`) em vez de apenas dois sinais de igual (`==`) em JavaScript?',
    options: [
      { id: 'a', text: 'a) Porque o `===` verifica tanto se os valores são iguais quanto se os tipos de dados são idênticos.' },
      { id: 'b', text: 'b) Porque o `==` gera erros de vírus no console da web.' },
      { id: 'c', text: 'c) Porque o `===` transforma textos automaticamente em números.' }
    ],
    correctOptionId: 'a',
    successMessage: '🎉 Mandou muito bem! O operador `===` evita conversões automáticas indesejadas de tipo.',
    errorMessage: '❌ Quase! O `===` garante rigor total comparando tanto o valor quanto o tipo do dado.'
  },
  {
    id: 'challenge-8',
    slug: '8',
    number: '#8',
    title: 'Tomando Decisões com If / Else',
    subtitle: 'Estrutura Condicional • Aula 10',
    difficulty: 'Médio',
    xp: 80,
    type: 'code',
    prompt: 'Escreva um bloco condicional simples utilizando `if` que verifique se uma variável chamada `pontos` é maior que 10, exibindo `"Passou de fase"` no console caso seja verdadeiro.',
    placeholder: 'Ex: if (pontos > 10) { console.log("..."); }',
    validationPattern: /if\s*\(\s*pontos\s*>\s*10\s*\)\s*\{\s*console\.log\s*\(\s*['"`].+['"`]\s*\)\s*;?\s*\}/i,
    requiredKeyword: 'if',
    successMessage: '🎉 Perfeito! Sua estrutura condicional avaliou a pontuação perfeitamente.',
    errorMessage: '❌ Verifique a sintaxe: utilize `if (pontos > 10) { console.log("sua mensagem"); }`.'
  },
  {
    id: 'challenge-9',
    slug: '9',
    number: '#9',
    title: 'O Loop For Controlado',
    subtitle: 'Laços de Repetição • Aula 12',
    difficulty: 'Médio',
    xp: 90,
    type: 'code',
    prompt: 'Escreva um loop `for` padrão em JavaScript que inicialize um contador `i = 1` e execute enquanto `i <= 3`, incrementando `i++`. Dentro do loop, coloque um `console.log(i)`.',
    placeholder: 'Ex: for (let i = 1; i <= 3; i++) { console.log(i); }',
    validationPattern: /for\s*\(\s*let\s+i\s*=\s*1\s*;\s*i\s*<=\s*3\s*;\s*i\+\+\s*\)\s*\{\s*console\.log\s*\(\s*i\s*\)\s*;?\s*\}/i,
    requiredKeyword: 'for',
    successMessage: '🎉 Espetacular! O loop `for` automatizou a contagem em segundos.',
    errorMessage: '❌ Certifique-se de seguir o padrão do cabeçalho do `for` com inicialização, condição e incremento.'
  },
  {
    id: 'challenge-10',
    slug: '10',
    number: '#10',
    title: 'Manipulando Arrays (.push)',
    subtitle: 'Coleções de Dados • Aula 14',
    difficulty: 'Difícil',
    xp: 100,
    type: 'code',
    prompt: 'Dado um array existente chamado `inventario`, utilize o método `.push()` para adicionar a string `"Escudo"` ao final dele e imprima o array atualizado no console.',
    placeholder: 'Ex: inventario.push("Escudo"); console.log(inventario);',
    validationPattern: /inventario\.push\s*\(\s*['"`]Escudo['"`]\s*\)\s*;?.*console\.log\s*\(\s*inventario\s*\)/i,
    requiredKeyword: '.push(',
    successMessage: '🎉 Desafio Mestre Concluído! O método `.push()` adicionou o item com sucesso ao array.',
    errorMessage: '❌ Lembre-se de usar `inventario.push("Escudo")` e exibir o array no console.'
  }

]