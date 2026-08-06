import Image from "next/image";
import Reveal from "./Reveal";
import { brl, UPSELL_CENTS } from "@/lib/pricing";

/**
 * O único bloco da página com anel de neon aceso. É um adicional pago e opcional:
 * precisa ser achado sem ser confundido com a oferta principal.
 *
 * O limite do que ela faz está escrito no próprio anúncio, e não no rodapé.
 * Prometer prova de traição venderia mais hoje e voltaria como reembolso na
 * semana seguinte, porque conversa nenhuma prova isso.
 */
export default function Avancada() {
  return (
    <section className="faixa faixa-colada">
      <div className="shell-l">
        <Reveal>
          <div className="painel painel-neon relative overflow-hidden p-6 md:p-10">
            <span
              aria-hidden
              className="brasa brasa-rosa -top-24 -right-16 h-72 w-72 !opacity-30"
            />

            <div className="relative grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
              <div>
                <span className="etiqueta">Adicional · {brl(UPSELL_CENTS)}</span>
                <h2 className="t-secao mt-3">Análise avançada de traição</h2>

                <p className="t-apoio mt-4 max-w-[58ch]">
                  Se a sua dúvida tem nome, e o nome é outra pessoa, essa leitura vem separada:
                  mudanças de horário, de tom, de assunto e de tempo de resposta, comparadas com o
                  começo da conversa.
                </p>

                <p className="mt-4 max-w-[58ch] text-[0.9375rem] leading-relaxed text-[#F6ECEF]/85">
                  Ela não acusa e não absolve ninguém. Mostra o que mudou, quando mudou e em qual
                  mensagem. O que fazer com isso continua sendo decisão sua.
                </p>

                <p className="mt-5 text-[0.9375rem] text-[#B7A2AA]">
                  Você marca na hora de enviar a conversa. Dá para seguir sem.
                </p>
              </div>

              <Image
                src="/render/alerta.png"
                alt=""
                width={760}
                height={760}
                aria-hidden
                className="animate-float-slow mx-auto w-[150px] flex-none drop-shadow-[0_22px_54px_rgba(255,48,104,0.45)] md:w-[200px]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
