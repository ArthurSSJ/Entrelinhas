import Cabecalho from "@/components/Cabecalho";

export default function LayoutAnalise({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Cabecalho simples />
      <main className="band pt-7">
        <div className="shell">{children}</div>
      </main>
    </>
  );
}
