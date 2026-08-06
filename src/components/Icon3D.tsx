/**
 * Icon3D: conjunto de ícones 3D "glossy" desenhados à mão em SVG.
 *
 * Paleta rosa do começo ao fim. A única exceção é o Pix, que fica verde
 * porque a cor faz parte do reconhecimento da marca na hora de pagar.
 *
 * Nos tamanhos grandes (80px para cima) a página usa os renders 3D de
 * verdade em `public/render`. Estes aqui servem os tamanhos pequenos, onde
 * um PNG pesaria mais do que ajudaria.
 *
 * Cada ícone segue a mesma receita de material para parecer plástico macio:
 *  1. sombra de contato elíptica e desfocada na base
 *  2. corpo com gradiente (luz no topo-esquerda, saturação embaixo-direita)
 *  3. reflexo especular branco com opacidade decrescente
 *  4. cantos arredondados e nenhum traço fino
 *
 * Tudo é inline: nenhum arquivo externo, nenhuma fonte de ícone, e cada
 * forma pode ser animada individualmente.
 */

export type IconName =
  | "coracao"
  | "conversa"
  | "lupa"
  | "escudo"
  | "alerta"
  | "celular"
  | "presente"
  | "pix"
  | "nuvem"
  | "brilho"
  | "foguete"
  | "cadeado";

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  /** Ícones são decorativos por padrão; passe um rótulo para expô-los a leitores de tela. */
  label?: string;
};

export default function Icon3D({ name, size = 56, className, label }: Props) {
  const Shape = shapes[name];
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <Shape />
    </svg>
  );
}

/* ---------- peças compartilhadas ---------- */

function Chao({ cy = 84, rx = 26, o = 0.16 }: { cy?: number; rx?: number; o?: number }) {
  return (
    <ellipse cx="48" cy={cy} rx={rx} ry="5.5" fill="#2D2A32" opacity={o} filter="url(#e-blur)" />
  );
}

function Blur() {
  return (
    <filter id="e-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3.2" />
    </filter>
  );
}

/* ---------- ícones ---------- */

function Coracao() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="cor-a" x1="22" y1="14" x2="74" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFC2D2" />
          <stop offset="0.45" stopColor="#FF8FAB" />
          <stop offset="1" stopColor="#FF5E82" />
        </linearGradient>
        <radialGradient id="cor-b" cx="0.32" cy="0.24" r="0.42">
          <stop stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Chao rx={24} />
      <path
        d="M48 79.5c-1.5 0-2.9-.5-4-1.5C31.4 66.9 14 53.4 14 36.6 14 24.6 23.2 15 34.8 15c5.4 0 10.4 2.2 13.2 6 2.8-3.8 7.8-6 13.2-6C72.8 15 82 24.6 82 36.6c0 16.8-17.4 30.3-30 41.4-1.1 1-2.5 1.5-4 1.5Z"
        fill="url(#cor-a)"
      />
      <ellipse cx="35" cy="34" rx="14" ry="10" fill="url(#cor-b)" transform="rotate(-24 35 34)" />
      <ellipse cx="64" cy="30" rx="5" ry="3.4" fill="#fff" opacity="0.55" transform="rotate(-20 64 30)" />
    </>
  );
}

