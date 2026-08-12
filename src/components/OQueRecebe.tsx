import Icon3D, { type IconName } from "./Icon3D";
import Reveal from "./Reveal";

/**
 * O que a leitura procura. Vem depois da prévia porque a pessoa já viu o
 * formato e agora quer saber o conteúdo.
 *
 * Todo item é comportamento observável, com contagem — nada de rótulo de
 * personalidade e nada que dependa de adivinhar intenção. "O que vocês fazem
 * bem" fica na lista de propósito: sem ele a página vira caça às bruxas, e
 * quem chega desconfiada já tem gente demais empurrando para esse lado.
 */
const itens: { icon: IconName; titulo: string; texto: string }[] = [
  {
    icon: "conversa",
    titulo: "Quem sustenta a conversa",
    texto:
      "Quem manda a primeira mensagem, quem puxa assunto, quem só responde. Com os números do lado.",
  },
  {
    icon: "celular",
    titulo: "Interesse, medido em tempo",
    texto:
      "Quanto tempo cada um leva para responder, em que horários, e como isso mudou de um mês para o outro.",
  },
  {
    icon: "coracao",
    titulo: "Onde o tom mudou",
    texto: "O mês em que os apelidos sumiram e as mensagens viraram combinado de horário.",
  },
  {
    icon: "alerta",
    titulo: "Quando a conversa vira sobre você",
    texto:
      "As vezes em que você levantou um assunto e a resposta transformou o assunto em defeito seu.",
  },
  {
    icon: "escudo",
    titulo: "O que vocês fazem bem",
    texto:
      "Sim, isso também. Nem tudo que se repete é problema, e vale saber o que vocês precisam preservar.",
  },
  {
    icon: "foguete",
    titulo: "Uma coisa para tentar esta semana",
    texto:
      "Um passo pequeno e concreto, tirado da conversa de vocês. Não é conselho de biscoito da sorte.",
  },
];

export default function OQueRecebe() {
  return (
    <section id="analisado" className="faixa">
      <div className="shell-l">
        <Reveal>
          <h2 className="t-secao max-w-[22ch]">O que a leitura vai procurar</h2>
          <p className="t-apoio mt-4 max-w-[56ch]">
            Seis leituras sobre meses de conversa. Cada uma com a data e o trecho que a sustenta,
            para você conferir se é verdade em vez de acreditar.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((item, i) => (
            <Reveal key={item.titulo} delay={i * 50}>
              <div
                className={[
                  "painel painel-hover h-full p-5 md:p-6",
                  // Duas células ganham cor: a grade não pode ser seis vidros iguais.
                  i === 0 || i === 5 ? "painel-tinto" : "",
                ].join(" ")}
              >
                <Icon3D name={item.icon} size={50} className="flex-none" />
                <h3 className="mt-3 font-[family-name:var(--font-outfit)] text-[1.0625rem] leading-snug font-semibold text-[#F6ECEF]">
                  {item.titulo}
                </h3>
                <p className="t-apoio mt-1.5 text-[0.9375rem]">{item.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
