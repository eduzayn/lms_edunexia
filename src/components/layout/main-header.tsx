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
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/precos', label: 'Preços' },
    { href: '/depoimentos', label: 'Depoimentos' },
    { href: '/suporte', label: 'Suporte' }
  ]
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">EdunexIA</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm ${
                pathname === item.href
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-foreground/60'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/auth/portal-selection">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/auth/parceiro/register">
              <Button>Seja Parceiro</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
