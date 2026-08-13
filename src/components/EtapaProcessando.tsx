"use client";

import { useEffect, useState } from "react";
import Icon3D, { type IconName } from "./Icon3D";

const FRENTES = [
  "Organizando o histórico e validando dados",
  "Analisando padrões de comunicação e resposta",
  "Observando reciprocidade e dinâmica de horários",
  "Identificando pontos de atrito e tom das mensagens",
  "Verificando linguagem e sinais de afeto",
  "Finalizando seu relatório exclusivo",
];

const satelites: { icon: IconName; angulo: number }[] = [
  { icon: "conversa", angulo: 0 },
  { icon: "coracao", angulo: 90 },
  { icon: "lupa", angulo: 180 },
  { icon: "brilho", angulo: 270 },
];

interface Props {
  isReady?: boolean;
  onConcluido?: () => void;
  fila?: number;
}

export default function EtapaProcessando({ isReady = false, onConcluido, fila = 0 }: Props) {
  const [passoAtual, setPassoAtual] = useState(0);
  const [concluidos, setConcluidos] = useState<number[]>([]);

  useEffect(() => {
    // Intervalo de avanço: lento durante processamento (2.2s), acelerado quando isReady === true (350ms)
    const intervaloMs = isReady ? 350 : 2200;

    const timer = setTimeout(() => {
      setPassoAtual((atual) => {
        const proximo = atual + 1;

        // Se ainda não estiver ready no backend, segura suavemente no último passo
        if (!isReady && proximo >= FRENTES.length - 1) {
          setConcluidos(Array.from({ length: FRENTES.length - 1 }, (_, i) => i));
          return FRENTES.length - 1;
        }

        if (proximo < FRENTES.length) {
          setConcluidos(Array.from({ length: proximo }, (_, i) => i));
          return proximo;
        } else {
          // Concluiu todos os passos com o relatório pronto
          setConcluidos(Array.from({ length: FRENTES.length }, (_, i) => i));
          setTimeout(() => {
            onConcluido?.();
          }, 600);
          return FRENTES.length - 1;
        }
      });
    }, intervaloMs);

    return () => clearTimeout(timer);
  }, [passoAtual, isReady, onConcluido]);

  // Quando isReady for ativado, avança os passos restantes suavemente
  useEffect(() => {
    if (isReady && passoAtual < FRENTES.length - 1) {
      setPassoAtual((prev) => prev + 1);
    }
  }, [isReady, passoAtual]);

  const totalConcluidos = concluidos.length;
  const progressoPorcentagem = Math.min(
    100,
    Math.round(((totalConcluidos + (isReady ? 1 : 0.4)) / FRENTES.length) * 100)
  );

  return (
    <div className="stage text-center max-w-[480px] mx-auto px-4">
      {/* Ícone 3D Orbitando */}
      <div className="orbit mt-2 mx-auto">
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

      <h2 className="t-h2 mt-7 text-2xl font-bold tracking-tight text-white">
        {fila > 0 ? "Sua vez está chegando…" : "Analisando suas conversas..."}
      </h2>
      <p className="mx-auto mt-2 max-w-[42ch] text-[#B7A2AA] text-sm leading-relaxed">
        {fila > 0
          ? `Há ${fila === 1 ? "mais uma conversa" : `mais ${fila} conversas`} sendo lidas agora. A sua entra em seguida.`
          : "Procurando padrões, dinâmicas de resposta e horários que seriam difíceis de notar manualmente."}
      </p>

      {/* Barra de Progresso com Gradiente */}
      <div className="w-full bg-white/10 rounded-full h-2 mt-6 overflow-hidden p-0.5 border border-white/5">
        <div
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(236,72,153,0.5)]"
          style={{ width: `${progressoPorcentagem}%` }}
        />
      </div>
      <div className="text-right text-[11px] font-semibold text-pink-400 mt-1">
        {progressoPorcentagem}% concluído
      </div>

      {/* Lista de Passos com Checkmarks Verdes */}
      <ul className="mx-auto mt-6 space-y-2.5 text-left" aria-live="polite">
        {FRENTES.map((frente, i) => {
          const estaConcluido = concluidos.includes(i);
          const estaAtivo = i === passoAtual && !estaConcluido;

          return (
            <li
              key={frente}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 ${
                estaConcluido
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                  : estaAtivo
                  ? "bg-white/10 border border-pink-500/40 text-white shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                  : "bg-white/3 border border-white/5 text-[#8E7982]"
              }`}
            >
              <div className="flex-none">
                {estaConcluido ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[11px] font-bold shadow-[0_0_8px_rgba(34,197,94,0.6)]">
                    ✓
                  </span>
                ) : estaAtivo ? (
                  <span className="relative flex h-3 w-3 mx-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white/20 mx-1.5" />
                )}
              </div>

              <span className="text-[0.9rem] font-medium leading-snug">{frente}</span>
            </li>
          );
        })}
      </ul>

      <p className="t-legenda mx-auto mt-7 flex max-w-[36ch] items-center justify-center gap-2 rounded-2xl bg-white/6 px-4 py-3 border border-white/5 text-xs text-[#B7A2AA]">
        <Icon3D name="cadeado" size={20} className="flex-none" />
        Sua conversa é apagada assim que a leitura terminar.
      </p>
    </div>
  );
}
