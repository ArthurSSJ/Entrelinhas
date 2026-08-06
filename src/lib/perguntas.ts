import type { IconName } from "@/components/Icon3D";

/**
 * As perguntas do começo do fluxo.
 *
 * Elas existem por dois motivos: a leitura sai melhor sabendo de quem se trata,
 * e responder quatro toques antes de enviar a conversa é mais fácil do que
 * encarar uma tela de upload de cara.
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
    id: "vinculo",
    titulo: "Quem é essa pessoa pra você?",
    opcoes: [
      { id: "namoro", texto: "Namoro", icon: "coracao" },
      { id: "casamento", texto: "Casamento ou moramos juntos", icon: "coracao" },
      { id: "conhecendo", texto: "Estamos nos conhecendo", icon: "conversa" },
      { id: "ex", texto: "É um ex", icon: "celular" },
    ],
  },
  {
    id: "tempo",
    titulo: "Há quanto tempo vocês conversam?",
    ajuda: "Separa o que mudou do que sempre foi assim.",
    opcoes: [
      { id: "curto", texto: "Menos de 3 meses" },
      { id: "medio", texto: "De 3 meses a 1 ano" },
      { id: "longo", texto: "De 1 a 3 anos" },
      { id: "muito", texto: "Mais de 3 anos" },
    ],
  },
  {
    id: "duvida",
    titulo: "O que você quer entender?",
    ajuda: "Escolha o que mais pesa. O relatório começa por aí.",
    opcoes: [
      { id: "interesse", texto: "Se ainda existe interesse do outro lado", icon: "coracao" },
      { id: "briga", texto: "Por que a gente briga sempre pelo mesmo motivo", icon: "conversa" },
      { id: "exagero", texto: "Se eu estou exagerando ou tenho razão", icon: "lupa" },
      {
        id: "terceiro",
        texto: "Se tem outra pessoa na história",
        icon: "alerta",
        sugereAvancada: true,
      },
    ],
  },
  {
    id: "sentimento",
    titulo: "Como você tem se sentido?",
    ajuda: "Não tem resposta certa. Isso muda o tom do que a gente escreve.",
    opcoes: [
      { id: "inseguranca", texto: "Insegurança" },
      { id: "cansaco", texto: "Cansaço" },
      { id: "confusao", texto: "Confusão" },
      { id: "curiosidade", texto: "Curiosidade, nada demais" },
    ],
  },
];

export type Respostas = Record<string, string>;

const CHAVE = "entrelinhas:respostas";

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

/** A pessoa disse que a dúvida é sobre outra pessoa? A avançada já vem marcada. */
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
