import Balao from "./Balao";
import Icon3D, { type IconName } from "./Icon3D";
import Reveal from "./Reveal";

/**
 * A seção de exemplos reais em formato de print do WhatsApp.
 */
type Mensagem = {
  texto: string;
  hora: string;
  minha: boolean;
  lida?: boolean;
};

type Exemplo = {
  icon: IconName;
  rotulo: string;
  mensagens: Mensagem[];
  achado: string;
  remate: string;
};

const exemplos: Exemplo[] = [
  {
    icon: "conversa",
    rotulo: "QUEM SUSTENTA A CONVERSA",
    mensagens: [
      {
        texto: "oi, tudo bem por aí?",
        hora: "09:14",
        minha: true,
        lida: true,
      },
    ],
    achado: "Você começou 9 de cada 10 conversas",
    remate: "nos últimos dois meses. No começo do ano era metade e metade.",
  },
  {
    icon: "celular",
    rotulo: "QUANDO A RESPOSTA DEMORA",
    mensagens: [
      {
        texto: "amor, tá tudo bem?",
        hora: "23:47",
        minha: true,
        lida: true,
      },
      {
        texto: "foi mal, tava ocupado",
        hora: "08:12",
        minha: false,
      },
    ],
    achado: "Uma vez é normal.",
    remate: "Toda vez começa a fazer você se perguntar o motivo.",
  },
  {
    icon: "coracao",
    rotulo: "QUANDO A CONVERSA ESFRIA",
    mensagens: [
      { texto: "chegou bem?", hora: "19:30", minha: true, lida: true },
      { texto: "sim", hora: "19:42", minha: false },
      { texto: "vai fazer oq?", hora: "19:43", minha: true, lida: true },
      { texto: "nada", hora: "20:05", minha: false },
      { texto: "quer fazer alguma coisa depois?", hora: "20:10", minha: true, lida: true },
      { texto: "não sei", hora: "21:14", minha: false },
    ],
    achado: "Não foi uma mensagem.",
    remate: "Foram várias pequenas respostas que fizeram a conversa parecer diferente.",
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

        <ul className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {exemplos.map((item, i) => (
            <Reveal as="li" key={item.rotulo} delay={i * 70} className="h-full">
              <article className="relative flex h-full flex-col overflow-hidden rounded-[22px] sm:rounded-[24px] border border-white/12 bg-[#0b141a] shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(255,48,104,0.12)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(255,48,104,0.22)]">
                {/* Top Header do WhatsApp */}
                <div className="flex items-center justify-between border-b border-white/5 bg-[#202c33] px-3.5 sm:px-4 py-2.5 text-[#e9edef]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#8696a0] flex-none"
                      aria-hidden="true"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <div className="relative flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gradient-to-tr from-[#ff3068] to-[#ff8fb3] text-xs font-bold text-white shadow-sm">
                      💬
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[0.75rem] sm:text-[0.8125rem] font-semibold tracking-wide text-[#e9edef] truncate">
                        {item.rotulo}
                      </span>
                      <span className="text-[0.625rem] text-[#8696a0]">online</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 text-[#8696a0] flex-none ml-2">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </div>
                </div>

                {/* Wallpaper do WhatsApp */}
                <div className="whatsapp-wallpaper relative flex flex-1 flex-col justify-between p-3.5 sm:p-5 space-y-3">
                  {/* Balões de Conversa */}
                  <div className="space-y-2">
                    {item.mensagens.map((msg, idx) => (
                      <Balao
                        key={idx}
                        lado={msg.minha ? "dir" : "esq"}
                        hora={msg.hora}
                        lida={msg.lida}
                        variant="whatsapp"
                        className="fio-msg"
                      >
                        {msg.texto}
                      </Balao>
                    ))}
                  </div>

                  {/* Card do Achado */}
                  <div className="pt-2">
                    <span className="fio-liga fio-achado mb-2 block" aria-hidden />

                    <p className="fio-achado relative z-10 flex items-start gap-2.5 sm:gap-3 rounded-[16px] border border-[#FF3068]/40 bg-[#17060b]/92 p-3 sm:px-3.5 sm:py-3 shadow-[0_8px_25px_rgba(255,48,104,0.22)] backdrop-blur-md">
                      <Icon3D name={item.icon} size={26} className="mt-0.5 flex-none" />
                      <span className="text-[0.8125rem] sm:text-[0.875rem] leading-snug">
                        <span className="font-[family-name:var(--font-outfit)] font-semibold text-[#FF8FB3]">
                          {item.achado}
                        </span>{" "}
                        <span className="text-[#F6ECEF]/80 font-normal">{item.remate}</span>
                      </span>
                    </p>
                  </div>
                </div>

                {/* Rodapé do WhatsApp (Barra de Mensagem) */}
                <div className="flex items-center gap-2 border-t border-white/5 bg-[#111b21] px-2.5 sm:px-3 py-2 text-[#8696a0]">
                  <div className="flex flex-1 items-center justify-between rounded-full bg-[#202c33] px-3 py-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                      </svg>
                      <span className="text-[0.75rem] sm:text-[0.8125rem] text-[#8696a0]">Mensagem</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#00a884] text-white shadow-sm">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </div>
                </div>
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
