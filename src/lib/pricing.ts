/**
 * Preços em centavos. Ajuste pelas variáveis de ambiente sem tocar no código.
 * Os valores são públicos de propósito: a UI precisa deles antes do checkout.
 */
export const BASE_CENTS = toCents(process.env.NEXT_PUBLIC_PRECO_BASE, 1990);
export const UPSELL_CENTS = toCents(process.env.NEXT_PUBLIC_PRECO_AVANCADA, 990);

export function totalCents(withAdvanced: boolean) {
  return BASE_CENTS + (withAdvanced ? UPSELL_CENTS : 0);
}

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
