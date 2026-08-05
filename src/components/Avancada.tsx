import Icon3D from "./Icon3D";
import Reveal from "./Reveal";
import { brl, UPSELL_CENTS } from "@/lib/pricing";

export default function Avancada() {
  return (
    <section className="band pt-0">
      <div className="shell">
        <Reveal>
          <div
            className="card relative overflow-hidden !p-6"
            style={{
              borderColor: "rgba(255,107,107,0.4)",
              background: "linear-gradient(135deg, #FFFFFF 0%, rgba(255,107,107,0.08) 100%)",
              boxShadow: "0 14px 38px rgba(255,107,107,0.16)",
            }}
          >
            <span
              aria-hidden
              className="mancha absolute h-40 w-40"
              style={{ background: "#FF6B6B", opacity: 0.16, top: "-3rem", right: "-2rem" }}
            />

            <div className="relative">
              <div className="flex items-start gap-4">
                <Icon3D name="alerta" size={62} className="flex-none" />
                <div>
                  <span className="badge-preco">Adicional · {brl(UPSELL_CENTS)}</span>
                  <h2 className="t-h2 mt-2">Análise avançada de traição</h2>
                </div>
              </div>

              <p className="mt-4 text-[#6B6570]">
                Uma leitura separada, só sobre sinais de envolvimento com outra pessoa: mudanças de
                horário, de tom, de assunto e de tempo de resposta. Cada conclusão vem com o trecho
                em que ela se apoia.
              </p>

              <p className="t-legenda mt-4">
                Você escolhe se quer isso na hora de enviar a conversa. Dá para seguir sem.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
