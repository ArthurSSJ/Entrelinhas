"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brl, BASE_CENTS } from "@/lib/pricing";

/**
 * Barra de ação que sobe no celular depois que o topo sai de cena e se recolhe
 * quando o botão final entra, para não cobrir a própria oferta.
 *
 * Dois observadores em vez de ouvir o scroll: o navegador avisa quando as duas
 * seções cruzam a viewport, sem cálculo em cada quadro rolado.
 */
export default function CtaFlutuante() {
  const [topoFora, setTopoFora] = useState(false);
  const [fimAVista, setFimAVista] = useState(false);

  useEffect(() => {
    const topo = document.getElementById("topo");
    const fim = document.getElementById("fim");
    if (!topo || !fim) return;

    const obsTopo = new IntersectionObserver(
      ([entry]) => setTopoFora(!entry.isIntersecting),
      { threshold: 0 },
    );
    const obsFim = new IntersectionObserver(([entry]) => setFimAVista(entry.isIntersecting), {
      threshold: 0,
      rootMargin: "0px 0px 120px 0px",
    });

    obsTopo.observe(topo);
    obsFim.observe(fim);

    return () => {
      obsTopo.disconnect();
      obsFim.disconnect();
    };
  }, []);

  const visivel = topoFora && !fimAVista;

  return (
    <div className="barra-fixa" data-visivel={visivel} aria-hidden={!visivel}>
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-[0.8125rem] leading-tight text-[#B7A2AA]">
          Você paga depois de ver
          <span className="block font-[family-name:var(--font-outfit)] text-[1.0625rem] font-bold text-[#F6ECEF]">
            {brl(BASE_CENTS)}
          </span>
        </p>
        <Link
          href="/analise"
          tabIndex={visivel ? undefined : -1}
          className="btn btn-neon flex-none px-5 py-3 text-[0.875rem] whitespace-nowrap"
        >
          Ler minha conversa
        </Link>
      </div>
    </div>
  );
}
