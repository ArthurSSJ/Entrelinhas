"use client";

import Image from "next/image";
import { useEffect } from "react";
import CobrancaAberta from "./CobrancaAberta";
import Icon3D from "./Icon3D";
import type { AnalysisState } from "@/lib/types";
import { UPSELL_CENTS, brl } from "@/lib/pricing";
import { rastrear } from "@/lib/analytics";

const INCLUI = [
  "Análise comportamental aprofundada",
  "Mudanças ao longo do histórico",
  "Padrões de comunicação",
  "Sinais de alerta",
  "Possíveis indícios compatíveis com infidelidade",
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
    rastrear("upsell_viewed", { analise: estado.id, valor: UPSELL_CENTS / 100 });
  }, [estado.id]);

  const aceitar = () => {
    rastrear("upsell_accepted", { analise: estado.id, valor: UPSELL_CENTS / 100 });
    onAceitar();
  };

  const recusar = () => {
    rastrear("upsell_declined", { analise: estado.id });
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

          <h3 className="t-h2 mt-4 text-center">Quer olhar mais fundo?</h3>

          <p className="t-apoio mx-auto mt-3 max-w-[44ch] text-center text-[0.9375rem]">
            A Investigação Avançada procura padrões relacionados a mudanças de comportamento,
            inconsistências, distanciamento e sinais de alerta na conversa.
          </p>

          <ul className="mt-5 space-y-2.5">
            {INCLUI.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-[#F6ECEF]/90">
                <Tique />
                {item}
              </li>
            ))}
          </ul>

          <p className="t-legenda mt-4 border-t border-white/8 pt-3">
            A análise identifica padrões e sinais de alerta. Ela não confirma traição como fato.
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
      ) : (
        <button type="button" className="btn btn-neon btn-lg btn-block mt-6" onClick={aceitar}>
          Sim, quero a Investigação Avançada
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
