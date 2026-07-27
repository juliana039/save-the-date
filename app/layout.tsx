import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Save the Date · Formatura da Nat",
  description: "Quinta-feira, 3 de setembro de 2026. Eulálio Chaves, UFAM. Dress code: sport fino.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Save the Date · Formatura da Nat",
    description: "03.09.2026 · Eulálio Chaves, UFAM.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
