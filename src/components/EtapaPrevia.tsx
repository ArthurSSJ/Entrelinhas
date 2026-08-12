"use client";

import { useEffect } from "react";
import Icon3D, { type IconName } from "./Icon3D";
import type { AnalysisState } from "@/lib/types";
import { brl } from "@/lib/pricing";
import { trackPreviewViewed } from "@/lib/analytics";

type Props = {
  estado: AnalysisState;
  onContinuar: () => void;
};

/**
 * Perguntas emocionais sobre o relacionamento que despertam curiosidade real.
 * Substituem termos técnicos de software por dúvidas autênticas de quem lê.
 */
const CATEGORIAS_TRANCADAS: { titulo: string; icon: IconName }[] = [
  { titulo: "Quem está se esforçando mais?", icon: "coracao" },
  { titulo: "O que mudou entre vocês?", icon: "conversa" },
  { titulo: "Onde vocês estão se afastando?", icon: "lupa" },
  { titulo: "O que vocês estão evitando?", icon: "alerta" },
  { titulo: "Quais sinais merecem atenção?", icon: "escudo" },
  { titulo: "O que fazer com essas descobertas?", icon: "foguete" },
];

const ICONES_VALIDOS: IconName[] = [
  "coracao",
  "conversa",
  "lupa",
  "escudo",
  "alerta",
  "celular",
  "presente",
  "pix",
  "nuvem",
  "brilho",
  "foguete",
  "cadeado",
];

/**
 * A prévia da análise antes do checkout.
 *
 * Apresenta 3 pequenas descobertas reais retiradas do relatório com "..." no final,
 * criando curiosidade sem inventar dados nem prometer falsas conclusões.
 */
export default function EtapaPrevia({ estado, onContinuar }: Props) {
  const preview = estado.preview;
  const amostras = preview?.previewSections ?? [];
  const restantes = (preview?.sectionTitles ?? []).slice(amostras.length);

  useEffect(() => {
    void trackPreviewViewed(estado.id, {
      amostras: amostras.length,
      valor: estado.amountCents / 100,
    });
  }, [estado.id, estado.amountCents, amostras.length]);

  return (
    <div className="stage">
      <div className="text-center">
        <span className="eyebrow">
          <Icon3D name="lupa" size={18} />
          Primeiros achados
        </span>
        <h2 className="t-h2 mt-3">Sua análise encontrou algo específico.</h2>
        <p className="mt-2 mx-auto max-w-[44ch] text-[0.9375rem] text-[#B7A2AA]">
          Veja uma prévia rápida das primeiras descobertas reveladas no seu histórico.
        </p>
      </div>

      {amostras.length > 0 && (
        <div className="mt-7 space-y-4">
          {amostras.map((secao, i) => (
            <article
              key={`${secao.title}-${i}`}
              className="card border border-[#FF3068]/20 bg-[#17080E]/90 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <span className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-wider text-[#FF8FB3] uppercase">
                  <Icon3D name={paraIcone(secao.icon, i)} size={20} />
                  Descoberta {i + 1}
                </span>
                <span className="text-[0.6875rem] font-medium text-[#B7A2AA] uppercase tracking-wider">
                  Revelado na conversa
                </span>
              </div>

              <h3 className="font-[family-name:var(--font-outfit)] text-[1.0625rem] font-bold text-[#F6ECEF] mt-3.5 leading-snug uppercase tracking-wide">
                {secao.title}
              </h3>

              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[#F6ECEF]/90">
                {secao.excerpt}
              </p>
            </article>
          ))}
        </div>
      )}

      {/* Área de curiosidade e seções trancadas */}
      <div className="mt-9">
        <div className="text-center">
          <h3 className="font-[family-name:var(--font-outfit)] text-[1.25rem] font-bold text-[#F6ECEF]">
            Esses foram só os primeiros sinais.
          </h3>
          <p className="mt-1 mx-auto max-w-[42ch] text-[0.875rem] text-[#B7A2AA]">
            A análise completa vai muito além dessas três descobertas.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {CATEGORIAS_TRANCADAS.map((categoria) => (
            <div key={categoria.titulo} className="card-trancado">
              <span className="cadeado-selo" aria-hidden>
                <Icon3D name="cadeado" size={20} />
              </span>
              <Icon3D name={categoria.icon} size={34} className="opacity-40 blur-[1.5px]" />
              <p className="mt-2 text-[0.8125rem] leading-tight font-semibold text-[#F6ECEF]/90">
                {categoria.titulo}
              </p>
              <span aria-hidden className="trancado-linha mt-2 block" />
              <span aria-hidden className="trancado-linha mt-1.5 block w-2/3" />
            </div>
          ))}
        </div>

        {restantes.length > 0 && (
          <p className="t-legenda mt-4 text-center">
            Incluindo mais {restantes.length}{" "}
            {restantes.length === 1 ? "revelação" : "revelações"} detalhadas sobre a conversa de vocês.
          </p>
        )}
      </div>

      <button
        type="button"
        className="btn btn-neon btn-neon-pulso btn-lg btn-block mt-8 group inline-flex items-center justify-center gap-2.5"
        onClick={onContinuar}
      >
        <span>Quero descobrir o que a análise encontrou</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:translate-x-1 flex-none"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>

      <div className="mt-5 text-center">
        <p className="font-[family-name:var(--font-outfit)] text-[1.5rem] font-extrabold text-[#F6ECEF]">
          {brl(estado.amountCents)}
        </p>
        <p className="t-legenda mt-0.5 text-[#B7A2AA]">Pagamento único • Acesso imediato</p>
      </div>
    </div>
  );
}

function paraIcone(nome: string | undefined, indice: number): IconName {
  if (nome && (ICONES_VALIDOS as string[]).includes(nome)) return nome as IconName;
  const rodizio: IconName[] = ["conversa", "coracao", "lupa", "celular", "presente", "foguete"];
  return rodizio[indice % rodizio.length];
}
