import type { IconName } from "@/components/Icon3D";
import { CHAVE_PREFIXO } from "./marca";

/**
 * As perguntas do começo do fluxo.
 *
 * Não são um cadastro: são uma avaliação rápida do relacionamento, no mesmo
 * tom de um teste que a pessoa faria sozinha à noite. A leitura sai melhor
 * sabendo o que ela já percebe, e o relatório final compara essa percepção
 * com o que o texto mostra — é esse contraste que vira o momento forte do
 * resultado.
 *
 * As respostas viajam junto com o arquivo para o N8n e ficam no sessionStorage
 * até o envio — nada é gravado no servidor.
 */

export type Opcao = {
  id: string;
  texto: string;
  icon?: IconName;
  /** Marca a análise avançada por padrão na tela de envio. */
  sugereAvancada?: boolean;
};

export type Pergunta = {
  id: string;
  titulo: string;
  ajuda?: string;
  opcoes: Opcao[];
};

export const PERGUNTAS: Pergunta[] = [
  {
    id: "relacao",
    titulo: "Como você descreveria sua relação hoje?",
    opcoes: [
      { id: "muito-boa", texto: "Muito boa" },
      { id: "boa-com-problemas", texto: "Boa, mas existem problemas" },
      { id: "complicada", texto: "Está complicada" },
      { id: "afastando", texto: "Estamos nos afastando" },
      { id: "nao-sei", texto: "Não sei mais o que pensar" },
    ],
  },
  {
    id: "esforco",
    titulo: "Você sente que o esforço entre vocês é equilibrado?",
    ajuda: "Não existe resposta perfeita aqui.",
    opcoes: [
      { id: "sim", texto: "Sim" },
      { id: "mais-ou-menos", texto: "Mais ou menos" },
      { id: "nao", texto: "Não" },
      { id: "nao-sei", texto: "Não sei" },
    ],
  },
  {
    id: "mudanca",
    titulo: "Você sente que alguma coisa mudou recentemente?",
    ajuda: "Vale até o que você não consegue explicar direito.",
    opcoes: [
      { id: "sim", texto: "Sim" },
      { id: "nao", texto: "Não" },
      { id: "talvez", texto: "Talvez" },
      { id: "nao-identifico", texto: "Não consigo identificar" },
    ],
  },
  {
    id: "incomodo",
    titulo: "O que mais incomoda você atualmente?",
    ajuda: "Escolha o que pesa mais hoje.",
    opcoes: [
      { id: "atencao", texto: "Falta de atenção", icon: "celular" },
      { id: "distanciamento", texto: "Distanciamento", icon: "conversa" },
      { id: "discussoes", texto: "Discussões", icon: "alerta" },
      { id: "carinho", texto: "Falta de carinho", icon: "coracao" },
      { id: "inseguranca", texto: "Insegurança" },
      { id: "confianca", texto: "Confiança", icon: "escudo", sugereAvancada: true },
      { id: "outro", texto: "Outro" },
    ],
  },
  {
    id: "descobrir",
    titulo: "O que você mais gostaria de descobrir?",
    ajuda: "É o que o relatório vai priorizar.",
    opcoes: [
      { id: "interesse", texto: "Se ainda existe interesse", icon: "coracao" },
      { id: "falhando", texto: "Onde nossa relação está falhando", icon: "lupa" },
      { id: "comunicacao", texto: "Como melhorar nossa comunicação", icon: "conversa" },
      { id: "mudou", texto: "O que mudou entre nós", icon: "brilho" },
      {
        id: "sinais",
        texto: "Se existem sinais que merecem atenção",
        icon: "alerta",
        sugereAvancada: true,
      },
    ],
  },
];

export type Respostas = Record<string, string>;

const CHAVE = `${CHAVE_PREFIXO}:respostas`;

export function lerRespostas(): Respostas {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(CHAVE) ?? "{}") as Respostas;
  } catch {
    return {};
  }
}

export function salvarRespostas(respostas: Respostas) {
  window.sessionStorage.setItem(CHAVE, JSON.stringify(respostas));
}

export function limparRespostas() {
  window.sessionStorage.removeItem(CHAVE);
}

/** A pessoa apontou desconfiança ou dúvida sobre outra pessoa? A avançada já vem marcada. */
export function sugereAvancada(respostas: Respostas) {
  return PERGUNTAS.some((p) =>
    p.opcoes.some((o) => o.sugereAvancada && respostas[p.id] === o.id),
  );
}

/** Texto curto das respostas, do jeito que vai para o N8n. */
export function resumirRespostas(respostas: Respostas) {
  return PERGUNTAS.filter((p) => respostas[p.id]).map((p) => ({
    pergunta: p.titulo,
    resposta: p.opcoes.find((o) => o.id === respostas[p.id])?.texto ?? "",
  }));
}
