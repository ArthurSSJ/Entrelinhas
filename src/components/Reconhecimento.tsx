import Icon3D from "./Icon3D";
import Reveal from "./Reveal";

/**
 * A seção que faz a pessoa parar de rolar. Não vende nada: devolve as frases
 * que ela já pensou sozinha. Quem se reconhece em três continua lendo, e quem
 * se reconhece em três é exatamente quem compra.
 *
 * São comportamentos, não sentimentos. "Contei os minutos" cutuca mais do que
 * "me senti inseguro", porque a pessoa lembra da vez em que fez isso.
 */
const frases = [
  "Você releu a mesma mensagem quatro vezes procurando um tom que talvez nem esteja lá.",
  "Se você não manda a primeira mensagem, o dia passa em branco. E você já testou isso.",
  "Faz tempo que ninguém manda áudio rindo.",
  "Você já contou os minutos entre a sua mensagem e a resposta. Mais de uma vez.",
  "Já abriu a conversa só para olhar a hora do último visto.",
  "Já pensou “será que sou eu que estou exagerando?” e não teve com quem falar.",
];

export default function Reconhecimento() {
  return (
    <section className="faixa relative overflow-hidden">
      <span
        aria-hidden
        className="brasa brasa-vinho -top-32 right-0 h-[26rem] w-[26rem]"
        style={{ animationDelay: "-5s" }}
      />

      <div className="shell-l relative">
        <Reveal>
          <h2 className="t-secao max-w-[20ch]">Você reconhece pelo menos três destas.</h2>
          <p className="t-apoio mt-4 max-w-[54ch]">
            Sozinha, nenhuma delas quer dizer nada. Juntas, elas são um padrão. E padrão ninguém
            enxerga rolando a tela para cima, uma mensagem por vez, às duas da manhã.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-3 md:grid-cols-2">
          {frases.map((frase, i) => (
            <Reveal
              as="li"
              key={frase}
              delay={i * 60}
              className="bloco flex items-start gap-3.5 px-5 py-4"
            >
              <span
                aria-hidden
                className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[#FF3068]/16"
              >
                <svg width="11" height="11" viewBox="0 0 14 14" focusable="false">
                  <path
                    d="M2 7.5 5.5 11 12 3.5"
                    stroke="#FF8FB3"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </span>
              <span className="text-[0.9375rem] leading-relaxed text-[#F6ECEF]/90">{frase}</span>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <p className="painel mt-8 flex items-start gap-4 p-5 text-[0.9375rem] leading-relaxed md:items-center">
            <Icon3D name="lupa" size={46} className="flex-none" />
            <span className="text-[#F6ECEF]/90">
              O relatório lê meses de conversa de uma vez só e mostra o que se repete. É o que você
              faria se tivesse tempo, distância e nenhum envolvimento com a história.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
