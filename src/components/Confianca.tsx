import Icon3D, { type IconName } from "./Icon3D";
import Reveal from "./Reveal";

const garantias: { icon: IconName; titulo: string; texto: string }[] = [
  {
    icon: "cadeado",
    titulo: "A conversa não fica guardada",
    texto: "Ela é lida uma vez e apagada. Nada é gravado em disco.",
  },
  {
    icon: "escudo",
    titulo: "Sem cadastro",
    texto: "Sem conta, sem senha, sem e-mail. Você entra, envia e recebe.",
  },
  {
    icon: "coracao",
    titulo: "Sem julgamento",
    texto: "O relatório descreve o que está escrito. Quem decide o que fazer é você.",
  },
];

/**
 * Sem cartões: as três garantias moram no mesmo painel, separadas por um fio.
 * São promessas do mesmo contrato, não três produtos.
 */
export default function Confianca() {
  return (
    <section className="faixa faixa-colada">
      <div className="shell-l">
        <Reveal>
          <h2 className="t-secao max-w-[22ch]">Você está entregando algo íntimo</h2>
          <p className="t-apoio mt-4 max-w-[48ch]">
            Por isso vale dizer com todas as letras o que acontece do outro lado.
          </p>
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
      </div>
    </section>
  );
}
