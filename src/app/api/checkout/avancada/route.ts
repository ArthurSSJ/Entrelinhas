import { NextResponse } from "next/server";
import { attachCharge, get, marcarFunil } from "@/lib/store";
import { createCharge } from "@/lib/payments";
import {
  DOWNSELL_CENTS,
  OFERTA_RECUPERACAO_ATIVA,
  PACOTE_CENTS,
  UPSELL_CENTS,
} from "@/lib/pricing";
import type { OrigemAvancada, Unlock } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Cobrança da investigação avançada, fora do pedido principal.
 *
 * Três origens, três preços — e o preço é escolhido AQUI, a partir da origem
 * que o servidor aceitou. O navegador diz de onde veio o clique; se o estado
 * da análise não sustenta essa origem, o pedido é recusado em vez de cobrar o
 * valor errado. É isso que impede alguém de pagar o preço do downsell sem ter
 * passado pelo upsell.
 */
export async function POST(req: Request) {
  let body: { id?: string; origem?: OrigemAvancada };
  try {
    body = (await req.json()) as { id?: string; origem?: OrigemAvancada };
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { id, origem } = body;
  if (!id || !origem) {
    return NextResponse.json({ error: "Pedido incompleto." }, { status: 400 });
  }

  const state = get(id);
  if (!state) {
    return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
  }
  if (state.status === "processing" || state.status === "failed") {
    return NextResponse.json({ error: "Esta análise não está pronta." }, { status: 409 });
  }
  if (state.advancedPaid) {
    // Já é dela. Uma segunda cobrança aqui seria cobrar duas vezes o mesmo.
    return NextResponse.json({ error: "A investigação avançada já foi liberada." }, { status: 409 });
  }

  const funil = state.funil ?? {};
  let amountCents: number;
  let unlock: Unlock;

  if (origem === "upsell") {
    // Só depois do relatório pago: antes disso o lugar da avançada é o bump.
    if (state.status !== "paid") {
      return NextResponse.json({ error: "O relatório ainda não foi liberado." }, { status: 409 });
    }
    amountCents = UPSELL_CENTS;
    unlock = "av";
  } else if (origem === "downsell") {
    if (state.status !== "paid") {
      return NextResponse.json({ error: "O relatório ainda não foi liberado." }, { status: 409 });
    }
    // O preço menor existe para quem recusou o de cima. Sem essa recusa
    // registrada no servidor, não há desconto.
    if (!funil.upsellDeclined) {
      return NextResponse.json({ error: "Oferta indisponível." }, { status: 409 });
    }
    if (funil.downsellDeclined) {
      return NextResponse.json({ error: "Oferta já encerrada." }, { status: 409 });
    }
    amountCents = DOWNSELL_CENTS;
    unlock = "av";
  } else if (origem === "recuperacao") {
    if (!OFERTA_RECUPERACAO_ATIVA) {
      return NextResponse.json({ error: "Oferta indisponível." }, { status: 409 });
    }
    // O pacote inclui o relatório: quem já pagou o relatório não compra por aqui.
    if (state.status === "paid") {
      return NextResponse.json({ error: "Este relatório já foi liberado." }, { status: 409 });
    }
    amountCents = PACOTE_CENTS;
    unlock = "rel_av";
  } else {
    return NextResponse.json({ error: "Origem desconhecida." }, { status: 400 });
  }

  // Reaproveita a cobrança aberta só se ela for do mesmo valor: trocar de
  // oferta troca o preço, e um QR antigo cobraria errado.
  const aberta = state.chargeAvancada;
  if (aberta && aberta.expiresAt > Date.now() && aberta.amountCents === amountCents) {
    return NextResponse.json({ charge: aberta, amountCents });
  }

  try {
    const charge = await createCharge(id, amountCents, unlock);
    // O pacote paga o pedido principal também, então ele vira a cobrança
    // principal — é ela que a tela de pagamento mostra.
    attachCharge(id, charge, unlock);
    if (origem === "recuperacao") marcarFunil(id, { recuperacaoOffered: true });
    return NextResponse.json({ charge, amountCents });
  } catch (err) {
    console.error("[checkout/avancada] falha ao criar a cobrança:", err);
    return NextResponse.json(
      { error: "Não conseguimos abrir o pagamento agora. Tente de novo." },
      { status: 502 },
    );
  }
}
