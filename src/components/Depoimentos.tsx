import Reveal from "./Reveal";

/**
 * Depoimentos reais.
 *
 * A lista começa vazia de propósito e a seção some da página enquanto estiver
 * assim. Prova social inventada é propaganda enganosa, e num produto sobre
 * confiança seria o pior lugar possível para começar mentindo.
 *
 * Assim que tiver mensagens de gente de verdade, cole aqui com autorização:
 *
 *   { inicial: "M", nome: "Mariana, 29", texto: "…" },
 *
 * Cada texto cabe em três linhas. Depoimento de página é um trecho, não a
 * mensagem inteira que a pessoa mandou.
 */
type Depoimento = { inicial: string; nome: string; texto: string };

const depoimentos: Depoimento[] = [];

export default function Depoimentos() {
  if (depoimentos.length === 0) return null;

  return (
    <section className="faixa faixa-colada">
      <div className="shell-l">
        <Reveal>
          <h2 className="t-secao">Quem já leu</h2>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {depoimentos.map((item, i) => (
            <Reveal key={item.nome} delay={i * 70}>
              <figure className="painel painel-hover h-full p-6">
                <blockquote className="text-[0.9375rem] leading-relaxed text-[#F6ECEF]/90">
                  {item.texto}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#E01048] font-[family-name:var(--font-outfit)] text-[0.9375rem] font-bold text-white"
                  >
                    {item.inicial}
                  </span>
                  <span className="text-[0.875rem] font-medium text-[#B7A2AA]">{item.nome}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
