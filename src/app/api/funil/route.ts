import { NextResponse } from "next/server";
import { get, marcarFunil } from "@/lib/store";
import type { FunilFlags } from "@/lib/types";

export const dynamic = "force-dynamic";

/** As marcas que o navegador pode pedir para registrar. */
const PERMITIDAS = [
  "upsellDeclined",
  "downsellOffered",
  "downsellDeclined",
  "recuperacaoOffered",
] as const;

type Marca = (typeof PERMITIDAS)[number];

/**
 * Registra por onde a pessoa já passou no funil.
 *
 * Fica no servidor, e não no navegador, por dois motivos: a recusa do upsell é
 * o que habilita o preço do downsell (então precisa ser confiável), e o estado
 * precisa sobreviver a um refresh no meio do fluxo.
 *
 * Só liga marcas, nunca desliga. Uma oferta recusada não volta a ser oferecida
 * porque alguém mandou `false` daqui.
 */
export async function POST(req: Request) {
  let body: { id?: string; marca?: Marca };
  try {
    body = (await req.json()) as { id?: string; marca?: Marca };
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { id, marca } = body;
  if (!id || !marca || !PERMITIDAS.includes(marca)) {
    return NextResponse.json({ error: "Pedido incompleto." }, { status: 400 });
  }

  const state = get(id);
  if (!state) {
    return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
  }

  // Recusar upsell ou downsell só faz sentido para quem chegou lá: com o
  // relatório pago e sem a avançada.
  const doPosCompra = marca === "upsellDeclined" || marca === "downsellDeclined";
  if (doPosCompra && (state.status !== "paid" || state.advancedPaid)) {
    return NextResponse.json({ error: "Etapa fora de ordem." }, { status: 409 });
  }
  if (marca === "downsellDeclined" && !state.funil?.upsellDeclined) {
    return NextResponse.json({ error: "Etapa fora de ordem." }, { status: 409 });
  }

  const flags: FunilFlags = { [marca]: true };
  marcarFunil(id, flags);

  return NextResponse.json({ ok: true });
}
