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
  hint?: string
  options?: { id: string; text: string }[]
  correctOptionId?: string
  placeholder?: string
  validationPattern?: RegExp
  requiredKeyword?: string
  successMessage: string
  errorMessage: string
}

export const ARENA_CHALLENGES: ArenaChallenge[] = [
  // Módulo 1 • Aula 1: Como o Código Pensa: Sequência e Ordem
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
      {
        id: 'a',
        text: 'a) O sistema dá um jeito e soma os itens depois de cobrar.',
      },
      {
        id: 'b',
        text: 'b) O fluxo quebra ou cobra errado porque depende de algo que ainda não aconteceu.',
      },
      {
        id: 'c',
        text: 'c) O computador troca a ordem sozinho para evitar erro.',
      },
    ],
    correctOptionId: 'b',
    successMessage:
      '🎉 Isso aí! A máquina não improvisa: se a ordem falha, o fluxo sente.',
    errorMessage:
      '❌ Pense na sequência real: sem somar antes, cobrar na frente não faz sentido.',
  },

  // Módulo 1 • Aula 2: Condições no Dia a Dia: Se Isso, Faça Aquilo
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
      {
        id: 'b',
        text: 'b) A conta que calcula o valor da entrega a partir dos dados recebidos.',
      },
      { id: 'c', text: 'c) O botão de confirmar o pedido.' },
    ],
    correctOptionId: 'b',
    successMessage:
      '🎉 Mandou bem! Processamento é o que transforma a entrada no resultado.',
    errorMessage:
      '❌ Repare no papel de cada parte: o cálculo é o que trabalha os dados recebidos.',
  },

  // Módulo 1 • Aula 3: Decomposição e Resolução de Problemas
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
      'Você quer conferir se a etapa de saída está rodando direitinho. Use `console.log()` para mostrar `"Tudo certo por aqui"` no console.',
    hint: 'Escreva console.log("Tudo certo por aqui") exatamente com esse texto.',
    placeholder: 'console.log("Tudo certo por aqui")',
    validationPattern:
      /console\.log\s*\(\s*["'`]Tudo certo por aqui["'`]\s*\)\s*;?/i,
    requiredKeyword: 'console.log',
    successMessage:
      '🎉 Boa! O console é o seu espelho rápido para ver o resultado de cada etapa.',
    errorMessage:
      '❌ Confira a chamada: use `console.log("Tudo certo por aqui")` com aspas.',
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
    hint: 'Use a palavra-chave let, o nome pontos e = 0.',
    placeholder: 'let pontos = 0',
    validationPattern: /\blet\s+pontos\s*=\s*0\s*;?/i,
    requiredKeyword: 'pontos',
    successMessage:
      '🎉 Mandou bem! Usar `let` faz sentido quando o valor pode mudar depois.',
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
      {
        id: 'a',
        text: 'a) Nenhuma, os dois funcionam exatamente igual em qualquer conta.',
      },
      {
        id: 'b',
        text: 'b) `"10"` é texto (`string`) e `10` é número (`number`), o que muda operações como `+`.',
      },
      {
        id: 'c',
        text: 'c) `10` sem aspas vira `boolean` automaticamente.',
      },
    ],
    correctOptionId: 'b',
    successMessage:
      '🎉 Exato! Aspas transformam o conteúdo em texto e podem mudar o resultado de operações.',
    errorMessage:
      '❌ Repare no tipo: aspas indicam texto (`string`), sem aspas é número (`number`).',
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
    hint: 'Use três sinais de igual (===) entre idade e 18.',
    placeholder: 'idade === 18',
    validationPattern: /idade\s*===\s*18/i,
    requiredKeyword: '===',
    successMessage:
      '🎉 Isso aí! O operador `===` compara valor e tipo sem surpresas.',
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
    hint: 'Escreva temIngresso && idadeMaiorQue16.',
    placeholder: 'temIngresso && idadeMaiorQue16',
    validationPattern: /temIngresso\s*&&\s*idadeMaiorQue16/i,
    requiredKeyword: '&&',
    successMessage:
      '🎉 Boa! Com `&&`, ambos os lados precisam ser verdadeiros.',
    errorMessage:
      '❌ Combine `temIngresso` e `idadeMaiorQue16` usando o operador `&&`.',
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
      {
        id: 'a',
        text: 'a) `true`, porque `ehVip` é verdadeiro e o `||` libera o caminho.',
      },
      { id: 'b', text: 'b) `false`, porque `total` é menor que `100`.' },
      {
        id: 'c',
        text: 'c) `undefined`, por misturar comparação com booleano.',
      },
    ],
    correctOptionId: 'a',
    successMessage:
      '🎉 Mandou muito! Como `ehVip` é `true`, o `||` faz a expressão inteira resultar em `true`.',
    errorMessage:
      '❌ Lembre como `||` funciona: se um lado já é `true`, o resultado final é `true`.',
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
    hint: 'Estrutura: if (saldo > 0) { console.log("Saldo positivo") }',
    placeholder: 'if (saldo > 0) { console.log("Saldo positivo") }',
    validationPattern:
      /if\s*\(\s*saldo\s*>\s*0\s*\)\s*\{[\s\S]*console\.log\s*\(\s*["'`]Saldo positivo["'`]\s*\)\s*;?[\s\S]*\}/i,
    requiredKeyword: 'saldo > 0',
    successMessage:
      '🎉 Show! O `if` direciona o fluxo apenas quando a condição passa.',
    errorMessage:
      '❌ Confira a estrutura: `if (saldo > 0) { console.log("Saldo positivo") }`.',
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
      {
        id: 'b',
        text: 'b) A condição nunca muda para `false` e o programa trava em loop infinito.',
      },
      { id: 'c', text: 'c) `contador` vira `0` automaticamente.' },
    ],
    correctOptionId: 'b',
    successMessage:
      '🎉 Isso mesmo! Sem atualização que aproxime a condição da parada, o loop não encerra.',
    errorMessage:
      '❌ Pense na condição: se `contador` não muda, ela continua verdadeira para sempre.',
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
    hint: 'Use tarefas[0] dentro de console.log(...).',
    placeholder: 'console.log(tarefas[0])',
    validationPattern: /console\.log\s*\(\s*tarefas\s*\[\s*0\s*\]\s*\)\s*;?/i,
    requiredKeyword: 'tarefas[0]',
    successMessage:
      '🎉 Certinho! Em JavaScript, a contagem de índices de array começa em `0`.',
    errorMessage:
      '❌ Lembre que o primeiro elemento fica no índice `0`: `console.log(tarefas[0])`.',
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
    hint: 'Use for (let i = 0; i < notas.length; i++)',
    placeholder: 'for (let i = 0; i < notas.length; i++) {}',
    validationPattern:
      /for\s*\(\s*(?:let|var)\s+i\s*=\s*0\s*;\s*i\s*<\s*notas\.length\s*;\s*i\+\+\s*\)/i,
    requiredKeyword: 'notas.length',
    successMessage:
      '🎉 Mandou bem! `i < notas.length` percorre todos os itens sem estourar o limite.',
    errorMessage:
      '❌ Confira o laço: `for (let i = 0; i < notas.length; i++)`.',
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
    hint: 'Use function somar(a, b) e dentro dela return a + b.',
    placeholder: 'function somar(a, b) { return a + b }',
    validationPattern:
      /function\s+somar\s*\(\s*a\s*,\s*b\s*\)\s*\{[\s\S]*return\s+a\s*\+\s*b\s*;?[\s\S]*\}/i,
    requiredKeyword: 'somar',
    successMessage:
      '🎉 Boa! `return` devolve o resultado da função para quem chamou.',
    errorMessage:
      '❌ Inclua `function somar(a, b)` e `return a + b` dentro das chaves.',
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
    hint: 'Use const aluno = { nome: "Ana" }.',
    placeholder: 'const aluno = { nome: "Ana" }',
    validationPattern:
      /\bconst\s+aluno\s*=\s*\{\s*nome\s*:\s*["'`]Ana["'`]\s*,?\s*\}\s*;?/i,
    requiredKeyword: 'nome',
    successMessage:
      '🎉 Perfeito! Objetos agrupam dados relacionados usando pares de chave e valor.',
    errorMessage:
      '❌ Confira a estrutura do objeto: `const aluno = { nome: "Ana" }`.',
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
      {
        id: 'a',
        text: 'a) `25`, acessando a propriedade `preco` do objeto recebido.',
      },
      {
        id: 'b',
        text: 'b) `"Caderno"`, porque é a primeira propriedade do objeto.',
      },
      {
        id: 'c',
        text: 'c) `NaN`, porque o objeto não foi declarado fora da função.',
      },
    ],
    correctOptionId: 'a',
    successMessage:
      '🎉 Isso aí! A função acessa `item.preco` sobre o objeto passado como argumento.',
    errorMessage:
      '❌ Veja o `return`: ele devolve exatamente `item.preco`, que vale `25`.',
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
    hint: 'Use function resumirPedido(pedidos) e retorne pedidos.length.',
    placeholder: 'function resumirPedido(pedidos) { return pedidos.length }',
    validationPattern:
      /function\s+resumirPedido\s*\(\s*pedidos\s*\)\s*\{[\s\S]*return\s+pedidos\.length\s*;?[\s\S]*\}/i,
    requiredKeyword: 'resumirPedido',
    successMessage:
      '🏆 Mandou muito! Você fechou a base integrando função, array e retorno de resultado.',
    errorMessage:
      '❌ Confira a assinatura e o retorno: `function resumirPedido(pedidos) { return pedidos.length }`.',
  },

  // Módulo 5 • Aula 17: O que é HTML: Estrutura, Tags, Conteúdo e Inputs
  {
    id: 'challenge-17',
    slug: '17',
    number: '#17',
    title: 'Botão de Ação em HTML',
    subtitle: 'Módulo 5 • Aula 17',
    difficulty: 'Fácil',
    xp: 45,
    type: 'code',
    prompt: 'Escreva uma tag `<button>` com o texto `"Salvar"` dentro.',
    hint: 'Use <button>Salvar</button> (ou com type="button").',
    placeholder: '<button type="button">Salvar</button>',
    validationPattern: /<button(?:\s+[^>]*)?>\s*Salvar\s*<\/button>/i,
    requiredKeyword: '<button',
    successMessage:
      '🎉 Boa! Elementos interativos na página costumam começar com `<button>`.',
    errorMessage: '❌ Escreva uma tag `<button>` contendo o texto `Salvar`.',
  },

  // Módulo 5 • Aula 18: Estrutura e Semântica: header, main, section, article e div
  {
    id: 'challenge-18',
    slug: '18',
    number: '#18',
    title: 'Semântica da Página',
    subtitle: 'Módulo 5 • Aula 18',
    difficulty: 'Fácil',
    xp: 45,
    type: 'quiz',
    prompt:
      'Você quer envolver o conteúdo principal da página e usar `<div>` apenas para agrupar caixas sem significado próprio. Qual escolha faz mais sentido?',
    options: [
      {
        id: 'a',
        text: 'a) Usar `<main>` no conteúdo principal e `<div>` apenas para agrupamentos neutros.',
      },
      {
        id: 'b',
        text: 'b) Usar só `<div>` em tudo e evitar tags semânticas.',
      },
      {
        id: 'c',
        text: 'c) Colocar todo o cabeçalho e o rodapé dentro de `<input>`.',
      },
    ],
    correctOptionId: 'a',
    successMessage:
      '🎉 Isso aí! Tags semânticas deixam a estrutura clara e `<div>` fica para agrupamento neutro.',
    errorMessage:
      '❌ Lembre: `<main>` indica o conteúdo principal; `<div>` serve para agrupamentos genéricos.',
  },

  // Módulo 5 • Aula 19: CSS na Prática: Cores, Tipografia e Box Model
  {
    id: 'challenge-19',
    slug: '19',
    number: '#19',
    title: 'Respiro Interno com padding',
    subtitle: 'Módulo 5 • Aula 19',
    difficulty: 'Fácil',
    xp: 50,
    type: 'code',
    prompt: 'Escreva uma regra CSS aplicando `padding: 16px;` em `.card`.',
    hint: 'Use .card { padding: 16px; }',
    placeholder: '.card { padding: 16px; }',
    validationPattern: /\.card\s*\{[\s\S]*padding\s*:\s*16px\s*;?[\s\S]*\}/i,
    requiredKeyword: 'padding',
    successMessage:
      '🎉 Mandou bem! `padding` cria espaço interno entre o conteúdo e a borda.',
    errorMessage: '❌ Confira a regra: `.card { padding: 16px; }`.',
  },

  // Módulo 5 • Aula 20: Layout com Flexbox: Alinhamento, Gap e Responsividade
  {
    id: 'challenge-20',
    slug: '20',
    number: '#20',
    title: 'Ativando Flexbox com Espaço',
    subtitle: 'Módulo 5 • Aula 20',
    difficulty: 'Médio',
    xp: 55,
    type: 'code',
    prompt:
      'Em `.barra`, escreva `display: flex;` e `gap: 12px;` para alinhar e espaçar os itens.',
    hint: 'Inclua display: flex; e gap: 12px; dentro de .barra { ... }.',
    placeholder: '.barra { display: flex; gap: 12px; }',
    validationPattern:
      /\.barra\s*\{[\s\S]*display\s*:\s*flex\s*;?[\s\S]*gap\s*:\s*12px\s*;?[\s\S]*\}/i,
    requiredKeyword: 'flex',
    successMessage:
      '🎉 Show! `display: flex` e `gap` organizam os filhos com espaçamento limpo.',
    errorMessage: '❌ Inclua `display: flex;` e `gap: 12px;` dentro de `.barra`.',
  },

  // Módulo 6 • Aula 21: DOM na Prática: Selecionando e Lendo Elementos
  {
    id: 'challenge-21',
    slug: '21',
    number: '#21',
    title: 'Selecionando Elemento com querySelector',
    subtitle: 'Módulo 6 • Aula 21',
    difficulty: 'Fácil',
    xp: 50,
    type: 'code',
    prompt:
      'Selecione o elemento com id `"titulo"` usando `document.querySelector("#titulo")` e guarde em `const titulo`.',
    hint: 'Use const titulo = document.querySelector("#titulo")',
    placeholder: 'const titulo = document.querySelector("#titulo")',
    validationPattern:
      /\bconst\s+titulo\s*=\s*document\.querySelector\s*\(\s*["'`]#titulo["'`]\s*\)\s*;?/i,
    requiredKeyword: 'querySelector',
    successMessage:
      '🎉 Boa! Guardar a referência em `const` facilita ler ou atualizar o elemento depois.',
    errorMessage: '❌ Confira: `const titulo = document.querySelector("#titulo")`.',
  },

  // Módulo 6 • Aula 22: Eventos na Prática: click, input e submit
  {
    id: 'challenge-22',
    slug: '22',
    number: '#22',
    title: 'Ouvindo Clique com addEventListener',
    subtitle: 'Módulo 6 • Aula 22',
    difficulty: 'Médio',
    xp: 55,
    type: 'code',
    prompt:
      'Registre um evento de `"click"` em `btn` usando `btn.addEventListener("click", () => { ... })`.',
    hint: 'Use btn.addEventListener("click", () => { })',
    placeholder: 'btn.addEventListener("click", () => {})',
    validationPattern:
      /\bbtn\.addEventListener\s*\(\s*["'`]click["'`]\s*,[\s\S]*\)\s*;?/i,
    requiredKeyword: 'addEventListener',
    successMessage:
      '🎉 Isso aí! `addEventListener` conecta a ação do usuário à sua função.',
    errorMessage: '❌ Use `btn.addEventListener("click", () => { ... })`.',
  },

  // Módulo 6 • Aula 23: Atualizando a Tela: textContent e classList
  {
    id: 'challenge-23',
    slug: '23',
    number: '#23',
    title: 'Alternando Classe com classList',
    subtitle: 'Módulo 6 • Aula 23',
    difficulty: 'Fácil',
    xp: 50,
    type: 'code',
    prompt:
      'Alterne a classe `"ativo"` em `card` usando `card.classList.toggle("ativo")`.',
    hint: 'Escreva card.classList.toggle("ativo")',
    placeholder: 'card.classList.toggle("ativo")',
    validationPattern:
      /\bcard\.classList\.toggle\s*\(\s*["'`]ativo["'`]\s*\)\s*;?/i,
    requiredKeyword: 'classList.toggle',
    successMessage:
      '🎉 Mandou bem! `classList.toggle` alterna o estado visual de forma limpa.',
    errorMessage: '❌ Confira: `card.classList.toggle("ativo")`.',
  },

  // Módulo 6 • Aula 24: Projeto Web Integrado: Lista ou Card Interativo
  {
    id: 'challenge-24',
    slug: '24',
    number: '#24',
    title: 'Ciclo da Interface Web',
    subtitle: 'Módulo 6 • Aula 24',
    difficulty: 'Difícil',
    xp: 75,
    type: 'quiz',
    prompt:
      'Ao montar uma lista ou card interativo no navegador, qual sequência representa melhor o fluxo de interação?',
    options: [
      {
        id: 'a',
        text: 'a) Evento do usuário -> atualização dos dados/estado -> atualização da tela.',
      },
      {
        id: 'b',
        text: 'b) Alterar o CSS -> recarregar o servidor -> apagar o HTML.',
      },
      {
        id: 'c',
        text: 'c) Criar uma variável sem ligar a eventos ou elementos.',
      },
    ],
    correctOptionId: 'a',
    successMessage:
      '🏆 Mandou muito! Você fechou a trilha conectando dados, eventos e interface.',
    errorMessage:
      '❌ Pense no fluxo: o evento dispara a mudança nos dados e a tela reflete esse estado.',
  },
]