"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AnalysisState, OrigemAvancada } from "@/lib/types";
import type { ClienteDados } from "@/lib/cliente";
import EtapaProcessando from "@/components/EtapaProcessando";
import EtapaConcluida from "@/components/EtapaConcluida";
import EtapaPrevia from "@/components/EtapaPrevia";
import EtapaPagamento from "@/components/EtapaPagamento";
import EtapaUpsell from "@/components/EtapaUpsell";
import EtapaDownsell from "@/components/EtapaDownsell";
import EtapaRelatorio from "@/components/EtapaRelatorio";
import EtapaFalhou from "@/components/EtapaFalhou";
import PopupSaida from "@/components/PopupSaida";
import { useExitIntent } from "@/hooks/useExitIntent";
import { CHAVE_ANALISE } from "@/lib/marca";
import { limparRespostas } from "@/lib/perguntas";
import { trackPurchaseCompleted } from "@/lib/analytics";

/**
 * As telas do funil depois do envio.
 *
 * Qual delas aparece sai quase toda do estado do servidor — pago ou não,
 * avançada paga ou não, quais ofertas já foram recusadas. As três exceções
 * são escolhas da pessoa dentro de uma mesma etapa do servidor (ela já viu a
 * tela de conclusão, ela já pediu para pagar, ela pediu a avançada por conta
 * própria), e por isso moram aqui.
 */
type Tela =
  | "carregando"
  | "processando"
  | "concluida"
  | "previa"
  | "pagamento"
  | "upsell"
  | "downsell"
  | "resultado"
  | "falhou"
  | "sumiu";

const INTERVALO_MS = 2500;

/**
 * A parte do fluxo que acontece depois do envio. Tem URL própria de propósito:
 * a pessoa pode fechar a aba, voltar do checkout ou abrir no computador que a
 * análise continua no mesmo lugar.
 *
 * As recusas de upsell e downsell ficam no servidor, não aqui: é o que faz o
 * funil sobreviver a um refresh e o que impede alguém de reabrir a oferta com
 * preço de downsell sem ter passado pelo upsell.
 */
