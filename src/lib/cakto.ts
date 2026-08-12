import { randomUUID } from "node:crypto";

/**
 * Cliente para a API pública da Cakto.
 * Documentação: https://docs.cakto.com.br/api-reference/payments/create-pix
 */

const BASE_URL = "https://api.cakto.com.br";

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
};

type CreatePixInput = {
  offerId: string;
  analysisId: string;
  referencia: string;
  amountCents: number;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    docNumber?: string;
  };
};

export type CaktoPixResponse = {
  id: string;
  refId: string;
  status: string;
  paymentMethod: string;
  amount: string;
  checkoutUrl: string;
  pix?: {
    qrCode: string;
    qrCodeBase64: string;
    expiresAt?: string;
  };
};

/** Cache em memória do token OAuth2 */
let tokenCache: { token: string; expiresAt: number } | null = null;

/**
 * Obtém ou renova o Token de Acesso OAuth2 da Cakto (POST /public_api/token/)
 */
export async function getCaktoAccessToken(): Promise<string> {
  const clientId = process.env.CAKTO_CLIENT_ID;
  const clientSecret = process.env.CAKTO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("CAKTO_CLIENT_ID ou CAKTO_CLIENT_SECRET não configurados no .env.local");
  }

  // Reaproveita token válido
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }

  const res = await fetch(`${BASE_URL}/public_api/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Falha na autenticação Cakto (${res.status}): ${errorText}`);
  }

  const data = (await res.json()) as TokenResponse;

  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };

  return tokenCache.token;
}

/**
 * Cria uma cobrança Pix dinâmica diretamente na API da Cakto (POST /public_api/payments/)
 */
export async function createCaktoPixCharge(input: CreatePixInput): Promise<CaktoPixResponse> {
  const token = await getCaktoAccessToken();
  const idempotencyKey = randomUUID();

  const payload = {
    paymentMethod: "pix",
    customer: {
      name: input.customer?.name || "Cliente Entrelinhas",
      email: input.customer?.email || "cliente@entrelinhas.app",
      phone: input.customer?.phone || "5511999999999",
      fingerprint: input.analysisId,
      docType: "cpf",
      docNumber: input.customer?.docNumber || "00000000000",
    },
    items: [
      {
        offerId: input.offerId,
        quantity: 1,
        offerType: "main",
      },
    ],
    pixExpiresIn: 3600,
    antifraudProfilingAttemptReference: randomUUID(),
    metadata: {
      ref: input.referencia,
      utm_content: input.referencia,
      src: input.referencia,
      analysisId: input.analysisId,
    },
  };

  const res = await fetch(`${BASE_URL}/public_api/payments/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    console.error("[cakto] Erro ao criar cobrança Pix:", res.status, errorText);
    throw new Error(`Cakto API erro ${res.status}: ${errorText}`);
  }

  return (await res.json()) as CaktoPixResponse;
}
