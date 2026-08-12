"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Icon3D from "@/components/Icon3D";
import ProgressoFunil from "@/components/ProgressoFunil";
import {
  PERGUNTAS,
  lerRespostas,
  salvarRespostas,
  type Respostas,
} from "@/lib/perguntas";

/**
 * A avaliação rápida do início do fluxo. Uma pergunta por tela, tocar já
 * avança — sem botão "próximo", sem campo, sem nada que pareça formulário.
 */
export default function Perguntas() {
  const router = useRouter();
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Respostas>({});
  const [saindo, setSaindo] = useState<string | null>(null);
  const [concluido, setConcluido] = useState(false);

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
      if (ultima) setConcluido(true);
      else setIndice((i) => i + 1);
    }, 260);
  };

  if (concluido) {
    return (
      <div>
        <ProgressoFunil etapa={1} sub={1} />

        <div className="stage text-center">
          <Icon3D name="lupa" size={64} className="mx-auto animate-float-slow" />

          <h1 className="t-h2 mt-5">Entendido.</h1>
          <p className="t-apoio mx-auto mt-3 max-w-[38ch] text-[1.0625rem]">
            Agora vamos comparar a sua percepção com os padrões encontrados na conversa.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-lg btn-block mt-8"
            onClick={() => router.push("/analise/tutorial")}
          >
            Continuar para minha análise
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProgressoFunil etapa={1} sub={indice / PERGUNTAS.length} />

      <div key={pergunta.id} className="stage">
        <span className="eyebrow mb-3 text-[0.75rem] font-semibold text-[#FF8FB3]">
          Pergunta {indice + 1} de {PERGUNTAS.length}
        </span>
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
                {opcao.icon && (
                  <Icon3D name={opcao.icon} size={32} className="flex-none" />
                )}
                <span className="flex-1 text-[1rem] leading-snug font-medium text-left">
                  {opcao.texto}
                </span>
                <span className="flex-none text-[#FF8FB3]" aria-hidden>
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
          className="mt-7 text-[0.875rem] text-[#B7A2AA] underline underline-offset-4"
        >
          Voltar
        </button>
      )}

      <p className="t-legenda mt-8 flex items-start gap-2.5 rounded-2xl border border-[#FF3068]/25 bg-white/6 p-4">
        <Icon3D name="escudo" size={30} className="flex-none" />
        Nada disso vira cadastro. As respostas somem quando você fecha a aba.
      </p>
    </div>
  );
}
