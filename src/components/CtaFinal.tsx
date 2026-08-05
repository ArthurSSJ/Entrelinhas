import Link from "next/link";
import Icon3D from "./Icon3D";
import Reveal from "./Reveal";

export default function CtaFinal() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #FFD6E0 0%, #FF8FAB 60%, #FF6B6B 100%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full opacity-45 blur-3xl"
        style={{ background: "radial-gradient(circle, #FFFFFF 0%, transparent 70%)" }}
      />

      <div className="shell relative py-14 text-center md:py-20">
        <Reveal>
          <Icon3D name="coracao" size={76} className="mx-auto animate-float-slow" />
          <h2 className="t-h2 mt-5 text-white">Dá para continuar adivinhando. Ou dá para ler.</h2>
          <p className="mx-auto mt-3 max-w-[38ch] text-white/85">
            Dois minutos, uma conversa exportada, e uma noite a menos rolando a tela para cima.
          </p>
          <Link
            href="/analise"
            className="btn btn-lg btn-block mt-7 bg-white text-[#FF6B6B] shadow-[0_10px_30px_rgba(45,42,50,0.18)] hover:brightness-105"
          >
            Iniciar minha análise
          </Link>
          <p className="mt-3 text-[0.875rem] text-white/80">
            Sua conversa não fica guardada. Você só paga no final.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
