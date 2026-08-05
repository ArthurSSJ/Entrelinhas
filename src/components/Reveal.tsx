"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Entrada suave ao rolar. Um observador por elemento, desligado após aparecer.
 *
 * `dir` faz o bloco entrar do lado em que ele mora na composição: a coluna da
 * direita vem da direita. Serve para a leitura, não para enfeite, e some
 * inteiro sob `prefers-reduced-motion`.
 */
export default function Reveal({
  children,
  delay = 0,
  dir,
  as = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  dir?: "esq" | "dir";
  /** `li` quando o bloco mora dentro de uma lista: `ol`/`ul` não aceitam `div`. */
  as?: "div" | "li";
  className?: string;
}) {
  const alvo = useRef<HTMLElement | null>(null);

  const guardar = useCallback((el: HTMLElement | null) => {
    alvo.current = el;
  }, []);

  useEffect(() => {
    const el = alvo.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const props = {
    ref: guardar,
    "data-dir": dir,
    className: `reveal ${className}`,
    style: { transitionDelay: `${delay}ms` },
  };

  return as === "li" ? <li {...props}>{children}</li> : <div {...props}>{children}</div>;
}