export default function Acompanhar({ id }: { id: string }) {
  const [estado, setEstado] = useState<AnalysisState | null>(null);
  const [sumiu, setSumiu] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Escolhas da pessoa dentro da etapa em que o servidor já está.
  const [viuConcluida, setViuConcluida] = useState(false);
  const [querPagar, setQuerPagar] = useState(false);
  const [pediuAvancada, setPediuAvancada] = useState(false);

  const cobrancaPedida = useRef(false);
  const compraRegistrada = useRef(false);
  const avancadaRegistrada = useRef(false);

  // Feedback visual enquanto a cobrança está sendo criada no servidor: sem
  // isso, o botão fica alguns segundos sem responder e parece travado.
  const [carregandoCobranca, setCarregandoCobranca] = useState(false);

  // Só preenchido quando o PIX é gerado direto na API da Cakto: ela exige
  // nome, e-mail, telefone e CPF antes de qualquer cobrança. Pedido uma vez,
  // reaproveitado se a pessoa comprar a avançada na sequência.
  const [cliente, setCliente] = useState<ClienteDados | null>(null);

  /* ---------------- consulta ---------------- */

  useEffect(() => {
    let ativo = true;
    let timer = 0;

    const consultar = async () => {
      const res = await fetch(`/api/analyze/${id}`, { cache: "no-store" });
      if (!ativo) return;

      if (res.status === 404) {
        setSumiu(true);
        window.clearInterval(timer);
        return;
      }
      if (!res.ok) return;

      const dados = (await res.json()) as AnalysisState;
      setEstado((atual) => ({
        ...dados,
        charge: dados.charge ?? atual?.charge,
        chargeAvancada: dados.chargeAvancada ?? atual?.chargeAvancada,
      }));

      if (dados.status === "failed") {
        setErro(dados.error ?? null);
        window.clearInterval(timer);
        return;
      }

      if (dados.status === "paid") {
        // As travas existem porque esta consulta roda a cada 2,5s: sem elas,
        // a mesma compra viraria uma venda nova no painel a cada volta.
        if (!compraRegistrada.current) {
          compraRegistrada.current = true;
          void trackPurchaseCompleted(id, dados.amountCents / 100, {
            produto: "relatorio",
          });
          // A análise acabou: nada mais precisa ficar guardado no aparelho.
          window.localStorage.removeItem(CHAVE_ANALISE);
          limparRespostas();
        }

        if (dados.advancedPaid && !avancadaRegistrada.current) {
          avancadaRegistrada.current = true;
          // Compra separada, com receita própria: a do relatório já foi
          // contada acima e não pode ser somada de novo aqui.
          void trackPurchaseCompleted(id, undefined, { produto: "avancada" });
        }

        // Só para de perguntar quando não há mais nada para confirmar: com a
        // avançada em aberto, o pagamento dela ainda pode cair a qualquer hora.
        if (dados.advancedPaid) window.clearInterval(timer);
      }
    };

    void consultar();
    timer = window.setInterval(consultar, INTERVALO_MS);

    return () => {
      ativo = false;
      window.clearInterval(timer);
    };
  }, [id]);

  /* ---------------- cobranças ---------------- */

  const abrirCobranca = useCallback(
    async (bump: boolean) => {
      if (cobrancaPedida.current) return;
      cobrancaPedida.current = true;
      setErro(null);
      setCarregandoCobranca(true);

      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id, bump, cliente }),
        });

        if (!res.ok) {
          const { error } = (await res.json().catch(() => ({}))) as { error?: string };
          setErro(error ?? "Não conseguimos abrir o pagamento agora.");
          return;
        }

        const dados = (await res.json()) as Pick<AnalysisState, "charge" | "amountCents">;
        setEstado((atual) =>
          atual ? { ...atual, charge: dados.charge, amountCents: dados.amountCents } : atual,
        );
      } finally {
        cobrancaPedida.current = false;
        setCarregandoCobranca(false);
      }
    },
    [id, cliente],
  );

  const abrirCobrancaAvancada = useCallback(
    async (origem: OrigemAvancada) => {
      if (cobrancaPedida.current) return;
      cobrancaPedida.current = true;
      setErro(null);
      setCarregandoCobranca(true);

      try {
        const res = await fetch("/api/checkout/avancada", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id, origem, cliente }),
        });

        if (!res.ok) {
          const { error } = (await res.json().catch(() => ({}))) as { error?: string };
          setErro(error ?? "Não conseguimos abrir o pagamento agora.");
          return;
        }

        const dados = (await res.json()) as { charge: AnalysisState["charge"] };
        // A oferta de recuperação paga o relatório junto, então ela vira a
        // cobrança principal e a tela de pagamento assume daqui.
        setEstado((atual) =>
          atual
            ? origem === "recuperacao"
              ? { ...atual, charge: dados.charge }
              : { ...atual, chargeAvancada: dados.charge }
            : atual,
        );
        if (origem === "recuperacao") setQuerPagar(true);
      } finally {
        cobrancaPedida.current = false;
        setCarregandoCobranca(false);
      }
    },
    [id, cliente],
  );

  /** Registra uma recusa no servidor antes de seguir para a próxima tela. */
  const marcarFunil = useCallback(
    async (marca: "upsellDeclined" | "downsellDeclined" | "recuperacaoOffered") => {
      await fetch("/api/funil", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, marca }),
      }).catch(() => {});

      setEstado((atual) =>
        atual ? { ...atual, funil: { ...atual.funil, [marca]: true } } : atual,
      );
    },
    [id],
  );

  /* ---------------- qual tela ---------------- */

  const tela = decidirTela(estado, sumiu, { viuConcluida, querPagar, pediuAvancada });

  // O popup de recuperação só faz sentido antes da compra: depois dela não há
  // venda a recuperar. Uma etapa por vez, e cada uma aparece no máximo uma vez.
  const etapaSaida =
    tela === "processando" || tela === "concluida"
      ? "leitura"
      : tela === "previa"
        ? "previa"
        : tela === "pagamento"
          ? "pagamento"
          : null;

  const { mostrar: mostrarSaida, fechar: fecharSaida } = useExitIntent(
    etapaSaida ?? "",
    etapaSaida !== null,
  );

  if (tela === "carregando") {
    return <p className="t-legenda py-16 text-center">Abrindo sua análise…</p>;
  }

  if (tela === "sumiu") {
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
      {tela === "processando" && <EtapaProcessando fila={estado?.queuePos ?? 0} />}

      {tela === "concluida" && <EtapaConcluida onVerPrevia={() => setViuConcluida(true)} />}

      {tela === "previa" && estado && (
        <EtapaPrevia estado={estado} onContinuar={() => setQuerPagar(true)} />
      )}

      {tela === "pagamento" && estado && (
        <EtapaPagamento
          estado={estado}
          erro={erro}
          carregando={carregandoCobranca}
          precisaDadosCliente={Boolean(estado.precisaDadosCliente) && !cliente}
          onClienteEnviado={setCliente}
          onCobrar={abrirCobranca}
          onRecomecar={recomecar}
        />
      )}

      {tela === "upsell" && estado && (
        <EtapaUpsell
          estado={estado}
          erro={erro}
          carregando={carregandoCobranca}
          precisaDadosCliente={Boolean(estado.precisaDadosCliente) && !cliente}
          onClienteEnviado={setCliente}
          onAceitar={() => void abrirCobrancaAvancada("upsell")}
          onRecusar={() => {
            setPediuAvancada(false);
            void marcarFunil("upsellDeclined");
          }}
        />
      )}

      {tela === "downsell" && estado && (
        <EtapaDownsell
          estado={estado}
          erro={erro}
          carregando={carregandoCobranca}
          precisaDadosCliente={Boolean(estado.precisaDadosCliente) && !cliente}
          onClienteEnviado={setCliente}
          onAceitar={() => void abrirCobrancaAvancada("downsell")}
          onRecusar={() => void marcarFunil("downsellDeclined")}
        />
      )}

      {tela === "resultado" && estado?.report && (
        <EtapaRelatorio estado={estado} onComprarAvancada={() => setPediuAvancada(true)} />
      )}

      {tela === "falhou" && <EtapaFalhou mensagem={erro} onRecomecar={recomecar} />}

      {mostrarSaida && estado && (
        <PopupSaida
          estado={estado}
          // Só depois de a pessoa ter visto algum achado: na tela de leitura
          // ela ainda não leu nada, e o pacote seria uma venda no escuro.
          podeOferecerPacote={tela === "previa" || tela === "pagamento"}
          onContinuar={() => {
            fecharSaida();
            setViuConcluida(true);
            setQuerPagar(true);
          }}
          onAproveitarOferta={() => {
            fecharSaida();
            if (estado.precisaDadosCliente && !cliente) {
              // O PIX nativo da Cakto exige os dados do cliente antes de
              // qualquer cobrança, e o popup não tem espaço para esse
              // formulário: manda para o fluxo normal, onde ele aparece.
              setViuConcluida(true);
              setQuerPagar(true);
              return;
            }
            void abrirCobrancaAvancada("recuperacao");
          }}
          onSair={fecharSaida}
          onMostrada={() => void marcarFunil("recuperacaoOffered")}
        />
      )}
    </>
  );
}

