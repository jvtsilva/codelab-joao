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
  etapas?: string[]
  linhas?: string[]
  indiceErro: number
  acertoMsg?: string
  erroMsg?: string
}

export interface AcaoSimulador {
  rotulo: string
  delta?: number
  definirPara?: number
}

export interface ConfigSimuladorEstado {
  rotulo?: string
  rotuloEstado?: string
  valorInicial: number
  alvo: number
  comparador?: '>=' | '==' | '<='
  descricaoMeta?: string
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
    titulo?: string
    mensagem?: string
    proximoPasso?: string
    aprendizados?: string[]
    reflexao?: string
    proximaAulaId?: string | null
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
      'Entenda por que o computador executa tudo uma linha por vez — e o que quebra quando a ordem sai errada.',

    introducao: {
      objetivo:
        'Perceber como a ordem das instruções muda o resultado final.',
      contexto:
        'O código não adivinha intenções: ele segue cada passo na ordem exata em que aparece.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Passo a passo, sem pular etapas',
          explicacao:
            'Um programa roda em sequência. Se um passo depende do anterior, inverter a ordem quebra o fluxo.',
        },
        {
          titulo: '2. Literalidade total',
          explicacao:
            'Pessoas completam o que faltou; o código faz só o que foi mandado. Pedir o resultado antes de calcular dá ruim.',
        },
        {
          titulo: '3. Prepare antes de usar',
          explicacao:
            'Primeiro você obtém ou prepara o dado; depois usa ou transforma. Isso vale para variáveis, funções e listas.',
        },
      ],

      exemploCotidiano:
        'Café coado:\nColocar água quente antes de pôr o pó e a jarra no lugar faz bagunça. A ordem define o resultado.',

      exemploCodigo:
        '// 1. Preparar o dado\n// 2. Processar a etapa\n// 3. Mostrar o resultado',

      resumo:
        'Sequência importa: o que vem antes precisa estar pronto para o que vem depois.',
    },

    pratica: {
      titulo: 'Ordene os passos da tarefa',
      enunciado:
        'Coloque na ordem certa do início ao fim para salvar e abrir um documento:',
      codigoInicial: '// Do primeiro passo até o último',
      resultadoEsperado:
        'Ordenar os passos respeitando o que precisa acontecer primeiro.',
      dica:
        'Escreva primeiro, salve em seguida, feche e só depois abra de novo.',
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
      acertoMsg: 'Mandou bem! A sequência ficou na ordem exata.',
      erroMsg:
        'Quase lá! Revise o que precisa acontecer antes de fechar ou abrir.',
    },

    quiz: [
      {
        pergunta: 'O que significa execução sequencial?',
        opcoes: [
          'As instruções rodam uma após a outra, na ordem definida',
          'Todas as linhas rodam ao mesmo tempo em ordem aleatória',
          'O código pula automaticamente os passos difíceis',
        ],
        respostaCorreta: 0,
        explicacao:
          'Execução sequencial é seguir os passos um por vez, na ordem certa.',
      },
      {
        pergunta: 'Por que inverter dois passos dependentes causa problema?',
        opcoes: [
          'Porque o próximo passo pode exigir algo que ainda não aconteceu',
          'Porque o código muda de idioma sozinho',
          'Porque a última linha apaga tudo',
        ],
        respostaCorreta: 0,
        explicacao:
          'Sem o pré-requisito pronto, a etapa seguinte não encontra o que precisa.',
      },
      {
        pergunta: 'Como o código interpreta ordens em comparação a nós?',
        opcoes: [
          'De forma literal, sem adivinhar o que você quis dizer',
          'Completando sozinho qualquer passo esquecido',
          'Ignorando a ordem quando o código é curto',
        ],
        respostaCorreta: 0,
        explicacao: 'O computador executa literalmente a sequência escrita.',
      },
    ],

    conclusao: {
      titulo: 'Sequência dominada',
      mensagem:
        'Você viu que a ordem dos passos define o resultado e que pular etapas quebra a lógica.',
      proximoPasso:
        'Partiu Aula 2: veja como condições desviam o caminho com SE e SENÃO.',
      aprendizados: [
        'Instruções seguem uma ordem do início ao fim.',
        'Etapas dependentes exigem preparo antes de serem usadas.',
        'Pensar na ordem evita bugs simples.',
      ],
      reflexao:
        'Qual tarefa do seu dia já deu errado só porque dois passos foram feitos fora de ordem?',
      proximaAulaId: 'lesson-2',
    },
  },
  {
    id: 'lesson-2',
    numero: 2,
    modulo: 1,
    titulo: 'Condições no Dia a Dia: Se Isso, Faça Aquilo',
    resumo:
      'Veja como uma verificação muda o caminho do código conforme a situação.',

    introducao: {
      objetivo: 'Entender decisões com SE e SENÃO dentro do fluxo.',
      contexto:
        'Nem todo caminho é reto: às vezes o código precisa checar uma condição antes de agir.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Condição = pergunta de sim ou não',
          explicacao:
            'Tem bateria? Tem saldo? O campo está preenchido? Toda condição responde verdadeiro ou falso.',
        },
        {
          titulo: '2. Caminho do SE vs. caminho do SENÃO',
          explicacao:
            'Se for verdadeiro, segue um caminho; se for falso, vai para o SENÃO (ou segue direto). Só um lado acontece.',
        },
        {
          titulo: '3. Checar na hora certa',
          explicacao:
            'Avaliar a condição depois que o passo já aconteceu não adianta. A checagem vem antes da ação.',
        },
      ],

      exemploCotidiano:
        'Sair com guarda-chuva:\nOlha o céu antes de sair. Se estiver chovendo, pega o guarda-chuva; senão, vai sem ele.',

      exemploCodigo: 'SE bateria <= 15:\n  ativar economia\nSENAO:\n  manter normal',

      resumo:
        'Condições escolhem qual caminho seguir no momento certo da sequência.',
    },

    pratica: {
      titulo: 'Classifique a ação de cada cenário',
      enunciado:
        'Regra: SE crachaValido === "sim", liberar catraca; SENAO, chamar recepção. Escolha a ação de cada caso:',
      codigoInicial:
        '// crachaValido === "sim" -> "Liberar catraca"\n// senão -> "Chamar recepção"',
      resultadoEsperado: 'Escolher a ação correta para cada situação.',
      dica: 'Só passa direto quem tem crachá válido ("sim").',
      classificacao: {
        categorias: ['Liberar catraca', 'Chamar recepção'],
        itens: [
          {
            texto: 'Aluno com crachá válido ("sim")',
            categoriaCorreta: 'Liberar catraca',
          },
          {
            texto: 'Aluno sem crachá ("não")',
            categoriaCorreta: 'Chamar recepção',
          },
          {
            texto: 'Visitante com crachá vencido ("não")',
            categoriaCorreta: 'Chamar recepção',
          },
        ],
        acertoMsg: 'Mandou bem! Cada caso foi para o caminho certo.',
        erroMsg:
          'Confira quando a condição é verdadeira ("sim") ou falsa ("não").',
      },
    },

    quiz: [
      {
        pergunta: 'Qual o papel de uma condição no código?',
        opcoes: [
          'Decidir qual caminho seguir com base em uma verificação',
          'Repetir uma linha para sempre sem checar nada',
          'Anular a ordem dos passos',
        ],
        respostaCorreta: 0,
        explicacao:
          'Condições direcionam o fluxo conforme o resultado da verificação.',
      },
      {
        pergunta:
          'Se a regra é "SE estoque > 0, liberar; SENAO, avisar esgotado" e estoque é 0, o que ocorre?',
        opcoes: [
          'A condição falha e segue o caminho do SENÃO (avisar esgotado)',
          'Libera mesmo sem estoque',
          'O programa trava',
        ],
        respostaCorreta: 0,
        explicacao: 'Quando estoque > 0 é falso, o fluxo vai para o SENÃO.',
      },
      {
        pergunta: 'Por que checar a condição antes de agir?',
        opcoes: [
          'Para decidir o próximo passo antes de executar a ação',
          'Porque condições só rodam no final do código',
          'Porque não funciona antes de uma ação',
        ],
        respostaCorreta: 0,
        explicacao: 'Checar antes evita executar uma ação na hora errada.',
      },
    ],

    conclusao: {
      titulo: 'Decisões com SE e SENÃO',
      mensagem:
        'Você entendeu como condições desviam o fluxo conforme o cenário.',
      proximoPasso:
        'Siga para a Aula 3 e aprenda a quebrar problemas grandes em partes.',
      aprendizados: [
        'Condições avaliam cenários como verdadeiro ou falso.',
        'SE e SENÃO separam caminhos alternativos.',
        'A verificação precisa vir antes da ação.',
      ],
      reflexao:
        'Em um login ou cadastro, o que você checaria antes de avançar?',
      proximaAulaId: 'lesson-3',
    },
  },
  {
    id: 'lesson-3',
    numero: 3,
    modulo: 1,
    titulo: 'Decomposição e Resolução de Problemas',
    resumo:
      'Quebre problemas grandes em partes pequenas antes de montar a solução.',

    introducao: {
      objetivo: 'Dividir um problema maior em etapas simples e independentes.',
      contexto:
        'Quando o desafio parece grande demais de uma vez, fatiar em passos claros facilita tudo.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Decompor é fatiar o problema',
          explicacao:
            'Em vez de tentar resolver tudo de uma vez, quebre o objetivo em etapas pequenas e claras.',
        },
        {
          titulo: '2. Menos confusão, menos erro',
          explicacao:
            'Resolver uma parte por vez ajuda a enxergar onde está o problema quando algo falha.',
        },
        {
          titulo: '3. Entrada → Regra → Saída',
          explicacao:
            'Pense no dado que entra, na conta/regra no meio e no resultado que sai. Isso já prepara o terreno para variáveis.',
        },
      ],

      exemploCotidiano:
        'Planejar uma viagem curta:\nDivida em escolher destino, conferir orçamento, separar itens e definir a hora de sair.',

      exemploCodigo:
        '// 1. Pegar/guardar dados\n// 2. Aplicar regra\n// 3. Mostrar saída',

      resumo:
        'Dividir um problema grande em etapas curtas deixa a solução mais simples e clara.',
    },

    pratica: {
      titulo: 'Ordene as etapas da solução',
      enunciado:
        'Coloque na ordem lógica para verificar se o aluno passou e mostrar o status:',
      codigoInicial: '// Do início até o resultado final',
      resultadoEsperado: 'Ordenar entrada, comparação e exibição do resultado.',
      dica:
        'Primeiro reúna os valores, depois compare com a meta e só então mostre o status.',
      frases: [
        'Exibir mensagem de aprovado ou ajuste',
        'Obter nota do aluno e meta mínima',
        'Comparar nota com a meta mínima',
      ],
      ordemCorreta: [
        'Obter nota do aluno e meta mínima',
        'Comparar nota com a meta mínima',
        'Exibir mensagem de aprovado ou ajuste',
      ],
      acertoMsg: 'Boa! Entrada, regra e saída na ordem certa.',
      erroMsg:
        'Revise o que vem antes de comparar e exibir o resultado.',
    },

    quiz: [
      {
        pergunta: 'O que é decompor um problema?',
        opcoes: [
          'Dividir um problema grande em etapas menores e simples',
          'Apagar parte do problema até sobrar uma linha',
          'Rodar tudo junto sem ordem',
        ],
        respostaCorreta: 0,
        explicacao:
          'Decompor é quebrar um problema complexo em partes fáceis de resolver.',
      },
      {
        pergunta: 'Qual a vantagem de quebrar em etapas antes de codar?',
        opcoes: [
          'Deixa o raciocínio claro e facilita achar falhas',
          'Elimina a necessidade de lógica',
          'Dispensa entender o problema',
        ],
        respostaCorreta: 0,
        explicacao: 'Etapas menores facilitam testar e ajustar cada parte.',
      },
      {
        pergunta: 'Qual sequência ajuda a organizar a solução de um problema?',
        opcoes: [
          'Entrada de dados, processamento/regra e saída do resultado',
          'Apenas estilo visual e cores',
          'Repetição infinita sem critério',
        ],
        respostaCorreta: 0,
        explicacao: 'Mapear entrada, regra e saída organiza bem a lógica.',
      },
    ],

    conclusao: {
      titulo: 'Decomposição em ação',
      mensagem:
        'Agora você sabe dividir um problema em partes simples antes de montar o código.',
      proximoPasso:
        'Próxima parada: guardar valores em variáveis com const e let.',
      aprendizados: [
        'Problemas grandes ficam mais fáceis divididos em etapas.',
        'Separar entrada, regra e saída clareia a lógica.',
        'Você está pronto para guardar dados em variáveis.',
      ],
      reflexao:
        'Se fosse criar uma calculadora de divisão de conta, quais seriam os 3 primeiros passos?',
      proximaAulaId: 'lesson-4',
    },
  },
  {
    id: 'lesson-4',
    numero: 4,
    modulo: 2,
    titulo: 'Variáveis, const e let: Guardando Valores',
    resumo:
      'Guarde dados com nomes claros e saiba quando escolher const ou let.',

    introducao: {
      objetivo:
        'Entender variáveis e escolher entre const (fixo) e let (mutável por reatribuição).',
      contexto:
        'Depois de quebrar o problema em etapas, o próximo passo é dar nome e guardar os valores que o programa usa.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Variável = nome para um valor',
          explicacao:
            'Uma variável guarda um valor sob um nome claro (como pontuacao ou metaMinima) para você ler e reutilizar depois.',
        },
        {
          titulo: '2. const para valores fixos',
          explicacao:
            'Use const quando o valor não será reatribuído depois — como uma taxa fixa ou limite padrão.',
        },
        {
          titulo: '3. let para valores que mudam',
          explicacao:
            'Use let quando o valor vai ser atualizado no caminho — como um contador de pontos ou saldo.',
        },
      ],

      exemploCotidiano:
        'Placar do jogo:\nO nome do time (const) não muda na partida; os gols (let) sobem a cada jogada.',

      exemploCodigo:
        'const metaPontos = 100\nlet pontosAtuais = 40\n\npontosAtuais = pontosAtuais + 20\nconsole.log(pontosAtuais) // 60',

      resumo:
        'Prefira const quando não há reatribuição e use let quando o valor muda durante a execução.',
    },

    pratica: {
      titulo: 'Monte uma variável que atualiza a pontuação',
      enunciado:
        'Organize os blocos para declarar pontos com let e somar 10 pontos:',
      codigoInicial: '// Monte a declaração e a atualização da variável',
      resultadoEsperado:
        'Declarar let pontos = 0 e somar 10 em seguida.',
      dica:
        'Como a pontuação vai mudar, comece com let pontos = 0; e depois faça pontos = pontos + 10;.',
      montarBlocos: {
        blocosDisponiveis: [
          'let pontos = 0;',
          'pontos = pontos + 10;',
          'const pontos = 0;',
        ],
        respostaCorreta: ['let pontos = 0;', 'pontos = pontos + 10;'],
        acertoMsg:
          'Mandou bem! Você usou let para um valor que muda e atualizou a pontuação.',
        erroMsg:
          'Confira se usou let (e não const) e se somou 10 depois de criar a variável.',
      },
    },

    quiz: [
      {
        pergunta: 'Qual a diferença prática entre const e let?',
        opcoes: [
          'const não permite reatribuir novo valor; let permite reatribuir depois',
          'const só guarda texto e let só guarda número',
          'let nunca pode mudar de valor',
        ],
        respostaCorreta: 0,
        explicacao:
          'const trava reatribuição direta; let permite atualizar o valor guardado.',
      },
      {
        pergunta: 'Qual nome de variável deixa o código mais claro?',
        opcoes: ['vidasRestantes', 'v1', 'coisa'],
        respostaCorreta: 0,
        explicacao:
          'Nomes descritivos como vidasRestantes mostram o sentido do dado.',
      },
      {
        pergunta: 'Qual declaração faz mais sentido para um contador de acertos?',
        opcoes: [
          'let acertos = 0',
          'const acertos = 0 (e depois acertos = 1)',
          'Escrever apenas o número 0 solto',
        ],
        respostaCorreta: 0,
        explicacao:
          'Como acertos vai ser atualizado, let é a escolha certa.',
      },
    ],

    conclusao: {
      titulo: 'Variáveis com const e let',
      mensagem:
        'Você aprendeu a guardar valores com nomes claros e escolher entre const e let.',
      proximoPasso:
        'Vá para a Aula 5 e veja como textos, números e booleanos se comportam.',
      aprendizados: [
        'Variáveis guardam dados com nomes legíveis.',
        'const evita reatribuição de valores fixos.',
        'let atende valores que mudam no fluxo.',
      ],
      reflexao:
        'Em um carrinho de compras, o que seria const e o que seria let?',
      proximaAulaId: 'lesson-5',
    },
  },
  {
    id: 'lesson-5',
    numero: 5,
    modulo: 2,
    titulo: 'Tipos de Dados e Operações: Textos, Números e Booleanos',
    resumo:
      'Reconheça string, number e boolean e veja como o tipo muda o resultado de +.',

    introducao: {
      objetivo:
        'Identificar string, number e boolean e evitar confusão entre soma e junção de texto.',
      contexto:
        'O mesmo símbolo + pode somar números ou colar textos — tudo depende do tipo do dado.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. string: texto entre aspas',
          explicacao:
            '"Olá", "ativo" e até "10" entre aspas são string (texto). "10" não é um número para conta.',
        },
        {
          titulo: '2. number: números para cálculos',
          explicacao:
            'Valores como 10, 0 ou 19.9 são number e servem para contas e comparações numéricas.',
        },
        {
          titulo: '3. boolean (true / false) e o efeito do +',
          explicacao:
            'boolean guarda apenas true ou false. Já com +: 10 + 5 soma (15), mas "10" + 5 junta texto ("105").',
        },
      ],

      exemploCotidiano:
        'Quantidade de itens:\n2 + 1 vira 3. Já "2" + 1 vira "21" (texto colado).',

      exemploCodigo:
        'const curso = "CodeLab"\nconst aulas = 5\nconst ativo = true\n\nconsole.log(aulas + 1)        // 6\nconsole.log("Aula " + aulas)  // "Aula 5"',

      resumo:
        'string é texto, number é número e boolean é true/false — fique atento ao tipo antes de usar +.',
    },

    pratica: {
      titulo: 'Classifique o tipo ou o resultado',
      enunciado: 'Toque na classificação correta para cada expressão:',
      codigoInicial: '// Observe aspas, números e o operador +',
      resultadoEsperado:
        'Identificar boolean, string, number e o resultado de "10" + 5.',
      dica: 'Aspas viram string; sem aspas é number; true/false é boolean.',
      classificacao: {
        categorias: ['string', 'number', 'boolean', '"105"'],
        itens: [
          { texto: 'true', categoriaCorreta: 'boolean' },
          { texto: '"CodeLab"', categoriaCorreta: 'string' },
          { texto: '42', categoriaCorreta: 'number' },
          { texto: '"10" + 5', categoriaCorreta: '"105"' },
        ],
        acertoMsg: 'Mandou bem! Tipos e concatenação sob controle.',
        erroMsg:
          'Confira aspas, booleanos e como "10" + 5 junta os valores.',
      },
    },

    quiz: [
      {
        pergunta: 'Qual tipo aceita apenas true ou false?',
        opcoes: ['boolean', 'number', 'string'],
        respostaCorreta: 0,
        explicacao: 'boolean representa valores lógicos: true ou false.',
      },
      {
        pergunta: 'Qual o resultado de "7" + 3 em JavaScript?',
        opcoes: [
          '"73" (junta como texto por causa de "7")',
          '10 (soma matemática)',
          'false',
        ],
        respostaCorreta: 0,
        explicacao: 'Com "7" sendo string, + concatena e gera "73".',
      },
      {
        pergunta: 'Por que guardar idade como 18 (number) em vez de "18"?',
        opcoes: [
          'Para fazer contas e comparações numéricas sem virar texto colado',
          'Porque aspas impedem usar variáveis',
          'Porque number vira true sozinho',
        ],
        respostaCorreta: 0,
        explicacao: 'number mantém o valor pronto para operações numéricas.',
      },
    ],

    conclusao: {
      titulo: 'Tipos primitivos dominados',
      mensagem:
        'Você diferenciou string, number e boolean e viu quando + soma ou junta texto.',
      proximoPasso:
        'Siga para a Aula 6 e veja como comparações geram true ou false.',
      aprendizados: [
        'string guarda texto; number guarda números; boolean guarda true/false.',
        '+ soma números e concatena quando há string.',
        'Tipo certo evita bugs silenciosos.',
      ],
      reflexao:
        'Se um valor vier como texto "25", o que você checaria antes de somar 5?',
      proximaAulaId: 'lesson-6',
    },
  },
  {
    id: 'lesson-6',
    numero: 6,
    modulo: 2,
    titulo: 'Comparações: Produzindo true ou false',
    resumo:
      'Compare valores com ===, !==, >, <, >= e <= e entenda o resultado booleano.',

    introducao: {
      objetivo:
        'Usar operadores de comparação e prever se a expressão resulta em true ou false.',
      contexto:
        'Comparações transformam perguntas sobre valores em respostas true ou false.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. === e !==: comparação estrita',
          explicacao:
            '=== compara valor e tipo juntos ("5" === 5 é false). Prefira === e !== para evitar surpresas.',
        },
        {
          titulo: '2. >, <, >= e <=',
          explicacao:
            '> e < exigem passar do limite; >= e <= incluem o próprio limite (70 >= 70 é true).',
        },
        {
          titulo: '3. = não é ===',
          explicacao:
            '= atribui valor a uma variável; === compara se dois valores são iguais.',
        },
      ],

      exemploCotidiano:
        'Meta de 70 pontos:\nQuem faz 70 atinge a meta com >= 70 (true), mas não passa de 70 com > 70 (false).',

      exemploCodigo:
        'const pontos = 70\nconst meta = 70\n\nconsole.log(pontos >= meta) // true\nconsole.log(pontos > meta)  // false\nconsole.log("70" === 70)    // false',

      resumo:
        'Toda comparação retorna true ou false; === evita troca de tipo e >= / <= incluem o limite.',
    },

    pratica: {
      titulo: 'Simule a meta com o comparador',
      enunciado:
        'Ajuste o valor atual até atingir exatamente a meta 70 (usando == para meta exata) e clique em Verificar meta:',
      codigoInicial: '// Meta: chegar ao valor 70',
      resultadoEsperado: 'Levar o valor atual para 70 e validar.',
      dica: 'Use +10 e +5 até chegar em 70.',
      simuladorEstado: {
        rotulo: 'Pontuação atual',
        valorInicial: 0,
        alvo: 70,
        comparador: '==',
        acoes: [
          { rotulo: '+10', delta: 10 },
          { rotulo: '+5', delta: 5 },
        ],
        acertoMsg: 'Mandou bem! Você atingiu a meta 70 certinho.',
        erroMsg: 'Ainda não chegou a 70. Ajuste o valor e confira de novo.',
      },
    },

    quiz: [
      {
        pergunta: 'Por que usar === costuma ser melhor que ==?',
        opcoes: [
          'Porque compara valor e tipo sem forçar conversão implícita',
          'Porque altera a variável da esquerda',
          'Porque só funciona com números negativos',
        ],
        respostaCorreta: 0,
        explicacao: '=== exige valor e tipo iguais, deixando o resultado previsível.',
      },
      {
        pergunta: 'Qual comparação inclui o limite exato de 3 faltas?',
        opcoes: ['faltas <= 3', 'faltas < 3', 'faltas === 0'],
        respostaCorreta: 0,
        explicacao: '<= significa menor ou igual a 3.',
      },
      {
        pergunta: 'Qual o resultado de 10 !== 10?',
        opcoes: ['false', 'true', 'undefined'],
        respostaCorreta: 0,
        explicacao: '10 e 10 não são diferentes, então !== retorna false.',
      },
    ],

    conclusao: {
      titulo: 'Comparações dominadas',
      mensagem:
        'Você viu como ===, !==, >, <, >= e <= produzem true ou false.',
      proximoPasso:
        'Vá para a Aula 7 e combine condições com &&, || e !.',
      aprendizados: [
        'Comparações retornam true ou false.',
        '=== e !== verificam igualdade/diferença estrita.',
        '>= e <= incluem o valor limite.',
      ],
      reflexao:
        'Quando faz sentido usar >= em vez de > em uma regra de limite?',
      proximaAulaId: 'lesson-7',
    },
  },
  {
    id: 'lesson-7',
    numero: 7,
    modulo: 2,
    titulo: 'Operadores Lógicos: Combinando Regras com &&, || e !',
    resumo:
      'Combine condições com && (E) e || (OU) e inverta booleanos com ! (NÃO).',

    introducao: {
      objetivo:
        'Combinar e inverter valores booleanos com &&, || e ! para montar regras.',
      contexto:
        'Muitas decisões exigem mais de uma condição ao mesmo tempo ou checar o oposto de um estado.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. && (E): tudo precisa ser true',
          explicacao:
            'A && B só é true quando A e B são true. Se um lado for false, o resultado é false.',
        },
        {
          titulo: '2. || (OU): basta um ser true',
          explicacao:
            'A || B é true se ao menos um lado for true; só vira false quando ambos são false.',
        },
        {
          titulo: '3. ! (NÃO): inverte o booleano',
          explicacao:
            '!true vira false e !false vira true. Ótimo para ler condições como !bloqueado.',
        },
      ],

      exemploCotidiano:
        'Acesso a evento:\nIngresso válido E não bloqueado (ingressoValido && !bloqueado).',

      exemploCodigo:
        'const temSaldo = true\nconst bloqueado = false\n\nconsole.log(temSaldo && !bloqueado) // true\nconsole.log(false || temSaldo)      // true',

      resumo:
        '&& exige ambos verdadeiros, || exige ao menos um verdadeiro e ! inverte true/false.',
    },

    pratica: {
      titulo: 'Classifique cada expressão lógica',
      enunciado:
        'Com logado = true, temCupom = false e bloqueado = false, toque em true ou false:',
      codigoInicial:
        'const logado = true\nconst temCupom = false\nconst bloqueado = false',
      resultadoEsperado: 'Avaliar corretamente expressões com &&, || e !.',
      dica: '!bloqueado vira true porque bloqueado é false.',
      classificacao: {
        categorias: ['true', 'false'],
        itens: [
          { texto: 'logado && !bloqueado', categoriaCorreta: 'true' },
          { texto: 'logado && temCupom', categoriaCorreta: 'false' },
          { texto: 'temCupom || !bloqueado', categoriaCorreta: 'true' },
          { texto: '!logado', categoriaCorreta: 'false' },
        ],
        acertoMsg: 'Mandou bem! Você avaliou &&, || e ! sem tropeçar.',
        erroMsg:
          'Revise cada booleano e como &&, || e ! combinam os valores.',
      },
    },

    quiz: [
      {
        pergunta: 'Quando A && B retorna true?',
        opcoes: [
          'Apenas quando A e B forem true ao mesmo tempo',
          'Quando pelo menos um for true',
          'Quando ambos forem false',
        ],
        respostaCorreta: 0,
        explicacao: '&& exige que todas as partes sejam verdadeiras.',
      },
      {
        pergunta: 'Com a = false e b = true, qual o resultado de a || b?',
        opcoes: ['true', 'false', 'undefined'],
        respostaCorreta: 0,
        explicacao: '|| retorna true quando ao menos um lado é true.',
      },
      {
        pergunta: 'O que !false retorna?',
        opcoes: ['true', 'false', 'null'],
        respostaCorreta: 0,
        explicacao: '! inverte false para true.',
      },
    ],

    conclusao: {
      titulo: 'Operadores lógicos dominados',
      mensagem:
        'Você combinou condições com && e || e inverteu booleanos com !.',
      proximoPasso:
        'Siga para a Aula 8 e pratique regras combinando tudo isso.',
      aprendizados: [
        '&& exige todas as condições verdadeiras.',
        '|| exige ao menos uma condição verdadeira.',
        '! inverte o valor booleano.',
      ],
      reflexao:
        'Como escreveria "pode comentar se estiver logado e não estiver mutado"?',
      proximaAulaId: 'lesson-8',
    },
  },
  {
    id: 'lesson-8',
    numero: 8,
    modulo: 2,
    titulo: 'Prática Combinada de Dados e Regras',
    resumo:
      'Junte variáveis, tipos, comparações e operadores lógicos em regras completas.',

    introducao: {
      objetivo:
        'Avaliar expressões que misturam comparações e operadores lógicos.',
      contexto:
        'Antes de usar if e else, vale treinar a leitura de regras compostas com calma.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Resolva as partes primeiro',
          explicacao:
            'Transforme cada comparação (como pontos >= 70 ou !bloqueado) em true/false antes de juntar com && ou ||.',
        },
        {
          titulo: '2. Fique de olho no tipo',
          explicacao:
            'Confira se os valores têm o tipo esperado antes de comparar ou somar.',
        },
        {
          titulo: '3. Base pronta para o if',
          explicacao:
            'A expressão dentro de um if nada mais é do que uma pergunta que vira true ou false.',
        },
      ],

      exemploCotidiano:
        'Desbloqueio de bônus:\nAtivo, sem bloqueio e com pelo menos 5 aulas feitas.',

      exemploCodigo:
        'const ativo = true\nconst bloqueado = false\nconst aulas = 6\n\nconst liberado = ativo && !bloqueado && aulas >= 5 // true',

      resumo:
        'Avalie cada comparação para true/false e combine tudo com &&, || e !.',
    },

    pratica: {
      titulo: 'Classifique as regras combinadas',
      enunciado:
        'Com pontos = 85, meta = 70, ativo = true e bloqueado = false, escolha true ou false:',
      codigoInicial:
        'const pontos = 85, meta = 70, ativo = true, bloqueado = false',
      resultadoEsperado:
        'Avaliar corretamente expressões compostas com comparações e lógica.',
      dica: 'pontos >= meta é true e !bloqueado é true.',
      classificacao: {
        categorias: ['true', 'false'],
        itens: [
          {
            texto: 'ativo && !bloqueado && pontos >= meta',
            categoriaCorreta: 'true',
          },
          { texto: 'pontos < meta || bloqueado', categoriaCorreta: 'false' },
          { texto: 'pontos === 85 && bloqueado', categoriaCorreta: 'false' },
          { texto: '!ativo || pontos >= meta', categoriaCorreta: 'true' },
        ],
        acertoMsg: 'Mandou bem! Regras compostas avaliadas com segurança.',
        erroMsg:
          'Resolva cada comparação separada primeiro e depois veja && ou ||.',
      },
    },

    quiz: [
      {
        pergunta: 'Com pontos = 60, meta = 70 e recuperacao = true, o que retorna pontos >= meta || recuperacao?',
        opcoes: [
          'true (pois recuperacao é true e o operador é ||)',
          'false (pois 60 < 70)',
          'undefined',
        ],
        respostaCorreta: 0,
        explicacao:
          'Mesmo com pontos >= meta falso, || retorna true porque recuperacao é true.',
      },
      {
        pergunta: 'Qual o melhor jeito de ler uma expressão longa com && e ||?',
        opcoes: [
          'Avaliar cada comparação para true/false antes de combinar',
          'Ignorar os operadores lógicos',
          'Converter tudo em texto antes de comparar',
        ],
        respostaCorreta: 0,
        explicacao:
          'Avaliar partes menores reduz erros de leitura em condições compostas.',
      },
      {
        pergunta: 'Com senha = "123" e correta = 123, o que retorna senha === correta?',
        opcoes: ['false (string !== number)', 'true', '123'],
        respostaCorreta: 0,
        explicacao: '=== exige igualdade de valor e de tipo.',
      },
    ],

    conclusao: {
      titulo: 'Módulo 2 concluído',
      mensagem:
        'Você conectou variáveis, tipos, comparações e operadores lógicos.',
      proximoPasso:
        'Avance para a Aula 9 e direcione o fluxo com if, else if e else.',
      aprendizados: [
        'Regras combinam comparações e operadores booleanos.',
        'Avaliar partes menores facilita prever o resultado.',
        'Você está pronto para controlar caminhos com if/else.',
      ],
      reflexao:
        'Qual regra do dia a dia você já consegue escrever como uma expressão booleana?',
      proximaAulaId: 'lesson-9',
    },
  },
  {
    id: 'lesson-9',
    numero: 9,
    modulo: 3,
    titulo: 'Decisões com if, else if e else: Direcionando o Fluxo',
    resumo:
      'Use if, else if e else para escolher caminhos e entenda por que a ordem importa.',

    introducao: {
      objetivo:
        'Estruturar decisões com if, else if e else evitando erros de ordem.',
      contexto:
        'Agora que você já gera true ou false, vamos usar isso para escolher o caminho do código.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. if e else',
          explicacao:
            'if roda quando a condição é true; else roda quando nenhuma condição anterior foi true.',
        },
        {
          titulo: '2. else if para faixas e etapas',
          explicacao:
            'else if testa uma nova condição caso a anterior tenha sido falsa.',
        },
        {
          titulo: '3. Só o primeiro true roda',
          explicacao:
            'A verificação vai de cima para baixo e para no primeiro true. Coloque regras específicas antes das amplas.',
        },
      ],

      exemploCotidiano:
        'Faixa de nota:\nChecar >= 90 antes de >= 70 evita que nota 95 caia na faixa de 70.',

      exemploCodigo:
        'const nota = 85\n\nif (nota >= 90) {\n  console.log("Destaque")\n} else if (nota >= 70) {\n  console.log("Aprovado")\n} else {\n  console.log("Em revisão")\n}',

      resumo:
        'if / else if / else escolhe caminhos; apenas o primeiro bloco verdadeiro executa.',
    },

    pratica: {
      titulo: 'Ordene a estrutura if / else',
      enunciado:
        'Coloque as linhas na ordem para checar se o saldo cobre a compra:',
      codigoInicial: 'const saldo = 120, valorCompra = 90',
      resultadoEsperado:
        'Montar if (saldo >= valorCompra), bloco verdadeiro, else e bloco alternativo.',
      dica:
        'Comece com if (saldo >= valorCompra) { e feche cada bloco com }.',
      frases: [
        '  console.log("Compra aprovada")',
        'if (saldo >= valorCompra) {',
        '} else {',
        '  console.log("Saldo insuficiente")',
        '}',
      ],
      ordemCorreta: [
        'if (saldo >= valorCompra) {',
        '  console.log("Compra aprovada")',
        '} else {',
        '  console.log("Saldo insuficiente")',
        '}',
      ],
      acertoMsg: 'Mandou bem! Estrutura if / else montada na ordem certa.',
      erroMsg:
        'Confira onde abre o if, onde entra o else e o fechamento das chaves.',
    },

    quiz: [
      {
        pergunta: 'Em if / else if / else, quantos blocos executam quando uma condição é true?',
        opcoes: [
          'Apenas o primeiro bloco cuja condição for true',
          'Todos os blocos seguintes',
          'Sempre o else junto',
        ],
        respostaCorreta: 0,
        explicacao:
          'O encadeamento executa apenas o primeiro ramo verdadeiro encontrado.',
      },
      {
        pergunta: 'Por que testar uma condição específica antes de uma ampla?',
        opcoes: [
          'Para a regra ampla não engolir casos específicos antes da hora',
          'Porque else if não aceita >=',
          'Porque só pode haver um if no código',
        ],
        respostaCorreta: 0,
        explicacao: 'Casos específicos vêm antes para não serem interceptados.',
      },
      {
        pergunta: 'Quando o bloco else executa?',
        opcoes: [
          'Quando nenhuma condição anterior foi true',
          'Sempre que o if for true',
          'Antes de testar o if',
        ],
        respostaCorreta: 0,
        explicacao: 'else é o caminho alternativo quando tudo anterior deu false.',
      },
    ],

    conclusao: {
      titulo: 'Decisões com if / else',
      mensagem:
        'Você aprendeu a direcionar o fluxo com if, else if e else.',
      proximoPasso:
        'Vá para a Aula 10 e aprenda a repetir ações com for e while.',
      aprendizados: [
        'if, else if e else escolhem caminhos conforme condições.',
        'A ordem das condições importa em faixas de valores.',
        'else trata o caso padrão quando nada anterior passou.',
      ],
      reflexao:
        'Em descontos acima de 200 e acima de 100, qual você checaria primeiro?',
      proximaAulaId: 'lesson-10',
    },
  },
  {
    id: 'lesson-10',
    numero: 10,
    modulo: 3,
    titulo: 'Loops com for e while: Repetindo com Segurança',
    resumo:
      'Repita ações com for e while, entenda a parada e evite loops infinitos.',

    introducao: {
      objetivo:
        'Repetir instruções com for e while garantindo condição de parada.',
      contexto:
        'Em vez de repetir código na mão, loops executam um bloco várias vezes com controle.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. for: início, condição e passo',
          explicacao:
            'for (let i = 1; i <= 3; i++) junta início, regra de continuação e incremento.',
        },
        {
          titulo: '2. while: repete enquanto for true',
          explicacao:
            'while (condicao) roda enquanto a condição for verdadeira — atualize o estado dentro.',
        },
        {
          titulo: '3. Evite loop infinito',
          explicacao:
            'Se nada muda para tornar a condição false em algum momento, o loop nunca termina.',
        },
      ],

      exemploCotidiano:
        '3 séries de exercício:\nConta da série 1 até 3 e para ao concluir a terceira.',

      exemploCodigo:
        'for (let i = 1; i <= 3; i++) {\n  console.log("Série " + i)\n}',

      resumo:
        'for e while repetem blocos enquanto a condição for true — garanta sempre o avanço até o fim.',
    },

    pratica: {
      titulo: 'Identifique a linha que causa loop infinito',
      enunciado:
        'Toque na linha que mantém o loop rodando sem parar:',
      codigoInicial: 'let x = 1',
      resultadoEsperado: 'Encontrar a linha sem atualização que trava a parada.',
      dica: 'Se x começa em 1 e x > 0 nunca muda, x > 0 continua true para sempre.',
      cacaErro: {
        linhas: [
          'let x = 1;',
          'while (x > 0) {',
          '  console.log(x); // x nunca muda!',
          '}',
        ],
        indiceErro: 2,
        acertoMsg: 'Mandou bem! Sem atualizar x, a condição x > 0 nunca vira false.',
        erroMsg: 'Olhe o que acontece com x dentro do while.',
      },
    },

    quiz: [
      {
        pergunta: 'O que acontece se um while tiver condição sempre true sem mudança?',
        opcoes: [
          'Tende a virar loop infinito',
          'Roda só uma vez e para',
          'Executa o else automaticamente',
        ],
        respostaCorreta: 0,
        explicacao: 'Sem mudança que torne a condição falsa, a repetição não encerra.',
      },
      {
        pergunta: 'Em for (let i = 0; i < 4; i++), quantas vezes roda?',
        opcoes: ['4 vezes (0, 1, 2 e 3)', '3 vezes', '5 vezes'],
        respostaCorreta: 0,
        explicacao: 'Roda para i = 0, 1, 2 e 3 e para quando i vira 4.',
      },
      {
        pergunta: 'Quando for costuma ser mais direto que while?',
        opcoes: [
          'Quando há contador com início, limite e passo definidos',
          'Quando não se quer usar variáveis',
          'Quando não se usa < ou <=',
        ],
        respostaCorreta: 0,
        explicacao: 'for reúne início, condição e passo de forma clara.',
      },
    ],

    conclusao: {
      titulo: 'Loops com segurança',
      mensagem:
        'Você aprendeu a repetir tarefas com for e while e a evitar loops infinitos.',
      proximoPasso:
        'Siga para a Aula 11 e trabalhe com listas ordenadas em arrays.',
      aprendizados: [
        'for organiza início, condição e passo.',
        'while repete enquanto a condição for true.',
        'Toda repetição precisa de avanço e parada.',
      ],
      reflexao:
        'Qual variável precisa mudar a cada volta em um loop de tentativas?',
      proximaAulaId: 'lesson-11',
    },
  },
  {
    id: 'lesson-11',
    numero: 11,
    modulo: 3,
    titulo: 'Arrays e Acesso por Índice: Listas em Ordem',
    resumo:
      'Crie arrays, entenda o índice começando em 0 e use .length com segurança.',

    introducao: {
      objetivo:
        'Guardar listas ordenadas em arrays e acessar posições sem estourar o tamanho.',
      contexto:
        'Em vez de criar várias variáveis soltas, um array reúne vários itens na mesma lista.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Array = lista entre colchetes',
          explicacao:
            'const lista = ["A", "B", "C"] guarda valores em ordem dentro de [...].',
        },
        {
          titulo: '2. Índice começa em 0',
          explicacao:
            'O primeiro item é lista[0], o segundo é lista[1], o terceiro é lista[2].',
        },
        {
          titulo: '3. .length e último índice (length - 1)',
          explicacao:
            'Se há 3 itens, length é 3 e os índices válidos vão de 0 até 2. lista[3] dá undefined.',
        },
      ],

      exemploCotidiano:
        'Fila de 3 pessoas:\nPosições 0, 1 e 2. O tamanho é 3, mas o último índice é 2.',

      exemploCodigo:
        'const tarefas = ["Ler", "Praticar", "Revisar"]\nconsole.log(tarefas[0])              // "Ler"\nconsole.log(tarefas.length)         // 3',

      resumo:
        'Arrays começam no índice 0 e vão até length - 1.',
    },

    pratica: {
      titulo: 'Ordene o acesso do primeiro ao último item',
      enunciado:
        'Dado const etapas = ["Planejar", "Codar", "Testar"], ordene do primeiro ao último:',
      codigoInicial: 'const etapas = ["Planejar", "Codar", "Testar"]',
      resultadoEsperado: 'Ordenar etapas[0], etapas[1] e etapas[2].',
      dica: 'O primeiro item fica no índice 0.',
      frases: ['etapas[1]', 'etapas[0]', 'etapas[2]'],
      ordemCorreta: ['etapas[0]', 'etapas[1]', 'etapas[2]'],
      acertoMsg: 'Mandou bem! Acesso do índice 0 até o final na ordem certa.',
      erroMsg: 'Lembre-se de que o primeiro elemento está em etapas[0].',
    },

    quiz: [
      {
        pergunta: 'Em const frutas = ["maçã", "banana", "uva"], o que é frutas[1]?',
        opcoes: ['"banana"', '"maçã"', '"uva"'],
        respostaCorreta: 0,
        explicacao: '"maçã" é índice 0 e "banana" é índice 1.',
      },
      {
        pergunta: 'Se um array tem 4 itens (length === 4), qual o último índice válido?',
        opcoes: ['3', '4', '1'],
        respostaCorreta: 0,
        explicacao: 'Os índices vão de 0 até length - 1 (0, 1, 2 e 3).',
      },
      {
        pergunta: 'O que acontece ao acessar um índice igual ou maior que .length?',
        opcoes: ['Retorna undefined', 'Apaga o array', 'Reinicia em 0'],
        respostaCorreta: 0,
        explicacao: 'Posições fora do limite válido retornam undefined.',
      },
    ],

    conclusao: {
      titulo: 'Arrays e índices dominados',
      mensagem:
        'Você aprendeu a usar arrays, índices começando em 0 e .length.',
      proximoPasso:
        'Vá para a Aula 12 e percorra listas tomando decisões.',
      aprendizados: [
        'Arrays guardam listas ordenadas com [...].',
        'O primeiro índice é sempre 0.',
        'O último índice válido é length - 1.',
      ],
      reflexao:
        'Por que começar em 0 importa quando percorremos uma lista com um contador?',
      proximaAulaId: 'lesson-12',
    },
  },
  {
    id: 'lesson-12',
    numero: 12,
    modulo: 3,
    titulo: 'Percorrendo Listas e Tomando Decisões',
    resumo:
      'Combine for, índices e if para contar, filtrar ou acumular dados de uma lista.',

    introducao: {
      objetivo:
        'Percorrer arrays com for e aplicar if/acumuladores para resolver regras.',
      contexto:
        'Juntar loop, índice e condição permite inspecionar cada item de uma lista.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Padrão i = 0 até i < lista.length',
          explicacao:
            'Começa em 0 e vai enquanto i < lista.length com i++, acessando lista[i].',
        },
        {
          titulo: '2. Decisão por item com if',
          explicacao:
            'Dentro do for, use if para checar cada elemento e atualizar um resultado.',
        },
        {
          titulo: '3. Acumulador fora do loop',
          explicacao:
            'Declare let total = 0 ou let contador = 0 antes do for para não zerar a cada volta.',
        },
      ],

      exemploCotidiano:
        'Contar notas >= 70:\nComeça com aprovados = 0 fora do loop e soma 1 a cada nota que passa.',

      exemploCodigo:
        'const notas = [80, 55, 90, 65]\nlet aprovados = 0\n\nfor (let i = 0; i < notas.length; i++) {\n  if (notas[i] >= 70) aprovados++\n}\nconsole.log(aprovados) // 2',

      resumo:
        'Percorra com i < lista.length, decida com if e mantenha acumuladores fora do loop.',
    },

    pratica: {
      titulo: 'Classifique o comportamento do loop na lista',
      enunciado:
        'Com valores = [10, 50, 20, 80] e regra valores[i] >= 50, classifique cada afirmação:',
      codigoInicial: 'const valores = [10, 50, 20, 80]',
      resultadoEsperado:
        'Identificar acertos na contagem, no índice inicial e na condição.',
      dica: '50 e 80 são >= 50; valores[0] é 10.',
      classificacao: {
        categorias: ['Verdadeiro', 'Falso'],
        itens: [
          {
            texto: 'Contagem final de itens >= 50 é 2',
            categoriaCorreta: 'Verdadeiro',
          },
          {
            texto: 'Na primeira volta (i = 0), valores[0] é 50',
            categoriaCorreta: 'Falso',
          },
          {
            texto: 'i < valores.length percorre índices de 0 até 3',
            categoriaCorreta: 'Verdadeiro',
          },
        ],
        acertoMsg: 'Mandou bem! Loop, índice e condição bem encaixados.',
        erroMsg: 'Confira valores[0], a condição i < valores.length e a contagem.',
      },
    },

    quiz: [
      {
        pergunta: 'Por que usar i < lista.length em vez de i <= lista.length?',
        opcoes: [
          'Porque o último índice válido é length - 1',
          'Porque <= não funciona com .length',
          'Porque começa do último item',
        ],
        respostaCorreta: 0,
        explicacao: 'i < lista.length para em length - 1 sem acessar fora do array.',
      },
      {
        pergunta: 'Onde deve ficar let soma = 0 ao somar itens de um array?',
        opcoes: [
          'Antes do loop for',
          'Dentro do if a cada volta',
          'Depois do console.log final',
        ],
        respostaCorreta: 0,
        explicacao: 'Fora do loop, a soma acumula ao longo de todas as voltas.',
      },
      {
        pergunta: 'Em ["ok", "erro", "ok"], quando roda if (itens[i] === "erro")?',
        opcoes: [
          'Apenas na volta em que itens[i] é "erro" (índice 1)',
          'Em todas as 3 voltas',
          'Nunca roda',
        ],
        respostaCorreta: 0,
        explicacao: 'A condição é testada item a item.',
      },
    ],

    conclusao: {
      titulo: 'Módulo 3 concluído',
      mensagem:
        'Você combinou decisões, loops e arrays para processar listas.',
      proximoPasso:
        'Siga para a Aula 13 e organize lógicas reutilizáveis com funções.',
      aprendizados: [
        'for percorre do índice 0 até length - 1.',
        'if filtra ou conta itens durante a repetição.',
        'Acumuladores ficam fora do loop.',
      ],
      reflexao:
        'Como transformar essa lógica de lista em algo reutilizável em vários lugares?',
      proximaAulaId: 'lesson-13',
    },
  },
  {
    id: 'lesson-13',
    numero: 13,
    modulo: 4,
    titulo: 'Funções: Parâmetros e return',
    resumo:
      'Crie funções com parâmetros e return para reutilizar lógica sem duplicar código.',

    introducao: {
      objetivo:
        'Declarar funções, passar argumentos para parâmetros e devolver valores com return.',
      contexto:
        'Quando uma conta ou verificação se repete, uma função centraliza a regra.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Função = bloco reutilizável',
          explicacao:
            'Você define a lógica uma vez e chama a função sempre que precisar.',
        },
        {
          titulo: '2. Parâmetros vs. argumentos',
          explicacao:
            'Parâmetros são os nomes na definição (a, b); argumentos são os valores enviados na chamada (2, 3).',
        },
        {
          titulo: '3. return devolve o valor',
          explicacao:
            'return envia o resultado para quem chamou a função e encerra a execução dela.',
        },
      ],

      exemploCotidiano:
        'Calcular total com taxa:\nPassa subtotal e taxa e recebe o valor final pronto.',

      exemploCodigo:
        'function calcularTotal(subtotal, taxa) {\n  return subtotal + taxa\n}\n\nconsole.log(calcularTotal(80, 12)) // 92',

      resumo:
        'Funções recebem dados por parâmetros e devolvem resultados com return.',
    },

    pratica: {
      titulo: 'Monte uma função que soma dois números',
      enunciado:
        'Organize os blocos para criar somar(a, b) e retornar a + b:',
      codigoInicial: '// Monte a função somar(a, b)',
      resultadoEsperado: 'Declarar function somar(a, b), return a + b e fechar }.',
      dica: 'A função abre com function somar(a, b) {, retorna a + b e fecha com }.',
      montarBlocos: {
        blocosDisponiveis: [
          'function somar(a, b) {',
          '  return a + b;',
          '}',
        ],
        respostaCorreta: [
          'function somar(a, b) {',
          '  return a + b;',
          '}',
        ],
        acertoMsg: 'Mandou bem! Função com parâmetro e return montada.',
        erroMsg: 'Confira a ordem: abertura da função, return e fechamento.',
      },
    },

    quiz: [
      {
        pergunta: 'O que return faz dentro de uma função?',
        opcoes: [
          'Devolve um valor para quem chamou e encerra a função',
          'Cria uma variável global fixa',
          'Aumenta o contador do for',
        ],
        respostaCorreta: 0,
        explicacao: 'return retorna o resultado ao chamador e finaliza a função.',
      },
      {
        pergunta: 'Em somar(5, 8), o que são 5 e 8?',
        opcoes: ['Argumentos passados na chamada', 'Tipos booleanos', 'Índices de array'],
        respostaCorreta: 0,
        explicacao: '5 e 8 são os argumentos enviados para os parâmetros.',
      },
      {
        pergunta: 'Por que usar return em vez de só console.log?',
        opcoes: [
          'Porque o valor retornado pode ser guardado e reutilizado em outras partes',
          'Porque console.log não funciona em funções',
          'Porque return apaga o valor',
        ],
        respostaCorreta: 0,
        explicacao: 'Retornar permite usar o resultado em novas contas ou decisões.',
      },
    ],

    conclusao: {
      titulo: 'Funções dominadas',
      mensagem:
        'Você criou funções com parâmetros e return para reaproveitar lógica.',
      proximoPasso:
        'Vá para a Aula 14 e agrupe dados nomeados em objetos.',
      aprendizados: [
        'Funções evitam repetir a mesma lógica.',
        'Parâmetros recebem argumentos na chamada.',
        'return devolve o resultado da função.',
      ],
      reflexao:
        'Qual cálculo do dia a dia você transformaria em função?',
      proximaAulaId: 'lesson-14',
    },
  },
  {
    id: 'lesson-14',
    numero: 14,
    modulo: 4,
    titulo: 'Objetos: Chave, Valor e Atualização',
    resumo:
      'Agrupe dados nomeados em objetos, leia com ponto e atualize propriedades.',

    introducao: {
      objetivo:
        'Representar entidades com pares chave: valor, ler propriedades e atualizá-las.',
      contexto:
        'Quando um item tem vários campos com nome próprio, objetos deixam tudo mais claro.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Pares chave: valor em { }',
          explicacao:
            'Cada campo tem um nome (chave) e um valor associado, como nome: "Ana" e pontos: 40.',
        },
        {
          titulo: '2. Leitura com ponto',
          explicacao:
            'Use objeto.chave (ex.: aluno.nome) para ler o valor de forma legível.',
        },
        {
          titulo: '3. Atualizando propriedades',
          explicacao:
            'Com objeto.chave = novoValor você atualiza o campo mesmo se o objeto estiver em const.',
        },
      ],

      exemploCotidiano:
        'Ficha de aluno:\nNome, pontos e status agrupados em um único objeto.',

      exemploCodigo:
        'const aluno = { nome: "Ana", pontos: 40 }\naluno.pontos = aluno.pontos + 20\nconsole.log(aluno.pontos) // 60',

      resumo:
        'Objetos agrupam dados nomeados em chave: valor; leia e atualize com ponto.',
    },

    pratica: {
      titulo: 'Classifique cada operação no objeto',
      enunciado:
        'Dado const conta = { titular: "Lucas", saldo: 100, ativa: true }, classifique cada linha:',
      codigoInicial: 'const conta = { titular: "Lucas", saldo: 100, ativa: true }',
      resultadoEsperado:
        'Diferenciar leitura, atualização de saldo e comparação booleana.',
      dica: 'Veja se apenas lê, se altera saldo ou se retorna true/false.',
      classificacao: {
        categorias: ['Lê valor', 'Atualiza saldo', 'Gera true/false'],
        itens: [
          { texto: 'conta.titular', categoriaCorreta: 'Lê valor' },
          {
            texto: 'conta.saldo = conta.saldo + 50',
            categoriaCorreta: 'Atualiza saldo',
          },
          { texto: 'conta.ativa === true', categoriaCorreta: 'Gera true/false' },
        ],
        acertoMsg: 'Mandou bem! Operações em objetos identificadas.',
        erroMsg: 'Confira o que lê, o que altera saldo e o que compara.',
      },
    },

    quiz: [
      {
        pergunta: 'Qual a vantagem de usar objeto para um usuário com nome, idade e ativo?',
        opcoes: [
          'Agrupar dados relacionados sob nomes claros',
          'Impedir ler ou alterar dados',
          'Eliminar condições e loops',
        ],
        respostaCorreta: 0,
        explicacao: 'Chaves nomeadas deixam claro o significado de cada dado.',
      },
      {
        pergunta: 'Em const produto = { nome: "Mouse", estoque: 5 }, como ler o estoque?',
        opcoes: ['produto.estoque', 'produto[0]', 'estoque.produto'],
        respostaCorreta: 0,
        explicacao: 'A notação de ponto acessa a propriedade estoque.',
      },
      {
        pergunta: 'Se const item = { qtd: 1 }, o que faz item.qtd = 2?',
        opcoes: [
          'Atualiza a propriedade qtd para 2',
          'Gera erro por ser const',
          'Apaga o objeto',
        ],
        respostaCorreta: 0,
        explicacao: 'Alterar propriedades internas do objeto é permitido.',
      },
    ],

    conclusao: {
      titulo: 'Objetos dominados',
      mensagem:
        'Você organizou dados em objetos e atualizou propriedades com clareza.',
      proximoPasso:
        'Siga para a Aula 15 e combine funções, objetos e arrays.',
      aprendizados: [
        'Objetos reúnem pares chave: valor.',
        'objeto.chave lê e atualiza propriedades.',
        'Propriedades podem mudar mesmo em objeto com const.',
      ],
      reflexao:
        'Quais propriedades você colocaria em um objeto de tarefa ou pedido?',
      proximaAulaId: 'lesson-15',
    },
  },
  {
    id: 'lesson-15',
    numero: 15,
    modulo: 4,
    titulo: 'Funções Trabalhando com Objetos e Arrays',
    resumo:
      'Passe objetos e arrays para funções, aplique regras e retorne resultados.',

    introducao: {
      objetivo:
        'Unir funções, objetos e arrays para processar dados e retornar respostas.',
      contexto:
        'Funções ficam ainda mais úteis quando recebem objetos ou listas e devolvem o resultado.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Objeto como parâmetro',
          explicacao:
            'Passe o objeto (como aluno ou pedido) e acesse aluno.pontos ou pedido.valor dentro da função.',
        },
        {
          titulo: '2. Loop dentro da função',
          explicacao:
            'Uma função pode percorrer um array com for, acumular o resultado e usar return no final.',
        },
        {
          titulo: '3. Retorne o resultado final',
          explicacao:
            'Devolver o valor com return permite reaproveitar o resultado onde a função foi chamada.',
        },
      ],

      exemploCotidiano:
        'Checar destaque:\nPassa o objeto aluno para uma função que retorna aluno.ativo && aluno.pontos >= 80.',

      exemploCodigo:
        'function podeReceberBadge(aluno) {\n  return aluno.ativo && aluno.pontos >= 80\n}\n\nconsole.log(podeReceberBadge({ ativo: true, pontos: 85 })) // true',

      resumo:
        'Funções recebem objetos ou arrays, avaliam os dados e retornam o resultado.',
    },

    pratica: {
      titulo: 'Ordene a função que soma um array',
      enunciado:
        'Coloque as linhas na ordem para somar todos os números de numeros e retornar total:',
      codigoInicial: '// Função somarLista(numeros)',
      resultadoEsperado:
        'Função, let total = 0, loop for, soma e return total.',
      dica: 'return total fica depois do loop for.',
      frases: [
        '  let total = 0;',
        'function somarLista(numeros) {',
        '    total = total + numeros[i];',
        '  for (let i = 0; i < numeros.length; i++) {',
        '  }',
        '  return total;',
        '}',
      ],
      ordemCorreta: [
        'function somarLista(numeros) {',
        '  let total = 0;',
        '  for (let i = 0; i < numeros.length; i++) {',
        '    total = total + numeros[i];',
        '  }',
        '  return total;',
        '}',
      ],
      acertoMsg: 'Mandou bem! Função com loop e return montada.',
      erroMsg:
        'Confira onde fica let total = 0, a soma dentro do for e o return total.',
    },

    quiz: [
      {
        pergunta: 'Em verificarFreteGratis(pedido), como ler o valor do pedido?',
        opcoes: ['pedido.valor', 'pedido[0]', 'valor.frete'],
        respostaCorreta: 0,
        explicacao: 'Dentro da função, pedido.valor acessa a propriedade valor.',
      },
      {
        pergunta: 'Por que return total fica após o loop for?',
        opcoes: [
          'Para somar todos os itens antes de devolver o resultado final',
          'Porque return não funciona em blocos',
          'Porque apaga o total',
        ],
        respostaCorreta: 0,
        explicacao: 'Se estivesse dentro do loop, encerraria na primeira volta.',
      },
      {
        pergunta: 'O que uma função sem return devolve a quem chamou?',
        opcoes: ['undefined', '0', 'true'],
        respostaCorreta: 0,
        explicacao: 'Sem return explícito, a função retorna undefined.',
      },
    ],

    conclusao: {
      titulo: 'Funções + objetos + arrays',
      mensagem:
        'Você conectou funções, objetos e arrays para processar dados e retornar valores.',
      proximoPasso:
        'Vá para a Aula 16 e monte o projeto integrador da base.',
      aprendizados: [
        'Funções recebem objetos e arrays com facilidade.',
        'Acumuladores ficam fora do loop e return devolve o total.',
        'Base pronta para o projeto integrador.',
      ],
      reflexao:
        'Como contaria itens concluídos em um array de objetos usando uma função?',
      proximaAulaId: 'lesson-16',
    },
  },
  {
    id: 'lesson-16',
    numero: 16,
    modulo: 4,
    titulo: 'Projeto Integrador da Base: Resumo de Pedidos',
    resumo:
      'Junte lógica, condições, loops, arrays, objetos e funções em um resumo de pedidos.',

    introducao: {
      objetivo:
        'Aplicar os fundamentos da base em um cenário completo de soma de pedidos pagos.',
      contexto:
        'Hora de juntar o que você aprendeu desde a Aula 1 em uma solução clara.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Decomponha antes de codar',
          explicacao:
            'Separe em: acumulador inicial, loop pela lista, filtro com if e retorno do total.',
        },
        {
          titulo: '2. Array de objetos + condição',
          explicacao:
            'Em cada item da lista, confira propriedades como pago e some apenas os válidos.',
        },
        {
          titulo: '3. Retorno reutilizável',
          explicacao:
            'Retornar o total com return deixa o cálculo pronto para ser exibido ou reaproveitado.',
        },
      ],

      exemploCotidiano:
        'Fechamento de caixa:\nSoma apenas pedidos com pago === true.',

      exemploCodigo:
        'function somarPagos(pedidos) {\n  let total = 0\n  for (let i = 0; i < pedidos.length; i++) {\n    if (pedidos[i].pago) total += pedidos[i].valor\n  }\n  return total\n}',

      resumo:
        'Decompor, percorrer, filtrar e retornar resume bem um problema completo.',
    },

    pratica: {
      titulo: 'Classifique cada parte do resumo de pedidos',
      enunciado:
        'Com pedidos = [{ valor: 50, pago: true }, { valor: 80, pago: false }, { valor: 30, pago: true }], classifique:',
      codigoInicial: '// Soma apenas os pedidos com pago === true',
      resultadoEsperado:
        'Identificar o total 80, o filtro com if e o papel do return.',
      dica: '50 + 30 = 80; o pedido de 80 não está pago.',
      classificacao: {
        categorias: ['Soma 80', 'Filtra pagos', 'Retorna resultado'],
        itens: [
          {
            texto: 'Total somado apenas dos pedidos pagos (50 + 30)',
            categoriaCorreta: 'Soma 80',
          },
          {
            texto: 'if (lista[i].pago) dentro do for',
            categoriaCorreta: 'Filtra pagos',
          },
          {
            texto: 'return total ao final da função',
            categoriaCorreta: 'Retorna resultado',
          },
        ],
        acertoMsg: 'Mandou bem! Base da trilha fechada com chave de ouro.',
        erroMsg: 'Confira a soma de 50 + 30, o filtro if e o return.',
      },
    },

    quiz: [
      {
        pergunta: 'Com pedidos de 50 (pago: true), 80 (pago: false) e 30 (pago: true), quanto retorna somarPagos?',
        opcoes: ['80', '160', '50'],
        respostaCorreta: 0,
        explicacao: 'Apenas os pedidos pagos (50 e 30) são somados, resultando em 80.',
      },
      {
        pergunta: 'Qual a vantagem de decompor o problema antes de escrever a função?',
        opcoes: [
          'Organiza dados, condição, loop e retorno em partes simples',
          'Dispensa testar condições',
          'Elimina nomes de variáveis',
        ],
        respostaCorreta: 0,
        explicacao: 'Decompor deixa cada etapa clara e fácil de conferir.',
      },
      {
        pergunta: 'O que você já consegue construir com a base concluída?',
        opcoes: [
          'Lógicas organizadas que avaliam dados, percorrem listas e retornam resultados',
          'Apenas linhas sem condições ou repetição',
          'Códigos só com cópia e cola',
        ],
        respostaCorreta: 0,
        explicacao: 'Esses fundamentos sustentam a lógica de programação em JS.',
      },
    ],

    conclusao: {
      titulo: 'Base de lógica concluída!',
      mensagem:
        'Você concluiu os fundamentos da linguagem e está pronto para a web.',
      proximoPasso:
        'Avance para a Aula 17 e conheça a estrutura da página com HTML.',
      aprendizados: [
        'Lógica, variáveis, comparações e operadores formam a base.',
        'Condições, loops, arrays e objetos estruturam dados e fluxo.',
        'Funções reuniram tudo de forma reutilizável.',
      ],
      reflexao:
        'Qual mini-ferramenta você gostaria de criar agora que domina a base?',
      proximaAulaId: 'lesson-17',
    },
  },
  {
    id: 'lesson-17',
    numero: 17,
    modulo: 5,
    titulo: 'O que é HTML: Estrutura, Tags, Conteúdo e Inputs',
    resumo:
      'Títulos, parágrafos, listas, links, campos de entrada e botões na base da web.',

    introducao: {
      objetivo:
        'Compreender como o HTML estrutura os elementos de uma página e conhecer tags essenciais para textos, listas, links e interação.',
      contexto:
        'Antes de aplicar estilo com CSS ou fazer o JavaScript reagir a ações, a página precisa de uma estrutura clara que diga ao navegador o que é título, texto, lista, campo ou botão.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Tags e atributos definem o elemento',
          explicacao:
            'O HTML marca conteúdos usando tags como <h1>, <p> ou <button>. Muitas tags têm abertura e fechamento (<p>Texto</p>), enquanto outras representam elementos pontuais como <input>. Atributos como type, placeholder e href adicionam informações extras ao elemento.',
        },
        {
          titulo: '2. Títulos, parágrafos e listas dão hierarquia à leitura',
          explicacao:
            'Use <h1> para o título principal da página ou bloco, <p> para parágrafos corridos e <ul> / <ol> com <li> para listas de itens. Isso ajuda quem lê a entender rapidamente o que é principal e o que é complemento.',
        },
        {
          titulo: '3. Labels, inputs e buttons preparam a entrada de dados',
          explicacao:
            'Para criar interfaces interativas, você precisa de elementos que recebam dados ou disparos do usuário: <label> explica o campo, <input> recebe o texto/valor e <button type="button"> dispara uma ação.',
        },
      ],

      exemploCotidiano:
        'Situação real — um bloco rápido de anotações:\nVocê mostra um título no topo, um parágrafo curto de instrução, um campo para digitar a tarefa e um botão para adicionar.',

      exemploCodigo:
        '<section class="bloco-tarefas">\n  <h1>Minhas Tarefas</h1>\n  <p>Escreva uma tarefa e clique em adicionar.</p>\n  <label for="nova-tarefa">Nova tarefa</label>\n  <input id="nova-tarefa" type="text" placeholder="Ex.: Revisar CSS" />\n  <button type="button">Adicionar</button>\n</section>',

      resumo:
        'HTML organiza a estrutura da página com tags como h1, p, ul/li, label, input e button, enriquecidas por atributos.',
    },

    pratica: {
      titulo: 'Monte a estrutura HTML de um formulário simples',
      enunciado:
        'Coloque os blocos HTML na ordem para criar o título, o campo de entrada e o botão de ação:',
      codigoInicial: '// Organize as tags HTML na sequência correta',
      resultadoEsperado:
        'Montar a sequência correta de tags HTML para título, input e button.',
      dica: 'Comece pelo título <h1>, depois o campo <input> e por último o <button>.',
      montarBlocos: {
        blocosDisponiveis: [
          '<h1>Cadastro Rápido</h1>',
          '<button type="button">Salvar</button>',
          '<input type="text" placeholder="Seu nome" />',
        ],
        respostaCorreta: [
          '<h1>Cadastro Rápido</h1>',
          '<input type="text" placeholder="Seu nome" />',
          '<button type="button">Salvar</button>',
        ],
        acertoMsg:
          'Mandou bem! Você montou uma sequência HTML clara com título, entrada e botão.',
        erroMsg:
          'Revise a ordem das tags: título no início, campo de entrada no meio e botão ao final.',
      },
    },

    quiz: [
      {
        pergunta: 'Qual é o papel principal do HTML em uma página web?',
        opcoes: [
          'Estruturar e identificar os elementos da página, como títulos, textos, inputs e botões',
          'Substituir completamente a lógica de variáveis e condições do JavaScript',
          'Conectar diretamente ao banco de dados sem precisar de backend ou API',
        ],
        respostaCorreta: 0,
        explicacao:
          'O HTML fornece a estrutura base dos elementos que aparecem na página.',
      },
      {
        pergunta: 'Qual tag cria um campo onde o usuário pode digitar valores?',
        opcoes: ['<input>', '<h1>', '<hr>'],
        respostaCorreta: 0,
        explicacao:
          'A tag <input> cria campos de entrada na página, como texto, e-mail ou número.',
      },
      {
        pergunta:
          'Por que estruturar bem o HTML ajuda antes de escrever CSS e JavaScript?',
        opcoes: [
          'Porque deixa claro quais elementos existem na tela para estilizar e conectar eventos depois',
          'Porque dispensa o uso de seletores e funções no projeto',
          'Porque executa loops sozinho sem JavaScript',
        ],
        respostaCorreta: 0,
        explicacao:
          'Uma boa estrutura HTML facilita aplicar estilo e selecionar elementos no DOM.',
      },
    ],

    conclusao: {
      titulo: 'Base de HTML concluída',
      mensagem:
        'Você viu como tags e atributos organizam títulos, textos, listas, campos e botões na página.',
      proximoPasso:
        'Siga para a Aula 18 para dividir a página em áreas claras com containers e tags semânticas.',
      aprendizados: [
        'HTML define a estrutura dos elementos que compõem a interface.',
        'Tags como h1, p, ul/li, label, input e button cobrem os blocos essenciais da web.',
        'Uma estrutura HTML limpa facilita o CSS e a manipulação com JavaScript.',
      ],
      reflexao:
        'Se você fosse montar um card de perfil simples em HTML, quais tags usaria para nome, bio e botão?',
      proximaAulaId: 'lesson-18',
    },
  },
  {
    id: 'lesson-18',
    numero: 18,
    modulo: 5,
    titulo: 'Estrutura e Semântica: header, main, section, article e div',
    resumo:
      'Como organizar a arquitetura da página com tags semânticas e containers.',

    introducao: {
      objetivo:
        'Aprender a dividir uma página em regiões claras usando tags semânticas e usar div quando o objetivo for apenas agrupar.',
      contexto:
        'Quando uma página cresce, colocar tudo solto ou usar div para absolutamente tudo deixa o código difícil de ler. Dividir em áreas com propósito torna a página mais clara.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Regiões principais da página',
          explicacao:
            'Tags como <header> (topo/cabeçalho), <nav> (navegação), <main> (conteúdo principal) e <footer> (rodapé) mostram a função de cada grande área da página.',
        },
        {
          titulo: '2. Seções e conteúdos independentes',
          explicacao:
            'Use <section> para agrupar partes temáticas de uma página e <article> para um bloco que faz sentido por si só, como um post, notícia ou card de item.',
        },
        {
          titulo: '3. Quando usar <div>',
          explicacao:
            'A tag <div> é um container genérico sem significado semântico próprio. Ela é ótima quando você só precisa agrupar um pequeno conjunto de elementos para aplicar layout ou estilo sem forçar um significado estrutural.',
        },
      ],

      exemploCotidiano:
        'Situação real — uma revista ou painel:\nExiste o topo com título/menu, a área principal com as seções e cards, e o rodapé no fim.',

      exemploCodigo:
        '<header>\n  <h2>Portal de Estudos</h2>\n</header>\n<main>\n  <section>\n    <article class="card">\n      <h3>Card de Resumo</h3>\n      <div class="acoes"><button type="button">Abrir</button></div>\n    </article>\n  </section>\n</main>\n<footer>Rodapé</footer>',

      resumo:
        'Use tags semânticas para delimitar áreas e conteúdos com significado, e reserve div para agrupamentos neutros.',
    },

    pratica: {
      titulo: 'Classifique o papel de cada estrutura na página',
      enunciado:
        'Associe cada bloco ou necessidade estrutural à categoria mais adequada:',
      codigoInicial:
        '// Pense na função de cada elemento na arquitetura da página',
      resultadoEsperado:
        'Classificar corretamente tags estruturais/semânticas e agrupamento genérico.',
      dica:
        'Identifique o que representa área/conteúdo principal e o que é apenas agrupamento neutro.',
      classificacao: {
        categorias: ['Estrutura / Semântica', 'Agrupamento neutro (div)'],
        itens: [
          {
            texto: '<main> — delimita o conteúdo principal da página',
            categoriaCorreta: 'Estrutura / Semântica',
          },
          {
            texto:
              'Caixa neutra para agrupar elementos sem exigir significado semântico',
            categoriaCorreta: 'Agrupamento neutro (div)',
          },
          {
            texto:
              '<article> — representa um bloco independente, como um card ou post',
            categoriaCorreta: 'Estrutura / Semântica',
          },
        ],
        acertoMsg:
          'Mandou bem! Você diferenciou bem a estrutura semântica do agrupamento genérico.',
        erroMsg:
          'Revise o que define o papel estrutural do bloco e o que é apenas agrupamento neutro.',
      },
    },

    quiz: [
      {
        pergunta: 'Para que serve a tag <main> em uma página HTML?',
        opcoes: [
          'Representar o conteúdo principal e central da página',
          'Substituir todas as regras de estilo do CSS',
          'Criar um banco de dados local no navegador',
        ],
        respostaCorreta: 0,
        explicacao: '<main> indica o núcleo principal de conteúdo daquela página.',
      },
      {
        pergunta: 'Quando faz mais sentido usar uma <div>?',
        opcoes: [
          'Quando você precisa de uma caixa neutra para agrupar elementos sem significado semântico específico',
          'Sempre que precisar criar o título principal da página',
          'Apenas quando o arquivo não tiver CSS',
        ],
        respostaCorreta: 0,
        explicacao:
          '<div> funciona bem como container genérico quando nenhuma tag semântica se aplica melhor.',
      },
      {
        pergunta:
          'Qual a vantagem de usar <section> e <article> em vez de só <div> em tudo?',
        opcoes: [
          'Deixa a estrutura mais legível e clara sobre o papel de cada bloco',
          'Faz o código rodar sem navegador',
          'Elimina a necessidade de fechar tags',
        ],
        respostaCorreta: 0,
        explicacao:
          'A semântica melhora a clareza da estrutura tanto para quem lê o código quanto para ferramentas.',
      },
    ],

    conclusao: {
      titulo: 'Arquitetura HTML concluída',
      mensagem:
        'Você organizou como separar áreas principais, seções, cards e agrupamentos neutros na página.',
      proximoPasso:
        'Avance para a Aula 19 para aprender visual, tipografia e Box Model no CSS.',
      aprendizados: [
        'Tags estruturais e semânticas deixam claro o papel de cada parte da página.',
        '<section> e <article> ajudam a organizar blocos e conteúdos.',
        '<div> continua útil como agrupamento neutro quando necessário.',
      ],
      reflexao:
        'Em uma página com cabeçalho, lista de cards e rodapé, quais tags você escolheria?',
      proximaAulaId: 'lesson-19',
    },
  },
  {
    id: 'lesson-19',
    numero: 19,
    modulo: 5,
    titulo: 'CSS na Prática: Cores, Tipografia e Box Model',
    resumo:
      'Cores, fontes, bordas, box-sizing, padding e margin na construção visual.',

    introducao: {
      objetivo:
        'Entender como o CSS controla cores, fontes e o Box Model (conteúdo, padding, border e margin) para dar leitura e respiro à interface.',
      contexto:
        'Se a estrutura é o esqueleto, o CSS é o que define legibilidade, contraste e espaço. Entender o Box Model evita a maioria das dores de cabeça com tamanhos e espaçamentos.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Cores e tipografia definem leitura e hierarquia',
          explicacao:
            'Propriedades como color, background, font-size, font-weight e line-height controlam contraste, destaque e conforto de leitura. Um texto com bom contraste e espaçamento entre linhas é muito mais fácil de ler.',
        },
        {
          titulo: '2. Box Model: conteúdo, padding, border e margin',
          explicacao:
            'Todo elemento retangular tem camadas: o conteúdo interno, o padding (espaço entre o conteúdo e a borda), a border (a borda em si, com border-radius para arredondar cantos) e a margin (espaço externo que afasta o elemento de outros).',
        },
        {
          titulo: '3. box-sizing: border-box facilita o cálculo de tamanho',
          explicacao:
            'Com box-sizing: border-box, o padding e a border passam a entrar no cálculo da largura/altura definida para o elemento, evitando que ele estoure o tamanho esperado sem querer.',
        },
      ],

      exemploCotidiano:
        'Situação real — um card ou botão apertado:\nSe o texto encosta na borda e os cards colam uns nos outros, a tela parece pesada. Padding dá respiro interno e margin separa os blocos.',

      exemploCodigo:
        '* {\n  box-sizing: border-box;\n}\n\n.card {\n  background: #ffffff;\n  color: #1c1917;\n  padding: 20px;\n  margin-bottom: 16px;\n  border: 1px solid #e7e5e4;\n  border-radius: 12px;\n}',

      resumo:
        'CSS combina tipografia, cores e o Box Model (padding, border, margin e box-sizing) para deixar a interface limpa e previsível.',
    },

    pratica: {
      titulo: 'Classifique o comportamento de cada camada do Box Model e estilo',
      enunciado:
        'Identifique qual efeito cada regra ou camada exerce na caixa do elemento:',
      codigoInicial: '// Separe o que age dentro da caixa do que afasta fora dela',
      resultadoEsperado:
        'Classificar corretamente padding/borda/box-sizing e margin.',
      dica: 'Lembre: padding cria espaço por dentro da borda, enquanto margin cria distância por fora.',
      classificacao: {
        categorias: ['Dentro / Tamanho da caixa', 'Fora da caixa (margin)'],
        itens: [
          {
            texto:
              'padding: 16px — cria respiro interno entre o conteúdo e a borda',
            categoriaCorreta: 'Dentro / Tamanho da caixa',
          },
          {
            texto:
              'margin-top: 16px — cria espaço externo afastando o elemento do bloco anterior',
            categoriaCorreta: 'Fora da caixa (margin)',
          },
          {
            texto:
              'box-sizing: border-box — inclui padding e borda no cálculo do tamanho do elemento',
            categoriaCorreta: 'Dentro / Tamanho da caixa',
          },
        ],
        acertoMsg:
          'Mandou bem! Você dominou a diferença prática entre espaço interno, tamanho da caixa e margem externa.',
        erroMsg:
          'Confira o que acontece dentro/no tamanho do elemento e o que afasta por fora.',
      },
    },

    quiz: [
      {
        pergunta: 'Qual é a diferença prática entre padding e margin?',
        opcoes: [
          'padding cria espaço interno entre o conteúdo e a borda; margin cria espaço externo ao redor do elemento',
          'padding define a família da fonte e margin define a cor do texto',
          'Não há diferença entre ambos',
        ],
        respostaCorreta: 0,
        explicacao:
          'Padding atua por dentro até a borda; margin cria distância por fora do elemento.',
      },
      {
        pergunta: 'Para que serve box-sizing: border-box?',
        opcoes: [
          'Para incluir padding e borda no cálculo da largura e altura do elemento',
          'Para transformar um parágrafo em um link automaticamente',
          'Para desativar qualquer margem na página',
        ],
        respostaCorreta: 0,
        explicacao:
          'border-box torna o dimensionamento de caixas com padding e borda muito mais previsível.',
      },
      {
        pergunta:
          'Qual propriedade ajuda a arredondar os cantos de um card ou botão?',
        opcoes: ['border-radius', 'font-weight', 'line-height'],
        respostaCorreta: 0,
        explicacao: 'border-radius arredonda os cantos da caixa visual do elemento.',
      },
    ],

    conclusao: {
      titulo: 'CSS e Box Model concluídos',
      mensagem:
        'Você entendeu como tipografia, cores, bordas, padding, margin e box-sizing moldam cada elemento.',
      proximoPasso:
        'Vá para a Aula 20 para organizar vários elementos na mesma linha ou grade com Flexbox.',
      aprendizados: [
        'Tipografia e contraste garantem leitura confortável.',
        'Box Model divide o elemento entre conteúdo, padding, borda e margin.',
        'box-sizing: border-box ajuda a manter o tamanho das caixas sob controle.',
      ],
      reflexao:
        'Se um botão está com o texto encostando na borda, qual propriedade você ajusta primeiro?',
      proximaAulaId: 'lesson-20',
    },
  },
  {
    id: 'lesson-20',
    numero: 20,
    modulo: 5,
    titulo: 'Layout com Flexbox: Alinhamento, Gap e Responsividade',
    resumo:
      'Organize barras, botões e cards com display: flex, justify-content, align-items e gap.',

    introducao: {
      objetivo:
        'Aprender a alinhar, espaçar e adaptar grupos de elementos na tela usando Flexbox.',
      contexto:
        'Quando você tem vários itens — como botões de ação, itens de menu ou cards — o Flexbox permite controlar direção, alinhamento e espaçamento sem depender de truques antigos.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O container define o comportamento dos filhos diretos',
          explicacao:
            'Ao aplicar display: flex em um elemento, ele vira um flex container e seus filhos diretos passam a ser organizados conforme as propriedades do container.',
        },
        {
          titulo: '2. Alinhamento e espaçamento com gap',
          explicacao:
            'Use justify-content para distribuir os itens no eixo principal, align-items para alinhar no eixo perpendicular e gap para criar espaço uniforme entre eles.',
        },
        {
          titulo: '3. Direção e quebra de linha (flex-direction e flex-wrap)',
          explicacao:
            'Com flex-direction você escolhe linha (row) ou coluna (column). Com flex-wrap: wrap, os itens podem quebrar para a próxima linha quando a tela fica estreita.',
        },
      ],

      exemploCotidiano:
        'Situação real — barra superior ou grupo de botões:\nVocê quer os botões alinhados na mesma linha, centralizados na altura e separados por um espaço igual.',

      exemploCodigo:
        '.acoes {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n}',

      resumo:
        'Flexbox organiza filhos diretos com previsibilidade usando display: flex, alinhamentos, gap e flex-wrap.',
    },

    pratica: {
      titulo: 'Monte uma regra CSS com Flexbox',
      enunciado:
        'Organize os blocos na ordem para ativar o Flexbox, espaçar os itens e alinhá-los:',
      codigoInicial: '// Monte as propriedades CSS do container flex',
      resultadoEsperado:
        'Montar display: flex, gap e align-items na ordem correta.',
      dica: 'Comece com display: flex;, depois gap: 12px; e por fim align-items: center;.',
      montarBlocos: {
        blocosDisponiveis: [
          'display: flex;',
          'align-items: center;',
          'gap: 12px;',
        ],
        respostaCorreta: [
          'display: flex;',
          'gap: 12px;',
          'align-items: center;',
        ],
        acertoMsg:
          'Mandou bem! Essa é uma base clássica e direta para alinhar grupos na tela.',
        erroMsg: 'Ajuste a ordem dos blocos para formar a regra completa.',
      },
    },

    quiz: [
      {
        pergunta: 'O que acontece quando colocamos display: flex em um elemento?',
        opcoes: [
          'Ele passa a organizar seus filhos diretos como um flex container',
          'Ele apaga o CSS de toda a página',
          'Ele impede o usuário de clicar nos elementos internos',
        ],
        respostaCorreta: 0,
        explicacao:
          'display: flex ativa o layout flexível para os filhos diretos daquele elemento.',
      },
      {
        pergunta:
          'Qual propriedade cria espaço uniforme entre os itens de um flex container?',
        opcoes: ['gap', 'font-style', 'text-align'],
        respostaCorreta: 0,
        explicacao:
          'gap define o espaçamento entre os itens do container sem precisar de margens soltas em cada um.',
      },
      {
        pergunta: 'Para que serve flex-wrap: wrap?',
        opcoes: [
          'Permitir que os itens quebrem para outra linha quando falta espaço horizontal',
          'Converter um número em string',
          'Esconder todos os botões da tela',
        ],
        respostaCorreta: 0,
        explicacao: 'flex-wrap: wrap permite a quebra de linha em espaços menores.',
      },
    ],

    conclusao: {
      titulo: 'Flexbox concluído',
      mensagem:
        'Você aprendeu a estruturar e alinhar elementos com Flexbox e espaçamento consistente.',
      proximoPasso:
        'Siga para a Aula 21 para conectar o JavaScript aos elementos da página via DOM.',
      aprendizados: [
        'display: flex organiza os filhos diretos de um container.',
        'justify-content, align-items e gap controlam alinhamento e espaçamento.',
        'flex-wrap ajuda o layout a se adaptar melhor quando o espaço aperta.',
      ],
      reflexao:
        'Onde você usaria display: flex com gap numa interface que você está montando?',
      proximaAulaId: 'lesson-21',
    },
  },
  {
    id: 'lesson-21',
    numero: 21,
    modulo: 6,
    titulo: 'DOM na Prática: Selecionando e Lendo Elementos',
    resumo:
      'Entenda o DOM e use querySelector e querySelectorAll para encontrar elementos da tela.',

    introducao: {
      objetivo:
        'Entender o que é o DOM e selecionar elementos do HTML no JavaScript com segurança.',
      contexto:
        'Para fazer a página reagir ou mostrar informações dinâmicas, o JavaScript primeiro precisa localizar quais elementos existem na tela.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. O que é o DOM',
          explicacao:
            'O DOM (Document Object Model) é a representação da página HTML no navegador que o JavaScript pode ler e modificar.',
        },
        {
          titulo: '2. querySelector vs. querySelectorAll',
          explicacao:
            'document.querySelector() retorna o primeiro elemento que corresponde ao seletor CSS (como "#titulo", ".card" ou "button"). Já document.querySelectorAll() retorna uma coleção com todos os elementos que combinam com o seletor.',
        },
        {
          titulo: '3. Guardar referências em constantes',
          explicacao:
            'Guardar os elementos selecionados em const evita repetir buscas pela página inteira e deixa o código mais limpo.',
        },
      ],

      exemploCotidiano:
        'Situação real — pegar um controle remoto específico:\nEm vez de procurar toda vez onde ele está, você localiza o controle certo e guarda a referência para usar.',

      exemploCodigo:
        'const inputTarefa = document.querySelector("#nova-tarefa")\nconst btnAdicionar = document.querySelector(".btn-adicionar")\nconst todosItens = document.querySelectorAll(".item-lista")',

      resumo:
        'O DOM dá acesso à página no JS; querySelector busca o primeiro elemento correspondente e querySelectorAll busca todos.',
    },

    pratica: {
      titulo: 'Encontre o passo problemático ao trabalhar com o DOM',
      enunciado:
        'Analise as linhas abaixo e toque naquela que causa problema na sequência:',
      codigoInicial: '// Observe a ordem das operações com o elemento da tela',
      resultadoEsperado: 'Identificar qual linha está fora de ordem ou incorreta.',
      dica: 'Você consegue usar a referência de um elemento antes de selecioná-lo?',
      cacaErro: {
        linhas: [
          '1. Tentar ler input.value antes de selecionar o input na página',
          '2. Selecionar o input com document.querySelector("#campo")',
          '3. Guardar a referência em uma constante',
          '4. Ler o valor digitado quando o usuário agir',
        ],
        indiceErro: 0,
        acertoMsg:
          'Isso aí! Primeiro você seleciona o elemento no DOM para depois ler ou alterar algo nele.',
        erroMsg:
          'Olhe novamente para a primeira linha: ela tenta acessar o elemento antes de selecioná-lo.',
      },
    },

    quiz: [
      {
        pergunta: 'O que document.querySelector(".botao") retorna?',
        opcoes: [
          'O primeiro elemento da página que corresponde ao seletor .botao',
          'Um arquivo CSS novo',
          'O valor numérico de todos os inputs da página',
        ],
        respostaCorreta: 0,
        explicacao:
          'querySelector retorna o primeiro elemento encontrado para o seletor informado.',
      },
      {
        pergunta:
          'Quando querySelectorAll é mais indicado que querySelector?',
        opcoes: [
          'Quando você quer selecionar vários elementos que compartilham o mesmo seletor',
          'Quando você quer criar uma variável numérica',
          'Quando quer substituir o HTML inteiro sem seletor',
        ],
        respostaCorreta: 0,
        explicacao:
          'querySelectorAll retorna todos os elementos correspondentes ao seletor.',
      },
      {
        pergunta: 'O que é o DOM no contexto de desenvolvimento web?',
        opcoes: [
          'A árvore/estrutura da página no navegador que o JavaScript pode acessar e manipular',
          'Um tipo de laço de repetição',
          'Uma regra de margem do CSS',
        ],
        respostaCorreta: 0,
        explicacao:
          'O DOM representa os elementos da página para manipulação via JavaScript.',
      },
    ],

    conclusao: {
      titulo: 'Seleção no DOM concluída',
      mensagem:
        'Você entendeu como o DOM funciona e como localizar elementos com querySelector e querySelectorAll.',
      proximoPasso:
        'Siga para a Aula 22 para reagir a cliques, digitação e envios com eventos.',
      aprendizados: [
        'O DOM permite ao JavaScript interagir com a página.',
        'querySelector encontra o primeiro elemento; querySelectorAll encontra vários.',
        'Guardar referências em const organiza o código.',
      ],
      reflexao:
        'Se você tem vários cards com a classe .card, qual método usa para pegar todos eles?',
      proximaAulaId: 'lesson-22',
    },
  },
  {
    id: 'lesson-22',
    numero: 22,
    modulo: 6,
    titulo: 'Eventos na Prática: click, input e submit',
    resumo:
      'Conecte ações do usuário às suas funções JavaScript com addEventListener.',

    introducao: {
      objetivo:
        'Aprender a registrar eventos na página com addEventListener e conectar interações do usuário à lógica JavaScript.',
      contexto:
        'Uma interface ganha vida quando reage ao que o usuário faz: clicar em um botão, digitar em um campo ou enviar um formulário.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Principais eventos de interação',
          explicacao:
            'O evento "click" dispara quando o elemento é clicado; "input" dispara conforme o usuário digita ou altera um campo; "submit" ocorre no envio de um formulário.',
        },
        {
          titulo: '2. Como usar addEventListener',
          explicacao:
            'Você chama elemento.addEventListener("click", () => { ... }) para executar uma função sempre que aquele evento acontecer.',
        },
        {
          titulo: '3. Ligando evento à sua lógica',
          explicacao:
            'Dentro da função do evento, você lê valores (como input.value), valida condições com if/else e atualiza variáveis ou a tela.',
        },
      ],

      exemploCotidiano:
        'Situação real — botão de adicionar item:\nO usuário digita algo e clica em "Adicionar". O evento de clique chama a função que lê o texto e adiciona à lista.',

      exemploCodigo:
        'const btn = document.querySelector("#btn-adicionar")\nconst campo = document.querySelector("#campo-texto")\n\nbtn.addEventListener("click", () => {\n  const valor = campo.value.trim()\n  if (valor) {\n    console.log("Adicionando:", valor)\n  }\n})',

      resumo:
        'addEventListener conecta eventos como click, input e submit às funções que executam a lógica da página.',
    },

    pratica: {
      titulo: 'Monte a escuta de evento no botão',
      enunciado:
        'Organize os blocos na ordem para selecionar o botão e registrar o evento de clique:',
      codigoInicial: '// Monte a estrutura do addEventListener',
      resultadoEsperado:
        'Selecionar o botão e registrar addEventListener("click", ...).',
      dica: 'Selecione o botão primeiro, depois chame addEventListener("click", () => { ... }).',
      montarBlocos: {
        blocosDisponiveis: [
          'const btn = document.querySelector("#btn");',
          'btn.addEventListener("click", () => {',
          '  executarAcao();',
          '});',
        ],
        respostaCorreta: [
          'const btn = document.querySelector("#btn");',
          'btn.addEventListener("click", () => {',
          '  executarAcao();',
          '});',
        ],
        acertoMsg:
          'Mandou bem! Você ligou a seleção do botão ao evento de clique de forma limpa.',
        erroMsg: 'Confira a ordem dos blocos e o fechamento do addEventListener.',
      },
    },

    quiz: [
      {
        pergunta: 'O que addEventListener("click", handler) faz?',
        opcoes: [
          'Executa a função handler quando ocorre um clique no elemento',
          'Remove o elemento do HTML imediatamente',
          'Muda a cor de fundo do navegador para preto',
        ],
        respostaCorreta: 0,
        explicacao:
          'addEventListener registra uma função para rodar quando o evento especificado acontece.',
      },
      {
        pergunta:
          'Qual evento costuma ser usado para acompanhar o que o usuário digita em um input?',
        opcoes: ['input', 'scroll', 'load'],
        respostaCorreta: 0,
        explicacao: 'O evento input dispara quando o valor do campo é alterado.',
      },
      {
        pergunta: 'O que pode ser feito dentro da função de um evento?',
        opcoes: [
          'Ler valores de campos, aplicar condições e atualizar o estado ou a tela',
          'Apenas criar variáveis sem usar',
          'Substituir o arquivo HTML inteiro',
        ],
        respostaCorreta: 0,
        explicacao:
          'A função do evento executa a lógica necessária para responder à ação do usuário.',
      },
    ],

    conclusao: {
      titulo: 'Eventos concluídos',
      mensagem:
        'Você aprendeu a escutar ações do usuário e conectá-las às suas funções.',
      proximoPasso:
        'Avance para a Aula 23 para atualizar textos e classes visuais na tela.',
      aprendizados: [
        'Eventos como click, input e submit representam ações do usuário.',
        'addEventListener conecta o evento à função de resposta.',
        'Dentro do evento você aplica validações, cálculos e atualizações.',
      ],
      reflexao:
        'Em um campo de busca instantânea, qual evento faz mais sentido escutar?',
      proximaAulaId: 'lesson-23',
    },
  },
  {
    id: 'lesson-23',
    numero: 23,
    modulo: 6,
    titulo: 'Atualizando a Tela: textContent e classList',
    resumo:
      'Atualize textos, adicione ou remova classes CSS e reflita estados na interface.',

    introducao: {
      objetivo:
        'Aprender a atualizar o texto de elementos com textContent e alterar estados visuais com classList.',
      contexto:
        'Quando o usuário interage, a tela precisa refletir o novo estado: mudar um contador, exibir uma mensagem ou destacar um item selecionado.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Atualizando textos com textContent',
          explicacao:
            'Com elemento.textContent = "Novo texto", você troca o conteúdo textual de títulos, parágrafos, contadores ou avisos de forma direta.',
        },
        {
          titulo: '2. Manipulando classes com classList',
          explicacao:
            'Use classList.add("ativo") para adicionar uma classe, classList.remove("ativo") para remover e classList.toggle("ativo") para alternar.',
        },
        {
          titulo: '3. Deixe o visual no CSS e o estado no JS',
          explicacao:
            'Definir o estilo da classe no CSS (por exemplo, .concluida) e alterná-la no JS mantém o código mais organizado e fácil de manter.',
        },
      ],

      exemploCotidiano:
        'Situação real — marcar um item como concluído:\nAo clicar no item, ele alterna a classe "concluido" e o texto de status muda de "Pendente" para "Concluído".',

      exemploCodigo:
        'statusEl.textContent = "Concluído"\ncardEl.classList.toggle("concluido")',

      resumo:
        'Use textContent para atualizar textos e classList (add, remove, toggle) para alternar estados visuais.',
    },

    pratica: {
      titulo: 'Monte a atualização de texto e classe no elemento',
      enunciado:
        'Coloque os blocos na ordem para atualizar o texto de status e alternar a classe no item:',
      codigoInicial: '// Ordene as linhas de atualização visual',
      resultadoEsperado:
        'Atualizar textContent, alternar a classe com classList.toggle e renderizar.',
      dica: 'Atualize o texto primeiro, alterne a classe em seguida e finalize atualizando a visualização.',
      montarBlocos: {
        blocosDisponiveis: [
          'item.classList.toggle("ativo");',
          'status.textContent = "Ativo";',
          'atualizarTela();',
        ],
        respostaCorreta: [
          'status.textContent = "Ativo";',
          'item.classList.toggle("ativo");',
          'atualizarTela();',
        ],
        acertoMsg:
          'Mandou bem! Texto e classe ficam alinhados com o estado da tela.',
        erroMsg: 'Revise a ordem das linhas para manter a atualização clara.',
      },
    },

    quiz: [
      {
        pergunta: 'O que elemento.classList.toggle("destaque") faz?',
        opcoes: [
          'Adiciona "destaque" se não estiver presente e remove se já estiver',
          'Apaga o elemento da página',
          'Altera o endereço da URL no navegador',
        ],
        respostaCorreta: 0,
        explicacao: 'toggle alterna a presença da classe no elemento.',
      },
      {
        pergunta:
          'Por que usar classes CSS com classList costuma ser melhor que escrever vários estilos soltos no JS?',
        opcoes: [
          'Porque mantém as regras visuais no CSS e o comportamento no JS',
          'Porque impede o uso de variáveis no código',
          'Porque dispensa o uso de seletores CSS',
        ],
        respostaCorreta: 0,
        explicacao:
          'Separar o visual em classes CSS facilita a manutenção e evita repetição de estilos.',
      },
      {
        pergunta: 'Qual propriedade altera diretamente o texto de um elemento?',
        opcoes: ['textContent', 'classList', 'addEventListener'],
        respostaCorreta: 0,
        explicacao: 'textContent altera o conteúdo de texto do elemento.',
      },
    ],

    conclusao: {
      titulo: 'Atualização de tela concluída',
      mensagem:
        'Você aprendeu a atualizar textos e alternar classes CSS para refletir mudanças de estado.',
      proximoPasso:
        'Vá para a Aula 24 para integrar tudo em uma mini-interface funcional.',
      aprendizados: [
        'textContent atualiza textos de forma direta.',
        'classList.add, remove e toggle controlam classes CSS com clareza.',
        'Manter estado e interface sincronizados evita bugs visuais.',
      ],
      reflexao:
        'Em qual componente você usaria classList.toggle para ligar ou desligar um estado?',
      proximaAulaId: 'lesson-24',
    },
  },
  {
    id: 'lesson-24',
    numero: 24,
    modulo: 6,
    titulo: 'Projeto Web Integrado: Lista ou Card Interativo',
    resumo:
      'Combine HTML, CSS, arrays/objetos e eventos para montar uma mini-interface funcional.',

    introducao: {
      objetivo:
        'Integrar estrutura HTML, estilo CSS, dados em arrays/objetos e eventos do DOM em uma mini-interface completa.',
      contexto:
        'Agora você já conhece a base da linguagem, estrutura HTML, estilo/layout em CSS e manipulação de DOM e eventos. Hora de enxergar essas peças trabalhando juntas.',
    },

    teoria: {
      topicos: [
        {
          titulo: '1. Estruturando dados com arrays e objetos',
          explicacao:
            'Representar cada item como um objeto (ex.: { id: 1, titulo: "Estudar Flexbox", concluido: false }) dentro de um array facilita adicionar, marcar ou filtrar itens.',
        },
        {
          titulo: '2. O ciclo completo da interface',
          explicacao:
            'Ação do usuário (evento) -> atualização dos dados/estado -> atualização da interface na tela. Manter esse ciclo claro evita códigos confusos.',
        },
        {
          titulo: '3. Experimente e monte no Playground',
          explicacao:
            'Use o /playground para escrever seu HTML, CSS e JavaScript ao vivo e testar seu próprio card, lista de tarefas ou contador.',
        },
      ],

      exemploCotidiano:
        'Situação real — lista de tarefas ou card de metas:\nVocê guarda os itens num array, reage ao clique para marcar como feito e atualiza a exibição.',

      exemploCodigo:
        'const tarefas = [\n  { id: 1, titulo: "Criar card no Playground", feita: false },\n]\n\nfunction contarFeitas(lista) {\n  return lista.filter((item) => item.feita).length\n}',

      resumo:
        'Uma aplicação web funcional une estrutura HTML, estilo CSS, dados em JS e eventos do DOM em um fluxo claro.',
    },

    pratica: {
      titulo: 'Classifique cada parte do projeto web integrado',
      enunciado:
        'Relacione cada item à camada à qual ele pertence na aplicação:',
      codigoInicial:
        '// Separe estrutura/visual da lógica e manipulação de dados',
      resultadoEsperado:
        'Classificar corretamente Estrutura/Visual (HTML/CSS) e Dados/Interação (JS).',
      dica:
        'HTML e CSS cuidam da estrutura e aparência; JS cuida dos dados, eventos e atualizações.',
      classificacao: {
        categorias: ['Dados e Interação (JS)', 'Estrutura e Visual (HTML/CSS)'],
        itens: [
          {
            texto:
              'Array de objetos com os itens e função que atualiza o estado',
            categoriaCorreta: 'Dados e Interação (JS)',
          },
          {
            texto:
              'Tags, containers, cores, padding/margin e alinhamento com Flexbox',
            categoriaCorreta: 'Estrutura e Visual (HTML/CSS)',
          },
          {
            texto:
              'Ouvinte de evento que responde ao clique ou digitação do usuário',
            categoriaCorreta: 'Dados e Interação (JS)',
          },
        ],
        acertoMsg:
          'Fechou muito bem! Você conectou todas as partes para montar uma mini-interface completa.',
        erroMsg:
          'Revise o que pertence à estrutura/visual (HTML e CSS) e o que pertence aos dados/interação (JS).',
      },
    },

    quiz: [
      {
        pergunta:
          'Como costuma ser mais organizado guardar vários itens de uma lista dinâmica em JavaScript?',
        opcoes: [
          'Em um array de objetos representando cada item e suas propriedades',
          'Em dezenas de variáveis soltas sem relação',
          'Apenas dentro de uma propriedade de cor no CSS',
        ],
        respostaCorreta: 0,
        explicacao:
          'Arrays de objetos permitem manipular cada item de forma estruturada e previsível.',
      },
      {
        pergunta:
          'Qual sequência representa bem o fluxo de uma interação na tela?',
        opcoes: [
          'Evento do usuário -> atualização de dados/estado -> atualização da tela',
          'Alterar o CSS -> recarregar o servidor -> apagar o HTML',
          'Criar uma função sem ligar a nenhum evento ou dado',
        ],
        respostaCorreta: 0,
        explicacao:
          'Eventos disparam mudanças de estado que se refletem na interface.',
      },
      {
        pergunta:
          'Qual é a melhor forma de consolidar o que você aprendeu até aqui?',
        opcoes: [
          'Construir e testar suas próprias ideias de HTML, CSS e JS no Playground',
          'Decorar respostas sem testar nenhum código',
          'Evitar praticar com exemplos reais',
        ],
        respostaCorreta: 0,
        explicacao:
          'Praticar montando componentes no Playground consolida os conceitos na prática.',
      },
    ],

    conclusao: {
      titulo: 'Módulo 6 e trilha concluídos!',
      mensagem:
        'Você avançou do HTML e CSS até o DOM, eventos e integração em uma mini-interface.',
      proximoPasso:
        'Abra o Playground para criar sua própria lista, card ou componente interativo.',
      aprendizados: [
        'HTML e CSS organizam estrutura, tipografia, Box Model e layout.',
        'DOM e eventos conectam as ações do usuário ao JavaScript.',
        'Arrays, objetos e funções sustentam interfaces dinâmicas.',
      ],
      reflexao:
        'Qual mini-projeto você quer construir primeiro no Playground para aplicar tudo isso?',
      proximaAulaId: null,
    },
  },
]