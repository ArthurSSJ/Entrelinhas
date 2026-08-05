"use client";

import Link from "next/link";
import { useState } from "react";
import Icon3D from "@/components/Icon3D";
import { Trilha } from "@/components/Enfeites";
import TelaMock, { type Cena } from "./TelaMock";

type Passo = { titulo: string; texto: string; cena: Cena; dica?: string };

const ANDROID: Passo[] = [
  {
    titulo: "Abra a conversa e toque nos três pontinhos",
    texto: "Eles ficam no canto superior direito, ao lado do nome da pessoa.",
    cena: "chat-android",
  },
  {
    titulo: "Toque em Mais",
    texto: "É o último item do menu que abriu.",
    cena: "menu-android",
  },
  {
    titulo: "Toque em Exportar conversa",
    texto: "Fica logo abaixo de “Limpar conversa”.",
    cena: "exportar",
  },
  {
    titulo: "Escolha SEM MÍDIA",
    texto:
      "Essa parte importa. Com mídia, o arquivo fica gigante e a leitura não usa foto nem áudio.",
    cena: "midia",
    dica: "Se aparecer aviso de conversa grande, pode seguir mesmo assim.",
  },
  {
    titulo: "Salve o arquivo .txt",
    texto:
      "Escolha “Salvar em Arquivos”, ou mande a conversa para você mesmo em qualquer app. Depois é só voltar aqui.",
    cena: "salvar",
  },
];

const IPHONE: Passo[] = [
  {
    titulo: "Abra a conversa e toque no nome lá em cima",
    texto: "Toque no nome ou na foto da pessoa, no topo da tela.",
    cena: "chat-iphone",
  },
  {
    titulo: "Role até o fim e toque em Exportar conversa",
    texto: "É um dos últimos itens, junto com “Bloquear” e “Limpar conversa”.",
    cena: "exportar",
  },
  {
    titulo: "Escolha Sem mídia",
    texto:
      "Essa parte importa. Com mídia, o arquivo fica gigante e a leitura não usa foto nem áudio.",
    cena: "midia",
  },
  {
    titulo: "Salve em Arquivos",
    texto:
      "Na tela de compartilhar, escolha “Salvar em Arquivos”. Depois é só voltar aqui e escolher esse arquivo.",
    cena: "salvar",
    dica: "Também dá para mandar para você mesmo por e-mail e baixar depois.",
  },
];

export default function Tutorial() {
  const [aparelho, setAparelho] = useState<"android" | "iphone">("android");
  const passos = aparelho === "android" ? ANDROID : IPHONE;

  return (
    <div>
      <Trilha atual={5} total={6} />

      <h1 className="t-h2">Agora exporte a conversa</h1>
      <p className="mt-2 text-[#6B6570]">
        Isso acontece dentro do WhatsApp, no seu celular. Ninguém do outro lado é avisado.
      </p>

      {/* Seletor de aparelho */}
      <div
        className="mt-6 flex gap-1 rounded-full border border-black/6 bg-white p-1"
        role="tablist"
        aria-label="Escolha o aparelho"
      >
        {(["android", "iphone"] as const).map((opcao) => (
          <button
            key={opcao}
            type="button"
            role="tab"
            aria-selected={aparelho === opcao}
            onClick={() => setAparelho(opcao)}
            className={[
              "flex-1 rounded-full py-2.5 font-[family-name:var(--font-outfit)] text-[0.9375rem] font-semibold transition",
              aparelho === opcao
                ? "bg-gradient-to-r from-[#FF8FAB] to-[#FF6B6B] text-white shadow-[0_6px_16px_rgba(255,143,171,0.35)]"
                : "text-[#6B6570]",
            ].join(" ")}
          >
            {opcao === "android" ? "Android" : "iPhone"}
          </button>
        ))}
      </div>

      <ol key={aparelho} className="stage mt-6 space-y-5">
        {passos.map((passo, i) => (
          <li key={passo.titulo} className="card !p-5">
            <div className="flex items-start gap-3">
              <span className="numero-passo !text-[2.25rem]" aria-hidden>
                {i + 1}
              </span>
              <div className="min-w-0">
                <h2 className="t-h3">{passo.titulo}</h2>
                <p className="t-legenda mt-1">{passo.texto}</p>
              </div>
            </div>

            <TelaMock cena={passo.cena} />

            {passo.dica && (
              <p className="t-legenda mt-3 flex items-start gap-2 rounded-xl bg-[#FFF8F5] px-3 py-2.5">
                <Icon3D name="brilho" size={20} className="mt-px flex-none" />
                {passo.dica}
              </p>
            )}
          </li>
        ))}
      </ol>

      <p className="t-legenda mt-6 flex items-start gap-2.5 rounded-2xl border border-[#FFD6E0] bg-white/70 p-4">
        <Icon3D name="conversa" size={30} className="flex-none" />
        Conversa muito longa? O WhatsApp pode dividir em mais de um arquivo. Envie o mais recente —
        ele já conta bastante.
      </p>

      <Link href="/analise/enviar" className="btn btn-primary btn-lg btn-block mt-6">
        Pronto, tenho o arquivo
      </Link>

      <Link
        href="/analise"
        className="mt-4 block text-center text-[0.875rem] text-[#6B6570] underline underline-offset-4"
      >
        Voltar
      </Link>
    </div>
  );
}
