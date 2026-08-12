"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon3D from "@/components/Icon3D";
import ProgressoFunil from "@/components/ProgressoFunil";
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setAparelho("iphone");
      }
    }
  }, []);

  const passos = aparelho === "android" ? ANDROID : IPHONE;

  return (
    <div>
      <ProgressoFunil etapa={2} sub={0.2} />

      <h1 className="t-h2">Agora exporte a conversa</h1>
      <p className="mt-2 text-[#B7A2AA]">
        Tudo acontece dentro do seu celular. O WhatsApp não avisa ninguém que você exportou, nem
        agora nem depois.
      </p>

      {/* Seletor de aparelho */}
      <div
        className="mt-6 flex gap-1 rounded-full border border-white/10 bg-white/5 p-1"
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
              "flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 font-[family-name:var(--font-outfit)] text-[0.9375rem] font-semibold transition",
              aparelho === opcao
                ? "bg-[#E01048] text-white shadow-[0_6px_18px_rgba(255,48,104,0.4)]"
                : "text-[#B7A2AA] hover:text-white",
            ].join(" ")}
          >
            {opcao === "android" ? (
              <>
                <IconeAndroid className="w-4 h-4 flex-none" />
                <span>Android</span>
              </>
            ) : (
              <>
                <IconeApple className="w-4 h-4 flex-none -mt-0.5" />
                <span>iPhone</span>
              </>
            )}
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
              <p className="t-legenda mt-3 flex items-start gap-2 rounded-xl bg-white/6 px-3 py-2.5">
                <Icon3D name="brilho" size={20} className="mt-px flex-none" />
                {passo.dica}
              </p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-6 space-y-3">
        <p className="t-legenda flex items-start gap-2.5 rounded-2xl border border-[#FF3068]/25 bg-white/6 p-4">
          <Icon3D name="brilho" size={28} className="flex-none" />
          <span>
            <strong>Baixou como arquivo .zip?</strong> Pode enviar o .zip direto sem descompactar! Nosso site extrai a conversa automaticamente.
          </span>
        </p>

        <p className="t-legenda flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/4 p-4 text-[#B7A2AA]">
          <Icon3D name="conversa" size={28} className="flex-none" />
          <span>
            Conversa muito longa? Envie o arquivo mais recente ou o único gerado: ele contém o histórico mais importante.
          </span>
        </p>
      </div>

      <Link href="/analise/enviar" className="btn btn-primary btn-lg btn-block mt-6">
        Pronto, tenho o arquivo
      </Link>

      <Link
        href="/analise"
        className="mt-4 block text-center text-[0.875rem] text-[#B7A2AA] underline underline-offset-4"
      >
        Voltar
      </Link>
    </div>
  );
}

function IconeAndroid({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.552 0 1.0001.4482 1.0001.9993 0 .5511-.4481.9997-1.0001.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.552 0 1.0001.4482 1.0001.9993 0 .5511-.448.9997-1.0001.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.3614 13.856 8.005 12 8.005c-1.856 0-3.5902.3564-5.1368.9446L4.8409 5.4467a.416.416 0 0 0-.5676-.1521.416.416 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.1867 0 14.9644 0 19.5h24c0-4.5356-2.6889-8.3133-6.1185-10.1786" />
    </svg>
  );
}

function IconeApple({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-1 2.97 1.08.08 2.16-.57 2.81-1.37z" />
    </svg>
  );
}
