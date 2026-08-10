"use client";

import { useEffect, useState } from "react";
import CobrancaAberta from "./CobrancaAberta";
import Icon3D from "./Icon3D";
import type { AnalysisState } from "@/lib/types";
import { BASE_CENTS, UPSELL_CENTS, brl } from "@/lib/pricing";
import { rastrear } from "@/lib/analytics";

type Props = {
  estado: AnalysisState;
  erro: string | null;
  /** Abre a cobrança do pedido principal com o order bump marcado ou não. */
  onCobrar: (bump: boolean) => void;
  onRecomecar: () => void;
};

const INCLUI = [
  "Análise da comunicação",
  "Padrões de interesse e reciprocidade",
  "Pontos de atenção",
  "Dinâmica da relação",
  "Recomendações personalizadas",
];

const BUMP_INCLUI = [
  "Mudanças de comportamento",
  "Inconsistências na comunicação",
  "Distanciamento emocional",
  "Padrões que merecem atenção",
  "Possíveis indícios compatíveis com infidelidade",
];

/**
 * O checkout. Uma tela só, sem menu e sem link de fuga: a decisão aqui é
 * pagar ou não, e tudo que competir com isso está fora.
 *
 * A cobrança não é aberta ao entrar. Ela nasce quando a pessoa toca no botão,
 * já com a resposta do order bump — abrir um PIX antes disso cobraria um
 * valor que ela ainda não escolheu.
 */
export default function EtapaPagamento({ estado, erro, onCobrar, onRecomecar }: Props) {
  // A avançada já paga não é oferecida de novo, em lugar nenhum.
  const podeOferecerBump = !estado.advancedPaid;
  const [bump, setBump] = useState(false);

  const cobranca = estado.charge;
  const total = BASE_CENTS + (bump ? UPSELL_CENTS : 0);

  useEffect(() => {
    rastrear("checkout_viewed", { analise: estado.id, valor: BASE_CENTS / 100 });
  }, [estado.id]);

  const alternarBump = () => {
    const proximo = !bump;
    setBump(proximo);
    rastrear(proximo ? "order_bump_selected" : "order_bump_removed", {
      analise: estado.id,
      valor: UPSELL_CENTS / 100,
    });
  };

  const cobrar = () => {
    rastrear("checkout_started", {
      analise: estado.id,
      valor: total / 100,
      bump,
    });
    onCobrar(bump);
  };

  return (
    <div className="stage">
      <div className="text-center">
        <span className="eyebrow">
          <Icon3D name="brilho" size={18} />
          Leitura concluída
        </span>
        <h2 className="t-h2 mt-3">Seu relatório está pronto.</h2>
        <p className="mt-2 text-[#B7A2AA]">Falta apenas desbloquear o resultado completo.</p>
      </div>

      {/* O que está sendo comprado */}
      <div className="card mt-6">
        <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#B7A2AA] uppercase">
          Desvenda AI — Relatório completo
        </p>

        <ul className="mt-4 space-y-2.5">
          {INCLUI.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-[#F6ECEF]/90">
              <Tique />
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-5 flex items-baseline justify-between gap-4 border-t border-white/8 pt-4">
          <span className="text-[0.9375rem] text-[#B7A2AA]">Relatório</span>
          <span className="font-[family-name:var(--font-outfit)] text-[1.125rem] font-semibold">
            {brl(BASE_CENTS)}
          </span>
        </p>
      </div>

      {/* Order bump */}
      {podeOferecerBump && (
        <button
          type="button"
          className="choice choice-upsell mt-4 !items-start"
          data-on={bump}
          aria-pressed={bump}
          onClick={alternarBump}
        >
          <Tick />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="t-h3">Adicionar investigação avançada</span>
              <span className="badge-preco">+ {brl(UPSELL_CENTS)}</span>
            </span>

            <span className="t-legenda mt-1.5 block">
              {estado.advancedPreSelected
                ? "Pelo que você respondeu no começo, essa é a sua dúvida. Ela vem separada, e só se você marcar."
                : "Se você já vai analisar a conversa, pode ir além."}
            </span>

            <span className="mt-3 block space-y-1.5">
              {BUMP_INCLUI.map((item) => (
                <span
                  key={item}
                  className="flex items-start gap-2 text-[0.875rem] text-[#F6ECEF]/85"
                >
                  <Tique />
                  {item}
                </span>
              ))}
            </span>

            <span className="t-legenda mt-3 block border-t border-white/8 pt-2.5">
              A análise identifica padrões e sinais de alerta. Ela não confirma traição como fato.
            </span>
          </span>
        </button>
      )}

      {/* Total */}
      <div className="card mt-4">
        <dl className="space-y-2 text-[0.9375rem]">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[#B7A2AA]">Relatório</dt>
            <dd>{brl(BASE_CENTS)}</dd>
          </div>
          {bump && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#B7A2AA]">Investigação avançada</dt>
              <dd>+ {brl(UPSELL_CENTS)}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-4 border-t border-white/8 pt-2.5">
            <dt className="font-[family-name:var(--font-outfit)] font-semibold">Total</dt>
            <dd className="font-[family-name:var(--font-outfit)] text-[1.5rem] font-bold">
              {brl(total)}
            </dd>
          </div>
        </dl>
        <p className="t-legenda mt-2">Pagamento único. Sem assinatura.</p>
      </div>

      {erro && (
        <p
          role="alert"
          className="mt-4 rounded-2xl bg-[#FF5A5A]/12 px-4 py-3 text-[0.875rem] text-[#FFA3A3]"
        >
          {erro}
        </p>
      )}

      {/* Enquanto não há cobrança aberta, o botão é o que abre. */}
      {!cobranca && (
        <button
          type="button"
          className="btn btn-neon btn-neon-pulso btn-lg btn-block mt-5"
          onClick={cobrar}
        >
          Desbloquear meu relatório
        </button>
      )}

      {cobranca && (
        <CobrancaAberta
          cobranca={cobranca}
          rotulo="Ir para o pagamento"
          demo={estado.demo}
          analiseId={estado.id}
        />
      )}

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

/** Tique pequeno das listas. */
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

/** Caixa de seleção grande do order bump. */
function Tick() {
  return (
    <span className="tick" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 14 14" focusable="false">
        <path
          d="M2 7.5 5.5 11 12 3.5"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