function Conversa() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="cv-a" x1="12" y1="14" x2="68" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFD6E0" />
        </linearGradient>
        <linearGradient id="cv-b" x1="46" y1="38" x2="86" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9DBB" />
          <stop offset="1" stopColor="#E01048" />
        </linearGradient>
      </defs>
      <Chao cy={86} rx={27} />
      <path
        d="M18 14h40a10 10 0 0 1 10 10v22a10 10 0 0 1-10 10H38l-13 9.4A2.4 2.4 0 0 1 21.2 63l.6-7H18A10 10 0 0 1 8 46V24a10 10 0 0 1 10-10Z"
        fill="url(#cv-a)"
        stroke="#FF8FAB"
        strokeWidth="2.5"
      />
      <circle cx="26" cy="35" r="3.6" fill="#FF8FAB" />
      <circle cx="38" cy="35" r="3.6" fill="#FF8FAB" />
      <circle cx="50" cy="35" r="3.6" fill="#FF8FAB" />
      <path
        d="M62 34h16a10 10 0 0 1 10 10v16a10 10 0 0 1-10 10h2l.5 6.2a2.2 2.2 0 0 1-3.5 2L66 70h-4a10 10 0 0 1-10-10V44a10 10 0 0 1 10-10Z"
        fill="url(#cv-b)"
      />
      <ellipse cx="65" cy="44" rx="9" ry="5" fill="#fff" opacity="0.4" transform="rotate(-18 65 44)" />
    </>
  );
}

function Lupa() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="lp-a" x1="20" y1="18" x2="62" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF0F4" />
          <stop offset="1" stopColor="#FFB8CE" />
        </linearGradient>
        <linearGradient id="lp-b" x1="14" y1="14" x2="66" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9DBB" />
          <stop offset="1" stopColor="#C10C3E" />
        </linearGradient>
        <linearGradient id="lp-c" x1="58" y1="58" x2="84" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFA8BE" />
          <stop offset="1" stopColor="#E01048" />
        </linearGradient>
      </defs>
      <Chao rx={25} />
      <rect x="56" y="54" width="14" height="30" rx="7" fill="url(#lp-c)" transform="rotate(-45 63 69)" />
      <circle cx="40" cy="38" r="27" fill="url(#lp-b)" />
      <circle cx="40" cy="38" r="20" fill="url(#lp-a)" />
      <path d="M28 30a17 17 0 0 1 13-8" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
      <ellipse cx="30" cy="26" rx="7" ry="4" fill="#fff" opacity="0.6" transform="rotate(-38 30 26)" />
    </>
  );
}

function Escudo() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="es-a" x1="20" y1="10" x2="76" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9DBB" />
          <stop offset="0.55" stopColor="#FF3068" />
          <stop offset="1" stopColor="#C10C3E" />
        </linearGradient>
      </defs>
      <Chao rx={23} />
      <path
        d="M48 8 20 19v25c0 17.7 11.6 30.7 26.4 36.6a4.3 4.3 0 0 0 3.2 0C64.4 74.7 76 61.7 76 44V19L48 8Z"
        fill="url(#es-a)"
      />
      <path
        d="M48 8 20 19v25c0 6.6 1.6 12.5 4.3 17.6C33 55 42 42 42 27.5c0-6.5-1-12.6-2.6-17.6L48 8Z"
        fill="#fff"
        opacity="0.22"
      />
      <path
        d="m35 45 9.5 9.5L62 36"
        stroke="#fff"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="35" cy="22" rx="8" ry="4.5" fill="#fff" opacity="0.5" transform="rotate(-28 35 22)" />
    </>
  );
}

function Alerta() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="al-a" x1="20" y1="10" x2="76" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9DBB" />
          <stop offset="0.5" stopColor="#E01048" />
          <stop offset="1" stopColor="#A80B39" />
        </linearGradient>
      </defs>
      <Chao rx={23} o={0.18} />
      <path
        d="M48 8 20 19v25c0 17.7 11.6 30.7 26.4 36.6a4.3 4.3 0 0 0 3.2 0C64.4 74.7 76 61.7 76 44V19L48 8Z"
        fill="url(#al-a)"
      />
      <path
        d="M48 8 20 19v25c0 6.6 1.6 12.5 4.3 17.6C33 55 42 42 42 27.5c0-6.5-1-12.6-2.6-17.6L48 8Z"
        fill="#fff"
        opacity="0.2"
      />
      <rect x="43.5" y="27" width="9" height="24" rx="4.5" fill="#fff" />
      <circle cx="48" cy="60" r="5" fill="#fff" />
    </>
  );
}

