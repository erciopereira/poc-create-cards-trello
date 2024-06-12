import { ErrosApiProvider } from "@/contexts/errors-api-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Criar Cards Trello",
  description: "Sistema de automação de criação de cards no trello",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <ErrosApiProvider>
          <Providers>{children}</Providers>
        </ErrosApiProvider>
      </body>
    </html>
  );
}
