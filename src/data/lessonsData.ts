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

export interface ItemClassificacao {
  texto: string
  categoriaCorreta: string
}

export interface ConfigClassificacao {
  categorias: string[]
  itens: ItemClassificacao[]
  acertoMsg?: string
  erroMsg?: string
}

export interface ConfigMontarBlocos {
  blocosDisponiveis: string[]
  respostaCorreta: string[]
  acertoMsg?: string
  erroMsg?: string
}

export interface ConfigCacaErro {
  etapas: string[]
  indiceErro: number
  acertoMsg?: string
  erroMsg?: string
}

export interface AcaoSimulador {
  rotulo: string
  delta: number
}

export interface ConfigSimuladorEstado {
  rotuloEstado: string
  valorInicial: number
  alvo: number
  comparador?: '>=' | '==' | '<='
  descricaoMeta: string
  acoes: AcaoSimulador[]
  acertoMsg?: string
  erroMsg?: string
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
    frases?: string[]
    ordemCorreta?: string[]
    acertoMsg?: string
    erroMsg?: string
    classificacao?: ConfigClassificacao
    montarBlocos?: ConfigMontarBlocos
    cacaErro?: ConfigCacaErro
    simuladorEstado?: ConfigSimuladorEstado
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
    titulo: 'Como o Código Pensa: Sequência e Ordem',
    resumo:
      'Entenda por que o computador executa instruções uma por vez, na ordem certa, e o que acontece quando a sequência sai errada.',

