import type { Metadata, Viewport } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

/* Manrope no corpo: tem a mesma cara arredondada e geométrica do Outfit,
   então título e texto parecem a mesma família em dois pesos de voz. */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Entrelinhas · entenda o que sua conversa já diz",
  description:
    "Envie o histórico de uma conversa do WhatsApp e receba uma leitura clara dos padrões do relacionamento. A conversa não fica guardada.",
  openGraph: {
    title: "Entrelinhas",
    description: "Entenda o que sua conversa já diz.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0407",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
