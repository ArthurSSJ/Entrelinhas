import Image from "next/image";
import Link from "next/link";
import Icon3D from "./Icon3D";
import Reveal from "./Reveal";
import { BASE_CENTS, UPSELL_CENTS, brl } from "@/lib/pricing";

const inclui = [
  "Seis leituras sobre a conversa de vocês",
  "A data e o trecho que sustentam cada conclusão",
  "Uma sugestão concreta para esta semana",
  "Salvar em PDF direto do celular",
];

export default function Preco() {
  return (
    <section id="preco" className="faixa relative overflow-hidden">
      <span
        aria-hidden
        className="brasa brasa-vinho top-10 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2"
      />

      <div className="shell-l relative">
        <Reveal>
          <div className="mx-auto max-w-[46ch] text-center">
            <h2 className="t-secao">Um preço só. E você paga depois.</h2>
            <p className="t-apoio mt-4">
              Você envia, a leitura acontece, você lê a primeira conclusão, e só então aparece o
              pagamento. Se a leitura falhar, nada é cobrado.
            </p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="painel painel-neon mx-auto mt-10 max-w-[520px] p-7 text-center md:p-9">
            <Image
              src="/render/presente.png"
              alt=""
              width={760}
              height={760}
              aria-hidden
              className="animate-float-slow mx-auto w-[132px] drop-shadow-[0_18px_44px_rgba(255,48,104,0.42)]"
            />

            <p className="mt-5 text-[0.9375rem] text-[#B7A2AA]">Análise completa</p>
            <p className="titulo-luz mt-1 font-[family-name:var(--font-outfit)] text-[3.25rem] font-bold tracking-tight">
              {brl(BASE_CENTS)}
            </p>
            <p className="mx-auto mt-2 max-w-[34ch] text-[0.9375rem] leading-snug text-[#FF8FB3]">
              Você já perdeu mais do que isso numa noite só, rolando a tela para cima.
            </p>
            <p className="mt-3 text-[0.875rem] text-[#B7A2AA]">
              Pagamento único. Sem assinatura, sem renovação, sem cobrança no mês que vem.
            </p>

            <ul className="mt-7 space-y-3 text-left">
              {inclui.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[0.9375rem] text-[#F6ECEF]/90"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-[#FF3068]/18 text-[#FF8FB3]"
                  >
                    <svg width="11" height="11" viewBox="0 0 14 14" focusable="false">
                      <path
                        d="M2 7.5 5.5 11 12 3.5"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
              <li className="flex items-start gap-3 border-t border-white/8 pt-3 text-[0.9375rem] text-[#B7A2AA]">
                <Icon3D name="alerta" size={22} className="mt-px flex-none" />
                Análise avançada de traição, se você quiser: + {brl(UPSELL_CENTS)}
              </li>
            </ul>

            <Link href="/analise" className="btn btn-neon btn-lg btn-block mt-8">
              Ler minha conversa
            </Link>
            <p className="mt-4 text-[0.875rem] text-[#B7A2AA]">
              Dois minutos, sem cadastro, e ninguém do outro lado é avisado.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
