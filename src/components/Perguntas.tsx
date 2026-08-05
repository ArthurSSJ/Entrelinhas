import Reveal from "./Reveal";

const perguntas = [
  {
    q: "A outra pessoa fica sabendo?",
    a: "Não. A exportação acontece no seu celular e não avisa ninguém. O relatório também é só seu.",
  },
  {
    q: "Preciso enviar a conversa inteira?",
    a: "Não precisa. Quanto mais histórico, mais padrões aparecem, mas alguns meses já bastam para a leitura fazer sentido.",
  },
  {
    q: "E se a conversa tiver áudio e foto?",
    a: "Exporte escolhendo “Sem mídia”. Só o texto é lido, e é o que a leitura precisa.",
  },
  {
    q: "Quando eu pago?",
    a: "Depois. Você envia a conversa, a leitura acontece e só então aparece o valor. Se a leitura falhar, nada é cobrado.",
  },
  {
    q: "O que é a análise avançada de traição?",
    a: "Uma leitura separada, focada em sinais de envolvimento com outra pessoa: mudanças de horário, de tom e de assunto. Ela mostra em que trecho cada conclusão se apoia, e não afirma nada além disso.",
  },
  {
    q: "Isso substitui terapia?",
    a: "Não. É uma leitura de padrões de conversa. Serve para começar um assunto, não para encerrar um.",
  },
];

export default function Perguntas() {
  return (
    <section id="perguntas" className="faixa faixa-colada">
      <div className="shell-l">
        <Reveal>
          <h2 className="t-secao mx-auto max-w-[24ch] text-center">
            Perguntas que todo mundo faz
          </h2>
        </Reveal>

        <div className="mx-auto mt-9 max-w-[820px] space-y-3">
          {perguntas.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <details className="painel painel-hover group px-5 md:px-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-[family-name:var(--font-outfit)] text-[1.0625rem] font-semibold text-[#F6ECEF]">
                  {item.q}
                  <span
                    aria-hidden
                    className="grid h-8 w-8 flex-none place-items-center rounded-full border border-[#FF3068]/40 bg-[#FF3068]/14 text-[#FF8FB3] transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" focusable="false">
                      <path
                        d="M6 1v10M1 6h10"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="t-apoio max-w-[62ch] pb-5 text-[0.9375rem]">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
