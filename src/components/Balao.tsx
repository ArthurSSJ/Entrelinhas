/**
 * Balão de mensagem no estilo do WhatsApp.
 *
 * Mora fora do herói porque a página usa a mesma peça em dois lugares: no topo,
 * como assinatura visual, e nos exemplos, como matéria-prima do que a leitura
 * encontrou. Mesma forma nos dois: a pessoa reconhece a tela antes de ler.
 */
export default function Balao({
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
