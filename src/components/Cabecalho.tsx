import Link from "next/link";
import Icon3D from "./Icon3D";

/**
 * `simples` tira o botão de ação: dentro do fluxo a pessoa já está a caminho,
 * e um segundo CTA no topo só concorre com o passo em que ela está.
 */
export default function Cabecalho({ simples = false }: { simples?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#FFF8F5]/85 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-3 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Icon3D name="coracao" size={30} />
          <span className="font-[family-name:var(--font-outfit)] text-[1.0625rem] font-bold tracking-tight text-[#2D2A32]">
            Entrelinhas
          </span>
        </Link>

        {simples ? (
          <span className="t-legenda flex items-center gap-1.5">
            <Icon3D name="cadeado" size={20} />
            Conversa não guardada
          </span>
        ) : (
          <Link href="/analise" className="btn btn-primary px-5 py-2.5 text-[0.9375rem]">
            Iniciar
          </Link>
        )}
      </div>
    </header>
  );
}
