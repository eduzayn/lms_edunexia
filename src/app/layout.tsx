import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainHeader } from "@/components/layout/main-header";
import { MainFooter } from "@/components/layout/main-footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edunexia LMS | Plataforma de Aprendizagem Online",
  description: "Plataforma de gerenciamento de aprendizagem com tutoria de IA, gestão financeira e recursos avançados para instituições educacionais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Note: We can't use usePathname() directly here since this is a Server Component
  // For a real implementation, we would need to use a Client Component wrapper
  // or pass the pathname as a prop from the page components
  
  // For now, we'll include the header and footer on all pages
  // In a more complete implementation, we would conditionally render based on the route
  
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <MainHeader />
        <main className="flex-grow">
          {children}
        </main>
        <MainFooter />
      </body>
    </html>
  );
}
