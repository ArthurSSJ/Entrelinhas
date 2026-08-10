"use client";

import Image from "next/image";
import Icon3D from "./Icon3D";

/**
 * O respiro entre a leitura e a prévia.
 *
 * Existe por um motivo de ritmo: a tela de processamento some sozinha quando o
 * servidor responde, e cair direto nos achados tira da pessoa o instante em
 * que ela percebe que acabou. Esta tela dura o clique dela, não um timer.
 *
 * O subtítulo fala de "alguns padrões" sem número: o número existe no
 * relatório e aparece na prévia, onde é medido. Aqui ele seria enfeite.
 */
export default function EtapaConcluida({ onVerPrevia }: { onVerPrevia: () => void }) {
  return (
    <div className="stage text-center">
      <Image
        src="/render/coracao.png"
        alt=""
        width={760}
        height={760}
        aria-hidden
        className="animate-float-slow mx-auto w-[112px] drop-shadow-[0_18px_44px_rgba(255,48,104,0.42)]"
      />

      <span className="eyebrow mt-5">
        <Icon3D name="brilho" size={18} />
        Leitura concluída
      </span>

      <h2 className="t-h2 mt-3">Análise concluída.</h2>
      <p className="mx-auto mt-2 max-w-[40ch] text-[#B7A2AA]">
        Encontramos alguns padrões que merecem uma análise mais cuidadosa.
      </p>

      <button
        type="button"
        className="btn btn-neon btn-lg btn-block mt-8"
        onClick={onVerPrevia}
        autoFocus
      >
        Ver minha prévia
      </button>

      <p className="t-legenda mt-3">Você lê uma parte antes de decidir qualquer coisa.</p>
    </div>
  );
}
