import { normalizeReport } from "./normalize";
import { amostrar, medir, parseConversa } from "./whatsapp";
import { esperaEstimadaMs, naFila } from "./fila";
import type { Report } from "./types";

/**
 * O agente que lê a conversa.
 *
 * O modelo recebe duas coisas separadas: números que já foram contados aqui e
 * uma amostra do texto. Ele não conta nada — interpreta o que foi contado e
 * escreve. Contagem é trabalho de código; leitura é trabalho de modelo.
 *
 * Roda no Groq porque é rápido e tem camada gratuita. Precisa de GROQ_API_KEY.
 */

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

/** Escreve melhor. É o primeiro a ser tentado. */
const MODELO_PADRAO = "llama-3.3-70b-versatile";
/** Teto por minuto bem maior. Entra quando o primeiro está congestionado. */
const MODELO_RESERVA = "llama-3.1-8b-instant";

const TETO_RESPOSTA = 3000;

/**
 * O caminho reserva não é só um modelo menor: é um pedido menor.
 *
 * Na camada gratuita o llama-3.1-8b tem teto de 6 mil tokens por minuto —
 * metade do modelo bom. Trocar só o modelo não resolve nada; o recorte da
 * conversa e o tamanho da resposta precisam encolher junto.
 */
const AMOSTRA_RESERVA = 4_000;
const TETO_RESPOSTA_RESERVA = 1_600;

/** Acima disso, não vale a pena esperar pelo modelo bom. */
const ESPERA_TOLERAVEL_MS = 20_000;

/** Abaixo disso não há o que ler. Entre isso e 60, a leitura sai modesta de propósito. */
const MINIMO_MENSAGENS = 15;
const CONVERSA_CURTA = 60;

export type Contexto = {
  withAdvanced: boolean;
  respostas: { pergunta: string; resposta: string }[];
  /** Nome de quem exportou a conversa. É a quem o relatório chama de "você". */
  remetente?: string | null;
  /** Avisa a posição na fila enquanto a leitura espera a vez. */
  aoAndar?: (posicao: number) => void;
};

export function groqConfigurado() {
  return Boolean(
    process.env.OPENAI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GROQ_API_KEY,
  );
}

export async function analisarConversa(bruto: string, ctx: Contexto): Promise<Report> {
  const mensagens = parseConversa(bruto);

  if (mensagens.length < MINIMO_MENSAGENS) {
    throw new Error(
      `Não conseguimos ler essa conversa: só reconhecemos ${mensagens.length} mensagens. Confira se o arquivo é o .txt exportado do WhatsApp, sem mídia.`,
    );
  }

  const numeros = medir(mensagens);
  const amostra = amostrar(mensagens);

  const instrucoes = sistema(ctx.withAdvanced);
  const pedido = usuario(numeros, amostra, ctx);

  // Tenta em ordem: 1. OpenAI (GPT-4o-mini) -> 2. Gemini (1.5 Flash) -> 3. Groq (Llama 3.3)
  const conteudo = await chamarIaMultiProvedor(instrucoes, pedido);
  return montar(conteudo);
}

function montar(conteudo: string): Report {
  // Limpa possíveis blocos markdown ```json ... ``` retornados por alguns modelos
  const jsonLimpo = conteudo.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "").trim();
  const relatorio = normalizeReport(JSON.parse(jsonLimpo));
  if (!relatorio) throw new Error("O relatório voltou fora do formato esperado.");
  return relatorio;
}

/** Teto por minuto batido. Não é erro da conversa — é fila. */
class Congestionado extends Error {}