function Celular() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="ce-a" x1="26" y1="10" x2="70" y2="86" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFE3EA" />
        </linearGradient>
        <linearGradient id="ce-b" x1="34" y1="30" x2="62" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFC2D2" />
          <stop offset="1" stopColor="#FF8FAB" />
        </linearGradient>
      </defs>
      <Chao cy={88} rx={21} />
      <rect x="26" y="10" width="44" height="76" rx="14" fill="url(#ce-a)" stroke="#FF8FAB" strokeWidth="2.5" />
      <rect x="33" y="20" width="30" height="56" rx="8" fill="url(#ce-b)" />
      <path
        d="M48 66V36m0 0-9 9m9-9 9 9"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="42" y="13.5" width="12" height="3.5" rx="1.75" fill="#FFD6E0" />
      <ellipse cx="37" cy="27" rx="4" ry="9" fill="#fff" opacity="0.35" transform="rotate(20 37 27)" />
    </>
  );
}

function Presente() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="pr-a" x1="18" y1="40" x2="78" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFC2D2" />
          <stop offset="1" stopColor="#FF7A9B" />
        </linearGradient>
        <linearGradient id="pr-b" x1="14" y1="28" x2="82" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFD6E0" />
        </linearGradient>
        <linearGradient id="pr-c" x1="30" y1="8" x2="66" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9DBB" />
          <stop offset="1" stopColor="#E01048" />
        </linearGradient>
      </defs>
      <Chao cy={86} rx={27} />
      <rect x="19" y="42" width="58" height="40" rx="10" fill="url(#pr-a)" />
      <rect x="13" y="28" width="70" height="20" rx="9" fill="url(#pr-b)" />
      <rect x="42" y="28" width="12" height="54" fill="#FF3068" opacity="0.9" />
      <path
        d="M48 28c-6-14-22-16-22-6 0 5 9 7 22 6Zm0 0c6-14 22-16 22-6 0 5-9 7-22 6Z"
        fill="url(#pr-c)"
      />
      <ellipse cx="30" cy="35" rx="10" ry="4" fill="#fff" opacity="0.6" />
      <ellipse cx="30" cy="54" rx="5" ry="8" fill="#fff" opacity="0.22" />
    </>
  );
}

function Pix() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="px-a" x1="16" y1="16" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8DF0C0" />
          <stop offset="1" stopColor="#22B47E" />
        </linearGradient>
      </defs>
      <Chao rx={26} />
      <path
        d="M55.6 12.6a10.7 10.7 0 0 0-15.2 0L27.7 25.3h4.6c3.2 0 6.2 1.3 8.5 3.5l9.4 9.4c1 1 2.6 1 3.6 0l9.4-9.4a12 12 0 0 1 8.5-3.5h4.6L55.6 12.6ZM83.4 40.4 70.7 27.7h-6c-2.2 0-4.3.9-5.9 2.4l-9.4 9.4a6.2 6.2 0 0 1-8.8 0l-9.4-9.4a8.3 8.3 0 0 0-5.9-2.4h-6L12.6 40.4a10.7 10.7 0 0 0 0 15.2l12.7 12.7h6c2.2 0 4.3-.9 5.9-2.4l9.4-9.4a6.2 6.2 0 0 1 8.8 0l9.4 9.4c1.6 1.5 3.7 2.4 5.9 2.4h6l12.7-12.7a10.7 10.7 0 0 0 0-15.2ZM40.8 67.2a12 12 0 0 0-8.5-3.5h-4.6l12.7 12.7a10.7 10.7 0 0 0 15.2 0l12.7-12.7h-4.6c-3.2 0-6.2 1.3-8.5 3.5l-9.4 9.4c-1 1-2.6 1-3.6 0l-9.4-9.4Z"
        fill="url(#px-a)"
      />
      <ellipse cx="34" cy="30" rx="7" ry="3.5" fill="#fff" opacity="0.5" transform="rotate(-42 34 30)" />
    </>
  );
}

