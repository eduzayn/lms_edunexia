"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StudentSidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/aluno/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/aluno/cursos', label: 'Meus Cursos', icon: '📚' },
    { href: '/aluno/progresso', label: 'Meu Progresso', icon: '📈' },
    { href: '/aluno/financeiro', label: 'Financeiro', icon: '💰' },
    { href: '/aluno/certificados', label: 'Certificados', icon: '🎓' },
    { href: '/aluno/ai-tutor', label: 'Tutor IA', icon: '🤖' },
    { href: '/aluno/atividades', label: 'Atividades', icon: '✏️' },
    { href: '/forums/list', label: 'Fóruns', icon: '💬' },
    { href: '/aluno/videoconferencia', label: 'Videoconferência', icon: '🎥' }
  ];
  
  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };
  
  return (
    <aside className="w-64 bg-gray-50 h-screen p-4 border-r">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary">Portal do Aluno</h2>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              isActive(item.href)
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 space-y-1 w-56">
        <Link
          href="/suporte"
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
        >
          <span className="mr-3">❓</span>
          Suporte
        </Link>
        <Link
          href="/auth/login"
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
        >
          <span className="mr-3">🚪</span>
          Sair
        </Link>
      </div>
    </aside>
  );
}
