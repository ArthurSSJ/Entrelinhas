import type { ClienteDados } from "./cliente";
import { apenasDigitos, telefoneParaE164 } from "./cliente";

/**
 * Cliente da API da Cakto (pagamentos), separado do link de checkout deles.
 *
 * https://docs.cakto.com.br/api-reference/payments/create-pix
 *
 * Exige uma API key própria (Integrações > Cakto API, escopo "payments"),
 * diferente do link de checkout que já existia. Sem CAKTO_CLIENT_ID e
 * CAKTO_CLIENT_SECRET configurados, `pixNativoConfigurado()` volta falso e o
 * resto do arquivo de pagamentos cai para o link de checkout ou o PIX
 * estático, como já fazia.
 */

const TOKEN_URL = "https://api.cakto.com.br/public_api/token/";
const PAYMENTS_URL = "https://api.cakto.com.br/public_api/payments/";

export function pixNativoConfigurado() {
  return Boolean(
    process.env.CAKTO_CLIENT_ID && process.env.CAKTO_CLIENT_SECRET && ofertaParaUnlock("rel"),
  );
}

/** Qual oferta cobrar na Cakto, por tipo de desbloqueio. */
export function ofertaParaUnlock(unlock: "rel" | "av" | "rel_av") {
  if (unlock === "av") {
    return process.env.CAKTO_OFFER_ID_SO_AVANCADA || process.env.CAKTO_OFFER_ID;
  }
  if (unlock === "rel_av") {
    return process.env.CAKTO_OFFER_ID_AVANCADA || process.env.CAKTO_OFFER_ID;
  }
  return process.env.CAKTO_OFFER_ID;
}

/**
 * Token de acesso, em cache em memória até perto de expirar.
 *
 * Sobrevive entre chamadas dentro da mesma instância de servidor — não é
 * persistido, então uma instância nova pede um token novo. A API não tem
 * endpoint de refresh: quando expira, é só pedir outro.
 */
let tokenCache: { valor: string; expiraEm: number } | null = null;

async function obterToken(): Promise<string> {
  if (tokenCache && tokenCache.expiraEm > Date.now()) return tokenCache.valor;

  const clientId = process.env.CAKTO_CLIENT_ID;
  const clientSecret = process.env.CAKTO_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("CAKTO_CLIENT_ID/CAKTO_CLIENT_SECRET não configurados.");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret }),
  });

  if (!res.ok) {
    const detalhe = await res.text().catch(() => "");
    throw new Error(`Cakto (token) respondeu ${res.status}: ${detalhe.slice(0, 300)}`);
  }

  const dados = (await res.json()) as { access_token: string; expires_in: number };

  // Renova 60s antes do prazo real, para nunca usar um token na borda da expiração.
  tokenCache = {
    valor: dados.access_token,
    expiraEm: Date.now() + Math.max(0, dados.expires_in - 60) * 1000,
  };
  return tokenCache.valor;
}

export type PixCakto = {
  id: string;
  status: string;
  brCode: string;
  qrImage: string;
  expiresAt: number;
};

/**
 * Cria uma cobrança PIX de verdade na Cakto e devolve o QR pronto para
 * mostrar. `referencia` viaja em `metadata.utm_content`: é o mesmo campo que
 * o link de checkout já usa, e o webhook em /api/checkout/webhook já sabe
 * ler dali.
 */
export async function criarPixCakto(params: {
  unlock: "rel" | "av" | "rel_av";
  amountCents: number;
  referencia: string;
  cliente: ClienteDados;
  idempotencyKey: string;
}): Promise<PixCakto> {
  const offerId = ofertaParaUnlock(params.unlock);
  if (!offerId) throw new Error(`Nenhuma oferta da Cakto configurada para "${params.unlock}".`);

  const token = await obterToken();

  const res = await fetch(PAYMENTS_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "x-idempotency-key": params.idempotencyKey,
    },
    // A documentação geral da Cakto lista "antifraudProfilingAttemptReference"
    // como obrigatório, mas esta conta usa o "contrato público" da API, que
    // recusa esse campo (testado: 400 "Campo não suportado pelo contrato
    // público"). Por isso ele não entra aqui — se a conta um dia mudar de
    // contrato e passar a exigi-lo, é só voltar a incluir.
    body: JSON.stringify({
      paymentMethod: "pix",
      customer: {
        name: params.cliente.nome.trim(),
        email: params.cliente.email.trim(),
        phone: telefoneParaE164(params.cliente.telefone),
        fingerprint: params.idempotencyKey,
        docType: "cpf",
        docNumber: apenasDigitos(params.cliente.cpf),
      },
      items: [{ offerId, quantity: 1, offerType: "main" }],
      pixExpiresIn: 1800,
      metadata: { utm_content: params.referencia },
    }),
  });

  if (!res.ok) {
    const detalhe = await res.text().catch(() => "");
    throw new Error(`Cakto (pix) respondeu ${res.status}: ${detalhe.slice(0, 400)}`);
  }

  const dados = (await res.json()) as {
    id: string;
    status: string;
    pix: { qrCode: string; qrCodeBase64: string; expiresAt: string };
  };

  return {
    id: dados.id,
    status: dados.status,
    brCode: dados.pix.qrCode,
    qrImage: dados.pix.qrCodeBase64,
    expiresAt: new Date(dados.pix.expiresAt).getTime(),
  };
}
