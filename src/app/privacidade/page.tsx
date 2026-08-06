import type { Metadata } from "next";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import Icon3D from "@/components/Icon3D";

export const metadata: Metadata = {
  title: "Privacidade · Entrelinhas",
  description: "O que acontece com a conversa que você envia.",
};

export default function Privacidade() {
  return (
    <>
      <Cabecalho />
      <main className="band">
        <article className="shell report-body">
          <Icon3D name="cadeado" size={64} />
          <h1 className="t-h1 mt-4">Privacidade</h1>
          <p className="t-legenda">Última atualização: 5 de agosto de 2026.</p>

          <h2 className="t-h2 mt-8">O arquivo que você envia</h2>
          <p>
            O .txt exportado do WhatsApp é recebido, repassado uma única vez para a leitura e
            descartado em seguida. Ele não é gravado em disco, não entra em backup e não fica em
            nenhum banco de dados.
          </p>

          <h2 className="t-h2 mt-8">Quem lê a conversa</h2>
          <p>
            <strong>Nenhuma pessoa lê a sua conversa.</strong> A leitura é automática, e o texto não
            é usado para mais nada. Ela é feita por um modelo de inteligência artificial hospedado
            na Groq: o trecho enviado para lá é processado e devolvido na hora, não fica salvo e não
            serve para treinar nada.
          </p>
          <p>
            Também não mandamos o arquivo inteiro. Antes de qualquer coisa, o histórico é reduzido
            aqui mesmo: contamos o que dá para contar (quem escreve mais, tempo de resposta,
            volume por mês) e enviamos apenas uma amostra do texto, não a conversa completa.
          </p>

          <h2 className="t-h2 mt-8">O relatório</h2>
          <p>
            O texto do relatório fica guardado temporariamente, por até duas horas, só para que
            você consiga abrir e salvar depois de pagar. Passado esse prazo ele é removido
            automaticamente e não há como recuperá-lo.
          </p>

          <h2 className="t-h2 mt-8">O que não coletamos</h2>
          <p>
            Não pedimos cadastro, nome, e-mail ou telefone. Não usamos a sua conversa para treinar
            nada, não a vendemos e não a compartilhamos com ninguém além do serviço que faz a
            leitura, descrito acima.
          </p>

          <h2 className="t-h2 mt-8">Pagamento</h2>
          <p>
            O pagamento é processado por um checkout externo. Os dados do cartão ou da conta são
            tratados lá; nós recebemos apenas a confirmação de que a compra foi aprovada.
          </p>

          <h2 className="t-h2 mt-8">A conversa é de duas pessoas</h2>
          <p>
            Ao enviar um histórico, você está tratando também de mensagens de outra pessoa. Envie
            apenas conversas das quais você participou e use o resultado com esse cuidado em mente.
          </p>

          <h2 className="t-h2 mt-8">Seus direitos</h2>
          <p>
            Como não guardamos dados pessoais identificáveis, não há cadastro para consultar ou
            excluir. Se quiser apagar um relatório antes das duas horas, escreva para{" "}
            <a href="mailto:oi@entrelinhas.app" className="underline underline-offset-4">
              oi@entrelinhas.app
            </a>{" "}
            com o link que você recebeu.
          </p>

          <p className="t-legenda mt-10 bloco px-4 py-3">
            Este texto descreve o funcionamento do produto e serve como base. Antes de colocar no
            ar, peça a revisão de alguém da área jurídica para adequá-lo à LGPD e à realidade da sua
            operação.
          </p>
        </article>
      </main>
      <Rodape />
    </>
  );
}
