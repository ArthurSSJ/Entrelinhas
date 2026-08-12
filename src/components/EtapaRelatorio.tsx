"use client";

import Image from "next/image";
import { useState } from "react";
import Icon3D, { type IconName } from "./Icon3D";
import Confete from "./Confete";
import { MARCA } from "@/lib/marca";
import { UPSELL_CENTS, brl } from "@/lib/pricing";
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

/**
 * O nível é a única coisa da página que foge do rosa: aqui a cor carrega
 * informação, e três tons do mesmo rosa não se leem como uma escala. Todos
 * passam AA com o texto branco por cima.
 */
const rotuloNivel = {
  baixo: { texto: "Sem sinais de alerta", cor: "#1F7A45" },
  medio: { texto: "Alguns pontos de atenção", cor: "#B4671C" },
  alto: { texto: "Vale uma conversa", cor: "#C10C3E" },
} as const;

/**
 * O relatório entregue.
 *
 * A estrutura segue o que a análise realmente produz: uma visão geral, as
 * descobertas, o que fazer com elas e — para quem comprou — a investigação
 * avançada. Não existem aqui as seções "o que está funcionando" e "o que
 * merece atenção" como blocos separados: o relatório não classifica as
 * próprias seções assim, e separá-las por fora exigiria adivinhar de que lado
 * cada uma cai. O que ele diz sobre cada assunto está escrito no texto de cada
 * seção, que é onde a leitura de verdade mora.
 */
