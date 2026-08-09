"use client";

import { useEffect, useRef, useState } from "react";
import { CHAVE_PREFIXO } from "@/lib/marca";

/** Tempo mínimo na tela antes do gatilho armar. Ninguém sai antes de ler. */
const ATRASO_ARMAR_MS = 4000;

/**
 * Detecta intenção de saída e diz quando mostrar o popup de recuperação.
 *
 * O gatilho muda com o aparelho, porque o sinal que existe num não existe no
 * outro:
 *
 *  - Desktop: o mouse sai por cima da janela — endereço, abas, fechar. É o
 *    sinal clássico de saída, e não tem equivalente por toque.
 *  - Celular: a primeira tentativa de voltar. Reserva uma posição no
 *    histórico e a consome na primeira volta, mostrando o popup em vez de
 *    navegar. Não reserva uma segunda vez: a próxima tentativa de voltar sai
 *    de verdade, sem nada no caminho.
 *
 * `chave` identifica a etapa. O aviso guardado no sessionStorage garante no
 * máximo uma aparição por etapa, mesmo que a pessoa entre e saia da tela
 * mais de uma vez na mesma sessão.
 */
export function useExitIntent(chave: string, ativo: boolean) {
  const [mostrar, setMostrar] = useState(false);
  const reservouHistorico = useRef(false);

  useEffect(() => {
    if (!ativo) return;

    const chaveSessao = `${CHAVE_PREFIXO}:saida:${chave}`;
    if (window.sessionStorage.getItem(chaveSessao)) return;

    let armado = false;
    let jaDisparou = false;
    const temporizador = window.setTimeout(() => {
      armado = true;
    }, ATRASO_ARMAR_MS);

    // Dispara no máximo uma vez por montagem deste efeito. Sem isso, cada
    // nova tentativa de sair (cada "voltar", cada mouseout) reabriria o
    // popup — o oposto de "não impedir a pessoa de sair".
    const disparar = () => {
      if (!armado || jaDisparou) return;
      jaDisparou = true;
      window.sessionStorage.setItem(chaveSessao, "1");
      setMostrar(true);
    };

    const telaDeToque = window.matchMedia("(pointer: coarse)").matches;

    if (telaDeToque) {
      // Só reserva uma vez por carregamento de página: trocar de etapa não
      // deve empilhar entradas de histórico que a pessoa precisa "voltar"
      // várias vezes para sair de verdade depois.
      if (!reservouHistorico.current) {
        window.history.pushState({ desvendaSaidaReservada: true }, "");
        reservouHistorico.current = true;
      }

      const aoVoltar = () => {
        if (!armado || jaDisparou) return;
        // Consome esta tentativa de voltar e mostra o popup em vez dela. Não
        // reserva de novo depois de disparar: a próxima volta sai mesmo.
        window.history.pushState({ desvendaSaidaReservada: true }, "");
        disparar();
      };

      window.addEventListener("popstate", aoVoltar);
      return () => {
        window.clearTimeout(temporizador);
        window.removeEventListener("popstate", aoVoltar);
      };
    }

    const aoMoverMouse = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) disparar();
    };

    document.addEventListener("mouseout", aoMoverMouse);
    return () => {
      window.clearTimeout(temporizador);
      document.removeEventListener("mouseout", aoMoverMouse);
    };
  }, [chave, ativo]);

  return { mostrar, fechar: () => setMostrar(false) };
}
