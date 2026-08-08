"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AnalysisState } from "@/lib/types";
import EtapaProcessando from "@/components/EtapaProcessando";
import EtapaPagamento from "@/components/EtapaPagamento";
import EtapaRelatorio from "@/components/EtapaRelatorio";
import EtapaFalhou from "@/components/EtapaFalhou";
import { CHAVE_ANALISE } from "@/lib/marca";
import { limparRespostas } from "@/lib/perguntas";

type Etapa = "carregando" | "processando" | "pagamento" | "liberado" | "falhou" | "sumiu";

const INTERVALO_MS = 2500;

/**
 * A parte do fluxo que acontece depois do envio. Tem URL própria de propósito:
 * a pessoa pode fechar a aba, voltar do checkout ou abrir no computador que a
 * análise continua no mesmo lugar.
 */
export default function Acompanhar({ id }: { id: string }) {
  const [etapa, setEtapa] = useState<Etapa>("carregando");
  const [estado, setEstado] = useState<AnalysisState | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Evita abrir duas cobranças se duas consultas voltarem juntas.
  const cobrancaPedida = useRef(false);

  const abrirCobranca = useCallback(async () => {
    if (cobrancaPedida.current) return;
    cobrancaPedida.current = true;

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      cobrancaPedida.current = false;
      const { error } = (await res.json().catch(() => ({}))) as { error?: string };
      setErro(error ?? "Não conseguimos abrir o pagamento agora.");
      return;
    }

    const dados = (await res.json()) as Pick<AnalysisState, "charge">;
    setEstado((atual) => (atual ? { ...atual, charge: dados.charge } : atual));
  }, [id]);

  useEffect(() => {
    let ativo = true;
    let timer = 0;

    const consultar = async () => {
      const res = await fetch(`/api/analyze/${id}`, { cache: "no-store" });
      if (!ativo) return;

      if (res.status === 404) {
        setEtapa("sumiu");
        window.clearInterval(timer);
        return;
      }
      if (!res.ok) return;

      const dados = (await res.json()) as AnalysisState;
      setEstado((atual) => ({ ...dados, charge: dados.charge ?? atual?.charge }));

      if (dados.status === "processing") {
        setEtapa("processando");
      } else if (dados.status === "ready") {
        setEtapa("pagamento");
        void abrirCobranca();
      } else if (dados.status === "paid") {
        setEtapa("liberado");
        window.localStorage.removeItem(CHAVE_ANALISE);
        limparRespostas();
        window.clearInterval(timer);
      } else if (dados.status === "failed") {
        setEtapa("falhou");
        setErro(dados.error ?? null);
        window.clearInterval(timer);
      }
    };

    void consultar();
    timer = window.setInterval(consultar, INTERVALO_MS);

    return () => {
      ativo = false;
      window.clearInterval(timer);
    };
  }, [id, abrirCobranca]);

  if (etapa === "carregando") {
    return <p className="t-legenda py-16 text-center">Abrindo sua análise…</p>;
  }

  if (etapa === "sumiu") {
    return (
      <EtapaFalhou
        mensagem="Esta análise não está mais disponível. Os relatórios ficam abertos por duas horas."
        onRecomecar={() => {
          window.localStorage.removeItem(CHAVE_ANALISE);
          window.location.href = "/analise";
        }}
      />
    );
  }

  return (
    <>
      {etapa === "processando" && <EtapaProcessando fila={estado?.queuePos ?? 0} />}
      {etapa === "pagamento" && estado && (
        <EtapaPagamento estado={estado} erro={erro} onRecomecar={recomecar} />
      )}
      {etapa === "liberado" && estado?.report && <EtapaRelatorio estado={estado} />}
      {etapa === "falhou" && <EtapaFalhou mensagem={erro} onRecomecar={recomecar} />}
    </>
  );
}

function recomecar() {
  window.localStorage.removeItem(CHAVE_ANALISE);
  limparRespostas();
  window.location.href = "/analise";
}
