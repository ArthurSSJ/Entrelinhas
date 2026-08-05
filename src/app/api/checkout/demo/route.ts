import { NextResponse } from "next/server";
import { get, markPaid } from "@/lib/store";

export const dynamic = "force-dynamic";

/**
 * Atalho de demonstração: confirma o pagamento sem gateway nenhum, para dar
 * para percorrer a tela de resultado enquanto a Cakto não está conectada.
 * Desliga sozinho assim que CAKTO_CHECKOUT_URL existir.
 */
export async function POST(req: Request) {
  if (process.env.CAKTO_CHECKOUT_URL) {
    return NextResponse.json({ error: "Indisponível." }, { status: 404 });
  }

  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id || !get(id)) {
    return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
  }

  markPaid(id);
  return NextResponse.json({ ok: true });
}
