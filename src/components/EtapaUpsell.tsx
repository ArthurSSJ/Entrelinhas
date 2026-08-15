"use client";

import Image from "next/image";
import { useEffect } from "react";
import CobrancaAberta from "./CobrancaAberta";
import FormularioCliente from "./FormularioCliente";
import Icon3D from "./Icon3D";
import type { AnalysisState } from "@/lib/types";
import type { ClienteDados } from "@/lib/cliente";
import { UPSELL_CENTS, brl } from "@/lib/pricing";
import {
  trackUpsellAccepted,
  trackUpsellDeclined,
  trackUpsellViewed,
} from "@/lib/analytics";

const INCLUI = [
  "Mudanças de comportamento ao longo do tempo",
  "Horários e frequência das conversas",
  "Mudanças no tom de escrita",
  "Distanciamento emocional",
  "Sinais de alerta",
];

/**
 * Upsell, entre o pagamento do relatório e a entrega dele.
 *
 * O subtítulo do plano de implementação dizia que a análise adicional "ainda
 * não foi executada". Aqui ela já foi: a conversa é apagada logo depois de
 * lida, então a leitura avançada nasce junto com o resto ou não nasceria
 * nunca. O que está fechado é a entrega, não o trabalho — e é isso que o
 * texto diz, porque a outra frase seria mentira.
 *
 * Recusar leva ao relatório. Nada aqui bloqueia o que já foi pago.
 */
export default function EtapaUpsell({
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
    void trackUpsellViewed("investigacao-avancada", {
      analysis_id: estado.id,
      valor: UPSELL_CENTS / 100,
    });
  }, [estado.id]);

  const aceitar = () => {
    void trackUpsellAccepted("investigacao-avancada", UPSELL_CENTS / 100, {
      analysis_id: estado.id,
    });
    onAceitar();
  };

  const recusar = () => {
    void trackUpsellDeclined("investigacao-avancada", { analysis_id: estado.id });
    onRecusar();
  };

  return (
    <div className="stage">
      <div className="text-center">
        <span className="eyebrow">
          <Icon3D name="brilho" size={18} />
          Pagamento confirmado
        </span>
        <h2 className="t-h2 mt-3">Seu relatório principal está pronto.</h2>
        <p className="mt-2 text-[#B7A2AA]">
          Mas existe uma análise adicional que ainda não foi liberada.
        </p>
      </div>

      <div className="painel painel-neon relative mt-6 overflow-hidden p-6">
        <span aria-hidden className="brasa brasa-rosa -top-20 -right-14 h-56 w-56 !opacity-30" />

        <div className="relative">
          <Image
            src="/render/alerta.png"
            alt=""
            width={760}
            height={760}
            aria-hidden
            className="animate-float-slow mx-auto w-[110px] drop-shadow-[0_18px_44px_rgba(255,48,104,0.45)]"
          />

          <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#FF8FB3] uppercase text-center mt-3">
            ANÁLISE AVANÇADA DE INFIDELIDADE — +{brl(UPSELL_CENTS)}
          </p>

          <h3 className="t-h2 mt-2 text-center text-[1.25rem] sm:text-[1.5rem]">
            Quer saber se existem sinais de infidelidade na conversa?
          </h3>

          <p className="t-apoio mx-auto mt-3 max-w-[44ch] text-center text-[0.9375rem] leading-relaxed">
            Procura padrões como mudanças de comportamento, horários, frequência das conversas, alterações no tom, distanciamento emocional e outros sinais de alerta.
          </p>

          <ul className="mt-5 space-y-2.5">
            {INCLUI.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-[#F6ECEF]/90">
                <Tique />
                {item}
              </li>
            ))}
          </ul>

          <p className="t-legenda mt-4 border-t border-white/8 pt-3 text-center text-[0.8125rem]">
            A análise identifica padrões e sinais de alerta, mas não pode afirmar que uma traição aconteceu.
          </p>

          <p className="mt-5 text-center font-[family-name:var(--font-outfit)] text-[2rem] font-bold text-[#F6ECEF]">
            {brl(UPSELL_CENTS)}
          </p>
          <p className="t-legenda text-center">Pagamento único. Some ao que você já comprou.</p>
        </div>
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
            "Sim, quero a Investigação Avançada"
          )}
        </button>
      )}

      <button
        type="button"
        onClick={recusar}
        className="mt-4 block w-full text-center text-[0.9375rem] text-[#B7A2AA] underline underline-offset-4"
      >
        Não, quero apenas meu relatório
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

function Tique() {
  return (
    <span
      aria-hidden
      className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-[#FF3068]/18 text-[#FF8FB3]"
    >
      <svg width="11" height="11" viewBox="0 0 14 14" focusable="false">
        <path
          d="M2 7.5 5.5 11 12 3.5"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
