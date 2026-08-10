/**
 * Preços em centavos. Ajuste pelas variáveis de ambiente sem tocar no código.
 * Os valores são públicos de propósito: a UI precisa deles antes do checkout.
 *
 * Quem decide quanto cobrar é sempre o servidor. Estes valores existem no
 * cliente só para escrever a tela; a cobrança é montada em /api/checkout a
 * partir das mesmas constantes, sem aceitar preço vindo do navegador.
 */
export const BASE_CENTS = toCents(process.env.NEXT_PUBLIC_PRECO_BASE, 1990);
export const UPSELL_CENTS = toCents(process.env.NEXT_PUBLIC_PRECO_AVANCADA, 990);

/** Preço da avançada no downsell, oferecido uma única vez a quem recusou. */
export const DOWNSELL_CENTS = toCents(process.env.NEXT_PUBLIC_PRECO_DOWNSELL, 490);

/**
 * Pacote da oferta de recuperação: relatório + avançada pelo preço do
 * relatório sozinho. É uma variante de teste, ligada por
 * NEXT_PUBLIC_OFERTA_RECUPERACAO — desligada, o popup de saída mostra o
 * preço normal, sem promoção nenhuma.
 */
export const PACOTE_CENTS = toCents(process.env.NEXT_PUBLIC_PRECO_PACOTE, 1990);

export const OFERTA_RECUPERACAO_ATIVA =
  process.env.NEXT_PUBLIC_OFERTA_RECUPERACAO === "true";

/** 1990 -> "R$ 19,90" */
export function brl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function toCents(raw: string | undefined, fallback: number) {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback;
}
