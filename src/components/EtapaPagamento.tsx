"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Icon3D from "./Icon3D";
import type { AnalysisState } from "@/lib/types";
import { BASE_CENTS, UPSELL_CENTS, brl } from "@/lib/pricing";

type Props = {
  estado: AnalysisState;
  erro: string | null;
  onRecomecar: () => void;
};

export default function EtapaPagamento({ estado, erro, onRecomecar }: Props) {
  const preview = estado.preview;
  const cobranca = estado.charge;

  return (
    <div className="stage">
      <div className="text-center">
        <Image
          src="/render/presente.png"
          alt=""
          width={760}
          height={760}
          aria-hidden
          className="animate-float-slow mx-auto w-[112px] drop-shadow-[0_18px_44px_rgba(255,48,104,0.42)]"
        />
        <span className="eyebrow mt-4">
          <Icon3D name="brilho" size={18} />
          Leitura concluída
        </span>
        <h2 className="t-h2 mt-3">{preview?.headline ?? "Sua análise está pronta."}</h2>
        <p className="mt-2 text-[#B7A2AA]">
          Essa é a primeira conclusão. Atrás dela tem mais{" "}
          <strong className="text-[#F6ECEF]">{preview?.patternCount ?? 0} padrões</strong> na
          conversa de vocês.
        </p>
      </div>

      {/* O que existe do outro lado */}
      <div className="card mt-6">
        <h3 className="t-h3">O que ainda está fechado</h3>
        <ul className="mt-4 space-y-4">
          {(preview?.sectionTitles ?? []).map((titulo) => (
            <li key={titulo}>
              <p className="flex items-start gap-2 text-[0.9375rem] font-medium">
                <Icon3D name="cadeado" size={20} className="mt-0.5 flex-none" />
                {titulo}
              </p>
              <span className="locked-bar mt-2 block" aria-hidden />
              <span className="locked-bar mt-1.5 block w-2/3" aria-hidden />
            </li>
          ))}
          {preview?.hasAdvanced && (
            <li className="rounded-2xl border border-[#FF3068]/35 bg-[#FF3068]/8 p-4">
              <p className="flex items-start gap-2 text-[0.9375rem] font-medium">
                <Icon3D name="alerta" size={22} className="mt-0.5 flex-none" />
                Análise avançada de traição
              </p>
              <span className="locked-bar mt-2 block" aria-hidden />
              <span className="locked-bar mt-1.5 block w-1/2" aria-hidden />
            </li>
          )}
        </ul>

        <p className="t-legenda mt-5">
          Cada uma dessas leituras vem com a data e o trecho da conversa de vocês em que ela se
          apoia.
        </p>
      </div>

      {/* Valor */}
      <div className="card mt-4">
        <dl className="space-y-2 text-[0.9375rem]">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[#B7A2AA]">Análise completa</dt>
            <dd>{brl(BASE_CENTS)}</dd>
          </div>
          {estado.withAdvanced && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#B7A2AA]">Análise avançada de traição</dt>
              <dd>{brl(UPSELL_CENTS)}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-4 border-t border-white/8 pt-2.5">
            <dt className="font-[family-name:var(--font-outfit)] font-semibold">Total</dt>
            <dd className="font-[family-name:var(--font-outfit)] text-[1.375rem] font-bold">
              {brl(estado.amountCents)}
            </dd>
          </div>
        </dl>
      </div>

      {erro && (
        <p role="alert" className="mt-4 rounded-2xl bg-[#FF5A5A]/12 px-4 py-3 text-[0.875rem] text-[#FFA3A3]">
          {erro}
        </p>
      )}

      {!cobranca && !erro && <Carregando />}

      {cobranca?.kind === "redirect" && (
        <a href={cobranca.url} className="btn btn-primary btn-lg btn-block btn-pulse mt-5">
          Abrir meu relatório
        </a>
      )}

      {cobranca?.kind === "pix" && <BlocoPix brCode={cobranca.brCode} qrImage={cobranca.qrImage} />}

      {cobranca && (
        <p className="t-legenda mt-4 flex items-center justify-center gap-2 text-center">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ADE80]" />
          </span>
          Assim que o pagamento cair, esta tela abre sozinha.
        </p>
      )}

      {estado.demo && <AtalhoDemo id={estado.id} />}

      <button
        type="button"
        onClick={onRecomecar}
        className="mt-8 block w-full text-center text-[0.875rem] text-[#B7A2AA] underline underline-offset-4"
      >
        Começar de novo com outra conversa
      </button>
    </div>
  );
}

function Carregando() {
  return (
    <p className="t-legenda mt-5 text-center" aria-live="polite">
      Abrindo o pagamento…
    </p>
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
function AtalhoDemo({ id }: { id: string }) {
  return (
    <button
      type="button"
      className="btn btn-quiet btn-block mt-3 !border-dashed"
      onClick={() =>
        fetch("/api/checkout/demo", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id }),
        })
      }
    >
      Simular pagamento aprovado (demonstração)
    </button>
  );
}
