import type { AnalysisState, Charge, FunilFlags, Report, Unlock } from "./types";
import { BASE_CENTS, OFERTA_RECUPERACAO_ATIVA, UPSELL_CENTS } from "./pricing";
import { pixNativoConfigurado } from "./cakto";

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

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const TTL_MS = 1000 * 60 * 60 * 2; // 2 horas
const TMP_DIR = path.join(os.tmpdir(), "desvenda_store");

type Entry = { state: AnalysisState; expiresAt: number };

// Sobrevive ao hot reload do Next em desenvolvimento.
const globalRef = globalThis as unknown as {
  __desvenda?: Map<string, Entry>;
  __desvendaPix?: Map<string, { referencia: string; expiresAt: number }>;
};
const db: Map<string, Entry> = (globalRef.__desvenda ??= new Map());

function saveTmp(id: string, entry: Entry) {
  try {
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(TMP_DIR, `${id}.json`), JSON.stringify(entry), "utf-8");
  } catch {}
}

function readTmp(id: string): Entry | null {
  try {
    const filePath = path.join(TMP_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const entry = JSON.parse(raw) as Entry;
      if (entry.expiresAt > Date.now()) {
        db.set(id, entry);
        return entry;
      }
    }
  } catch {}
  return null;
}

function sweep() {
  const now = Date.now();
  for (const [id, entry] of db) {
    if (entry.expiresAt <= now) db.delete(id);
  }
}

/**
 * Correlaciona o id de um pagamento PIX criado na API da Cakto com a
 * referência do pedido (`<análise>~<unlock>`).
 *
 * O link de checkout carrega a referência na própria URL (utm_content), mas o
 * PIX criado direto pela API não devolve nada disso no webhook — só o `id`
 * gerado pela Cakto (confirmado na documentação: nenhum campo de referência
 * externa é aceito na criação, a correlação é sempre pelo `id` da resposta).
 * Por isso este mapa separado, guardado no momento em que o PIX é criado.
 */
const pixPorPagamentoCakto: Map<string, { referencia: string; expiresAt: number }> =
  (globalRef.__desvendaPix ??= new Map());

function sweepPix() {
  const now = Date.now();
  for (const [id, entry] of pixPorPagamentoCakto) {
    if (entry.expiresAt <= now) pixPorPagamentoCakto.delete(id);
  }
}

export function registrarPagamentoCakto(paymentId: string, referencia: string) {
  sweepPix();
  pixPorPagamentoCakto.set(paymentId, { referencia, expiresAt: Date.now() + TTL_MS });
}

export function referenciaPorPagamentoCakto(paymentId: string): string | null {
  sweepPix();
  return pixPorPagamentoCakto.get(paymentId)?.referencia ?? null;
}

export function create(
  init: Pick<AnalysisState, "id" | "advancedPreSelected" | "demo">,
) {
  sweep();
  const state: AnalysisState = {
    ...init,
    status: "processing",
    bumpSelected: false,
    advancedPaid: false,
    amountCents: BASE_CENTS,
    funil: {},
  };
  const entry: Entry = { state, expiresAt: Date.now() + TTL_MS };
  db.set(init.id, entry);
  saveTmp(init.id, entry);
  return state;
}

export function get(id: string): AnalysisState | null {
  sweep();
  const found = db.get(id) ?? readTmp(id);
  if (found) return found.state;

  // Auto-recuperação para instâncias serverless (Vercel cold start)
  // Mantém em estado 'processing' até que o N8n (ou agente de IA) efetue o callback real com o relatório.
  if (id && typeof id === "string" && id.length > 5) {
    return create({ id, advancedPreSelected: true, demo: !process.env.CAKTO_CHECKOUT_URL });
  }

  return null;
}

