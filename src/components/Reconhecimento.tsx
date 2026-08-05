import Icon3D from "./Icon3D";
import Reveal from "./Reveal";

/**
 * A seção que faz a pessoa parar de rolar. Não vende nada: repete de volta as
 * frases que ela já pensou. Quem se reconhece em três delas continua lendo.
 *
 * A quinta frase ocupa a linha inteira de propósito. É a mais difícil de
 * admitir, e sozinha ela pesa mais.
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
    <section className="faixa relative overflow-hidden">
      <span
        aria-hidden
        className="brasa brasa-vinho -top-32 right-0 h-[26rem] w-[26rem]"
        style={{ animationDelay: "-5s" }}
      />

      <div className="shell-l relative">
        <Reveal>
          <h2 className="t-secao max-w-[18ch]">
            Você já sabe de alguma coisa. Só não consegue nomear.
          </h2>
          <p className="t-apoio mt-4 max-w-[52ch]">
            A conversa de vocês está cheia de sinais pequenos, espalhados em meses de mensagens.
            Ninguém consegue enxergar isso rolando a tela para cima.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-3 md:grid-cols-2">
          {frases.map((frase, i) => (
            <Reveal
              as="li"
              key={frase}
              delay={i * 60}
              className={`bloco flex items-start gap-3.5 px-5 py-4 ${
                i === frases.length - 1 ? "md:col-span-2" : ""
              }`}
            >
              <span
                aria-hidden
                className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[#FF3068]/16"
              >
                <svg width="11" height="11" viewBox="0 0 14 14" focusable="false">
                  <path
                    d="M2 7.5 5.5 11 12 3.5"
                    stroke="#FF8FB3"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </span>
              <span className="text-[0.9375rem] leading-relaxed text-[#F6ECEF]/90">{frase}</span>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <p className="painel mt-8 flex items-start gap-4 p-5 text-[0.9375rem] leading-relaxed md:items-center">
            <Icon3D name="lupa" size={46} className="flex-none" />
            <span className="text-[#F6ECEF]/90">
              Um relatório lê meses de conversa de uma vez só e mostra o que se repete. É o que você
              faria se tivesse tempo e distância para isso.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
