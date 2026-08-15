/** Estados possíveis de uma análise, do envio até a liberação. */
export type AnalysisStatus =
  | "processing"
  | "ready" // a IA terminou, mas o pagamento ainda não foi confirmado
  | "paid" // pagamento confirmado, relatório liberado
  | "failed";

export type ReportSection = {
  title: string;
  body: string;
  /** Nome de um ícone 3D, opcional. Cai no padrão se vier vazio ou desconhecido. */
  icon?: string;
};

export type AdvancedSection = {
  title: string;
  body: string;
  level: "baixo" | "medio" | "alto";
};

/** O que fazer com o que foi lido. É a parte que a pessoa leva embora. */
export type Acao = {
  titulo: string;
  texto: string;
};

export type Report = {
  headline: string;
  summary: string;
  patternCount: number;
  sections: ReportSection[];
  /** Sugestões concretas para melhorar a relação. */
  acoes?: Acao[];
  /**
   * A leitura avançada. É gerada junto com o resto, para todo mundo, porque a
   * conversa é apagada logo depois de lida: se ela não nascesse aqui, não
   * haveria como produzi-la quando alguém comprasse a avançada mais tarde.
   * Quem decide se ela chega ao navegador é `advancedPaid`, no servidor.
   */
  advanced?: AdvancedSection | null;
};

/** Um recorte real de uma seção, curto o bastante para dar gosto de mais. */
export type PreviewSection = {
  title: string;
  excerpt: string;
  icon?: string;
};

/**
 * O que o cliente pode ver antes de pagar.
 *
 * `previewSections` são recortes de verdade — mesmo título e o começo do
 * mesmo texto que o relatório pago traz, só cortado mais cedo. `sectionTitles`
 * continua com todos os títulos, incluindo os que ainda não apareceram em
 * `previewSections`, para a tela de pagamento saber o que ainda listar como
 * fechado sem repetir o que já foi mostrado.
 */
export type ReportPreview = {
  headline: string;
  patternCount: number;
  sectionTitles: string[];
  previewSections: PreviewSection[];
};

/**
 * Cobrança. Dois formatos, escolhidos pelo servidor:
 *
 *  - "redirect": a pessoa é levada para um checkout externo (Cakto).
 *  - "pix": QR Code e copia-e-cola mostrados aqui mesmo.
 */
export type Charge = {
  /** O que este pagamento libera. Escrito pelo servidor ao criar a cobrança. */
  unlock: Unlock;
  amountCents: number;
  expiresAt: number;
} & (
  | {
      kind: "redirect";
      /** Para onde mandar a pessoa. */
      url: string;
      provider: string;
    }
  | {
      kind: "pix";
      /** Payload copia-e-cola do PIX (BR Code). */
      brCode: string;
      /** QR Code em data URI. */
      qrImage?: string;
    }
);

/**
 * O que uma cobrança libera quando é confirmada.
 *
 * Isto viaja no identificador do pedido (`<analise>~<unlock>`) e é lido de
 * volta no postback do gateway. O preço não viaja: ele é recalculado no
 * servidor a partir do que o unlock significa, para que ninguém consiga pedir
 * o relatório pelo preço do downsell mexendo na requisição.
 */
export type Unlock =
  /** Só o relatório principal. */
  | "rel"
  /** Só a investigação avançada (upsell, downsell). */
  | "av"
  /** Os dois de uma vez (order bump, oferta de recuperação). */
  | "rel_av";

/** De onde saiu uma cobrança da avançada. Define o preço, no servidor. */
export type OrigemAvancada = "upsell" | "downsell" | "recuperacao";

/** Resposta de GET /api/analyze/[id] — a única fonte de verdade do front. */
export type AnalysisState = {
  id: string;
  status: AnalysisStatus;
  /**
   * A pessoa marcou a avançada lá no envio. Não compra nada: só deixa o order
   * bump do checkout pré-marcado, porque ela já disse que tem essa dúvida.
   */
  advancedPreSelected: boolean;
  /** O order bump está marcado agora. É o que decide `amountCents`. */
  bumpSelected: boolean;
  /**
   * A avançada foi paga. É a única coisa que libera a seção avançada, e só o
   * servidor escreve aqui.
   */
  advancedPaid: boolean;
  /** Valor do pedido principal em aberto, já com o bump se estiver marcado. */
  amountCents: number;
  preview?: ReportPreview;
  /** Cobrança do pedido principal. */
  charge?: Charge;
  /** Cobrança avulsa da avançada (upsell, downsell ou recuperação). */
  chargeAvancada?: Charge;
  report?: Report;
  error?: string;
  /** Quantas leituras estão na frente desta na fila. 0 quer dizer "é a sua vez". */
  queuePos?: number;
  /** Verdadeiro enquanto não houver checkout real configurado. */
  demo?: boolean;
  /**
   * A variante de oferta de recuperação está ligada.
   *
   * Quem decide é o servidor, e não uma constante lida no navegador: é ele que
   * aceita ou recusa a cobrança do pacote, e as duas respostas precisam vir da
   * mesma fonte. Cliente e servidor discordando aqui viraria um popup que
   * oferece um preço que o checkout depois recusa.
   */
  ofertaRecuperacao?: boolean;
  /** Etapas do funil já vividas. Ficam no servidor para sobreviver ao refresh. */
  funil?: FunilFlags;
  /**
   * O PIX é gerado direto na API da Cakto, o que exige nome, e-mail, telefone
   * e CPF antes de abrir qualquer cobrança. Decidido no servidor, a partir de
   * quais variáveis de ambiente estão configuradas — o navegador só lê.
   */
  precisaDadosCliente?: boolean;
};

/**
 * Por onde a pessoa já passou. Existe para não repetir oferta: cada uma é
 * escrita uma vez e nunca volta atrás.
 */
export type FunilFlags = {
  upsellDeclined?: boolean;
  downsellOffered?: boolean;
  downsellDeclined?: boolean;
  /** A oferta de recuperação já apareceu nesta análise. */
  recuperacaoOffered?: boolean;
};
