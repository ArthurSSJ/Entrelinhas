/**
 * Leitura do arquivo exportado do WhatsApp.
 *
 * A conversa vira duas coisas antes de chegar na IA:
 *
 *  1. **Números medidos aqui**, não estimados por modelo nenhum. Quem começa as
 *     conversas, tempo de resposta, volume por mês, hora do dia, silêncios.
 *     Contagem é trabalho de código — modelo de linguagem erra ao contar e
 *     acerta ao interpretar.
 *  2. **Uma amostra do texto**, para a leitura ter tom e exemplos reais.
 *
 * Assim uma conversa de três anos cabe no pedido sem virar um custo absurdo, e
 * as afirmações do relatório se apoiam em algo verificável.
 */

export type Mensagem = {
  data: Date;
  autor: string;
  texto: string;
  midia: boolean;
};

/* ------------------------------------------------------------------
   1. Parsing
   ------------------------------------------------------------------ */

// iOS: [12/03/2025, 21:47:12] Ana: mensagem
const IOS = /^\[(\d{1,2})\/(\d{1,2})\/(\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*\]\s*([^:]{1,80}):\s*([\s\S]*)$/;
// Android: 12/03/2025 21:47 - Ana: mensagem
const ANDROID = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*-\s*([^:]{1,80}):\s*([\s\S]*)$/;

const MARCAS_MIDIA =
  /(mídia oculta|midia oculta|arquivo de mídia oculto|imagem ocultada|áudio ocultado|audio ocultado|vídeo omitido|video omitido|figurinha omitida|sticker omitted|image omitted|audio omitted|video omitted|gif omitido|documento omitido)/i;

const RUIDO =
  /(as mensagens e as ligações são criptografadas|esta mensagem foi apagada|você apagou esta mensagem|mensagem apagada|criou o grupo|adicionou você|mudou o assunto|entrou usando o link|saiu do grupo|alterou o número de telefone|missed voice call|chamada de voz perdida|chamada de vídeo perdida)/i;

export function parseConversa(bruto: string): Mensagem[] {
  // Exportações do iPhone vêm salpicadas de marcas de direção invisíveis.
  const linhas = bruto.replace(/‎|‏|‪|‬/g, "").split(/\r?\n/);

  const mensagens: Mensagem[] = [];

  for (const linha of linhas) {
    const achado = IOS.exec(linha) ?? ANDROID.exec(linha);

    if (!achado) {
      // Continuação de uma mensagem de várias linhas.
      const ultima = mensagens[mensagens.length - 1];
      if (ultima && linha.trim()) ultima.texto += `\n${linha.trim()}`;
      continue;
    }

    const [, d, m, a, h, min, seg, autor, texto] = achado;
    if (RUIDO.test(texto)) continue;

    const ano = a.length === 2 ? 2000 + Number(a) : Number(a);
    const data = new Date(ano, Number(m) - 1, Number(d), Number(h), Number(min), Number(seg ?? 0));
    if (Number.isNaN(data.getTime())) continue;

    mensagens.push({
      data,
      autor: autor.trim(),
      texto: texto.trim(),
      midia: MARCAS_MIDIA.test(texto),
    });
  }

  return mensagens;
}

/* ------------------------------------------------------------------
   1b. Quem é quem
   ------------------------------------------------------------------ */

/**
 * O WhatsApp escreve textos diferentes para o mesmo evento dependendo de quem
 * está lendo. "Você apagou esta mensagem" só aparece nas suas próprias
 * mensagens — então o autor dessa linha é quem exportou a conversa.
 *
 * Nem toda conversa tem uma dessas, por isso o resultado é um palpite para
 * deixar pré-marcado, nunca para decidir sozinho.
 */
const MARCA_DE_QUEM_EXPORTOU =
  /(você apagou esta mensagem|voce apagou esta mensagem|you deleted this message|você bloqueou|você desbloqueou|você removeu)/i;

export type Participantes = {
  /** Nomes que aparecem na conversa, do que mais fala para o que menos fala. */
  autores: string[];
  /** Quem provavelmente exportou o arquivo, quando dá para saber. */
  provavel: string | null;
};

export function detectarParticipantes(bruto: string): Participantes {
  const linhas = bruto.replace(/‎|‏|‪|‬/g, "").split(/\r?\n/);

  const contagem = new Map<string, number>();
  let provavel: string | null = null;

  for (const linha of linhas) {
    const achado = IOS.exec(linha) ?? ANDROID.exec(linha);
    if (!achado) continue;

    const autor = achado[7].trim();
    const texto = achado[8];

    contagem.set(autor, (contagem.get(autor) ?? 0) + 1);
    if (!provavel && MARCA_DE_QUEM_EXPORTOU.test(texto)) provavel = autor;
  }

  const autores = [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([nome]) => nome)
    // Nomes que aparecem uma vez ou outra costumam ser ruído de parsing.
    .filter((nome, _, todos) => todos.length <= 2 || (contagem.get(nome) ?? 0) > 2);

  return { autores, provavel };
}

/* ------------------------------------------------------------------
   2. Números
   ------------------------------------------------------------------ */

export type Estatisticas = ReturnType<typeof medir>;

const AFETO =
  /(amor|amo você|te amo|amo vc|saudade|carinho|meu bem|minha vida|lindo|linda|beijo|bjo|❤|🥰|😍|😘|💕|💗)/i;
const RISO = /(kkk|hahah|rsrs|😂|🤣|kkkk)/i;
const DESCULPA = /(desculpa|desculpe|foi mal|me perdoa|perdão|perdao|mal aí)/i;
const TENSAO =
  /(cansad|chatead|magoad|irritad|deixa pra lá|tanto faz|foda-se|não quero falar|nao quero falar|sempre a mesma coisa|de novo isso)/i;

export function medir(mensagens: Mensagem[]) {
  const autores = [...new Set(mensagens.map((m) => m.autor))];
  const validas = mensagens.filter((m) => !m.midia);

  const porAutor = autores.map((autor) => {
    const minhas = mensagens.filter((m) => m.autor === autor);
    const texto = minhas.filter((m) => !m.midia);
    const palavras = texto.reduce((soma, m) => soma + m.texto.split(/\s+/).length, 0);

    return {
      autor,
      mensagens: minhas.length,
      midias: minhas.filter((m) => m.midia).length,
      palavrasPorMensagem: texto.length ? +(palavras / texto.length).toFixed(1) : 0,
      afeto: texto.filter((m) => AFETO.test(m.texto)).length,
      riso: texto.filter((m) => RISO.test(m.texto)).length,
      desculpas: texto.filter((m) => DESCULPA.test(m.texto)).length,
      tensao: texto.filter((m) => TENSAO.test(m.texto)).length,
      perguntas: texto.filter((m) => m.texto.includes("?")).length,
    };
  });

  return {
    periodo: {
      de: iso(mensagens[0]?.data),
      ate: iso(mensagens[mensagens.length - 1]?.data),
      dias: diasEntre(mensagens[0]?.data, mensagens[mensagens.length - 1]?.data),
    },
    total: mensagens.length,
    totalTexto: validas.length,
    autores: porAutor,
    iniciativas: contarIniciativas(mensagens),
    tempoResposta: medirRespostas(mensagens),
    porMes: agruparPorMes(mensagens, autores),
    porHora: contarHoras(mensagens),
    silencios: maioresSilencios(mensagens),
    horasDeTensao: horasDeTensao(mensagens),
  };
}

/** Quem manda a primeira mensagem de cada dia. */
function contarIniciativas(mensagens: Mensagem[]) {
  const porDia = new Map<string, string>();
  for (const m of mensagens) {
    const dia = iso(m.data)!.slice(0, 10);
    if (!porDia.has(dia)) porDia.set(dia, m.autor);
  }

  const contagem: Record<string, number> = {};
  for (const autor of porDia.values()) contagem[autor] = (contagem[autor] ?? 0) + 1;

  return { diasComConversa: porDia.size, porAutor: contagem };
}

/** Mediana do tempo até a outra pessoa responder. Ignora esperas de mais de um dia. */
function medirRespostas(mensagens: Mensagem[]) {
  const esperas: Record<string, number[]> = {};

  for (let i = 1; i < mensagens.length; i++) {
    const anterior = mensagens[i - 1];
    const atual = mensagens[i];
    if (anterior.autor === atual.autor) continue;

    const minutos = (atual.data.getTime() - anterior.data.getTime()) / 60000;
    if (minutos < 0 || minutos > 60 * 24) continue;

    (esperas[atual.autor] ??= []).push(minutos);
  }

  return Object.fromEntries(
    Object.entries(esperas).map(([autor, lista]) => [
      autor,
      {
        respostas: lista.length,
        medianaMinutos: Math.round(mediana(lista)),
        acimaDe4h: lista.filter((v) => v > 240).length,
      },
    ]),
  );
}

/** Volume e afeto mês a mês — é onde mudanças de tom aparecem. */
function agruparPorMes(mensagens: Mensagem[], autores: string[]) {
  const meses = new Map<string, { total: number; afeto: number; riso: number; porAutor: Record<string, number> }>();

  for (const m of mensagens) {
    const chave = iso(m.data)!.slice(0, 7);
    const mes = meses.get(chave) ?? {
      total: 0,
      afeto: 0,
      riso: 0,
      porAutor: Object.fromEntries(autores.map((a) => [a, 0])),
    };

    mes.total++;
    mes.porAutor[m.autor] = (mes.porAutor[m.autor] ?? 0) + 1;
    if (!m.midia && AFETO.test(m.texto)) mes.afeto++;
    if (!m.midia && RISO.test(m.texto)) mes.riso++;

    meses.set(chave, mes);
  }

  return [...meses.entries()].map(([mes, dados]) => ({ mes, ...dados }));
}

function contarHoras(mensagens: Mensagem[]) {
  const horas = new Array(24).fill(0) as number[];
  for (const m of mensagens) horas[m.data.getHours()]++;
  return horas;
}

/** Em que horário aparecem as mensagens de atrito. */
function horasDeTensao(mensagens: Mensagem[]) {
  const horas = new Array(24).fill(0) as number[];
  for (const m of mensagens) {
    if (!m.midia && TENSAO.test(m.texto)) horas[m.data.getHours()]++;
  }
  return horas;
}

function maioresSilencios(mensagens: Mensagem[]) {
  const vaos: { de: string; ate: string; horas: number; quemVoltou: string }[] = [];

  for (let i = 1; i < mensagens.length; i++) {
    const horas = (mensagens[i].data.getTime() - mensagens[i - 1].data.getTime()) / 3600000;
    if (horas < 24) continue;
    vaos.push({
      de: iso(mensagens[i - 1].data)!,
      ate: iso(mensagens[i].data)!,
      horas: Math.round(horas),
      quemVoltou: mensagens[i].autor,
    });
  }

  return vaos.sort((a, b) => b.horas - a.horas).slice(0, 5);
}

/* ------------------------------------------------------------------
   3. Amostra de texto
   ------------------------------------------------------------------ */

/**
 * Teto do recorte, em caracteres. Dimensionado para caber na camada gratuita
 * da Groq (12 mil tokens por minuto, contando a resposta).
 */
const LIMITE_CARACTERES = 14_000;

/**
 * Recorte da conversa para a IA ler: o começo (como era), uma varredura
 * espaçada pelo meio (como mudou) e o fim (como está agora).
 *
 * A ordem de corte importa. O orçamento é gasto primeiro nas mensagens
 * recentes, depois no começo, e só o que sobrar vai para o meio — cortar por
 * ordem cronológica jogaria fora justamente o trecho mais recente, que é o que
 * a pessoa quer entender.
 */
export function amostrar(mensagens: Mensagem[], limite = LIMITE_CARACTERES): string {
  const texto = mensagens.filter((m) => !m.midia && m.texto.length > 1);
  if (texto.length === 0) return "";

  const linha = (m: Mensagem) => `[${iso(m.data)}] ${m.autor}: ${m.texto.replace(/\s+/g, " ")}\n`;

  const escolhidas = new Set<Mensagem>();
  let orcamento = limite;

  const tentar = (lista: Mensagem[]) => {
    for (const m of lista) {
      if (escolhidas.has(m)) continue;
      const custo = linha(m).length;
      if (custo > orcamento) continue;
      escolhidas.add(m);
      orcamento -= custo;
    }
  };

  // 1. o agora, do mais recente para trás
  tentar([...texto.slice(-90)].reverse());
  // 2. como começou
  tentar(texto.slice(0, 25));
  // 3. o meio, espaçado
  const meio = texto.slice(25, -90);
  const passo = Math.max(1, Math.ceil(meio.length / 120));
  tentar(meio.filter((_, i) => i % passo === 0));

  // Devolve na ordem em que a conversa aconteceu.
  return texto
    .filter((m) => escolhidas.has(m))
    .map(linha)
    .join("");
}

/* ------------------------------------------------------------------
   utilitários
   ------------------------------------------------------------------ */

function iso(data: Date | undefined) {
  if (!data) return null;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${data.getFullYear()}-${p(data.getMonth() + 1)}-${p(data.getDate())} ${p(data.getHours())}:${p(data.getMinutes())}`;
}

function diasEntre(a: Date | undefined, b: Date | undefined) {
  if (!a || !b) return 0;
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000));
}

function mediana(lista: number[]) {
  if (lista.length === 0) return 0;
  const ordenada = [...lista].sort((x, y) => x - y);
  const meio = Math.floor(ordenada.length / 2);
  return ordenada.length % 2 ? ordenada[meio] : (ordenada[meio - 1] + ordenada[meio]) / 2;
}
