import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TeacherSidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  return (
    <aside className="w-64 bg-gray-50 h-screen p-4">
      <div className="mb-6">
        <Link href="/teacher/dashboard" className="text-xl font-bold text-primary">
          Portal do Professor
        </Link>
      </div>
      <nav className="space-y-1">
        <Link 
          href="/teacher/dashboard" 
          className={`block px-4 py-2 rounded-md ${isActive('/teacher/dashboard') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Dashboard
        </Link>
        <Link 
          href="/teacher/courses" 
          className={`block px-4 py-2 rounded-md ${isActive('/teacher/courses') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Meus Cursos
        </Link>
        <Link 
          href="/teacher/students" 
          className={`block px-4 py-2 rounded-md ${isActive('/teacher/students') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Meus Alunos
        </Link>
        <Link 
          href="/teacher/content" 
          className={`block px-4 py-2 rounded-md ${isActive('/teacher/content') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Conteúdo
        </Link>
        <Link 
          href="/teacher/assessments" 
          className={`block px-4 py-2 rounded-md ${isActive('/teacher/assessments') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Avaliações
        </Link>
        <Link 
          href="/forums/list" 
          className={`block px-4 py-2 rounded-md ${isActive('/forums/list') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Fóruns
        </Link>
        <Link 
          href="/teacher/reports" 
          className={`block px-4 py-2 rounded-md ${isActive('/teacher/reports') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Relatórios
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
