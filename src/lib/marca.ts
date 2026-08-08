/**
 * Nome e contato da marca, em um lugar só.
 *
 * O projeto já trocou de nome uma vez. Da segunda em diante isso é uma linha,
 * e não uma varredura por trinta arquivos correndo o risco de esquecer um.
 *
 * `CONTATO` também sai daqui: o endereço aparece nos termos, na privacidade,
 * no rodapé e na tela de falha, e os quatro precisam apontar para a mesma
 * caixa de entrada.
 */
export const MARCA = "Desvenda AI";

/** Endereço público de contato. Trocar aqui muda o site inteiro. */
export const CONTATO = "oi@desvenda.ai";

/** `mailto:` pronto, para não repetir a concatenação em cada link. */
export const CONTATO_MAILTO = `mailto:${CONTATO}`;

/**
 * Prefixo das chaves de armazenamento no navegador. Fica junto do nome porque
 * é o mesmo namespace: se a marca muda, o que está guardado no aparelho da
 * pessoa muda junto.
 */
export const CHAVE_PREFIXO = "desvenda";

/** Id da análise em andamento, guardado no `localStorage` do aparelho. */
export const CHAVE_ANALISE = `${CHAVE_PREFIXO}:analise`;
