import Icon3D from "./Icon3D";
import Reveal from "./Reveal";

/**
 * Objeções antes do preço. Dizer o que o produto não é dá mais confiança do que
 * jurar o que ele é, e é o que segura o pedido de reembolso depois.
 *
 * Cada linha coloca o mito e a correção lado a lado, num painel só: o olho
 * compara na horizontal em vez de ler oito frases soltas.
 */
const pares = [
  {
    nao: "Não é detector de mentira",
    sim: "É a leitura dos padrões que já estão escritos na conversa.",
  },
  {
    nao: "Não é app de espionagem",
    sim: "Você envia uma conversa que é sua. Ninguém do outro lado descobre, hoje nem depois.",
  },
  {
    nao: "Não é terapia",
    sim: "É o material para começar a conversa difícil já sabendo o que dizer.",
  },
  {
    nao: "Não é gráfico com números soltos",
    sim: "É texto sobre vocês dois, que dá para ler inteiro numa viagem de ônibus.",
  },
];

export default function Objecoes() {
  return (
    <section className="faixa faixa-colada">
      <div className="shell-l">
        <Reveal>
          <h2 className="t-secao">O que você não vai receber</h2>
        </Reveal>

        <Reveal delay={70}>
          <ul className="painel mt-8 divide-y divide-white/8 overflow-hidden">
            {pares.map((par) => (
              <li
                key={par.nao}
                className="grid gap-3 px-5 py-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center md:gap-8 md:px-8 md:py-6"
              >
                <p className="flex items-start gap-3 text-[0.9375rem] font-semibold text-[#B7A2AA] md:items-center">
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-white/8 md:mt-0"
                  >
                    <svg width="9" height="9" viewBox="0 0 10 10" focusable="false">
                      <path
                        d="M1 1l8 8M9 1L1 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  {par.nao}
                </p>

                <p className="flex items-start gap-3 text-[0.9375rem] text-[#F6ECEF] md:items-center">
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-[#FF3068]/18 text-[#FF8FB3] md:mt-0"
                  >
                    <svg width="11" height="11" viewBox="0 0 14 14" focusable="false">
                      <path
                        d="M2 7.5 5.5 11 12 3.5"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                  {par.sim}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={110}>
          <p className="mt-6 flex max-w-[72ch] items-start gap-4 text-[0.9375rem] leading-relaxed text-[#B7A2AA]">
            <Icon3D name="coracao" size={38} className="flex-none" />
            <span>
              A conversa é de duas pessoas. Envie só conversa da qual você participou, e use o que
              ler para falar com quem está do outro lado, não pelas costas dele.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
