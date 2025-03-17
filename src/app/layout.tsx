import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { MainFooter } from "@/components/layout/main-footer";
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/providers/auth-provider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS Edunexia",
  description: "Sistema de Gestão de Aprendizagem",
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
        <AuthProvider>
          {!isAuthPage && <Navbar />}
          <main className={!isAuthPage ? "pt-16" : ""}>
            {children}
          </main>
          {!isAuthPage && <MainFooter />}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
