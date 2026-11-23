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
  // Módulo 1 • Aula 1: Como o Computador Segue Instruções
  {
    id: 'challenge-1',
    slug: '1',
    number: '#1',
    title: 'Ordem que Muda Tudo',
    subtitle: 'Módulo 1 • Aula 1',
    difficulty: 'Iniciante',
    xp: 30,
    type: 'quiz',
    prompt:
      'Você monta o fluxo de um caixa de mercado, mas coloca "cobrar o cartão" antes de "somar os itens". O que acontece na prática?',
    options: [
      { id: 'a', text: 'a) O sistema dá um jeito e soma os itens depois de cobrar.' },
      { id: 'b', text: 'b) O fluxo quebra ou cobra errado porque depende de algo que ainda não aconteceu.' },
      { id: 'c', text: 'c) O computador troca a ordem sozinho para evitar erro.' },
    ],
    correctOptionId: 'b',
    successMessage: '🎉 Isso aí! A máquina não improvisa: se a ordem falha, o fluxo sente.',
    errorMessage: '❌ Pense na sequência real: sem somar antes, cobrar na frente não faz sentido.',
  },

  // Módulo 1 • Aula 2: Condições no Dia a Dia e Regras de Decisão
  {
    id: 'challenge-2',
    slug: '2',
    number: '#2',
    title: 'Entrada, Processamento e Saída',
    subtitle: 'Módulo 1 • Aula 2',
    difficulty: 'Iniciante',
    xp: 35,
    type: 'quiz',
    prompt:
      'Num app de entrega, o usuário informa o endereço e a taxa de entrega é calculada com base na distância. O que é o "Processamento"?',
    options: [
      { id: 'a', text: 'a) O endereço que a pessoa digitou na tela.' },
      { id: 'b', text: 'b) A conta que calcula o valor da entrega a partir dos dados recebidos.' },
      { id: 'c', text: 'c) O botão de confirmar o pedido.' },
    ],
    correctOptionId: 'b',
    successMessage: '🎉 Mandou bem! Processamento é o que transforma a entrada no resultado.',
    errorMessage: '❌ Repare no papel de cada parte: o cálculo é o que trabalha os dados recebidos.',
  },

  // Módulo 1 • Aula 3: Decompondo Problemas em Etapas
  {
    id: 'challenge-3',
    slug: '3',
    number: '#3',
    title: 'Mostrando Resposta no Console',
    subtitle: 'Módulo 1 • Aula 3',
    difficulty: 'Fácil',
    xp: 40,
    type: 'code',
    prompt:
      'Você quer conferir se o código está rodando direitinho. Use `console.log()` para mostrar `"Tudo certo por aqui"` no console.',
    placeholder: 'console.log("Tudo certo por aqui")',
    validationPattern: /console\.log\s*\(\s*['"`]Tudo certo por aqui['"`]\s*\)\s*;?/i,
    requiredKeyword: 'console.log',
    successMessage: '🎉 Boa! O console é o seu espelho rápido para ver o que o código está fazendo.',
    errorMessage: '❌ Confira a chamada: use `console.log("Tudo certo por aqui")` com aspas.',
  },

  // Módulo 2 • Aula 4: Variáveis, const e let: Guardando Valores
  {
    id: 'challenge-4',
    slug: '4',
    number: '#4',
    title: 'Guardando Pontuação Inicial',
    subtitle: 'Módulo 2 • Aula 4',
    difficulty: 'Fácil',
    xp: 40,
    type: 'code',
    prompt:
      'Crie uma variável chamada `pontos` usando `let` e atribua o valor `0` a ela.',
    placeholder: 'let pontos = 0',
    validationPattern: /\blet\s+pontos\s*=\s*0\s*;?/i,
    requiredKeyword: 'pontos',
    successMessage: '🎉 Mandou bem! Usar `let` faz sentido quando o valor pode mudar depois.',
    errorMessage: '❌ Revise a sintaxe: declare `let pontos = 0`.',
  },

  // Módulo 2 • Aula 5: Tipos de Dados e Operações: Textos, Números e Booleanos
  {
    id: 'challenge-5',
    slug: '5',
    number: '#5',
    title: 'Texto vs. Número',
    subtitle: 'Módulo 2 • Aula 5',
    difficulty: 'Fácil',
    xp: 40,
    type: 'quiz',
    prompt:
      'Em JavaScript, qual é a diferença entre `"10"` (entre aspas) e `10` (sem aspas)?',
    options: [
      { id: 'a', text: 'a) Nenhuma, os dois funcionam exatamente igual em qualquer conta.' },
      { id: 'b', text: 'b) `"10"` é texto (`string`) e `10` é número (`number`), o que muda operações.' },
      { id: 'c', text: 'c) `10` sem aspas vira `boolean` automaticamente.' },
    ],
    correctOptionId: 'b',
    successMessage: '🎉 Exato! Aspas transformam o conteúdo em texto e podem mudar o resultado de operações.',
    errorMessage: '❌ Repare no tipo: aspas indicam texto (`string`), sem aspas é número (`number`).',
  },

  // Módulo 2 • Aula 6: Comparações: Produzindo true ou false
  {
    id: 'challenge-6',
    slug: '6',
    number: '#6',
    title: 'Comparação Estrita de Igualdade',
    subtitle: 'Módulo 2 • Aula 6',
    difficulty: 'Fácil',
    xp: 45,
    type: 'code',
    prompt:
      'Escreva uma comparação estrita (`===`) verificando se `idade` é igual a `18`.',
    placeholder: 'idade === 18',
    validationPattern: /idade\s*===\s*18/i,
    requiredKeyword: '===',
    successMessage: '🎉 Isso aí! O operador `===` compara valor e tipo sem surpresas.',
    errorMessage: '❌ Use `===` para comparar `idade` com `18` de forma estrita.',
  },

  // Módulo 2 • Aula 7: Operadores Lógicos: Combinando Regras com &&, || e !
  {
    id: 'challenge-7',
    slug: '7',
    number: '#7',
    title: 'Duas Condições ao Mesmo Tempo',
    subtitle: 'Módulo 2 • Aula 7',
    difficulty: 'Médio',
    xp: 45,
    type: 'code',
    prompt:
      'Escreva uma expressão usando `&&` que verifique se `temIngresso` E `idadeMaiorQue16` são verdadeiros.',
    placeholder: 'temIngresso && idadeMaiorQue16',
    validationPattern: /temIngresso\s*&&\s*idadeMaiorQue16/i,
    requiredKeyword: '&&',
    successMessage: '🎉 Boa! Com `&&`, ambos os lados precisam ser verdadeiros.',
    errorMessage: '❌ Combine `temIngresso` e `idadeMaiorQue16` usando o operador `&&`.',
  },

  // Módulo 2 • Aula 8: Prática Combinada de Dados e Regras
  {
    id: 'challenge-8',
    slug: '8',
    number: '#8',
    title: 'Regra de Desconto ou VIP',
    subtitle: 'Módulo 2 • Aula 8',
    difficulty: 'Médio',
    xp: 50,
    type: 'quiz',
    prompt:
      'Uma loja dá benefício se `(total >= 100 && !bloqueado) || ehVip`. Se `total` é `50`, `bloqueado` é `false` e `ehVip` é `true`, o resultado final é:',
    options: [
      { id: 'a', text: 'a) `true`, porque `ehVip` é verdadeiro e o `||` libera o caminho.' },
      { id: 'b', text: 'b) `false`, porque `total` é menor que `100`.' },
      { id: 'c', text: 'c) `undefined`, por misturar comparação com booleano.' },
    ],
    correctOptionId: 'a',
    successMessage: '🎉 Mandou muito! Como `ehVip` é `true`, o `||` faz a expressão inteira resultar em `true`.',
    errorMessage: '❌ Lembre como `||` funciona: se um lado já é `true`, o resultado final é `true`.',
  },

  // Módulo 3 • Aula 9: Decisões com if, else if e else: Direcionando o Fluxo
  {
    id: 'challenge-9',
    slug: '9',
    number: '#9',
    title: 'Escolhendo Caminho com if',
    subtitle: 'Módulo 3 • Aula 9',
    difficulty: 'Fácil',
    xp: 45,
    type: 'code',
    prompt:
      'Escreva um bloco `if` verificando se `saldo > 0` e mostrando `"Saldo positivo"` com `console.log`.',
    placeholder: 'if (saldo > 0) { console.log("Saldo positivo") }',
    validationPattern: /if\s*\(\s*saldo\s*>\s*0\s*\)\s*\{[\s\S]*console\.log\s*\(\s*['"`]Saldo positivo['"`]\s*\)\s*;?[\s\S]*\}/i,
    requiredKeyword: 'if',
    successMessage: '🎉 Show! O `if` direciona o fluxo apenas quando a condição passa.',
    errorMessage: '❌ Confira a estrutura: `if (saldo > 0) { console.log("Saldo positivo") }`.',
  },

  // Módulo 3 • Aula 10: Loops com for e while: Repetindo com Segurança
  {
    id: 'challenge-10',
    slug: '10',
    number: '#10',
    title: 'Evitando Loop Infinito',
    subtitle: 'Módulo 3 • Aula 10',
    difficulty: 'Médio',
    xp: 50,
    type: 'quiz',
    prompt:
      'Em um loop `while (contador < 5)`, o que acontece se você esquecer de atualizar `contador` dentro do bloco?',
    options: [
      { id: 'a', text: 'a) O JavaScript para sozinho após 5 repetições.' },
      { id: 'b', text: 'b) A condição nunca muda para `false` e o programa trava em loop infinito.' },
      { id: 'c', text: 'c) `contador` vira `0` automaticamente.' },
    ],
    correctOptionId: 'b',
    successMessage: '🎉 Isso mesmo! Sem atualização que aproxime a condição da parada, o loop não encerra.',
    errorMessage: '❌ Pense na condição: se `contador` não muda, ela continua verdadeira para sempre.',
  },

  // Módulo 3 • Aula 11: Arrays e Acesso por Índice: Listas em Ordem
  {
    id: 'challenge-11',
    slug: '11',
    number: '#11',
    title: 'Primeiro Item do Array',
    subtitle: 'Módulo 3 • Aula 11',
    difficulty: 'Fácil',
    xp: 45,
    type: 'code',
    prompt:
      'Dado um array `tarefas`, acesse e exiba o primeiro item usando `console.log(tarefas[0])`.',
    placeholder: 'console.log(tarefas[0])',
    validationPattern: /console\.log\s*\(\s*tarefas\s*\[\s*0\s*\]\s*\)\s*;?/i,
    requiredKeyword: 'tarefas[0]',
    successMessage: '🎉 Certinho! Em JavaScript, a contagem de índices de array começa em `0`.',
    errorMessage: '❌ Lembre que o primeiro elemento fica no índice `0`: `console.log(tarefas[0])`.',
  },

  // Módulo 3 • Aula 12: Percorrendo Listas e Tomando Decisões
  {
    id: 'challenge-12',
    slug: '12',
    number: '#12',
    title: 'Tamanho da Lista com .length',
    subtitle: 'Módulo 3 • Aula 12',
    difficulty: 'Médio',
    xp: 50,
    type: 'code',
    prompt:
      'Escreva o início de um `for` que percorra `notas` do índice `0` até `notas.length` incrementando `i++`.',
    placeholder: 'for (let i = 0; i < notas.length; i++) {}',
    validationPattern: /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*notas\.length\s*;\s*i\+\+\s*\)/i,
    requiredKeyword: 'notas.length',
    successMessage: '🎉 Mandou bem! `i < notas.length` percorre todos os itens sem estourar o limite.',
    errorMessage: '❌ Confira o laço: `for (let i = 0; i < notas.length; i++)`.',
  },

  // Módulo 4 • Aula 13: Funções: Parâmetros e return
  {
    id: 'challenge-13',
    slug: '13',
    number: '#13',
    title: 'Função que Devolve Soma',
    subtitle: 'Módulo 4 • Aula 13',
    difficulty: 'Médio',
    xp: 55,
    type: 'code',
    prompt:
      'Crie uma função chamada `somar` que receba `(a, b)` e retorne `a + b` com `return`.',
    placeholder: 'function somar(a, b) { return a + b }',
    validationPattern: /function\s+somar\s*\(\s*a\s*,\s*b\s*\)\s*\{[\s\S]*return\s+a\s*\+\s*b\s*;?[\s\S]*\}/i,
    requiredKeyword: 'return',
    successMessage: '🎉 Boa! `return` devolve o resultado da função para quem chamou.',
    errorMessage: '❌ Inclua `function somar(a, b)` e `return a + b` dentro das chaves.',
  },

  // Módulo 4 • Aula 14: Objetos: Chave, Valor e Atualização
  {
    id: 'challenge-14',
    slug: '14',
    number: '#14',
    title: 'Criando um Objeto Simples',
    subtitle: 'Módulo 4 • Aula 14',
    difficulty: 'Médio',
    xp: 55,
    type: 'code',
    prompt:
      'Crie uma constante `aluno` com a propriedade `nome` valendo `"Ana"`.',
    placeholder: 'const aluno = { nome: "Ana" }',
    validationPattern: /\bconst\s+aluno\s*=\s*\{\s*nome\s*:\s*['"`]Ana['"`]\s*,?\s*\}\s*;?/i,
    requiredKeyword: 'aluno',
    successMessage: '🎉 Perfeito! Objetos agrupam dados relacionados usando pares de chave e valor.',
    errorMessage: '❌ Confira a estrutura do objeto: `const aluno = { nome: "Ana" }`.',
  },

  // Módulo 4 • Aula 15: Funções Trabalhando com Objetos e Arrays
  {
    id: 'challenge-15',
    slug: '15',
    number: '#15',
    title: 'Acessando Propriedade dentro de Função',
    subtitle: 'Módulo 4 • Aula 15',
    difficulty: 'Médio',
    xp: 60,
    type: 'quiz',
    prompt:
      'Você cria `function exibirPreco(item) { return item.preco }`. Se passar `{ nome: "Caderno", preco: 25 }`, o que ela retorna?',
    options: [
      { id: 'a', text: 'a) `25`, acessando a propriedade `preco` do objeto recebido.' },
      { id: 'b', text: 'b) `"Caderno"`, porque é a primeira propriedade do objeto.' },
      { id: 'c', text: 'c) `NaN`, porque o objeto não foi declarado fora da função.' },
    ],
    correctOptionId: 'a',
    successMessage: '🎉 Isso aí! A função acessa `item.preco` sobre o objeto passado como argumento.',
    errorMessage: '❌ Veja o `return`: ele devolve exatamente `item.preco`, que vale `25`.',
  },

  // Módulo 4 • Aula 16: Projeto Integrador da Base: Resumo de Pedidos
  {
    id: 'challenge-16',
    slug: '16',
    number: '#16',
    title: 'Resumo de Pedidos com Função',
    subtitle: 'Módulo 4 • Aula 16',
    difficulty: 'Difícil',
    xp: 75,
    type: 'code',
    prompt:
      'Crie uma função chamada `resumirPedido` que receba `pedidos` e retorne `pedidos.length` usando `return`.',
    placeholder: 'function resumirPedido(pedidos) { return pedidos.length }',
    validationPattern: /function\s+resumirPedido\s*\(\s*pedidos\s*\)\s*\{[\s\S]*return\s+pedidos\.length\s*;?[\s\S]*\}/i,
    requiredKeyword: 'resumirPedido',
    successMessage: '🏆 Mandou muito! Você fechou a trilha integrando função, array e retorno de resultado.',
    errorMessage: '❌ Confira a assinatura e o retorno: `function resumirPedido(pedidos) { return pedidos.length }`.',
  },
]