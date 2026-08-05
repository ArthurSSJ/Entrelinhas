import Icon3D, { type IconName } from "./Icon3D";
import Reveal from "./Reveal";
import { Manchas, Onda } from "./Enfeites";

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
    texto: "A hora do dia em que as conversas de vocês azedam — e a hora em que dão certo.",
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

export default function OQueRecebe() {
  return (
    <>
      <Onda cor="#FFFFFF" />
      <section className="relative overflow-hidden bg-white pb-14 md:pb-20">
        <Manchas variante="rosa" />

        <div className="shell relative">
          <Reveal>
            <h2 className="t-h2">O que vem no relatório</h2>
            <p className="mt-3 max-w-[44ch] text-[#6B6570]">
              Seis leituras escritas em português comum, cada uma apoiada no que está na conversa.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <Previa />
          </Reveal>

          <div className="mt-9 grid gap-3 md:grid-cols-2">
            {itens.map((item, i) => (
              <Reveal key={item.titulo} delay={i * 50}>
                <div className="card card-hover h-full bg-[#FFF8F5] !p-5">
                  <Icon3D name={item.icon} size={46} />
                  <h3 className="t-h3 mt-2.5">{item.titulo}</h3>
                  <p className="t-legenda mt-1">{item.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Onda cor="#FFFFFF" virada />
    </>
  );
}

/** O relatório dentro de um celular desenhado. Nenhuma foto, nenhum print. */
function Previa() {
  return (
    <div className="moldura mt-8">
      <div className="moldura-tela">
        <div className="text-center">
          <Icon3D name="coracao" size={44} className="mx-auto" />
          <p className="mt-2 font-[family-name:var(--font-outfit)] text-[0.9375rem] leading-tight font-bold">
            Vocês conversam muito — e falam pouco sobre vocês.
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
          style={{ background: "linear-gradient(180deg, transparent, #FFF8F5)" }}
        />
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
    <div className="rounded-xl border border-black/5 bg-white p-2.5">
      <p className="flex items-center gap-1.5 text-[0.6875rem] leading-tight font-semibold">
        <Icon3D name={icon} size={18} className="flex-none" />
        {titulo}
      </p>
      <span className="mt-1.5 block space-y-1" aria-hidden>
        {larguras.map((w, i) => (
          <span
            key={i}
            className="block h-1.5 rounded-full bg-[#FFD6E0]"
            style={{ width: `${w}%` }}
          />
        ))}
      </span>
    </div>
  );
}
