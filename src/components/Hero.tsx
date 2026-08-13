import Image from "next/image";
import Link from "next/link";
import Balao from "./Balao";
import Icon3D from "./Icon3D";
import Reveal from "./Reveal";
import { BASE_CENTS, brl } from "@/lib/pricing";

/**
 * Duas manchetes escritas para teste.
 *
 * "a" afirma e acalma: a resposta já existe, só falta ler. "b" pergunta e
 * incomoda: e se ela sempre esteve ali? A primeira converte melhor com quem
 * chegou decidido; a segunda, com quem chegou pelo anúncio e ainda não
 * admitiu para si mesmo que está procurando alguma coisa.
 *
 * Para rodar a outra, troque VARIANTE. Nada mais na página muda.
 */
const MANCHETES = {
  a: {
    antes: "A resposta que você procura pode já estar ",
    destaque: "escrita nas mensagens",
    depois: ".",
  },
  b: {
    antes: "E se os sinais ",
    destaque: "sempre estiveram na conversa",
    depois: "… e você nunca percebeu?",
  },
} as const;

const VARIANTE: keyof typeof MANCHETES = "a";

/**
 * O topo vende a vontade de descobrir, não a tecnologia. Por isso a frase é a
 * dúvida da pessoa devolvida em voz alta, e o exemplo ao lado mostra o formato
 * do achado antes de qualquer explicação de como ele é feito.
 *
 * A divisão é assimétrica: de um lado a promessa, do outro a prova. No celular
 * a prova desce para baixo do botão, que é onde a mão está.
 */
export default function Hero() {
  const manchete = MANCHETES[VARIANTE];

  return (
    <section id="topo" className="relative overflow-hidden">
      <span aria-hidden className="brasa brasa-vinho -top-40 -left-32 h-[34rem] w-[34rem]" />
      <span
        aria-hidden
        className="brasa brasa-rosa top-24 -right-40 h-[30rem] w-[30rem]"
        style={{ animationDelay: "-9s" }}
      />

      <div className="shell-l relative grid items-center gap-14 pt-12 pb-16 md:pt-20 md:pb-24 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16">
        <div>
          <Reveal>
            <span className="selo eyebrow-forte">
              <span aria-hidden>🔒</span>
              Sua conversa é privada
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="t-manchete titulo-luz mt-6">
              {manchete.antes}
              <span className="text-[#FF8FB3]">{manchete.destaque}</span>
              {manchete.depois}
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="t-apoio mt-6 max-w-[50ch] text-[1.0625rem] md:text-[1.125rem]">
              Envie a conversa do WhatsApp e descubra padrões de comportamento, interesse,
              manipulação, distanciamento e outros sinais que podem passar despercebidos no dia a
              dia.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <Link
              href="/analise"
              className="btn btn-neon btn-neon-pulso btn-lg btn-block mt-8 [text-wrap:balance] sm:w-auto sm:px-10"
            >
              Quero descobrir o que está acontecendo
            </Link>

            <p className="mt-4 text-[0.9375rem] text-[#B7A2AA] [text-wrap:balance]">
              Análise completa por{" "}
              <span className="font-semibold text-[#F6ECEF]">{brl(BASE_CENTS)}</span> · Pagamento
              único
            </p>
          </Reveal>
        </div>

        <Reveal delay={120} dir="dir">
          <FioDeConversa />
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Assinatura visual: duas mensagens comuns e, no espaço entre elas, o que a
 * leitura enxerga.
 *
 * Os horários ficam visíveis de propósito. Quem lê faz a conta sozinho, 23:47 e
 * depois 08:12, e só então o achado confirma o que a pessoa já tinha percebido.
 * É a mesma sensação que o relatório entrega, em três segundos.
 */
function FioDeConversa() {
  return (
    <div className="relative">
      {/* Render 3D acima do cartão; o cartão sobe por cima e come o rodapé dele. */}
      <Image
        src="/render/heroi.png"
        alt=""
        width={1300}
        height={1040}
        priority
        aria-hidden
        className="animate-float-slow pointer-events-none relative z-0 ml-auto w-[94%] max-w-[500px] drop-shadow-[0_26px_64px_rgba(255,48,104,0.32)]"
      />

      <figure className="painel relative z-10 -mt-[22%] p-5 md:p-6">
        <figcaption className="mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.14em] text-[#B7A2AA] uppercase">
          Exemplo
          <span className="linha-fina h-px flex-1" />
        </figcaption>

        <Balao lado="dir" hora="23:47" lida className="fio-msg">
          Saudade de você ❤️
        </Balao>

        <span className="fio-liga fio-achado mt-3 block" aria-hidden />

        <p className="fio-achado mt-1 flex items-center gap-3 rounded-[18px] border border-[#FF3068]/35 bg-[#FF3068]/12 px-3.5 py-3">
          <Icon3D name="lupa" size={32} className="flex-none" />
          <span className="font-[family-name:var(--font-outfit)] text-[0.875rem] leading-snug font-semibold text-[#FF8FB3]">
            Você demonstrou mais emoção do que recebeu de volta..
            <span className="font-medium text-[#F6ECEF]/80"> A 14ª vez só desde março.</span>
          </span>
        </p>

        <span className="fio-liga fio-achado mt-1 block" aria-hidden />

        <Balao lado="esq" hora="08:12" className="fio-msg mt-3" style={{ animationDelay: "0.45s" }}>
          Também
        </Balao>
      </figure>
    </div>
  );
}
