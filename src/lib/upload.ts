export const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
export const MIN_BYTES = 200; // conversas menores que isso não têm o que analisar

export type FileCheck = { ok: true } | { ok: false; message: string };

/** Validação de arquivo. Mesmas regras no navegador e no servidor. */
export function checkFile(file: { name: string; size: number }): FileCheck {
  const lower = file.name.toLowerCase();
  const isTxt = lower.endsWith(".txt");
  const isZip = lower.endsWith(".zip");

  if (!isTxt && !isZip) {
    return {
      ok: false,
      message: "Formato não aceito. Envie o arquivo .txt ou .zip exportado do WhatsApp.",
    };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      message: "O arquivo passou de 20 MB. Exporte a conversa sem mídia para ficar bem menor.",
    };
  }
  if (file.size < MIN_BYTES) {
    return { ok: false, message: "Essa conversa está curta demais para encontrar padrões." };
  }
  return { ok: true };
}

/** 184320 -> "180 KB" */
export function readableSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
