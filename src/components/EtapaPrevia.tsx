"use client";

import { useEffect } from "react";
import Icon3D, { type IconName } from "./Icon3D";
import type { AnalysisState } from "@/lib/types";
import { brl } from "@/lib/pricing";
import { rastrear } from "@/lib/analytics";

type Props = {
  estado: AnalysisState;
  onContinuar: () => void;
};

/**
 * As frentes que o relatório completo cobre.
 *
 * São rótulos de categoria, não achados: dizem o assunto de cada parte sem
 * afirmar nada sobre esta conversa. É o que permite mostrá-los sem mentir —
 * embaixo de cada um existe desfoque, não texto falso.
 */
const CATEGORIAS_TRANCADAS: { titulo: string; icon: IconName }[] = [
  { titulo: "Dinâmica emocional", icon: "coracao" },
  { titulo: "Padrões de comunicação", icon: "conversa" },
  { titulo: "Reciprocidade", icon: "escudo" },
  { titulo: "Pontos de atenção", icon: "alerta" },
  { titulo: "Recomendações personalizadas", icon: "foguete" },
  { titulo: "Análise detalhada", icon: "lupa" },
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
 * A etapa entre a leitura e o checkout: a pessoa lê de verdade dois ou três
 * trechos do que a análise encontrou antes de decidir se paga.
 *
 * Nada aqui é inventado. Os trechos vêm de `preview.previewSections`, recorte
 * de `report.sections` feito no servidor — mesmo título, mesmo texto, cortado
 * mais cedo. Se a análise não produziu nada exibível, a seção de amostras não
 * aparece em vez de a página encenar uma descoberta.
 *
 * Cada achado é apresentado pelo título que a própria análise deu a ele. Não
 * existe rótulo de categoria aqui de propósito: o relatório não classifica as
 * seções em "comunicação" ou "reciprocidade", e carimbar essas etiquetas por
 * fora seria afirmar uma leitura que ninguém fez.
 */
export default function EtapaPrevia({ estado, onContinuar }: Props) {
  const preview = estado.preview;
  const amostras = preview?.previewSections ?? [];

  // Títulos que ainda não apareceram como amostra, para não prometer mistério
  // sobre o que a pessoa já leu.
  const restantes = (preview?.sectionTitles ?? []).slice(amostras.length);

  useEffect(() => {
    rastrear("preview_viewed", {
      analise: estado.id,
      amostras: amostras.length,
      valor: estado.amountCents / 100,
    });
  }, [estado.id, estado.amountCents, amostras.length]);

  return (
    <div className="stage">
      <div className="text-center">
        <span className="eyebrow">
          <Icon3D name="lupa" size={18} />
          Sua leitura
        </span>
        <h2 className="t-h2 mt-3">Sua análise encontrou alguns pontos interessantes.</h2>
        <p className="mt-2 text-[#B7A2AA]">
          Veja uma pequena prévia do que apareceu no seu relatório.
        </p>
      </div>

      {amostras.length > 0 && (
        <div className="mt-7 space-y-4">
          {amostras.map((secao, i) => (
            <article key={`${secao.title}-${i}`} className="card">
              <p className="mb-3 flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-[#B7A2AA] uppercase">
                Achado {i + 1}
                <span className="linha-fina h-px flex-1" />
              </p>

              <div className="flex items-start gap-3">
                <Icon3D name={paraIcone(secao.icon, i)} size={44} className="flex-none" />
                <h3 className="t-h3 pt-1.5">{secao.title}</h3>
              </div>

              <p className="previa-trecho mt-3 text-[0.9375rem] leading-relaxed text-[#F6ECEF]/90">
                {secao.excerpt}
              </p>
            </article>
          ))}
        </div>
      )}

      <p className="t-apoio mt-6 text-center text-[0.9375rem]">
        Você já descobriu uma parte. O restante está no relatório.
      </p>

      {/* Área trancada */}
      <div className="mt-8">
        <p className="text-center font-[family-name:var(--font-outfit)] text-[1.0625rem] font-semibold text-[#F6ECEF]">
          Seu relatório completo contém muito mais.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {CATEGORIAS_TRANCADAS.map((categoria) => (
            <div key={categoria.titulo} className="card-trancado">
              <span className="cadeado-selo" aria-hidden>
                <Icon3D name="cadeado" size={20} />
              </span>
              <Icon3D name={categoria.icon} size={34} className="opacity-40 blur-[1.5px]" />
              <p className="mt-2 text-[0.8125rem] leading-tight font-medium text-[#F6ECEF]/85">
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
            {restantes.length === 1 ? "leitura" : "leituras"} sobre a conversa de vocês, com data e
            trecho.
          </p>
        )}
      </div>

      <button
        type="button"
        className="btn btn-neon btn-neon-pulso btn-lg btn-block mt-8"
        onClick={onContinuar}
      >
        Desbloquear meu relatório
      </button>

      <p className="mt-4 text-center font-[family-name:var(--font-outfit)] text-[1.375rem] font-bold text-[#F6ECEF]">
        {brl(estado.amountCents)}
      </p>
      <p className="t-legenda text-center">Pagamento único • Sem assinatura</p>
    </div>
  );
}

function paraIcone(nome: string | undefined, indice: number): IconName {
  if (nome && (ICONES_VALIDOS as string[]).includes(nome)) return nome as IconName;
  const rodizio: IconName[] = ["conversa", "coracao", "lupa", "celular", "presente", "foguete"];
  return rodizio[indice % rodizio.length];
}
