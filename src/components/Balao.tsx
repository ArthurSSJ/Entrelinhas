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
  variant = "padrao",
}: {
  lado: "esq" | "dir";
  hora: string;
  lida?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  variant?: "padrao" | "whatsapp";
}) {
  const minha = lado === "dir";

  if (variant === "whatsapp") {
    return (
      <span className={`flex ${minha ? "justify-end" : "justify-start"} ${className}`} style={style}>
        <span
          className={[
            "relative flex max-w-[85%] sm:max-w-[78%] flex-wrap items-end gap-x-2.5 gap-y-1 px-3 py-2 text-[0.90625rem] leading-relaxed shadow-sm font-sans",
            minha
              ? "rounded-2xl rounded-tr-xs bg-[#005c4b] text-[#e9edef]"
              : "rounded-2xl rounded-tl-xs bg-[#202c33] text-[#e9edef]",
          ].join(" ")}
        >
          {/* Rabicho do balão */}
          {minha ? (
            <svg
              className="absolute -right-1.5 top-0 w-3 h-3 text-[#005c4b] fill-current pointer-events-none"
              viewBox="0 0 8 13"
              aria-hidden="true"
            >
              <path d="M6.467 2.568L0 11.19V0h6.467c.79 0 1.246.913.746 1.526l-.746 1.042z" />
            </svg>
          ) : (
            <svg
              className="absolute -left-1.5 top-0 w-3 h-3 text-[#202c33] fill-current pointer-events-none"
              viewBox="0 0 8 13"
              aria-hidden="true"
            >
              <path d="M1.533 2.568L8 11.19V0H1.533c-.79 0-1.246.913-.746 1.526l.746 1.042z" />
            </svg>
          )}

          <span className="break-words select-text">{children}</span>
          <span
            className="ml-auto flex flex-none items-center gap-1 self-end text-[0.6875rem] text-[#8696a0]"
          >
            <time className="fio-hora font-normal tracking-normal">{hora}</time>
            {lida && <Vistos color="#53bdeb" />}
          </span>
        </span>
      </span>
    );
  }

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
function Vistos({ color }: { color?: string }) {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden focusable="false">
      <path
        d="M1.5 6L4.2 8.7L10 3M6.5 6L9.2 8.7L15 3"
        stroke={color || "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
