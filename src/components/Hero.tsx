import Image from "next/image";
import Link from "next/link";
import Icon3D from "./Icon3D";
import Reveal from "./Reveal";
import { Sublinhado } from "./Enfeites";

/**
 * O herói fala com quem já desconfia de alguma coisa e não consegue dizer o
 * quê. Ele não promete revelação: promete nome. Por isso a frase é a dúvida da
 * pessoa devolvida em voz alta, e não uma descrição do produto.
 *
 * A divisão é assimétrica, não centralizada: de um lado a frase, do outro a
 * prova. A pessoa lê a promessa e vê o exemplo no mesmo relance.
 */
export default function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden">
      <span aria-hidden className="brasa brasa-vinho -top-40 -left-32 h-[34rem] w-[34rem]" />
      <span
        aria-hidden
        className="brasa brasa-rosa top-24 -right-40 h-[30rem] w-[30rem]"
        style={{ animationDelay: "-9s" }}
      />

      <div className="shell-l relative grid items-center gap-14 pt-12 pb-16 md:pt-20 md:pb-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <Reveal>
            <span className="selo">
              <Icon3D name="escudo" size={26} />
              Ninguém é avisado. Nada fica guardado.
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="t-display titulo-luz mt-6">
              Você já sabe.
              <br />
              Só falta <Sublinhado cor="#FF3068">nomear</Sublinhado>.
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="t-apoio mt-6 max-w-[46ch] text-[1.0625rem] md:text-[1.125rem]">
              Está tudo escrito nas entrelinhas da conversa de vocês. Em dois minutos, você lê de
              uma vez.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <Link
              href="/analise"
              className="btn btn-neon btn-neon-pulso btn-lg btn-block mt-8 sm:w-auto sm:px-10"
            >
              Ler minha conversa
            </Link>
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
 * leitura enxerga. O nome do produto está desenhado, não escrito.
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
          a gente precisa marcar aquela viagem
        </Balao>

        <span className="fio-liga fio-achado mt-3 block" aria-hidden />

        <p className="fio-achado mt-1 flex items-center gap-3 rounded-[18px] border border-[#FF3068]/35 bg-[#FF3068]/12 px-3.5 py-3">
          <Icon3D name="lupa" size={32} className="flex-none" />
          <span className="font-[family-name:var(--font-outfit)] text-[0.875rem] leading-snug font-semibold text-[#FF8FB3]">
            8 horas para responder.
            <span className="font-medium text-[#F6ECEF]/80"> A 14ª vez só desde março.</span>
          </span>
        </p>

        <span className="fio-liga fio-achado mt-1 block" aria-hidden />

        <Balao lado="esq" hora="08:12" className="fio-msg mt-3" style={{ animationDelay: "0.45s" }}>
          total, depois vejo aqui 🙂
        </Balao>
      </figure>
    </div>
  );
}

function Balao({
  lado,
  hora,
  lida,
  className = "",
  style,
  children,
}: {
  lado: "esq" | "dir";
  hora: string;
  lida?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const minha = lado === "dir";
  return (
    <span className={`flex ${minha ? "justify-end" : "justify-start"} ${className}`} style={style}>
      <span
        className={[
          "flex max-w-[86%] items-end gap-2 px-3.5 py-2.5 text-[0.9375rem] leading-snug",
          minha
            ? "rounded-[18px] rounded-br-[6px] bg-[#E01048] text-white"
            : "rounded-[18px] rounded-bl-[6px] border border-white/10 bg-white/7 text-[#F6ECEF]",
        ].join(" ")}
      >
        {children}
        <span
          className={`flex flex-none items-center gap-0.5 self-end pb-0.5 ${
            minha ? "text-white/80" : "text-[#B7A2AA]"
          }`}
        >
          <time className="fio-hora">{hora}</time>
          {lida && <Vistos />}
        </span>
      </span>
    </span>
  );
}

/** Os dois tiques de "lida". Detalhe pequeno que faz o exemplo parecer real. */
function Vistos() {
  return (
    <svg width="15" height="10" viewBox="0 0 15 10" aria-hidden focusable="false">
      <path
        d="M1 5.6 3.4 8 8.6 2M6.4 5.6 8.8 8 14 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
