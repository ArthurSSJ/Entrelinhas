import type { Metadata, Viewport } from "next";
import { Manrope, Outfit } from "next/font/google";
import { MARCA } from "@/lib/marca";
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
  title: `${MARCA} · o que a conversa de vocês já diz`,
  description:
    "Envie uma conversa do WhatsApp e receba em dois minutos os padrões que se repetem. Sem cadastro, ninguém do outro lado é avisado, e a conversa não fica guardada.",
  openGraph: {
    siteName: MARCA,
    title: "Você já sabe. Só falta nomear.",
    description:
      "A leitura da conversa de vocês em dois minutos. Sem cadastro e sem ninguém ficar sabendo.",
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
