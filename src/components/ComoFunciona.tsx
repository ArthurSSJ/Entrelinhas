import Icon3D, { type IconName } from "./Icon3D";
import Reveal from "./Reveal";

const passos: { icon: IconName; titulo: string; texto: string }[] = [
  {
    icon: "celular",
    titulo: "Exporte a conversa",
    texto: "Quatro toques dentro do WhatsApp. A gente mostra cada um deles na tela seguinte.",
  },
  {
    icon: "nuvem",
    titulo: "Responda e envie",
    texto: "Quatro perguntas rápidas sobre a relação e o arquivo .txt. Sem cadastro, sem senha.",
  },
  {
    icon: "presente",
    titulo: "Leia o que apareceu",
    texto: "Em menos de dois minutos o relatório fica pronto. Você paga só para abrir.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como" className="band">
      <div className="shell">
        <Reveal>
          <h2 className="t-h2">Como funciona</h2>
          <p className="mt-3 max-w-[42ch] text-[#6B6570]">
            Do começo ao relatório aberto: menos tempo do que uma ida ao mercado.
          </p>
        </Reveal>

        <ol className="mt-8 space-y-4">
          {passos.map((passo, i) => (
            <Reveal key={passo.titulo} delay={i * 80}>
              <li className="card card-hover relative !pt-8 !pl-6">
                <span className="numero-passo absolute -top-3 left-5" aria-hidden>
                  {i + 1}
                </span>
                <div className="flex items-start gap-4">
                  <Icon3D name={passo.icon} size={56} className="flex-none" />
                  <div>
                    <h3 className="t-h3">{passo.titulo}</h3>
                    <p className="t-legenda mt-1.5">{passo.texto}</p>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
