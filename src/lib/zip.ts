import { unzipSync, strFromU8 } from "fflate";

/**
 * Extrai o arquivo .txt de conversa de dentro de um arquivo .zip do WhatsApp.
 * 
 * O Android e algumas ferramentas costumam gerar zips como `Conversa do WhatsApp com X.zip`
 * contendo um `_chat.txt` ou `Conversa do WhatsApp com X.txt`.
 */
export async function extractTxtFromZip(zipFile: File): Promise<{ name: string; text: string }> {
  try {
    const arrayBuffer = await zipFile.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const unzipped = unzipSync(bytes);

    const entries = Object.keys(unzipped);
    // Procura por qualquer arquivo .txt que não seja meta-dados de sistema (__MACOSX, etc)
    const txtFilename = entries.find(
      (name) => name.toLowerCase().endsWith(".txt") && !name.startsWith("__MACOSX") && !name.startsWith("."),
    );

    if (!txtFilename) {
      throw new Error("Não encontramos nenhum arquivo .txt de conversa dentro desse .zip.");
    }

    const fileBytes = unzipped[txtFilename];
    const text = strFromU8(fileBytes);
    const cleanName = txtFilename.split("/").pop() ?? txtFilename;

    return { name: cleanName, text };
  } catch (err) {
    if (err instanceof Error && err.message.includes(".txt")) {
      throw err;
    }
    throw new Error("Não foi possível ler o arquivo .zip. Verifique se ele está corrompido.");
  }
}
