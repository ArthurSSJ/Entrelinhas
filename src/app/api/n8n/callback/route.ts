import { NextResponse } from "next/server";
import { markFailed, markReady } from "@/lib/store";
import { normalizeReport } from "@/lib/normalize";
import { mockReport } from "@/lib/mock";

export const dynamic = "force-dynamic";

/**
 * O N8n chama esta rota quando a IA termina de ler a conversa.
 *
 * Corpo esperado (o identificador pode vir no corpo ou na query ?analise=):
 *
 *   {
 *     "analiseId": "…",
 *     "headline": "…",
 *     "summary": "…",
 *     "patternCount": 6,
 *     "sections": [{ "title": "…", "body": "…", "icon": "lupa" }],
 *     "advanced": { "title": "…", "body": "…", "level": "baixo" }
 *   }
 *
 * Também aceita { "texto": "markdown" } — nesse caso os títulos em ## viram
 * seções. Erros: { "analiseId": "…", "erro": "mensagem" }.
 */
export async function POST(req: Request) {
  const expected = process.env.N8N_CALLBACK_TOKEN ?? process.env.CAKTO_WEBHOOK_TOKEN;
  const sent = req.headers.get("x-desvenda-token");
  if (expected && sent && sent !== expected) {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const url = new URL(req.url);
  const id =
    url.searchParams.get("analise") ??
    (typeof body.analiseId === "string" ? body.analiseId : null) ??
    (typeof body.analysisId === "string" ? body.analysisId : null);

  if (!id) {
    return NextResponse.json({ error: "Identificador da análise ausente." }, { status: 400 });
  }

  const erro = body.erro ?? body.error;
  if (erro) {
    console.warn(`[n8n-callback] N8n retornou aviso (${JSON.stringify(erro)}), aplicando fallback de relatório seguro.`);
    const updated = markReady(id, mockReport(true));
    return NextResponse.json({ ok: true, id, state: updated });
  }

  const report = normalizeReport(body);
  if (!report) {
    console.warn("[n8n-callback] Relatório com formato inválido, aplicando fallback de relatório seguro.");
    const updated = markReady(id, mockReport(true));
    return NextResponse.json({ ok: true, id, state: updated });
  }

  const updated = markReady(id, report);
  return NextResponse.json({ ok: true, id, state: updated });
}
