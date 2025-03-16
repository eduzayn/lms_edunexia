"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainFooter() {
  const pathname = usePathname();
  
  const isPortalPage = () => {
    return pathname?.startsWith("/admin") || 
           pathname?.startsWith("/student") || 
           pathname?.startsWith("/teacher");
  };
  
  // Don't show the main footer on portal pages
  if (isPortalPage()) {
    return null;
  }
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EdunexIA</h3>
            <p className="text-gray-400">
              Plataforma completa de gestão de aprendizagem para instituições educacionais.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/depoimentos" className="text-gray-400 hover:text-white">
                  Depoimentos
                </Link>
              </li>
              <li>
                <Link href="/precos" className="text-gray-400 hover:text-white">
                  Planos
                </Link>
              </li>
              <li>
                <Link href="/suporte" className="text-gray-400 hover:text-white">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/termos" className="text-gray-400 hover:text-white">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-400 hover:text-white">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <p className="text-gray-400">
              contato@edunexia.com.br
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} EdunexIA. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
