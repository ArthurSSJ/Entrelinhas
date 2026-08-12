const ETAPAS = ["Contexto", "Conversa", "Análise", "Resultado"] as const;

/**
 * Barra de progresso do funil com curva de aceleração psicológica:
 * - Etapa 1 (Quiz / Contexto): 20% a 78% (acelera rápido durante as 4 perguntas)
 * - Etapa 2 (Conversa / Tutorial e Envio): 78% a 90% (saltos curtos até ~90%)
 * - Etapa 3 (Análise): 90% a 97% (sensação iminente de conclusão)
 * - Etapa 4 (Resultado): 100% (leitura final)
 */
export default function ProgressoFunil({
  etapa,
  sub = 0,
}: {
  etapa: 1 | 2 | 3 | 4;
  sub?: number;
}) {
  const clampSub = Math.max(0, Math.min(1, sub));

  let percentual = 20;

  if (etapa === 1) {
    // Quiz: inicia em 20% e avança acelerado até 78%
    percentual = 20 + clampSub * 58;
  } else if (etapa === 2) {
    // Conversa (Tutorial + Enviar): avança de 78% até 90%
    percentual = 78 + clampSub * 12;
  } else if (etapa === 3) {
    // Análise: avança de 90% até 97%
    percentual = 90 + clampSub * 7;
  } else if (etapa === 4) {
    // Resultado final: 100%
    percentual = 97 + clampSub * 3;
  }

  const valorFinal = Math.min(100, Math.round(percentual));

  return (
    <div className="mb-7">
      <div
        className="progresso-trilho"
        role="progressbar"
        aria-valuenow={valorFinal}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso da avaliação"
      >
        <span className="progresso-fill" style={{ width: `${valorFinal}%` }} />
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
