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
    <section className="band">
      <div className="shell">
        <Reveal>
          <h2 className="t-h2">Perguntas que todo mundo faz</h2>
        </Reveal>

        <div className="mt-6 space-y-3">
          {perguntas.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <details className="card group !py-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-[family-name:var(--font-outfit)] text-[1.0625rem] font-semibold">
                  {item.q}
                  <span
                    aria-hidden
                    className="grid h-7 w-7 flex-none place-items-center rounded-full bg-[#FFD6E0] text-[#FF6B6B] transition-transform duration-300 group-open:rotate-45"
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
                <p className="t-legenda pb-5">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
