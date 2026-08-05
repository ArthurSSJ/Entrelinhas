import { NextResponse } from "next/server";
import { attachCharge, get } from "@/lib/store";
import { createCharge } from "@/lib/payments";

export const dynamic = "force-dynamic";

/** Cria a cobrança da análise. Só faz sentido depois que a IA terminou. */
export async function POST(req: Request) {
  let body: { id?: string };
  try {
    body = (await req.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const id = body.id;
  if (!id) {
    return NextResponse.json({ error: "Identificador ausente." }, { status: 400 });
  }

  const state = get(id);
  if (!state) {
    return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
  }
  if (state.status === "processing") {
    return NextResponse.json({ error: "A leitura ainda está em andamento." }, { status: 409 });
  }
  if (state.status === "failed") {
    return NextResponse.json({ error: "Esta análise não foi concluída." }, { status: 409 });
  }

  // Uma cobrança por análise: reaproveita a que já existe e ainda vale.
  if (state.charge && state.charge.expiresAt > Date.now()) {
    return NextResponse.json({ charge: state.charge });
  }

  try {
    const charge = await createCharge(id, state.amountCents, state.withAdvanced);
    attachCharge(id, charge);
    return NextResponse.json({ charge });
  } catch (err) {
    console.error("[checkout] falha ao criar a cobrança:", err);
    return NextResponse.json(
      { error: "Não conseguimos abrir o pagamento agora. Tente de novo." },
      { status: 502 },
    );
  }
}
