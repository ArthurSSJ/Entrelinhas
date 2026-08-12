"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon3D from "@/components/Icon3D";
import Modal from "@/components/Modal";
import ProgressoFunil from "@/components/ProgressoFunil";
import { CHAVE_ANALISE } from "@/lib/marca";
import { BASE_CENTS, brl } from "@/lib/pricing";
import { checkFile, readableSize } from "@/lib/upload";
import { detectarParticipantes, type Participantes } from "@/lib/whatsapp";
import { lerRespostas, resumirRespostas, sugereAvancada } from "@/lib/perguntas";

import { extractTxtFromZip } from "@/lib/zip";

/** Fase de testes: sem paywall. Ligado por NEXT_PUBLIC_MODO_GRATIS. */
const GRATIS = process.env.NEXT_PUBLIC_MODO_GRATIS === "true";

export default function Enviar() {
  const router = useRouter();

  const [arquivo, setArquivo] = useState<File | null>(null);
  const [participantes, setParticipantes] = useState<Participantes | null>(null);
  const [remetente, setRemetente] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const [aceitou, setAceitou] = useState(false);
  const [verTermos, setVerTermos] = useState(false);
  const [enviando, setEnviando] = useState(false);

  /**
   * A investigação avançada não é vendida aqui.
   *
   * Ela é oferecida uma vez só, como order bump no checkout, depois de a
   * pessoa já ter lido uma parte do que a leitura encontrou. Vender nas duas
   * telas seria a mesma oferta duas vezes, e cobrar um adicional antes de
   * mostrar qualquer resultado é pedir confiança que ainda não foi ganha.
   *
   * O que sobe daqui é só o sinal do quiz: quem respondeu que a dúvida é
   * sobre confiança vê uma linha a mais no bump, e nada marcado.
   */
  const sugerida = useRef(false);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    sugerida.current = sugereAvancada(lerRespostas());
  }, []);

  const receber = async (escolhido: File | undefined) => {
    if (!escolhido) return;

    const veredito = checkFile(escolhido);
    if (!veredito.ok) {
      setArquivo(null);
      setParticipantes(null);
      setRemetente(null);
      setErro(veredito.message);
      return;
    }

    setErro(null);
    let arquivoTxt = escolhido;

    try {
      let texto: string;
      if (escolhido.name.toLowerCase().endsWith(".zip")) {
        const extraido = await extractTxtFromZip(escolhido);
        texto = extraido.text;
        arquivoTxt = new File([extraido.text], extraido.name, { type: "text/plain" });
      } else {
        texto = await escolhido.text();
      }

      setArquivo(arquivoTxt);

      const encontrados = detectarParticipantes(texto);

      if (encontrados.autores.length === 0) {
        setArquivo(null);
        setParticipantes(null);
        setErro("Não reconhecemos esse arquivo. Ele precisa ser o .txt ou .zip exportado do WhatsApp.");
        return;
      }

      setParticipantes(encontrados);
      setRemetente(encontrados.provavel ?? (encontrados.autores.length === 1 ? encontrados.autores[0] : null));
    } catch (err) {
      setArquivo(null);
      setParticipantes(null);
      setErro(err instanceof Error ? err.message : "Não conseguimos ler esse arquivo.");
    }
  };

  const enviar = async () => {
    if (!arquivo || enviando) return;
    setEnviando(true);
    setErro(null);

    const corpo = new FormData();
    corpo.set("arquivo", arquivo);
    corpo.set("avancada", String(sugerida.current));
    corpo.set("respostas", JSON.stringify(resumirRespostas(lerRespostas())));
    if (remetente) corpo.set("remetente", remetente);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: corpo });
      const dados = (await res.json()) as { id?: string; state?: unknown; error?: string };

      if (!res.ok || !dados.id) {
        setErro(dados.error ?? "Não conseguimos receber o arquivo. Tente de novo.");
        setEnviando(false);
        return;
      }

      window.localStorage.setItem(CHAVE_ANALISE, dados.id);
      if (dados.state) {
        try {
          window.localStorage.setItem("desvenda_state_" + dados.id, JSON.stringify(dados.state));
        } catch {}
      }
      router.push(`/relatorio/${dados.id}`);
    } catch {
      setErro("Sua conexão caiu no meio do envio. Tente de novo.");
      setEnviando(false);
    }
  };

  const estadoZona = erro ? "error" : arquivo ? "ready" : arrastando ? "drag" : "idle";
  const faltaEscolher = Boolean(participantes && participantes.autores.length > 1 && !remetente);
  const pronto = Boolean(arquivo) && aceitou && !faltaEscolher && !enviando;

  return (
    <div>
      <ProgressoFunil etapa={2} sub={0.8} />

      <h1 className="t-h2">Traga a conversa</h1>
      <p className="mt-2 text-[#B7A2AA]">
        Solte o arquivo .txt ou .zip que você acabou de exportar. Ele é lido uma vez e apagado assim que o
        relatório fica pronto.
      </p>

      <div
        className="dropzone mt-6"
        data-state={estadoZona}
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            input.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          receber(e.dataTransfer.files[0]);
        }}
      >
        <Icon3D name={arquivo ? "conversa" : "nuvem"} size={72} className="animate-float-slow" />

        {arquivo ? (
          <>
            <p className="t-h3 break-all">{arquivo.name}</p>
            <p className="t-legenda">{readableSize(arquivo.size)} · pronto para enviar</p>
            <span className="mt-1 text-[0.875rem] font-medium text-[#FF8FB3] underline underline-offset-4">
              Trocar arquivo
            </span>
          </>
        ) : (
          <>
            <p className="t-h3">Solte o arquivo aqui</p>
            <p className="t-legenda">ou toque para escolher no seu celular</p>
            <span className="t-legenda mt-1 rounded-full bg-white/6 px-3 py-1">
              Aceita .txt ou .zip do WhatsApp
            </span>
          </>
        )}

        <input
          ref={input}
          type="file"
          accept=".txt,.zip,text/plain,application/zip,application/x-zip-compressed"
          className="sr-only"
          onChange={(e) => receber(e.target.files?.[0])}
        />
      </div>

      {erro && (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-2xl bg-[#FF5A5A]/12 px-4 py-3 text-[0.875rem] text-[#FFA3A3]"
        >
          <Icon3D name="alerta" size={22} className="mt-px flex-none" />
          {erro}
        </p>
      )}

      <Link
        href="/analise/tutorial"
        className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-[0.9375rem] font-medium text-[#F6ECEF] transition-colors hover:border-[#FF8FB3]/40 hover:bg-white/8 group"
      >
        <Icon3D name="celular" size={28} className="flex-none" />
        <span className="flex-1">
          Não achou o arquivo?{" "}
          <span className="font-semibold text-[#FF8FB3] underline underline-offset-4 group-hover:text-[#FF5A8D]">
            Ver o passo a passo de novo
          </span>
        </span>
        <span
          className="text-[#FF8FB3] text-[1.125rem] transition-transform group-hover:translate-x-1"
          aria-hidden
        >
          →
        </span>
      </Link>

      {/* Quem é quem. O arquivo não marca isso, e errar aqui estraga o relatório. */}
      {participantes && participantes.autores.length > 1 && (
        <div className="card mt-5">
          <div className="flex items-start gap-3">
            <Icon3D name="conversa" size={40} className="flex-none" />
            <div>
              <h2 className="t-h3">Qual desses é você?</h2>
              <p className="t-legenda mt-0.5">
                {participantes.provavel
                  ? "Achamos que é este. Confirme, ou toque no outro nome."
                  : "O arquivo não diz, e a gente precisa saber para escrever certo."}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {participantes.autores.slice(0, 6).map((nome) => (
              <button
                key={nome}
                type="button"
                className="choice items-center !py-3.5"
                data-on={remetente === nome}
                aria-pressed={remetente === nome}
                onClick={() => setRemetente(nome)}
              >
                <Tick />
                <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-medium">{nome}</span>
              </button>
            ))}
          </div>

          {participantes.autores.length > 2 && (
            <p className="t-legenda mt-3">
              Essa conversa tem mais de duas pessoas. A leitura funciona melhor com conversa de
              duas.
            </p>
          )}
        </div>
      )}

      {/* Consentimento */}
      <button
        type="button"
        className="choice mt-3"
        data-on={aceitou}
        aria-pressed={aceitou}
        onClick={() => setAceitou((v) => !v)}
      >
        <Tick />
        <span className="min-w-0 flex-1">
          <span className="block text-[0.9375rem] leading-snug">
            Li e concordo com os termos de privacidade: minha conversa não é armazenada e é apagada
            assim que a análise termina.
          </span>
          <span
            role="link"
            tabIndex={0}
            className="t-legenda mt-1 inline-block font-medium text-[#FF8FB3] underline underline-offset-4"
            onClick={(e) => {
              e.stopPropagation();
              setVerTermos(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                setVerTermos(true);
              }
            }}
          >
            Ler os termos
          </span>
        </span>
        <Icon3D name="escudo" size={40} className="flex-none" />
      </button>

      <button
        type="button"
        className="btn btn-primary btn-lg btn-block mt-5"
        disabled={!pronto}
        onClick={enviar}
      >
        {enviando
          ? "Enviando…"
          : !arquivo
            ? "Escolha o arquivo para continuar"
            : faltaEscolher
              ? "Diga qual desses nomes é você"
              : !aceitou
                ? "Aceite os termos para continuar"
                : "Ler minha conversa"}
      </button>



      {verTermos && (
        <Modal titulo="O que acontece com a sua conversa" onFechar={() => setVerTermos(false)}>
          <div className="report-body text-[0.9375rem]">
            <p>
              <strong>Nada do texto fica guardado.</strong> O arquivo entra, é lido uma única vez
              para gerar o relatório e é descartado em seguida. Nenhuma pessoa lê a sua conversa: a
              leitura é automática, e o texto não é usado para mais nada.
            </p>
            <p>
              <strong>O relatório é seu e só seu.</strong> Ele fica disponível por até duas horas
              para você abrir e salvar. Depois disso some também.
            </p>
            <p>
              <strong>Não pedimos cadastro.</strong> Sem conta, sem senha, sem e-mail obrigatório.
              O pagamento é processado pelo checkout externo e nós não recebemos os dados do seu
              cartão.
            </p>
            <p>
              <strong>Uma leitura, não um veredito.</strong> O relatório aponta padrões que estão
              no texto. Ele não prova nem desmente nada sobre ninguém, e não substitui uma conversa
              honesta nem acompanhamento profissional.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block mt-5"
            onClick={() => {
              setAceitou(true);
              setVerTermos(false);
            }}
          >
            Entendi e concordo
          </button>
        </Modal>
      )}
    </div>
  );
}

function Tick() {
  return (
    <span className="tick" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 14 14" focusable="false">
        <path
          d="M2 7.5 5.5 11 12 3.5"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
