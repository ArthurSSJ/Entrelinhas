import Icon3D, { type IconName } from "./Icon3D";
import Reveal from "./Reveal";

/**
 * Privacidade e segurança, logo antes do preço.
 *
 * É aqui que a compra trava: a pessoa quer a leitura e tem medo de entregar a
 * conversa. A seção junta as três garantias do contrato com o que o produto
 * não é — dizer o que ele não faz dá mais confiança do que jurar o que ele
 * faz, e é o que evita o pedido de reembolso na semana seguinte.
 */
const garantias: { icon: IconName; titulo: string; texto: string }[] = [
  {
    icon: "cadeado",
    titulo: "A conversa não fica guardada",
    texto: "Ela é lida uma única vez e apagada em seguida. Nada é gravado em disco.",
  },
  {
    icon: "escudo",
    titulo: "Ninguém fica sabendo",
    texto:
      "A exportação acontece no seu celular e não avisa ninguém. Sem conta, sem senha, sem e-mail.",
  },
  {
    icon: "coracao",
    titulo: "Sem julgamento",
    texto:
      "O relatório descreve o que está escrito. Não torce por ninguém e não manda você terminar nada.",
  },
];

const selos = ["Sem cadastro", "Ninguém do outro lado é avisado", "Você vê antes de pagar"];

export default function Confianca() {
  return (
    <section id="privacidade" className="faixa faixa-colada">
      <div className="shell-l">
        <Reveal>
          <h2 className="t-secao max-w-[22ch]">Você está prestes a entregar algo íntimo</h2>
          <p className="t-apoio mt-4 max-w-[50ch]">
            Então vale dizer com todas as letras o que acontece do outro lado, antes de você
            clicar.
          </p>

          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            {selos.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[0.9375rem] font-medium text-[#F6ECEF]"
              >
                <Tique />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <div className="painel mt-8 grid divide-y divide-white/8 md:grid-cols-3 md:divide-x md:divide-y-0">
            {garantias.map((item) => (
              <div key={item.titulo} className="p-6 md:p-8">
                <Icon3D name={item.icon} size={52} />
                <h3 className="mt-4 font-[family-name:var(--font-outfit)] text-[1.0625rem] font-semibold text-[#F6ECEF]">
                  {item.titulo}
                </h3>
                <p className="t-apoio mt-2 text-[0.9375rem]">{item.texto}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-6 flex max-w-[72ch] items-start gap-4 text-[0.9375rem] leading-relaxed text-[#B7A2AA]">
            <Icon3D name="coracao" size={38} className="flex-none" />
            <span>
              A conversa é de duas pessoas. Envie só conversa da qual você participou, e use o que
              ler para falar com quem está do outro lado, não pelas costas dele.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Tique({ cor = "#FF8FB3" }: { cor?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden focusable="false">
      <path
        d="M2 7.5 5.5 11 12 3.5"
        stroke={cor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
