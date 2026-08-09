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
  /** Só existe quando a pessoa marcou a análise avançada. */
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
  hasAdvanced: boolean;
};

/**
 * Cobrança. Dois formatos, escolhidos pelo servidor:
 *
 *  - "redirect": a pessoa é levada para um checkout externo (Cakto).
 *  - "pix": QR Code e copia-e-cola mostrados aqui mesmo.
 */
export type Charge =
  | {
      kind: "redirect";
      /** Para onde mandar a pessoa. */
      url: string;
      provider: string;
      amountCents: number;
      expiresAt: number;
    }
  | {
      kind: "pix";
      /** Payload copia-e-cola do PIX (BR Code). */
      brCode: string;
      /** QR Code em data URI. */
      qrImage?: string;
      amountCents: number;
      expiresAt: number;
    };

/** Resposta de GET /api/analyze/[id] — a única fonte de verdade do front. */
export type AnalysisState = {
  id: string;
  status: AnalysisStatus;
  withAdvanced: boolean;
  amountCents: number;
  preview?: ReportPreview;
  charge?: Charge;
  report?: Report;
  error?: string;
  /** Quantas leituras estão na frente desta na fila. 0 quer dizer "é a sua vez". */
  queuePos?: number;
  /** Verdadeiro enquanto não houver checkout real configurado. */
  demo?: boolean;
};
