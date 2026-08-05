import Reveal from "./Reveal";

/**
 * Depoimentos reais.
 *
 * A lista começa vazia de propósito e a seção some da página enquanto estiver
 * assim — prova social inventada é propaganda enganosa, e num produto sobre
 * confiança seria o pior lugar possível para começar mentindo.
 *
 * Assim que tiver mensagens de gente de verdade, cole aqui com autorização:
 *
 *   { inicial: "M", nome: "Mariana, 29", texto: "…" },
 */
type Depoimento = { inicial: string; nome: string; texto: string };

const depoimentos: Depoimento[] = [];

export default function Depoimentos() {
  if (depoimentos.length === 0) return null;

  return (
    <section className="band pt-0">
      <div className="shell">
        <Reveal>
          <h2 className="t-h2">Quem já leu</h2>
        </Reveal>

        <div className="mt-7 space-y-4">
          {depoimentos.map((item, i) => (
            <Reveal key={item.nome} delay={i * 70}>
              <figure
                className={`card card-hover depoimento ${i % 2 ? "torto-dir" : "torto-esq"}`}
              >
                <blockquote className="relative text-[0.9375rem] leading-relaxed">
                  {item.texto}
                </blockquote>
                <figcaption className="relative mt-4 flex items-center gap-3">
                  <span className="inicial" aria-hidden>
                    {item.inicial}
                  </span>
                  <span className="t-legenda font-medium">{item.nome}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
