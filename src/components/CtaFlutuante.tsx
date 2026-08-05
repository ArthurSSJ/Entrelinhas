"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brl, BASE_CENTS } from "@/lib/pricing";

/**
 * Barra de ação que sobe no celular depois que a pessoa passa do topo e se
 * recolhe quando o botão final entra em cena — para não cobrir a própria oferta.
 */
export default function CtaFlutuante() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoRolar = () => {
      const fim = document.documentElement.scrollHeight - window.innerHeight - 520;
      setVisivel(window.scrollY > 620 && window.scrollY < fim);
    };

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <div className="barra-fixa" data-visivel={visivel} aria-hidden={!visivel}>
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-[0.8125rem] leading-tight text-[#6B6570]">
          Análise completa
          <span className="block font-[family-name:var(--font-outfit)] text-[1.0625rem] font-bold text-[#2D2A32]">
            {brl(BASE_CENTS)}
          </span>
        </p>
        <Link
          href="/analise"
          tabIndex={visivel ? undefined : -1}
          className="btn btn-primary flex-none px-6 py-3 text-[0.9375rem]"
        >
          Iniciar
        </Link>
      </div>
    </div>
  );
}
