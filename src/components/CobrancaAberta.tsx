"use client";

import { useEffect, useState } from "react";
import Icon3D from "./Icon3D";
import type { Charge, Unlock } from "@/lib/types";
import { brl } from "@/lib/pricing";

/**
 * Uma cobrança aberta, do jeito que o servidor a devolveu.
 *
 * Mora fora das etapas porque três telas cobram — checkout, upsell e
 * downsell — e as três precisam do mesmo QR, do mesmo copia-e-cola e do mesmo
 * aviso de que a tela vira sozinha. Só o rótulo do botão muda.
 *
 * O que a cobrança libera vem dela mesma, e não de quem a desenhou: o atalho
 * de demonstração precisa confirmar exatamente o pedido que está aberto, e
 * deduzir isso do estado da tela erraria justamente no caso do pacote.
 */
export default function CobrancaAberta({
  cobranca,
  rotulo,
  demo,
  analiseId,
}: {
  cobranca: Charge;
  rotulo: string;
  demo?: boolean;
  analiseId: string;
}) {
  return (
    <>
      {cobranca.kind === "redirect" && (
        <a href={cobranca.url} className="btn btn-neon btn-lg btn-block btn-pulse mt-5">
          {rotulo} · {brl(cobranca.amountCents)}
        </a>
      )}

      {cobranca.kind === "pix" && <BlocoPix brCode={cobranca.brCode} qrImage={cobranca.qrImage} />}

      <p className="t-legenda mt-4 flex items-center justify-center gap-2 text-center">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ADE80]" />
        </span>
        Assim que o pagamento cair, esta tela abre sozinha.
      </p>

      {demo && <AtalhoDemo id={analiseId} unlock={cobranca.unlock} />}
    </>
  );
}

function BlocoPix({ brCode, qrImage }: { brCode: string; qrImage?: string }) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const t = window.setTimeout(() => setCopiado(false), 2200);
    return () => window.clearTimeout(t);
  }, [copiado]);

  return (
    <div className="card mt-5 text-center">
      <span className="eyebrow">
        <Icon3D name="pix" size={18} />
        Pague com PIX
      </span>

      {qrImage && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={qrImage}
          alt="QR Code do PIX para liberar o relatório"
          width={200}
          height={200}
          className="mx-auto mt-4 h-[200px] w-[200px] rounded-2xl border border-white/12 bg-white p-2"
        />
      )}

      <p className="t-legenda mt-3">Abra o app do banco, escolha PIX e aponte a câmera.</p>

      <p className="pix-code mt-4 text-left">{brCode}</p>

      <button
        type="button"
        className="btn btn-quiet btn-block mt-3"
        onClick={async () => {
          await navigator.clipboard.writeText(brCode);
          setCopiado(true);
        }}
      >
        {copiado ? "Código copiado" : "Copiar código"}
      </button>
    </div>
  );
}

/** Aparece só enquanto não há checkout real conectado. */
function AtalhoDemo({ id, unlock }: { id: string; unlock: Unlock }) {
  return (
    <button
      type="button"
      className="btn btn-quiet btn-block mt-3 !border-dashed"
      onClick={() =>
        fetch("/api/checkout/demo", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id, unlock }),
        })
      }
    >
      Simular pagamento aprovado (demonstração)
    </button>
  );
}