async function chamarIaMultiProvedor(instrucoes: string, pedido: string): Promise<string> {
  const erros: string[] = [];

  // 1. OpenAI (GPT-4o-mini) - Extremamente rápido, confiável e de baixíssimo custo
  if (process.env.OPENAI_API_KEY) {
    try {
      return await chamarOpenAI(instrucoes, pedido);
    } catch (err) {
      console.error("[ai] Falha na OpenAI, tentando próximo provedor:", err);
      erros.push(`OpenAI: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // 2. Google Gemini (gemini-1.5-flash / gemini-2.0-flash) - Rápido e gratuito/barato
  if (process.env.GEMINI_API_KEY) {
    try {
      return await chamarGemini(instrucoes, pedido);
    } catch (err) {
      console.error("[ai] Falha no Gemini, tentando próximo provedor:", err);
      erros.push(`Gemini: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // 3. Groq (Llama 3.3 70B / Llama 3.1 8B)
  if (process.env.GROQ_API_KEY) {
    try {
      return await chamarGroq(instrucoes, pedido);
    } catch (err) {
      console.error("[ai] Falha na Groq:", err);
      erros.push(`Groq: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (erros.length > 0) {
    throw new Error(`Falha na leitura de IA (${erros.join(" | ")})`);
  }

  throw new Error("Nenhuma chave de API de IA configurada (OPENAI_API_KEY, GEMINI_API_KEY ou GROQ_API_KEY).");
}

async function chamarOpenAI(instrucoes: string, pedido: string): Promise<string> {
  const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.65,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: instrucoes },
        { role: "user", content: pedido },
      ],
    }),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${resposta.status}: ${detalhe.slice(0, 200)}`);
  }

  const dados = (await resposta.json()) as { choices?: { message?: { content?: string } }[] };
  const conteudo = dados.choices?.[0]?.message?.content;
  if (!conteudo) throw new Error("OpenAI devolveu conteúdo vazio.");
  return conteudo;
}

async function chamarGemini(instrucoes: string, pedido: string): Promise<string> {
  const modelo = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const resposta = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: instrucoes }] },
      contents: [{ parts: [{ text: pedido }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.65,
      },
    }),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text().catch(() => "");
    throw new Error(`Gemini HTTP ${resposta.status}: ${detalhe.slice(0, 200)}`);
  }

  const dados = (await resposta.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const conteudo = dados.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!conteudo) throw new Error("Gemini devolveu conteúdo vazio.");
  return conteudo;
}

async function chamarGroq(instrucoes: string, pedido: string): Promise<string> {
  const modelos = [
    process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    process.env.GROQ_MODEL_RESERVA ?? "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
  ];

  for (const modelo of modelos) {
    try {
      const resposta = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelo,
          temperature: 0.65,
          max_completion_tokens: TETO_RESPOSTA,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: instrucoes },
            { role: "user", content: pedido },
          ],
        }),
      });

      if (resposta.ok) {
        const dados = (await resposta.json()) as { choices?: { message?: { content?: string } }[] };
        const conteudo = dados.choices?.[0]?.message?.content;
        if (conteudo) return conteudo;
      } else {
        const detalhe = await resposta.text().catch(() => "");
        console.warn(`[groq] Modelo ${modelo} retornou HTTP ${resposta.status}: ${detalhe.slice(0, 100)}`);
      }
    } catch (e) {
      console.warn(`[groq] Erro ao chamar modelo ${modelo}:`, e);
    }
  }

  throw new Error("Todos os modelos Groq retornaram erro ou limite de cota.");
}

/** Chute suficiente para reservar espaço na janela. Português: ~3,3 caracteres por token. */
function estimarTokens(texto: string) {
  return Math.ceil(texto.length / 3.3);
}

/* ------------------------------------------------------------------
   Instruções
   ------------------------------------------------------------------ */

