import { NextResponse } from "next/server";
import { aplicarUnlock, get } from "@/lib/store";
import { lerUnlock } from "@/lib/payments";

export const dynamic = "force-dynamic";

/**
 * Endpoint de Webhook do Checkout da Cakto.
 *
 * Estrutura enviada pela Cakto:
 * {
 *   "secret": "f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454",
 *   "event": "purchase_approved",
 *   "data": {
 *     "status": "paid",
 *     "utm_content": "<analysisId>~<unlock>",
 *     "sck": "<analysisId>~<unlock>",
 *     ...
 *   }
 * }
 */

const CAMPOS_ID = [
  "ref",
  "referencia",
  "reference",
  "utm_content",
  "src",
  "sck",
  "external_reference",
  "checkout_id",
  "custom_id",
  "analiseId",
  "analysisId",
];

const EVENTOS_APROVADOS = ["purchase_approved", "approved", "paid"];
const STATUS_PAGO = ["paid", "approved", "aprovado", "pago", "completed", "confirmed"];

type CaktoWebhookPayload = {
  secret?: string;
  event?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
};

export async function POST(req: Request) {
  let body: CaktoWebhookPayload;
  try {
    body = (await req.json()) as CaktoWebhookPayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  // 1. Validação de segurança do Token / Secret
  const expected = process.env.CAKTO_WEBHOOK_TOKEN;
  if (expected) {
    const sent =
      body.secret ??
      req.headers.get("x-cakto-token") ??
      req.headers.get("x-webhook-token") ??
      new URL(req.url).searchParams.get("token");

    if (sent !== expected) {
      console.warn("[cakto-webhook] Token enviado não bate com o configurado.");
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }
  }

  // 2. Achata o payload para encontrar o parâmetro de rastreio da análise
  const flat = flatten(body);
  const referencia = CAMPOS_ID.map((k) => flat[k]).find(
    (v): v is string => typeof v === "string" && !!v,
  );

  if (!referencia) {
    console.error("[cakto-webhook] Nenhuma referência de análise encontrada no payload:", body);
    return NextResponse.json({ error: "Referência da análise ausente." }, { status: 400 });
  }

  // 3. Validação do evento / status de pagamento
  const event = String(body.event ?? "").toLowerCase();
  const status = String(flat.status ?? flat.tipo ?? "").toLowerCase();

  const foiAprovado =
    EVENTOS_APROVADOS.some((e) => event.includes(e)) ||
    STATUS_PAGO.some((s) => status.includes(s));

  if (!foiAprovado) {
    return NextResponse.json({ ok: true, ignorado: event || status });
  }

  // 4. Extrai a análise ID e a modalidade (relatório / avançada)
  const { id, unlock } = lerUnlock(referencia);

  if (!get(id)) {
    console.warn(`[cakto-webhook] Análise ${id} não encontrada no store.`);
    return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
  }

  // 5. Aplica a liberação (idempotente)
  aplicarUnlock(id, unlock);
  console.log(`[cakto-webhook] Sucesso! Análise ${id} desbloqueada (${unlock}).`);

  return NextResponse.json({ ok: true, id, unlock });
}

/** Achata objetos aninhados (ex: body.data.utm_content -> utm_content) */
function flatten(input: unknown, depth = 0): Record<string, string> {
  const out: Record<string, string> = {};
  if (!input || typeof input !== "object" || depth > 4) return out;

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (typeof value === "string" || typeof value === "number") {
      out[key] ??= String(value);
    } else if (value && typeof value === "object") {
      Object.assign(out, { ...flatten(value, depth + 1), ...out });
    }
  }
  return out;
}
