import Image from "next/image";
import { brl, UPSELL_CENTS } from "@/lib/pricing";

/**
 * O adicional pago, dentro da seção do que será analisado — é uma leitura a
 * mais, não uma segunda oferta. Vive no único painel com neon aceso da página
 * para ser achado sem ser confundido com o produto principal.
 *
 * Quem coloca a seção é quem chama: este arquivo entrega só o painel, sem
 * faixa e sem coluna.
 *
 * O limite do que ela faz está escrito no próprio anúncio, e não no rodapé.
 * Prometer prova de traição venderia mais hoje e voltaria como reembolso na
 * semana seguinte, porque conversa nenhuma prova isso.
 */
export default function Avancada() {
  return (
    <div className="painel painel-neon relative overflow-hidden p-6 md:p-9">
      <span aria-hidden className="brasa brasa-rosa -top-24 -right-16 h-72 w-72 !opacity-30" />

      <div className="relative grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
        <div>
          <span className="etiqueta">Adicional · {brl(UPSELL_CENTS)}</span>
          <h3 className="mt-3 font-[family-name:var(--font-outfit)] text-[1.5rem] leading-tight font-bold tracking-[-0.02em] text-[#F6ECEF] md:text-[1.875rem]">
            Se a sua dúvida já tem nome
          </h3>

          <p className="t-apoio mt-3 max-w-[58ch]">
            E o nome é outra pessoa. Essa leitura vem separada: mudanças de horário, de tom, de
            assunto e de tempo de resposta, comparadas com o começo da conversa.
          </p>

          <p className="mt-4 max-w-[58ch] text-[0.9375rem] leading-relaxed text-[#F6ECEF]/85">
            Ela não acusa e não absolve ninguém. Mostra o que mudou, quando mudou e em qual
            mensagem. Conversa não prova traição, e quem promete isso está te vendendo mentira.
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
          className="animate-float-slow mx-auto w-[140px] flex-none drop-shadow-[0_22px_54px_rgba(255,48,104,0.45)] md:w-[190px]"
        />
      </div>
    </div>
  );
}
