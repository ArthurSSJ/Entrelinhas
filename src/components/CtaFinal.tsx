import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

/**
 * O fecho não é outro cartão de oferta: é uma frase grande no escuro, com o
 * brilho subindo do chão. A decisão já foi tomada lá em cima ou não foi.
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
          <Image
            src="/render/coracao.png"
            alt=""
            width={760}
            height={760}
            aria-hidden
            className="animate-float-slow mx-auto w-[120px] drop-shadow-[0_22px_54px_rgba(255,48,104,0.45)] md:w-[150px]"
          />

          <h2 className="titulo-luz mx-auto mt-7 max-w-[22ch] font-[family-name:var(--font-outfit)] text-[2.125rem] font-bold tracking-[-0.03em] md:text-[3.25rem]">
            Dá para continuar adivinhando. Ou dá para ler.
          </h2>

          <p className="t-apoio mx-auto mt-5 max-w-[46ch] text-[1.0625rem]">
            Dois minutos agora, ou mais uma semana montando teoria às três da manhã. As duas coisas
            custam. Só uma responde.
          </p>

          <Link
            href="/analise"
            className="btn btn-neon btn-lg btn-block mt-9 sm:mx-auto sm:w-auto sm:px-12"
          >
            Ler minha conversa
          </Link>

          <p className="mt-4 text-[0.875rem] text-[#B7A2AA]">
            Sua conversa não fica guardada. Você lê a primeira conclusão antes de pagar.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
