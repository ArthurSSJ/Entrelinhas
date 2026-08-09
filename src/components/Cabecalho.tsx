import Link from "next/link";
import Icon3D from "./Icon3D";
import { MARCA } from "@/lib/marca";

const ancoras = [
  { href: "#exemplos", texto: "O que aparece" },
  { href: "#como", texto: "Como funciona" },
  { href: "#relatorio", texto: "O relatório" },
  { href: "#preco", texto: "Preço" },
];

type Modo =
  /** Home: âncoras das seções e o botão de começar. */
  | "home"
  /** Dentro do fluxo: sem botão. A pessoa já está a caminho, e um segundo CTA
   *  no topo só concorre com o passo em que ela está. */
  | "fluxo"
  /** Páginas de texto (termos, privacidade): só a marca e o botão. */
  | "texto";

/**
 * Uma linha só no desktop, 68px de altura. No celular as âncoras somem: o dedo
 * não tem onde errar entre a marca e o botão.
 */
export default function Cabecalho({ modo = "texto" }: { modo?: Modo }) {
  const largo = modo === "home";

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0B0407]/80 backdrop-blur-xl">
      <div
        className={`${largo ? "shell-l" : "shell"} flex items-center justify-between gap-4 py-3`}
      >
        <Link href="/" className="flex flex-none items-center gap-2">
          <Icon3D name="coracao" size={30} />
          <span className="font-[family-name:var(--font-outfit)] text-[1.0625rem] font-bold tracking-tight text-[#F6ECEF]">
            {MARCA}
          </span>
        </Link>

        {modo === "home" && (
          <nav className="hidden items-center gap-8 lg:flex">
            {ancoras.map((ancora) => (
              <a
                key={ancora.href}
                href={ancora.href}
                className="text-[0.9375rem] font-medium text-[#B7A2AA] transition-colors duration-200 hover:text-[#F6ECEF]"
              >
                {ancora.texto}
              </a>
            ))}
          </nav>
        )}

        {modo === "fluxo" ? (
          <span className="flex items-center gap-2 text-[0.875rem] text-[#B7A2AA]">
            <Icon3D name="cadeado" size={20} />
            Conversa não guardada
          </span>
        ) : (
          <Link
            href="/analise"
            className="btn btn-primary flex-none px-4 py-2.5 text-[0.8125rem] whitespace-nowrap md:px-6 md:text-[0.9375rem]"
          >
            Quero descobrir
          </Link>
        )}
      </div>
    </header>
  );
}
