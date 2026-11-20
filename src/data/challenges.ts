export interface ArenaChallenge {
  id: string
  slug: string
  number: string
  title: string
  subtitle: string
  difficulty: 'Iniciante' | 'Fácil' | 'Médio' | 'Difícil'
  xp: number
  type: 'quiz' | 'code'
  prompt: string
  options?: { id: string; text: string }[]
  correctOptionId?: string
  placeholder?: string
  validationPattern?: RegExp
  requiredKeyword?: string
  successMessage: string
  errorMessage: string
}

export const ARENA_CHALLENGES: ArenaChallenge[] = [
  // Aula 1: Como o Computador Segue Instruções
  {
    id: 'challenge-1',
    slug: '1',
    number: '#1',
    title: 'Sequência de Instruções',
    subtitle: 'Fundamentos • Aula 1',
    difficulty: 'Iniciante',
    xp: 30,
    type: 'quiz',
    prompt: 'O que acontece se você der instruções corretas ao computador, mas fora da ordem lógica?',
    options: [
      { id: 'a', text: 'a) O computador adivinha a ordem certa sozinho antes de executar.' },
      { id: 'b', text: 'b) O resultado pode sair errado ou falhar porque a execução segue a ordem recebida.' },
      { id: 'c', text: 'c) O código apaga as linhas fora de ordem automaticamente.' },
    ],
    correctOptionId: 'b',
    successMessage: '🎉 Isso aí! O computador executa passo a passo exatamente na ordem dada.',
    errorMessage: '❌ Pense na sequência: se a ordem falha, o resultado também sai diferente do esperado.',
  },

  // Aula 2: Pensamento Algorítmico na Prática
  {
    id: 'challenge-2',
    slug: '2',
    number: '#2',
    title: 'Quebrando um Problema em Passos',
    subtitle: 'Algoritmos • Aula 2',
    difficulty: 'Iniciante',
    xp: 30,
    type: 'quiz',
    prompt: 'Qual é a melhor prática ao transformar um problema do dia a dia em um algoritmo?',
    options: [
      { id: 'a', text: 'a) Tentar resolver tudo de uma vez sem dividir em etapas.' },
      { id: 'b', text: 'b) Dividir o problema em passos pequenos, claros e verificáveis.' },
      { id: 'c', text: 'c) Usar nomes aleatórios para não perder tempo.' },
    ],
    correctOptionId: 'b',
    successMessage: '🎉 Mandou bem! Dividir em passos pequenos facilita testar e corrigir.',
    errorMessage: '❌ Quase! Um bom algoritmo separa o problema em etapas simples e claras.',
  },

  // Aula 3: Onde o Código Roda e o Console
  {
    id: 'challenge-3',
    slug: '3',
    number: '#3',
    title: 'Sua Primeira Mensagem no Console',
    subtitle: 'Console e Ambiente • Aula 3',
    difficulty: 'Fácil',
    xp: 40,
    type: 'code',
    prompt: 'Use `console.log()` para exibir a mensagem `"Pronto para codar!"` no console.',
    placeholder: 'console.log("Pronto para codar!")',
    validationPattern: /console\.log\s*\(\s*['"`]Pronto para codar!['"`]\s*\)\s*;?/i,
    requiredKeyword: 'console.log',
    successMessage: '🎉 Show! Você exibiu sua primeira mensagem no console.',
    errorMessage: '❌ Confira a chamada: use `console.log("Pronto para codar!")`.',
  },

  // Aula 4: Variáveis: Guardando Valores na Memória
  {
    id: 'challenge-4',
    slug: '4',
    number: '#4',
    title: 'Guardando um Nome com let',
    subtitle: 'Variáveis na Memória • Aula 4',
    difficulty: 'Fácil',
    xp: 45,
    type: 'code',
    prompt: 'Declare uma variável com `let` chamada `aluno` guardando o texto `"Ana"`.',
    placeholder: 'let aluno = "Ana"',
    validationPattern: /let\s+aluno\s*=\s*['"`]Ana['"`]\s*;?/i,
    requiredKeyword: 'let aluno',
    successMessage: '🎉 Perfeito! A variável `aluno` foi criada na memória.',
    errorMessage: '❌ Use `let aluno = "Ana"` para guardar o texto na variável.',
  },

  // Aula 5: let vs const Sem Confusão
  {
    id: 'challenge-5',
    slug: '5',
    number: '#5',
    title: 'Valor Fixo com const',
    subtitle: 'let vs const • Aula 5',
    difficulty: 'Fácil',
    xp: 50,
    type: 'code',
    prompt: 'Declare uma constante chamada `ANO_ATUAL` com o valor numérico `2026`.',
    placeholder: 'const ANO_ATUAL = 2026',
    validationPattern: /const\s+ANO_ATUAL\s*=\s*2026\s*;?/i,
    requiredKeyword: 'const ANO_ATUAL',
    successMessage: '🎉 Excelente! Valores fixos ficam bem protegidos com `const`.',
    errorMessage: '❌ Use `const ANO_ATUAL = 2026` para criar a constante.',
  },

  // Aula 6: Tipos de Dados: Textos, Números e Booleanos
  {
    id: 'challenge-6',
    slug: '6',
    number: '#6',
    title: 'Tipos Primitivos no JS',
    subtitle: 'Tipos de Dados • Aula 6',
    difficulty: 'Iniciante',
    xp: 45,
    type: 'quiz',
    prompt: 'Quais são os tipos de valores em `const nome = "Lucas"`, `const pontos = 10` e `const ativo = true`?',
    options: [
      { id: 'a', text: 'a) string, number e boolean, respectivamente.' },
      { id: 'b', text: 'b) number, string e array, respectivamente.' },
      { id: 'c', text: 'c) boolean, string e number, respectivamente.' },
    ],
    correctOptionId: 'a',
    successMessage: '🎉 Exato! Texto é string, número é number e verdadeiro/falso é boolean.',
    errorMessage: '❌ Revise cada valor: `"Lucas"` é texto (string), `10` é número (number) e `true` é booleano (boolean).',
  },

  // Aula 7: Contas e Operadores Matemáticos
  {
    id: 'challenge-7',
    slug: '7',
    number: '#7',
    title: 'Calculando com Operadores',
    subtitle: 'Operadores Matemáticos • Aula 7',
    difficulty: 'Fácil',
    xp: 50,
    type: 'code',
    prompt: 'Crie uma constante `total` somando `15` e `25` (`15 + 25`).',
    placeholder: 'const total = 15 + 25',
    validationPattern: /const\s+total\s*=\s*15\s*\+\s*25\s*;?/i,
    requiredKeyword: 'total',
    successMessage: '🎉 Boa! Operação matemática feita com sucesso.',
    errorMessage: '❌ Escreva algo como `const total = 15 + 25`.',
  },

  // Aula 8: Comparações e Valores Booleanos
  {
    id: 'challenge-8',
    slug: '8',
    number: '#8',
    title: 'Comparação Estrita com ===',
    subtitle: 'Comparações • Aula 8',
    difficulty: 'Fácil',
    xp: 55,
    type: 'code',
    prompt: 'Crie uma constante `ehIgual` que compare estritamente (`===`) se `idade` é igual a `18`.',
    placeholder: 'const ehIgual = idade === 18',
    validationPattern: /const\s+ehIgual\s*=\s*idade\s*===\s*18\s*;?/i,
    requiredKeyword: '===',
    successMessage: '🎉 Muito bem! `===` compara valor e tipo sem surpresas.',
    errorMessage: '❌ Use `const ehIgual = idade === 18` para fazer a comparação estrita.',
  },

  // Aula 9: Operadores Lógicos: E (&&), OU (||) e NÃO (!)
  {
    id: 'challenge-9',
    slug: '9',
    number: '#9',
    title: 'Combinando Condições com &&',
    subtitle: 'Operadores Lógicos • Aula 9',
    difficulty: 'Médio',
    xp: 65,
    type: 'code',
    prompt: 'Crie uma constante `podeEntrar` verificando se `temIngresso` E (`&&`) `maiorDeIdade` são verdadeiros.',
    placeholder: 'const podeEntrar = temIngresso && maiorDeIdade',
    validationPattern: /const\s+podeEntrar\s*=\s*temIngresso\s*&&\s*maiorDeIdade\s*;?/i,
    requiredKeyword: '&&',
    successMessage: '🎉 Perfeito! Com `&&`, ambas as condições precisam ser verdadeiras.',
    errorMessage: '❌ Combine as duas variáveis usando `&&`: `const podeEntrar = temIngresso && maiorDeIdade`.',
  },

  // Aula 10: Decisões com if e else
  {
    id: 'challenge-10',
    slug: '10',
    number: '#10',
    title: 'Decisão com if e else',
    subtitle: 'Condicionais • Aula 10',
    difficulty: 'Médio',
    xp: 70,
    type: 'code',
    prompt: 'Escreva um `if` / `else` verificando `nota >= 7`: se verdadeiro, exiba `"Aprovado"`; senão, exiba `"Refazer"`.',
    placeholder: 'if (nota >= 7) {\n  console.log("Aprovado")\n} else {\n  console.log("Refazer")\n}',
    validationPattern: /if\s*\(\s*nota\s*>=\s*7\s*\)\s*\{[\s\S]*\}\s*else\s*\{[\s\S]*\}/i,
    requiredKeyword: 'else',
    successMessage: '🎉 Mandou muito! Seu código agora escolhe caminhos diferentes.',
    errorMessage: '❌ Inclua um bloco `if (nota >= 7) { ... }` seguido de `else { ... }`.',
  },

  // Aula 11: Escolhas Múltiplas com switch
  {
    id: 'challenge-11',
    slug: '11',
    number: '#11',
    title: 'Casos Exatos com switch',
    subtitle: 'Escolhas Múltiplas • Aula 11',
    difficulty: 'Médio',
    xp: 75,
    type: 'code',
    prompt: 'Escreva um `switch (cor)` com pelo menos um `case` e um `default`.',
    placeholder: 'switch (cor) {\n  case "verde":\n    console.log("Siga")\n    break\n  default:\n    console.log("Atenção")\n}',
    validationPattern: /switch\s*\(\s*cor\s*\)\s*\{[\s\S]*case\s+[\s\S]*default\s*:[\s\S]*\}/i,
    requiredKeyword: 'switch',
    successMessage: '🎉 Boa! `switch` deixa vários casos exatos bem organizados.',
    errorMessage: '❌ Use `switch (cor)` com pelo menos um `case` e um `default:`.',
  },

  // Aula 12: Repetição com while
  {
    id: 'challenge-12',
    slug: '12',
    number: '#12',
    title: 'Repetindo com while',
    subtitle: 'Laço while • Aula 12',
    difficulty: 'Médio',
    xp: 75,
    type: 'code',
    prompt: 'Escreva um laço `while (contador < 5)` que incremente `contador` dentro do bloco.',
    placeholder: 'while (contador < 5) {\n  contador++\n}',
    validationPattern: /while\s*\(\s*contador\s*<\s*5\s*\)\s*\{[\s\S]*contador[\s\S]*\}/i,
    requiredKeyword: 'while',
    successMessage: '🎉 Show! Lembre-se sempre de atualizar a condição para evitar loop infinito.',
    errorMessage: '❌ Escreva `while (contador < 5) { ... }` atualizando `contador` lá dentro.',
  },

  // Aula 13: Contagens com for
  {
    id: 'challenge-13',
    slug: '13',
    number: '#13',
    title: 'Contagem Controlada com for',
    subtitle: 'Laço for • Aula 13',
    difficulty: 'Médio',
    xp: 80,
    type: 'code',
    prompt: 'Escreva um `for` iniciando `let i = 0`, enquanto `i < 3`, incrementando `i++` e exibindo `i` no console.',
    placeholder: 'for (let i = 0; i < 3; i++) {\n  console.log(i)\n}',
    validationPattern: /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*3\s*;\s*i\+\+\s*\)\s*\{[\s\S]*console\.log\s*\(\s*i\s*\)[\s\S]*\}/i,
    requiredKeyword: 'for',
    successMessage: '🎉 Excelente! O `for` reúne início, condição e passo no mesmo lugar.',
    errorMessage: '❌ Siga o formato `for (let i = 0; i < 3; i++) { console.log(i) }`.',
  },

  // Aula 14: Listas com Arrays
  {
    id: 'challenge-14',
    slug: '14',
    number: '#14',
    title: 'Criando uma Lista com Array',
    subtitle: 'Arrays • Aula 14',
    difficulty: 'Fácil',
    xp: 60,
    type: 'code',
    prompt: 'Crie uma constante `linguagens` contendo um array com `"HTML"`, `"CSS"` e `"JS"`.',
    placeholder: 'const linguagens = ["HTML", "CSS", "JS"]',
    validationPattern: /const\s+linguagens\s*=\s*\[\s*['"`]HTML['"`]\s*,\s*['"`]CSS['"`]\s*,\s*['"`]JS['"`]\s*\]\s*;?/i,
    requiredKeyword: 'linguagens',
    successMessage: '🎉 Boa! Arrays guardam listas ordenadas começando no índice 0.',
    errorMessage: '❌ Use colchetes `[]`: `const linguagens = ["HTML", "CSS", "JS"]`.',
  },

  // Aula 15: Alterando e Percorrendo Arrays com for
  {
    id: 'challenge-15',
    slug: '15',
    number: '#15',
    title: 'Adicionando Item com .push()',
    subtitle: 'Manipulando Arrays • Aula 15',
    difficulty: 'Médio',
    xp: 80,
    type: 'code',
    prompt: 'Adicione `"TS"` ao final do array `linguagens` usando `.push()`.',
    placeholder: 'linguagens.push("TS")',
    validationPattern: /linguagens\.push\s*\(\s*['"`]TS['"`]\s*\)\s*;?/i,
    requiredKeyword: '.push(',
    successMessage: '🎉 Muito bem! `.push()` adiciona novos elementos ao fim do array.',
    errorMessage: '❌ Use `linguagens.push("TS")` para adicionar ao final da lista.',
  },

  // Aula 16: Funções: Reutilizando Blocos de Código
  {
    id: 'challenge-16',
    slug: '16',
    number: '#16',
    title: 'Função que Retorna o Dobro',
    subtitle: 'Funções • Aula 16',
    difficulty: 'Médio',
    xp: 85,
    type: 'code',
    prompt: 'Crie uma função `dobrar(numero)` que retorne `numero * 2`.',
    placeholder: 'function dobrar(numero) {\n  return numero * 2\n}',
    validationPattern: /function\s+dobrar\s*\(\s*numero\s*\)\s*\{[\s\S]*return\s+numero\s*\*\s*2[\s\S]*\}/i,
    requiredKeyword: 'function dobrar',
    successMessage: '🎉 Show! Funções evitam repetição e deixam o código reutilizável.',
    errorMessage: '❌ Defina `function dobrar(numero) { return numero * 2 }`.',
  },

  // Aula 17: Objetos: Organizando Dados com Propriedades
  {
    id: 'challenge-17',
    slug: '17',
    number: '#17',
    title: 'Objeto de Perfil',
    subtitle: 'Objetos • Aula 17',
    difficulty: 'Médio',
    xp: 90,
    type: 'code',
    prompt: 'Crie uma constante `perfil` com as propriedades `nome: "João"` e `nivel: 1`.',
    placeholder: 'const perfil = {\n  nome: "João",\n  nivel: 1\n}',
    validationPattern: /const\s+perfil\s*=\s*\{[\s\S]*nome\s*:\s*['"`]João['"`][\s\S]*nivel\s*:\s*1[\s\S]*\}\s*;?/i,
    requiredKeyword: 'perfil',
    successMessage: '🎉 Perfeito! Objetos agrupam informações relacionadas em chave e valor.',
    errorMessage: '❌ Crie `const perfil = { nome: "João", nivel: 1 }`.',
  },

  // Aula 18: Mini-Projeto: Integrando Tudo do Módulo 1
  {
    id: 'challenge-18',
    slug: '18',
    number: '#18',
    title: 'Fechamento do Módulo 1: Resumo em Função',
    subtitle: 'Mini-Projeto Integrador • Aula 18',
    difficulty: 'Difícil',
    xp: 120,
    type: 'code',
    prompt: 'Crie uma função `resumoAluno(nome, pontos)` que use `if` (`pontos >= 50` retorna `"Aprovado"` ou exiba `"Aprovado"`).',
    placeholder: 'function resumoAluno(nome, pontos) {\n  if (pontos >= 50) {\n    return nome + " - Aprovado"\n  }\n  return nome + " - Em andamento"\n}',
    validationPattern: /function\s+resumoAluno\s*\(\s*nome\s*,\s*pontos\s*\)\s*\{[\s\S]*if\s*\(\s*pontos\s*>=\s*50\s*\)[\s\S]*\}/i,
    requiredKeyword: 'resumoAluno',
    successMessage: '🏆 Parabéns! Você conectou funções e condições para fechar o Módulo 1 com chave de ouro!',
    errorMessage: '❌ Crie `function resumoAluno(nome, pontos)` com uma verificação `if (pontos >= 50)`.',
  },
]