import type { IconName } from "@/components/Icon3D";
import { CHAVE_PREFIXO } from "./marca";

/**
 * As perguntas do começo do fluxo.
 *
 * Avaliação rápida do relacionamento. As respostas viajam junto com o arquivo
 * para o N8n/Groq e são usadas como CONTEXTO para orientar o foco da análise.
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
    titulo: "Qual é a sua relação com essa pessoa hoje?",
    opcoes: [
      { id: "namorado", texto: "Namorado(a)" },
      { id: "ficante", texto: "Ficante" },
      { id: "amigo", texto: "Amigo(a)" },
      { id: "conhecendo", texto: "Pessoa que estou conhecendo" },
      { id: "ex", texto: "Ex" },
      { id: "casado", texto: "Marido / esposa" },
      { id: "outra", texto: "Outra" },
    ],
  },
  {
    id: "tempo",
    titulo: "Há quanto tempo vocês se conhecem ou estão envolvidos?",
    opcoes: [
      { id: "menos-3-meses", texto: "Menos de 3 meses" },
      { id: "3-a-6-meses", texto: "3 a 6 meses" },
      { id: "6-meses-a-1-ano", texto: "6 meses a 1 ano" },
      { id: "1-a-3-anos", texto: "1 a 3 anos" },
      { id: "mais-3-anos", texto: "Mais de 3 anos" },
      { id: "vai-e-volta", texto: "É uma relação que vai e volta" },
    ],
  },
  {
    id: "sentimento",
    titulo: "O que você sente na relação atualmente?",
    opcoes: [
      { id: "distante", texto: "Senti a pessoa mais distante" },
      { id: "desconfiar", texto: "Comecei a desconfiar de alguma coisa", sugereAvancada: true },
      { id: "brigando", texto: "Estamos brigando muito" },
      { id: "esforcando", texto: "Sinto que estou me esforçando mais" },
      { id: "especifico", texto: "Aconteceu alguma coisa específica" },
      { id: "entender", texto: "Só quero entender melhor a relação" },
    ],
  },
  {
    id: "descobrir",
    titulo: "O que você mais gostaria de descobrir?",
    opcoes: [
      { id: "interesse", texto: "Se ainda existe interesse entre nós" },
      { id: "mudou", texto: "O que mudou na nossa relação" },
      { id: "falhando", texto: "Onde nossa relação está falhando" },
      { id: "afastando", texto: "Se estamos nos afastando" },
      { id: "comunicacao", texto: "Como melhorar nossa comunicação" },
      { id: "sinais", texto: "Se existem sinais que merecem atenção", sugereAvancada: true },
      { id: "visao-geral", texto: "Quero uma visão geral de tudo" },
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

/** Texto curto das respostas, do jeito que vai para o N8n/Groq. */
export function resumirRespostas(respostas: Respostas) {
  return PERGUNTAS.filter((p) => respostas[p.id]).map((p) => ({
    pergunta: p.titulo,
    resposta: p.opcoes.find((o) => o.id === respostas[p.id])?.texto ?? "",
  }));
}