    introducao: {
      objetivo:
        'Compreender a execução sequencial de instruções e perceber por que a ordem dos passos muda o resultado final.',
      contexto:
        'Programar não é mágica: é escrever passos claros para uma máquina que segue ordens literalmente, do começo ao fim, sem adivinhar o que você quis dizer.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O computador executa passo a passo',
          explicacao:
            'Um programa funciona como uma receita ou um roteiro: cada linha ou instrução é avaliada na sequência em que aparece. Se um passo depende de outro anterior, pular ou inverter a ordem quebra o processo.',
        },
        {
          titulo: '2. Literalidade: ele faz o que foi escrito, não o que você imaginou',
          explicacao:
            'Pessoas completam lacunas sozinhas no dia a dia; o código não. Se você manda abrir a porta antes de destrancar, ou mostrar o resultado antes de calcular, o processo falha exatamente por causa da ordem.',
        },
        {
          titulo: '3. Pré-requisito antes de usar',
          explicacao:
            'Quase toda tarefa tem um antes e um depois: primeiro você prepara ou obtém o dado/estado, depois usa ou transforma esse valor. Essa base de "preparar antes de usar" vai acompanhar você em variáveis, funções e listas.',
        },
      ],

      exemploCotidiano:
        'Situação real — fazer café coado:\nVocê não coloca a água quente na xícara antes de colocar o pó no filtro e posicionar a xícara embaixo. A ordem dos passos define se o resultado sai certo.',

      exemploCodigo:
        '// A ordem das instruções define o resultado\npasso1: preparar o ingrediente base\npasso2: aplicar a regra ou transformação\npasso3: exibir o resultado final',

      resumo:
        'O código roda de forma sequencial e literal: cada passo precisa vir na ordem certa para que o próximo funcione.',
    },

    pratica: {
      titulo: 'Ordene os passos de uma tarefa simples',
      enunciado:
        'Coloque as ações abaixo na sequência lógica correta do início ao fim para salvar e abrir um documento:',
      codigoInicial: '// Organize os passos da primeira etapa até a última',
      resultadoEsperado:
        'Ordenar os passos do início ao fim respeitando a dependência entre cada ação.',
      dica:
        'Pense no que precisa acontecer primeiro: escrever o conteúdo, salvar o arquivo, fechar e só depois reabrir.',
      frases: [
        'Salvar o arquivo no computador',
        'Escrever o texto no documento',
        'Abrir o arquivo novamente para conferir',
        'Fechar o documento aberto',
      ],
      ordemCorreta: [
        'Escrever o texto no documento',
        'Salvar o arquivo no computador',
        'Fechar o documento aberto',
        'Abrir o arquivo novamente para conferir',
      ],
      acertoMsg:
        'Mandou bem! Cada passo ficou na ordem certa, respeitando o que vem antes e o que vem depois.',
      erroMsg:
        'Algum passo está fora de ordem. Confira o que precisa acontecer primeiro antes de fechar ou reabrir.',
    },

    quiz: [
      {
        pergunta: 'O que significa dizer que um programa é executado de forma sequencial?',
        opcoes: [
          'Que as instruções são processadas uma após a outra, seguindo uma ordem',
          'Que todas as linhas rodam ao mesmo tempo em ordem aleatória',
          'Que o computador pula automaticamente os passos que parecem difíceis',
        ],
        respostaCorreta: 0,
        explicacao:
          'Execução sequencial significa seguir as instruções na ordem definida, passo a passo.',
      },
      {
        pergunta: 'Por que inverter dois passos dependentes costuma causar erro ou resultado errado?',
        opcoes: [
          'Porque o segundo passo pode depender de algo que ainda não foi feito ou preparado',
          'Porque o computador muda o idioma do código sozinho',
          'Porque a última linha sempre apaga as anteriores',
        ],
        respostaCorreta: 0,
        explicacao:
          'Quando um passo exige um pré-requisito, executá-lo antes da hora quebra a lógica.',
      },
      {
        pergunta: 'Como o computador lida com instruções em comparação ao raciocínio humano?',
        opcoes: [
          'Ele segue exatamente o que foi instruído, sem "adivinhar" intenções implícitas',
          'Ele sempre entende o que o programador quis dizer mesmo se faltar um passo',
          'Ele ignora a ordem das linhas quando o código é curto',
        ],
        respostaCorreta: 0,
        explicacao:
          'A execução é literal: o comportamento depende da sequência exata escrita.',
      },
    ],

    conclusao: {
      aprendizados: [
        'O código executa instruções passo a passo na ordem em que são organizadas.',
        'A ordem dos passos importa porque ações posteriores costumam depender de ações anteriores.',
        'Pensar na sequência antes de codificar evita falhas lógicas simples.',
      ],
      reflexao:
        'Na sua rotina, qual tarefa já deu errado ou ficou estranha simplesmente porque dois passos foram feitos fora de ordem?',
      proximaAulaId: 'lesson-2',
    },
  },
  {
    id: 'lesson-2',
    numero: 2,
    modulo: 1,
    titulo: 'Condições no Dia a Dia: Se Isso, Faça Aquilo',
    resumo:
      'Veja como decisões mudam o caminho de uma sequência quando uma condição é atendida ou não.',

    introducao: {
      objetivo:
        'Entender o raciocínio condicional ("se uma condição acontecer, siga um caminho; senão, siga outro") e como ele se encaixa na ordem dos passos.',
      contexto:
        'Na Aula 1, vimos que a ordem dos passos define o resultado. Mas nem toda sequência é reta: às vezes o próximo passo depende de uma verificação no meio do caminho, como checar se há saldo, se chove ou se o campo está preenchido.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Uma condição é uma pergunta com resposta sim ou não',
          explicacao:
            'No dia a dia, tomamos decisões o tempo todo avaliando uma situação: "A bateria está baixa?", "O usuário digitou a senha?", "Tem item em estoque?". Cada verificação dessas funciona como um filtro que aponta para uma resposta clara: verdadeiro (sim) ou falso (não).',
        },
        {
          titulo: '2. O caminho do "SE" e o caminho do "SENÃO"',
          explicacao:
            'Quando a condição é verdadeira, o programa executa uma ação específica. Quando ela é falsa, ele pode seguir um caminho alternativo (o "senão") ou simplesmente pular aquela ação e continuar o fluxo.',
        },
        {
          titulo: '3. A condição precisa ser verificada no momento certo',
          explicacao:
            'Assim como na Aula 1, a ordem importa: testar uma condição depois que o passo já aconteceu tarde demais não impede o efeito. Primeiro você avalia a condição; depois escolhe o que fazer.',
        },
      ],

      exemploCotidiano:
        'Situação real — sair de casa com guarda-chuva:\nAntes de sair, você olha para o céu ("está chovendo?"). Se sim, pega o guarda-chuva; senão, segue direto sem ele. A decisão acontece antes do passo de atravessar a rua.',

      exemploCodigo:
        '// Raciocínio condicional em pseudocódigo\nSE bateria <= 15%:\n  ativar modo economia\nSENAO:\n  manter desempenho normal',

      resumo:
        'Condições avaliam uma situação para escolher entre caminhos diferentes — sempre no momento certo da sequência.',
    },

    pratica: {
      titulo: 'Classifique qual ação acontece em cada cenário',
      enunciado:
        'Considere a regra abaixo para liberar entrada em uma sala de estudo e toque na ação correta para cada situação:\n\nRegra: SE crachaValido === "sim", liberar catraca; SENAO, chamar recepcao.',
      codigoInicial:
        '// Regra de acesso:\n// crachaValido === "sim" -> "Liberar catraca"\n// caso contrário -> "Chamar recepção"',
      resultadoEsperado:
        'Associar corretamente cada situação de entrada à ação correspondente da regra condicional.',
      dica:
        'Veja quando a condição do crachá é atendida ("sim") e quando ela falha ("não" ou ausente).',
      classificacao: {
        categorias: ['Liberar catraca', 'Chamar recepção'],
        itens: [
          {
            texto: 'Aluno apresenta crachá válido ("sim")',
            categoriaCorreta: 'Liberar catraca',
          },
          {
            texto: 'Aluno esqueceu o crachá ("não")',
            categoriaCorreta: 'Chamar recepção',
          },
          {
            texto: 'Visitante com crachá vencido ("não")',
            categoriaCorreta: 'Chamar recepção',
          },
        ],
        acertoMsg:
          'Mandou bem! Você ligou cada situação à resposta certa da condição.',
        erroMsg:
          'Alguma situação ficou sem resposta ou com a ação trocada. Confira quando a condição é verdadeira ou falsa.',
      },
    },

    quiz: [
      {
        pergunta: 'O que uma condição faz dentro de uma sequência de passos?',
        opcoes: [
          'Avalia uma situação para decidir qual caminho ou ação seguir',
          'Repete um bloco de código para sempre sem olhar o estado atual',
          'Substitui a necessidade de ter uma ordem entre os passos',
        ],
        respostaCorreta: 0,
        explicacao:
          'Condições servem para direcionar o fluxo conforme uma situação seja verdadeira ou falsa.',
      },
      {
        pergunta: 'Se uma regra diz "SE estoque > 0, confirmar pedido; SENAO, avisar esgotado", o que acontece quando estoque é 0?',
        opcoes: [
          'A condição falha e o caminho do "SENAO" avisa que está esgotado',
          'A condição passa e o pedido é confirmado mesmo sem estoque',
          'Nenhuma das ações acontece e o fluxo trava',
        ],
        respostaCorreta: 0,
        explicacao:
          'Como estoque > 0 não é atendido quando vale 0, o fluxo segue para o caminho alternativo.',
      },
      {
        pergunta: 'Por que verificar uma condição antes da ação principal costuma ser essencial?',
        opcoes: [
          'Porque a decisão precisa orientar o próximo passo antes que ele seja executado',
          'Porque o código só lê condições no final do arquivo',
          'Porque condições não funcionam se vierem antes de uma ação',
        ],
        respostaCorreta: 0,
        explicacao:
          'Checar o estado antes de agir evita executar um passo indevido.',
      },
    ],

    conclusao: {
      aprendizados: [
        'Condições avaliam uma situação para escolher entre caminhos diferentes.',
        'Quando a condição não é atendida, o fluxo pode seguir um caminho alternativo ou continuar sem aquela ação.',
        'A ordem de verificar a condição antes de agir mantém a lógica coerente.',
      ],
      reflexao:
        'Em um formulário de cadastro, qual condição você checaria antes de permitir enviar os dados?',
      proximaAulaId: 'lesson-3',
    },
  },
  {
    id: 'lesson-3',
    numero: 3,
    modulo: 1,
    titulo: 'Decomposição e Resolução de Problemas',
    resumo:
      'Quebre problemas grandes em etapas pequenas e claras antes de escrever código, preparando o terreno para guardar dados.',

    introducao: {
      objetivo:
        'Aprender a dividir um problema complexo em partes menores e independentes para resolver cada etapa com clareza.',
      contexto:
        'Até aqui vimos a importância da ordem dos passos (Aula 1) e como condições desviam caminhos (Aula 2). Quando um problema parece grande demais de uma vez, o segredo é fatiá-lo em etapas simples — um hábito essencial antes de começar a guardar valores e escrever regras.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é decompor um problema',
          explicacao:
            'Decompor significa pegar um objetivo maior — como "calcular o frete e liberar o pedido" — e dividi-lo em partes menores: ler os dados, verificar condições, calcular o valor e mostrar o resultado.',
        },
        {
          titulo: '2. Resolver uma parte de cada vez reduz erros',
          explicacao:
            'Tentar resolver tudo mentalmente de uma só vez sobrecarrega a atenção e esconde falhas. Ao isolar cada etapa, você consegue testar se aquela parte faz sentido antes de juntar com a próxima.',
        },
        {
          titulo: '3. Identificar o que entra, o que muda e o que sai',
          explicacao:
            'Em quase todo problema, vale perguntar: quais informações eu recebo ou guardo no início, qual decisão ou conta acontece no meio e qual resposta eu preciso entregar no final? Essa visão vai guiar o uso de variáveis a partir da próxima aula.',
        },
      ],

      exemploCotidiano:
        'Situação real — organizar uma viagem curta:\nEm vez de pensar em "viajar" como um bloco único, você divide em: escolher o destino, checar o orçamento, separar os itens essenciais e definir o horário de saída.',

      exemploCodigo:
        '// Decompondo um problema em etapas claras\n// 1. Coletar/guardar os dados necessários\n// 2. Avaliar a regra ou condição\n// 3. Produzir e exibir o resultado',

      resumo:
        'Dividir um problema grande em etapas menores torna cada passo mais simples de entender, conferir e conectar.',
    },

    pratica: {
      titulo: 'Ordene as etapas para resolver um problema por partes',
      enunciado:
        'Coloque as etapas abaixo na sequência lógica para resolver o problema de "verificar se o aluno passou na atividade e exibir o status":',
      codigoInicial:
        '// Do primeiro passo de análise até a resposta final',
      resultadoEsperado:
        'Ordenar as etapas de decomposição do problema da entrada de dados até a exibição do resultado.',
      dica:
        'Primeiro você reúne os valores necessários, depois compara com a regra de aprovação, e por fim monta ou exibe a mensagem.',
      frases: [
        'Exibir a mensagem de aprovado ou ajuste necessário',
        'Obter a pontuação do aluno e a meta mínima',
        'Comparar a pontuação obtida com a meta mínima',
      ],
      ordemCorreta: [
        'Obter a pontuação do aluno e a meta mínima',
        'Comparar a pontuação obtida com a meta mínima',
        'Exibir a mensagem de aprovado ou ajuste necessário',
      ],
      acertoMsg:
        'Mandou bem! Você dividiu o problema em entrada, decisão e resultado na ordem certa.',
      erroMsg:
        'A ordem das etapas não ficou natural. Veja o que precisa existir primeiro antes de comparar ou exibir.',
    },

    quiz: [
      {
        pergunta: 'O que significa decompor um problema na resolução lógica?',
        opcoes: [
          'Dividir um problema maior em etapas menores e mais fáceis de resolver',
          'Apagar partes do problema até sobrar apenas uma linha de código',
          'Executar todas as etapas ao mesmo tempo sem ordem',
        ],
        respostaCorreta: 0,
        explicacao:
          'Decompor é quebrar um desafio complexo em partes manejáveis e verificáveis.',
      },
      {
        pergunta: 'Qual é a principal vantagem de quebrar um problema em partes antes de programar?',
        opcoes: [
          'Facilita enxergar cada etapa, testar a lógica e evitar confusão com tudo junto',
          'Elimina a necessidade de pensar em condições ou sequências',
          'Faz o código rodar mais rápido sem variáveis',
        ],
        respostaCorreta: 0,
        explicacao:
          'Separar em etapas clareia o raciocínio e torna mais simples localizar onde uma regra falha.',
      },
      {
        pergunta: 'Ao planejar a solução de uma tarefa, qual trio ajuda a estruturar o raciocínio?',
        opcoes: [
          'Dados/entradas iniciais, verificação ou processamento, e resultado final',
          'Apenas cores de tela, fontes e animações',
          'Repetição infinita, salto de linha e comentário',
        ],
        respostaCorreta: 0,
        explicacao:
          'Pensar no que entra, como é avaliado/transformado e o que sai dá base para organizar o código.',
      },
    ],

    conclusao: {
      aprendizados: [
        'Decompor ajuda a enfrentar problemas grandes dividindo-os em passos simples.',
        'Separar o que entra, o que é avaliado e o que sai deixa a solução mais organizada.',
        'Com a base de lógica e decomposição pronta, fica mais claro guardar e manipular valores em variáveis.',
      ],
      reflexao:
        'Se você fosse criar uma calculadora simples de gorjeta ou divisão de conta, quais seriam as 3 primeiras etapas?',
      proximaAulaId: 'lesson-4',
    },
  },
  {
    id: 'lesson-4',
    numero: 4,
    modulo: 2,
    titulo: 'Variáveis, const e let: Guardando Valores',
    resumo:
      'Aprenda a nomear e guardar informações em variáveis e saiba quando escolher const ou let sem errar.',

    introducao: {
      objetivo:
        'Entender o papel das variáveis como espaços nomeados na memória e decidir quando usar const ou let.',
      contexto:
        'Na Aula 3, vimos que resolver um problema começa reunindo os dados de que precisamos. No código, guardamos esses valores em variáveis com nomes claros para reaproveitá-los ao longo do programa.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é uma variável e por que dar bons nomes',
          explicacao:
            'Uma variável guarda um valor sob um nome (identificador) para que você possa ler ou reutilizar esse dado depois. Nomes claros como pontuacao ou metaMinima deixam o código legível; nomes vagos como x ou coisa1 escondem o sentido do valor.',
        },
        {
          titulo: '2. const: valor fixo que não será reatribuído',
          explicacao:
            'Use const por padrão quando o valor não deve ser trocado por outra atribuição após ser criado — por exemplo, a taxa fixa de entrega, o limite de tentativas ou o nome de um usuário fixo naquele contexto.',
        },
        {
          titulo: '3. let: valor que muda durante a execução',
          explicacao:
            'Use let quando você sabe que o valor vai ser atualizado ao longo do caminho — como um contador de pontos, o saldo restante ou o status de uma etapa que muda de "pendente" para "concluida".',
        },
        {
          titulo: '4. Regra prática de escolha',
          explicacao:
            'Comece perguntando: esse valor vai mudar por reatribuição durante o fluxo? Se não vai, prefira const; se vai mudar, use let. Isso evita alterações acidentais em dados que deveriam permanecer estáveis.',
        },
      ],

      exemploCotidiano:
        'Situação real — placar de uma partida:\nO nome do time (const time = "CodeLab FC") permanece o mesmo durante o jogo, enquanto o placar (let gols = 0) muda cada vez que sai um gol.',

      exemploCodigo:
        '// const para valores fixos; let para valores que mudam\nconst metaPontos = 100\nlet pontosAtuais = 40\n\npontosAtuais = pontosAtuais + 20\nconsole.log(pontosAtuais) // 60',

      resumo:
        'Variáveis guardam dados com nomes claros: use const quando o valor não muda por reatribuição e let quando ele precisa ser atualizado.',
    },

    pratica: {
      titulo: 'Classifique quando usar const ou let',
      enunciado:
        'Leia cada cenário de variável e toque na palavra-chave (const ou let) mais adequada para declará-la:',
      codigoInicial:
        '// Escolha const (fixo) ou let (variável que muda)\n// para cada dado abaixo',
      resultadoEsperado:
        'Diferenciar corretamente valores que permanecem fixos (const) de valores que mudam (let).',
      dica:
        'Se o valor vai ser atualizado várias vezes ao longo do processo, escolha let; se é uma referência ou limite fixo, escolha const.',
      classificacao: {
        categorias: ['const', 'let'],
        itens: [
          {
            texto: 'Pontuação atual do jogador que sobe a cada acerto',
            categoriaCorreta: 'let',
          },
          {
            texto: 'Valor máximo permitido em uma tentativa (100)',
            categoriaCorreta: 'const',
          },
          {
            texto: 'Contador de passos que avança a cada rodada',
            categoriaCorreta: 'let',
          },
          {
            texto: 'Moeda padrão do sistema ("BRL")',
            categoriaCorreta: 'const',
          },
        ],
        acertoMsg:
          'Mandou bem! Você separou os valores que mudam (let) dos valores que se mantêm fixos (const).',
        erroMsg:
          'Algum item ficou sem escolha ou trocado. Pergunte-se se o valor vai mudar por reatribuição durante a execução.',
      },
    },

    quiz: [
      {
        pergunta: 'Qual é a diferença principal entre usar const e let no JavaScript?',
        opcoes: [
          'const impede reatribuir um novo valor à variável; let permite reatribuir novos valores depois',
          'const só funciona com textos e let só funciona com números',
          'let não pode mudar de valor em nenhuma hipótese',
        ],
        respostaCorreta: 0,
        explicacao:
          'const não permite reatribuição direta após a criação, enquanto let permite atualizar o valor guardado.',
      },
      {
        pergunta: 'Qual nome de variável é mais claro para guardar a quantidade de vidas restantes?',
        opcoes: [
          'vidasRestantes',
          'v1',
          'dado',
        ],
        respostaCorreta: 0,
        explicacao:
          'Nomes descritivos como vidasRestantes deixam explícito o que o valor representa no código.',
      },
      {
        pergunta: 'Se você vai somar pontos a cada resposta certa durante uma rodada, qual declaração faz mais sentido para a pontuação atual?',
        opcoes: [
          'let pontuacaoAtual = 0',
          'const pontuacaoAtual = 0 (e depois fazer pontuacaoAtual = 10)',
          'Nenhuma declaração, basta escrever o número solto',
        ],
        respostaCorreta: 0,
        explicacao:
          'Como a pontuação será atualizada com novos valores ao longo da rodada, let é a escolha adequada.',
      },
    ],

    conclusao: {
      aprendizados: [
        'Variáveis armazenam valores em espaços nomeados para serem reutilizados com clareza.',
        'const é indicado para valores que não devem ser reatribuídos.',
        'let é indicado quando o valor precisa mudar durante o fluxo do programa.',
      ],
      reflexao:
        'Em uma lista de compras simples, o que faria sentido ser const e o que faria sentido ser let?',
      proximaAulaId: 'lesson-5',
    },
  },
  {
    id: 'lesson-5',
    numero: 5,
    modulo: 2,
    titulo: 'Tipos de Dados e Operações: Textos, Números e Booleanos',
    resumo:
      'Reconheça string, number e boolean e entenda como o tipo do valor muda o resultado das operações.',

    introducao: {
      objetivo:
        'Identificar os tipos primitivos fundamentais (string, number e boolean) e evitar confusões comuns entre operações matemáticas e de texto.',
      contexto:
        'Na Aula 4, guardamos valores em variáveis com const e let. Agora precisamos olhar para o conteúdo dentro dessas variáveis: um número se comporta diferente de um texto, e valores booleanos representam estados de verdadeiro ou falso.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. string: textos entre aspas',
          explicacao:
            'Uma string representa texto — como "Olá, CodeLab", "10" ou "ativo" — sempre delimitada por aspas. Repare que "10" entre aspas é um texto, não um valor numérico para fazer contas.',
        },
        {
          titulo: '2. number: números para cálculos e medidas',
          explicacao:
            'O tipo number guarda números inteiros ou decimais (como 10, 0 ou 19.9) usados em somas, subtrações, multiplicações e divisões.',
        },
        {
          titulo: '3. boolean: apenas true ou false',
          explicacao:
            'Um boolean só assume dois valores: true (verdadeiro) ou false (falso). Ele é ideal para flags e estados, como estaLogado = true ou pagamentoAprovado = false, preparando o caminho para comparações e condições.',
        },
        {
          titulo: '4. Cuidado ao misturar texto e número com +',
          explicacao:
            'Com números, + soma (10 + 5 vira 15). Quando há uma string envolvida, + junta textos (concatena): "10" + 5 vira "105". Saber o tipo evita resultados inesperados.',
        },
      ],

      exemploCotidiano:
        'Situação real — quantidade de itens no carrinho:\nSe qtd = 2 (number) e voce adiciona mais 1, o total vira 3. Já se alguem guarda "2" como texto e junta com "1", vira "21" — um erro clássico de tipo.',

      exemploCodigo:
        '// Tipos básicos e comportamento de + \nconst nomeCurso = "CodeLab" // string\nconst aulasFeitas = 5     // number\nconst concluido = false   // boolean\n\nconsole.log(aulasFeitas + 1)      // 6\nconsole.log("Aula " + aulasFeitas) // "Aula 5"',

      resumo:
        'string guarda texto, number guarda números para cálculos e boolean guarda true ou false — e o tipo define como + atua.',
    },

    pratica: {
      titulo: 'Classifique o tipo ou o resultado de cada expressão',
      enunciado:
        'Observe cada valor ou expressão abaixo e toque na classificação correta:',
      codigoInicial:
        '// Identifique o tipo (string, number, boolean)\n// ou o resultado exato da expressão',
      resultadoEsperado:
        'Diferenciar corretamente string, number, boolean e o efeito de + entre números e textos.',
      dica:
        'Aspas indicam string; números sem aspas são number; true e false são boolean.',
      classificacao: {
        categorias: ['string', 'number', 'boolean', '"105"'],
        itens: [
          {
            texto: 'true',
            categoriaCorreta: 'boolean',
          },
          {
            texto: '"CodeLab"',
            categoriaCorreta: 'string',
          },
          {
            texto: '42',
            categoriaCorreta: 'number',
          },
          {
            texto: '"10" + 5',
            categoriaCorreta: '"105"',
          },
        ],
        acertoMsg:
          'Mandou bem! Você identificou os tipos primitivos e viu como "10" + 5 junta texto.',
        erroMsg:
          'Algum item ficou sem escolha ou com classificação trocada. Confira aspas, booleanos e a junção com +.',
      },
    },

    quiz: [
      {
        pergunta: 'Qual tipo de dado assume exclusivamente os valores true ou false?',
        opcoes: [
          'boolean',
          'number',
          'string',
        ],
        respostaCorreta: 0,
        explicacao:
          'O tipo boolean representa valores lógicos: true ou false.',
      },
      {
        pergunta: 'Qual é o resultado da expressão "7" + 3 em JavaScript?',
        opcoes: [
          '"73" (concatenação de texto, pois "7" é uma string)',
          '10 (soma matemática)',
          'false',
        ],
        respostaCorreta: 0,
        explicacao:
          'Como "7" é uma string, o operador + concatena e produz a string "73".',
      },
      {
        pergunta: 'Por que guardar uma idade como 18 (number) em vez de "18" (string) é melhor para fazer contas?',
        opcoes: [
          'Porque number permite operações numéricas diretas sem risco de virar texto colado',
          'Porque números com aspas não podem ser guardados em variáveis',
          'Porque number sempre vira true em qualquer conta',
        ],
        respostaCorreta: 0,
        explicacao:
          'Trabalhar com number mantém o dado pronto para contas e comparações numéricas.',
      },
    ],

    conclusao: {
      aprendizados: [
        'string representa textos, number representa números e boolean representa true ou false.',
        'O operador + soma valores numéricos, mas concatena quando há string envolvida.',
        'Reconhecer o tipo de cada dado previne bugs antes mesmo de escrever comparações e condições.',
      ],
      reflexao:
        'Se um campo de formulário chega como texto "25", o que você precisaria considerar antes de somar 5 a ele?',
      proximaAulaId: 'lesson-6',
    },
  },
  {
    id: 'lesson-6',
    numero: 6,
    modulo: 2,
    titulo: 'Comparações: Produzindo true ou false',
    resumo:
      'Compare valores com ===, !==, >, <, >= e <= e entenda como toda comparação gera um resultado booleano.',

    introducao: {
      objetivo:
        'Aprender a usar os operadores de comparação do JavaScript e prever com segurança se uma expressão resulta em true ou false.',
      contexto:
        'Na Aula 5, vimos que booleanos guardam true ou false. Mas de onde vêm esses valores na prática? Muitas vezes, eles nascem de comparações entre variáveis — como conferir se a pontuação atingiu a meta ou se a senha digitada confere.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Toda comparação responde true ou false',
          explicacao:
            'Quando você compara dois valores, o resultado é sempre um boolean: true se a afirmação for verdadeira, ou false se for falsa. Esse resultado é exatamente o que vai alimentar regras e condições nas próximas aulas.',
        },
        {
          titulo: '2. Igualdade e diferença estrita: === e !==',
          explicacao:
            'Use === para verificar se dois valores são iguais no conteúdo e no tipo, e !== para verificar se são diferentes. Prefira === e !== em vez de == e != para evitar conversões implícitas surpresa, como "5" == 5 virando true enquanto "5" === 5 é false.',
        },
        {
          titulo: '3. Maior, menor e limites: >, <, >= e <=',
          explicacao:
            'Operadores como > (maior que) e < (menor que) exigem passar do limite, enquanto >= (maior ou igual) e <= (menor ou igual) incluem o próprio valor limite. Em uma meta de 70 pontos, 70 >= 70 é true, mas 70 > 70 é false.',
        },
        {
          titulo: '4. Atenção à diferença entre = e ===',
          explicacao:
            'Um único sinal de igual (=) guarda/atribui um valor a uma variável; três sinais (===) comparam se dois valores são estritamente iguais. Confundir os dois é um erro comum no início.',
        },
      ],

      exemploCotidiano:
        'Situação real — limite de compras ou meta de aprovação:\nSe a meta de aprovação é 70 pontos, quem faz exatamente 70 atinge a meta com >= 70 (true), mas não ultrapassa com > 70 (false).',

      exemploCodigo:
        '// Comparações retornam boolean (true ou false)\nconst pontos = 70\nconst meta = 70\n\nconsole.log(pontos >= meta) // true\nconsole.log(pontos > meta)  // false\nconsole.log(pontos === 70)  // true\nconsole.log("70" === 70)    // false',

      resumo:
        'Comparações avaliam relações entre valores e retornam true ou false; === e !== evitam surpresas de tipo, e >= / <= incluem o limite.',
    },

    pratica: {
      titulo: 'Classifique o resultado booleano de cada comparação',
      enunciado:
        'Considere os valores abaixo e toque em true ou false para cada comparação:\n\nconst idade = 18\nconst codigo = "10"',
      codigoInicial:
        'const idade = 18\nconst codigo = "10"\n// Avalie cada comparação abaixo',
      resultadoEsperado:
        'Identificar corretamente true ou false em comparações estritas e de limite.',
      dica:
        'Confira se a comparação exige igualdade exata de tipo (===), se inclui o limite (>=) ou se está fora do esperado.',
      classificacao: {
        categorias: ['true', 'false'],
        itens: [
          {
            texto: 'idade >= 18 (com idade = 18)',
            categoriaCorreta: 'true',
          },
          {
            texto: 'codigo === 10 (com codigo = "10")',
            categoriaCorreta: 'false',
          },
          {
            texto: 'idade !== 18 (com idade = 18)',
            categoriaCorreta: 'false',
          },
          {
            texto: '15 < idade (com idade = 18)',
            categoriaCorreta: 'true',
          },
        ],
        acertoMsg:
          'Mandou bem! Você avaliou comparações de limite e igualdade estrita sem cair em pegadinhas.',
        erroMsg:
          'Alguma comparação ficou sem resposta ou com booleano trocado. Revise limites (>= vs >) e tipos em ===.',
      },
    },

    quiz: [
      {
        pergunta: 'Por que usar === é recomendado no lugar de == na maioria das comparações?',
        opcoes: [
          'Porque === compara valor e tipo sem fazer conversões implícitas inesperadas',
          'Porque === altera o valor da variável da esquerda para igualar à direita',
          'Porque == só funciona com números negativos',
        ],
        respostaCorreta: 0,
        explicacao:
          '=== exige que valor e tipo coincidam, tornando o comportamento mais previsível.',
      },
      {
        pergunta: 'Se o limite de faltas permitido é 3, qual comparação inclui exatamente 3 faltas como dentro do limite?',
        opcoes: [
          'faltas <= 3',
          'faltas < 3',
          'faltas === 0',
        ],
        respostaCorreta: 0,
        explicacao:
          '<= significa "menor ou igual a", incluindo o próprio valor 3.',
      },
      {
        pergunta: 'Qual é o valor booleano produzido pela expressão 10 !== 10?',
        opcoes: [
          'false, pois 10 e 10 não são diferentes',
          'true, pois são números iguais',
          'undefined',
        ],
        respostaCorreta: 0,
        explicacao:
          '!== verifica diferença estrita; como os dois lados têm o mesmo valor e tipo, o resultado é false.',
      },
    ],

    conclusao: {
      aprendizados: [
        'Operadores de comparação sempre retornam um valor booleano (true ou false).',
        '=== e !== verificam igualdade e diferença estrita sem forçar conversão de tipo.',
        '>=, <=, > e < controlam limites com ou sem inclusão do valor exato.',
      ],
      reflexao:
        'Em uma verificação de senha ou código de acesso, qual é a diferença entre comparar o texto exato com === e checar apenas se não está vazio?',
      proximaAulaId: 'lesson-7',
    },
  },
  {
    id: 'lesson-7',
    numero: 7,
    modulo: 2,
    titulo: 'Operadores Lógicos: Combinando Regras com &&, || e !',
    resumo:
      'Combine condições com && (E) e || (OU) e inverta booleanos com ! (NÃO) para montar regras realistas.',

    introducao: {
      objetivo:
        'Entender como os operadores lógicos &&, || e ! combinam ou invertem valores booleanos para formar regras mais completas.',
      contexto:
        'Na Aula 6, cada comparação gerava um true ou false isolado. Na vida real, uma regra raramente depende de uma única pergunta: muitas vezes você precisa que duas coisas sejam verdadeiras juntas, que pelo menos uma seja verdadeira ou que um estado seja negado.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. && (E lógico): todas as condições precisam ser verdadeiras',
          explicacao:
            'A expressão A && B só resulta em true quando A é true E B também é true. Se qualquer um dos lados for false, o resultado geral é false — como exigir saldo suficiente E conta ativa para concluir uma compra.',
        },
        {
          titulo: '2. || (OU lógico): basta uma condição ser verdadeira',
          explicacao:
            'A expressão A || B resulta em true sempre que pelo menos um dos lados for true. Ela só é false quando ambos os lados forem false — como liberar desconto se for estudante OU tiver cupom válido.',
        },
        {
          titulo: '3. ! (NÃO lógico): inverte o valor booleano',
          explicacao:
            'O operador ! inverte o booleano à frente dele: !true vira false e !false vira true. Ele é útil para checar o oposto de um estado, como !bloqueado ou !estaVazio.',
        },
        {
          titulo: '4. Agrupando com parênteses para deixar a intenção clara',
          explicacao:
            'Quando você mistura && e || na mesma expressão, usar parênteses () deixa explícito o que é avaliado primeiro e evita que alguém (ou o código) leia a regra de um jeito diferente do que você planejou.',
        },
      ],

      exemploCotidiano:
        'Situação real — acesso a um evento:\nPara entrar com ingresso padrão, vale ter ingressoValido && !estaNaListaNegra; já para acesso VIP, pode ter pulseiraVip || conviteEspecial.',

      exemploCodigo:
        '// Operadores lógicos combinando booleanos\nconst temSaldo = true\nconst contaAtiva = true\nconst bloqueado = false\n\nconsole.log(temSaldo && contaAtiva) // true\nconsole.log(temSaldo && !bloqueado) // true\nconsole.log(false || temSaldo)      // true',

      resumo:
        '&& exige ambos verdadeiros, || aceita ao menos um verdadeiro e ! inverte true/false — use parênteses para clareza.',
    },

    pratica: {
      titulo: 'Classifique o resultado booleano de cada expressão lógica',
      enunciado:
        'Considere os valores abaixo e toque em true ou false para cada expressão:\n\nconst logado = true\nconst temCupom = false\nconst bloqueado = false',
      codigoInicial:
        'const logado = true\nconst temCupom = false\nconst bloqueado = false\n// Avalie cada expressão lógica',
      resultadoEsperado:
        'Prever corretamente true ou false em combinações com &&, || e !.',
      dica:
        'Lembre-se: && precisa de ambos true, || precisa de pelo menos um true e ! inverte o valor.',
      classificacao: {
        categorias: ['true', 'false'],
        itens: [
          {
            texto: 'logado && !bloqueado',
            categoriaCorreta: 'true',
          },
          {
            texto: 'logado && temCupom',
            categoriaCorreta: 'false',
          },
          {
            texto: 'temCupom || !bloqueado',
            categoriaCorreta: 'true',
          },
          {
            texto: '!logado',
            categoriaCorreta: 'false',
          },
        ],
        acertoMsg:
          'Mandou bem! Você combinou &&, || e ! e previu cada resultado booleano com precisão.',
        erroMsg:
          'Alguma expressão ficou sem escolha ou com resultado trocado. Confira cada booleano e o efeito de !, && e ||.',
      },
    },

    quiz: [
      {
        pergunta: 'Quando a expressão A && B retorna true?',
        opcoes: [
          'Apenas quando A e B forem true ao mesmo tempo',
          'Sempre que pelo menos um dos dois for true',
          'Quando ambos forem false',
        ],
        respostaCorreta: 0,
        explicacao:
          'No operador && (E), todas as partes envolvidas precisam ser verdadeiras para o resultado ser true.',
      },
      {
        pergunta: 'Se temDescontoSocio é false e temCupomValido é true, qual o resultado de temDescontoSocio || temCupomValido?',
        opcoes: [
          'true, pois pelo menos uma condição é verdadeira',
          'false, pois uma das condições é falsa',
          'undefined',
        ],
        respostaCorreta: 0,
        explicacao:
          'O operador || retorna true quando ao menos um dos operandos é true.',
      },
      {
        pergunta: 'O que !estaConcluida faz quando estaConcluida vale false?',
        opcoes: [
          'Inverte false para true',
          'Altera permanentemente a variável estaConcluida para true',
          'Converte o booleano em texto "false"',
        ],
        respostaCorreta: 0,
        explicacao:
          '! retorna o booleano oposto ao valor avaliado, sem reatribuir a variável.',
      },
    ],

    conclusao: {
      aprendizados: [
        '&& retorna true somente quando todas as condições combinadas são verdadeiras.',
        '|| retorna true quando ao menos uma condição é verdadeira.',
        '! inverte um valor booleano e ajuda a ler condições negativas com clareza.',
      ],
      reflexao:
        'Em uma regra de "pode publicar post se estiver logado e não estiver suspenso", como você escreveria essa condição com && e !?',
      proximaAulaId: 'lesson-8',
    },
  },
  {
    id: 'lesson-8',
    numero: 8,
    modulo: 2,
    titulo: 'Prática Combinada de Dados e Regras',
    resumo:
      'Junte variáveis, tipos, comparações e operadores lógicos para avaliar regras completas antes de avançar para if e else.',

    introducao: {
      objetivo:
        'Consolidar tudo o que foi visto no Módulo 2 avaliando expressões que combinam valores, tipos, comparações e lógica booleana.',
      contexto:
        'Nas aulas anteriores você viu variáveis, tipos, comparações e operadores lógicos separadamente. Agora chegou a hora de juntar essas peças em situações mais próximas do dia a dia para ganhar segurança antes de usar if, else if e else na Aula 9.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Lendo uma regra de fora para dentro',
          explicacao:
            'Quando uma expressão mistura comparações e && / || / !, avalie primeiro as partes menores (como pontuacao >= 70 ou !bloqueado) até virarem true ou false, e só então combine esses resultados.',
        },
        {
          titulo: '2. Tipo certo evita falha silenciosa',
          explicacao:
            'Antes de comparar ou somar, confira se o dado está no tipo esperado: um número em formato de texto como "10" não é estritamente igual a 10 em ===, e somar com + pode concatenar em vez de calcular.',
        },
        {
          titulo: '3. Expressão booleana pronta para virar decisão',
          explicacao:
            'Toda condição de um if no código é, no fundo, uma expressão que resulta em true ou false. Saber montar e ler bem essa expressão facilita muito escrever decisões limpas a partir da próxima aula.',
        },
      ],

      exemploCotidiano:
        'Situação real — liberar acesso a um desafio bônus:\nO aluno precisa estar com ativo === true, ter feito ao menos 5 aulas (aulasFeitas >= 5) e não estar suspenso (!suspenso). Tudo isso forma uma única regra booleana.',

      exemploCodigo:
        '// Combinando variáveis, comparação e lógica\nconst ativo = true\nconst suspenso = false\nconst aulasFeitas = 6\n\nconst podeAcessarBonus = ativo && !suspenso && aulasFeitas >= 5\nconsole.log(podeAcessarBonus) // true',

      resumo:
        'Avalie cada comparação para true/false, respeite os tipos dos dados e combine tudo com &&, || e ! para formar regras claras.',
    },

    pratica: {
      titulo: 'Classifique o resultado de regras combinadas',
      enunciado:
        'Considere os dados abaixo e toque em true ou false para cada regra combinada:\n\nconst pontos = 85\nconst meta = 70\nconst ativo = true\nconst bloqueado = false',
      codigoInicial:
        'const pontos = 85\nconst meta = 70\nconst ativo = true\nconst bloqueado = false\n// Avalie cada regra combinada abaixo',
      resultadoEsperado:
        'Avaliar corretamente expressões que misturam comparações e operadores lógicos.',
      dica:
        'Resolva cada comparação (pontos >= meta, !bloqueado) primeiro e depois veja o efeito de && ou ||.',
      classificacao: {
        categorias: ['true', 'false'],
        itens: [
          {
            texto: 'ativo && !bloqueado && pontos >= meta',
            categoriaCorreta: 'true',
          },
          {
            texto: 'pontos < meta || bloqueado',
            categoriaCorreta: 'false',
          },
          {
            texto: 'pontos === 85 && bloqueado',
            categoriaCorreta: 'false',
          },
          {
            texto: '!ativo || pontos >= meta',
            categoriaCorreta: 'true',
          },
        ],
        acertoMsg:
          'Mandou bem! Você juntou tipos, comparações e lógica booleana com segurança.',
        erroMsg:
          'Alguma regra ficou sem escolha ou com resultado trocado. Avalie cada comparação isolada primeiro e depois combine.',
      },
    },

    quiz: [
      {
        pergunta: 'Com pontos = 60, meta = 70 e temRecuperacao = true, qual o resultado de pontos >= meta || temRecuperacao?',
        opcoes: [
          'true, pois embora 60 >= 70 seja false, temRecuperacao é true e o operador é ||',
          'false, pois pontos está abaixo da meta',
          'undefined',
        ],
        respostaCorreta: 0,
        explicacao:
          'pontos >= meta avalia para false, mas como temRecuperacao é true e o operador é ||, o resultado final é true.',
      },
      {
        pergunta: 'Qual é o melhor primeiro passo ao ler uma expressão longa com &&, || e comparações?',
        opcoes: [
          'Avaliar cada comparação e negação para true ou false antes de combinar o todo',
          'Ignorar os operadores lógicos e olhar apenas o último valor',
          'Converter todos os números em strings antes de comparar',
        ],
        respostaCorreta: 0,
        explicacao:
          'Quebrar a expressão nos valores booleanos parciais evita erro de leitura e deixa o resultado claro.',
      },
      {
        pergunta: 'Se codigoDigitado = "123" e codigoCorreto = 123, o que acontece em codigoDigitado === codigoCorreto?',
        opcoes: [
          'Retorna false porque um é string e o outro é number',
          'Retorna true porque os caracteres parecem iguais',
          'Altera codigoDigitado para number automaticamente',
        ],
        respostaCorreta: 0,
        explicacao:
          '=== exige igualdade de valor e tipo; string e number não são estritamente iguais.',
      },
    ],

    conclusao: {
      aprendizados: [
        'Expressões lógicas combinam comparações e booleanos para representar regras reais.',
        'Avaliar partes menores primeiro facilita prever o resultado de condições compostas.',
        'Com os valores e regras dominados, o próximo passo é direcionar o fluxo com if, else if e else.',
      ],
      reflexao:
        'Qual regra do dia a dia (como liberar entrega grátis ou aprovar um pedido) você já consegue escrever como uma expressão booleana?',
      proximaAulaId: 'lesson-9',
    },
  },
  {
    id: 'lesson-9',
    numero: 9,
    modulo: 3,
    titulo: 'Decisões com if, else if e else: Direcionando o Fluxo',
    resumo:
      'Use if, else if e else para escolher caminhos no código e entenda por que a ordem das condições importa.',

    introducao: {
      objetivo:
        'Aprender a estruturar decisões condicionais com if, else if e else e evitar armadilhas na ordem das verificações.',
      contexto:
        'Na Aula 8, você avaliou expressões booleanas que resultam em true ou false. Agora vamos usar esses resultados dentro de if, else if e else para fazer o programa reagir de um jeito ou de outro conforme o estado atual.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. if: executa quando a condição é true',
          explicacao:
            'O bloco if (condicao) { ... } só roda o código interno quando a condição avalia para true. Se for false, o JavaScript pula aquele bloco e segue em frente.',
        },
        {
          titulo: '2. else if e else: caminhos alternativos e fallback',
          explicacao:
            'Quando há mais de uma faixa ou possibilidade, else if testa outra condição caso o if anterior tenha sido false. Já o else funciona como o caminho padrão quando nenhuma condição anterior foi atendida.',
        },
        {
          titulo: '3. Apenas o primeiro bloco verdadeiro roda (e a ordem importa)',
          explicacao:
            'Em uma cadeia if / else if / else, o JavaScript avalia de cima para baixo e executa apenas o primeiro bloco cuja condição for true. Por isso, colocar uma regra ampla antes de uma regra específica pode engolir casos que deveriam cair em outro lugar.',
        },
      ],

      exemploCotidiano:
        'Situação real — classificação de desempenho em uma prova:\nSe nota >= 90, destaque; senão se nota >= 70, aprovado; senão, em revisão. Se você checar nota >= 70 antes de nota >= 90, quem tirou 95 já cai no "aprovado" e nunca chega ao "destaque".',

      exemploCodigo:
        '// Decisão encadeada do caso mais específico para o geral\nconst nota = 85\n\nif (nota >= 90) {\n  console.log("Destaque")\n} else if (nota >= 70) {\n  console.log("Aprovado")\n} else {\n  console.log("Em revisão")\n}',

      resumo:
        'if, else if e else escolhem caminhos com base em booleanos; apenas o primeiro bloco verdadeiro executa, então a ordem das condições importa.',
    },

    pratica: {
      titulo: 'Ordene a estrutura de decisão do início ao fim',
      enunciado:
        'Coloque as linhas abaixo na ordem correta para montar uma decisão que avalia se o saldo cobre o valor da compra:',
      codigoInicial:
        'const saldo = 120\nconst valorCompra = 90\n// Organize os blocos da decisão abaixo',
      resultadoEsperado:
        'Ordenar corretamente a abertura do if, o bloco executado quando verdadeiro, o else e o bloco alternativo.',
      dica:
        'Comece pela linha com if (saldo >= valorCompra) {, siga com a ação de compra aprovada, depois } else { e por fim a ação de saldo insuficiente com }.',
      frases: [
        'console.log("Compra aprovada")',
        'if (saldo >= valorCompra) {',
        '} else {',
        'console.log("Saldo insuficiente")',
        '}',
      ],
      ordemCorreta: [
        'if (saldo >= valorCompra) {',
        'console.log("Compra aprovada")',
        '} else {',
        'console.log("Saldo insuficiente")',
        '}',
      ],
      acertoMsg:
        'Mandou bem! A estrutura if / else ficou montada na sequência exata.',
      erroMsg:
        'Alguma linha ficou fora de ordem. Confira onde abre o if, onde entra o else e onde fecham as chaves.',
    },

    quiz: [
      {
        pergunta: 'Em uma sequência if / else if / else, quantos blocos costumam ser executados quando uma condição intermediária é verdadeira?',
        opcoes: [
          'Apenas o primeiro bloco cuja condição for verdadeira',
          'Todos os blocos que vierem depois dele, mesmo que sejam falsos',
          'Sempre o bloco else no final, junto com o else if',
        ],
        respostaCorreta: 0,
        explicacao:
          'Assim que uma condição avalia para true na cadeia, seu bloco roda e os demais ramos do encadeamento são ignorados.',
      },
      {
        pergunta: 'Por que colocar uma condição mais específica antes de uma mais ampla costuma fazer sentido em faixas de valores?',
        opcoes: [
          'Para evitar que uma condição ampla capture valores que deveriam ter um tratamento específico',
          'Porque o else if não aceita comparações com >= ou <=',
          'Porque o JavaScript proíbe usar mais de um if no mesmo arquivo',
        ],
        respostaCorreta: 0,
        explicacao:
          'Avaliar casos específicos primeiro impede que regras mais abrangentes interceptem valores antes da hora.',
      },
      {
        pergunta: 'Quando o bloco else é executado?',
        opcoes: [
          'Quando nenhuma das condições anteriores (if ou else if) foi verdadeira',
          'Sempre que o if for verdadeiro',
          'Antes mesmo de o if ser testado',
        ],
        respostaCorreta: 0,
        explicacao:
          'O else serve como caminho alternativo quando todas as condições anteriores resultam em false.',
      },
    ],

    conclusao: {
      aprendizados: [
        'if, else if e else permitem escolher caminhos diferentes conforme o resultado das condições.',
        'Apenas o primeiro ramo verdadeiro é executado, tornando a ordem das condições decisiva.',
        'else trata os casos restantes quando nenhuma condição anterior é atendida.',
      ],
      reflexao:
        'Em um sistema de desconto progressivo (acima de 200 e acima de 100), qual condição você testaria primeiro para não errar a faixa?',
      proximaAulaId: 'lesson-10',
    },
  },
  {
    id: 'lesson-10',
    numero: 10,
    modulo: 3,
    titulo: 'Loops com for e while: Repetindo com Segurança',
    resumo:
      'Repita ações com for e while, entenda como o contador e a condição de parada funcionam e evite loops infinitos.',

    introducao: {
      objetivo:
        'Aprender a repetir tarefas com for e while e garantir que toda repetição tenha uma condição clara de parada.',
      contexto:
        'Na Aula 9, você usou if e else para escolher um caminho em um momento específico. Muitas vezes, porém, precisamos executar a mesma etapa várias vezes — como contar rodadas, processar itens ou tentar até atingir um limite — sem copiar e colar código.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. for: ideal quando você sabe o início, o limite e o passo',
          explicacao:
            'O loop for reúne três partes na mesma linha: inicialização (ex.: let i = 1), condição de continuação (ex.: i <= 3) e atualização (ex.: i++). Enquanto a condição for true, o bloco interno roda e depois i é atualizado.',
        },
        {
          titulo: '2. while: repete enquanto a condição for verdadeira',
          explicacao:
            'O loop while (condicao) { ... } verifica a condição antes de cada repetição. Ele é muito natural quando a repetição depende de um estado que vai mudando dentro do bloco até deixar de atender à condição.',
        },
        {
          titulo: '3. Condição de parada e o perigo do loop infinito',
          explicacao:
            'Todo loop precisa avançar em direção ao fim. Se a variável de controle nunca muda ou a condição nunca se torna false, o loop vira um loop infinito e trava a execução. Sempre confira o que muda a cada volta.',
        },
      ],

      exemploCotidiano:
        'Situação real — fazer 3 séries de alongamento:\nVocê começa na série 1, confere se ainda não passou de 3, faz a série e anota que avançou para a próxima até terminar as 3.',

      exemploCodigo:
        '// Repetição controlada com for e while\nfor (let rodada = 1; rodada <= 3; rodada++) {\n  console.log("Rodada " + rodada)\n}\n\nlet tentativas = 0\nwhile (tentativas < 2) {\n  tentativas++\n}',

      resumo:
        'for organiza início, condição e passo em uma linha; while repete enquanto a condição for true — e ambos exigem avanço para não travar.',
    },

    pratica: {
      titulo: 'Classifique o comportamento de cada loop',
      enunciado:
        'Leia cada trecho de repetição abaixo e toque na classificação correta:',
      codigoInicial:
        '// Analise o início, a condição e a atualização\n// de cada loop antes de escolher',
      resultadoEsperado:
        'Identificar corretamente loops que terminam normalmente, quantas vezes rodam ou se têm risco de loop infinito.',
      dica:
        'Observe o valor inicial, o limite da condição e se o contador avança em direção ao fim.',
      classificacao: {
        categorias: ['Roda 3 vezes', 'Roda 2 vezes', 'Risco de loop infinito'],
        itens: [
          {
            texto: 'for (let i = 1; i <= 3; i++) { ... }',
            categoriaCorreta: 'Roda 3 vezes',
          },
          {
            texto: 'let n = 0; while (n < 2) { n++ }',
            categoriaCorreta: 'Roda 2 vezes',
          },
          {
            texto: 'let x = 1; while (x > 0) { console.log(x) }',
            categoriaCorreta: 'Risco de loop infinito',
          },
        ],
        acertoMsg:
          'Mandou bem! Você identificou o número de execuções e reconheceu quando uma condição não tem parada.',
        erroMsg:
          'Algum loop ficou sem classificação ou trocado. Confira o valor inicial, a condição e o que acontece com a variável a cada volta.',
      },
    },

    quiz: [
      {
        pergunta: 'O que acontece se um loop while tiver uma condição sempre true e nada alterar os valores envolvidos?',
        opcoes: [
          'Ele tende a virar um loop infinito, repetindo sem condição de parada',
          'Ele executa apenas uma vez e encerra automaticamente',
          'Ele pula o bloco e executa o else',
        ],
        respostaCorreta: 0,
        explicacao:
          'Sem mudança que torne a condição false em algum momento, a repetição não encontra um fim.',
      },
      {
        pergunta: 'Em for (let i = 0; i < 4; i++), quais valores de i entram na repetição?',
        opcoes: [
          '0, 1, 2 e 3 (4 execuções ao todo)',
          '1, 2, 3 e 4',
          'Apenas 0 e 4',
        ],
        respostaCorreta: 0,
        explicacao:
          'Começa em 0 e continua enquanto i < 4, rodando para 0, 1, 2 e 3 antes de i chegar a 4.',
      },
      {
        pergunta: 'Quando costuma ser mais direto usar for em vez de while?',
        opcoes: [
          'Quando você já tem um contador numérico com início, limite e passo definidos',
          'Quando você quer evitar usar variáveis',
          'Quando a condição nunca pode usar < ou <=',
        ],
        respostaCorreta: 0,
        explicacao:
          'O for deixa explícitos na mesma estrutura o início, o teste de continuação e o incremento.',
      },
    ],

    conclusao: {
      aprendizados: [
        'for e while repetem blocos enquanto uma condição for verdadeira.',
        'Garantir o avanço e a condição de parada evita loops infinitos.',
        'Saber repetir passos abre caminho para trabalhar com listas (arrays) na próxima aula.',
      ],
      reflexao:
        'Se você precisa repetir uma verificação até o usuário acertar ou atingir 3 tentativas, qual informação precisa mudar a cada volta?',
      proximaAulaId: 'lesson-11',
    },
  },
  {
    id: 'lesson-11',
    numero: 11,
    modulo: 3,
    titulo: 'Arrays e Acesso por Índice: Listas em Ordem',
    resumo:
      'Crie arrays, entenda por que o índice começa em 0, use .length com segurança e evite acessar posições inexistentes.',

    introducao: {
      objetivo:
        'Compreender como arrays armazenam listas ordenadas de valores e como acessar elementos pelo índice sem ultrapassar o tamanho da lista.',
      contexto:
        'Na Aula 10, você aprendeu a repetir passos com segurança. Muitas vezes, esses passos envolvem uma coleção de itens na mesma ordem — como tarefas do dia, notas ou etapas de um pedido — em vez de criar uma variável separada para cada item.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é um array e como ele guarda itens em sequência',
          explicacao:
            'Um array (lista) guarda vários valores dentro de colchetes [...], separados por vírgula, mantendo a ordem em que foram colocados. Ele pode guardar strings, numbers, booleans ou outros valores.',
        },
        {
          titulo: '2. O índice começa em 0, não em 1',
          explicacao:
            'No JavaScript, cada posição de um array tem um índice numérico começando em 0: o primeiro elemento está em array[0], o segundo em array[1], o terceiro em array[2], e assim por diante.',
        },
        {
          titulo: '3. .length e o último índice válido (length - 1)',
          explicacao:
            'A propriedade .length informa quantos itens existem no array. Se um array tem 3 itens (length === 3), seus índices válidos vão de 0 até 2 — tentar acessar array[3] aponta para uma posição além do fim e retorna undefined.',
        },
      ],

      exemploCotidiano:
        'Situação real — fila de atendimento com 3 pessoas:\nAna (posição 0), Bruno (posição 1) e Carla (posição 2). O tamanho da fila é 3 (.length === 3), mas o último índice válido é 2.',

      exemploCodigo:
        '// Array com índice começando em 0 e uso de .length\nconst tarefas = ["Ler teoria", "Fazer prática", "Revisar quiz"]\n\nconsole.log(tarefas[0])                   // "Ler teoria"\nconsole.log(tarefas.length)              // 3\nconsole.log(tarefas[tarefas.length - 1]) // "Revisar quiz"',

      resumo:
        'Arrays guardam listas ordenadas com índice iniciando em 0; .length indica a quantidade de itens e o último índice é length - 1.',
    },

    pratica: {
      titulo: 'Ordene o acesso aos itens de um array do primeiro ao último',
      enunciado:
        'Considere a lista const etapas = ["Planejar", "Codar", "Testar"] e coloque os acessos abaixo na ordem do primeiro até o último elemento:',
      codigoInicial:
        'const etapas = ["Planejar", "Codar", "Testar"]\n// Ordene do índice inicial até o final',
      resultadoEsperado:
        'Ordenar corretamente o acesso do primeiro elemento (índice 0) ao último elemento (índice 2) do array.',
      dica:
        'Lembre-se de que o primeiro item está no índice 0 e, em um array de 3 itens, o último está no índice 2.',
      frases: [
        'etapas[1]',
        'etapas[0]',
        'etapas[2]',
      ],
      ordemCorreta: [
        'etapas[0]',
        'etapas[1]',
        'etapas[2]',
      ],
      acertoMsg:
        'Mandou bem! Você acessou os elementos do array na ordem exata, começando do índice 0.',
      erroMsg:
        'A ordem de acesso não ficou certa. Lembre-se de que o primeiro elemento fica em etapas[0].',
    },

    quiz: [
      {
        pergunta: 'Em const frutas = ["maçã", "banana", "uva"], qual expressão acessa "banana"?',
        opcoes: [
          'frutas[1]',
          'frutas[2]',
          'frutas[0]',
        ],
        respostaCorreta: 0,
        explicacao:
          '"maçã" está no índice 0 e "banana" está no índice 1.',
      },
      {
        pergunta: 'Se um array tem 4 elementos (array.length === 4), qual é o índice do último elemento?',
        opcoes: [
          '3 (que equivale a array.length - 1)',
          '4',
          '1',
        ],
        respostaCorreta: 0,
        explicacao:
          'Como os índices começam em 0, 4 itens ocupam as posições 0, 1, 2 e 3.',
      },
      {
        pergunta: 'O que acontece se você tenta ler um índice maior ou igual ao .length de um array?',
        opcoes: [
          'Acessa uma posição além dos elementos existentes, resultando em undefined',
          'Apaga o último item do array automaticamente',
          'Reinicia a contagem a partir do índice 0',
        ],
        respostaCorreta: 0,
        explicacao:
          'Índices fora do intervalo válido de 0 até length - 1 não possuem elemento atribuído e retornam undefined.',
      },
    ],

    conclusao: {
      aprendizados: [
        'Arrays armazenam coleções ordenadas de valores acessíveis por índice numérico.',
        'O primeiro elemento de um array sempre começa no índice 0.',
        '.length mostra a quantidade de itens, e o último índice válido é length - 1.',
      ],
      reflexao:
        'Por que começar a contar em 0 faz diferença quando você quer percorrer todos os itens de um array usando um contador?',
      proximaAulaId: 'lesson-12',
    },
  },
  {
    id: 'lesson-12',
    numero: 12,
    modulo: 3,
    titulo: 'Percorrendo Listas e Tomando Decisões',
    resumo:
      'Combine for, índices de array e if para visitar cada item de uma lista, filtrar cenários e somar ou contar resultados.',

    introducao: {
      objetivo:
        'Unir loops, arrays e condições para percorrer uma lista do início ao fim e tomar decisões sobre cada elemento.',
      contexto:
        'Nas aulas anteriores você viu como repetir com for (Aula 10), acessar itens de um array do índice 0 até length - 1 (Aula 11) e decidir caminhos com if (Aula 9). Juntar essas três peças permite inspecionar coleções inteiras — como somar valores, contar acertos ou identificar itens que atendem a uma regra.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O padrão clássico de percorrer um array com for',
          explicacao:
            'Para visitar todos os itens de uma lista sem errar limites, usamos i começando em 0 e a condição i < lista.length com passo i++. A cada volta, lista[i] entrega o elemento atual daquela posição.',
        },
        {
          titulo: '2. Tomando decisões para cada item com if',
          explicacao:
            'Dentro do loop, você pode usar if para checar uma condição em cada elemento — por exemplo, verificar se um valor atinge a meta ou se um status é válido — e atualizar uma variável acumuladora (como total ou aprovados) declarada fora do loop.',
        },
        {
          titulo: '3. Acumulador fora, atualização dentro',
          explicacao:
            'Se você quer contar quantos itens passaram ou somar números da lista, inicialize o acumulador (ex.: let contador = 0) antes do for e atualize-o apenas quando o if for verdadeiro. Se zerar dentro do loop, o valor se perde a cada volta.',
        },
      ],

      exemploCotidiano:
        'Situação real — conferir notas de uma turma:\nVocê começa com aprovados = 0 antes de olhar a lista. Para cada nota, confere se nota >= 70: se for, soma 1 em aprovados; se não for, segue para a próxima nota.',

      exemploCodigo:
        '// Percorrendo array, testando condição e acumulando resultado\nconst notas = [80, 55, 90, 65]\nlet aprovados = 0\n\nfor (let i = 0; i < notas.length; i++) {\n  if (notas[i] >= 70) {\n    aprovados++\n  }\n}\n\nconsole.log(aprovados) // 2',

      resumo:
        'Use i = 0 até i < array.length para visitar cada item com array[i], aplique if para avaliar regras e mantenha acumuladores fora do loop.',
    },

    pratica: {
      titulo: 'Classifique o comportamento ao percorrer a lista',
      enunciado:
        'Considere a lista const valores = [10, 50, 20, 80] e uma regra que conta quantos itens são maiores ou iguais a 50 (valores[i] >= 50):\n\nToque na classificação correta para cada afirmação:',
      codigoInicial:
        'const valores = [10, 50, 20, 80]\nlet contagem = 0\nfor (let i = 0; i < valores.length; i++) {\n  if (valores[i] >= 50) { contagem++ }\n}',
      resultadoEsperado:
        'Identificar corretamente a condição do loop, os itens que satisfazem o if e o resultado final da contagem.',
      dica:
        'Olhe quais números em [10, 50, 20, 80] são >= 50 e como o loop avança do índice 0 até o último.',
      classificacao: {
        categorias: ['Verdadeiro', 'Falso'],
        itens: [
          {
            texto: 'Ao final do loop, contagem vale 2 (50 e 80 atendem >= 50)',
            categoriaCorreta: 'Verdadeiro',
          },
          {
            texto: 'Na primeira volta (i = 0), valores[0] é 50',
            categoriaCorreta: 'Falso',
          },
          {
            texto: 'A condição i < valores.length percorre índices de 0 até 3',
            categoriaCorreta: 'Verdadeiro',
          },
          {
            texto: 'Colocar let contagem = 0 dentro do for manteria a soma total ao final',
            categoriaCorreta: 'Falso',
          },
        ],
        acertoMsg:
          'Mandou bem! Você conectou índice, condição de parada, if e acumulador sem deixar passar nenhuma armadilha.',
        erroMsg:
          'Alguma afirmação ficou sem resposta ou com julgamento trocado. Confira valores[0], a condição i < valores.length e onde fica o acumulador.',
      },
    },

    quiz: [
      {
        pergunta: 'Por que a condição do for ao percorrer um array costuma ser i < lista.length em vez de i <= lista.length?',
        opcoes: [
          'Porque o último índice válido de um array é length - 1, e i <= lista.length acessaria uma posição além do fim',
          'Porque o operador <= não funciona com a propriedade .length',
          'Porque i < lista.length faz o loop começar pelo último elemento',
        ],
        respostaCorreta: 0,
        explicacao:
          'Como os índices começam em 0, parar antes de lista.length garante visitar de 0 até lista.length - 1.',
      },
      {
        pergunta: 'Se você precisa somar apenas os números maiores que 10 de um array, onde deve ficar a variável let soma = 0?',
        opcoes: [
          'Antes do loop for, para acumular os valores ao longo de todas as voltas',
          'Dentro do if, recriada a cada item encontrado',
          'Depois do loop for, logo após o console.log',
        ],
        respostaCorreta: 0,
        explicacao:
          'Declarar let soma = 0 antes do loop preserva o total acumulado a cada iteração.',
      },
      {
        pergunta: 'Em const itens = ["ok", "erro", "ok"], o que acontece se dentro do for houver um if (itens[i] === "erro")?',
        opcoes: [
          'O bloco do if só executa na volta em que itens[i] vale "erro" (índice 1)',
          'O bloco do if executa em todas as 3 voltas da lista',
          'O loop para imediatamente na primeira volta',
        ],
        respostaCorreta: 0,
        explicacao:
          'A condição é testada elemento a elemento, executando o if apenas quando o item atual atende à regra.',
      },
    ],

    conclusao: {
      aprendizados: [
        'Percorrer arrays com i = 0 até i < array.length visita cada elemento na ordem certa.',
        'Combinar for e if permite filtrar, contar ou acumular valores de uma coleção.',
        'Com o fluxo e listas dominados, podemos organizar e reutilizar lógicas com funções a partir da próxima aula.',
      ],
      reflexao:
        'Se você escrevesse esse código de percorrer e contar itens em vários lugares do programa, como uma função poderia ajudar a reaproveitá-lo?',
      proximaAulaId: 'lesson-13',
    },
  },
  {
    id: 'lesson-13',
    numero: 13,
    modulo: 4,
    titulo: 'Funções: Parâmetros e return',
    resumo:
      'Crie funções reutilizáveis, entenda a diferença entre parâmetros e argumentos e use return para devolver resultados.',

    introducao: {
      objetivo:
        'Aprender a declarar funções com parâmetros e return para reutilizar lógicas sem duplicar código.',
      contexto:
        'Na Aula 12, vimos como percorrer listas e tomar decisões. Quando uma regra ou cálculo precisa acontecer várias vezes com valores diferentes, empacotar essa lógica em uma função evita repetição e deixa o código mais organizado.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é uma função e por que reutilizar lógica',
          explicacao:
            'Uma função é um bloco de código nomeado que executa uma tarefa quando é chamada. Em vez de reescrever a mesma conta ou verificação em vários pontos do programa, você define a lógica uma vez e a chama onde precisar.',
        },
        {
          titulo: '2. Parâmetros (na definição) vs. argumentos (na chamada)',
          explicacao:
            'Parâmetros são os nomes que a função espera receber para trabalhar (como preco e desconto). Argumentos são os valores reais que você passa quando chama a função (como calcularDesconto(100, 15)).',
        },
        {
          titulo: '3. return: devolvendo um valor para quem chamou',
          explicacao:
            'A palavra return entrega o resultado da função de volta para o ponto onde ela foi chamada, permitindo guardar esse valor em uma variável ou usá-lo em outra expressão. Além disso, return encerra a execução da função naquele momento.',
        },
      ],

      exemploCotidiano:
        'Situação real — calcular total com taxa de entrega:\nEm vez de refazer a conta na mão toda vez que um pedido muda de valor, você cria uma função que recebe subtotal e taxa e devolve o valor final.',

      exemploCodigo:
        '// Função com parâmetros e retorno de valor\nfunction calcularTotal(subtotal, taxa) {\n  return subtotal + taxa\n}\n\nconst totalPedido = calcularTotal(80, 12)\nconsole.log(totalPedido) // 92',

      resumo:
        'Funções agrupam lógica reutilizável: recebem valores por parâmetros e devolvem um resultado com return para ser usado onde a função foi chamada.',
    },

    pratica: {
      titulo: 'Ordene a declaração de uma função que calcula aprovação',
      enunciado:
        'Coloque as linhas abaixo na ordem correta para formar uma função verificarAprovacao(nota, meta) que retorna true se nota >= meta e false caso contrário:',
      codigoInicial:
        '// Monte a função verificarAprovacao(nota, meta)\n// respeitando abertura, condição, retorno e fechamento',
      resultadoEsperado:
        'Ordenar corretamente a assinatura da função, a verificação da condição, o return true, o return false e o fechamento.',
      dica:
        'Comece com function verificarAprovacao(nota, meta) {, teste nota >= meta com if, retorne true dentro do if, depois return false e feche com }.',
      frases: [
        '  if (nota >= meta) {',
        'function verificarAprovacao(nota, meta) {',
        '    return true',
        '  }',
        '  return false',
        '}',
      ],
      ordemCorreta: [
        'function verificarAprovacao(nota, meta) {',
        '  if (nota >= meta) {',
        '    return true',
        '  }',
        '  return false',
        '}',
      ],
      acertoMsg:
        'Mandou bem! A função ficou estruturada na ordem certa, com parâmetro, condição e retorno.',
      erroMsg:
        'Alguma linha ficou fora de ordem. Confira a declaração da função, o bloco do if e a posição do return.',
    },

    quiz: [
      {
        pergunta: 'Qual é o papel do return dentro de uma função?',
        opcoes: [
          'Devolver um valor para quem chamou a função e encerrar a execução dela',
          'Declarar variáveis globais que nunca mudam',
          'Fazer o loop for rodar uma vez a mais',
        ],
        respostaCorreta: 0,
        explicacao:
          'return envia o resultado de volta ao chamador e interrompe a execução da função naquele ponto.',
      },
      {
        pergunta: 'Na chamada somar(5, 8), o que são 5 e 8?',
        opcoes: [
          'Argumentos passados para os parâmetros definidos na função',
          'Tipos booleanos convertidos automaticamente',
          'Índices de um array externo',
        ],
        respostaCorreta: 0,
        explicacao:
          'Os valores enviados na chamada são argumentos que preenchem os parâmetros da função.',
      },
      {
        pergunta: 'Por que usar return costuma ser mais flexível do que apenas dar console.log dentro da função?',
        opcoes: [
          'Porque o valor retornado pode ser guardado em variável, testado ou usado em outras operações',
          'Porque console.log não funciona dentro de funções em JavaScript',
          'Porque return apaga o valor após exibir na tela',
        ],
        respostaCorreta: 0,
        explicacao:
          'Retornar o valor permite reutilizar o resultado em outras partes do código, não apenas exibi-lo.',
      },
    ],

    conclusao: {
      aprendizados: [
        'Funções encapsulam lógica reutilizável e evitam repetição de código.',
        'Parâmetros recebem os dados de entrada na definição e argumentos fornecem os valores na chamada.',
        'return devolve o resultado produzido pela função para quem a invocou.',
      ],
      reflexao:
        'Que cálculo ou verificação repetitiva de um sistema você transformaria em uma função com parâmetros e return?',
      proximaAulaId: 'lesson-14',
    },
  },
  {
    id: 'lesson-14',
    numero: 14,
    modulo: 4,
    titulo: 'Objetos: Chave, Valor e Atualização',
    resumo:
      'Agrupe dados nomeados em objetos com chave e valor, acesse propriedades com ponto e atualize estados com clareza.',

    introducao: {
      objetivo:
        'Entender como objetos representam entidades com propriedades nomeadas (chave e valor) e como ler ou atualizar seus campos.',
      contexto:
        'Na Aula 11, você usou arrays para listas ordenadas por posição numérica (0, 1, 2...). Quando um mesmo registro tem várias informações com nomes próprios — como nome, pontos e status de um aluno —, os objetos deixam tudo muito mais claro e organizado.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é um objeto: pares de chave e valor',
          explicacao:
            'Um objeto reúne informações relacionadas dentro de chaves { ... } no formato chave: valor. Em vez de depender da ordem de um índice numérico, cada dado tem um nome descritivo que explica o que ele significa.',
        },
        {
          titulo: '2. Acessando valores com notação de ponto',
          explicacao:
            'Para ler o valor de uma propriedade de um objeto, usamos objeto.chave — por exemplo, aluno.nome ou pedido.pago. Isso deixa a leitura do código muito próxima da linguagem natural.',
        },
        {
          titulo: '3. Atualizando propriedades com segurança',
          explicacao:
            'Você pode atualizar o valor de uma propriedade existente fazendo objeto.chave = novoValor — mesmo quando o objeto foi declarado com const, pois a referência ao objeto continua ali enquanto o valor interno da propriedade muda.',
        },
      ],

      exemploCotidiano:
        'Situação real — ficha de um aluno no CodeLab:\nEm vez de guardar nome, pontos e ativo em três variáveis soltas, você agrupa tudo em um único objeto aluno e atualiza aluno.pontos conforme ele avança.',

      exemploCodigo:
        '// Objeto com propriedades nomeadas, leitura e atualização\nconst aluno = {\n  nome: "Ana",\n  pontos: 40,\n  ativo: true,\n}\n\naluno.pontos = aluno.pontos + 20\nconsole.log(aluno.nome)   // "Ana"\nconsole.log(aluno.pontos) // 60',

      resumo:
        'Objetos agrupam dados nomeados em pares chave: valor; você lê com objeto.chave e atualiza campos com objeto.chave = novoValor.',
    },

    pratica: {
      titulo: 'Classifique como cada ação atua sobre um objeto',
      enunciado:
        'Considere o objeto const conta = { titular: "Lucas", saldo: 100, ativa: true } e toque na classificação correta para cada expressão ou instrução:',
      codigoInicial:
        'const conta = {\n  titular: "Lucas",\n  saldo: 100,\n  ativa: true,\n}\n// Classifique cada operação sobre o objeto',
      resultadoEsperado:
        'Diferenciar leitura de propriedade, atualização de valor, criação de nova propriedade e comparação booleana.',
      dica:
        'Observe se a expressão apenas lê um valor, atribui um novo valor a uma chave ou produz true/false.',
      classificacao: {
        categorias: ['Lê um valor', 'Atualiza o saldo', 'Gera true ou false'],
        itens: [
          {
            texto: 'conta.titular',
            categoriaCorreta: 'Lê um valor',
          },
          {
            texto: 'conta.saldo = conta.saldo + 50',
            categoriaCorreta: 'Atualiza o saldo',
          },
          {
            texto: 'conta.ativa === true',
            categoriaCorreta: 'Gera true ou false',
          },
          {
            texto: 'conta.saldo',
            categoriaCorreta: 'Lê um valor',
          },
        ],
        acertoMsg:
          'Mandou bem! Você identificou o papel de cada operação sobre o objeto conta.',
        erroMsg:
          'Algum item ficou sem classificação ou com categoria trocada. Confira o que lê, o que altera conta.saldo e o que compara.',
      },
    },

    quiz: [
      {
        pergunta: 'Qual é a principal vantagem de usar um objeto para representar um usuário com nome, idade e ativo?',
        opcoes: [
          'Agrupar informações relacionadas sob nomes claros em vez de depender apenas de posições numéricas',
          'Impedir que qualquer valor seja lido ou alterado no programa',
          'Substituir a necessidade de usar condições e loops',
        ],
        respostaCorreta: 0,
        explicacao:
          'Objetos associam cada dado a uma chave nomeada, tornando a estrutura autoexplicativa.',
      },
      {
        pergunta: 'Dado const produto = { nome: "Teclado", estoque: 5 }, como você lê a quantidade em estoque?',
        opcoes: [
          'produto.estoque',
          'produto[0]',
          'estoque.produto',
        ],
        respostaCorreta: 0,
        explicacao:
          'A notação de ponto (produto.estoque) acessa diretamente a propriedade estoque do objeto.',
      },
      {
        pergunta: 'Se const carrinho = { itens: 2, total: 50 }, o que acontece ao executar carrinho.total = 80?',
        opcoes: [
          'A propriedade total do objeto passa a valer 80',
          'O JavaScript lança erro por carrinho ter sido declarado com const',
          'A propriedade itens também muda automaticamente para 80',
        ],
        respostaCorreta: 0,
        explicacao:
          'Alterar uma propriedade de um objeto é válido mesmo quando a variável que guarda o objeto é const.',
      },
    ],

    conclusao: {
      aprendizados: [
        'Objetos organizam dados em pares de chave e valor dentro de chaves { ... }.',
        'A notação de ponto (objeto.chave) lê propriedades de forma legível.',
        'Atualizar propriedades com objeto.chave = novoValor permite acompanhar mudanças de estado.',
      ],
      reflexao:
        'Quais chaves fariam sentido em um objeto que representa uma tarefa de estudo ou um pedido de compra?',
      proximaAulaId: 'lesson-15',
    },
  },
  {
    id: 'lesson-15',
    numero: 15,
    modulo: 4,
    titulo: 'Funções Trabalhando com Objetos e Arrays',
    resumo:
      'Passe objetos e arrays para funções, aplique regras sobre propriedades e retorne resultados claros e reutilizáveis.',

    introducao: {
      objetivo:
        'Conectar funções, objetos e arrays para escrever rotinas que lêem propriedades, avaliam listas e retornam respostas consolidadas.',
      contexto:
        'Na Aula 13 você criou funções com parâmetros e return; na Aula 14 você estruturou dados em objetos; e na Aula 12 você percorreu arrays com loops e if. Agora vamos juntar tudo isso: funções que recebem um objeto ou um array e devolvem um resultado pronto.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Passando um objeto como parâmetro para uma função',
          explicacao:
            'Em vez de passar cinco variáveis soltas para uma função, você pode passar um objeto inteiro (como aluno ou pedido) e acessar internamente aluno.pontos ou pedido.pago. Se a regra do objeto mudar depois, a assinatura da função continua limpa.',
        },
        {
          titulo: '2. Percorrendo uma lista dentro de uma função e retornando o total',
          explicacao:
            'Uma função pode receber um array, usar um loop for para inspecionar cada item (ou cada objeto dentro da lista), acumular o que interessa e usar return para devolver o resultado final.',
        },
        {
          titulo: '3. Separar leitura/cálculo de exibição deixa a função mais útil',
          explicacao:
            'Quando uma função calcula ou avalia algo e retorna o valor com return, você pode usar esse resultado em condições, somas ou mensagens em diferentes partes do código — a mesma lógica base que prepara o projeto integrador da próxima aula.',
        },
      ],

      exemploCotidiano:
        'Situação real — verificar se um aluno atingiu o nível de destaque:\nVocê passa o objeto aluno para uma função que confere aluno.ativo && aluno.pontos >= 80 e retorna true ou false.',

      exemploCodigo:
        '// Função avaliando propriedades de um objeto e retornando boolean\nfunction podeReceberBadge(aluno) {\n  return aluno.ativo && aluno.pontos >= 80\n}\n\nconst estudante = { nome: "Marina", pontos: 85, ativo: true }\nconsole.log(podeReceberBadge(estudante)) // true',

      resumo:
        'Funções podem receber objetos ou arrays, ler suas propriedades ou percorrer seus itens e devolver o resultado final com return.',
    },

    pratica: {
      titulo: 'Ordene uma função que soma valores de um array',
      enunciado:
        'Coloque as linhas abaixo na ordem correta para formar uma função somarLista(numeros) que percorre o array e retorna a soma total:',
      codigoInicial:
        '// Monte a função somarLista(numeros)\n// acumulando os itens e devolvendo o total',
      resultadoEsperado:
        'Ordenar corretamente a assinatura da função, o acumulador inicial, o loop pelo array, a soma do item atual, o fechamento do loop e o return.',
      dica:
        'Comece com a função, crie let total = 0 antes do for, some numeros[i] ao total dentro do loop, feche o for e retorne total.',
      frases: [
        '  let total = 0',
        'function somarLista(numeros) {',
        '    total = total + numeros[i]',
        '  for (let i = 0; i < numeros.length; i++) {',
        '  }',
        '  return total',
        '}',
      ],
      ordemCorreta: [
        'function somarLista(numeros) {',
        '  let total = 0',
        '  for (let i = 0; i < numeros.length; i++) {',
        '    total = total + numeros[i]',
        '  }',
        '  return total',
        '}',
      ],
      acertoMsg:
        'Mandou bem! A função junta parâmetro, acumulador, loop em array e return na ordem certa.',
      erroMsg:
        'Alguma linha ficou fora de ordem. Confira onde entra let total = 0, como o for percorre numeros e onde fica o return total.',
    },

    quiz: [
      {
        pergunta: 'Ao passar um objeto pedido para verificarFreteGratis(pedido), como a função acessa o valor do pedido?',
        opcoes: [
          'Usando pedido.valor dentro da função',
          'Apenas adivinhando o nome sem usar o parâmetro pedido',
          'Convertendo o objeto inteiro em um número com ++',
        ],
        respostaCorreta: 0,
        explicacao:
          'Dentro da função, o parâmetro pedido referencia o objeto recebido e permite ler propriedades como pedido.valor.',
      },
      {
        pergunta: 'Por que return total deve ficar fora e depois do loop for dentro de somarLista(numeros)?',
        opcoes: [
          'Porque o loop precisa percorrer todos os elementos antes de a função devolver o resultado final',
          'Porque o JavaScript não permite escrever return dentro de um bloco com chaves',
          'Porque colocar return depois do loop apaga a variável total',
        ],
        respostaCorreta: 0,
        explicacao:
          'Se o return ficasse dentro do loop, a função encerraria na primeira volta antes de somar o resto da lista.',
      },
      {
        pergunta: 'O que acontece se uma função que calcula um desconto apenas usa console.log e não tem return?',
        opcoes: [
          'Ela exibe o valor no console, mas quem chamou a função recebe undefined como retorno',
          'Ela impede que outras variáveis sejam criadas no programa',
          'Ela repete o cálculo infinitamente',
        ],
        respostaCorreta: 0,
        explicacao:
          'Sem uma instrução return explícita, a função retorna undefined para quem a chamou.',
      },
    ],

    conclusao: {
      aprendizados: [
        'Funções recebem objetos e arrays com naturalidade para ler campos ou percorrer coleções.',
        'Manter acumuladores fora do loop e retornar o resultado ao final garante cálculos completos.',
        'Combinar funções, objetos e arrays prepara a base para resolver problemas completos no projeto integrador.',
      ],
      reflexao:
        'Como você combinaria um array de objetos (por exemplo, tarefas com titulo e concluida) com uma função que conta quantas estão concluídas?',
      proximaAulaId: 'lesson-16',
    },
  },
  {
    id: 'lesson-16',
    numero: 16,
    modulo: 4,
    titulo: 'Projeto Integrador da Base: Resumo de Pedidos',
    resumo:
      'Integre funções, objetos, arrays, loops, condições e lógica booleana para montar um resumo de pedidos do início ao fim.',

    introducao: {
      objetivo:
        'Consolidar toda a trilha base aplicando decomposição, variáveis, tipos, comparações, lógica, decisões, loops, arrays, funções e objetos em um cenário completo.',
      contexto:
        'Da ordem dos passos e decomposição na Aula 1 até funções manipulando objetos e arrays na Aula 15, cada etapa construiu uma peça do quebra-cabeça. Neste fechamento da trilha, vamos juntar essas peças para resumir pedidos aprovados e calcular o valor total.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Decompondo o problema antes de montar a função',
          explicacao:
            'Para resumir uma lista de pedidos, separamos o trabalho em partes claras: começar com um acumulador zerado, percorrer o array de pedidos com for, checar com if e operadores lógicos se o pedido está válido/pago e somar o valor apenas quando a regra passar.',
        },
        {
          titulo: '2. Objetos dentro de arrays + decisões em cada volta',
          explicacao:
            'Em um array de objetos — como uma lista de pedidos onde cada item tem valor e pago —, pedidos[i] entrega o objeto da vez, e pedidos[i].pago / pedidos[i].valor acessam as propriedades necessárias para decidir e acumular.',
        },
        {
          titulo: '3. Retornando o resultado final com clareza',
          explicacao:
            'Ao fim do loop, a função retorna o total acumulado com return. Assim, o mesmo código serve tanto para exibir o resumo quanto para reaproveitar o valor em outras regras da aplicação.',
        },
      ],

      exemploCotidiano:
        'Situação real — fechamento de caixa de pedidos pagos:\nVocê olha cada pedido da lista: se pedido.pago && !pedido.cancelado, soma pedido.valor no total; se não estiver pago ou foi cancelado, ignora e segue para o próximo.',

      exemploCodigo:
        '// Integrando função, array de objetos, condição e acumulador\nconst pedidos = [\n  { item: "Curso JS", valor: 100, pago: true },\n  { item: "E-book", valor: 40, pago: false },\n  { item: "Mentoria", valor: 160, pago: true },\n]\n\nfunction somarPedidosPagos(lista) {\n  let total = 0\n  for (let i = 0; i < lista.length; i++) {\n    if (lista[i].pago && lista[i].valor > 0) {\n      total = total + lista[i].valor\n    }\n  }\n  return total\n}\n\nconsole.log(somarPedidosPagos(pedidos)) // 260',

      resumo:
        'O projeto integrador junta decomposição, objetos, arrays, loops, condições e funções com return para resolver um problema real com clareza.',
    },

    pratica: {
      titulo: 'Classifique cada parte do resumo de pedidos',
      enunciado:
        'Considere o cenário abaixo e toque na classificação correta para cada trecho ou afirmação:\n\nconst pedidos = [\n  { valor: 50, pago: true },\n  { valor: 80, pago: false },\n  { valor: 30, pago: true },\n]',
      codigoInicial:
        'const pedidos = [\n  { valor: 50, pago: true },\n  { valor: 80, pago: false },\n  { valor: 30, pago: true },\n]\n// Classifique o papel de cada trecho no resumo',
      resultadoEsperado:
        'Identificar corretamente o total somado apenas dos pedidos pagos, o papel de if (lista[i].pago) e a função do return.',
      dica:
        'Some apenas os pedidos em que pago === true (50 e 30) e observe o que cada estrutura faz no fluxo.',
      classificacao: {
        categorias: ['Soma 80', 'Filtra pedidos pagos', 'Devolve o resultado'],
        itens: [
          {
            texto: 'Total acumulado apenas dos pedidos com pago === true (50 + 30)',
            categoriaCorreta: 'Soma 80',
          },
          {
            texto: 'Condição if (lista[i].pago) dentro do loop for',
            categoriaCorreta: 'Filtra pedidos pagos',
          },
          {
            texto: 'Instrução return total ao final da função',
            categoriaCorreta: 'Devolve o resultado',
          },
        ],
        acertoMsg:
          'Mandou bem! Você conectou todas as peças da trilha base na Aula 16.',
        erroMsg:
          'Algum item ficou sem classificação ou com papel trocado. Confira a soma de 50 + 30, o filtro com if e o papel de return.',
      },
    },

    quiz: [
      {
        pergunta: 'No exemplo com pedidos de 50 (pago: true), 80 (pago: false) e 30 (pago: true), qual valor a função somarPedidosPagos retorna?',
        opcoes: [
          '80 (apenas os pedidos com pago === true são somados)',
          '160 (soma todos os pedidos, inclusive o não pago)',
          '50',
        ],
        respostaCorreta: 0,
        explicacao:
          'Como o pedido de 80 tem pago: false, a condição if (lista[i].pago) não é atendida para ele, restando 50 + 30 = 80.',
      },
      {
        pergunta: 'Qual é o benefício de decompor um problema como esse em etapas antes de escrever o código final?',
        opcoes: [
          'Permite estruturar dados, condições, repetição e retorno em partes simples e fáceis de conferir',
          'Dispensa testar condições e limites de array',
          'Faz com que variáveis não precisem de nomes claros',
        ],
        respostaCorreta: 0,
        explicacao:
          'Decompor organiza o raciocínio em passos claros, reduzindo erros de lógica e facilitando a manutenção.',
      },
      {
        pergunta: 'Ao encerrar a base com funções, objetos, arrays, condições e lógica, o que você já consegue construir?',
        opcoes: [
          'Pequenas regras e rotinas organizadas que avaliam dados, percorrem listas e retornam resultados',
          'Apenas declarações sem condições ou repetição',
          'Códigos que dependem exclusivamente de copiar e colar blocos repetidos',
        ],
        respostaCorreta: 0,
        explicacao:
          'Esses fundamentos formam a base de praticamente qualquer lógica de programação em JavaScript.',
      },
    ],

    conclusao: {
      aprendizados: [
        'Você conectou lógica, variáveis, tipos, comparações e operadores lógicos a decisões e repetições.',
        'Arrays e objetos permitiram estruturar listas e entidades com propriedades nomeadas.',
        'Funções com parâmetros e return reuniram tudo em blocos reutilizáveis — concluindo a trilha base do CodeLab.',
      ],
      reflexao:
        'Agora que você concluiu as 16 aulas da base, qual pequeno projeto ou rotina do dia a dia você gostaria de montar primeiro?',
      proximaAulaId: null,
    },
  },
]