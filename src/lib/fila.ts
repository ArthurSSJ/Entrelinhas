/**
 * Fila das leituras.
 *
 * A camada gratuita da Groq trabalha com um teto de tokens por minuto. Sem
 * fila, duas pessoas que enviam ao mesmo tempo derrubam a segunda. Com fila,
 * a segunda espera o tempo necessário e roda.
 *
 * São duas travas:
 *  - uma leitura por vez (nada de estourar o teto em paralelo);
 *  - orçamento por janela de 60 segundos, contando o que já foi gasto.
 *
 * Isto vive na memória do processo. Serve para um servidor só. Com mais de uma
 * instância, troque por Redis ou por uma fila de verdade mantendo as mesmas
 * funções exportadas.
 */

const TETO_TPM = Number(process.env.GROQ_TPM ?? 12_000);
const JANELA_MS = 60_000;

type Gasto = { quando: number; tokens: number };

const globalRef = globalThis as unknown as {
  __desvendaFila?: { gastos: Gasto[]; corrente: Promise<unknown>; aguardando: number };
};

const estado = (globalRef.__desvendaFila ??= {
  gastos: [],
  corrente: Promise.resolve(),
  aguardando: 0,
});

/** Quantas leituras estão esperando a vez neste momento. */
export function aguardando() {
  return estado.aguardando;
}

/**
 * Quanto tempo esta leitura esperaria para entrar, em milissegundos.
 *
 * Serve para decidir entre esperar e usar o modelo reserva: fazer alguém olhar
 * uma tela de carregamento por um minuto antes de ver o preço custa mais caro
 * do que uma leitura um pouco menos afiada.
 */
export function esperaEstimadaMs(custo: number) {
  limpar();

  const agora = Date.now();
  let gasto = estado.gastos.reduce((soma, g) => soma + g.tokens, 0);
  if (gasto + custo <= TETO_TPM && estado.aguardando === 0) return 0;

  // Vai liberando os gastos mais antigos até caber.
  for (const g of estado.gastos) {
    gasto -= g.tokens;
    if (gasto + custo <= TETO_TPM) {
      return Math.max(0, g.quando + JANELA_MS - agora);
    }
  }

  return 0;
}

/**
 * Põe uma leitura na fila.
 *
 * `custo` é a estimativa de tokens da chamada — usada só para reservar espaço
 * na janela. `aoAndar` recebe a posição atual sempre que ela muda, para a tela
 * de carregamento poder dizer quantas pessoas estão na frente.
 */
export function naFila<T>(
  custo: number,
  tarefa: () => Promise<T>,
  aoAndar?: (posicao: number) => void,
): Promise<T> {
  const posicao = ++estado.aguardando;
  aoAndar?.(posicao - 1);

  const resultado = estado.corrente.then(async () => {
    try {
      await esperarOrcamento(custo, aoAndar);
      registrar(custo);
      return await tarefa();
    } finally {
      estado.aguardando--;
    }
  });

  // A corrente segue mesmo se esta tarefa falhar — uma leitura ruim não pode
  // travar a fila de quem vem atrás.
  estado.corrente = resultado.then(
    () => undefined,
    () => undefined,
  );

  return resultado;
}

async function esperarOrcamento(custo: number, aoAndar?: (posicao: number) => void) {
  aoAndar?.(0);

  for (;;) {
    limpar();
    const gasto = estado.gastos.reduce((soma, g) => soma + g.tokens, 0);
    if (gasto + custo <= TETO_TPM) return;

    // Espera o gasto mais antigo sair da janela de 60 segundos.
    const maisAntigo = estado.gastos[0];
    const faltam = Math.max(500, maisAntigo.quando + JANELA_MS - Date.now() + 250);
    await new Promise((resolve) => setTimeout(resolve, faltam));
  }
}

function registrar(tokens: number) {
  estado.gastos.push({ quando: Date.now(), tokens });
}

function limpar() {
  const corte = Date.now() - JANELA_MS;
  while (estado.gastos.length && estado.gastos[0].quando < corte) {
    estado.gastos.shift();
  }
}
