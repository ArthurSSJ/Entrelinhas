"use client";

import { useEffect } from "react";
import CobrancaAberta from "./CobrancaAberta";
import Icon3D from "./Icon3D";
import type { AnalysisState } from "@/lib/types";
import { DOWNSELL_CENTS, UPSELL_CENTS, brl } from "@/lib/pricing";
import { rastrear } from "@/lib/analytics";

/**
 * A última oferta da investigação avançada, e só para quem recusou a primeira.
 *
 * Aparece uma vez. Recusada, o funil acaba: não existe uma terceira oferta com
 * um preço ainda menor, porque isso ensinaria que basta dizer não mais uma vez
 * para o preço cair de novo.
 *
 * O preço menor é decidido no servidor, a partir da recusa registrada lá. O
 * navegador não consegue pedir este valor sem ter passado pelo upsell.
 */
export default function EtapaDownsell({
  estado,
  erro,
  onAceitar,
  onRecusar,
}: {
  estado: AnalysisState;
  erro: string | null;
  onAceitar: () => void;
  onRecusar: () => void;
}) {
  const cobranca = estado.chargeAvancada;

  useEffect(() => {
    rastrear("downsell_viewed", { analise: estado.id, valor: DOWNSELL_CENTS / 100 });
  }, [estado.id]);

  const aceitar = () => {
    rastrear("downsell_accepted", { analise: estado.id, valor: DOWNSELL_CENTS / 100 });
    onAceitar();
  };

  const recusar = () => {
    rastrear("downsell_declined", { analise: estado.id });
    onRecusar();
  };

  return (
    <div className="stage">
      <div className="text-center">
        <Icon3D name="presente" size={56} className="mx-auto animate-float-slow" />
        <h2 className="t-h2 mt-4">Antes de continuar…</h2>
        <p className="mx-auto mt-2 max-w-[42ch] text-[#B7A2AA]">
          Se o motivo da sua dúvida foi o preço, você ainda pode adicionar a Investigação Avançada
          por uma condição especial.
        </p>
      </div>

      <div className="painel painel-neon mt-6 p-6 text-center">
        <p className="t-legenda">Investigação Avançada</p>

        <p className="mt-1 flex items-center justify-center gap-3">
          <span className="text-[1.0625rem] text-[#B7A2AA] line-through">
            {brl(UPSELL_CENTS)}
          </span>
          <span className="font-[family-name:var(--font-outfit)] text-[2.25rem] font-bold text-[#F6ECEF]">
            {brl(DOWNSELL_CENTS)}
          </span>
        </p>

        <p className="t-legenda mt-2">
          Mesma análise da oferta anterior. Pagamento único, sem assinatura.
        </p>
      </div>

      {erro && (
        <p
          role="alert"
          className="mt-4 rounded-2xl bg-[#FF5A5A]/12 px-4 py-3 text-[0.875rem] text-[#FFA3A3]"
        >
          {erro}
        </p>
      )}

      {cobranca ? (
        <CobrancaAberta
          cobranca={cobranca}
          rotulo="Ir para o pagamento"
          demo={estado.demo}
          analiseId={estado.id}
        />
      ) : (
        <button type="button" className="btn btn-neon btn-lg btn-block mt-6" onClick={aceitar}>
          Adicionar por {brl(DOWNSELL_CENTS)}
        </button>
      )}

      <button
        type="button"
        onClick={recusar}
        className="mt-4 block w-full text-center text-[0.9375rem] text-[#B7A2AA] underline underline-offset-4"
      >
        Continuar sem ela
      </button>
    </div>
  );
}
