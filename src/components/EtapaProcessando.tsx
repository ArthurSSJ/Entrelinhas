"use client";

import { useEffect, useState } from "react";
import Icon3D, { type IconName } from "./Icon3D";

/**
 * As frentes da leitura, na ordem em que o relatório é montado.
 *
 * Elas descrevem o trabalho de verdade — as seis seções que o agente escreve —
 * mas o servidor não avisa em qual delas está. Por isso a lista aparece como
 * roteiro do que está sendo feito, com uma delas em destaque, e nunca como
 * uma sequência de tarefas concluídas: marcar "Organizando o histórico" como
 * pronto seria afirmar um passo técnico que ninguém confirmou.
 */
const FRENTES = [
  "Organizando o histórico",
  "Analisando padrões de comunicação",
  "Observando reciprocidade",
  "Identificando pontos de atenção",
  "Preparando seu relatório",
  "Finalizando análise",
];

/** Ícones em órbita, um por assunto da leitura. */
const satelites: { icon: IconName; angulo: number }[] = [
  { icon: "conversa", angulo: 0 },
  { icon: "coracao", angulo: 90 },
  { icon: "lupa", angulo: 180 },
  { icon: "brilho", angulo: 270 },
];

export default function EtapaProcessando({ fila = 0 }: { fila?: number }) {
  const [emFoco, setEmFoco] = useState(0);

  useEffect(() => {
    const troca = window.setInterval(() => {
      // Circula e não trava na última: é um sinal de vida, não uma barra que
      // chega a 92% e finge que falta pouco.
      setEmFoco((i) => (i + 1) % FRENTES.length);
    }, 2600);
    return () => window.clearInterval(troca);
  }, []);

  const naFila = fila > 0;

  return (
    <div className="stage text-center">
      <div className="orbit mt-2">
        <span className="orbit-ring" aria-hidden />
        <span className="absolute inset-0 grid place-items-center">
          <Icon3D name="coracao" size={64} className="animate-float-slow" />
        </span>
        {satelites.map(({ icon, angulo }) => (
          <span
            key={icon}
            className="orbit-sat"
            style={{ animationDelay: `${(-14 * angulo) / 360}s` }}
            aria-hidden
          >
            <Icon3D name={icon} size={42} />
          </span>
        ))}
      </div>

      <h2 className="t-h2 mt-7">
        {naFila ? "Sua vez está chegando…" : "Estamos analisando sua conversa…"}
      </h2>
      <p className="mx-auto mt-2 max-w-[42ch] text-[#B7A2AA]">
        {naFila
          ? `Tem ${fila === 1 ? "mais uma conversa" : `mais ${fila} conversas`} sendo lida agora. A sua entra em seguida.`
          : "Estamos procurando padrões que seriam difíceis de perceber olhando mensagem por mensagem."}
      </p>

      <ul className="mx-auto mt-8 max-w-[340px] space-y-2 text-left" aria-live="polite">
        {FRENTES.map((frente, i) => {
          const ativa = !naFila && i === emFoco;
          return (
            <li key={frente} className="frente" data-ativa={ativa}>
              <span className="frente-marca" aria-hidden />
              <span className="text-[0.9375rem] leading-snug">{frente}</span>
            </li>
          );
        })}
      </ul>

      <p className="t-legenda mx-auto mt-7 flex max-w-[36ch] items-center justify-center gap-2 rounded-2xl bg-white/6 px-4 py-3">
        <Icon3D name="cadeado" size={22} className="flex-none" />
        Sua conversa é apagada assim que a leitura acabar.
      </p>
    </div>
  );
}
