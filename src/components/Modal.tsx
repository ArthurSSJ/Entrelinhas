"use client";

import { useEffect, useRef } from "react";

export default function Modal({
  titulo,
  onFechar,
  children,
}: {
  titulo: string;
  onFechar: () => void;
  children: React.ReactNode;
}) {
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    document.addEventListener("keydown", aoTeclar);

    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheet.current?.focus();

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = anterior;
    };
  }, [onFechar]);

  return (
    <div className="modal-veil" onClick={onFechar} role="presentation">
      <div
        ref={sheet}
        className="modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="t-h3">{titulo}</h2>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="-mt-1 grid h-9 w-9 flex-none place-items-center rounded-full bg-[#FFF8F5] text-[#6B6570] transition hover:bg-[#FFD6E0]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden focusable="false">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
