import Icon3D from "./Icon3D";

/**
 * `largo` acompanha a coluna larga da home. Nas páginas de texto o rodapé
 * segue a mesma medida do conteúdo, senão ele fica mais largo do que o que
 * está sendo lido.
 */
export default function Rodape({ largo = false }: { largo?: boolean }) {
  return (
    <footer className="relative">
      <span className="linha-fina absolute inset-x-0 top-0 h-px" aria-hidden />

      <div
        className={`${largo ? "shell-l" : "shell"} grid gap-8 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16`}
      >
        <div className="flex items-start gap-4">
          <Icon3D name="coracao" size={34} className="flex-none" />
          <div>
            <p className="font-[family-name:var(--font-outfit)] text-[1.0625rem] font-bold text-[#F6ECEF]">
              Entrelinhas
            </p>
            <p className="mt-2 max-w-[42ch] text-[0.875rem] leading-relaxed text-[#B7A2AA]">
              A conversa que você envia é apagada assim que a leitura termina. Nada fica guardado.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[0.9375rem] md:justify-end">
          <a href="/privacidade" className="text-[#B7A2AA] transition-colors hover:text-[#F6ECEF]">
            Privacidade
          </a>
          <a href="/termos" className="text-[#B7A2AA] transition-colors hover:text-[#F6ECEF]">
            Termos de uso
          </a>
          <a
            href="mailto:oi@entrelinhas.app"
            className="text-[#B7A2AA] transition-colors hover:text-[#F6ECEF]"
          >
            Falar com a gente
          </a>
        </nav>
      </div>

      <div className={`${largo ? "shell-l" : "shell"} pb-10`}>
        <p className="max-w-[68ch] text-[0.8125rem] leading-relaxed text-[#B7A2AA]/75">
          Entrelinhas é uma leitura de padrões de conversa, não um diagnóstico e não substitui
          acompanhamento profissional.
        </p>
      </div>
    </footer>
  );
}
