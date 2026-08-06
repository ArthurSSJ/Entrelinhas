import type { Metadata } from "next";
import Perguntas from "./Perguntas";

export const metadata: Metadata = {
  title: "Sobre vocês dois · Entrelinhas",
  description: "Quatro perguntas rápidas antes de ler a conversa.",
};

export default function PaginaPerguntas() {
  return <Perguntas />;
}
