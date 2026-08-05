import { NextResponse } from "next/server";
import { forClient, get } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Estado da análise. O front consulta isto em intervalos até liberar. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const state = get(id);

  if (!state) {
    return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
  }

  return NextResponse.json(forClient(state), {
    headers: { "cache-control": "no-store" },
  });
}
