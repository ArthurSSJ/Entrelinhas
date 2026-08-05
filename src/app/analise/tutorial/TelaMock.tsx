/**
 * Telas do tutorial, desenhadas.
 *
 * Nenhum print de tela real: são reconstruções estilizadas do WhatsApp, com o
 * alvo do toque piscando. Assim o passo a passo continua igual mesmo quando o
 * app muda de cor, e não dependemos de imagem de terceiros.
 */

export type Cena = "chat-android" | "chat-iphone" | "menu-android" | "exportar" | "midia" | "salvar";

export default function TelaMock({ cena }: { cena: Cena }) {
  return (
    <div className="mt-4 rounded-2xl bg-[#FFF8F5] px-4 py-5">
      <div className="mock" role="img" aria-label={rotulos[cena]}>
        {telas[cena]()}
      </div>
    </div>
  );
}

const rotulos: Record<Cena, string> = {
  "chat-android": "Tela da conversa no Android, com os três pontinhos em destaque",
  "chat-iphone": "Tela da conversa no iPhone, com o nome do contato em destaque",
  "menu-android": "Menu aberto, com a opção Mais em destaque",
  exportar: "Submenu com a opção Exportar conversa em destaque",
  midia: "Aviso perguntando se quer anexar mídia, com Sem mídia em destaque",
  salvar: "Tela de compartilhar, com Salvar em Arquivos em destaque",
};

/* ---------- peças ---------- */

function Avatar() {
  return <span className="block h-4 w-4 flex-none rounded-full bg-white/35" aria-hidden />;
}

function Bolha({ minha, largura }: { minha?: boolean; largura: number }) {
  return (
    <span
      className={`block rounded-lg px-2 py-1.5 ${minha ? "ml-auto bg-[#DCF8C6]" : "bg-white"}`}
      style={{ width: `${largura}%` }}
      aria-hidden
    >
      <span className="block h-1 rounded-full bg-black/12" />
      <span className="mt-1 block h-1 w-2/3 rounded-full bg-black/12" />
    </span>
  );
}

function Pontinhos({ foco }: { foco?: boolean }) {
  return (
    <span className={`flex flex-col gap-[2px] px-1 py-0.5 ${foco ? "foco" : ""}`} aria-hidden>
      <span className="block h-[3px] w-[3px] rounded-full bg-white" />
      <span className="block h-[3px] w-[3px] rounded-full bg-white" />
      <span className="block h-[3px] w-[3px] rounded-full bg-white" />
    </span>
  );
}

function Item({ children, foco }: { children: React.ReactNode; foco?: boolean }) {
  return (
    <p className={`mock-item ${foco ? "foco font-semibold text-[#C2185B]" : ""}`}>{children}</p>
  );
}

/* ---------- cenas ---------- */

const telas: Record<Cena, () => React.JSX.Element> = {
  "chat-android": () => (
    <>
      <div className="mock-barra">
        <Avatar />
        <span className="flex-1 truncate font-semibold">Você sabe quem</span>
        <span className="opacity-70">⌕</span>
        <Pontinhos foco />
      </div>
      <div className="space-y-1.5 p-2.5">
        <Bolha largura={70} />
        <Bolha minha largura={58} />
        <Bolha largura={64} />
      </div>
    </>
  ),

  "chat-iphone": () => (
    <>
      <div className="mock-barra relative justify-center">
        <span className="absolute left-2 opacity-70">‹</span>
        <span className="foco flex items-center gap-1.5 rounded px-1.5 py-0.5 font-semibold">
          <Avatar />
          Você sabe quem
        </span>
      </div>
      <div className="space-y-1.5 p-2.5">
        <Bolha largura={70} />
        <Bolha minha largura={58} />
        <Bolha largura={64} />
      </div>
    </>
  ),

  "menu-android": () => (
    <>
      <div className="mock-barra">
        <Avatar />
        <span className="flex-1 truncate font-semibold">Você sabe quem</span>
        <Pontinhos />
      </div>
      <div className="mock-lista m-2 ml-auto w-[62%] rounded-md shadow-lg">
        <Item>Ver contato</Item>
        <Item>Mídia, links e docs</Item>
        <Item>Buscar</Item>
        <Item>Silenciar notificações</Item>
        <Item foco>Mais</Item>
      </div>
    </>
  ),

  exportar: () => (
    <>
      <div className="mock-barra">
        <Avatar />
        <span className="flex-1 truncate font-semibold">Você sabe quem</span>
        <Pontinhos />
      </div>
      <div className="mock-lista m-2 ml-auto w-[70%] rounded-md shadow-lg">
        <Item>Reportar</Item>
        <Item>Bloquear</Item>
        <Item>Limpar conversa</Item>
        <Item foco>Exportar conversa</Item>
      </div>
    </>
  ),

  midia: () => (
    <>
      <div className="mock-barra">
        <Avatar />
        <span className="flex-1 truncate font-semibold">Você sabe quem</span>
        <Pontinhos />
      </div>
      <div className="p-3">
        <div className="rounded-lg bg-white p-3 shadow-lg">
          <p className="font-semibold">Anexar mídia?</p>
          <p className="mt-1 text-[8px] text-black/55">
            Anexar mídia deixa o arquivo bem maior.
          </p>
          <div className="mt-3 flex justify-end gap-2 text-[9px] font-semibold text-[#4C8B72]">
            <span className="foco rounded px-1.5 py-0.5 text-[#C2185B]">SEM MÍDIA</span>
            <span className="opacity-60">INCLUIR MÍDIA</span>
          </div>
        </div>
      </div>
    </>
  ),

  salvar: () => (
    <>
      <div className="mock-barra">
        <span className="flex-1 font-semibold">Compartilhar</span>
      </div>
      <div className="bg-white p-2.5">
        <p className="text-[8px] text-black/50">Conversa do WhatsApp com Você sabe quem.txt</p>
        <div className="mt-2 flex gap-2" aria-hidden>
          {["#FF8FAB", "#A78BFA", "#4C8B72", "#6B6570"].map((cor) => (
            <span key={cor} className="h-6 w-6 rounded-full" style={{ background: cor }} />
          ))}
        </div>
        <div className="mock-lista mt-2 rounded-md border border-black/6">
          <Item foco>Salvar em Arquivos</Item>
          <Item>Enviar por e-mail</Item>
        </div>
      </div>
    </>
  ),
};
