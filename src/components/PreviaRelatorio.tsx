import Icon3D, { type IconName } from "./Icon3D";
import Reveal from "./Reveal";

/**
 * O relatório visto por fora, antes de existir.
 *
 * Vem depois do "como funciona" porque a pessoa acabou de descobrir que são
 * dois minutos e a próxima pergunta é sempre a mesma: dois minutos e eu recebo
 * o quê? Aqui ela vê o formato — celular desenhado, nenhuma foto de tela, nada
 * que finja ser print de um relatório de outra pessoa.
 */
const detalhes: { icon: IconName; texto: string }[] = [
  { icon: "conversa", texto: "Português comum, sem gráfico para decifrar." },
  { icon: "lupa", texto: "Cada conclusão vem com a data e o trecho que a sustenta." },
  { icon: "celular", texto: "Abre no celular e salva em PDF com um toque." },
];

export default function PreviaRelatorio() {
  return (
    <section id="relatorio" className="faixa relative overflow-hidden">
      <span
        aria-hidden
        className="brasa brasa-rosa -bottom-40 -left-32 h-[28rem] w-[28rem]"
        style={{ animationDelay: "-14s" }}
      />

      <div className="shell-l relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
        <Reveal>
          <div>
            <h2 className="t-secao max-w-[18ch]">Assim chega o seu relatório.</h2>
            <p className="t-apoio mt-4 max-w-[46ch]">
              Não é um painel de números para você interpretar sozinho. É um texto sobre vocês dois,
              que dá para ler inteiro numa viagem de ônibus.
            </p>

            <ul className="mt-8 space-y-3">
              {detalhes.map((item) => (
                <li key={item.texto} className="bloco flex items-center gap-3.5 px-5 py-3.5">
                  <Icon3D name={item.icon} size={34} className="flex-none" />
                  <span className="text-[0.9375rem] leading-snug text-[#F6ECEF]/90">
                    {item.texto}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={110} dir="dir">
          <Previa />
        </Reveal>
      </div>
    </section>
  );
}

/** O relatório dentro de um celular desenhado. Nenhuma foto, nenhum print. */
function Previa() {
  return (
    <div className="relative mx-auto max-w-[340px]">
      <div className="moldura !max-w-[292px]">
        <div className="moldura-tela">
          <p className="text-[0.625rem] font-semibold tracking-[0.16em] text-[#B7A2AA] uppercase">
            Sua leitura
          </p>

          <div className="mt-3 text-center">
            <Icon3D name="coracao" size={48} className="mx-auto" />
            <p className="mt-2 font-[family-name:var(--font-outfit)] text-[1.0625rem] leading-tight font-bold text-[#F6ECEF]">
              Vocês conversam muito, e falam pouco sobre vocês.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <LinhaPrevia icon="conversa" titulo="Quem começa as conversas" larguras={[100, 76]} />
            <LinhaPrevia icon="coracao" titulo="O tom mudou em março" larguras={[92, 60]} />
            <LinhaPrevia icon="lupa" titulo="Assuntos que ninguém termina" larguras={[100, 84]} />
            <LinhaPrevia icon="foguete" titulo="Uma coisa para tentar" larguras={[88, 52]} />
          </div>

          {/* Desvanece na base para sugerir que o relatório continua. */}
          <div
            aria-hidden
            className="mt-1 h-12"
            style={{ background: "linear-gradient(180deg, transparent, #120509)" }}
          />
        </div>
      </div>

      {/* Um achado saltando para fora da tela. Some no celular: lá ele cobriria
          o próprio relatório que veio mostrar. */}
      <p className="painel painel-neon absolute -right-2 bottom-16 hidden w-[210px] items-start gap-2.5 p-3.5 md:flex">
        <Icon3D name="lupa" size={26} className="mt-px flex-none" />
        <span className="text-[0.75rem] leading-snug">
          <span className="font-[family-name:var(--font-outfit)] font-semibold text-[#FF8FB3]">
            23 conversas
          </span>
          <span className="text-[#F6ECEF]/80"> terminaram sem resposta. Todas depois das 22h.</span>
        </span>
      </p>
    </div>
  );
}

function LinhaPrevia({
  icon,
  titulo,
  larguras,
}: {
  icon: IconName;
  titulo: string;
  larguras: number[];
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/5 p-2.5">
      <p className="flex items-center gap-1.5 text-[0.6875rem] leading-tight font-semibold text-[#F6ECEF]">
        <Icon3D name={icon} size={18} className="flex-none" />
        {titulo}
      </p>
      <span className="mt-1.5 block space-y-1" aria-hidden>
        {larguras.map((w, i) => (
          <span
            key={i}
            className="block h-1.5 rounded-full bg-[#FF3068]/30"
            style={{ width: `${w}%` }}
          />
        ))}
      </span>
    </div>
  );
}
