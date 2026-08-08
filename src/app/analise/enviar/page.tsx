import type { Metadata } from "next";
import Enviar from "./Enviar";
import { MARCA } from "@/lib/marca";

export const metadata: Metadata = {
  title: `Enviar a conversa · ${MARCA}`,
  description: "Solte o arquivo .txt exportado do WhatsApp.",
};

export default function PaginaEnviar() {
  return <Enviar />;
}
