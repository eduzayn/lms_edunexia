"use client"
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

export function MainHeader() {
  const pathname = usePathname();
  
  // Não mostrar o header em rotas de portal e autenticação
  if (pathname?.startsWith("/admin") || 
      pathname?.startsWith("/student") || 
      pathname?.startsWith("/teacher") ||
      pathname?.startsWith("/auth")) {
    return null;
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <span style={{ color: '#0066FF' }} className="text-xl font-bold">
                EdunexIA
              </span>
              <span style={{ color: '#3385FF' }} className="text-xl font-bold ml-1">
                LMS
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center">
            <div className="flex gap-1 p-1 bg-gray-50/80 backdrop-blur rounded-lg">
              <Link 
                href="/" 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm ${
                  pathname === "/" ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Início
              </Link>
              <Link 
                href="/depoimentos"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm ${
                  pathname === "/depoimentos" ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Depoimentos
              </Link>
              <Link 
                href="/precos"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm ${
                  pathname === "/precos" ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Preços
              </Link>
              <Link 
                href="/suporte"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm ${
                  pathname === "/suporte" ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Suporte
              </Link>
            </div>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="font-medium">
              Entrar
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="font-medium shadow-sm">
              Criar Conta
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
