import type { Metadata } from "next";
import Perguntas from "./Perguntas";

export const metadata: Metadata = {
  title: "Sobre vocês dois · Entrelinhas",
  description: "Quatro perguntas rápidas antes da leitura. Nada disso vira cadastro.",
};

export default function PaginaPerguntas() {
  return <Perguntas />;
}
