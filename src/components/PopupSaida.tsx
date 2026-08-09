"use client";

import { useEffect, useRef } from "react";
import Icon3D from "./Icon3D";
import { DESCONTO_SAIDA_CENTS, brl } from "@/lib/pricing";

type Props = {
  /** Preço real que a pessoa pagaria agora, com o que já marcou até aqui. */
  precoCents: number;
  onContinuar: () => void;
  onSair: () => void;
};

/**
 * Popup de recuperação, mostrado pelo `useExitIntent`. Sempre a mesma
 * pergunta — a pessoa já passou pelas etapas, falta o pagamento — só o preço
 * muda, e só de verdade: `DESCONTO_SAIDA_CENTS` é 0 enquanto ninguém
 * configurar um desconto real, e o card de oferta some inteiro nesse caso em
 * vez de mostrar uma promoção fictícia.
 */
export default function PopupSaida({ precoCents, onContinuar, onSair }: Props) {
  const sheet = useRef<HTMLDivElement>(null);

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

  const comDesconto =
    DESCONTO_SAIDA_CENTS > 0 ? Math.max(0, precoCents - DESCONTO_SAIDA_CENTS) : null;

  return (
    <div className="modal-veil" onClick={onSair} role="presentation">
      <div
        ref={sheet}
        className="modal-sheet text-center"
        role="dialog"
        aria-modal="true"
        aria-label="Espere, sua análise está quase pronta"
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
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>

        <Icon3D name="lupa" size={56} className="mx-auto animate-float-slow" />

        <h2 className="t-h2 mt-4">Espere. Sua análise está quase pronta.</h2>
        <p className="mx-auto mt-2 max-w-[38ch] text-[#B7A2AA]">
          Você já passou por todas as etapas. Falta pouco para descobrir o que a sua conversa
          revela.
        </p>

        {comDesconto !== null && (
          <div className="card mt-5 !p-4">
            <p className="t-legenda">Preço para concluir agora</p>
            <p className="mt-1 flex items-center justify-center gap-2.5">
              <span className="text-[0.9375rem] text-[#B7A2AA] line-through">{brl(precoCents)}</span>
              <span className="font-[family-name:var(--font-outfit)] text-[1.5rem] font-bold text-[#F6ECEF]">
                {brl(comDesconto)}
              </span>
            </p>
          </div>
        )}

        {comDesconto === null && (
          <p className="mt-4 font-[family-name:var(--font-outfit)] text-[1.25rem] font-bold text-[#F6ECEF]">
            {brl(precoCents)}
          </p>
        )}

        <button
          type="button"
          className="btn btn-neon btn-lg btn-block mt-6"
          onClick={onContinuar}
        >
          Quero concluir minha análise
        </button>

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
