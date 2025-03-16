"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StudentSidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  return (
    <aside className="w-64 bg-gray-50 h-screen p-4">
      <div className="mb-6">
        <Link href="/student/dashboard" className="text-xl font-bold text-primary">
          Portal do Aluno
        </Link>
      </div>
      <nav className="space-y-1">
        <Link 
          href="/student/dashboard" 
          className={`block px-4 py-2 rounded-md ${isActive('/student/dashboard') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Dashboard
        </Link>
        <Link 
          href="/student/courses" 
          className={`block px-4 py-2 rounded-md ${isActive('/student/courses') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Meus Cursos
        </Link>
        <Link 
          href="/student/progress" 
          className={`block px-4 py-2 rounded-md ${isActive('/student/progress') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Meu Progresso
        </Link>
        <Link 
          href="/student/financial" 
          className={`block px-4 py-2 rounded-md ${isActive('/student/financial') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Financeiro
        </Link>
        <Link 
          href="/student/certificates" 
          className={`block px-4 py-2 rounded-md ${isActive('/student/certificates') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Certificados
        </Link>
        <Link 
          href="/student/ai-tutor" 
          className={`block px-4 py-2 rounded-md ${isActive('/student/ai-tutor') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Tutor IA
        </Link>
        <Link 
          href="/student/activities" 
          className={`block px-4 py-2 rounded-md ${isActive('/student/activities') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Atividades
        </Link>
        <Link 
          href="/forums/list" 
          className={`block px-4 py-2 rounded-md ${isActive('/forums/list') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Fóruns
        </Link>
        <Link 
          href="/student/videoconference" 
          className={`block px-4 py-2 rounded-md ${isActive('/student/videoconference') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Videoconferência
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
