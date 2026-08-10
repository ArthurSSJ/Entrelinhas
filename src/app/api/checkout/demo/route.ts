import { NextResponse } from "next/server";
import { aplicarUnlock, get } from "@/lib/store";
import type { Unlock } from "@/lib/types";

export const dynamic = "force-dynamic";

const UNLOCKS: Unlock[] = ["rel", "av", "rel_av"];

/**
 * Atalho de demonstração: confirma o pagamento sem gateway nenhum, para dar
 * para percorrer as telas de resultado enquanto a Cakto não está conectada.
 * Desliga sozinho assim que CAKTO_CHECKOUT_URL existir.
 *
 * Aceita o mesmo `unlock` do postback real, para o fluxo de upsell e downsell
 * também poder ser percorrido em demonstração.
 */
export async function POST(req: Request) {
  if (process.env.CAKTO_CHECKOUT_URL) {
    return NextResponse.json({ error: "Indisponível." }, { status: 404 });
  }

  const { id, unlock } = (await req.json().catch(() => ({}))) as {
    id?: string;
    unlock?: Unlock;
  };

  if (!id || !get(id)) {
    return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
  }

  aplicarUnlock(id, unlock && UNLOCKS.includes(unlock) ? unlock : "rel");
  return NextResponse.json({ ok: true });
}
