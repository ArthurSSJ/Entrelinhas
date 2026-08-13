import Image from "next/image";
import Link from "next/link";
import Icon3D from "./Icon3D";
import { BASE_CENTS, UPSELL_CENTS, brl } from "@/lib/pricing";

const inclui = [
  "Seis leituras sobre a conversa de vocês",
  "A data e o trecho que sustentam cada conclusão",
  "Uma sugestão concreta para esta semana",
  "Salvar em PDF direto do celular",
];

/**
 * O cartão da oferta. Mora dentro do fecho da página, não numa seção própria:
 * preço e decisão no mesmo campo de visão, para a pessoa não ter que rolar
 * para cima de novo atrás do valor.
 *
 * O `id` continua sendo `preco` porque o menu do topo aponta para cá.
 */
export default function Oferta() {
  return (
    <div id="preco" className="painel painel-neon mx-auto mt-10 max-w-[520px] p-7 text-center md:p-9">
      <Image
        src="/render/presente.png"
        alt=""
        width={760}
        height={760}
        aria-hidden
        className="animate-float-slow mx-auto w-[124px] drop-shadow-[0_18px_44px_rgba(255,48,104,0.42)]"
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
          <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-[#F6ECEF]/90">
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

      <Link href="/analise" className="btn btn-neon btn-lg btn-block mt-8 [text-wrap:balance]">
        Quero descobrir o que está acontecendo
      </Link>
      <p className="mt-4 text-[0.875rem] text-[#B7A2AA]">
        Você lê a primeira conclusão antes de pagar. Se a leitura falhar, nada é cobrado.
      </p>
    </div>
  );
}
