import QRCode from "qrcode";
import type { Charge, Unlock } from "./types";

/**
 * Camada de pagamento.
 *
 * Caminho principal: checkout externo da Cakto. A pessoa sai do site, paga lá,
 * e a Cakto avisa o /api/checkout/webhook. O identificador da análise viaja
 * junto na URL para que o webhook saiba qual relatório liberar.
 *
 * Modos, na ordem em que são escolhidos:
 *
 *  1. CAKTO_CHECKOUT_URL (e CAKTO_CHECKOUT_URL_AVANCADA, se houver um produto
 *     separado com o adicional) — redirect para o checkout da Cakto.
 *  2. PIX_CHAVE — monta um BR Code estático aqui mesmo, assinado com CRC16.
 *     Alternativa para cobrar sem gateway nenhum.
 *  3. Nada definido — cobrança de demonstração, só para percorrer a interface.
 */

const EXPIRA_MS = 1000 * 60 * 30; // 30 minutos

/**
 * Monta a cobrança de um pedido.
 *
 * `unlock` diz o que este pagamento libera e viaja junto na referência, para
 * o postback saber o que abrir quando o dinheiro cair. O valor vem de quem
 * chama — sempre uma rota de servidor, sempre a partir das constantes de
 * preço, nunca de um número enviado pelo navegador.
 */
import { createCaktoPixCharge } from "./cakto";

export async function createCharge(
  analysisId: string,
  amountCents: number,
  unlock: Unlock,
): Promise<Charge> {
  const expiresAt = Date.now() + EXPIRA_MS;
  const referencia = comUnlock(analysisId, unlock);

  // 1. Se houver ID de oferta da Cakto configurado, gera Pix Transparente via API oficial da Cakto
  const offerId = escolherOfertaCakto(unlock);
  if (offerId && process.env.CAKTO_CLIENT_ID && process.env.CAKTO_CLIENT_SECRET) {
    try {
      const res = await createCaktoPixCharge({
        offerId,
        analysisId,
        referencia,
        amountCents,
      });

      if (res.pix?.qrCode) {
        return {
          kind: "pix",
          unlock,
          brCode: res.pix.qrCode,
          qrImage: res.pix.qrCodeBase64 || (await toQrImage(res.pix.qrCode)),
          amountCents,
          expiresAt: res.pix.expiresAt ? new Date(res.pix.expiresAt).getTime() : expiresAt,
        };
      }
    } catch (err) {
      console.error("[payments] Erro na API Cakto, caindo para fallback:", err);
    }
  }

  // 2. Se houver URL de Checkout redirecionável configurada
  const checkout = escolherCheckout(unlock);
  if (checkout) {
    return {
      kind: "redirect",
      unlock,
      provider: "cakto",
      url: withTracking(checkout, analysisId, referencia),
      amountCents,
      expiresAt,
    };
  }

  // 3. Fallback estático / demonstração
  const brCode = buildStaticPix({
    key: process.env.PIX_CHAVE ?? "demo@desvenda.ai",
    name: process.env.PIX_NOME ?? "DESVENDA AI",
    city: process.env.PIX_CIDADE ?? "SAO PAULO",
    amountCents,
    txid: toTxid(analysisId),
  });

  return {
    kind: "pix",
    unlock,
    brCode,
    qrImage: await toQrImage(brCode),
    amountCents,
    expiresAt,
  };
}

function escolherOfertaCakto(unlock: Unlock) {
  const base = process.env.CAKTO_OFFER_ID;
  if (unlock === "av") return process.env.CAKTO_OFFER_ID_SO_AVANCADA ?? base;
  if (unlock === "rel_av") return process.env.CAKTO_OFFER_ID_AVANCADA ?? base;
  return base;
}

/**
 * Produtos separados na Cakto, quando existirem. Cada link cobra um valor
 * diferente lá dentro, então o unlock escolhe qual abrir. Faltando um link
 * específico, cai no do relatório — que é o único obrigatório.
 */
function escolherCheckout(unlock: Unlock) {
  const base = process.env.CAKTO_CHECKOUT_URL;
  if (unlock === "av") return process.env.CAKTO_CHECKOUT_URL_SO_AVANCADA ?? base;
  if (unlock === "rel_av") return process.env.CAKTO_CHECKOUT_URL_AVANCADA ?? base;
  return base;
}

/** `<id>~<unlock>`. O separador não aparece em UUID, então volta inteiro. */
export function comUnlock(analysisId: string, unlock: Unlock) {
  return `${analysisId}~${unlock}`;
}

/**
 * Desfaz o `comUnlock`. Referência sem sufixo é de uma cobrança antiga, de
 * antes de existirem os adicionais: naquela época só havia o relatório.
 */
export function lerUnlock(referencia: string): { id: string; unlock: Unlock } {
  const [id, sufixo] = referencia.split("~");
  const unlock: Unlock = sufixo === "av" || sufixo === "rel_av" ? sufixo : "rel";
  return { id, unlock };
}

/**
 * Carimba a referência do pedido na URL do checkout.
 *
 * O mesmo valor vai em três parâmetros porque cada plataforma devolve um campo
 * diferente no webhook. Confirme qual deles a Cakto repassa na conta de vocês e
 * pode enxugar os outros dois — o webhook aqui aceita qualquer um.
 */
function withTracking(base: string, analysisId: string, referencia: string) {
  const url = new URL(base);
  url.searchParams.set("ref", referencia);
  url.searchParams.set("utm_content", referencia);
  url.searchParams.set("src", referencia);

  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    // Para onde a Cakto devolve a pessoa depois de pagar.
    url.searchParams.set("redirect_url", `${site}/relatorio/${analysisId}`);
  }

  return url.toString();
}

async function toQrImage(payload: string) {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 512,
    color: { dark: "#2D2A32", light: "#FFFFFF" },
  });
}

function toTxid(analysisId: string) {
  return analysisId.replace(/-/g, "").slice(0, 25).toUpperCase() || "***";
}

/* ------------------------------------------------------------------
   BR Code (EMV®) — montagem e assinatura
   ------------------------------------------------------------------ */

type PixInput = {
  key: string;
  name: string;
  city: string;
  amountCents: number;
  txid: string;
};

function buildStaticPix({ key, name, city, amountCents, txid }: PixInput) {
  const merchant = field("00", "br.gov.bcb.pix") + field("01", key);

  const payload =
    field("00", "01") +
    field("26", merchant) +
    field("52", "0000") +
    field("53", "986") +
    field("54", (amountCents / 100).toFixed(2)) +
    field("58", "BR") +
    field("59", sanitize(name, 25)) +
    field("60", sanitize(city, 15)) +
    field("62", field("05", txid));

  const semCrc = `${payload}6304`;
  return semCrc + crc16(semCrc);
}

/** Um campo EMV: identificador + tamanho em 2 dígitos + valor. */
function field(id: string, value: string) {
  return id + String(value.length).padStart(2, "0") + value;
}

/** O padrão só aceita ASCII em caixa alta, sem acento. */
function sanitize(value: string, max: number) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .trim()
    .slice(0, max);
}

/** CRC16/CCITT-FALSE, exigido pelo padrão do BR Code. */
function crc16(input: string) {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
