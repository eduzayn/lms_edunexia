import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

export function MainHeader() {
  const pathname = usePathname();
  
  const isPortalPage = () => {
    return pathname?.startsWith("/admin") || 
           pathname?.startsWith("/student") || 
           pathname?.startsWith("/teacher");
  };
  
  // Don't show the main header on portal pages
  if (isPortalPage()) {
    return null;
  }
  
  return (
    <header className="bg-white border-b py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Edunexia
          </Link>
          <nav className="ml-10 hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-primary">
              Início
            </Link>
            <Link href="/depoimentos" className="text-gray-600 hover:text-primary">
              Depoimentos
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-primary">
              Preços
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-primary">
              Suporte
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="outline">Entrar</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Criar Conta</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
