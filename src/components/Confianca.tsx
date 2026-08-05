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

export default function Confianca() {
  return (
    <section className="band bg-white">
      <div className="shell">
        <Reveal>
          <h2 className="t-h2">Você está entregando algo íntimo</h2>
          <p className="mt-3 max-w-[44ch] text-[#6B6570]">
            Por isso vale dizer com todas as letras o que acontece do outro lado.
          </p>
        </Reveal>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {garantias.map((item, i) => (
            <Reveal key={item.titulo} delay={i * 70}>
              <div className="card card-hover h-full bg-[#FFF8F5]">
                <Icon3D name={item.icon} size={52} />
                <h3 className="t-h3 mt-3">{item.titulo}</h3>
                <p className="t-legenda mt-1.5">{item.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
