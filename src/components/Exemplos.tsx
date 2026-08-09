import Balao from "./Balao";
import Icon3D, { type IconName } from "./Icon3D";
import Reveal from "./Reveal";

/**
 * A seção que faz a pessoa parar de rolar.
 *
 * Não explica a tecnologia: mostra o formato do achado. Cada exemplo é uma
 * mensagem banal, do tipo que qualquer um já mandou, e ao lado o que aparece
 * quando ela deixa de ser uma mensagem e vira a milésima.
 *
 * Todo achado aqui é contagem e comparação — coisa que está escrita e dá para
 * conferir. Nenhum deles afirma intenção, sentimento ou fato de fora da
 * conversa, porque a leitura de verdade também não afirma.
 */
type Exemplo = {
  icon: IconName;
  rotulo: string;
  mensagem: string;
  hora: string;
  minha: boolean;
  achado: string;
  remate: string;
};

const exemplos: Exemplo[] = [
  {
    icon: "conversa",
    rotulo: "Quem sustenta a conversa",
    mensagem: "oi, tudo bem por aí?",
    hora: "09:14",
    minha: true,
    achado: "Você começou 9 de cada 10 conversas",
    remate: "nos últimos dois meses. No começo do ano era metade e metade.",
  },
  {
    icon: "celular",
    rotulo: "Interesse e distanciamento",
    mensagem: "depois a gente vê isso, tá?",
    hora: "22:41",
    minha: false,
    achado: "“Depois a gente vê” apareceu 23 vezes",
    remate: "e nenhuma delas virou uma data marcada.",
  },
  {
    icon: "coracao",
    rotulo: "Mudança de tom",
    mensagem: "vc chega q horas",
    hora: "18:02",
    minha: false,
    achado: "Os apelidos sumiram em março",
    remate: "e desde então as mensagens viraram, quase todas, combinado de horário.",
  },
  {
    icon: "alerta",
    rotulo: "Inversão de assunto",
    mensagem: "você tá sempre inventando problema",
    hora: "00:53",
    minha: false,
    achado: "Em 7 das 9 vezes que você tocou no assunto",
    remate: "a resposta deixou de ser sobre o assunto e passou a ser sobre você.",
  },
];

export default function Exemplos() {
  return (
    <section id="exemplos" className="faixa relative overflow-hidden">
      <span
        aria-hidden
        className="brasa brasa-vinho -top-32 right-0 h-[26rem] w-[26rem]"
        style={{ animationDelay: "-5s" }}
      />

      <div className="shell-l relative">
        <Reveal>
          <h2 className="t-secao max-w-[24ch]">
            Coisas que só aparecem quando alguém lê tudo de uma vez.
          </h2>
          <p className="t-apoio mt-4 max-w-[56ch]">
            Você viveu essas mensagens uma por uma, ao longo de meses. A leitura vê todas juntas, na
            mesma tela. É aí que o padrão sai do lugar onde estava escondido: a repetição.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {exemplos.map((item, i) => (
            <Reveal as="li" key={item.rotulo} delay={i * 70} className="h-full">
              <article className="painel painel-hover flex h-full flex-col p-5 md:p-6">
                <p className="mb-4 flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-[#B7A2AA] uppercase">
                  {item.rotulo}
                  <span className="linha-fina h-px flex-1" />
                </p>

                <Balao lado={item.minha ? "dir" : "esq"} hora={item.hora} lida={item.minha}>
                  {item.mensagem}
                </Balao>

                <span className="fio-liga mt-3 block" aria-hidden />

                <p className="mt-1 flex items-start gap-3 rounded-[18px] border border-[#FF3068]/35 bg-[#FF3068]/12 px-3.5 py-3">
                  <Icon3D name={item.icon} size={30} className="mt-px flex-none" />
                  <span className="text-[0.875rem] leading-snug">
                    <span className="font-[family-name:var(--font-outfit)] font-semibold text-[#FF8FB3]">
                      {item.achado}
                    </span>{" "}
                    <span className="text-[#F6ECEF]/80">{item.remate}</span>
                  </span>
                </p>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <p className="mt-8 max-w-[64ch] text-[0.9375rem] leading-relaxed text-[#B7A2AA]">
            Nenhum desses achados é acusação. São contagens do que já está escrito aí, com a data e
            o trecho do lado.{" "}
            <span className="text-[#F6ECEF]">
              O que eles querem dizer, quem decide é você — mas primeiro você precisa vê-los.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
