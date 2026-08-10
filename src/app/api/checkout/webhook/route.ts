import { NextResponse } from "next/server";
import { aplicarUnlock, get } from "@/lib/store";
import { lerUnlock } from "@/lib/payments";

export const dynamic = "force-dynamic";

/**
 * Confirmação de pagamento.
 *
 * Escrito para o postback da Cakto, mas tolerante: procura o identificador da
 * análise em qualquer campo de rastreio conhecido e aceita os nomes de status
 * mais comuns. Ao conectar a conta real, confira no painel qual campo a Cakto
 * devolve e, se quiser, reduza as listas abaixo ao que de fato chega.
 */

const CAMPOS_ID = [
  "ref",
  "referencia",
  "reference",
  "utm_content",
  "src",
  "external_reference",
  "checkout_id",
  "custom_id",
  "analiseId",
  "analysisId",
];

const STATUS_PAGO = ["paid", "approved", "aprovado", "pago", "completed", "confirmed"];

export async function POST(req: Request) {
  const expected = process.env.CAKTO_WEBHOOK_TOKEN;
  if (expected) {
    const sent =
      req.headers.get("x-cakto-token") ??
      req.headers.get("x-webhook-token") ??
      new URL(req.url).searchParams.get("token");
    if (sent !== expected) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const flat = flatten(body);
  const referencia = CAMPOS_ID.map((k) => flat[k]).find(
    (v): v is string => typeof v === "string" && !!v,
  );

  if (!referencia) {
    return NextResponse.json({ error: "Referência da análise ausente." }, { status: 400 });
  }

  const status = String(flat.status ?? flat.event ?? flat.tipo ?? "paid").toLowerCase();
  if (!STATUS_PAGO.some((s) => status.includes(s))) {
    // Evento que não é aprovação (pendente, recusado, reembolso). Nada a fazer.
    return NextResponse.json({ ok: true, ignorado: status });
  }

  // A referência carrega o que este pagamento libera: só o relatório, só a
  // avançada, ou os dois. Quem escreveu isso foi o servidor, ao criar a
  // cobrança — o gateway só devolve o mesmo texto de volta.
  const { id, unlock } = lerUnlock(referencia);

  if (!get(id)) {
    return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
  }

  // Idempotente: dois postbacks do mesmo pedido chegam ao mesmo estado, sem
  // liberar nada a mais nem cobrar nada de novo.
  aplicarUnlock(id, unlock);
  return NextResponse.json({ ok: true });
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
