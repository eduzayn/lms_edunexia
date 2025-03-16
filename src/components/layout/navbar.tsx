"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full bg-white border-b z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            EdunexIA LMS
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className={`text-gray-600 hover:text-gray-900 ${pathname === '/' ? 'text-blue-600' : ''}`}
            >
              Início
            </Link>
            <Link 
              href="/depoimentos"
              className={`text-gray-600 hover:text-gray-900 ${pathname === '/depoimentos' ? 'text-blue-600' : ''}`}
            >
              Depoimentos
            </Link>
            <Link 
              href="/precos"
              className={`text-gray-600 hover:text-gray-900 ${pathname === '/precos' ? 'text-blue-600' : ''}`}
            >
              Preços
            </Link>
            <Link 
              href="/suporte"
              className={`text-gray-600 hover:text-gray-900 ${pathname === '/suporte' ? 'text-blue-600' : ''}`}
            >
              Suporte
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="default" size="sm">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 