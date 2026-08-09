import Oferta from "./Oferta";
import Reveal from "./Reveal";

/**
 * O fecho. Uma frase grande no escuro com o brilho subindo do chão, e logo
 * abaixo o preço — a decisão e o valor no mesmo campo de visão, para ninguém
 * ter que rolar de volta atrás do número.
 *
 * O `id="fim"` é lido pela barra flutuante, que se recolhe quando esta seção
 * entra em cena para não cobrir a própria oferta.
 */
export default function CtaFinal() {
  return (
    <section id="fim" className="relative overflow-hidden py-20 md:py-28">
      <span
        aria-hidden
        className="brasa brasa-rosa bottom-[-14rem] left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 !opacity-30"
      />
      <span
        aria-hidden
        className="brasa brasa-vinho top-[-10rem] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2"
        style={{ animationDelay: "-11s" }}
      />

      <div className="shell-l relative text-center">
        <Reveal>
          <h2 className="titulo-luz mx-auto max-w-[20ch] font-[family-name:var(--font-outfit)] text-[2.125rem] font-bold tracking-[-0.03em] md:text-[3.25rem]">
            Dá para continuar adivinhando. Ou dá para ler.
          </h2>

          <p className="t-apoio mx-auto mt-5 max-w-[46ch] text-[1.0625rem]">
            Dois minutos agora, ou mais uma semana montando teoria às três da manhã. As duas coisas
            custam. Só uma responde.
          </p>
        </Reveal>

        <Reveal delay={90}>
          <Oferta />
        </Reveal>
      </div>
    </section>
  );
}