function Nuvem() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="nv-a" x1="16" y1="26" x2="76" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFD6E0" />
        </linearGradient>
        <linearGradient id="nv-b" x1="38" y1="34" x2="58" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFA8BE" />
          <stop offset="1" stopColor="#E01048" />
        </linearGradient>
      </defs>
      <Chao cy={86} rx={26} />
      <path
        d="M30 68a19 19 0 0 1-2.1-37.9A23 23 0 0 1 71 36.4 16.8 16.8 0 0 1 68 68H30Z"
        fill="url(#nv-a)"
        stroke="#FF8FAB"
        strokeWidth="2.5"
      />
      <path
        d="M48 78V44m0 0-10 10m10-10 10 10"
        stroke="url(#nv-b)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="34" cy="40" rx="9" ry="4.5" fill="#fff" opacity="0.85" transform="rotate(-16 34 40)" />
    </>
  );
}

function Brilho() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="br-a" x1="20" y1="18" x2="76" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD9E4" />
          <stop offset="1" stopColor="#FF8FAB" />
        </linearGradient>
      </defs>
      <path
        d="M48 8c2.4 18.6 12.6 28.8 32 32-19.4 3.2-29.6 13.4-32 32-2.4-18.6-12.6-28.8-32-32 19.4-3.2 29.6-13.4 32-32Z"
        fill="url(#br-a)"
      />
      <ellipse cx="38" cy="30" rx="6" ry="3" fill="#fff" opacity="0.7" transform="rotate(-40 38 30)" />
    </>
  );
}

function Foguete() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="fg-a" x1="30" y1="8" x2="66" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFD6E0" />
        </linearGradient>
        <linearGradient id="fg-b" x1="38" y1="60" x2="58" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFC2D2" />
          <stop offset="1" stopColor="#E01048" />
        </linearGradient>
      </defs>
      <Chao cy={88} rx={18} o={0.12} />
      <path d="M30 44 18 56l2 14 12-10-2-16Z" fill="#FF8FAB" />
      <path d="M66 44 78 56l-2 14-12-10 2-16Z" fill="#FF8FAB" />
      <path
        d="M48 6c11 9 17 22 17 37v17a6 6 0 0 1-6 6H37a6 6 0 0 1-6-6V43C31 28 37 15 48 6Z"
        fill="url(#fg-a)"
        stroke="#FF8FAB"
        strokeWidth="2.5"
      />
      <circle cx="48" cy="36" r="9" fill="#FF3068" />
      <circle cx="45" cy="33" r="3" fill="#fff" opacity="0.7" />
      <path d="M48 92c-6-6-9-11-9-16h18c0 5-3 10-9 16Z" fill="url(#fg-b)" />
    </>
  );
}

function Cadeado() {
  return (
    <>
      <defs>
        <Blur />
        <linearGradient id="cd-a" x1="24" y1="40" x2="72" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFC2D2" />
          <stop offset="1" stopColor="#FF7A9B" />
        </linearGradient>
      </defs>
      <Chao cy={86} rx={22} />
      <path
        d="M34 44V32a14 14 0 0 1 28 0v12"
        stroke="#C10C3E"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="22" y="42" width="52" height="40" rx="12" fill="url(#cd-a)" />
      <circle cx="48" cy="60" r="6" fill="#fff" opacity="0.9" />
      <rect x="45" y="60" width="6" height="12" rx="3" fill="#fff" opacity="0.9" />
      <ellipse cx="33" cy="50" rx="7" ry="3.5" fill="#fff" opacity="0.5" transform="rotate(-20 33 50)" />
    </>
  );
}

const shapes: Record<IconName, () => React.JSX.Element> = {
  coracao: Coracao,
  conversa: Conversa,
  lupa: Lupa,
  escudo: Escudo,
  alerta: Alerta,
  celular: Celular,
  presente: Presente,
  pix: Pix,
  nuvem: Nuvem,
  brilho: Brilho,
  foguete: Foguete,
  cadeado: Cadeado,
};
