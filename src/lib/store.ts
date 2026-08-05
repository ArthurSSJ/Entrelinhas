import type { AnalysisState, Charge, Report } from "./types";

/**
 * Armazenamento temporário das análises.
 *
 * REGRA: a conversa enviada nunca entra aqui. O arquivo .txt existe apenas em
 * memória durante o repasse para o N8n e é descartado logo em seguida. O que
 * fica guardado é só o relatório devolvido pela IA, e por pouco tempo.
 *
 * Isto é um Map em memória — suficiente para desenvolvimento e para uma
 * instância única. Em produção serverless (várias instâncias, cold starts) troque
 * por Redis/Upstash ou outro armazenamento compartilhado com TTL. A interface
 * abaixo foi mantida pequena justamente para essa troca ser um arquivo só.
 */

const TTL_MS = 1000 * 60 * 60 * 2; // 2 horas

type Entry = { state: AnalysisState; expiresAt: number };

// Sobrevive ao hot reload do Next em desenvolvimento.
const globalRef = globalThis as unknown as { __entrelinhas?: Map<string, Entry> };
const db: Map<string, Entry> = (globalRef.__entrelinhas ??= new Map());

function sweep() {
  const now = Date.now();
  for (const [id, entry] of db) {
    if (entry.expiresAt <= now) db.delete(id);
  }
}

export function create(
  init: Pick<AnalysisState, "id" | "withAdvanced" | "amountCents" | "demo">,
) {
  sweep();
  const state: AnalysisState = { ...init, status: "processing" };
  db.set(init.id, { state, expiresAt: Date.now() + TTL_MS });
  return state;
}

export function get(id: string): AnalysisState | null {
  sweep();
  return db.get(id)?.state ?? null;
}

function patch(id: string, next: Partial<AnalysisState>) {
  const entry = db.get(id);
  if (!entry) return null;
  entry.state = { ...entry.state, ...next };
  return entry.state;
}

/**
 * Modo grátis: a leitura sai direto liberada, sem passar pelo pagamento.
 * Serve para testar o fluxo inteiro. Desligue antes de vender.
 */
export function modoGratis() {
  // Pública de propósito: a tela de envio também precisa saber, para não
  // prometer uma cobrança que não vai acontecer.
  return process.env.NEXT_PUBLIC_MODO_GRATIS === "true";
}

/** Chamado pelo callback do N8n quando a IA termina. */
export function markReady(id: string, report: Report) {
  const entry = db.get(id);
  if (!entry) return null;
  return patch(id, {
    status: entry.state.status === "paid" || modoGratis() ? "paid" : "ready",
    report,
    preview: {
      headline: report.headline,
      patternCount: report.patternCount,
      sectionTitles: report.sections.map((s) => s.title),
      hasAdvanced: Boolean(report.advanced),
    },
  });
}

export function markFailed(id: string, error: string) {
  return patch(id, { status: "failed", error });
}

/** Posição na fila, para a tela de carregamento saber o que dizer. */
export function setQueuePos(id: string, queuePos: number) {
  return patch(id, { queuePos });
}

export function attachCharge(id: string, charge: Charge) {
  return patch(id, { charge });
}

/** Chamado pelo webhook do gateway de pagamento. */
export function markPaid(id: string) {
  return patch(id, { status: "paid" });
}

/**
 * Versão segura para o navegador: o relatório completo só acompanha a resposta
 * depois que o pagamento foi confirmado.
 */
export function forClient(state: AnalysisState): AnalysisState {
  if (state.status === "paid") return state;
  const { report: _withheld, ...rest } = state;
  return rest;
}
