"use client";

import { useEffect, useState } from "react";
import Icon3D, { type IconName } from "./Icon3D";

const pecas: IconName[] = ["coracao", "brilho", "coracao", "presente", "brilho", "coracao"];

/** Comemoração curta na liberação do relatório. Some sozinha e não volta. */
export default function Confete() {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setVisivel(false), 2800);
    return () => window.clearTimeout(t);
  }, []);

  if (!visivel) return null;

  return (
    <div className="confetti" aria-hidden>
      {pecas.map((peca, i) => (
        <span
          key={i}
          style={{
            left: `${8 + i * 16}%`,
            animationDelay: `${i * 0.12}s`,
            ["--spin" as string]: `${i % 2 ? 40 : -40}deg`,
          }}
        >
          <Icon3D name={peca} size={i % 2 ? 30 : 40} />
        </span>
      ))}
    </div>
  );
}
