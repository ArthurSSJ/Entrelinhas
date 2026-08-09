/**
 * Acabamentos de página: manchas de cor, divisórias em onda e o traço à mão
 * sob as palavras que importam. Nada aqui carrega informação — só tiram o
 * aspecto de bloco retangular chapado.
 */

/** Manchas coloridas que respiram atrás do conteúdo. */
export function Manchas({
  variante = "rosa",
}: {
  variante?: "rosa" | "roxo" | "misto";
}) {
  const paleta = {
    rosa: ["#FFD6E0", "#FF8FAB"],
    roxo: ["#E9DFFF", "#A78BFA"],
    misto: ["#FFD6E0", "#A78BFA"],
  }[variante];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span
        className="mancha h-64 w-64"
        style={{ background: paleta[0], opacity: 0.5, top: "-4rem", left: "-5rem" }}
      />
      <span
        className="mancha h-56 w-56"
        style={{
          background: paleta[1],
          opacity: 0.28,
          bottom: "-3rem",
          right: "-4rem",
          animationDelay: "-8s",
        }}
      />
    </div>
  );
}

/** Divisória em onda. `virada` inverte a curva para fechar uma seção. */
export function Onda({
  cor = "#FFFFFF",
  virada = false,
  className = "",
}: {
  cor?: string;
  virada?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`onda ${className}`}
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
      style={virada ? { transform: "scaleY(-1)" } : undefined}
    >
      <path
        d="M0 28c120 26 240 34 360 22 120-11 240-42 360-42s240 31 360 42c120 12 240 4 360-22V64H0Z"
        fill={cor}
      />
    </svg>
  );
}

/** Traço irregular sob uma palavra, como se tivesse sido feito à mão. */
export function Sublinhado({
  children,
  cor = "#FF8FAB",
}: {
  children: React.ReactNode;
  cor?: string;
}) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        className="absolute -bottom-1.5 left-0 h-[0.42em] w-full"
        viewBox="0 0 200 16"
        preserveAspectRatio="none"
        aria-hidden
        focusable="false"
      >
        <path
          d="M3 11.5c34-5.2 68-7.4 101-6.6 33 .8 62 4.4 95 8.6"
          fill="none"
          stroke={cor}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.65"
        />
      </svg>
    </span>
  );
}
