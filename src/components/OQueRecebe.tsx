import Icon3D, { type IconName } from "./Icon3D";
import Reveal from "./Reveal";

const itens: { icon: IconName; titulo: string; texto: string }[] = [
  {
    icon: "conversa",
    titulo: "Quem sustenta a conversa",
    texto: "Quem manda a primeira mensagem, quem responde mais rápido, quem deixa no vácuo.",
  },
  {
    icon: "coracao",
    titulo: "Onde o tom mudou",
    texto: "O mês em que os apelidos sumiram, o dia em que as mensagens ficaram funcionais.",
  },
  {
    icon: "lupa",
    titulo: "Os assuntos que ninguém termina",
    texto: "Temas que aparecem, esquentam e somem sempre do mesmo jeito.",
  },
  {
    icon: "celular",
    titulo: "O horário das brigas",
    texto: "A hora do dia em que as conversas de vocês azedam, e a hora em que dão certo.",
  },
  {
    icon: "escudo",
    titulo: "O que vocês fazem bem",
    texto: "Sim, isso também. Nem tudo que se repete é problema.",
  },
  {
    icon: "foguete",
    titulo: "Uma coisa para tentar esta semana",
    texto: "Um passo pequeno e concreto, tirado da própria conversa de vocês.",
  },
];

/**
 * Grade irregular: o celular ocupa uma coluna inteira à esquerda e as seis
 * leituras se acomodam ao redor em blocos de tamanhos diferentes. Sete peças,
 * sete lugares, nenhuma célula sobrando.
 */
export default function OQueRecebe() {
  return (
    <section id="relatorio" className="faixa relative overflow-hidden">
      <span
        aria-hidden
        className="brasa brasa-rosa -bottom-40 -left-32 h-[28rem] w-[28rem]"
        style={{ animationDelay: "-14s" }}
      />

      <div className="shell-l relative">
        <Reveal>
          <h2 className="t-secao">O que vem no relatório</h2>
          <p className="t-apoio mt-4 max-w-[50ch]">
            Seis leituras escritas em português comum, cada uma apoiada no que está na conversa.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-12">
          <Reveal delay={60} className="md:col-span-4 md:row-span-2">
            <Previa />
          </Reveal>

          {itens.map((item, i) => {
            const largo = i >= 4;
            return (
              <Reveal
                key={item.titulo}
                delay={80 + i * 50}
                className={largo ? "md:col-span-6" : "md:col-span-4"}
              >
                <div
                  className={[
                    "painel painel-hover h-full p-5 md:p-6",
                    largo ? "flex items-center gap-5" : "",
                    // Duas células ganham cor: a grade não pode ser seis vidros iguais.
                    i === 0 || i === 5 ? "painel-tinto" : "",
                  ].join(" ")}
                >
                  <Icon3D name={item.icon} size={largo ? 58 : 50} className="flex-none" />
                  <div className={largo ? "" : "mt-3"}>
                    <h3 className="font-[family-name:var(--font-outfit)] text-[1.0625rem] leading-snug font-semibold text-[#F6ECEF]">
                      {item.titulo}
                    </h3>
                    <p className="t-apoio mt-1.5 text-[0.9375rem]">{item.texto}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** O relatório dentro de um celular desenhado. Nenhuma foto, nenhum print. */
function Previa() {
  return (
    <div className="painel flex h-full items-center justify-center p-6">
      <div className="moldura !max-w-[248px]">
        <div className="moldura-tela">
          <div className="text-center">
            <Icon3D name="coracao" size={44} className="mx-auto" />
            <p className="mt-2 font-[family-name:var(--font-outfit)] text-[0.9375rem] leading-tight font-bold text-[#F6ECEF]">
              Vocês conversam muito, e falam pouco sobre vocês.
            </p>
          </div>

          <div className="mt-3 space-y-2">
            <LinhaPrevia icon="conversa" titulo="Quem começa as conversas" larguras={[100, 76]} />
            <LinhaPrevia icon="coracao" titulo="O tom mudou em março" larguras={[92, 60]} />
            <LinhaPrevia icon="lupa" titulo="Assuntos que ninguém termina" larguras={[100, 84]} />
          </div>

          {/* Desvanece na base para sugerir que o relatório continua. */}
          <div
            aria-hidden
            className="mt-1 h-10"
            style={{ background: "linear-gradient(180deg, transparent, #120509)" }}
          />
        </div>
      </div>
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
