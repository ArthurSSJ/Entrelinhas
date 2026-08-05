"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Icon3D from "@/components/Icon3D";
import { Trilha } from "@/components/Enfeites";
import {
  PERGUNTAS,
  lerRespostas,
  salvarRespostas,
  type Respostas,
} from "@/lib/perguntas";

/**
 * Uma pergunta por tela. Tocar já avança — sem botão "próximo", sem formulário
 * comprido. As respostas ficam no sessionStorage e seguem com o arquivo.
 */
export default function Perguntas() {
  const router = useRouter();
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Respostas>({});
  const [saindo, setSaindo] = useState<string | null>(null);

  useEffect(() => {
    setRespostas(lerRespostas());
  }, []);

  const pergunta = PERGUNTAS[indice];
  const ultima = indice === PERGUNTAS.length - 1;

  const responder = (opcaoId: string) => {
    if (saindo) return;
    setSaindo(opcaoId);

    const proximas = { ...respostas, [pergunta.id]: opcaoId };
    setRespostas(proximas);
    salvarRespostas(proximas);

    // Pausa curta para a marcação aparecer antes de trocar a tela.
    window.setTimeout(() => {
      setSaindo(null);
      if (ultima) router.push("/analise/tutorial");
      else setIndice((i) => i + 1);
    }, 260);
  };

  return (
    <div>
      <Trilha atual={indice + 1} total={PERGUNTAS.length + 2} />

      <div key={pergunta.id} className="stage">
        <h1 className="t-h2">{pergunta.titulo}</h1>
        {pergunta.ajuda && <p className="t-legenda mt-2">{pergunta.ajuda}</p>}

        <div className="mt-6 space-y-3">
          {pergunta.opcoes.map((opcao) => {
            const marcada = respostas[pergunta.id] === opcao.id || saindo === opcao.id;
            return (
              <button
                key={opcao.id}
                type="button"
                className="choice items-center"
                data-on={marcada}
                onClick={() => responder(opcao.id)}
              >
                {opcao.icon ? (
                  <Icon3D name={opcao.icon} size={38} className="flex-none" />
                ) : (
                  <span className="flex-none" style={{ width: 38 }} aria-hidden />
                )}
                <span className="flex-1 text-[1rem] leading-snug font-medium">{opcao.texto}</span>
                <span className="flex-none text-[#FF8FAB]" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 18 18" focusable="false">
                    <path
                      d="M6 3.5 11.5 9 6 14.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {indice > 0 && (
        <button
          type="button"
          onClick={() => setIndice((i) => i - 1)}
          className="mt-7 text-[0.875rem] text-[#6B6570] underline underline-offset-4"
        >
          Voltar
        </button>
      )}

      <p className="t-legenda mt-8 flex items-start gap-2.5 rounded-2xl border border-[#FFD6E0] bg-white/70 p-4">
        <Icon3D name="escudo" size={30} className="flex-none" />
        Nada disso vira cadastro. As respostas somem quando você fecha a aba.
      </p>
    </div>
  );
}
