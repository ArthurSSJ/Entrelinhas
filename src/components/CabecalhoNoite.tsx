import Link from "next/link";
import Icon3D from "./Icon3D";

const links = [
  { href: "#como", texto: "Como funciona" },
  { href: "#relatorio", texto: "O relatório" },
  { href: "#preco", texto: "Preço" },
  { href: "#perguntas", texto: "Perguntas" },
];

/**
 * Topo da home. O `Cabecalho` claro continua servindo o fluxo de análise e as
 * páginas de texto; este aqui existe só para a página inicial escura.
 *
 * Uma linha só no desktop, 68px de altura. No celular os âncoras somem: o
 * dedo não tem onde errar entre a marca e o botão.
 */
export default function CabecalhoNoite() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0B0407]/80 backdrop-blur-xl">
      <div className="shell-l flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex flex-none items-center gap-2">
          <Icon3D name="coracao" size={30} />
          <span className="font-[family-name:var(--font-outfit)] text-[1.0625rem] font-bold tracking-tight text-[#F6ECEF]">
            Entrelinhas
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-[0.9375rem] font-medium text-[#B7A2AA] transition-colors duration-200 hover:text-[#F6ECEF]"
            >
              {link.texto}
            </a>
          ))}
        </nav>

        <Link
          href="/analise"
          className="btn btn-neon flex-none px-4 py-2.5 text-[0.8125rem] whitespace-nowrap md:px-6 md:text-[0.9375rem]"
        >
          Iniciar minha análise
        </Link>
      </div>
    </header>
  );
}
