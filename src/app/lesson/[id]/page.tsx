'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { JAVASCRIPT_MODULES, LessonData } from '@/data/courses'
import { supabase } from '@/lib/supabase'

interface LessonPageProps {
  params: Promise<{ id: string }>
}

export default function LessonPage({ params }: LessonPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const lessonId = resolvedParams.id

  let foundLesson: LessonData | null = null
  for (const mod of JAVASCRIPT_MODULES) {
    const l = mod.lessons.find(item => item.id === lessonId)
    if (l) {
      foundLesson = l
      break
    }
  }

  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [userCode, setUserCode] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)

  if (!foundLesson) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 space-y-4">
        <h1 className="text-xl font-bold text-slate-300">Lição não encontrada.</h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl cursor-pointer text-sm"
        >
          Voltar ao Início
        </button>
      </div>
    )
  }

  const challenge = foundLesson.challenges[0]

  const handleCheckAnswer = () => {
    let correct = false

    if (challenge.type === 'multiple-choice') {
      if (selectedOption === null) return
      correct = selectedOption === challenge.correctAnswer
    } else if (challenge.type === 'code') {
      if (!userCode.trim()) return
      const cleanUserCode = userCode.replace(/\s+/g, '').toLowerCase()
      const expected = (challenge.expectedSnippet || '').replace(/\s+/g, '').toLowerCase()
      correct = cleanUserCode.includes(expected)
    }

    setIsCorrect(correct)
    setIsAnswered(true)

    if (!correct) {
      setHasErrors(true)
    }
  }

  const handleFinishLesson = async () => {
    const finalStatus = hasErrors ? 'reviewing' : 'completed'

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await supabase
        .from('user_progress')
        .upsert(
          { 
            user_id: session.user.id, 
            lesson_id: foundLesson?.id, 
            status: finalStatus,
            completed_at: new Date().toISOString()
          },
          { onConflict: 'user_id, lesson_id' }
        )
    }

    router.push('/')
  }

  const getMasterClassContent = (id: string) => {
    switch (id) {
      case 'variaveis-e-atribuicao':
        return {
          title: "Variáveis e Atribuição: As Caixinhas da Memória",
          context: "Imagine que o computador é uma mesa enorme, totalmente vazia. Se você jogar dados soltos nela, em segundos vira um caos e você perde a referência de tudo. Para resolver isso, usamos gavetas com etiquetas identificadas. Em programação, essas gavetas são chamadas de VARIÁVEIS.",
          realWorldProblem: "💡 No mundo real, pense em um placar de jogo de futebol: o placar muda o tempo todo conforme os gols saem. Precisamos de um espaço na memória que guarde o número atual e permita alterá-lo instantaneamente.",
          anatomyTitle: "Anatomia Detalhada da Linha de Código:",
          anatomyLines: [
            { codePiece: "let", explanation: "A palavra-chave (keyword) que avisa o motor do JavaScript: 'Atenção, estou criando uma caixinha flexível na memória RAM'." },
            { codePiece: "nomeDoAluno", explanation: "É o identificador (a etiqueta) da caixa. Deve ser claro e descritivo para que qualquer programador entenda o que há dentro." },
            { codePiece: "=", symbol: true, explanation: "O operador de atribuição. Atenção: ele NÃO significa igualdade matemática; ele pega o valor da DIREITA e joga para DENTRO da caixa da ESQUERDA." },
            { codePiece: '"João"', explanation: "O dado bruto armazenado (neste caso, uma string de texto)." },
            { codePiece: ";", symbol: true, explanation: "O ponto e vírgula encerra formalmente o comando (instrução)." }
          ],
          visualExample: `// Criando uma caixinha flexível\nlet pontuacaoAtual = 10;\n\n// Alterando o valor guardado mais tarde\npontuacaoAtual = 25;\n\nconsole.log(pontuacaoAtual); // Exibe: 25`,
          pitfall: "⚠️ Armadilha comum de iniciante: Escrever let 10Nome = 'João' (variáveis nunca podem começar com números) ou esquecer que o let só é declarado na PRIMEIRA vez que criamos a caixa.",
          takeaway: "Sempre que precisar guardar um dado que varia com o tempo, use let, dê um nome intuitivo, utilize o sinal de atribuição (=) e finalize com ponto e vírgula."
        }
      case 'tipos-de-dados':
        return {
          title: "Tipos de Dados Básicos: Como o Computador Vê o Mundo",
          context: "Para nós humanos, ler o número 10 e o texto '10' parece exatamente a mesma coisa. Porém, para a arquitetura de um computador, são universos completamente diferentes que ocupam espaços e regras lógicas totalmente distintas na memória.",
          realWorldProblem: "💡 Se você tentar multiplicar o texto 'dez' por 2, o computador entra em pane. Ele precisa saber exatamente com qual tipo de dado está lidando para aplicar as operações corretas.",
          anatomyTitle: "Os Três Pilares dos Tipos Primitivos:",
          anatomyLines: [
            { codePiece: "String (Textos)", explanation: "Qualquer sequência de caracteres envolvida obrigatoriamente por aspas simples ('...') ou duplas (\"...\"). Ex: let email = \"contato@codelab.com\";" },
            { codePiece: "Number (Números)", explanation: "Valores numéricos puros (inteiros ou decimais com ponto). Não levam aspas. Ex: let temperatura = 36.5;" },
            { codePiece: "Boolean (Lógicos)", explanation: "Aceita estritamente dois estados binários: verdadeiro (true) ou falso (false). Usado em tomadas de decisão." }
          ],
          visualExample: `let nomeProduto = \"Smartphone\"; // String (texto)\nlet precoUnitario = 1200.50; // Number (número)\nlet emEstoque = true;          // Boolean (lógico)`,
          pitfall: "⚠️ Armadilha comum: Escrever let idade = \"25\" (com aspas). Isso transforma o número em um texto, impedindo que você faça contas matemáticas com ele diretamente.",
          takeaway: "Respeite os tipos: textos sempre usam aspas, números vão crus, e valores de verdadeiro/falso usam booleanos puros."
        }
      case 'operadores-matematicos':
        return {
          title: "Operadores Matemáticos e o Comando Console",
          context: "Desde o ensino fundamental aprendemos matemática básica. Em JavaScript, o computador funciona como uma super calculadora de alta velocidade capaz de processar milhões de operações aritméticas em frações de milissegundos.",
          realWorldProblem: "💡 Em um e-commerce, o sistema precisa calcular automaticamente o valor total do carrinho somando os produtos e aplicando descontos ou taxas de frete em tempo real.",
          anatomyTitle: "Sintaxe dos Cálculos e Saída de Dados:",
          anatomyLines: [
            { codePiece: "+ , - , * , /", explanation: "Operadores fundamentais para Adição, Subtração, Multiplicação e Divisão." },
            { codePiece: "console.log()", explanation: "A ferramenta de diagnóstico fundamental. Imprime o resultado do que estiver dentro dos parênteses direto no console do desenvolvedor." }
          ],
          visualExample: `let precoProduto = 50;\nlet frete = 15;\nlet valorTotal = precoProduto + frete;\n\nconsole.log(valorTotal); // Exibe o resultado: 65`,
          pitfall: "⚠️ Armadilha comum: Esquecer que a multiplicação usa o asterisco (*) e a divisão usa a barra (/), e não símbolos gráficos tradicionais de caderno.",
          takeaway: "Combine variáveis e números dentro do console.log usando operadores matemáticos para inspecionar dados e validar cálculos instantaneamente."
        }
      case 'condicionais-if-else':
        return {
          title: "Condicionais If / Else: Dando Inteligência ao Código",
          context: "Até agora, nossos scripts executavam de cima para baixo em linha reta, como um trem em um trilho único. Porém, softwares reais precisam tomar decisões inteligentes baseadas em regras de negócio.",
          realWorldProblem: "💡 Em um sistema de cinema, o programa precisa testar a idade do cliente: SE a idade for maior ou igual a 18, libera a entrada; SENÃO (caso contrário), bloqueia.",
          anatomyTitle: "Anatomia da Tomada de Decisão:",
          anatomyLines: [
            { codePiece: "if (condição)", explanation: "A palavra-chave de teste. Se a expressão entre parênteses resultar em true (verdadeiro), o bloco de código interno é executado." },
            { codePiece: "{ ... }", explanation: "Chaves que delimitam o escopo de comandos que rodam caso a condição seja verdadeira." },
            { codePiece: "else", explanation: "O plano B inquestionável. Executado automaticamente se o teste do if falhar." }
          ],
          visualExample: `let pontuacaoJogo = 85;\n\nif (pontuacaoJogo >= 70) {\n  console.log(\"Parabéns, você passou de fase!\");\n} else {\n  console.log(\"Tente novamente.\");\n}`,
          pitfall: "⚠️ Armadilha comum: Esquecer de abrir e fechar as chaves `{}` do bloco de código, gerando erros crípticos de sintaxe no interpretador.",
          takeaway: "O if avalia um cenário. Se a regra for atendida, o caminho principal acontece; caso contrário, o fluxo cai com segurança no bloco else."
        }
      case 'comparadores-logicos':
        return {
          title: "Comparadores: A Importância do Igualdade Estrita (===)",
          context: "Para tomar decisões precisas com condicionais, precisamos comparar valores constantemente: saber se um produto é igual ao outro, se um número é maior, ou se uma senha confere.",
          realWorldProblem: "💡 Em formulários de login, comparar senhas de forma incorreta pode permitir que invasores entrem no sistema devido a conversões malucas de tipos automáticas do JavaScript.",
          anatomyTitle: "O Padrão Ouro da Programação:",
          anatomyLines: [
            { codePiece: "==", explanation: "Igualdade solta. Tenta converter tipos automaticamente nos bastidores, gerando comportamentos inesperados e bugs difíceis de achar. Evite!" },
            { codePiece: "===", explanation: "Igualdade estrita. Compara rigorosamente TANTO o valor quanto o tipo de dado. É o padrão profissional obrigatório." }
          ],
          visualExample: `console.log(10 === 10);    // true (mesmo valor e tipo)\nconsole.log(10 === \"10\");  // false (número vs texto)`,
          pitfall: "⚠️ Armadilha comum: Usar um único sinal de igual (=) dentro de um teste condicional. Lembre-se: um sinal (=) atribui valor, três sinais (===) comparam.",
          takeaway: "Para programar com rigor profissional e blindar seu sistema contra bugs, adote sempre a igualdade estrita com três iguais (===)."
        }
      default:
        return {
          title: "Masterclass de Fundamentos",
          context: "Entendendo os conceitos essenciais para estruturar lógica computacional limpa e robusta.",
          realWorldProblem: "💡 Fundamentos sólidos evitam horas de depuração de código no futuro.",
          anatomyTitle: "Estrutura Geral:",
          anatomyLines: [{ codePiece: "Instrução", explanation: "Comando executado pelo interpretador do ambiente." }],
          visualExample: `console.log(\"Executando com sucesso!\");`,
          pitfall: "⚠️ Atenção aos detalhes de sintaxe e pontuação.",
          takeaway: "Leia com atenção a teoria, analise o exemplo e aplique no desafio prático."
        }
    }
  }

  const lesson = getMasterClassContent(foundLesson.id)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans w-full overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Barra de Progresso Superior */}
      <div className="w-full bg-slate-900 h-1.5">
        <div className={`h-full transition-all duration-300 ${isAnswered ? 'w-full bg-emerald-400' : 'w-1/2 bg-emerald-500/50'}`} />
      </div>

      {/* Header Limpo e Responsivo */}
      <header className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-3.5 w-full box-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 w-full">
          <button 
            onClick={() => router.push('/')}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            ← Voltar
          </button>
          
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 truncate max-w-[180px] sm:max-w-[280px] text-center">
            {foundLesson.title}
          </span>

          <span className="text-[11px] text-slate-500 font-mono shrink-0">
            Codelab
          </span>
        </div>
      </header>

      {/* Conteúdo Principal Adaptado ao Celular */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3 sm:px-6 py-6 space-y-6 box-border overflow-x-hidden">
        
        {/* Bloco de Teoria Encorpado */}
        <div className="space-y-5 w-full">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
              🎓 Masterclass Teórica
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight break-words">{lesson.title}</h1>
          </div>

          <div className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed space-y-5 bg-slate-900/60 border border-slate-800/80 p-4 sm:p-6 rounded-2xl shadow-xl w-full box-border">
            
            <p className="text-slate-200 leading-relaxed break-words">{lesson.context}</p>

            <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-300 text-xs leading-relaxed break-words">
              {lesson.realWorldProblem}
            </div>

            <div className="space-y-2.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 w-full box-border">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">{lesson.anatomyTitle}</h4>
              <div className="space-y-2.5 w-full">
                {lesson.anatomyLines.map((line, idx) => (
                  <div key={idx} className="flex flex-col gap-1 pb-2 border-b border-slate-900/80 last:border-0 last:pb-0 w-full">
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit">
                      {line.codePiece}
                    </span>
                    <span className="text-xs text-slate-300 leading-relaxed break-words">
                      {line.explanation}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 w-full">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">💻 Exemplo Prático Comentado:</h4>
              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl font-mono text-xs text-emerald-400 shadow-inner overflow-x-auto w-full box-border">
                <pre className="whitespace-pre-wrap break-all">{lesson.visualExample}</pre>
              </div>
            </div>

            <div className="text-xs text-amber-300 font-medium bg-amber-950/20 border border-amber-800/40 p-3.5 rounded-xl leading-relaxed break-words">
              {lesson.pitfall}
            </div>

            <div className="text-xs text-emerald-300 font-semibold bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl leading-relaxed break-words">
              ⭐ <strong>Regra de Ouro:</strong> {lesson.takeaway}
            </div>

          </div>

          <div className="border-t border-slate-900 pt-1" />
        </div>

        {/* Bloco de Desafio */}
        <div className="space-y-5 w-full">
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>{challenge.type === 'code' ? '💻 Desafio Prático' : '📝 Validação de Conhecimento'}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug break-words">
            {challenge.question}
          </h3>

          {challenge.type === 'multiple-choice' && challenge.options && (
            <div className="space-y-2.5 w-full">
              {challenge.options.map((option, index) => {
                let optionStyle = "border-slate-900 bg-slate-900/40 hover:border-slate-800 text-slate-300 cursor-pointer"
                
                if (selectedOption === index) {
                  optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                }

                if (isAnswered) {
                  if (index === challenge.correctAnswer) {
                    optionStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-200"
                  } else if (selectedOption === index && !isCorrect) {
                    optionStyle = "border-rose-500 bg-rose-950/40 text-rose-200"
                  }
                }

                return (
                  <button
                    key={index}
                    disabled={isAnswered}
                    onClick={() => setSelectedOption(index)}
                    className={`w-full text-left p-3.5 rounded-xl border font-medium transition-all text-xs sm:text-sm box-border break-words ${optionStyle}`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          )}

          {challenge.type === 'code' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-inner w-full box-border">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-500 font-mono">
                <span>script.js</span>
                <span>JavaScript</span>
              </div>
              <textarea
                autoFocus
                disabled={isAnswered}
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="// Escreva seu código aqui..."
                rows={5}
                className="w-full bg-transparent text-emerald-400 font-mono text-xs sm:text-sm focus:outline-none resize-none placeholder:text-slate-600 leading-relaxed box-border"
                spellCheck={false}
              />
            </div>
          )}

          {isAnswered && (
            <div className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 w-full box-border ${isCorrect ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-amber-950/30 border-amber-800/40 text-amber-300'}`}>
              <p className="font-bold">
                {isCorrect ? '✨ Sensacional! Conceito assimilado.' : '💡 Opa! Errado, tópico marcado para revisão.'}
              </p>
              <p className="opacity-90 leading-relaxed break-words"><strong className="text-white">Explicação:</strong> {challenge.explanation}</p>
            </div>
          )}

          <div className="pt-2 w-full">
            {!isAnswered ? (
              <button
                disabled={challenge.type === 'multiple-choice' ? selectedOption === null : !userCode.trim()}
                onClick={handleCheckAnswer}
                className={`w-full py-3.5 rounded-xl font-bold transition-all text-xs sm:text-sm ${
                  (challenge.type === 'multiple-choice' ? selectedOption !== null : userCode.trim())
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-lg shadow-emerald-500/10' 
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                }`}
              >
                Verificar Resposta
              </button>
            ) : (
              <button
                onClick={handleFinishLesson}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-colors cursor-pointer text-xs sm:text-sm shadow-lg shadow-emerald-500/10"
              >
                Salvar e Concluir Tópico →
              </button>
            )}
          </div>

        </div>

      </main>

    </div>
  )
}