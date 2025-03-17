import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { MainFooter } from "@/components/layout/main-footer";
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/providers/auth-provider'
import { Toaster as SonnerToaster } from 'sonner'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'EdunexIA LMS',
    template: '%s | EdunexIA LMS',
  },
  description: 'Plataforma de ensino online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verifica se a página atual é uma página de autenticação
  const isAuthPage = children?.toString().includes('auth');

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.variable}>
        <AuthProvider>
          {!isAuthPage && <Navbar />}
          <main className={!isAuthPage ? "pt-16" : ""}>
            {children}
          </main>
          {!isAuthPage && <MainFooter />}
          <Toaster />
          <SonnerToaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
