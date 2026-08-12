import { NextResponse } from "next/server";
import { markFailed, markReady } from "@/lib/store";
import { normalizeReport } from "@/lib/normalize";

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
  const expected = process.env.N8N_CALLBACK_TOKEN;
  if (expected) {
    const sent = req.headers.get("x-desvenda-token");
    if (sent !== expected) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }
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
  if (typeof erro === "string" && erro) {
    markFailed(id, erro);
    return NextResponse.json({ ok: true, id, status: "failed" });
  }

  const report = normalizeReport(body);
  if (!report) {
    return NextResponse.json({ error: "Relatório vazio." }, { status: 422 });
  }

  const updated = markReady(id, report);
  return NextResponse.json({ ok: true, id, state: updated });
}
