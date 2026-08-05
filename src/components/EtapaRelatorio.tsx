"use client";

import { useState } from "react";
import Icon3D, { type IconName } from "./Icon3D";
import Confete from "./Confete";
import type { AnalysisState } from "@/lib/types";

const iconesValidos: IconName[] = [
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

const rotuloNivel = {
  baixo: { texto: "Sem sinais de alerta", cor: "#4ADE80" },
  medio: { texto: "Alguns pontos de atenção", cor: "#FF8FAB" },
  alto: { texto: "Vale uma conversa", cor: "#FF6B6B" },
} as const;

export default function EtapaRelatorio({ estado }: { estado: AnalysisState }) {
  const relatorio = estado.report;

  // O componente só monta depois do pagamento, nunca no servidor: a data pode
  // ser calculada direto, sem risco de divergir da hidratação.
  const [data] = useState(() =>
    new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
  );

  if (!relatorio) return null;

  return (
    <div className="stage imprimivel">
      <Confete />

      <p className="so-impressao mb-6 border-b border-black/15 pb-2 text-[9pt] tracking-wide uppercase">
        Entrelinhas · relatório de {data}
      </p>

      <div className="text-center">
        <Icon3D name="coracao" size={84} className="mx-auto animate-float-slow" />
        <span className="eyebrow mt-4">
          <Icon3D name="brilho" size={18} />
          {relatorio.patternCount} padrões encontrados
        </span>
        <h2 className="t-h2 mt-3">{relatorio.headline}</h2>
        {relatorio.summary && (
          <p className="mx-auto mt-3 max-w-[46ch] text-[#6B6570]">{relatorio.summary}</p>
        )}
      </div>

      <div className="mt-7 space-y-4">
        {relatorio.sections.map((secao, i) => (
          <article key={`${secao.title}-${i}`} className="card card-hover">
            <div className="flex items-start gap-3">
              <Icon3D name={paraIcone(secao.icon, i)} size={46} className="flex-none" />
              <h3 className="t-h3 pt-1.5">{secao.title}</h3>
            </div>
            <div className="report-body mt-3">
              {secao.body.split(/\n{2,}/).map((par, j) => (
                <p key={j}>{par}</p>
              ))}
            </div>
          </article>
        ))}

        {relatorio.advanced && (
          <article
            className="card card-hover"
            style={{
              borderColor: `${rotuloNivel[relatorio.advanced.level].cor}55`,
              background: "linear-gradient(135deg, #fff 0%, rgba(255,107,107,0.05) 100%)",
            }}
          >
            <div className="flex items-start gap-3">
              <Icon3D name="alerta" size={46} className="flex-none" />
              <div className="pt-0.5">
                <h3 className="t-h3">{relatorio.advanced.title}</h3>
                <span
                  className="nivel-risco mt-1 inline-block rounded-full px-3 py-1 text-[0.8125rem] font-medium text-white"
                  style={{ background: rotuloNivel[relatorio.advanced.level].cor }}
                >
                  {rotuloNivel[relatorio.advanced.level].texto}
                </span>
              </div>
            </div>
            <div className="report-body mt-3">
              {relatorio.advanced.body.split(/\n{2,}/).map((par, j) => (
                <p key={j}>{par}</p>
              ))}
            </div>
          </article>
        )}
      </div>

      {relatorio.acoes && relatorio.acoes.length > 0 && (
        <section
          className="card mt-4"
          style={{
            borderColor: "rgba(167,139,250,0.35)",
            background: "linear-gradient(135deg, #fff 0%, rgba(167,139,250,0.07) 100%)",
          }}
        >
          <div className="flex items-start gap-3">
            <Icon3D name="foguete" size={46} className="flex-none" />
            <div className="pt-1">
              <h3 className="t-h3">O que dá para fazer esta semana</h3>
              <p className="t-legenda mt-0.5">Pequeno e possível. Não precisa fazer os três.</p>
            </div>
          </div>

          <ol className="mt-4 space-y-3">
            {relatorio.acoes.map((acao, i) => (
              <li key={`${acao.titulo}-${i}`} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="grid h-6 w-6 flex-none place-items-center rounded-full bg-[#A78BFA]/15 font-[family-name:var(--font-outfit)] text-[0.8125rem] font-bold text-[#6B4FD8]"
                >
                  {i + 1}
                </span>
                <p className="text-[0.9375rem] leading-snug">
                  {acao.titulo && <strong className="font-semibold">{acao.titulo}. </strong>}
                  <span className="text-[#6B6570]">{acao.texto}</span>
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="so-impressao mt-8 border-t border-black/15 pt-3 text-[9pt] text-[#444]">
        Uma leitura dos padrões desta conversa. Não é diagnóstico e não substitui acompanhamento
        profissional. A conversa enviada já foi apagada.
      </p>

      <div className="card nao-imprimir mt-6 text-center">
        <Icon3D name="cadeado" size={40} className="mx-auto" />
        <p className="t-legenda mt-2">
          A conversa que você enviou já foi apagada. Este relatório fica aberto por duas horas —
          salve agora se quiser guardar.
        </p>
        <button type="button" className="btn btn-quiet btn-block mt-4" onClick={() => window.print()}>
          Salvar em PDF
        </button>
        <p className="t-legenda mt-2">
          Abre a impressão do seu celular. Escolha “Salvar como PDF” e o arquivo fica com você.
        </p>
      </div>

      <a href="/analise" className="btn btn-primary btn-block nao-imprimir mt-4">
        Analisar outra conversa
      </a>
    </div>
  );
}

function paraIcone(nome: string | undefined, indice: number): IconName {
  if (nome && (iconesValidos as string[]).includes(nome)) return nome as IconName;
  const rodizio: IconName[] = ["conversa", "coracao", "lupa", "celular", "presente", "foguete"];
  return rodizio[indice % rodizio.length];
}
