import Cabecalho from "@/components/Cabecalho";
import Hero from "@/components/Hero";
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
import Rodape from "@/components/Rodape";

export default function Home() {
  return (
    <>
      <Cabecalho />
      <main>
        <Hero />
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
      <Rodape />
      <CtaFlutuante />
    </>
  );
}
