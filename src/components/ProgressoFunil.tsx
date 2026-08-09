const ETAPAS = ["Contexto", "Conversa", "Análise", "Resultado"] as const;

/**
 * Barra de progresso do funil inteiro, não só da tela em que a pessoa está.
 * Mostra as quatro etapas — contexto, conversa, análise, resultado — para que
 * a resposta a uma pergunta pareça um passo dentro de uma avaliação maior, e
 * não o preenchimento de mais um campo de formulário.
 *
 * `sub` é o quanto da etapa atual já foi percorrido (0 a 1). O preenchimento é
 * contínuo: cada resposta move a barra, em vez de acender um ponto por vez.
 */
export default function ProgressoFunil({
  etapa,
  sub = 0,
}: {
  etapa: 1 | 2 | 3 | 4;
  sub?: number;
}) {
  const fatia = 100 / ETAPAS.length;
  const percentual = (etapa - 1) * fatia + Math.max(0, Math.min(1, sub)) * fatia;

  return (
    <div className="mb-7">
      <div
        className="progresso-trilho"
        role="progressbar"
        aria-valuenow={Math.round(percentual)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso da avaliação"
      >
        <span className="progresso-fill" style={{ width: `${percentual}%` }} />
      </div>

      <ol className="progresso-legenda">
        {ETAPAS.map((nome, i) => {
          const n = i + 1;
          const status = n < etapa ? "feita" : n === etapa ? "atual" : "futura";
          return (
            <li key={nome} data-status={status}>
              {n}. {nome}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
