"use client";

import Icon3D from "./Icon3D";

export default function EtapaFalhou({
  mensagem,
  onRecomecar,
}: {
  mensagem: string | null;
  onRecomecar: () => void;
}) {
  return (
    <div className="stage text-center">
      <Icon3D name="alerta" size={76} className="mx-auto" />
      <h2 className="t-h2 mt-4">A leitura não foi até o fim</h2>
      <p className="mx-auto mt-2 max-w-[40ch] text-[#6B6570]">
        {mensagem ?? "Algo travou no meio do caminho."} Nada foi cobrado e a conversa já foi
        apagada.
      </p>
      <button type="button" className="btn btn-primary btn-lg btn-block mt-6" onClick={onRecomecar}>
        Tentar de novo
      </button>
      <p className="t-legenda mt-3">
        Se acontecer de novo,{" "}
        <a href="mailto:oi@entrelinhas.app" className="underline underline-offset-4">
          escreva pra gente
        </a>
        .
      </p>
    </div>
  );
}
