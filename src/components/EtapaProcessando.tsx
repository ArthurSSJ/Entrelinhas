"use client";

import { useEffect, useState } from "react";
import Icon3D, { type IconName } from "./Icon3D";

const etapas = [
  "Enviando sua conversa…",
  "Lendo do começo ao fim…",
  "Encontrando os padrões…",
  "Escrevendo o que dá para dizer…",
  "Quase pronto…",
];

/** Ícones em órbita, um por assunto da leitura. */
const satelites: { icon: IconName; angulo: number }[] = [
  { icon: "conversa", angulo: 0 },
  { icon: "coracao", angulo: 90 },
  { icon: "lupa", angulo: 180 },
  { icon: "brilho", angulo: 270 },
];

export default function EtapaProcessando({ fila = 0 }: { fila?: number }) {
  const [passo, setPasso] = useState(0);
  const [progresso, setProgresso] = useState(6);

  useEffect(() => {
    const troca = window.setInterval(() => {
      setPasso((p) => Math.min(p + 1, etapas.length - 1));
    }, 4200);

    // A barra avança devagar e para em 92%: os últimos 8% são a resposta real.
    const barra = window.setInterval(() => {
      setProgresso((p) => (p >= 92 ? 92 : p + Math.max(0.6, (92 - p) * 0.06)));
    }, 420);

    return () => {
      window.clearInterval(troca);
      window.clearInterval(barra);
    };
  }, []);

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

      <h2 className="t-h2 mt-7" aria-live="polite">
        {fila > 0 ? "Sua vez está chegando…" : etapas[passo]}
      </h2>
      <p className="mt-2 text-[#B7A2AA]">
        {fila > 0
          ? `Tem ${fila === 1 ? "mais uma conversa" : `mais ${fila} conversas`} sendo lida agora. A sua entra em seguida.`
          : "Isso costuma levar menos de um minuto. Pode deixar a tela aberta."}
      </p>

      <div className="progress-track mx-auto mt-7 max-w-[320px]">
        <div className="progress-fill" style={{ width: `${progresso}%` }} />
      </div>

      <p className="t-legenda mx-auto mt-6 flex max-w-[36ch] items-center justify-center gap-2 rounded-2xl bg-white/6 px-4 py-3">
        <Icon3D name="cadeado" size={22} className="flex-none" />
        Sua conversa é apagada assim que a leitura acabar.
      </p>
    </div>
  );
}
