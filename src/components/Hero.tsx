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
            <span className="inline-flex items-center gap-2 text-sm md:text-base font-semibold tracking-wide text-[#FF8FB3]">
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

      {/* Frame do WhatsApp simulando o print de tela */}
      <figure className="relative z-10 -mt-[22%] overflow-hidden rounded-[26px] border border-white/15 bg-[#0b141a] shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(255,48,104,0.18)] transition-all duration-300 hover:shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(255,48,104,0.28)]">
        {/* Top Header do WhatsApp */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#202c33] px-4 py-3 text-[#e9edef]">
          <div className="flex items-center gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#8696a0]"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#ff3068] to-[#ff8fb3] text-sm font-bold text-white shadow-md">
              ❤️
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#202c33] bg-[#00a884]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[0.9375rem] font-semibold leading-tight text-[#e9edef]">
                Amor ❤️
              </span>
              <span className="text-[0.72rem] text-[#8696a0]">online</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#8696a0]">
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </div>
        </div>

        {/* Wallpaper do WhatsApp com Doodles */}
        <div className="whatsapp-wallpaper relative p-4 md:p-5">
          {/* Badge de Data no Chat */}
          <div className="mb-3.5 flex justify-center">
            <span className="rounded-md bg-[#182229] px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-wider text-[#8696a0] shadow-sm">
              Ontem
            </span>
          </div>

          <Balao lado="dir" hora="23:47" lida variant="whatsapp" className="fio-msg">
            Saudade de você ❤️
          </Balao>

          <span className="fio-liga fio-achado my-2.5 block" aria-hidden />

          <p className="fio-achado relative z-10 flex items-center gap-3 rounded-[18px] border border-[#FF3068]/45 bg-[#17060b]/92 px-3.5 py-3 shadow-[0_8px_25px_rgba(255,48,104,0.28)] backdrop-blur-md">
            <Icon3D name="lupa" size={32} className="flex-none" />
            <span className="font-[family-name:var(--font-outfit)] text-[0.875rem] leading-snug font-semibold text-[#FF8FB3]">
              Você demonstrou mais emoção do que recebeu de volta.
              <span className="font-medium text-[#F6ECEF]/80"> A 6ª vez só nos últimos 30 dias.</span>
            </span>
          </p>

          <span className="fio-liga fio-achado my-2.5 block" aria-hidden />

          <Balao
            lado="esq"
            hora="08:12"
            variant="whatsapp"
            className="fio-msg"
            style={{ animationDelay: "0.45s" }}
          >
            Também
          </Balao>
        </div>

        {/* Rodapé do WhatsApp (Barra de Entrada de Mensagem) */}
        <div className="flex items-center gap-2 border-t border-white/5 bg-[#111b21] px-3 py-2.5 text-[#8696a0]">
          <div className="flex flex-1 items-center justify-between rounded-full bg-[#202c33] px-3.5 py-2 text-sm">
            <div className="flex items-center gap-2.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <span className="text-[0.875rem] text-[#8696a0]">Mensagem</span>
            </div>
            <div className="flex items-center gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </div>
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#00a884] text-white shadow-md">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
        </div>
      </figure>
    </div>
  );
}