export default function EtapaRelatorio({
  estado,
  onComprarAvancada,
}: {
  estado: AnalysisState;
  onComprarAvancada?: () => void;
}) {
  const relatorio = estado.report;

  // O componente só monta depois do pagamento, nunca no servidor: a data pode
  // ser calculada direto, sem risco de divergir da hidratação.
  const [data] = useState(() =>
    new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
  );

  if (!relatorio) return null;

  const acoes = relatorio.acoes ?? [];

  return (
    <div className="stage imprimivel">
      <Confete />

      <p className="so-impressao mb-6 border-b border-black/15 pb-2 text-[9pt] tracking-wide uppercase">
        {MARCA} · relatório de {data}
      </p>

      {/* Visão geral */}
      <div className="text-center">
        <Image
          src="/render/coracao.png"
          alt=""
          width={760}
          height={760}
          aria-hidden
          className="animate-float-slow mx-auto w-[112px] drop-shadow-[0_18px_44px_rgba(255,48,104,0.42)]"
        />
        <span className="eyebrow mt-4">
          <Icon3D name="brilho" size={18} />
          {relatorio.patternCount} padrões encontrados
        </span>
        <h2 className="t-h2 mt-3">Seu diagnóstico está pronto.</h2>
        <p className="mx-auto mt-3 max-w-[46ch] font-[family-name:var(--font-outfit)] text-[1.125rem] leading-snug font-semibold text-[#F6ECEF]">
          {relatorio.headline}
        </p>
        {relatorio.summary && (
          <p className="mx-auto mt-3 max-w-[46ch] text-[#B7A2AA]">{relatorio.summary}</p>
        )}
      </div>

      {/* Principais descobertas */}
      <TituloBloco numero="01" titulo="Principais descobertas" />

      <div className="mt-4 space-y-4">
        {relatorio.sections.map((secao, i) => (
          <article key={`${secao.title}-${i}`} className="card card-hover">
            <div className="flex items-start gap-3">
              <Icon3D name={paraIcone(secao.icon, i)} size={46} className="flex-none" />
              <h3 className="t-h3 pt-1.5">{secao.title}</h3>
            </div>
            <div className="report-body mt-3">
              {secao.body.split(/\n{2,}/).map((par, j) => (
                <p key={j}>{formatarCitacoesTexto(par)}</p>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Como melhorar */}
      {acoes.length > 0 && (
        <>
          <TituloBloco numero="02" titulo="Como melhorar" />

          <section className="card painel-tinto mt-4">
            <div className="flex items-start gap-3">
              <Icon3D name="foguete" size={46} className="flex-none" />
              <div className="pt-1">
                <h3 className="t-h3">O que dá para fazer esta semana</h3>
                <p className="t-legenda mt-0.5">Pequeno e possível. Não precisa fazer os três.</p>
              </div>
            </div>

            <ol className="mt-4 space-y-3">
              {acoes.map((acao, i) => (
                <li key={`${acao.titulo}-${i}`} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="grid h-6 w-6 flex-none place-items-center rounded-full bg-[#FF3068]/18 font-[family-name:var(--font-outfit)] text-[0.8125rem] font-bold text-[#FF8FB3]"
                  >
                    {i + 1}
                  </span>
                  <p className="text-[0.9375rem] leading-snug">
                    {acao.titulo && <strong className="font-semibold">{acao.titulo}. </strong>}
                    <span className="text-[#B7A2AA]">{acao.texto}</span>
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}

      {/* Investigação avançada — só chega aqui se tiver sido paga. */}
      {relatorio.advanced && (
        <>
          <TituloBloco numero="03" titulo="Investigação Avançada" />

          <article
            className="card card-hover painel-tinto mt-4"
            style={{ borderColor: `${rotuloNivel[relatorio.advanced.level].cor}88` }}
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
            <p className="t-legenda mt-4 border-t border-white/8 pt-3">
              A análise identifica padrões e sinais de alerta. Ela não confirma traição como fato.
            </p>
          </article>
        </>
      )}

      {/* Chamada discreta para quem não comprou a avançada. */}
      {!estado.advancedPaid && onComprarAvancada && (
        <div className="bloco nao-imprimir mt-6 flex items-start gap-4 p-5">
          <Icon3D name="alerta" size={40} className="flex-none" />
          <div className="min-w-0">
            <h3 className="font-[family-name:var(--font-outfit)] text-[1rem] font-semibold text-[#F6ECEF]">
              Quer investigar padrões adicionais?
            </h3>
            <p className="t-legenda mt-1">
              Mudanças de comportamento, inconsistências e sinais de alerta, numa leitura
              separada.
            </p>
            <button
              type="button"
              onClick={onComprarAvancada}
              className="btn btn-quiet mt-3 px-5 py-2.5 text-[0.875rem]"
            >
              Adicionar Investigação Avançada por {brl(UPSELL_CENTS)}
            </button>
          </div>
        </div>
      )}

      <p className="so-impressao mt-8 border-t border-black/15 pt-3 text-[9pt] text-[#444]">
        Uma leitura dos padrões desta conversa. Não é diagnóstico e não substitui acompanhamento
        profissional. A conversa enviada já foi apagada.
      </p>

      <div className="card nao-imprimir mt-6 text-center">
        <Icon3D name="cadeado" size={40} className="mx-auto" />
        <p className="t-legenda mt-2">
          A conversa que você enviou já foi apagada. Este relatório fica aberto por duas horas:
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

/** Separador de bloco: numera as partes do relatório sem virar índice. */
function TituloBloco({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <div className="mt-9 flex items-center gap-3">
      <span className="marca-passo !text-[1.5rem]" aria-hidden>
        {numero}
      </span>
      <h3 className="font-[family-name:var(--font-outfit)] text-[1.25rem] font-bold tracking-[-0.02em] text-[#F6ECEF]">
        {titulo}
      </h3>
      <span className="linha-fina h-px flex-1" />
    </div>
  );
}

function paraIcone(nome: string | undefined, indice: number): IconName {
  if (nome && (iconesValidos as string[]).includes(nome)) return nome as IconName;
  const rodizio: IconName[] = ["conversa", "coracao", "lupa", "celular", "presente", "foguete"];
  return rodizio[indice % rodizio.length];
}

/**
 * Destaca visualmente trechos entre aspas no corpo do relatório,
 * transformando falas reais da conversa em pílulas de citação com estética premium.
 */
function formatarCitacoesTexto(texto: string) {
  const regex = /("([^"]+)"|“([^”]+)”)/g;
  const partes = [];
  let ultimoIndice = 0;
  let match;

  while ((match = regex.exec(texto)) !== null) {
    if (match.index > ultimoIndice) {
      partes.push(texto.slice(ultimoIndice, match.index));
    }

    const citacao = match[2] || match[3] || match[0].replace(/["“”]/g, "");

    partes.push(
      <span
        key={match.index}
        className="mx-1 inline-flex items-center gap-1 rounded-md border border-[#FF3068]/35 bg-[#FF3068]/12 px-2 py-0.5 font-medium italic text-[#FF8FB3]"
      >
        <span className="not-italic opacity-70 text-[0.75rem]">“</span>
        <span>{citacao}</span>
        <span className="not-italic opacity-70 text-[0.75rem]">”</span>
      </span>,
    );

    ultimoIndice = regex.lastIndex;
  }

  if (ultimoIndice < texto.length) {
    partes.push(texto.slice(ultimoIndice));
  }

  return partes.length > 0 ? partes : texto;
}
