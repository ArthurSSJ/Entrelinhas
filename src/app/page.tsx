import type { Viewport } from "next";
import CabecalhoNoite from "@/components/CabecalhoNoite";
import Hero from "@/components/Hero";
import FaixaGarantias from "@/components/FaixaGarantias";
import Reconhecimento from "@/components/Reconhecimento";
import ComoFunciona from "@/components/ComoFunciona";
import OQueRecebe from "@/components/OQueRecebe";
import Avancada from "@/components/Avancada";
import Objecoes from "@/components/Objecoes";
import Depoimentos from "@/components/Depoimentos";
import Confianca from "@/components/Confianca";
import Preco from "@/components/Preco";
import Perguntas from "@/components/Perguntas";
import CtaFinal from "@/components/CtaFinal";
import CtaFlutuante from "@/components/CtaFlutuante";
import RodapeNoite from "@/components/RodapeNoite";

/* A home é escura do topo ao rodapé; a barra do navegador acompanha. */
export const viewport: Viewport = {
  themeColor: "#0B0407",
  width: "device-width",
  initialScale: 1,
};

export default function Home() {
  return (
    <div className="noite">
      <CabecalhoNoite />
      <main>
        <Hero />
        <FaixaGarantias />
        <Reconhecimento />
        <ComoFunciona />
        <OQueRecebe />
        <Avancada />
        <Objecoes />
        <Depoimentos />
        <Confianca />
        <Preco />
        <Perguntas />
        <CtaFinal />
      </main>
      <RodapeNoite />
      <CtaFlutuante />
    </div>
  );
}
