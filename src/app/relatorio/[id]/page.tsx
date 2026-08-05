import type { Metadata } from "next";
import Acompanhar from "./Acompanhar";

export const metadata: Metadata = {
  title: "Sua análise — Entrelinhas",
  description: "A leitura da sua conversa.",
  robots: { index: false, follow: false },
};

export default async function PaginaRelatorio({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Acompanhar id={id} />;
}
