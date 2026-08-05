import Cabecalho from "@/components/Cabecalho";

export default function LayoutRelatorio({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Cabecalho simples />
      <main className="band pt-8">
        <div className="shell">{children}</div>
      </main>
    </>
  );
}
