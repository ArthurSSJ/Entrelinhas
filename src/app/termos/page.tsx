import type { Metadata } from "next";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import Icon3D from "@/components/Icon3D";

export const metadata: Metadata = {
  title: "Termos de uso · Entrelinhas",
  description: "As regras do serviço, em português claro.",
};

export default function Termos() {
  return (
    <>
      <Cabecalho />
      <main className="band">
        <article className="shell report-body">
          <Icon3D name="escudo" size={64} />
          <h1 className="t-h1 mt-4">Termos de uso</h1>
          <p className="t-legenda">Última atualização: 5 de agosto de 2026.</p>

          <h2 className="t-h2 mt-8">O que o Entrelinhas faz</h2>
          <p>
            O serviço lê um histórico de conversa que você envia e devolve um relatório com padrões
            encontrados nesse texto: quem inicia as conversas, como o tom muda ao longo do tempo,
            quais assuntos ficam sem conclusão, e assim por diante.
          </p>

          <h2 className="t-h2 mt-8">O que ele não faz</h2>
          <p>
            O relatório não é um diagnóstico, não é prova de nada e não substitui terapia,
            aconselhamento ou orientação jurídica. Ele descreve o que está escrito na conversa e
            nada além disso. A análise avançada de traição aponta sinais no texto, e não afirma nem
            desmente que alguém tenha feito algo.
          </p>

          <h2 className="t-h2 mt-8">Uso responsável</h2>
          <p>
            Envie apenas conversas das quais você participou. É proibido usar o serviço para
            vigiar, constranger, chantagear ou expor outra pessoa. Contas e acessos usados dessa
            forma podem ser bloqueados.
          </p>

          <h2 className="t-h2 mt-8">Pagamento e reembolso</h2>
          <p>
            A cobrança acontece depois que a leitura termina, antes de o relatório ser liberado. Se
            a leitura falhar, nada é cobrado. Se o relatório for liberado e vier claramente
            quebrado, escreva para{" "}
            <a href="mailto:oi@entrelinhas.app" className="underline underline-offset-4">
              oi@entrelinhas.app
            </a>{" "}
            em até sete dias e devolvemos o valor.
          </p>

          <h2 className="t-h2 mt-8">Disponibilidade</h2>
          <p>
            O serviço pode ficar fora do ar para manutenção ou por falha de terceiros. Fazemos o
            possível para que isso seja raro e curto, mas não prometemos funcionamento
            ininterrupto.
          </p>

          <h2 className="t-h2 mt-8">Idade mínima</h2>
          <p>O serviço é destinado a maiores de 18 anos.</p>

          <p className="t-legenda mt-10 bloco px-4 py-3">
            Este texto descreve o funcionamento do produto e serve como base. Antes de colocar no
            ar, peça a revisão de alguém da área jurídica.
          </p>
        </article>
      </main>
      <Rodape />
    </>
  );
}
