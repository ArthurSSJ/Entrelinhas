import Reveal from "./Reveal";

/**
 * A faixa logo abaixo do topo. Tira do herói as três travas que impedem o
 * primeiro clique e as coloca onde elas cabem: linha fina, sem cartão, sem
 * ícone. É informação de rodapé de anúncio, não seção de venda.
 */
const garantias = ["Sem cadastro", "Ninguém do outro lado é avisado", "Você vê antes de pagar"];

export default function FaixaGarantias() {
  return (
    <section className="relative">
      <span className="linha-fina absolute inset-x-0 top-0 h-px" aria-hidden />

      <div className="shell-l flex flex-col items-start gap-5 py-7 md:flex-row md:items-center md:justify-between md:gap-8">
        <Reveal>
          <p className="text-[0.9375rem] text-[#B7A2AA]">
            Sem julgamento, sem palpite, sem sermão.{" "}
            <span className="text-[#F6ECEF]">Só o que já está escrito aí.</span>
          </p>
        </Reveal>

        <Reveal delay={70}>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {garantias.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[0.9375rem] font-medium text-[#F6ECEF]"
              >
                <svg width="15" height="15" viewBox="0 0 14 14" aria-hidden focusable="false">
                  <path
                    d="M2 7.5 5.5 11 12 3.5"
                    stroke="#FF8FB3"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <span className="linha-fina absolute inset-x-0 bottom-0 h-px" aria-hidden />
    </section>
  );
}
