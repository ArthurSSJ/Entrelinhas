"use client";

import { useEffect, useRef, useState } from "react";
import Icon3D from "./Icon3D";
import type { AnalysisState } from "@/lib/types";
import { BASE_CENTS, PACOTE_CENTS, UPSELL_CENTS, brl } from "@/lib/pricing";
import { trackExitIntentConverted, trackExitIntentShown } from "@/lib/analytics";

type Props = {
  estado: AnalysisState;
  /**
   * A tela atual já mostrou algum resultado. Sem isso o pacote não é
   * oferecido: vender antes do primeiro achado é vender no escuro.
   */
  podeOferecerPacote: boolean;
  /** Seguir para o pagamento normal, sem oferta nenhuma. */
  onContinuar: () => void;
  /** Aceitar o pacote da oferta de recuperação. */
  onAproveitarOferta: () => void;
  onSair: () => void;
  /** Avisa que a oferta apareceu, para ela não voltar nesta análise. */
  onMostrada: () => void;
};

/**
 * O popup de recuperação, mostrado pelo `useExitIntent`.
 *
 * Duas versões da mesma tela, e a diferença é só comercial:
 *
 *  - padrão: lembra o que falta e mostra o preço que já estava lá;
 *  - variante de teste: oferece relatório + investigação avançada pelo preço
 *    do relatório sozinho.
 *
 * A variante é ligada por NEXT_PUBLIC_OFERTA_RECUPERACAO. Desligada, some
 * inteira — não vira "oferta especial" com o preço de sempre. E ela não
 * aparece para quem já comprou, para quem já tem a avançada, nem para quem já
 * a viu nesta análise.
 *
 * Sem contador, sem "restam X vagas", sem promessa de que o preço sobe depois:
 * a condição é real ou não existe.
 */
export default function PopupSaida({
  estado,
  podeOferecerPacote,
  onContinuar,
  onAproveitarOferta,
  onSair,
  onMostrada,
}: Props) {
  const sheet = useRef<HTMLDivElement>(null);

  /**
   * Decidido uma vez, na abertura, e congelado.
   *
   * Avisar que a oferta apareceu marca `recuperacaoOffered` no estado — e se
   * esta conta fosse refeita a cada render, o próprio aviso derrubaria a
   * oferta para a versão sem desconto com o popup ainda aberto na tela.
   */
  const [comOferta] = useState(
    () =>
      Boolean(estado.ofertaRecuperacao) &&
      podeOferecerPacote &&
      estado.status === "ready" &&
      !estado.advancedPaid &&
      !estado.funil?.recuperacaoOffered,
  );

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSair();
    };
    document.addEventListener("keydown", aoTeclar);

    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheet.current?.focus();

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = anterior;
    };
  }, [onSair]);

  useEffect(() => {
    // A variante vai no evento para as duas serem comparáveis no painel:
    // visualização, clique e receita de cada uma, lado a lado.
    void trackExitIntentShown("relatorio", {
      analysis_id: estado.id,
      variante: comOferta ? "pacote" : "padrao",
      valor: (comOferta ? PACOTE_CENTS : estado.amountCents) / 100,
    });
    if (comOferta) onMostrada();
    // Uma vez por montagem: o popup já aparece no máximo uma vez por etapa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aproveitar = () => {
    void trackExitIntentConverted("pacote", {
      analysis_id: estado.id,
      valor: PACOTE_CENTS / 100,
    });
    onAproveitarOferta();
  };

  const continuar = () => {
    void trackExitIntentConverted("padrao", {
      analysis_id: estado.id,
      valor: estado.amountCents / 100,
    });
    onContinuar();
  };

  return (
    <div className="modal-veil" onClick={onSair} role="presentation">
      <div
        ref={sheet}
        className="modal-sheet text-center"
        role="dialog"
        aria-modal="true"
        aria-label={comOferta ? "Uma condição para concluir" : "Sua análise está quase pronta"}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onSair}
          aria-label="Fechar"
          className="ml-auto grid h-9 w-9 flex-none place-items-center rounded-full bg-white/8 text-[#B7A2AA] transition hover:bg-white/16 hover:text-[#F6ECEF]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden focusable="false">
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <Icon3D name={comOferta ? "presente" : "lupa"} size={56} className="mx-auto animate-float-slow" />

        {comOferta ? (
          <>
            <h2 className="t-h2 mt-4">Talvez você só precisasse de um motivo para concluir.</h2>
            <p className="mx-auto mt-2 max-w-[38ch] text-[#B7A2AA]">
              Leve o relatório completo + Investigação Avançada pelo mesmo valor do relatório.
            </p>

            <div className="card mt-5 !p-4">
              <p className="t-legenda">Relatório + Investigação Avançada</p>
              <p className="mt-1 flex items-center justify-center gap-2.5">
                <span className="text-[0.9375rem] text-[#B7A2AA] line-through">
                  {brl(BASE_CENTS + UPSELL_CENTS)}
                </span>
                <span className="font-[family-name:var(--font-outfit)] text-[1.75rem] font-bold text-[#F6ECEF]">
                  {brl(PACOTE_CENTS)}
                </span>
              </p>
            </div>

            <button type="button" className="btn btn-neon btn-lg btn-block mt-6" onClick={aproveitar}>
              Quero aproveitar essa condição
            </button>
            <p className="t-legenda mt-2">Pagamento único.</p>
          </>
        ) : (
          <>
            <h2 className="t-h2 mt-4">Espere. Sua análise está quase pronta.</h2>
            <p className="mx-auto mt-2 max-w-[38ch] text-[#B7A2AA]">
              Você já passou por todas as etapas. Falta pouco para descobrir o que a sua conversa
              revela.
            </p>

            <p className="mt-4 font-[family-name:var(--font-outfit)] text-[1.25rem] font-bold text-[#F6ECEF]">
              {brl(estado.amountCents)}
            </p>
            <p className="t-legenda">Pagamento único • Sem assinatura</p>

            <button type="button" className="btn btn-neon btn-lg btn-block mt-6" onClick={continuar}>
              Quero concluir minha análise
            </button>
          </>
        )}

        <button
          type="button"
          className="mt-3 w-full text-center text-[0.875rem] text-[#B7A2AA] underline underline-offset-4"
          onClick={onSair}
        >
          Continuar sem análise
        </button>
      </div>
    </div>
  );
}
