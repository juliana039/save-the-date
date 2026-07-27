import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Save the Date · Wig Party da Ju",
  description: "Quinta-feira, 3 de setembro de 2026. Separe a data e comece a procurar sua peruca!",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Save the Date · Wig Party da Ju",
    description: "03.09.2026 · Já pode começar a procurar sua peruca.",
    images: ["/wig-party-editorial.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
