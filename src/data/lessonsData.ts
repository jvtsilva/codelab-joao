export interface TopicoTeoria {
  titulo: string
  explicacao: string
  imagemUrl?: string
  imagemAlt?: string
}

export interface PerguntaQuiz {
  pergunta: string
  opcoes: string[]
  respostaCorreta: number
  explicacao: string
}

export interface AulaItem {
  id: string
  numero: number
  modulo: number
  titulo: string
  resumo: string
  introducao: {
    objetivo: string
    contexto: string
    imagemUrl?: string
    imagemAlt?: string
  }
  teoria: {
    topicos: TopicoTeoria[]
    exemploCotidiano: string
    exemploCodigo: string
    resumo: string
  }
  pratica: {
    titulo: string
    enunciado: string
    codigoInicial: string
    exemploSolucao?: string
    resultadoEsperado: string
    dica: string
    imagemUrl?: string
    imagemAlt?: string
  }
  quiz: PerguntaQuiz[]
  conclusao: {
    aprendizados: string[]
    reflexao: string
    proximaAulaId: string | null
    imagemUrl?: string
    imagemAlt?: string
  }
}

export const aulasData: AulaItem[] = [
 {
    id: 'lesson-1',
    numero: 1,
    modulo: 1,
    titulo: 'Como o Computador Segue Instruções',
    resumo: 'Entenda o que é programar e como organizar passos na ordem certa.',

    introducao: {
      objetivo: '',
      contexto: '',
      imagemUrl: '/aulas/aula-1/objetivo.jpg',
      imagemAlt: 'Objetivo da aula: criar uma sequência lógica de passos para resolver uma tarefa simples',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Programar',
          explicacao: '',
          imagemUrl: '/aulas/aula-1/programar.jpg',
          imagemAlt: '1. Programar: escrever instruções para o computador executar',
        },
        {
          titulo: '2. Algoritmo',
          explicacao:
            'Sequência organizada de passos para cumprir uma tarefa — como uma receita.',
        },
        {
          titulo: '3. Clareza e ordem',
          explicacao: '',
          imagemUrl: '/aulas/aula-1/clareza-ordem.jpg',
          imagemAlt: '3. Clareza e ordem: passos vagos geram dúvida e passos fora de ordem quebram tudo',
        },
      ],

      exemploCotidiano: '',
      exemploCodigo: '',
      resumo: '',
    },

    pratica: {
      titulo: 'Algoritmo para preparar café',
      enunciado:
        'Organize os passos para fazer um café sem pular etapas importantes. Ajuste ou adicione o que achar necessário.',

      codigoInicial:
        'INÍCIO\n  pegar uma xícara\n  colocar pó no filtro\n  aquecer a água\n  despejar a água\n  servir\nFIM',

      exemploSolucao:
        'INÍCIO\n  pegar xícara e filtro\n  colocar pó no filtro\n  aquecer a água\n  despejar água quente no filtro\n  servir na xícara\nFIM',

      resultadoEsperado:
        'Uma sequência completa e em ordem lógica do início ao fim.',

      dica:
        'Leia de cima para baixo: alguma ação depende de outra antes?',
    },

    quiz: [
      {
        pergunta: 'O que significa programar?',
        opcoes: [
          'Criar instruções para o computador executar tarefas',
          'Fazer o computador adivinhar o que queremos',
          'Escrever qualquer texto na tela',
        ],
        respostaCorreta: 0,
        explicacao:
          'Programar é escrever instruções claras para o computador seguir.',
      },
      {
        pergunta: 'O que é um algoritmo?',
        opcoes: [
          'Uma linguagem de programação',
          'Uma sequência organizada de passos para alcançar um objetivo',
          'Um erro de execução',
        ],
        respostaCorreta: 1,
        explicacao:
          'Algoritmo é a sequência organizada de passos para resolver uma tarefa.',
      },
      {
        pergunta: 'Por que a ordem das instruções é importante?',
        opcoes: [
          'Porque o computador ignora o primeiro passo',
          'Porque algumas ações dependem de outras para funcionar',
          'Apenas para deixar o código mais bonito',
        ],
        respostaCorreta: 1,
        explicacao:
          'Passos fora de ordem quebram o fluxo — como tentar enviar antes de escrever.',
      },
    ],

    conclusao: {
      aprendizados: [],
      reflexao: '',
      imagemUrl: '/aulas/aula-1/resumo-aprendido.jpg',
      imagemAlt: 'O que você aprendeu na aula 1',
      proximaAulaId: 'lesson-2',
    },
  },
  {
    id: 'lesson-2',
    numero: 2,
    modulo: 1,
    titulo: 'Pensamento Algorítmico na Prática',
    resumo:
      'Aprenda a quebrar problemas do dia a dia em etapas menores e a enxergar qualquer tarefa como entrada, processamento e saída.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de dividir um problema maior em partes simples e organizar uma solução usando entrada, processamento e saída.',
      contexto:
        'Quando olhamos para um sistema inteiro de uma vez, parece complicado. O segredo do pensamento algorítmico é não tentar resolver tudo de uma só vez: quebramos o problema em pedaços pequenos e resolvemos um de cada vez.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é pensamento algorítmico?',
          explicacao:
            'Pensamento algorítmico é a habilidade de olhar para um problema e encontrar um caminho lógico para resolvê-lo passo a passo. Em vez de sair escrevendo código no escuro, você primeiro entende o que precisa acontecer e em que ordem.'
        },
        {
          titulo: '2. Dividir para conquistar (Decomposição)',
          explicacao:
            'Quando uma tarefa parece grande demais, dividimos ela em subtarefas menores. Por exemplo, “organizar uma viagem” parece enorme, mas fica simples quando quebramos em: escolher o destino, definir as datas, reservar transporte e arrumar a mala.'
        },
        {
          titulo: '3. Entrada, Processamento e Saída',
          explicacao:
            'Quase todo programa funciona em três momentos:\n• Entrada: os dados que o programa recebe (ex.: dois números digitados).\n• Processamento: o que o programa faz com esses dados (ex.: somar os dois números).\n• Saída: o resultado final entregue (ex.: mostrar o total na tela).'
        }
      ],

      exemploCotidiano:
        'Objetivo: calcular se o valor no bolso dá para pagar um lanche.\n\n• Entrada: valor que você tem (R$ 25,00) e preço do lanche (R$ 18,00).\n• Processamento: subtrair o preço do lanche do valor que você tem (25 - 18 = 7).\n• Saída: saber que dá para comprar e ainda sobram R$ 7,00 de troco.',

      exemploCodigo:
        '// Pensando em Entrada, Processamento e Saída\nINÍCIO\n  // Entrada\n  receber nota1\n  receber nota2\n\n  // Processamento\n  somar nota1 + nota2\n  dividir o resultado por 2 para achar a média\n\n  // Saída\n  mostrar a média final\nFIM',

      resumo:
        'Pensar algoritmicamente é quebrar problemas grandes em partes pequenas e organizar a solução em três etapas: o que entra (Entrada), o que é feito (Processamento) e o que sai como resultado (Saída).'
    },

    pratica: {
      titulo: 'Organize o cálculo de compra com desconto',
      enunciado:
        'Imagine que uma loja quer calcular o valor final de um produto após aplicar um desconto em reais.\n\nComplete o algoritmo abaixo separando claramente o que é Entrada, o que é Processamento e o que é Saída. Ainda estamos usando pseudocódigo em português para focar 100% na lógica.',

      codigoInicial:
        'INÍCIO\n  // 1. Entrada (o que precisamos saber antes de calcular?)\n  receber precoProduto\n  \n\n  // 2. Processamento (qual conta precisa ser feita?)\n  \n\n  // 3. Saída (o que deve aparecer no final?)\n  \nFIM',

      exemploSolucao:
        'INÍCIO\n  // 1. Entrada\n  receber precoProduto\n  receber valorDesconto\n\n  // 2. Processamento\n  calcular precoFinal = precoProduto - valorDesconto\n\n  // 3. Saída\n  mostrar precoFinal\nFIM',

      resultadoEsperado:
        'Um algoritmo dividido em Entrada (preço e desconto), Processamento (subtração do desconto) e Saída (exibição do valor final).',

      dica:
        'Pergunte-se: quais duas informações eu preciso ter em mãos antes de fazer a conta? Depois, qual operação matemática descobre o valor final?'
    },

    quiz: [
      {
        pergunta: 'O que significa “decompor” um problema na programação?',
        opcoes: [
          'Apagar o código quando aparece um erro',
          'Dividir um problema grande em partes menores e mais fáceis de resolver',
          'Escrever tudo em uma única linha de código'
        ],
        respostaCorreta: 1,
        explicacao:
          'Decompor é quebrar um problema complexo em etapas menores e gerenciáveis, facilitando a criação da solução.'
      },
      {
        pergunta: 'Em um programa que soma dois números, qual etapa representa o “Processamento”?',
        opcoes: [
          'O usuário digitar os dois números',
          'O resultado aparecer na tela',
          'O computador realizar a conta de adição entre os dois números'
        ],
        respostaCorreta: 2,
        explicacao:
          'Digitar os dados é a Entrada, mostrar o resultado é a Saída, e realizar a operação entre eles é o Processamento.'
      },
      {
        pergunta: 'Qual é a ordem mais comum do fluxo básico de um algoritmo?',
        opcoes: [
          'Saída → Entrada → Processamento',
          'Entrada → Processamento → Saída',
          'Processamento → Saída → Entrada'
        ],
        respostaCorreta: 1,
        explicacao:
          'Primeiro o algoritmo recebe os dados (Entrada), depois trabalha neles (Processamento) e por fim entrega o resultado (Saída).'
      }
    ],

    conclusao: {
      aprendizados: [
        'Problemas grandes ficam simples quando divididos em etapas menores.',
        'Quase todo algoritmo segue o fluxo de Entrada, Processamento e Saída.',
        'Organizar a lógica antes de escrever código evita confusão e retrabalho.'
      ],
      reflexao:
        'Pense em um caixa eletrônico ou aplicativo de banco quando você faz um Pix: o que é Entrada, o que é Processamento e o que é Saída nessa operação?',
      proximaAulaId: 'lesson-3'
    }
  },
  {
    id: 'lesson-3',
    numero: 3,
    modulo: 1,
    titulo: 'Onde o Código Roda e o Console',
    resumo:
      'Descubra onde o JavaScript é executado e use console.log() para enxergar o que está acontecendo dentro do seu programa.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de explicar onde o código JavaScript roda e escrever instruções simples usando console.log() para exibir mensagens.',
      contexto:
        'Na Aula 2, você viu o fluxo de Entrada, Processamento e Saída. Agora vamos dar vida à “Saída” de um jeito prático: usando o console para observar mensagens e resultados enquanto o programa roda.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Onde o JavaScript roda?',
          explicacao:
            'O JavaScript nasceu nos navegadores (como Chrome, Edge e Firefox) para dar vida às páginas web, e hoje também roda em outros ambientes, como servidores com Node.js. Em qualquer lugar que exista um motor JavaScript, suas instruções podem ser executadas.'
        },
        {
          titulo: '2. O que é o console e por que ele ajuda tanto?',
          explicacao:
            'O console é como um painel de recados do programa. Quando você escreve algo, ele mostra mensagens, valores e avisos. É a ferramenta mais usada no dia a dia para conferir se a lógica está indo no caminho certo.'
        },
        {
          titulo: '3. Seu primeiro comando: console.log()',
          explicacao:
            'Para mandar uma mensagem para o console em JavaScript, usamos console.log(...). Tudo que você coloca dentro dos parênteses é exibido ali.\n\n• Textos vão entre aspas, como "Olá, mundo!".\n• Números podem ir direto, como 42.\n• Cada instrução costuma ficar em uma linha, de cima para baixo.'
        }
      ],

      exemploCotidiano:
        'Imagine um caixa de supermercado com um visor virado para você: a cada item passado, o visor mostra o nome e o valor. O console.log() faz algo parecido no código — ele mostra na tela o que o programa está fazendo naquele momento.',

      exemploCodigo:
        '// Exibindo mensagens no console em ordem\nconsole.log("Passo 1: programa iniciado");\nconsole.log("Passo 2: conferindo os dados");\nconsole.log(10 + 5);',

      resumo:
        'O JavaScript roda em ambientes com motor JS (como o navegador), e console.log() é o comando básico para exibir informações no console e acompanhar a execução do código.'
    },

    pratica: {
      titulo: 'Escreva suas primeiras linhas com console.log()',
      enunciado:
        'Complete o código abaixo usando console.log() para exibir uma saudação e um número no console.\n\nLembre-se: textos precisam de aspas (simples ou duplas) e as linhas são executadas uma após a outra, de cima para baixo.',

      codigoInicial:
        '// 1. Mostre uma saudação com seu nome\nconsole.log("Olá, estou aprendendo lógica!");\n\n// 2. Mostre um número qualquer\n\n\n// 3. Mostre uma mensagem final\n',

      exemploSolucao:
        '// 1. Mostre uma saudação com seu nome\nconsole.log("Olá! Meu nome é João e estou aprendendo lógica.");\n\n// 2. Mostre um número qualquer\nconsole.log(2026);\n\n// 3. Mostre uma mensagem final\nconsole.log("Fim do teste no console!");',

      resultadoEsperado:
        'Três chamadas de console.log() organizadas em ordem, exibindo texto e número de forma clara.',

      dica:
        'Confira se abriu e fechou os parênteses e as aspas em cada linha. Se esquecer as aspas em um texto como "Olá", o JavaScript vai achar que é o nome de algo no código.'
    },

    quiz: [
      {
        pergunta: 'Para que serve o comando console.log() em JavaScript?',
        opcoes: [
          'Para apagar arquivos do computador',
          'Para exibir mensagens ou valores no console e acompanhar a execução',
          'Para fechar a aba do navegador automaticamente'
        ],
        respostaCorreta: 1,
        explicacao:
          'console.log() envia informações para o console, ajudando você a ver resultados e conferir o funcionamento do código.'
      },
      {
        pergunta: 'O que acontece se você escreve um texto solto sem aspas dentro de console.log(Olá)?',
        opcoes: [
          'Funciona normalmente e mostra Olá',
          'O JavaScript interpreta Olá como um identificador/variável e não como um texto simples',
          'Ele transforma automaticamente em número'
        ],
        respostaCorreta: 1,
        explicacao:
          'Sem aspas, o JavaScript tenta procurar um identificador chamado Olá em vez de tratar como um texto literal.'
      },
      {
        pergunta: 'Em qual ordem as linhas com console.log() são executadas?',
        opcoes: [
          'De baixo para cima',
          'Em ordem aleatória',
          'De cima para baixo, uma após a outra'
        ],
        respostaCorreta: 2,
        explicacao:
          'Assim como vimos nas primeiras aulas, o código segue uma sequência ordenada de instruções, de cima para baixo.'
      }
    ],

    conclusao: {
      aprendizados: [
        'O JavaScript pode rodar em ambientes como o navegador.',
        'console.log() permite visualizar mensagens e resultados durante a execução.',
        'Atenção às aspas e parênteses evita erros bobos logo no início.'
      ],
      reflexao:
        'Quando um programa não faz o que você esperava, como colocar um console.log() no meio do caminho pode te ajudar a descobrir onde a lógica desviou?',
      proximaAulaId: 'lesson-4'
    }
  },
  {
    id: 'lesson-4',
    numero: 4,
    modulo: 1,
    titulo: 'Variáveis: Guardando Valores na Memória',
    resumo:
      'Entenda o que são variáveis, como criar caixinhas na memória com let e como reutilizar valores no código.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de explicar o que é uma variável, declarar valores com let e reutilizá-los junto com console.log().',
      contexto:
        'Na Aula 3, você exibiu textos e números soltos no console. Mas, se um valor precisar ser usado várias vezes ou mudar ao longo do programa, precisamos guardá-lo em algum lugar. É aí que entram as variáveis.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é uma variável?',
          explicacao:
            'Uma variável é um espaço nomeado na memória do computador onde guardamos um valor para usar depois. Pense nela como uma caixinha com uma etiqueta: a etiqueta é o nome da variável e o que vai dentro é o valor guardado.'
        },
        {
          titulo: '2. Criando uma variável com let',
          explicacao:
            'Em JavaScript, podemos criar uma variável usando a palavra-chave let seguida de um nome e do sinal de atribuição (=):\n\n• let nome = "Ana";\n• let pontos = 10;\n\nRepare que o sinal = aqui não significa "igualdade matemática" — ele significa "guarde o valor da direita dentro da variável da esquerda".'
        },
        {
          titulo: '3. Reutilizando e atualizando o valor',
          explicacao:
            'Depois de criar a variável, você pode chamar o nome dela sem aspas para ler o que está guardado dentro.\n\n• console.log(nome) mostra Ana (não a palavra "nome").\n• Com let, você também pode trocar o valor depois: pontos = 25;'
        }
      ],

      exemploCotidiano:
        'Imagine um placar na parede de um jogo com o nome "Placar". No começo da partida, está marcado 0. Depois de um gol, você apaga o 0 e escreve 1. O nome do placar continua o mesmo, mas o valor guardado nele mudou.',

      exemploCodigo:
        '// Guardando e reutilizando valores com let\nlet jogador = "Lucas";\nlet pontuacao = 10;\n\nconsole.log(jogador);\nconsole.log(pontuacao);\n\n// Atualizando o valor guardado\npontuacao = 20;\nconsole.log(pontuacao);',

      resumo:
        'Variáveis guardam dados na memória com um nome. Com let, você cria a variável, usa o nome sem aspas para acessar o valor e pode atualizar esse valor quando precisar.'
    },

    pratica: {
      titulo: 'Guarde dados de um personagem ou aluno e exiba no console',
      enunciado:
        'Complete o código abaixo criando variáveis com let para guardar um nome e uma quantidade de moedas.\n\nDepois, use console.log() para mostrar os valores guardados e atualize a quantidade de moedas antes de exibir novamente.',

      codigoInicial:
        '// 1. Crie uma variável "aluno" com um nome entre aspas\n\n\n// 2. Crie uma variável "moedas" com um número inicial\nlet moedas = 5;\n\n// 3. Mostre os valores no console\nconsole.log(moedas);\n\n// 4. Atualize "moedas" para um valor maior e mostre de novo\n',

      exemploSolucao:
        '// 1. Crie uma variável "aluno" com um nome entre aspas\nlet aluno = "Beatriz";\n\n// 2. Crie uma variável "moedas" com um número inicial\nlet moedas = 5;\n\n// 3. Mostre os valores no console\nconsole.log(aluno);\nconsole.log(moedas);\n\n// 4. Atualize "moedas" para um valor maior e mostre de novo\nmoedas = 15;\nconsole.log(moedas);',

      resultadoEsperado:
        'Variáveis criadas com let, exibidas com console.log() sem aspas no nome da variável e atualizadas corretamente.',

      dica:
        'Quando for atualizar uma variável já criada com let, você não precisa escrever let de novo — basta escrever o nome da variável, = e o novo valor.'
    },

    quiz: [
      {
        pergunta: 'O que significa escrever let idade = 18; em JavaScript?',
        opcoes: [
          'Compara se idade é exatamente igual a 18 e devolve true',
          'Cria uma variável chamada idade e guarda o valor 18 nela',
          'Apaga qualquer variável chamada idade que exista no código'
        ],
        respostaCorreta: 1,
        explicacao:
          'let cria a variável idade e = guarda o valor 18 dentro dela para ser usado depois.'
      },
      {
        pergunta: 'Se você tem let cidade = "Campinas";, qual a diferença entre console.log(cidade) e console.log("cidade")?',
        opcoes: [
          'Não há diferença, ambos mostram Campinas',
          'console.log(cidade) lê o valor guardado na variável (Campinas); console.log("cidade") imprime o texto literal "cidade"',
          'console.log("cidade") dá erro sempre'
        ],
        respostaCorreta: 1,
        explicacao:
          'Sem aspas, o JavaScript busca a variável cidade e mostra seu conteúdo. Com aspas, ele trata "cidade" como um texto comum.'
      },
      {
        pergunta: 'O que acontece quando você faz let vidas = 3; e depois vidas = 2;?',
        opcoes: [
          'Dá erro porque variáveis criadas com let nunca podem mudar',
          'O valor guardado em vidas passa de 3 para 2',
          'O código cria duas variáveis separadas com o mesmo nome'
        ],
        respostaCorreta: 1,
        explicacao:
          'Variáveis declaradas com let podem ter seus valores reatribuídos, substituindo o valor anterior por 2.'
      }
    ],

    conclusao: {
      aprendizados: [
        'Variáveis funcionam como espaços nomeados para guardar valores na memória.',
        'Usar let permite criar variáveis e atualizar seus valores depois.',
        'Escrever o nome da variável sem aspas acessa o valor guardado nela.'
      ],
      reflexao:
        'Em um jogo ou aplicativo, que tipo de informação faz sentido guardar em uma variável que muda com o tempo (como vidas, pontos ou itens no carrinho)?',
      proximaAulaId: 'lesson-5'
    }
  },
  {
    id: 'lesson-5',
    numero: 5,
    modulo: 1,
    titulo: 'let vs const Sem Confusão',
    resumo:
      'Saiba quando usar let ou const em JavaScript, entenda o que acontece ao tentar reatribuir uma constante e escreva códigos mais seguros.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de escolher entre let e const com segurança e explicar por que valores fixos devem ser declarados com const.',
      contexto:
        'Na Aula 4, vimos que let cria uma variável cujo valor pode mudar. Mas nem tudo no programa deve mudar: se o nome da plataforma, o número máximo de vidas inicial ou uma taxa fixa forem alterados por engano, podem surgir bugs difíceis de achar.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é const?',
          explicacao:
            'const cria uma constante: um valor que é definido na criação e não pode ser reatribuído depois com =. Por exemplo: const escola = "Codelab";. Se você tentar fazer escola = "Outro"; mais tarde, o JavaScript vai gerar um erro.'
        },
        {
          titulo: '2. Quando usar const e quando usar let?',
          explicacao:
            'A regra prática mais simples no dia a dia é:\n• Use const quando o valor não vai mudar (ex.: ano de criação, nome fixo, limite máximo).\n• Use let apenas quando você sabe que aquele valor vai mudar durante a execução (ex.: contador, pontuação, saldo atual).'
        },
        {
          titulo: '3. const por padrão ajuda a evitar bugs',
          explicacao:
            'Começar pensando em const deixa o código mais claro para quem lê: qualquer pessoa bate o olho e sabe que aquele valor não deve ser sobrescrito. E se você perceber que o valor precisa mudar, basta trocar const por let.'
        }
      ],

      exemploCotidiano:
        'Pense na placa de identificação de um carro: ela não muda toda hora durante a viagem (combina com const). Já a velocidade no painel muda a cada segundo conforme você acelera ou freia (combina com let).',

      exemploCodigo:
        '// Valor fixo com const e valor que muda com let\nconst plataforma = "Codelab";\nlet aulaAtual = 4;\n\nconsole.log(plataforma);\nconsole.log(aulaAtual);\n\n// Avançando para a próxima aula\naulaAtual = 5;\nconsole.log(aulaAtual);\n\n// Se tentássemos fazer plataforma = "X", ocorreria erro de reatribuição',

      resumo:
        'Use const para valores que não devem ser reatribuídos e let para valores que vão mudar. Escolher bem entre os dois torna o código mais claro e previne alterações acidentais.'
    },

    pratica: {
      titulo: 'Separe informações fixas e variáveis de um perfil',
      enunciado:
        'Complete o código abaixo declarando os valores fixos com const e os valores que mudam com let.\n\nDepois, exiba os valores iniciais no console, atualize apenas o que faz sentido mudar e mostre o novo valor.',

      codigoInicial:
        '// 1. Crie uma constante "curso" que não deve mudar\n\n\n// 2. Crie uma variável "xpAtual" que começa em 30\nlet xpAtual = 30;\n\n// 3. Mostre os valores no console\nconsole.log(xpAtual);\n\n// 4. Ganhou +20 XP: atualize xpAtual e exiba novamente\n',

      exemploSolucao:
        '// 1. Crie uma constante "curso" que não deve mudar\nconst curso = "Fundamentos de JavaScript";\n\n// 2. Crie uma variável "xpAtual" que começa em 30\nlet xpAtual = 30;\n\n// 3. Mostre os valores no console\nconsole.log(curso);\nconsole.log(xpAtual);\n\n// 4. Ganhou +20 XP: atualize xpAtual e exiba novamente\nxpAtual = 50;\nconsole.log(xpAtual);',

      resultadoEsperado:
        'Uma constante declarada com const para informação fixa, uma variável com let para o XP e a atualização de xpAtual exibida no console.',

      dica:
        'O nome do curso normalmente não muda durante a aula, então const faz sentido nele. Já xpAtual muda conforme o aluno avança, então let é a escolha certa.'
    },

    quiz: [
      {
        pergunta: 'O que acontece se você declarar const limiteTentativas = 3; e depois escrever limiteTentativas = 5;?',
        opcoes: [
          'O valor muda para 5 sem nenhum problema',
          'O JavaScript dispara um erro porque não é permitido reatribuir uma constante declarada com const',
          'A variável vira let automaticamente'
        ],
        respostaCorreta: 1,
        explicacao:
          'Uma constante criada com const não pode receber um novo valor com = após a declaração inicial.'
      },
      {
        pergunta: 'Qual das opções abaixo é o melhor exemplo para usar const?',
        opcoes: [
          'A pontuação de um jogador durante uma partida',
          'O número de itens no carrinho enquanto o usuário adiciona produtos',
          'O nome fixo de um aplicativo que não será alterado no código'
        ],
        respostaCorreta: 2,
        explicacao:
          'Valores que permanecem fixos durante a execução são ideais para const; contadores e valores que mudam usam let.'
      },
      {
        pergunta: 'Por que costuma ser boa prática preferir const quando o valor não muda?',
        opcoes: [
          'Porque deixa claro que o valor não deve ser alterado e ajuda a evitar reatribuições acidentais',
          'Porque impede qualquer console.log() de funcionar',
          'Porque transforma números em textos'
        ],
        respostaCorreta: 0,
        explicacao:
          'Usar const comunica intenção e protege valores importantes contra mudanças sem querer.'
      }
    ],

    conclusao: {
      aprendizados: [
        'const cria valores que não podem ser reatribuídos depois de definidos.',
        'let deve ser usado quando o valor precisa mudar ao longo do programa.',
        'Separar valores fixos de variáveis deixa a lógica mais previsível e segura.'
      ],
      reflexao:
        'Em um sistema de cadastro ou jogo, qual dado você deixaria em const e qual dado deixaria em let? Por quê?',
      proximaAulaId: 'lesson-6'
    }
  },
  {
    id: 'lesson-6',
    numero: 6,
    modulo: 1,
    titulo: 'Tipos de Dados: Textos, Números e Booleanos',
    resumo:
      'Conheça os tipos básicos de valores em JavaScript — strings, numbers e booleans — e evite confusões como texto com aparência de número.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de identificar e criar valores do tipo string, number e boolean e entender por que o tipo de dado muda o comportamento do código.',
      contexto:
        'Até agora guardamos palavras e números em variáveis. Para o computador, porém, um texto, um número e um valor verdadeiro ou falso são coisas bem diferentes — e tratá-los do jeito certo evita erros na lógica.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Strings (Textos)',
          explicacao:
            'Strings representam textos e ficam entre aspas simples (\'...\'), aspas duplas ("...") ou crases (`...`). Exemplos: "Maria", \'JavaScript\', "Aula 6". Mesmo que você escreva "2026" entre aspas, para o JavaScript aquilo é um texto, não um número.'
        },
        {
          titulo: '2. Numbers (Números)',
          explicacao:
            'Numbers representam valores numéricos, sem aspas — tanto inteiros (como 10 ou 0) quanto decimais com ponto (como 9.5 ou 19.90). Como são números, podem participar de contas matemáticas diretamente.'
        },
        {
          titulo: '3. Booleans (Verdadeiro ou Falso)',
          explicacao:
            'Booleans têm apenas dois valores possíveis: true (verdadeiro) ou false (falso), sempre sem aspas. Eles são perfeitos para representar estados, como: está logado? A aula foi concluída? Tem desconto?'
        }
      ],

      exemploCotidiano:
        'Pense em um cadastro de aluno: o nome completo é um texto ("João"), a quantidade de aulas feitas é um número (6), e o status de matrícula ativa é um booleano (true ou false).',

      exemploCodigo:
        '// Exemplos dos três tipos básicos em JavaScript\nconst nomeAluno = "Carlos"; // string\nlet aulasConcluidas = 5;    // number\nlet notaFinal = 8.5;        // number\nlet aprovado = true;        // boolean\n\nconsole.log(nomeAluno);\nconsole.log(aulasConcluidas);\nconsole.log(notaFinal);\nconsole.log(aprovado);',

      resumo:
        'Strings são textos entre aspas, numbers são valores numéricos sem aspas (incluindo decimais com ponto) e booleans são true ou false para representar condições lógicas.'
    },

    pratica: {
      titulo: 'Crie variáveis com string, number e boolean',
      enunciado:
        'Complete o código abaixo declarando valores dos três tipos básicos: um texto para o nome do jogo, um número para a fase atual e um booleano para indicar se o som está ligado.\n\nDepois, exiba todos no console.',

      codigoInicial:
        '// 1. Crie uma constante "nomeJogo" (string)\n\n\n// 2. Crie uma variável "faseAtual" (number)\nlet faseAtual = 1;\n\n// 3. Crie uma variável "somLigado" (boolean: true ou false)\n\n\n// 4. Mostre os três valores no console\n',

      exemploSolucao:
        '// 1. Crie uma constante "nomeJogo" (string)\nconst nomeJogo = "Caça ao Bug";\n\n// 2. Crie uma variável "faseAtual" (number)\nlet faseAtual = 1;\n\n// 3. Crie uma variável "somLigado" (boolean: true ou false)\nlet somLigado = true;\n\n// 4. Mostre os três valores no console\nconsole.log(nomeJogo);\nconsole.log(faseAtual);\nconsole.log(somLigado);',

      resultadoEsperado:
        'Três valores bem tipados — string entre aspas, number sem aspas e boolean como true ou false — exibidos no console.',

      dica:
        'Lembre-se: true e false são palavras-chave booleanas, então não vão entre aspas. Se colocar "true" entre aspas, vira string.'
    },

    quiz: [
      {
        pergunta: 'Qual das opções abaixo representa um valor booleano em JavaScript?',
        opcoes: [
          '"true"',
          'true',
          '1'
        ],
        respostaCorreta: 1,
        explicacao:
          'true (e false), sem aspas, é um valor booleano. Entre aspas ("true") vira uma string.'
      },
      {
        pergunta: 'O que é "15" (com aspas) em comparação a 15 (sem aspas)?',
        opcoes: [
          'São exatamente iguais para o JavaScript',
          '"15" é uma string (texto) e 15 é um number (número)',
          '"15" é um boolean e 15 é uma string'
        ],
        respostaCorreta: 1,
        explicacao:
          'Aspas transformam o conteúdo em texto (string), enquanto 15 sem aspas é um dado numérico (number).'
      },
      {
        pergunta: 'Qual tipo de dado faz mais sentido para guardar se um usuário está conectado (sim ou não)?',
        opcoes: [
          'boolean (true ou false)',
          'number',
          'Apenas números decimais'
        ],
        respostaCorreta: 0,
        explicacao:
          'Booleanos representam diretamente estados lógicos de verdadeiro (true) ou falso (false).'
      }
    ],

    conclusao: {
      aprendizados: [
        'Strings guardam textos delimitados por aspas.',
        'Numbers guardam números inteiros ou decimais sem aspas.',
        'Booleans representam true ou false, essenciais para decisões no código.'
      ],
      reflexao:
        'Por que é importante saber diferenciar "10" (texto) de 10 (número) antes de fazer cálculos em um programa?',
      proximaAulaId: 'lesson-7'
    }
  },
  {
    id: 'lesson-7',
    numero: 7,
    modulo: 1,
    titulo: 'Contas e Operadores Matemáticos',
    resumo:
      'Faça cálculos com números em JavaScript usando +, -, *, / e %, entenda a ordem das operações e evite surpresas ao misturar texto e número.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de usar operadores matemáticos básicos em JavaScript, calcular resultados em variáveis e entender como os parênteses organizam as contas.',
      contexto:
        'Na Aula 6, você viu que números sem aspas entram em contas sem problemas. Agora vamos usar o computador como uma calculadora inteligente para somar pontos, calcular descontos, dividir valores e descobrir restos.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Operadores básicos: +, -, * e /',
          explicacao:
            'Em JavaScript, os quatro operadores mais comuns são:\n• + para adição (ex.: 10 + 5 resulta em 15)\n• - para subtração (ex.: 20 - 7 resulta em 13)\n• * para multiplicação (ex.: 4 * 3 resulta em 12)\n• / para divisão (ex.: 10 / 2 resulta em 5)'
        },
        {
          titulo: '2. Resto da divisão (%) e ordem das contas',
          explicacao:
            'O operador % (módulo) devolve o resto de uma divisão inteira — muito útil para saber se um número é par (10 % 2 === 0 -> resto 0) ou ímpar (7 % 2 === 1 -> resto 1).\n\nAssim como na matemática, multiplicação e divisão vêm antes de soma e subtração, a menos que você use parênteses (...) para forçar a ordem desejada.'
        },
        {
          titulo: '3. Cuidado ao misturar número com texto no +',
          explicacao:
            'Enquanto -, * e / tentam fazer conta numérica, o sinal de + também serve para juntar textos (concatenar). Se você fizer 10 + "5", o JavaScript junta os textos e vira "105" em vez de 15. Por isso, mantenha números como number quando quiser calcular.'
        }
      ],

      exemploCotidiano:
        'Imagine dividir uma conta de R$ 90,00 entre 3 amigos: 90 / 3 dá R$ 30,00 para cada um. Se você aplica um desconto de R$ 15,00 antes de dividir, usar parênteses como (90 - 15) / 3 garante que o desconto aconteça antes da divisão.',

      exemploCodigo:
        '// Calculando médias e restos em JavaScript\nconst nota1 = 8;\nconst nota2 = 6;\nconst media = (nota1 + nota2) / 2;\nconst restoDeSetePorDois = 7 % 2;\n\nconsole.log(media);\nconsole.log(restoDeSetePorDois);\n\n// Atenção: "8" com aspas vira texto ao usar +\nconsole.log("8" + 2);',

      resumo:
        'Use +, -, *, / e % para fazer cálculos, use parênteses para controlar a ordem das operações e tome cuidado com o + quando houver strings envolvidas.'
    },

    pratica: {
      titulo: 'Calcule o total de uma compra e o valor por pessoa',
      enunciado:
        'Complete o código abaixo calculando o subtotal de dois itens, somando uma taxa de entrega e dividindo o total entre 2 pessoas.\n\nUse variáveis e console.log() para exibir os resultados.',

      codigoInicial:
        '// Valores dos itens (numbers)\nconst item1 = 25;\nconst item2 = 35;\nconst entrega = 10;\n\n// 1. Calcule o total somando item1, item2 e entrega\nconst total = 0;\n\n// 2. Calcule quanto cada uma das 2 pessoas paga\nconst porPessoa = 0;\n\n// 3. Mostre total e porPessoa no console\n',

      exemploSolucao:
        '// Valores dos itens (numbers)\nconst item1 = 25;\nconst item2 = 35;\nconst entrega = 10;\n\n// 1. Calcule o total somando item1, item2 e entrega\nconst total = item1 + item2 + entrega;\n\n// 2. Calcule quanto cada uma das 2 pessoas paga\nconst porPessoa = total / 2;\n\n// 3. Mostre total e porPessoa no console\nconsole.log(total);\nconsole.log(porPessoa);',

      resultadoEsperado:
        'Cálculo correto de total (70) e porPessoa (35) exibidos no console.',

      dica:
        'Some item1 + item2 + entrega em total, e depois divida total por 2 em porPessoa.'
    },

    quiz: [
      {
        pergunta: 'Qual é o resultado da expressão 2 + 3 * 4 em JavaScript?',
        opcoes: [
          '20',
          '14',
          '24'
        ],
        respostaCorreta: 1,
        explicacao:
          'A multiplicação (*) tem prioridade sobre a soma (+): primeiro 3 * 4 = 12, depois 2 + 12 = 14.'
      },
      {
        pergunta: 'Para que serve o operador % em uma conta como 8 % 2?',
        opcoes: [
          'Calcula 8% de 2',
          'Retorna o resto da divisão de 8 por 2 (que é 0)',
          'Eleva 8 à potência de 2'
        ],
        respostaCorreta: 1,
        explicacao:
          'O operador % retorna o resto da divisão inteira; 8 dividido por 2 dá 4 com resto 0.'
      },
      {
        pergunta: 'O que acontece ao executar console.log("5" + 3)?',
        opcoes: [
          'Exibe o número 8',
          'Exibe o texto "53" porque o + junta a string "5" com 3',
          'Gera um erro de sintaxe'
        ],
        respostaCorreta: 1,
        explicacao:
          'Como "5" é uma string, o operador + concatena os valores e produz "53".'
      }
    ],

    conclusao: {
      aprendizados: [
        '+, -, * e / realizam as quatro operações básicas e % encontra o resto da divisão.',
        'Parênteses ajudam a deixar clara e exata a ordem dos cálculos.',
        'Misturar string com + junta textos em vez de somar números.'
      ],
      reflexao:
        'Onde no dia a dia você usaria o resto da divisão (%) para tomar uma decisão rápida em um programa?',
      proximaAulaId: 'lesson-8'
    }
  },
  {
    id: 'lesson-8',
    numero: 8,
    modulo: 1,
    titulo: 'Comparações e Valores Booleanos',
    resumo:
      'Aprenda a comparar valores em JavaScript usando >, <, >=, <=, === e !== para gerar respostas verdadeiras ou falsas (booleanos).',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de escrever comparações em JavaScript, entender o resultado booleano (true ou false) e preferir === e !== em vez de == ou !=.',
      contexto:
        'Na Aula 6 você conheceu true e false, e na Aula 7 fez contas matemáticas. Agora vamos fazer o programa responder perguntas como: “a nota é maior ou igual a 7?” ou “a senha digitada é igual à senha salva?”'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Comparações de grandeza: >, <, >= e <=',
          explicacao:
            'Esses operadores comparam valores numéricos e devolvem true ou false:\n• > maior que (10 > 5 -> true)\n• < menor que (3 < 2 -> false)\n• >= maior ou igual a (7 >= 7 -> true)\n• <= menor ou igual a (5 <= 8 -> true)'
        },
        {
          titulo: '2. Igualdade e diferença estritas: === e !==',
          explicacao:
            'Para saber se dois valores são iguais, usamos === (igualdade estrita), que verifica tanto o valor quanto o tipo. Por exemplo, 10 === 10 é true, mas 10 === "10" é false porque um é number e o outro é string.\n\nJá !== significa "diferente de" (ex.: "admin" !== "visitante" -> true).'
        },
        {
          titulo: '3. Por que evitar == solto?',
          explicacao:
            'O operador == faz conversões automáticas escondidas que podem gerar surpresas (como "10" == 10 virar true). Usar === evita essas armadilhas e deixa a intenção do código muito mais clara.'
        }
      ],

      exemploCotidiano:
        'Pense na catraca de um brinquedo com altura mínima de 120 cm: se a criança tem 120 cm, altura >= 120 é true (pode entrar); se tem 115 cm, é false (não pode entrar).',

      exemploCodigo:
        '// Comparações retornam true ou false\nconst nota = 7;\nconst mediaMinima = 7;\nconst senhaDigitada = "1234";\nconst senhaCorreta = "1234";\n\nconsole.log(nota >= mediaMinima);\nconsole.log(nota > 10);\nconsole.log(senhaDigitada === senhaCorreta);\nconsole.log(10 === "10");',

      resumo:
        'Operadores de comparação como >, <, >=, <=, === e !== avaliam uma expressão e devolvem true ou false. Prefira === e !== para evitar conversões inesperadas.'
    },

    pratica: {
      titulo: 'Teste condições de aprovação e acesso com comparações',
      enunciado:
        'Complete o código abaixo escrevendo comparações com >= e === para verificar se um aluno atingiu a média mínima e se o código de acesso confere.\n\nExiba os resultados booleanos no console.',

      codigoInicial:
        'const pontosAluno = 80;\nconst pontosParaPassar = 70;\nconst codigoDigitado = "JS100";\nconst codigoCorreto = "JS100";\n\n// 1. Verifique se pontosAluno é maior ou igual a pontosParaPassar\nconst passou = false;\n\n// 2. Verifique se codigoDigitado é estritamente igual a codigoCorreto\nconst codigoValido = false;\n\n// 3. Mostre os dois booleanos no console\n',

      exemploSolucao:
        'const pontosAluno = 80;\nconst pontosParaPassar = 70;\nconst codigoDigitado = "JS100";\nconst codigoCorreto = "JS100";\n\n// 1. Verifique se pontosAluno é maior ou igual a pontosParaPassar\nconst passou = pontosAluno >= pontosParaPassar;\n\n// 2. Verifique se codigoDigitado é estritamente igual a codigoCorreto\nconst codigoValido = codigoDigitado === codigoCorreto;\n\n// 3. Mostre os dois booleanos no console\nconsole.log(passou);\nconsole.log(codigoValido);',

      resultadoEsperado:
        'Dois valores booleanos exibidos no console: true para passou e true para codigoValido.',

      dica:
        'Use >= para incluir o valor exato da meta (80 >= 70 é true) e === para comparar os dois textos com segurança.'
    },

    quiz: [
      {
        pergunta: 'Qual é o resultado de console.log(5 === "5") em JavaScript?',
        opcoes: [
          'true',
          'false',
          '5'
        ],
        respostaCorreta: 1,
        explicacao:
          'O operador === compara valor e tipo: 5 é number e "5" é string, então o resultado é false.'
      },
      {
        pergunta: 'Se idade = 18, qual comparação verifica se a pessoa tem 18 anos ou mais?',
        opcoes: [
          'idade > 18',
          'idade >= 18',
          'idade !== 18'
        ],
        respostaCorreta: 1,
        explicacao:
          'idade >= 18 retorna true tanto para 18 quanto para valores maiores que 18.'
      },
      {
        pergunta: 'O que o operador !== verifica entre dois valores?',
        opcoes: [
          'Se eles são estritamente diferentes',
          'Se eles são maiores um que o outro',
          'Se eles somam zero'
        ],
        respostaCorreta: 0,
        explicacao:
          '!== retorna true quando os valores ou tipos são diferentes, e false quando são estritamente iguais.'
      }
    ],

    conclusao: {
      aprendizados: [
        'Comparações geram valores booleanos (true ou false).',
        '>= e <= incluem o valor exato na comparação, ao contrário de > e <.',
        '=== e !== comparam com rigor e evitam surpresas de conversão de tipo.'
      ],
      reflexao:
        'Qual é a diferença prática entre usar > e >= em uma regra como “idade mínima para dirigir” ou “nota mínima para passar”?',
      proximaAulaId: 'lesson-9'
    }
  },
  {
    id: 'lesson-9',
    numero: 9,
    modulo: 1,
    titulo: 'Operadores Lógicos: E (&&), OU (||) e NÃO (!)',
    resumo:
      'Combine condições com && (E) e || (OU) e inverta valores booleanos com ! (NÃO) para montar regras lógicas mais completas.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de combinar comparações usando && e ||, inverter valores com ! e prever o resultado booleano de expressões compostas.',
      contexto:
        'Na Aula 8, você fez comparações simples, como nota >= 7. Mas na vida real, as regras costumam exigir mais de uma condição ao mesmo tempo — por exemplo: ter idade mínima E ter ingresso, ou ter cupom OU frete grátis.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O operador E (&&): tudo precisa ser verdadeiro',
          explicacao:
            'O operador && (E lógico) só retorna true quando todas as condições envolvidas são true. Se pelo menos uma for false, o resultado geral é false.\n\nExemplo: temIdadeMinima && temAutorizacao só é true se ambos forem verdadeiros.'
        },
        {
          titulo: '2. O operador OU (||): basta uma condição ser verdadeira',
          explicacao:
            'O operador || (OU lógico) retorna true se pelo menos uma das condições for true. Ele só retorna false quando todas as condições forem falsas.\n\nExemplo: temCarteirinha || eAniversariante é true se qualquer um dos dois for verdadeiro.'
        },
        {
          titulo: '3. O operador NÃO (!): invertendo o booleano',
          explicacao:
            'O operador ! (negação lógica) inverte um valor booleano: !true vira false e !false vira true. Ele é muito útil para checar quando algo não está ativo ou não aconteceu, como !bloqueado.'
        }
      ],

      exemploCotidiano:
        'Para entrar em um show: você precisa ter ingresso && documento válido (os dois). Para ganhar desconto no dia: basta ser estudante || pagar à vista (um ou outro já serve). E se !estaChovendo, dá para ir a pé.',

      exemploCodigo:
        '// Combinando condições com &&, || e !\nconst idade = 18;\nconst temIngresso = true;\nconst contaBloqueada = false;\n\nconst podeEntrar = idade >= 18 && temIngresso;\nconst acessoLiberado = podeEntrar && !contaBloqueada;\nconst temBeneficio = idade < 12 || temIngresso;\n\nconsole.log(podeEntrar);\nconsole.log(acessoLiberado);\nconsole.log(temBeneficio);',

      resumo:
        '&& exige que todas as condições sejam true, || exige ao menos uma condição true e ! inverte true para false e vice-versa.'
    },

    pratica: {
      titulo: 'Monte regras de acesso e benefício com operadores lógicos',
      enunciado:
        'Complete o código abaixo usando &&, || e ! para calcular se o usuário pode jogar e se ganhou benefício.\n\nExiba os resultados no console.',

      codigoInicial:
        'const estaLogado = true;\nconst banido = false;\nconst pontos = 120;\nconst temPasseVip = false;\n\n// 1. Pode jogar se estiver logado E não estiver banido (!banido)\nconst podeJogar = false;\n\n// 2. Ganha benefício se tiver pelo menos 100 pontos OU passe VIP\nconst ganhaBeneficio = false;\n\n// 3. Mostre os resultados no console\n',

      exemploSolucao:
        'const estaLogado = true;\nconst banido = false;\nconst pontos = 120;\nconst temPasseVip = false;\n\n// 1. Pode jogar se estiver logado E não estiver banido (!banido)\nconst podeJogar = estaLogado && !banido;\n\n// 2. Ganha benefício se tiver pelo menos 100 pontos OU passe VIP\nconst ganhaBeneficio = pontos >= 100 || temPasseVip;\n\n// 3. Mostre os resultados no console\nconsole.log(podeJogar);\nconsole.log(ganhaBeneficio);',

      resultadoEsperado:
        'Dois valores booleanos exibidos no console: true para podeJogar e true para ganhaBeneficio.',

      dica:
        'Use && para exigir duas coisas juntas e || quando apenas uma das condições já resolve.'
    },

    quiz: [
      {
        pergunta: 'Se a = true e b = false, qual é o resultado de a && b?',
        opcoes: [
          'true',
          'false',
          'null'
        ],
        respostaCorreta: 1,
        explicacao:
          'No operador && (E), ambos os lados precisam ser true para o resultado ser true. Como b é false, a && b resulta em false.'
      },
      {
        pergunta: 'Se a = false e b = true, qual é o resultado de a || b?',
        opcoes: [
          'true',
          'false',
          'undefined'
        ],
        respostaCorreta: 0,
        explicacao:
          'No operador || (OU), basta um dos lados ser true para que a expressão retorne true.'
      },
      {
        pergunta: 'O que !false retorna em JavaScript?',
        opcoes: [
          'false',
          'true',
          '0'
        ],
        respostaCorreta: 1,
        explicacao:
          'O operador ! nega o valor lógico e inverte false para true.'
      }
    ],

    conclusao: {
      aprendizados: [
        '&& retorna true apenas quando todas as condições são verdadeiras.',
        '|| retorna true quando pelo menos uma condição é verdadeira.',
        '! inverte um valor booleano (true vira false e false vira true).'
      ],
      reflexao:
        'Em uma regra de login ou checkout, qual a diferença de resultado se você trocar && por || sem querer?',
      proximaAulaId: 'lesson-10'
    }
  },
  {
    id: 'lesson-10',
    numero: 10,
    modulo: 1,
    titulo: 'Decisões com if e else',
    resumo:
      'Faça o programa escolher caminhos diferentes com if, else if e else a partir de condições verdadeiras ou falsas.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de escrever estruturas condicionais com if, else if e else para executar blocos de código diferentes conforme a condição.',
      contexto:
        'Nas aulas 8 e 9 você aprendeu a produzir respostas verdadeiras ou falsas com comparações e operadores lógicos. Agora chegou o momento de usar esses resultados para decidir o que o programa deve fazer em cada situação.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O bloco if: executa quando a condição é verdadeira',
          explicacao:
            'A estrutura if avalia uma condição entre parênteses (...). Se o resultado for true, o código dentro das chaves { ... } é executado; se for false, esse bloco é pulado.\n\nExemplo: if (saldo >= 50) { console.log("Compra liberada"); }'
        },
        {
          titulo: '2. O bloco else: o caminho alternativo',
          explicacao:
            'Quando você quer que algo aconteça caso a condição do if seja false, adiciona else { ... } logo após o bloco do if. Assim, o programa sempre escolhe um dos dois caminhos.'
        },
        {
          titulo: '3. Encadeando com else if: várias faixas ou situações',
          explicacao:
            'Quando há mais de duas possibilidades, usamos else if (condicao) { ... } no meio do caminho. O JavaScript testa de cima para baixo e executa apenas o primeiro bloco cuja condição seja verdadeira.'
        }
      ],

      exemploCotidiano:
        'Pense em uma classificação de temperatura: se passar de 30 graus, está calor; senão, se for pelo menos 18 graus, está agradável; caso contrário (else), está frio.',

      exemploCodigo:
        '// Decisão com if, else if e else\nconst nota = 8.5;\n\nif (nota >= 7) {\n  console.log("Aprovado");\n} else if (nota >= 5) {\n  console.log("Recuperação");\n} else {\n  console.log("Reprovado");\n}',

      resumo:
        'Use if para rodar código quando uma condição é true, else if para testar condições extras em sequência e else para o caso padrão quando nada anterior foi verdadeiro.'
    },

    pratica: {
      titulo: 'Classifique a velocidade ou a pontuação com if / else if / else',
      enunciado:
        'Complete o código abaixo usando if, else if e else para exibir uma mensagem de acordo com a pontuação do jogador.\n\n• 100 ou mais: "Nível mestre"\n• 50 ou mais: "Nível intermediário"\n• Abaixo de 50: "Nível iniciante"',

      codigoInicial:
        'const pontos = 65;\n\nif (pontos >= 100) {\n  console.log("Nível mestre");\n} else if (pontos >= 50) {\n  // Complete a mensagem para nível intermediário\n\n} else {\n  // Complete a mensagem para nível iniciante\n\n}',

      exemploSolucao:
        'const pontos = 65;\n\nif (pontos >= 100) {\n  console.log("Nível mestre");\n} else if (pontos >= 50) {\n  console.log("Nível intermediário");\n} else {\n  console.log("Nível iniciante");\n}',

      resultadoEsperado:
        'Para pontos = 65, o programa deve exibir "Nível intermediário" no console.',

      dica:
        'Comece testando a condição maior (pontos >= 100) antes de pontos >= 50, assim a ordem fica bem clara.'
    },

    quiz: [
      {
        pergunta: 'O que acontece quando a condição de um if é avaliada como false?',
        opcoes: [
          'O código dentro das chaves do if é ignorado e o programa segue para o else (se existir) ou para o próximo trecho',
          'O programa trava e não executa mais nenhuma linha',
          'A condição vira true automaticamente'
        ],
        respostaCorreta: 0,
        explicacao:
          'Quando a condição do if é false, o bloco dentro dele não roda; se houver else, esse bloco alternativo é executado.'
      },
      {
        pergunta: 'Se pontos = 100 e temos if (pontos >= 50) antes de else if (pontos >= 100), o que acontece?',
        opcoes: [
          'Entra no primeiro if (pontos >= 50) porque ele é verdadeiro e aparece primeiro',
          'Dá erro de sintaxe por ter dois números',
          'Executa os dois blocos juntos'
        ],
        respostaCorreta: 0,
        explicacao:
          'O JavaScript avalia de cima para baixo e executa o primeiro bloco cuja condição seja verdadeira.'
      },
      {
        pergunta: 'Qual bloco serve como resposta padrão quando nenhuma condição anterior do if ou else if foi verdadeira?',
        opcoes: [
          'else',
          'let',
          'true'
        ],
        respostaCorreta: 0,
        explicacao:
          'O bloco else roda quando nenhuma das condições anteriores foi atendida.'
      }
    ],

    conclusao: {
      aprendizados: [
        'if executa um bloco de código apenas quando a condição é verdadeira.',
        'else if permite testar novas condições em ordem quando a anterior é falsa.',
        'else define o caminho alternativo quando nenhuma condição anterior se aplica.'
      ],
      reflexao:
        'Por que a ordem das condições em um encadeamento com if / else if pode mudar o resultado final do programa?',
      proximaAulaId: 'lesson-11'
    }
  },
  {
    id: 'lesson-11',
    numero: 11,
    modulo: 1,
    titulo: 'Escolhas Múltiplas com switch',
    resumo:
      'Organize decisões baseadas em valores exatos usando switch, case, break e default, e saiba quando escolher switch ou if / else if.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de escrever estruturas switch com case, break e default e identificar cenários onde switch deixa a leitura mais limpa que múltiplos else if.',
      contexto:
        'Na Aula 10 você usou if, else if e else para tomar decisões. Quando você precisa testar o mesmo valor contra várias opções fixas — como um comando, um dia da semana ou uma escolha de menu — o switch ajuda a deixar o código mais direto.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Como funciona o switch e os blocos case',
          explicacao:
            'O switch avalia uma expressão uma única vez e compara com diferentes opções marcadas por case <valor>:. Quando encontra uma correspondência exata (usando ===), ele entra naquele caso.'
        },
        {
          titulo: '2. O papel do break e do default',
          explicacao:
            '• break encerra a execução do switch após rodar o bloco daquele case, impedindo que o código continue caindo nos casos de baixo.\n• default funciona como o "else" do switch: executa quando nenhum case anterior combinou.'
        },
        {
          titulo: '3. switch ou if / else if?',
          explicacao:
            'Use switch quando você compara uma variável contra valores exatos conhecidos (ex.: "segunda", "terca", "inicio", "ajuda"). Use if / else if quando as condições envolvem faixas numéricas (como nota >= 7) ou combinações lógicas com && e ||.'
        }
      ],

      exemploCotidiano:
        'Pense em apertar um botão em um elevador ou escolher uma opção em um caixa eletrônico: você escolhe um número ou comando exato e o sistema executa a ação correspondente àquela opção.',

      exemploCodigo:
        '// Escolhas exatas com switch\nconst comando = "ajuda";\n\nswitch (comando) {\n  case "jogar":\n    console.log("Iniciando partida...");\n    break;\n  case "ajuda":\n    console.log("Mostrando controles do jogo.");\n    break;\n  case "sair":\n    console.log("Encerrando sessão.");\n    break;\n  default:\n    console.log("Comando não reconhecido.");\n}',

      resumo:
        'switch compara um valor exato contra vários case, usa break para parar no caso certo e usa default como opção padrão quando nada bate.'
    },

    pratica: {
      titulo: 'Monte um seletor de modo ou dia com switch',
      enunciado:
        'Complete o código abaixo usando switch, case, break e default para exibir uma mensagem conforme o valor de tema.\n\n• "escuro": "Tema escuro ativado"\n• "claro": "Tema claro ativado"\n• Qualquer outro valor: "Usando tema padrão do sistema"',

      codigoInicial:
        'const tema = "escuro";\n\nswitch (tema) {\n  case "escuro":\n    console.log("Tema escuro ativado");\n    break;\n  // Adicione o case "claro" com break e o bloco default\n\n}',

      exemploSolucao:
        'const tema = "escuro";\n\nswitch (tema) {\n  case "escuro":\n    console.log("Tema escuro ativado");\n    break;\n  case "claro":\n    console.log("Tema claro ativado");\n    break;\n  default:\n    console.log("Usando tema padrão do sistema");\n}',

      resultadoEsperado:
        'Para tema = "escuro", o código exibe "Tema escuro ativado"; para "claro", exibe "Tema claro ativado"; e para outros valores, cai no default.',

      dica:
        'Não esqueça o break ao final de cada case para não vazar para a próxima opção.'
    },

    quiz: [
      {
        pergunta: 'Para que serve a palavra-chave break dentro de um case do switch?',
        opcoes: [
          'Para sair do switch após executar o caso correspondente',
          'Para declarar uma nova variável',
          'Para inverter um valor booleano'
        ],
        respostaCorreta: 0,
        explicacao:
          'Sem o break, a execução pode continuar seguindo para os próximos case abaixo.'
      },
      {
        pergunta: 'Quando o bloco default de um switch é executado?',
        opcoes: [
          'Sempre, antes de qualquer case',
          'Quando nenhum dos case anteriores corresponde ao valor avaliado',
          'Apenas quando o valor é um número negativo'
        ],
        respostaCorreta: 1,
        explicacao:
          'default é o caminho padrão executado quando nenhum case combina com o valor do switch.'
      },
      {
        pergunta: 'Em qual situação o switch costuma ser mais direto do que vários if / else if?',
        opcoes: [
          'Ao verificar faixas como idade >= 18 e idade < 60',
          'Ao comparar um valor contra várias opções exatas, como comandos ou dias da semana',
          'Ao somar dois números inteiros'
        ],
        respostaCorreta: 1,
        explicacao:
          'switch brilha quando você tem um valor específico e quer mapear respostas para opções exatas.'
      }
    ],

    conclusao: {
      aprendizados: [
        'switch avalia uma expressão e compara com opções exatas em blocos case.',
        'break interrompe a execução ao encontrar o case desejado e default trata casos não listados.',
        'switch é ótimo para opções exatas; if / else if continua ideal para faixas e condições compostas.'
      ],
      reflexao:
        'Em qual funcionalidade de um site ou jogo (menu, filtro, comando, status) você usaria switch em vez de if / else if?',
      proximaAulaId: 'lesson-12'
    }
  },
  {
    id: 'lesson-12',
    numero: 12,
    modulo: 1,
    titulo: 'Repetição com while',
    resumo:
      'Repita blocos de código enquanto uma condição for verdadeira usando while, controle o contador e evite loops infinitos.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de escrever laços while com condição de parada clara e atualizar a variável de controle para encerrar a repetição no momento certo.',
      contexto:
        'Até agora, cada linha do seu código rodava uma única vez (ou entrava em um caminho de decisão). Mas e se você precisar contar de 1 a 5, exibir uma mensagem várias vezes ou repetir uma etapa enquanto ainda houver tentativas? Para isso existem os laços de repetição, começando pelo while.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Como funciona o while ("enquanto")',
          explicacao:
            'O laço while testa uma condição antes de cada repetição. Enquanto a condição for true, o código dentro das chaves { ... } é executado; assim que se torna false, o laço termina e o programa continua nas linhas seguintes.'
        },
        {
          titulo: '2. Atualizando a variável de controle',
          explicacao:
            'Para o while avançar e terminar, geralmente criamos uma variável (como let contador = 1;) e alteramos o valor dela dentro do bloco (como contador = contador + 1; ou contador++). Sem essa atualização, a condição pode continuar true para sempre.'
        },
        {
          titulo: '3. Cuidado com o loop infinito',
          explicacao:
            'Um loop infinito acontece quando a condição do while nunca se torna false — por exemplo, esquecer de incrementar o contador ou escrever uma condição que sempre é verdadeira. Por isso, sempre confira se algo dentro do bloco faz a condição caminhar para false.'
        }
      ],

      exemploCotidiano:
        'Pense em encher um copo enquanto ele ainda não estiver cheio: a cada gole ou despejo de água, o nível sobe. Quando atinge o limite, a condição "ainda não está cheio" deixa de ser verdadeira e você para.',

      exemploCodigo:
        '// Contagem simples com while\nlet passo = 1;\n\nwhile (passo <= 3) {\n  console.log("Passo " + passo);\n  passo = passo + 1;\n}\n\nconsole.log("Concluído!");',

      resumo:
        'while repete o bloco enquanto a condição for true. Sempre atualize a variável de controle dentro do laço para que a condição eventualmente vire false e evite loops infinitos.'
    },

    pratica: {
      titulo: 'Faça uma contagem com while até o limite',
      enunciado:
        'Complete o código abaixo usando while para exibir os números de 1 até 5 no console.\n\nLembre-se de atualizar a variável dentro do laço para ele parar em 5.',

      codigoInicial:
        'let numero = 1;\n\nwhile (numero <= 5) {\n  console.log(numero);\n  // Atualize "numero" aqui para avançar até passar de 5\n\n}',

      exemploSolucao:
        'let numero = 1;\n\nwhile (numero <= 5) {\n  console.log(numero);\n  numero = numero + 1;\n}',

      resultadoEsperado:
        'Exibe os números 1, 2, 3, 4 e 5 em sequência no console e encerra o laço sem travar.',

      dica:
        'Se você não aumentar numero dentro do while, ele ficará preso em 1 para sempre.'
    },

    quiz: [
      {
        pergunta: 'Quando o bloco dentro de um while (condicao) deixa de ser executado?',
        opcoes: [
          'Assim que a condição avalia como false',
          'Apenas depois de rodar 100 vezes',
          'Quando o código encontra um console.log()'
        ],
        respostaCorreta: 0,
        explicacao:
          'O while verifica a condição antes de cada volta; quando ela se torna false, o laço é encerrado.'
      },
      {
        pergunta: 'O que acontece se você escreve let i = 1; while (i <= 3) { console.log(i); } sem alterar i?',
        opcoes: [
          'Imprime 1, 2 e 3 e para sozinho',
          'Cria um loop infinito porque i continua valendo 1 e i <= 3 nunca vira false',
          'Imprime apenas o número 3'
        ],
        respostaCorreta: 1,
        explicacao:
          'Como i permanece 1, a condição i <= 3 continua verdadeira indefinidamente, gerando um loop infinito.'
      },
      {
        pergunta: 'Por que atualizar a variável de controle dentro do while é essencial?',
        opcoes: [
          'Para transformar números em strings automaticamente',
          'Para fazer a condição avançar rumo a false e encerrar a repetição no momento certo',
          'Para pular a verificação da condição'
        ],
        respostaCorreta: 1,
        explicacao:
          'Atualizar a variável de controle faz o estado mudar a cada volta até a condição de parada ser atingida.'
      }
    ],

    conclusao: {
      aprendizados: [
        'while executa repetidamente enquanto sua condição for verdadeira.',
        'Atualizar a variável de controle dentro do laço garante o encerramento.',
        'Prestar atenção na condição de parada evita loops infinitos.'
      ],
      reflexao:
        'Em qual situação do dia a dia (como contagem regressiva, tentativas ou fila) o while faz sentido?',
      proximaAulaId: 'lesson-13'
    }
  },
  {
    id: 'lesson-13',
    numero: 13,
    modulo: 1,
    titulo: 'Contagens com for',
    resumo:
      'Escreva repetições estruturadas com for reunindo início, condição e incremento no cabeçalho para contagens e passos previsíveis.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de escrever laços for com inicialização, condição e incremento, além de entender quando o for é mais prático que o while.',
      contexto:
        'Na Aula 12 você usou o while para repetir enquanto uma condição era verdadeira. Quando a repetição gira em torno de uma contagem com início, limite e avanço definidos, o laço for deixa essas três partes reunidas em uma única linha.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. As três partes do cabeçalho do for',
          explicacao:
            'A estrutura básica do for é:\n\nfor (let i = 1; i <= 5; i++) {\n  // bloco repetido\n}\n\n• Início (let i = 1): cria e define onde a contagem começa.\n• Condição (i <= 5): enquanto for true, o laço continua rodando.\n• Passo / incremento (i++): aumenta i de 1 em 1 ao fim de cada volta.'
        },
        {
          titulo: '2. Como o ciclo de execução funciona',
          explicacao:
            'O JavaScript executa let i = 1 apenas uma vez no começo. Depois, em cada volta: checa se i <= 5 é true, roda o código dentro de { ... } e, só então, aplica i++ para testar de novo.'
        },
        {
          titulo: '3. Quando preferir for em vez de while?',
          explicacao:
            'Use for quando você já sabe quantas vezes quer repetir ou está percorrendo uma faixa numérica definida (como de 1 a 10). Use while quando a parada depende de algo que acontece dinamicamente durante a execução.'
        }
      ],

      exemploCotidiano:
        'Pense em fazer 5 séries ou contar de 1 até 5 em voz alta: você sabe onde começa (1), quando termina (5) e de quanto em quanto avança (+1 a cada contagem).',

      exemploCodigo:
        '// Contagem de 1 a 5 com for\nfor (let i = 1; i <= 5; i++) {\n  console.log("Contagem: " + i);\n}\n\nconsole.log("Fim da contagem!");',

      resumo:
        'O for reúne início, condição e incremento no topo do laço, tornando contagens e repetições com limite definido mais legíveis e difíceis de esquecer de atualizar.'
    },

    pratica: {
      titulo: 'Conte de 1 até 4 e exiba cada número com for',
      enunciado:
        'Complete o código abaixo usando um laço for para exibir os números de 1 a 4 no console.\n\nDepois, mostre uma mensagem final após o encerramento do laço.',

      codigoInicial:
        '// Complete o for para contar de 1 até 4\nfor (let i = 1; i <= 4; i++) {\n  // Mostre o valor atual de i no console\n\n}\n\nconsole.log("Pronto!");',

      exemploSolucao:
        '// Complete o for para contar de 1 até 4\nfor (let i = 1; i <= 4; i++) {\n  console.log(i);\n}\n\nconsole.log("Pronto!");',

      resultadoEsperado:
        'Exibe 1, 2, 3 e 4 no console e, em seguida, exibe "Pronto!".',

      dica:
        'Dentro do bloco do for, use console.log(i) para acompanhar o número de cada volta.'
    },

    quiz: [
      {
        pergunta: 'No cabeçalho for (let i = 1; i <= 3; i++), o que faz a parte i++?',
        opcoes: [
          'Define o valor inicial de i antes do laço começar',
          'Aumenta o valor de i de 1 em 1 após cada repetição do bloco',
          'Encerra o programa imediatamente'
        ],
        respostaCorreta: 1,
        explicacao:
          'i++ incrementa i em 1 ao final de cada volta para que a condição i <= 3 avance até se tornar falsa.'
      },
      {
        pergunta: 'Em for (let i = 0; i < 3; i++), quantas vezes o bloco interno será executado?',
        opcoes: [
          '2 vezes',
          '3 vezes (com i valendo 0, 1 e 2)',
          '4 vezes'
        ],
        respostaCorreta: 1,
        explicacao:
          'O laço roda para i = 0, i = 1 e i = 2; quando i vira 3, a condição 3 < 3 é false e ele para.'
      },
      {
        pergunta: 'Em qual cenário o laço for costuma ser a escolha mais natural?',
        opcoes: [
          'Quando você tem uma contagem com início, limite e passo bem definidos',
          'Quando você quer declarar uma constante com const',
          'Quando precisa comparar um único valor com switch'
        ],
        respostaCorreta: 0,
        explicacao:
          'O for organiza início, condição e passo no mesmo lugar, ideal para contagens e repetições controladas.'
      }
    ],

    conclusao: {
      aprendizados: [
        'O cabeçalho do for organiza inicialização, condição de parada e incremento.',
        'A condição é testada antes de cada volta e o incremento ocorre após o bloco.',
        'for é especialmente claro para contagens e repetições de tamanho conhecido.'
      ],
      reflexao:
        'Como você mudaria o cabeçalho de um for se quisesse contar apenas números pares (2, 4, 6...)?',
      proximaAulaId: 'lesson-14'
    }
  },
  {
    id: 'lesson-14',
    numero: 14,
    modulo: 1,
    titulo: 'Listas com Arrays',
    resumo:
      'Guarde vários valores em uma única variável usando arrays, acesse itens pelo índice (começando do 0) e descubra o tamanho com .length.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de criar arrays em JavaScript, acessar elementos pelo índice com colchetes e ler a quantidade de itens usando .length.',
      contexto:
        'Até agora, cada variável guardava apenas um valor por vez. Mas e se você quiser guardar uma lista de tarefas, notas de uma prova ou nomes de fases? Criar uma variável para cada item logo vira bagunça — é aí que entram os arrays.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é um array e como criar',
          explicacao:
            'Um array é uma lista ordenada de valores guardada dentro de colchetes [ ... ], separados por vírgula. Por exemplo:\n\nconst frutas = ["maçã", "banana", "uva"];\n\nUm array pode guardar strings, numbers, booleans ou até misturar valores.'
        },
        {
          titulo: '2. Índices começam em 0',
          explicacao:
            'Cada item de um array tem uma posição chamada índice — e em JavaScript a contagem começa em 0, não em 1!\n\nNa lista ["maçã", "banana", "uva"]:\n• frutas[0] é "maçã"\n• frutas[1] é "banana"\n• frutas[2] é "uva"'
        },
        {
          titulo: '3. Tamanho da lista com .length',
          explicacao:
            'A propriedade .length informa quantos elementos existem no array. Na lista com 3 frutas acima, frutas.length vale 3. Como o índice começa em 0, o último item fica sempre na posição frutas.length - 1.'
        }
      ],

      exemploCotidiano:
        'Pense em uma prateleira numerada do 0 em diante: o primeiro livro fica na posição 0, o segundo na posição 1 e o terceiro na posição 2. Se há 3 livros na prateleira, o tamanho (.length) é 3.',

      exemploCodigo:
        '// Criando arrays, acessando por índice e lendo .length\nconst tarefas = ["Revisar lógica", "Fazer prática", "Responder quiz"];\n\nconsole.log(tarefas[0]);       // "Revisar lógica"\nconsole.log(tarefas[2]);       // "Responder quiz"\nconsole.log(tarefas.length);  // 3',

      resumo:
        'Arrays armazenam listas de valores entre [ ... ]. O primeiro item está no índice 0 e .length retorna a quantidade total de itens.'
    },

    pratica: {
      titulo: 'Crie uma lista de metas ou linguagens e acesse itens',
      enunciado:
        'Complete o código abaixo criando um array com 3 itens, exibindo o primeiro item (índice 0), o segundo item (índice 1) e o total de itens com .length.',

      codigoInicial:
        'const metas = ["Ler teoria", "Praticar código", "Concluir aula"];\n\n// 1. Mostre o primeiro item (índice 0)\n\n\n// 2. Mostre o segundo item (índice 1)\n\n\n// 3. Mostre quantos itens existem usando .length\n',

      exemploSolucao:
        'const metas = ["Ler teoria", "Praticar código", "Concluir aula"];\n\n// 1. Mostre o primeiro item (índice 0)\nconsole.log(metas[0]);\n\n// 2. Mostre o segundo item (índice 1)\nconsole.log(metas[1]);\n\n// 3. Mostre quantos itens existem usando .length\nconsole.log(metas.length);',

      resultadoEsperado:
        'Exibe "Ler teoria", "Praticar código" e 3 no console.',

      dica:
        'Lembre-se: o primeiro elemento fica em metas[0], e não em metas[1].'
    },

    quiz: [
      {
        pergunta: 'Dado const cores = ["azul", "verde", "amarelo"];, o que cores[1] retorna?',
        opcoes: [
          '"azul"',
          '"verde"',
          '"amarelo"'
        ],
        respostaCorreta: 1,
        explicacao:
          'A contagem começa em 0: cores[0] é "azul", cores[1] é "verde" e cores[2] é "amarelo".'
      },
      {
        pergunta: 'Se um array tem 4 elementos, qual é o valor de array.length?',
        opcoes: [
          '3',
          '4',
          '5'
        ],
        respostaCorreta: 1,
        explicacao:
          '.length representa a quantidade total de elementos do array (4), mesmo que os índices vão de 0 a 3.'
      },
      {
        pergunta: 'Qual é o índice do primeiro elemento de qualquer array em JavaScript?',
        opcoes: [
          '0',
          '1',
          '-1'
        ],
        respostaCorreta: 0,
        explicacao:
          'Em JavaScript, os índices de um array sempre começam em 0.'
      }
    ],

    conclusao: {
      aprendizados: [
        'Arrays agrupam vários valores em uma única lista delimitada por colchetes.',
        'Os índices de um array começam em 0 e acessam posições com array[indice].',
        '.length indica quantos itens o array possui.'
      ],
      reflexao:
        'Por que começar os índices em 0 pode causar confusão no início se você não lembrar da diferença entre posição e quantidade (.length)?',
      proximaAulaId: 'lesson-15'
    }
  },
  {
    id: 'lesson-15',
    numero: 15,
    modulo: 1,
    titulo: 'Alterando e Percorrendo Arrays com for',
    resumo:
      'Adicione itens com .push(), altere posições pelo índice e percorra arrays inteiros com for e .length sem repetir código.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de percorrer todos os elementos de um array com um laço for, alterar itens por índice e adicionar novos elementos usando .push().',
      contexto:
        'Na Aula 14 você criou arrays e leu itens com colchetes e .length. Agora vamos dar vida às listas: adicionar novos itens, ajustar um valor existente e usar o for para visitar cada posição da lista de forma automática.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Adicionando e alterando itens no array',
          explicacao:
            'Você pode trocar um valor existente atribuindo a um índice específico, como lista[0] = "Novo item";.\n\nPara adicionar um elemento ao final do array, usamos o método .push(valor): lista.push("Último item"); — e o .length aumenta automaticamente.'
        },
        {
          titulo: '2. Percorrendo o array com for e .length',
          explicacao:
            'O padrão mais comum para ler uma lista do começo ao fim é começar o índice em 0 e ir enquanto i < lista.length:\n\nfor (let i = 0; i < lista.length; i++) {\n  console.log(lista[i]);\n}\n\nUsamos < (e não <=) porque, se a lista tem 3 itens, os índices vão de 0 até 2.'
        },
        {
          titulo: '3. Por que usar < lista.length evita erro?',
          explicacao:
            'Se você colocar i <= lista.length em uma lista de tamanho 3, na última volta i valerá 3 e lista[3] retornará undefined (fora do intervalo válido dos índices 0, 1 e 2). Com i < lista.length, o laço para exatamente no último índice válido.'
        }
      ],

      exemploCotidiano:
        'Imagine conferir uma lista de presença com 4 alunos: você começa no aluno de posição 0 e vai avançando um por um enquanto a posição for menor que o total de alunos (4), lendo o nome de cada um.',

      exemploCodigo:
        '// Alterando, adicionando com .push() e percorrendo com for\nconst pontosRodadas = [10, 20, 30];\n\npontosRodadas[1] = 25;   // altera o índice 1\npontosRodadas.push(40);  // adiciona 40 no final\n\nfor (let i = 0; i < pontosRodadas.length; i++) {\n  console.log("Rodada " + (i + 1) + ": " + pontosRodadas[i]);\n}',

      resumo:
        'Use array[indice] = novoValor para alterar um item, .push() para adicionar ao final e for (let i = 0; i < array.length; i++) para percorrer a lista com segurança.'
    },

    pratica: {
      titulo: 'Adicione um item com .push() e exiba todos com for',
      enunciado:
        'Complete o código abaixo adicionando "Aula 15" ao array aulas com .push(), e depois use um laço for para exibir cada item no console.',

      codigoInicial:
        'const aulas = ["Aula 13", "Aula 14"];\n\n// 1. Adicione "Aula 15" ao final do array usando .push()\n\n\n// 2. Percorra o array com for e mostre cada item no console\nfor (let i = 0; i < aulas.length; i++) {\n  // Exiba aulas[i]\n\n}',

      exemploSolucao:
        'const aulas = ["Aula 13", "Aula 14"];\n\n// 1. Adicione "Aula 15" ao final do array usando .push()\naulas.push("Aula 15");\n\n// 2. Percorra o array com for e mostre cada item no console\nfor (let i = 0; i < aulas.length; i++) {\n  console.log(aulas[i]);\n}',

      resultadoEsperado:
        'Exibe "Aula 13", "Aula 14" e "Aula 15" no console, um por volta do laço.',

      dica:
        'Chame aulas.push("Aula 15") antes do for para que o novo item já faça parte do array ao percorrer.'
    },

    quiz: [
      {
        pergunta: 'O que faz o método .push("JS") em um array chamado tecnologias?',
        opcoes: [
          'Remove o primeiro item do array',
          'Adiciona "JS" ao final do array e atualiza o .length',
          'Substitui todos os itens do array por "JS"'
        ],
        respostaCorreta: 1,
        explicacao:
          '.push() insere o novo elemento no fim do array e aumenta o tamanho (.length) em 1.'
      },
      {
        pergunta: 'Por que o laço para percorrer um array geralmente usa i < itens.length em vez de i <= itens.length?',
        opcoes: [
          'Porque o último índice válido é itens.length - 1; com <=, a última volta acessaria um índice além do final',
          'Porque o <= faz o laço rodar ao contrário',
          'Porque .length já começa em 0'
        ],
        respostaCorreta: 0,
        explicacao:
          'Se um array tem 3 elementos, seus índices são 0, 1 e 2. Usar i < 3 garante que i vá apenas até 2.'
      },
      {
        pergunta: 'Dado const notas = [7, 8, 9];, o que notas[0] = 10; faz?',
        opcoes: [
          'Adiciona 10 no final do array',
          'Altera o primeiro elemento (índice 0) para 10',
          'Apaga o array notas'
        ],
        respostaCorreta: 1,
        explicacao:
          'Atribuir a notas[0] atualiza o valor armazenado na posição 0 para 10.'
      }
    ],

    conclusao: {
      aprendizados: [
        'É possível atualizar posições específicas com array[indice] e adicionar itens ao fim com .push().',
        'O padrão i = 0; i < array.length; i++ percorre todos os elementos sem ultrapassar o limite.',
        'Combinar for e arrays evita repetir comandos para cada item da lista.'
      ],
      reflexao:
        'Em qual situação prática de um app (como carrinho de compras, histórico ou lista de tarefas) você combinaria .push() com um for?',
      proximaAulaId: 'lesson-16'
    }
  },
  {
    id: 'lesson-16',
    numero: 16,
    modulo: 1,
    titulo: 'Funções: Reutilizando Blocos de Código',
    resumo:
      'Agrupe instruções em funções com function, passe valores por parâmetros e devolva resultados com return para evitar código repetido.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de criar funções em JavaScript, passar parâmetros para reutilizar a mesma lógica com dados diferentes e usar return para devolver um resultado.',
      contexto:
        'Nas últimas aulas você combinou decisões, repetições e arrays. Quando uma mesma regra precisa rodar em vários pontos do programa — como calcular um desconto, formatar uma mensagem ou validar uma pontuação — escrever tudo de novo toda hora dá trabalho e aumenta a chance de erro.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é uma função e como chamar',
          explicacao:
            'Uma função é um bloco de código com nome que pode ser executado sempre que você chamar esse nome seguido de parênteses:\n\nfunction saudar() {\n  console.log("Bem-vindo ao Codelab!");\n}\n\nsaudar(); // executa a função'
        },
        {
          titulo: '2. Parâmetros: enviando dados para a função',
          explicacao:
            'Parâmetros funcionam como variáveis de entrada declaradas entre os parênteses da função. Quando você chama a função passando valores (argumentos), ela usa esses dados naquele momento:\n\nfunction cumprimentar(nome) {\n  console.log("Olá, " + nome + "!");\n}\n\ncumprimentar("Ana");'
        },
        {
          titulo: '3. return: devolvendo o resultado para quem chamou',
          explicacao:
            'Além de exibir algo na tela, uma função pode calcular um valor e devolvê-lo usando return:\n\nfunction somar(a, b) {\n  return a + b;\n}\n\nconst resultado = somar(4, 6); // 10'
        }
      ],

      exemploCotidiano:
        'Pense em uma máquina de café: você escolhe o tipo (parâmetro), ela prepara e entrega a bebida pronta (return). Você não precisa montar a máquina toda vez que quer um café.',

      exemploCodigo:
        '// Função com parâmetros e return\nfunction calcularDobro(numero) {\n  return numero * 2;\n}\n\nconst dobroDeOito = calcularDobro(8);\nconsole.log(dobroDeOito); // 16\nconsole.log(calcularDobro(15)); // 30',

      resumo:
        'Funções agrupam lógica reutilizável com function, recebem entradas por parâmetros e devolvem valores calculados com return.'
    },

    pratica: {
      titulo: 'Crie uma função que calcula o dobro ou a pontuação bônus',
      enunciado:
        'Complete a função calcularBonus abaixo para retornar pontos + bonus.\n\nDepois, chame a função e exiba o resultado no console.',

      codigoInicial:
        'function calcularBonus(pontos, bonus) {\n  // Retorne a soma de pontos + bonus\n\n}\n\nconst totalComBonus = calcularBonus(50, 25);\nconsole.log(totalComBonus);',

      exemploSolucao:
        'function calcularBonus(pontos, bonus) {\n  return pontos + bonus;\n}\n\nconst totalComBonus = calcularBonus(50, 25);\nconsole.log(totalComBonus);',

      resultadoEsperado:
        'Exibe 75 no console ao chamar calcularBonus(50, 25).',

      dica:
        'Use a palavra return dentro da função para devolver pontos + bonus para a variável totalComBonus.'
    },

    quiz: [
      {
        pergunta: 'Para que serve a palavra-chave return dentro de uma função?',
        opcoes: [
          'Para devolver um valor produzido pela função para quem a chamou',
          'Para reiniciar o laço for do começo',
          'Para declarar uma constante global'
        ],
        respostaCorreta: 0,
        explicacao:
          'return envia o resultado da função de volta para o ponto onde ela foi chamada, permitindo guardar ou usar esse valor.'
      },
      {
        pergunta: 'Na função function multiplicar(x, y) { return x * y; }, o que são x e y?',
        opcoes: [
          'Parâmetros que recebem os valores passados na chamada da função',
          'Palavras reservadas para encerrar o programa',
          'Índices de um array'
        ],
        respostaCorreta: 0,
        explicacao:
          'x e y são parâmetros da função e assumem os valores enviados quando multiplicar(...) é invocada.'
      },
      {
        pergunta: 'Qual é o principal benefício de usar funções em vez de copiar e colar o mesmo código várias vezes?',
        opcoes: [
          'Evita repetição, centraliza a lógica em um lugar só e facilita manutenção',
          'Impede o uso de variáveis dentro do programa',
          'Faz o código rodar sem precisar de condições'
        ],
        respostaCorreta: 0,
        explicacao:
          'Reutilizar funções reduz duplicação e torna mais simples corrigir ou evoluir uma regra depois.'
      }
    ],

    conclusao: {
      aprendizados: [
        'Funções agrupam blocos de código reutilizáveis que rodam quando chamados.',
        'Parâmetros permitem que a mesma função funcione com diferentes valores de entrada.',
        'return devolve um resultado para ser usado ou exibido onde a função foi chamada.'
      ],
      reflexao:
        'Qual regra ou cálculo das aulas anteriores você transformaria em uma função para reaproveitar várias vezes?',
      proximaAulaId: 'lesson-17'
    }
  },
  {
    id: 'lesson-16',
    numero: 16,
    modulo: 1,
    titulo: 'Funções: Reutilizando Blocos de Código',
    resumo:
      'Agrupe instruções em funções com function, passe valores por parâmetros e devolva resultados com return para evitar código repetido.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de criar funções em JavaScript, passar parâmetros para reutilizar a mesma lógica com dados diferentes e usar return para devolver um resultado.',
      contexto:
        'Nas últimas aulas você combinou decisões, repetições e arrays. Quando uma mesma regra precisa rodar em vários pontos do programa — como calcular um desconto, formatar uma mensagem ou validar uma pontuação — escrever tudo de novo toda hora dá trabalho e aumenta a chance de erro.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é uma função e como chamar',
          explicacao:
            'Uma função é um bloco de código com nome que pode ser executado sempre que você chamar esse nome seguido de parênteses:\n\nfunction saudar() {\n  console.log("Bem-vindo ao Codelab!");\n}\n\nsaudar(); // executa a função'
        },
        {
          titulo: '2. Parâmetros: enviando dados para a função',
          explicacao:
            'Parâmetros funcionam como variáveis de entrada declaradas entre os parênteses da função. Quando você chama a função passando valores (argumentos), ela usa esses dados naquele momento:\n\nfunction cumprimentar(nome) {\n  console.log("Olá, " + nome + "!");\n}\n\ncumprimentar("Ana");'
        },
        {
          titulo: '3. return: devolvendo o resultado para quem chamou',
          explicacao:
            'Além de exibir algo na tela, uma função pode calcular um valor e devolvê-lo usando return:\n\nfunction somar(a, b) {\n  return a + b;\n}\n\nconst resultado = somar(4, 6); // 10'
        }
      ],

      exemploCotidiano:
        'Pense em uma máquina de café: você escolhe o tipo (parâmetro), ela prepara e entrega a bebida pronta (return). Você não precisa montar a máquina toda vez que quer um café.',

      exemploCodigo:
        '// Função com parâmetros e return\nfunction calcularDobro(numero) {\n  return numero * 2;\n}\n\nconst dobroDeOito = calcularDobro(8);\nconsole.log(dobroDeOito); // 16\nconsole.log(calcularDobro(15)); // 30',

      resumo:
        'Funções agrupam lógica reutilizável com function, recebem entradas por parâmetros e devolvem valores calculados com return.'
    },

    pratica: {
      titulo: 'Crie uma função que calcula o dobro ou a pontuação bônus',
      enunciado:
        'Complete a função calcularBonus abaixo para retornar pontos + bonus.\n\nDepois, chame a função e exiba o resultado no console.',

      codigoInicial:
        'function calcularBonus(pontos, bonus) {\n  // Retorne a soma de pontos + bonus\n\n}\n\nconst totalComBonus = calcularBonus(50, 25);\nconsole.log(totalComBonus);',

      exemploSolucao:
        'function calcularBonus(pontos, bonus) {\n  return pontos + bonus;\n}\n\nconst totalComBonus = calcularBonus(50, 25);\nconsole.log(totalComBonus);',

      resultadoEsperado:
        'Exibe 75 no console ao chamar calcularBonus(50, 25).',

      dica:
        'Use a palavra return dentro da função para devolver pontos + bonus para a variável totalComBonus.'
    },

    quiz: [
      {
        pergunta: 'Para que serve a palavra-chave return dentro de uma função?',
        opcoes: [
          'Para devolver um valor produzido pela função para quem a chamou',
          'Para reiniciar o laço for do começo',
          'Para declarar uma constante global'
        ],
        respostaCorreta: 0,
        explicacao:
          'return envia o resultado da função de volta para o ponto onde ela foi chamada, permitindo guardar ou usar esse valor.'
      },
      {
        pergunta: 'Na função function multiplicar(x, y) { return x * y; }, o que são x e y?',
        opcoes: [
          'Parâmetros que recebem os valores passados na chamada da função',
          'Palavras reservadas para encerrar o programa',
          'Índices de um array'
        ],
        respostaCorreta: 0,
        explicacao:
          'x e y são parâmetros da função e assumem os valores enviados quando multiplicar(...) é invocada.'
      },
      {
        pergunta: 'Qual é o principal benefício de usar funções em vez de copiar e colar o mesmo código várias vezes?',
        opcoes: [
          'Evita repetição, centraliza a lógica em um lugar só e facilita manutenção',
          'Impede o uso de variáveis dentro do programa',
          'Faz o código rodar sem precisar de condições'
        ],
        respostaCorreta: 0,
        explicacao:
          'Reutilizar funções reduz duplicação e torna mais simples corrigir ou evoluir uma regra depois.'
      }
    ],

    conclusao: {
      aprendizados: [
        'Funções agrupam blocos de código reutilizáveis que rodam quando chamados.',
        'Parâmetros permitem que a mesma função funcione com diferentes valores de entrada.',
        'return devolve um resultado para ser usado ou exibido onde a função foi chamada.'
      ],
      reflexao:
        'Qual regra ou cálculo das aulas anteriores você transformaria em uma função para reaproveitar várias vezes?',
      proximaAulaId: 'lesson-17'
    }
  },
  {
    id: 'lesson-17',
    numero: 17,
    modulo: 1,
    titulo: 'Objetos: Organizando Dados com Propriedades',
    resumo:
      'Agrupe informações relacionadas de um mesmo item usando objetos com pares chave: valor, acesse dados com ponto e atualize propriedades.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de criar objetos em JavaScript com propriedades (chave e valor), ler valores usando notação de ponto e alterar propriedades existentes.',
      contexto:
        'Na Aula 14 você viu que arrays guardam listas de itens em sequência. Mas quando você quer descrever um único item com vários atributos — como um aluno com nome, nível e pontos, ou um produto com título, preço e estoque — usar várias variáveis soltas logo fica difícil de organizar. É aí que entram os objetos.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é um objeto ({ chave: valor })',
          explicacao:
            'Um objeto reúne informações relacionadas dentro de chaves { ... } no formato chave: valor, separadas por vírgula:\n\nconst aluno = {\n  nome: "Mariana",\n  nivel: 3,\n  ativo: true\n};\n\nCada par chave: valor é uma propriedade do objeto.'
        },
        {
          titulo: '2. Acessando propriedades com ponto (.)',
          explicacao:
            'Para ler uma propriedade de um objeto, usamos o nome do objeto seguido de um ponto e do nome da chave:\n\nconsole.log(aluno.nome);  // "Mariana"\nconsole.log(aluno.nivel); // 3'
        },
        {
          titulo: '3. Atualizando propriedades de um objeto',
          explicacao:
            'Assim como variáveis com let, as propriedades de um objeto podem ser atualizadas com =:\n\naluno.nivel = 4;\nconsole.log(aluno.nivel); // 4\n\nMesmo quando declaramos o objeto com const, podemos alterar suas propriedades internas.'
        }
      ],

      exemploCotidiano:
        'Pense na ficha de um personagem de jogo: o personagem é uma unidade só, mas dentro da ficha existem campos nomeados como nome, vida e mana. Em vez de procurar várias folhas espalhadas, tudo fica reunido no mesmo lugar.',

      exemploCodigo:
        '// Criando, lendo e atualizando um objeto\nconst produto = {\n  nome: "Fone Bluetooth",\n  preco: 199,\n  emEstoque: true\n};\n\nconsole.log(produto.nome);\nconsole.log(produto.preco);\n\nproduto.preco = 179;\nconsole.log(produto.preco);',

      resumo:
        'Objetos agrupam dados relacionados em pares chave: valor dentro de { ... }, permitem leitura com objeto.chave e permitem atualizar propriedades com =.'
    },

    pratica: {
      titulo: 'Crie um objeto de perfil e atualize uma propriedade',
      enunciado:
        'Complete o código abaixo criando um objeto jogador com nome e pontos, exibindo os valores iniciais com notação de ponto e somando +30 pontos em jogador.pontos.',

      codigoInicial:
        'const jogador = {\n  nome: "Rafael",\n  pontos: 70\n};\n\n// 1. Mostre nome e pontos no console usando ponto\n\n\n// 2. Atualize jogador.pontos para 100 e mostre novamente\n',

      exemploSolucao:
        'const jogador = {\n  nome: "Rafael",\n  pontos: 70\n};\n\n// 1. Mostre nome e pontos no console usando ponto\nconsole.log(jogador.nome);\nconsole.log(jogador.pontos);\n\n// 2. Atualize jogador.pontos para 100 e mostre novamente\njogador.pontos = 100;\nconsole.log(jogador.pontos);',

      resultadoEsperado:
        'Exibe "Rafael", 70 e, após a atualização, 100 no console.',

      dica:
        'Use jogador.pontos para acessar ou alterar o valor da propriedade pontos dentro do objeto jogador.'
    },

    quiz: [
      {
        pergunta: 'Dado const carro = { marca: "Toyota", ano: 2022 };, como acessamos o valor da marca?',
        opcoes: [
          'carro.marca',
          'carro->marca',
          'marca(carro)'
        ],
        respostaCorreta: 0,
        explicacao:
          'A notação de ponto (objeto.chave) lê o valor associado à propriedade marca do objeto carro.'
      },
      {
        pergunta: 'O que acontece ao executar conta.saldo = 250 em um objeto conta que tinha saldo: 100?',
        opcoes: [
          'Dá erro porque propriedades de objeto não podem mudar',
          'Atualiza a propriedade saldo para 250',
          'Cria um novo array chamado saldo'
        ],
        respostaCorreta: 1,
        explicacao:
          'Atribuir um novo valor a conta.saldo atualiza a propriedade existente para 250.'
      },
      {
        pergunta: 'Quando um objeto costuma ser mais adequado que um array?',
        opcoes: [
          'Quando queremos descrever um item com propriedades nomeadas (como nome, idade, preço)',
          'Quando queremos apenas somar dois números inteiros',
          'Quando queremos repetir um bloco de código 10 vezes'
        ],
        respostaCorreta: 0,
        explicacao:
          'Objetos organizam atributos nomeados de um mesmo item, enquanto arrays ordenam listas de valores.'
      }
    ],

    conclusao: {
      aprendizados: [
        'Objetos agrupam informações relacionadas usando pares chave: valor.',
        'A notação de ponto (objeto.chave) acessa o valor de uma propriedade.',
        'É possível atualizar propriedades de um objeto atribuindo um novo valor a elas.'
      ],
      reflexao:
        'Se você fosse representar uma aula ou uma tarefa em um aplicativo usando um objeto, quais propriedades (chaves) faria sentido colocar nele?',
      proximaAulaId: 'lesson-18'
    }
  },
  {
    id: 'lesson-18',
    numero: 18,
    modulo: 1,
    titulo: 'Mini-Projeto: Integrando Tudo do Módulo 1',
    resumo:
      'Combine variáveis, condições, laços for, arrays, funções e objetos em um mini-projeto completo para consolidar os fundamentos.',

    introducao: {
      objetivo:
        'Ao final desta aula, você será capaz de juntar variáveis, condicionais, repetições, arrays, funções e objetos para resolver um pequeno problema completo em JavaScript.',
      contexto:
        'Até aqui você aprendeu cada ferramenta de JavaScript separadamente. Em programas reais, essas peças trabalham juntas: um objeto guarda dados do item, um array reúne vários valores, uma função processa uma regra, um for percorre a lista e um if/else decide a mensagem final.'
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Como as peças se conectam em um programa',
          explicacao:
            'Pense em um sistema simples de progresso ou pontuação:\n• Um objeto representa o aluno ou a sessão (ex.: nome, meta).\n• Um array guarda as pontuações ou tarefas concluídas.\n• Um for soma ou percorre esses valores.\n• Uma função calcula o resultado e um if/else classifica o status.'
        },
        {
          titulo: '2. Dividindo o problema em etapas pequenas',
          explicacao:
            'Quando um problema parece grande, quebre em passos curtos:\n1. Definir os dados iniciais (objeto e array).\n2. Escrever a função que calcula o total.\n3. Usar uma condição (if / else) para gerar o feedback.\n4. Exibir tudo com clareza no console.'
        },
        {
          titulo: '3. Revisão rápida dos pilares do Módulo 1',
          explicacao:
            '• const e let para valores fixos e variáveis que mudam.\n• string, number e boolean para representar os dados corretos.\n• Comparações, operadores lógicos, if/else e switch para decisões.\n• while, for, arrays e funções para repetir, organizar e reutilizar.'
        }
      ],

      exemploCotidiano:
        'É como montar um painel de treinos da semana: você tem o nome do atleta e a meta num objeto, a lista de minutos por dia num array, uma função que soma o total e uma regra que diz se a meta da semana foi batida.',

      exemploCodigo:
        '// Mini-projeto: resumo de XP de um aluno\nconst perfil = {\n  nome: "Lucas",\n  metaXp: 100\n};\n\nconst xpPorAtividade = [30, 40, 35];\n\nfunction somarLista(numeros) {\n  let total = 0;\n  for (let i = 0; i < numeros.length; i++) {\n    total = total + numeros[i];\n  }\n  return total;\n}\n\nconst totalXp = somarLista(xpPorAtividade);\n\nconsole.log("Aluno: " + perfil.nome);\nconsole.log("Total XP: " + totalXp);\n\nif (totalXp >= perfil.metaXp) {\n  console.log("Status: Meta atingida!");\n} else {\n  console.log("Status: Em andamento");\n}',

      resumo:
        'Integrar objetos, arrays, loops, funções e condicionais permite resolver problemas completos de forma organizada, legível e fácil de evoluir.'
    },

    pratica: {
      titulo: 'Monte o resumo de pontos de uma missão',
      enunciado:
        'Complete o código abaixo criando a função somarPontos(lista) para somar os valores do array pontosFases e use o if / else já iniciado para exibir se a meta foi batida.\n\nDepois, exiba o nome do jogador e o total de pontos no console.',

      codigoInicial:
        'const jogador = {\n  nome: "Sofia",\n  meta: 120\n};\n\nconst pontosFases = [40, 50, 35];\n\nfunction somarPontos(lista) {\n  let soma = 0;\n  // Percorra "lista" com for e acumule em "soma"\n\n  return soma;\n}\n\nconst totalPontos = somarPontos(pontosFases);\nconsole.log(jogador.nome);\nconsole.log(totalPontos);\n\nif (totalPontos >= jogador.meta) {\n  console.log("Missão concluída!");\n} else {\n  console.log("Continue tentando!");\n}',

      exemploSolucao:
        'const jogador = {\n  nome: "Sofia",\n  meta: 120\n};\n\nconst pontosFases = [40, 50, 35];\n\nfunction somarPontos(lista) {\n  let soma = 0;\n  for (let i = 0; i < lista.length; i++) {\n    soma = soma + lista[i];\n  }\n  return soma;\n}\n\nconst totalPontos = somarPontos(pontosFases);\nconsole.log(jogador.nome);\nconsole.log(totalPontos);\n\nif (totalPontos >= jogador.meta) {\n  console.log("Missão concluída!");\n} else {\n  console.log("Continue tentando!");\n}',

      resultadoEsperado:
        'Exibe "Sofia", 125 (40 + 50 + 35) e, como 125 >= 120, exibe "Missão concluída!" no console.',

      dica:
        'Dentro do for em somarPontos(lista), use soma = soma + lista[i]; e garanta que a função retorne soma no final.'
    },

    quiz: [
      {
        pergunta: 'Em um mini-projeto que tem um objeto usuario, um array de notas e uma função de média, qual é o papel principal da função?',
        opcoes: [
          'Isolar o cálculo da média para poder reutilizá-lo e manter o código organizado',
          'Substituir todos os tipos booleanos por strings',
          'Impedir que o código use condicionais'
        ],
        respostaCorreta: 0,
        explicacao:
          'Funções organizam regras específicas (como calcular um total ou média) e permitem reaproveitar a mesma lógica com diferentes dados.'
      },
      {
        pergunta: 'Ao somar os números de um array dentro de um for, por que costumamos iniciar let soma = 0; antes do laço?',
        opcoes: [
          'Porque 0 é o elemento neutro da soma e evita começar com um valor indesejado ou undefined',
          'Porque o JavaScript exige que toda variável comece em 0',
          'Para impedir que o laço rode mais de uma vez'
        ],
        respostaCorreta: 0,
        explicacao:
          'Começar o acumulador em 0 garante que somar cada item (soma + lista[i]) produza o total exato desde o primeiro elemento.'
      },
      {
        pergunta: 'Se totalPontos é 125 e jogador.meta é 120, qual bloco roda em if (totalPontos >= jogador.meta) { ... } else { ... }?',
        opcoes: [
          'O bloco do if, pois 125 >= 120 é true',
          'O bloco do else, pois 125 é maior que 120',
          'Nenhum dos dois blocos'
        ],
        respostaCorreta: 0,
        explicacao:
          'Como 125 é maior ou igual a 120, a condição é verdadeira (true) e executa o bloco do if.'
      }
    ],

    conclusao: {
      aprendizados: [
        'Objetos, arrays, laços for, funções e condicionais trabalham juntos para resolver problemas reais.',
        'Dividir o código em etapas pequenas facilita entender, testar e corrigir cada parte.',
        'Você concluiu a base essencial de lógica e fundamentos de JavaScript do Módulo 1.'
      ],
      reflexao:
        'Qual conceito deste Módulo 1 pareceu mais natural para você e qual você quer praticar mais antes de avançar?',
      proximaAulaId: null
    }
  }

]