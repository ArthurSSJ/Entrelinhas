import type { Metadata } from "next";
import Perguntas from "./Perguntas";
import { MARCA } from "@/lib/marca";

export const metadata: Metadata = {
  title: `Sobre vocês dois · ${MARCA}`,
  description: "Quatro perguntas rápidas antes da leitura. Nada disso vira cadastro.",
};

export default function PaginaPerguntas() {
  return <Perguntas />;
}
