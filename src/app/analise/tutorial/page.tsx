import type { Metadata } from "next";
import Tutorial from "./Tutorial";
import { MARCA } from "@/lib/marca";

export const metadata: Metadata = {
  title: `Como exportar a conversa · ${MARCA}`,
  description: "Passo a passo para exportar o histórico do WhatsApp em .txt.",
};

export default function PaginaTutorial() {
  return <Tutorial />;
}
