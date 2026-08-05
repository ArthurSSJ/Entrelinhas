import Link from "next/link";
import Icon3D from "./Icon3D";
import Reveal from "./Reveal";
import { Manchas, Onda } from "./Enfeites";
import { BASE_CENTS, UPSELL_CENTS, brl } from "@/lib/pricing";

const inclui = [
  "Seis leituras sobre a conversa de vocês",
  "Os trechos que sustentam cada conclusão",
  "Uma sugestão concreta para esta semana",
  "Salvar em PDF direto do celular",
];

export default function Preco() {
  return (
    <>
      <Onda cor="#FFFFFF" />
      <section id="preco" className="relative overflow-hidden bg-white pb-14 md:pb-20">
        <Manchas variante="roxo" />

        <div className="shell relative">
          <Reveal>
            <h2 className="t-h2">Um preço só, no final</h2>
            <p className="mt-3 max-w-[42ch] text-[#6B6570]">
              Você envia, a leitura acontece, e só então aparece o pagamento. Se a leitura falhar,
              nada é cobrado.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div
              className="card mt-7 !p-7 text-center"
              style={{ boxShadow: "0 20px 50px rgba(255,143,171,0.22)" }}
            >
              <Icon3D name="presente" size={72} className="mx-auto animate-float-slow" />

              <p className="t-legenda mt-4">Análise completa</p>
              <p className="mt-1 font-[family-name:var(--font-outfit)] text-[3rem] leading-none font-bold tracking-tight">
                {brl(BASE_CENTS)}
              </p>
              <p className="t-legenda mt-2">Pagamento único. Sem assinatura, sem renovação.</p>

              <ul className="mt-6 space-y-2.5 text-left">
                {inclui.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[0.9375rem]">
                    <span
                      aria-hidden
                      className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-[#4ADE80]/20 text-[#22A55B]"
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
                <li className="flex items-start gap-2.5 border-t border-black/5 pt-2.5 text-[0.9375rem] text-[#6B6570]">
                  <Icon3D name="alerta" size={22} className="mt-px flex-none" />
                  Análise avançada de traição, se você quiser: + {brl(UPSELL_CENTS)}
                </li>
              </ul>

              <Link href="/analise" className="btn btn-primary btn-lg btn-block mt-7">
                Iniciar minha análise
              </Link>
              <p className="t-legenda mt-3">Leva 2 minutos e você não precisa criar conta.</p>
            </div>
          </Reveal>
        </div>
      </section>
      <Onda cor="#FFFFFF" virada />
    </>
  );
}
