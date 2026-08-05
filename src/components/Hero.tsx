import Link from "next/link";
import Icon3D from "./Icon3D";
import Reveal from "./Reveal";
import { Sublinhado } from "./Enfeites";

/**
 * O herói é a tese do produto: entre duas mensagens comuns existe uma terceira
 * coisa, que ninguém escreveu e todo mundo sente. É isso que o site lê.
 */
export default function Hero() {
  return (
    <section
      id="topo"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FFF8F5 0%, #FFD6E0 50%, #FF8FAB 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, #FFFFFF 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -right-16 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #A78BFA 0%, transparent 70%)" }}
      />

      <div className="shell relative pt-12 pb-16 md:pt-16 md:pb-24">
        <Reveal>
          <span className="eyebrow eyebrow-forte">
            <Icon3D name="escudo" size={28} />
            Sua conversa não fica guardada
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="t-h1 mt-5 text-[#2D2A32]">
            O que vocês dizem
            <br />
            nas <Sublinhado cor="#FFFFFF">entrelinhas</Sublinhado>
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-5 max-w-[42ch] text-[1.0625rem] text-[#2D2A32]/75">
            Envie o histórico de uma conversa e receba uma leitura honesta dos padrões de vocês.
            Sem julgamento, sem palpite — só o que já está escrito aí.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <FioDeConversa />
        </Reveal>

        <Reveal delay={260}>
          <Link href="/analise" className="btn btn-primary btn-lg btn-block btn-pulse mt-8">
            Iniciar minha análise
          </Link>
        </Reveal>

        <Reveal delay={320}>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.875rem] text-[#2D2A32]/65">
            <li>Sem cadastro</li>
            <li aria-hidden>·</li>
            <li>Ninguém é avisado</li>
            <li aria-hidden>·</li>
            <li>Você só paga no final</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Assinatura visual: duas mensagens comuns e, no espaço entre elas, o que a
 * leitura enxerga. O nome do produto está desenhado, não escrito.
 *
 * Os horários ficam visíveis de propósito. Quem lê faz a conta sozinho — 23:47,
 * depois 08:12 — e só então o achado confirma o que a pessoa já percebeu. É a
 * mesma sensação que o relatório entrega, em três segundos.
 */
function FioDeConversa() {
  return (
    <figure className="card mt-9 !p-5" style={{ boxShadow: "0 18px 44px rgba(45,42,50,0.12)" }}>
      <figcaption className="mb-4 flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.12em] text-[#6B6570]/70 uppercase">
        Exemplo
        <span className="h-px flex-1 bg-black/10" />
      </figcaption>

      <Balao lado="dir" hora="23:47" lida className="fio-msg">
        a gente precisa marcar aquela viagem
      </Balao>

      <span className="fio-liga fio-achado mt-3 block" aria-hidden />

      <p className="fio-achado mt-1 flex items-center gap-2.5 rounded-2xl border border-[#A78BFA]/25 bg-[#A78BFA]/10 px-3 py-2.5">
        <Icon3D name="lupa" size={30} className="flex-none" />
        <span className="font-[family-name:var(--font-outfit)] text-[0.875rem] leading-snug font-semibold text-[#5B3FD0]">
          Mais de 8 horas para responder.
          <span className="font-medium text-[#6B4FD8]/85"> É a 14ª vez desde março.</span>
        </span>
      </p>

      <span className="fio-liga fio-achado mt-1 block" aria-hidden />

      <Balao lado="esq" hora="08:12" className="fio-msg mt-3" style={{ animationDelay: "0.45s" }}>
        total, depois vejo aqui 🙂
      </Balao>
    </figure>
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
            ? "rounded-[18px] rounded-br-[6px] bg-gradient-to-br from-[#FF8FAB] to-[#FF6B6B] text-white"
            : "rounded-[18px] rounded-bl-[6px] bg-[#FFF8F5] text-[#2D2A32]",
        ].join(" ")}
      >
        {children}
        <span
          className={`flex flex-none items-center gap-0.5 self-end pb-0.5 ${
            minha ? "text-white/75" : "text-[#6B6570]/70"
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
