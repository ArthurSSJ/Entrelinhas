import type { Metadata } from "next";
import Enviar from "./Enviar";

export const metadata: Metadata = {
  title: "Enviar a conversa · Entrelinhas",
  description: "Solte o arquivo .txt exportado do WhatsApp.",
};

export default function PaginaEnviar() {
  return <Enviar />;
}