function patch(id: string, next: Partial<AnalysisState>) {
  let entry = db.get(id) ?? readTmp(id);
  if (!entry) return null;
  entry.state = { ...entry.state, ...next };
  db.set(id, entry);
  saveTmp(id, entry);
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

/** Quantas seções reais viram prévia, antes do resto ficar trancado. */
const AMOSTRAS = 3;

/** Chamado pelo callback do N8n quando a IA termina. */
export function markReady(id: string, report: Report) {
  let entry = db.get(id) ?? readTmp(id);
  if (!entry) {
    create({ id, advancedPreSelected: true, demo: false });
    entry = db.get(id)!;
  }

  const gratis = modoGratis();
  const jaPago = entry.state.status === "paid";

  return patch(id, {
    status: jaPago || gratis ? "paid" : "ready",
    // No modo grátis nada é cobrado, então a avançada também sai liberada:
    // deixar ela trancada aqui seria vender sem cobrar.
    advancedPaid: entry.state.advancedPaid || gratis,
    report,
    preview: {
      headline: report.headline,
      patternCount: report.patternCount,
      sectionTitles: report.sections.map((s) => s.title),
      previewSections: report.sections.slice(0, AMOSTRAS).map((s) => ({
        title: s.title,
        excerpt: truncar(s.body),
        icon: s.icon,
      })),
    },
  });
}

/**
 * Corta o texto real da análise no fim de uma palavra, interrompendo a conclusão
 * com "..." para criar curiosidade sobre o restante do contexto no relatório.
 */
function truncar(texto: string, max = 135): string {
  const limpo = texto.trim();
  const pontoCorte = limpo.length > max ? max : Math.max(40, Math.floor(limpo.length * 0.75));
  const sub = limpo.slice(0, pontoCorte);
  const ultimoEspaco = sub.lastIndexOf(" ");
  const trecho = sub.slice(0, ultimoEspaco > 20 ? ultimoEspaco : sub.length).replace(/[\.\,\;\:\!\?\s]+$/, "");

  return `${trecho} ...`;
}

export function markFailed(id: string, error: string) {
  let entry = db.get(id) ?? readTmp(id);
  if (!entry) {
    create({ id, advancedPreSelected: true, demo: false });
  }
  return patch(id, { status: "failed", error });
}

/** Posição na fila, para a tela de carregamento saber o que dizer. */
export function setQueuePos(id: string, queuePos: number) {
  return patch(id, { queuePos });
}

/** Marca ou desmarca o order bump e recalcula o valor do pedido principal. */
export function setBump(id: string, bumpSelected: boolean) {
  const state = get(id);
  if (!state) return null;
  // Quem já pagou a avançada não tem bump nenhum a marcar.
  const marcado = state.advancedPaid ? false : bumpSelected;
  return patch(id, {
    bumpSelected: marcado,
    amountCents: BASE_CENTS + (marcado ? UPSELL_CENTS : 0),
    // O valor mudou: a cobrança aberta não vale mais.
    charge: undefined,
  });
}

export function attachCharge(id: string, charge: Charge, unlock: Unlock) {
  return patch(id, unlock === "av" ? { chargeAvancada: charge } : { charge });
}

/**
 * Aplica o que uma cobrança confirmada libera.
 *
 * É o único caminho para `status: "paid"` e para `advancedPaid`. Chamado pelo
 * postback do gateway e pelo atalho de demonstração — nunca pelo navegador.
 */
export function aplicarUnlock(id: string, unlock: Unlock) {
  const state = get(id);
  if (!state) return null;

  return patch(id, {
    status: unlock === "av" ? state.status : "paid",
    advancedPaid: unlock === "rel" ? state.advancedPaid : true,
  });
}

/** Guarda por onde a pessoa já passou, para nenhuma oferta se repetir. */
export function marcarFunil(id: string, flags: FunilFlags) {
  const state = get(id);
  if (!state) return null;
  return patch(id, { funil: { ...state.funil, ...flags } });
}

/**
 * Versão segura para o navegador.
 *
 * Duas travas, nesta ordem:
 *  1. o relatório inteiro só acompanha a resposta depois do pagamento;
 *  2. a seção avançada sai fora enquanto ela não tiver sido paga, mesmo com o
 *     relatório já liberado.
 *
 * As duas moram aqui, e não no componente, porque o navegador é do cliente:
 * o que sair daqui, ele lê.
 */
export function forClient(state: AnalysisState): AnalysisState {
  // A variante da oferta é lida aqui, no servidor, e desce junto com o estado.
  const comFlag = {
    ...state,
    ofertaRecuperacao: OFERTA_RECUPERACAO_ATIVA,
    precisaDadosCliente: pixNativoConfigurado(),
  };

  if (comFlag.status !== "paid") {
    const { report: _retido, ...resto } = comFlag;
    return resto;
  }

  if (comFlag.advancedPaid || !comFlag.report?.advanced) return comFlag;

  const { advanced: _naoPago, ...relatorioSemAvancada } = comFlag.report;
  return { ...comFlag, report: relatorioSemAvancada };
}
