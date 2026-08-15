import crypto from "node:crypto";
import QRCode from "qrcode";
import { criarPixCakto, pixNativoConfigurado } from "./cakto";
import type { ClienteDados } from "./cliente";
import { registrarPagamentoCakto } from "./store";
import type { Charge, Unlock } from "./types";

/**
 * Camada de pagamento.
 *
 * Modos, na ordem em que são escolhidos:
 *
 *  1. CAKTO_CLIENT_ID/CAKTO_CLIENT_SECRET/CAKTO_OFERTA — PIX gerado direto pela
 *     API da Cakto, mostrado aqui mesmo (ver ./cakto.ts). Exige dados do
 *     cliente (nome, e-mail, telefone, CPF): a API da Cakto recusa sem isso.
 *  2. CAKTO_CHECKOUT_URL (e CAKTO_CHECKOUT_URL_AVANCADA, se houver um produto
 *     separado com o adicional) — redirect para o checkout hospedado da Cakto.
 *  3. PIX_CHAVE — monta um BR Code estático aqui mesmo, assinado com CRC16.
 *     Sem gateway nenhum: ninguém confirma o pagamento sozinho, é preciso
 *     conferir manualmente e liberar pelo atalho de demonstração.
 *  4. Nada definido — cobrança de demonstração, só para percorrer a interface.
 */

const EXPIRA_MS = 1000 * 60 * 30; // 30 minutos

/**
 * Monta a cobrança de um pedido.
 *
 * `unlock` diz o que este pagamento libera e viaja junto na referência, para
 * o postback saber o que abrir quando o dinheiro cair. O valor vem de quem
 * chama — sempre uma rota de servidor, sempre a partir das constantes de
 * preço, nunca de um número enviado pelo navegador.
 *
 * `cliente` só importa quando o PIX nativo da Cakto está configurado (ver
 * `pixNativoConfigurado`). Nos outros modos é ignorado.
 */
export async function createCharge(
  analysisId: string,
  amountCents: number,
  unlock: Unlock,
  cliente?: ClienteDados,
): Promise<Charge> {
  const expiresAt = Date.now() + EXPIRA_MS;
  const referencia = comUnlock(analysisId, unlock);

  if (pixNativoConfigurado()) {
    if (!cliente) throw new DadosClienteAusentesError();

    const pix = await criarPixCakto({
      unlock,
      amountCents,
      referencia,
      cliente,
      idempotencyKey: crypto.randomUUID(),
    });

    // O webhook só traz o `id` que a Cakto gerou agora — sem isto, ele não
    // teria como saber qual análise/unlock este pagamento libera.
    registrarPagamentoCakto(pix.id, referencia);

    return {
      kind: "pix",
      unlock,
      brCode: pix.brCode,
      qrImage: pix.qrImage,
      amountCents,
      expiresAt: pix.expiresAt || expiresAt,
    };
  }

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

  const brCode = buildStaticPix({
    // Reserva propositalmente inválida: sem PIX_CHAVE configurada o QR não pode
    // parecer cobrança de verdade. Só é alcançado quando nada mais está
    // configurado — o mesmo cenário em que `estado.demo` fica ligado e o
    // atalho "Simular pagamento aprovado" aparece do lado, deixando claro que
    // isto não é uma cobrança real.
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

/** Sinaliza para a rota que a tela precisa coletar os dados antes de tentar de novo. */
export class DadosClienteAusentesError extends Error {
  constructor() {
    super("Nome, e-mail, telefone e CPF são obrigatórios para gerar o PIX.");
    this.name = "DadosClienteAusentesError";
  }
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
