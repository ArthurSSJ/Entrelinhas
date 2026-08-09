import Cabecalho from "@/components/Cabecalho";
import Hero from "@/components/Hero";
import Exemplos from "@/components/Exemplos";
import Depoimentos from "@/components/Depoimentos";
import ComoFunciona from "@/components/ComoFunciona";
import PreviaRelatorio from "@/components/PreviaRelatorio";
import OQueRecebe from "@/components/OQueRecebe";
import Confianca from "@/components/Confianca";
import Perguntas from "@/components/Perguntas";
import CtaFinal from "@/components/CtaFinal";
import CtaFlutuante from "@/components/CtaFlutuante";
import Rodape from "@/components/Rodape";

/**
 * A ordem é uma jornada, não um índice do produto:
 *
 *   curiosidade   Hero, Exemplos      — o que dá para descobrir
 *   identificação ComoFunciona        — e como isso chega até mim
 *   desejo        Prévia, O que vem   — o formato e o conteúdo do achado
 *   ação          Privacidade, FAQ    — as travas que sobraram
 *                 CtaFinal            — preço e decisão no mesmo lugar
 *
 * `Depoimentos` mora aqui e não renderiza nada: a lista está vazia de
 * propósito até existir gente de verdade para citar. O lugar já é este.
 */
export default function Home() {
  return (
    <>
      <Cabecalho modo="home" />
      <main>
        <Hero />
        <Exemplos />
        <Depoimentos />
        <ComoFunciona />
        <PreviaRelatorio />
        <OQueRecebe />
        <Confianca />
        <Perguntas />
        <CtaFinal />
      </main>
      <Rodape largo />
      <CtaFlutuante />
    </>
  );
}
