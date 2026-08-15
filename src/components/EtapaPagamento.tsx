"use client";

import { useEffect, useState } from "react";
import CobrancaAberta from "./CobrancaAberta";
import FormularioCliente from "./FormularioCliente";
import Icon3D from "./Icon3D";
import type { AnalysisState } from "@/lib/types";
import type { ClienteDados } from "@/lib/cliente";
import { BASE_CENTS, UPSELL_CENTS, brl } from "@/lib/pricing";
import {
  trackCheckoutStarted,
  trackCheckoutViewed,
  trackOrderBumpSelected,
} from "@/lib/analytics";

type Props = {
  estado: AnalysisState;
  erro: string | null;
  /** A cobrança está sendo criada no servidor: botão trava, mostra progresso. */
  carregando: boolean;
  /** O PIX nativo da Cakto exige nome/e-mail/telefone/CPF antes da cobrança. */
  precisaDadosCliente: boolean;
  onClienteEnviado: (cliente: ClienteDados) => void;
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
  "Horários e frequência das conversas",
  "Mudanças no tom de escrita",
  "Distanciamento emocional",
  "Sinais de alerta",
];

/**
 * O checkout. Uma tela só, sem menu e sem link de fuga: a decisão aqui é
 * pagar ou não, e tudo que competir com isso está fora.
 *
 * A cobrança não é aberta ao entrar. Ela nasce quando a pessoa toca no botão,
 * já com a resposta do order bump — abrir um PIX antes disso cobraria um
 * valor que ela ainda não escolheu.
 */
export default function EtapaPagamento({
  estado,
  erro,
  carregando,
  precisaDadosCliente,
  onClienteEnviado,
  onCobrar,
  onRecomecar,
}: Props) {
  // A avançada já paga não é oferecida de novo, em lugar nenhum.
  const podeOferecerBump = !estado.advancedPaid;
  const [bump, setBump] = useState(false);

  const cobranca = estado.charge;
  const total = BASE_CENTS + (bump ? UPSELL_CENTS : 0);

  useEffect(() => {
    void trackCheckoutViewed("relatorio", {
      analysis_id: estado.id,
      valor: BASE_CENTS / 100,
    });
  }, [estado.id]);

  const alternarBump = () => {
    const proximo = !bump;
    setBump(proximo);
    // O SDK usa o mesmo evento para marcar e desmarcar: `selected` diz qual
    // dos dois foi, e a receita só entra quando o adicional está marcado.
    void trackOrderBumpSelected(proximo, UPSELL_CENTS / 100, {
      analysis_id: estado.id,
    });
  };

  const cobrar = () => {
    void trackCheckoutStarted(bump ? "relatorio+avancada" : "relatorio", total / 100, {
      analysis_id: estado.id,
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
          <span className="min-w-0 flex-1 text-left">
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span className="t-h3 text-[0.9375rem] font-bold tracking-tight text-[#FF8FB3] uppercase">
                ANÁLISE AVANÇADA DE INFIDELIDADE
              </span>
              <span className="badge-preco">+ {brl(UPSELL_CENTS)}</span>
            </span>

            <span className="mt-2 block font-[family-name:var(--font-outfit)] text-[1.0625rem] font-semibold text-[#F6ECEF]">
              Quer saber se existem sinais de infidelidade na conversa?
            </span>

            <span className="t-legenda mt-1.5 block text-[0.875rem] leading-relaxed text-[#B7A2AA]">
              Procura padrões como mudanças de comportamento, horários, frequência das conversas, alterações no tom, distanciamento emocional e outros sinais de alerta.
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

            <span className="t-legenda mt-3 block border-t border-white/8 pt-2.5 text-[0.8125rem] text-[#B7A2AA]">
              A análise identifica padrões e sinais de alerta, mas não pode afirmar que uma traição aconteceu.
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

      {/* A Cakto exige os dados antes de qualquer cobrança pelo PIX nativo. */}
      {!cobranca && precisaDadosCliente && <FormularioCliente onEnviar={onClienteEnviado} />}

      {/* Enquanto não há cobrança aberta (e já há o que a Cakto pede), o botão é o que abre. */}
      {!cobranca && !precisaDadosCliente && (
        <button
          type="button"
          className="btn btn-neon btn-neon-pulso btn-lg btn-block mt-5"
          onClick={cobrar}
          disabled={carregando}
          aria-busy={carregando}
        >
          {carregando ? (
            <>
              <Spinner /> Abrindo pagamento…
            </>
          ) : (
            "Desbloquear meu relatório"
          )}
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