function sistema(comAvancada: boolean) {
  return `Você escreve relatórios do Desvenda AI: uma leitura de conversas de casal, feita para a pessoa que enviou o histórico.

COMO ESCREVER
- Português brasileiro, segunda pessoa ("você"), tom de amigo próximo que não julga.
- Frases curtas. Nada de jargão: não escreva "dados", "algoritmo", "IA", "análise de sentimento", "métricas", "padrão de comunicação assíncrona", "nível de engajamento".
- Nunca diga o que a outra pessoa sente ou pensa. Descreva o que ela FAZ na conversa.
- Toda afirmação forte precisa de apoio: um número dos que você recebeu, ou um trecho curto exato da conversa entre aspas (ex: "tudo bem por aí?", "deixa pra lá"). Sem apoio, não afirme.
- Sempre que identificar um padrão ou atrito, cite a frase exata que a pessoa disse entre aspas ("..."). Isso dá prova concreta à leitura.
- Não invente números. Use só os que estão em NÚMEROS MEDIDOS. Se algo não foi medido, fale em termos qualitativos.
- Número entra no meio da frase, para sustentar uma observação. Nunca abra uma seção com número, e nunca liste as contagens das duas pessoas lado a lado como boletim.
  Os dois exemplos abaixo usam X, Y e NOME no lugar dos valores. Eles mostram a FORMA da frase — nunca reaproveite o conteúdo deles.
  Ruim: "NOME iniciou a conversa em X dias, enquanto NOME2 o fez em Y dias. Isso mostra que NOME é mais proativa."
  Bom: "Quem abre a conversa quase sempre é você: em X dos Y dias, a primeira mensagem foi sua. Não é falta de vontade do outro lado — é que esse papel ficou só com você."
- Só existe o que está na conversa ou nos números. Não sugira nem cite nada que não apareceu ali (academia, terapia, yoga, viagem que ninguém mencionou).
- Não presuma o gênero de quem enviou a conversa. Nada de "cansado" ou "cansada" dirigido a ela: escreva "você está cansando disso", "o que pesa em você". Vale para todo adjetivo.
- Nunca aconselhe terminar ou continuar o relacionamento. Nunca diagnostique ("narcisista", "relação abusiva", "depressão").
- Use os nomes reais que aparecem na conversa.
- Nada de emoji no relatório.

COMO USAR O CONTEXTO FORNECIDO PELO USUÁRIO
- O usuário respondeu a um questionário antes de enviar a conversa indicando sua percepção (relação, tempo de envolvimento, o que sente atualmente e o que quer descobrir).
- Use essas respostas como CONTEXTO para orientar o foco da análise e entender a perspectiva de quem está lendo.
- ATENÇÃO CRÍTICA: As respostas do usuário NUNCA devem determinar a conclusão do relatório antecipadamente.
- Se o usuário disse que sente que a pessoa está distante ou desconfia de algo, investigue se existem padrões na conversa que sustentem ou contradigam essa percepção.
- NUNCA assuma a suspeita ou percepção como fato consumado e NUNCA procure evidências forçadas para confirmar a hipótese.
- Compare objetivamente a percepção relatada pelo usuário com o histórico real da conversa e os números medidos.

O QUE FAZ ESTE RELATÓRIO VALER ALGUMA COISA
Quem está lendo já sabe que gosta da outra pessoa. Ela não pagou para ouvir que se amam — pagou para ver o que não conseguiu enxergar sozinha, porque estava dentro.
O valor está no mecanismo: não "vocês brigaram", mas "quando ela fica incomodada, ela para de responder e espera você perguntar".
Se todas as seis seções forem confortáveis de ler, você falhou.
O contrário também é falha: não invente crise. Se a relação está bem, diga que está bem — mas mostre COMO ela funciona, não que é bonita.
Elogio não é leitura. No relatório inteiro, no máximo uma seção pode ser positiva.

PONTUAÇÃO
Nunca use travessão (—) nem meia-risca (–) no texto do relatório. Onde a frase pediria um,
escreva duas frases com ponto, ou use vírgula, dois-pontos ou parênteses. Hífen comum (-) só
em palavra composta e intervalo.

TÍTULOS
Escreva em caixa baixa, como frase: "O tom mudou em março", não "O Tom Mudou em Março".
O título é uma observação sobre esta conversa, não uma categoria de manual.
Assim, sim: "Quem começa as conversas", "O tom mudou em março", "Assuntos que ninguém termina", "Você cancela, ela remarca", "Ela cala antes de reclamar".
Assim, não, nunca: "Comunicação", "Comunicação aberta", "Afeto e riso", "Demonstrações de carinho", "Tensão no ar", "Tensão e desculpas", "Planos e encontros", "Rotina e cansaço", "Pontos de atenção", "Momentos de conexão".

O QUE ENTREGAR
O array "sections" tem exatamente 6 objetos, nesta ordem e com estes trabalhos. Não troque um pelo outro, não repita o assunto de um no outro:

1. RITMO — quem sustenta a conversa. Quem abre, quem responde rápido, quem espera.
2. MUDANÇA — o que é diferente hoje do que era no começo. Use "porMes" e as datas. Se nada mudou de verdade, diga isso com todas as letras em vez de forçar.
3. UM ATRITO CONCRETO — pegue o desentendimento mais claro da conversa. Conte o que aconteceu, o que cada um fez, e como terminou. Cite a data.
4. O MECANISMO — o que cada um faz quando alguma coisa incomoda. Quem fala na hora, quem emudece, quem desconversa, quem pede desculpa primeiro, quem cede. Este é o achado mais valioso do relatório: é o padrão que se repete e que ninguém percebe de dentro.
5. UM HÁBITO QUE PASSA BATIDO — algo que aparece várias vezes e que a pessoa provavelmente nunca notou. Um assunto que sempre morre, um horário, uma desculpa que se repete, um tema que só um dos dois traz.
6. O QUE JÁ FUNCIONA — a única seção positiva. Mostre o mecanismo que dá certo, não um elogio genérico.

Cada seção tem 2 a 4 frases e precisa de âncora: uma data, um número dos NÚMEROS MEDIDOS, ou um trecho curto entre aspas tirado da conversa. Seção sem âncora é opinião, e opinião não vale nada aqui — reescreva antes de responder.

"patternCount" é 6.

Depois, exatamente 3 ações. Cada ação precisa citar algo específico DESTA conversa: um nome que aparece nela, um assunto que ela levantou, um horário ou mês que os números mostraram. Se a ação serviria para qualquer casal do mundo, ela está errada — reescreva.

Proibido, em qualquer variação: "quebrar a rotina", "compartilhar sentimentos", "compartilhe seus sentimentos", "reconectar-se", "comunicar-se melhor", "comunicação aberta e honesta", "ter uma conversa honesta", "dedicar tempo de qualidade", "reacender a chama", "planejar atividades juntos", "encontro especial", "encontro surpresa", "jantar romântico", "fim de semana fora", "fazer perguntas mais profundas", "ser mais atento". Antes de responder, releia suas 3 ações e troque qualquer uma que caia nessa lista.

Uma boa ação nasce de uma das seis seções, principalmente da 4 ou da 5 — é o passo pequeno que quebra o mecanismo que você acabou de mostrar. Não é um presente, não é um programa romântico, não é uma resolução vaga.

A forma de uma boa ação é: [gesto pequeno e concreto] + [quando ou onde] + [o que na conversa justifica isso]. Monte a sua com o material desta conversa. Nunca copie um exemplo pronto: qualquer exemplo que você tenha visto descreve outro casal, e repetir os detalhes dele seria inventar fato sobre este.

FORMATO
Responda SÓ com JSON válido, nesta forma:
{
  "headline": "uma frase que resume a relação, direta e sem crueldade",
  "summary": "2 ou 3 frases de abertura",
  "patternCount": número de padrões encontrados,
  "sections": [
    { "title": "título curto", "body": "texto da seção", "icon": "conversa" }
  ],
  "acoes": [
    { "titulo": "ação curta", "texto": "como fazer, em 1 ou 2 frases" }
  ]${
    comAvancada
      ? `,
  "advanced": {
    "title": "Análise avançada de traição",
    "level": "baixo" | "medio" | "alto",
    "body": "3 a 5 frases"
  }`
      : ""
  }
}

"icon" é um destes: conversa, coracao, lupa, celular, presente, foguete, escudo, alerta.
${
  comAvancada
    ? `
SOBRE A SEÇÃO AVANÇADA
A pessoa pagou para saber se há sinais de envolvimento com outra pessoa. Trate isso com seriedade e com freio.
- "baixo": nada no texto sustenta essa suspeita. É a resposta mais comum e você deve dá-la sem hesitar quando for o caso.
- "medio": há mudanças de padrão que merecem uma conversa, mas têm outras explicações possíveis. Cite as duas leituras.
- "alto": vários sinais independentes apontam na mesma direção. Mesmo assim, escreva que isso não é prova de nada.
Nunca acuse ninguém. Diga o que mudou, quando mudou, e o que isso pode ou não significar.
Escreva sobre ESTA conversa. Não escreva sobre o método, não diga que "a análise não é infalível" nem que "conversas não detectam traição" — isso é falar do produto, e a pessoa pagou para ouvir sobre a relação dela.`
    : ""
}`;
}

