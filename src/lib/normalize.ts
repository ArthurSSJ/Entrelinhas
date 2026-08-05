import type { Acao, AdvancedSection, Report, ReportSection } from "./types";

/**
 * Converte o que o N8n devolver num relatório com forma conhecida.
 *
 * Aceita três formatos, do mais estruturado para o mais solto:
 *  - objeto já no formato esperado;
 *  - objeto com { texto } ou { output } em markdown, quebrado por títulos "##";
 *  - qualquer um dos dois embrulhado em { data } ou num array de um item só.
 */
export function normalizeReport(input: unknown): Report | null {
  const raw = unwrap(input);
  if (!raw) return null;

  const markdown = firstString(raw, ["texto", "output", "text", "markdown", "relatorio"]);
  const sections = Array.isArray(raw.sections)
    ? raw.sections.map(toSection).filter((s): s is ReportSection => s !== null)
    : markdown
      ? fromMarkdown(markdown)
      : [];

  if (sections.length === 0) return null;

  const headline =
    firstString(raw, ["headline", "titulo", "title"]) ?? "Sua análise está pronta.";
  const summary = firstString(raw, ["summary", "resumo"]) ?? "";
  const count = Number(raw.patternCount ?? raw.padroes);

  return {
    headline,
    summary,
    patternCount: Number.isFinite(count) && count > 0 ? Math.round(count) : sections.length,
    sections,
    acoes: toAcoes(raw.acoes ?? raw.actions ?? raw.proximosPassos),
    advanced: toAdvanced(raw.advanced ?? raw.avancada),
  };
}

function toAcoes(value: unknown): Acao[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const acoes = value
    .map((item) => {
      // Aceita tanto { titulo, texto } quanto uma frase solta.
      if (typeof item === "string" && item.trim()) {
        return { titulo: "", texto: item.trim() };
      }
      if (!item || typeof item !== "object") return null;
      const obj = item as Record<string, unknown>;
      const texto = firstString(obj, ["texto", "body", "descricao", "text"]);
      if (!texto) return null;
      return { titulo: firstString(obj, ["titulo", "title"]) ?? "", texto };
    })
    .filter((a): a is Acao => a !== null);

  return acoes.length ? acoes : undefined;
}

function unwrap(input: unknown): Record<string, unknown> | null {
  let node = input;
  if (Array.isArray(node)) node = node[0];
  if (!node || typeof node !== "object") return null;

  const obj = node as Record<string, unknown>;
  const inner = obj.data ?? obj.json ?? obj.body;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return { ...(inner as Record<string, unknown>), ...obj };
  }
  return obj;
}

function toSection(value: unknown): ReportSection | null {
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  const title = firstString(obj, ["title", "titulo"]);
  const body = firstString(obj, ["body", "texto", "conteudo", "content"]);
  if (!title || !body) return null;
  const icon = firstString(obj, ["icon", "icone"]);
  return icon ? { title, body, icon } : { title, body };
}

function toAdvanced(value: unknown): AdvancedSection | null {
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  const body = firstString(obj, ["body", "texto", "conteudo"]);
  if (!body) return null;
  const level = String(obj.level ?? obj.nivel ?? "baixo").toLowerCase();
  return {
    title: firstString(obj, ["title", "titulo"]) ?? "Análise avançada de traição",
    body,
    level: level === "alto" || level === "medio" ? level : "baixo",
  };
}

/** Quebra markdown em seções pelos títulos de nível 2 ou 3. */
function fromMarkdown(markdown: string): ReportSection[] {
  return markdown
    .split(/^\s*#{2,3}\s+/m)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [head, ...rest] = block.split("\n");
      const body = rest.join("\n").trim();
      return body ? { title: head.trim(), body } : null;
    })
    .filter((s): s is ReportSection => s !== null);
}

function firstString(obj: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}