/**
 * A tela é uma função do estado, não uma sequência de navegações. Assim um
 * refresh no meio do funil devolve exatamente a mesma tela, e voltar no
 * navegador não pula uma oferta nem repete outra.
 */
function decidirTela(
  estado: AnalysisState | null,
  sumiu: boolean,
  local: { viuConcluida: boolean; querPagar: boolean; pediuAvancada: boolean },
): Tela {
  if (sumiu) return "sumiu";
  if (!estado) return "carregando";
  if (estado.status === "failed") return "falhou";
  if (estado.status === "processing") return "processando";

  if (estado.status === "ready") {
    if (local.querPagar) return "pagamento";
    return local.viuConcluida ? "previa" : "concluida";
  }

  // Pago. A avançada é o que decide o resto.
  if (estado.advancedPaid) return "resultado";

  const funil = estado.funil ?? {};

  // Pedido pela própria pessoa, no relatório: mostra a oferta cheia de novo.
  // Não é loop — é ela que abriu.
  if (local.pediuAvancada) return "upsell";

  if (!funil.upsellDeclined) return "upsell";
  if (!funil.downsellDeclined) return "downsell";
  return "resultado";
}

function recomecar() {
  window.localStorage.removeItem(CHAVE_ANALISE);
  limparRespostas();
  window.location.href = "/analise";
}
