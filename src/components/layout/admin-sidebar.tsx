import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  return (
    <aside className="w-64 bg-gray-50 h-screen p-4">
      <div className="mb-6">
        <Link href="/admin/dashboard" className="text-xl font-bold text-primary">
          Portal Administrativo
        </Link>
      </div>
      <nav className="space-y-1">
        <Link 
          href="/admin/dashboard" 
          className={`block px-4 py-2 rounded-md ${isActive('/admin/dashboard') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Dashboard
        </Link>
        <Link 
          href="/admin/users" 
          className={`block px-4 py-2 rounded-md ${isActive('/admin/users') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Usuários
        </Link>
        <Link 
          href="/admin/courses/list" 
          className={`block px-4 py-2 rounded-md ${isActive('/admin/courses') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Cursos
        </Link>
        <Link 
          href="/admin/content/list" 
          className={`block px-4 py-2 rounded-md ${isActive('/admin/content') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Conteúdo
        </Link>
        <Link 
          href="/admin/modules" 
          className={`block px-4 py-2 rounded-md ${isActive('/admin/modules') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Módulos
        </Link>
        <Link 
          href="/admin/financial" 
          className={`block px-4 py-2 rounded-md ${isActive('/admin/financial') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Financeiro
        </Link>
        <Link 
          href="/admin/reports" 
          className={`block px-4 py-2 rounded-md ${isActive('/admin/reports') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Relatórios
        </Link>
        <Link 
          href="/admin/analytics/dashboard" 
          className={`block px-4 py-2 rounded-md ${isActive('/admin/analytics') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Analytics
        </Link>
        <Link 
          href="/admin/assessments/list" 
          className={`block px-4 py-2 rounded-md ${isActive('/admin/assessments') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Avaliações
        </Link>
        <Link 
          href="/admin/settings" 
          className={`block px-4 py-2 rounded-md ${isActive('/admin/settings') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Configurações
        </Link>
      </nav>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link 
          href="/support" 
          className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Suporte
        </Link>
        <Link 
          href="/auth/login" 
          className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Sair
        </Link>
      </div>
    </aside>
  );
}
