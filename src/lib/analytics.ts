"use client";

/**
 * Eventos do funil.
 *
 * O plano de implementação dava esta camada como pronta, mas ela não existia:
 * não havia gtag, dataLayer, pixel nem qualquer chamada de tracking no
 * projeto. Ela nasce aqui, deliberadamente pequena.
 *
 * O que ela faz é padronizar OS NOMES e o momento do disparo. Para onde os
 * eventos vão é decisão de quem instalar a ferramenta: se existir um
 * `dataLayer` (Google Tag Manager) ou um `gtag`, o evento é empurrado para
 * lá; se não existir nenhum dos dois, ele não vai a lugar nenhum e o site
 * segue funcionando. Nada de script de terceiro entra no bundle por causa
 * deste arquivo.
 *
 * Cada evento dispara no máximo uma vez por análise e por nome. O funil
 * inteiro é uma tela só que troca de etapa e faz polling a cada 2,5s: sem
 * essa trava, um `preview_viewed` viraria dezenas.
 */

export type EventoFunil =
  | "preview_viewed"
  | "checkout_viewed"
  | "checkout_started"
  | "order_bump_selected"
  | "order_bump_removed"
  | "purchase_completed"
  | "upsell_viewed"
  | "upsell_accepted"
  | "upsell_declined"
  | "downsell_viewed"
  | "downsell_accepted"
  | "downsell_declined"
  | "exit_intent_shown"
  | "exit_intent_converted";

type Dados = Record<string, string | number | boolean | undefined>;

type Janela = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const disparados = new Set<string>();

export function rastrear(evento: EventoFunil, dados: Dados = {}) {
  if (typeof window === "undefined") return;

  // A chave inclui a análise e o produto: duas análises na mesma aba contam
  // separado, e uma compra do relatório não engole a compra da avançada.
  const chave = `${evento}:${dados.analise ?? "-"}:${dados.produto ?? "-"}`;
  if (disparados.has(chave)) return;
  disparados.add(chave);

  const carga = { event: evento, ...dados };
  const janela = window as Janela;

  if (Array.isArray(janela.dataLayer)) {
    janela.dataLayer.push(carga);
  } else if (typeof janela.gtag === "function") {
    janela.gtag("event", evento, dados);
  } else if (process.env.NODE_ENV !== "production") {
    // Em desenvolvimento, o console é a ferramenta: dá para conferir que o
    // evento certo saiu na hora certa sem instalar nada.
    console.debug("[funil]", evento, dados);
  }
}
