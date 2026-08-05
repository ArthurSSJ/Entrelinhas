import Icon3D from "./Icon3D";

export default function Rodape() {
  return (
    <footer className="border-t border-black/5 py-10">
      <div className="shell flex flex-col items-center gap-4 text-center">
        <Icon3D name="coracao" size={28} />
        <p className="t-legenda max-w-[38ch]">
          A conversa que você envia é apagada assim que a leitura termina. Nada fica guardado.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.875rem]">
          <a href="/privacidade" className="text-[#6B6570] underline-offset-4 hover:underline">
            Privacidade
          </a>
          <a href="/termos" className="text-[#6B6570] underline-offset-4 hover:underline">
            Termos de uso
          </a>
          <a
            href="mailto:oi@entrelinhas.app"
            className="text-[#6B6570] underline-offset-4 hover:underline"
          >
            Falar com a gente
          </a>
        </nav>
        <p className="text-[0.8125rem] text-[#6B6570]/70">
          Entrelinhas é uma leitura de padrões de conversa, não um diagnóstico e não substitui
          acompanhamento profissional.
        </p>
      </div>
    </footer>
  );
}
