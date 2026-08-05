import Icon3D from "./Icon3D";
import Reveal from "./Reveal";

/**
 * Objeções antes do preço. Dizer o que o produto não é dá mais confiança do que
 * jurar o que ele é — e é o que segura o pedido de reembolso depois.
 */
const pares = [
  {
    nao: "Não é um detector de mentira",
    sim: "É uma leitura dos padrões que estão escritos na conversa.",
  },
  {
    nao: "Não é um app de espionagem",
    sim: "Você envia uma conversa que é sua. Ninguém do outro lado fica sabendo.",
  },
  {
    nao: "Não é terapia",
    sim: "É material para começar uma conversa difícil com mais clareza.",
  },
  {
    nao: "Não é um gráfico com números soltos",
    sim: "É texto em português comum, sobre vocês dois, que dá para ler no ônibus.",
  },
];

export default function Objecoes() {
  return (
    <section className="band pt-0">
      <div className="shell">
        <Reveal>
          <h2 className="t-h2">Para não haver mal-entendido</h2>
        </Reveal>

        <div className="mt-7 space-y-3">
          {pares.map((par, i) => (
            <Reveal key={par.nao} delay={i * 60}>
              <div className="card card-hover !p-5">
                <p className="flex items-start gap-2.5 text-[0.9375rem] font-semibold text-[#6B6570]">
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-[#6B6570]/12"
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
                <p className="mt-2 flex items-start gap-2.5 text-[0.9375rem]">
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-[#4ADE80]/20 text-[#22A55B]"
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
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <p className="t-legenda mt-5 flex items-start gap-3 rounded-2xl border border-[#FFD6E0] bg-white/70 p-4">
            <Icon3D name="coracao" size={34} className="flex-none" />
            <span>
              A conversa é de duas pessoas. Envie só conversas das quais você participou, e use o
              que ler para falar com quem está do outro lado — não sobre.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
