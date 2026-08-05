import Icon3D from "./Icon3D";
import Reveal from "./Reveal";
import { Manchas, Onda } from "./Enfeites";

/**
 * A seção que faz a pessoa parar de rolar. Não vende nada: repete de volta as
 * frases que ela já pensou. Quem se reconhece em três delas continua lendo.
 */
const frases = [
  "Você releu a mesma mensagem umas quatro vezes procurando o tom.",
  "Reparou que quem manda a primeira mensagem é quase sempre você.",
  "Percebeu que faz tempo que ninguém manda áudio rindo.",
  "Contou os minutos entre a sua mensagem e a resposta. Mais de uma vez.",
  "Pensou “será que sou eu que estou exagerando?” e não teve com quem falar.",
];

export default function Reconhecimento() {
  return (
    <>
      <Onda cor="#FFFFFF" />
      <section className="relative overflow-hidden bg-white pb-14 md:pb-20">
        <Manchas variante="misto" />

        <div className="shell relative">
          <Reveal>
            <h2 className="t-h2 max-w-[20ch]">Você já sabe de alguma coisa. Só não consegue nomear.</h2>
            <p className="mt-3 max-w-[46ch] text-[#6B6570]">
              A conversa de vocês está cheia de sinais pequenos, espalhados em meses de mensagens.
              Ninguém consegue enxergar isso rolando a tela para cima.
            </p>
          </Reveal>

          <ul className="mt-7 space-y-2.5">
            {frases.map((frase, i) => (
              <Reveal key={frase} delay={i * 60}>
                <li className="espelho">
                  <span className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-full bg-[#FFD6E0]">
                    <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden focusable="false">
                      <path
                        d="M2 7.5 5.5 11 12 3.5"
                        stroke="#FF6B6B"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                  <span className="text-[0.9375rem] leading-snug">{frase}</span>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120}>
            <p className="mt-7 flex items-start gap-3 rounded-2xl bg-[#FFF8F5] p-4 text-[0.9375rem]">
              <Icon3D name="lupa" size={40} className="flex-none" />
              <span>
                Um relatório lê meses de conversa de uma vez só e mostra o que se repete. É o que
                você faria se tivesse tempo e distância para isso.
              </span>
            </p>
          </Reveal>
        </div>
      </section>
      <Onda cor="#FFFFFF" virada />
    </>
  );
}
