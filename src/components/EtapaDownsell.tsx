"use client";

import { useEffect } from "react";
import CobrancaAberta from "./CobrancaAberta";
import FormularioCliente from "./FormularioCliente";
import Icon3D from "./Icon3D";
import type { AnalysisState } from "@/lib/types";
import type { ClienteDados } from "@/lib/cliente";
import { DOWNSELL_CENTS, UPSELL_CENTS, brl } from "@/lib/pricing";
import {
  trackDownsellAccepted,
  trackDownsellDeclined,
  trackDownsellViewed,
} from "@/lib/analytics";

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
  carregando,
  precisaDadosCliente,
  onClienteEnviado,
  onAceitar,
  onRecusar,
}: {
  estado: AnalysisState;
  erro: string | null;
  /** A cobrança está sendo criada no servidor: botão trava, mostra progresso. */
  carregando: boolean;
  /** O PIX nativo da Cakto exige nome/e-mail/telefone/CPF antes da cobrança. */
  precisaDadosCliente: boolean;
  onClienteEnviado: (cliente: ClienteDados) => void;
  onAceitar: () => void;
  onRecusar: () => void;
}) {
  const cobranca = estado.chargeAvancada;

  useEffect(() => {
    void trackDownsellViewed("investigacao-avancada-desconto", {
      analysis_id: estado.id,
      valor: DOWNSELL_CENTS / 100,
    });
  }, [estado.id]);

  const aceitar = () => {
    void trackDownsellAccepted("investigacao-avancada-desconto", DOWNSELL_CENTS / 100, {
      analysis_id: estado.id,
    });
    onAceitar();
  };

  const recusar = () => {
    void trackDownsellDeclined("investigacao-avancada-desconto", {
      analysis_id: estado.id,
    });
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
      ) : precisaDadosCliente ? (
        <FormularioCliente onEnviar={onClienteEnviado} />
      ) : (
        <button
          type="button"
          className="btn btn-neon btn-lg btn-block mt-6"
          onClick={aceitar}
          disabled={carregando}
          aria-busy={carregando}
        >
          {carregando ? (
            <>
              <Spinner /> Abrindo pagamento…
            </>
          ) : (
            `Adicionar por ${brl(DOWNSELL_CENTS)}`
          )}
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

/** Spinner pequeno para dentro de botão, enquanto uma cobrança é criada. */
function Spinner() {
  return (
    <svg className="h-4 w-4 flex-none animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
