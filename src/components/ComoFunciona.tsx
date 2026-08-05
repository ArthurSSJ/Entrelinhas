import Icon3D, { type IconName } from "./Icon3D";
import Reveal from "./Reveal";

const passos: { icon: IconName; titulo: string; texto: string }[] = [
  {
    icon: "celular",
    titulo: "Exporte a conversa",
    texto: "Quatro toques dentro do WhatsApp. A gente mostra cada um deles na tela seguinte.",
  },
  {
    icon: "nuvem",
    titulo: "Responda e envie",
    texto: "Quatro perguntas rápidas sobre a relação e o arquivo .txt. Sem cadastro, sem senha.",
  },
  {
    icon: "presente",
    titulo: "Leia o que apareceu",
    texto: "Em menos de dois minutos o relatório fica pronto. Você paga só para abrir.",
  },
];

/**
 * Três passos numa linha do tempo vertical, não em três cartões lado a lado:
 * a ordem importa aqui, e coluna só empilha, não encadeia. O fio pontilhado
 * liga um passo ao outro; no celular ele continua ligando, mais curto.
 */
export default function ComoFunciona() {
  return (
    <section id="como" className="faixa relative overflow-hidden">
      <div className="shell-l relative grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <h2 className="t-secao">Como funciona</h2>
            <p className="t-apoio mt-4 max-w-[38ch]">
              Do começo ao relatório aberto: menos tempo do que uma ida ao mercado.
            </p>
          </div>
        </Reveal>

        <ol className="relative">
          {/* O fio que amarra os três passos. */}
          <span
            aria-hidden
            className="fio-vertical absolute top-6 bottom-14 left-[27px] w-0.5 md:left-[31px]"
          />

          {passos.map((passo, i) => (
            <Reveal
              as="li"
              key={passo.titulo}
              delay={i * 90}
              className="relative flex gap-5 pb-10 last:pb-0 md:gap-7"
            >
              <span className="relative z-10 flex h-14 w-14 flex-none items-center justify-center rounded-full border border-[#FF3068]/40 bg-[#14060A] md:h-16 md:w-16">
                <span className="marca-passo text-[1.75rem] md:text-[2rem]" aria-hidden>
                  {i + 1}
                </span>
              </span>

              <div className="painel painel-hover flex flex-1 items-start gap-4 p-5 md:p-6">
                <Icon3D name={passo.icon} size={54} className="flex-none" />
                <div>
                  <h3 className="font-[family-name:var(--font-outfit)] text-[1.125rem] font-semibold text-[#F6ECEF]">
                    {passo.titulo}
                  </h3>
                  <p className="t-apoio mt-1.5 text-[0.9375rem]">{passo.texto}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