function usuario(
  numeros: ReturnType<typeof medir>,
  amostra: string,
  ctx: Contexto,
) {
  const contexto = ctx.respostas.length
    ? ctx.respostas.map((r) => `- ${r.pergunta} ${r.resposta}`).join("\n")
    : "- Não respondeu.";

  const outros = numeros.autores.map((a) => a.autor).filter((n) => n !== ctx.remetente);

  const quemEQuem = ctx.remetente
    ? `QUEM É QUEM
"${ctx.remetente}" é quem enviou a conversa e está lendo este relatório. Escreva "você" apenas para essa pessoa e NUNCA use o nome dela no texto.${
        outros.length ? ` Do outro lado está ${outros.join(" e ")} — chame pelo nome.` : ""
      }
Confira isso em cada frase: trocar os dois é o pior erro possível aqui.

`
    : "";

  const curta =
    numeros.total < CONVERSA_CURTA
      ? `AVISO: esta conversa é curta (${numeros.total} mensagens). Diga isso no summary, com naturalidade, e não force conclusões grandes. Prefira observações modestas e honestas a padrões inventados para preencher espaço.

`
      : "";

  return `${quemEQuem}${curta}O QUE A PESSOA CONTOU ANTES DE ENVIAR
${contexto}

Comece a leitura pelo que ela disse que mais pesa.

NÚMEROS MEDIDOS (contados no arquivo, pode confiar)
${JSON.stringify(numeros)}

Como ler estes números:
- "iniciativas.porAutor": quantos dias cada pessoa mandou a primeira mensagem.
- "tempoResposta": mediana em minutos até responder, e quantas vezes passou de 4 horas.
- "porMes": volume, marcas de afeto e de riso mês a mês. É aqui que mudanças de tom aparecem.
- "porHora" e "horasDeTensao": 24 posições, da meia-noite às 23h.
- "silencios": os maiores intervalos sem mensagem, e quem voltou a falar primeiro.
- "afeto", "riso", "desculpas", "tensao", "perguntas": contagem de mensagens de cada pessoa com essas marcas.

AMOSTRA DA CONVERSA
O começo, uma varredura pelo meio e o trecho mais recente.

${amostra}

Agora escreva o relatório em JSON.`;
}
