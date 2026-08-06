import type { Metadata } from "next";
import "./globals.css";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const SITE_URL = "https://juliana039.github.io" + BASE_PATH + "/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Save the Date · Wig Party da Ju",
  description: "Sábado, 5 de setembro de 2026, 19h30. Separe a data e comece a procurar sua peruca!",
  icons: { icon: `${BASE_PATH}/favicon.svg` },
  openGraph: {
    title: "Save the Date · Wig Party da Ju",
    description: "05.09.2026 · Já pode começar a procurar sua peruca.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}wig-party-editorial.png`,
        width: 1536,
        height: 1024,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Save the Date · Wig Party da Ju",
    description: "05.09.2026 · Já pode começar a procurar sua peruca.",
    images: [`${SITE_URL}wig-party-editorial.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
