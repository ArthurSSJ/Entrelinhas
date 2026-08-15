import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { aplicarUnlock, get, referenciaPorPagamentoCakto } from "@/lib/store";
import { lerUnlock } from "@/lib/payments";

export const dynamic = "force-dynamic";

/**
 * Confirmação de pagamento (postback da Cakto).
 *
 * A Cakto não assina o payload com HMAC nem manda header de assinatura: o
 * segredo configurado no painel deles (Integrações > Webhooks) viaja dentro
 * do próprio body, no campo `secret`. É por isso que a checagem abaixo lê o
 * body antes de validar — checar um header aqui sempre daria 401, mesmo com
 * o token certo em CAKTO_WEBHOOK_TOKEN.
 *
 * https://docs.cakto.com.br/conceitos/webhooks
 */

const CAMPOS_ID = [
  "id",
  "refId",
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

// Únicos eventos que a Cakto manda para "dinheiro confirmado". Os demais
// (gerado, abandono, recusado, reembolso, chargeback, assinatura) não
// liberam nada — é o padrão de segurança: só libera quem está na lista.
const EVENTOS_PAGO = ["purchase_approved", "approved", "paid"];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  // Achata o payload para encontrar o parâmetro de rastreio da análise
  const flat = flatten(body);

  // 1. Validação de segurança do Token / Secret (Timing-safe)
  const expected = process.env.CAKTO_WEBHOOK_TOKEN;
  if (expected) {
    const recebido =
      flat.secret ??
      req.headers.get("x-cakto-token") ??
      req.headers.get("x-webhook-token") ??
      new URL(req.url).searchParams.get("token") ??
      undefined;
    if (!segredoValido(recebido, expected)) {
      console.warn("[cakto-webhook] Token enviado não bate com o configurado.");
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }
  }

  const evento = String(flat.event ?? "").toLowerCase();
  if (evento && !EVENTOS_PAGO.includes(evento)) {
    // Evento que não é aprovação (gerado, pendente, recusado, reembolso,
    // chargeback, assinatura). Nada a fazer.
    return NextResponse.json({ ok: true, ignorado: evento });
  }

  // 1ª tentativa: o PIX nativo guarda o id que a Cakto devolveu na criação —
  // é a única correlação confiável para esse fluxo (a API não aceita
  // referência externa na criação do pagamento).
  // 2ª tentativa: link de checkout hospedado, que carrega a referência na
  // própria URL (ref/utm_content/src) e a Cakto ecoa de volta.
  const referencia =
    (flat.id && referenciaPorPagamentoCakto(flat.id)) ??
    CAMPOS_ID.map((k) => flat[k]).find((v): v is string => typeof v === "string" && !!v);

  if (!referencia) {
    console.error("[cakto-webhook] Nenhuma referência de análise encontrada no payload:", body);
    return NextResponse.json({ error: "Referência da análise ausente." }, { status: 400 });
  }

  // A referência carrega o que este pagamento libera: só o relatório, só a
  // avançada, ou os dois. Quem escreveu isso foi o servidor, ao criar a
  // cobrança — o gateway só devolve o mesmo texto de volta.
  const { id, unlock } = lerUnlock(referencia);

  if (!get(id)) {
    console.warn(`[cakto-webhook] Análise ${id} não encontrada no store.`);
    return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
  }

  // Aplica a liberação (idempotente)
  aplicarUnlock(id, unlock);
  console.log(`[cakto-webhook] Sucesso! Análise ${id} desbloqueada (${unlock}).`);

  return NextResponse.json({ ok: true, id, unlock });
}

/** Compara com tempo constante — evita vazar o segredo por diferença de tempo. */
function segredoValido(recebido: string | undefined, esperado: string) {
  if (!recebido) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Achata objetos aninhados para achar o campo de rastreio onde quer que esteja. */
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
