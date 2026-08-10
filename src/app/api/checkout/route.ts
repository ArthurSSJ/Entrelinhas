import { NextResponse } from "next/server";
import { attachCharge, get, setBump } from "@/lib/store";
import { createCharge } from "@/lib/payments";

export const dynamic = "force-dynamic";

/**
 * Cria a cobrança do pedido principal. Só faz sentido depois que a IA terminou.
 *
 * O corpo diz apenas se o order bump está marcado. O valor sai do servidor:
 * `setBump` recalcula `amountCents` a partir das constantes de preço, e é esse
 * número que vira cobrança. Preço que chega do navegador é ignorado.
 */
export async function POST(req: Request) {
  let body: { id?: string; bump?: boolean };
  try {
    body = (await req.json()) as { id?: string; bump?: boolean };
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const id = body.id;
  if (!id) {
    return NextResponse.json({ error: "Identificador ausente." }, { status: 400 });
  }

  let state = get(id);
  if (!state) {
    return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
  }
  if (state.status === "processing") {
    return NextResponse.json({ error: "A leitura ainda está em andamento." }, { status: 409 });
  }
  if (state.status === "failed") {
    return NextResponse.json({ error: "Esta análise não foi concluída." }, { status: 409 });
  }
  if (state.status === "paid") {
    // O relatório já é dela. Cobrar de novo aqui seria cobrança duplicada.
    return NextResponse.json({ error: "Este relatório já foi liberado." }, { status: 409 });
  }

  if (typeof body.bump === "boolean" && body.bump !== state.bumpSelected) {
    state = setBump(id, body.bump) ?? state;
  }

  // Uma cobrança por valor: se o total não mudou e a que existe ainda vale,
  // reaproveita em vez de abrir outra.
  if (state.charge && state.charge.expiresAt > Date.now()) {
    return NextResponse.json({ charge: state.charge, amountCents: state.amountCents });
  }

  const unlock = state.bumpSelected ? "rel_av" : "rel";

  try {
    const charge = await createCharge(id, state.amountCents, unlock);
    attachCharge(id, charge, unlock);
    return NextResponse.json({ charge, amountCents: state.amountCents });
  } catch (err) {
    console.error("[checkout] falha ao criar a cobrança:", err);
    return NextResponse.json(
      { error: "Não conseguimos abrir o pagamento agora. Tente de novo." },
      { status: 502 },
    );
  }
}
