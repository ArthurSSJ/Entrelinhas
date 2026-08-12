import { NextResponse, after } from "next/server";
import { create, markFailed, markReady, setQueuePos } from "@/lib/store";
import { mockReport } from "@/lib/mock";
import { checkFile } from "@/lib/upload";
import { analisarConversa, groqConfigurado } from "@/lib/groq";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Recebe o arquivo da conversa e dispara a leitura.
 *
 * Três caminhos, nesta ordem:
 *  1. N8N_WEBHOOK_URL — repassa para o fluxo de automação;
 *  2. GROQ_API_KEY — lê aqui mesmo, com o agente em lib/groq;
 *  3. nenhum dos dois — modo demonstração.
 *
 * Em todos eles a resposta sai na hora com o identificador, e a leitura
 * continua em segundo plano. O front acompanha por GET /api/analyze/[id].
 *
 * O texto da conversa existe apenas em memória durante a leitura. Nada é
 * gravado em disco e nada do texto entra no armazenamento.
 *
 * A leitura avançada é sempre produzida, mesmo para quem não marcou nada.
 * Não é generosidade: como a conversa é apagada assim que a leitura termina,
 * ela não teria como ser escrita depois — e o funil vende essa análise em
 * três momentos posteriores (order bump, upsell, downsell). Quem paga é quem
 * vê: `advancedPaid`, no servidor, decide se ela sai daqui.
 */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Envio inválido." }, { status: 400 });
  }

  const file = form.get("arquivo");
  const withAdvanced = form.get("avancada") === "true";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo recebido." }, { status: 400 });
  }

  const verdict = checkFile({ name: file.name, size: file.size });
  if (!verdict.ok) {
    return NextResponse.json({ error: verdict.message }, { status: 415 });
  }

  const id = crypto.randomUUID();
  create({
    id,
    advancedPreSelected: withAdvanced,
    demo: !process.env.CAKTO_CHECKOUT_URL,
  });

  /* ---------- 1. Agente próprio (OpenAI / Gemini / Groq) ---------- */
  if (groqConfigurado()) {
    const texto = await file.text();
    const respostas = lerRespostas(form.get("respostas"));

    try {
      const relatorio = await analisarConversa(texto, {
        withAdvanced: true,
        respostas,
        remetente: typeof form.get("remetente") === "string" ? String(form.get("remetente")) : null,
        aoAndar: (posicao) => setQueuePos(id, posicao),
      });
      markReady(id, relatorio);
    } catch (err) {
      console.error("[analyze] a leitura de IA falhou:", err);
      markFailed(
        id,
        err instanceof Error && err.message.startsWith("Não conseguimos ler")
          ? err.message
          : "A leitura não foi concluída.",
      );
    }

    return NextResponse.json({ id });
  }

  const webhook = process.env.N8N_WEBHOOK_URL;

  /* ---------- 2. N8n Webhook Fallback ---------- */
  if (webhook) {
    try {
      const relay = new FormData();
      relay.set("arquivo", file, file.name);
      relay.set("analiseId", id);
      relay.set("avancada", "true");
      relay.set("callbackUrl", callbackUrl(req, id));

      const respostas = form.get("respostas");
      if (typeof respostas === "string" && respostas) relay.set("respostas", respostas);

      const remetente = form.get("remetente");
      if (typeof remetente === "string" && remetente) relay.set("remetente", remetente);

      const res = await fetch(webhook, {
        method: "POST",
        body: relay,
        headers: process.env.N8N_WEBHOOK_TOKEN
          ? { authorization: `Bearer ${process.env.N8N_WEBHOOK_TOKEN}` }
          : undefined,
      });

      if (!res.ok) throw new Error(`N8n respondeu ${res.status}`);
    } catch (err) {
      console.error("[analyze] falha ao enviar para o N8n:", err);
      return NextResponse.json(
        { error: "Não conseguimos iniciar a leitura agora. Tente de novo em instantes." },
        { status: 502 },
      );
    }

    return NextResponse.json({ id });
  }

  /* ---------- 3. Demonstração ---------- */
  markReady(id, mockReport(true));
  return NextResponse.json({ id, demo: true });
}

function lerRespostas(bruto: FormDataEntryValue | null) {
  if (typeof bruto !== "string" || !bruto) return [];
  try {
    const lista = JSON.parse(bruto) as { pergunta?: string; resposta?: string }[];
    return Array.isArray(lista)
      ? lista
          .filter((r) => r?.pergunta && r?.resposta)
          .map((r) => ({ pergunta: r.pergunta!, resposta: r.resposta! }))
      : [];
  } catch {
    return [];
  }
}

function callbackUrl(req: Request, id: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  return `${base}/api/n8n/callback?analise=${id}`;
}
