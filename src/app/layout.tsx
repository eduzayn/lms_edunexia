import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { MainFooter } from "@/components/layout/main-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EdunexIA LMS",
  description: "Plataforma de Aprendizagem com Inteligência Artificial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verifica se a página atual é uma página de autenticação
  const isAuthPage = children?.toString().includes('auth');

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {!isAuthPage && <Navbar />}
        <main className={!isAuthPage ? "pt-16" : ""}>
          {children}
        </main>
        {!isAuthPage && <MainFooter />}
      </body>
    </html>
  );
}
