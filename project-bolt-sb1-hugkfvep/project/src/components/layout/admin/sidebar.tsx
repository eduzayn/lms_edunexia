import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  FileText,
  Settings,
  DollarSign,
  School,
  UserCog
} from 'lucide-react';

const modules = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
    color: 'text-gray-600'
  },
  {
    name: 'Comunicação',
    icon: MessageSquare,
    href: '/admin/comunicacao',
    color: 'text-blue-600'
  },
  {
    name: 'Alunos',
    icon: Users,
    href: '/admin/alunos',
    color: 'text-green-600'
  },
  {
    name: 'Cursos',
    icon: BookOpen,
    href: '/admin/cursos',
    color: 'text-purple-600'
  },
  {
    name: 'Matrículas',
    icon: School,
    href: '/admin/matriculas',
    color: 'text-orange-600'
  },
  {
    name: 'Financeiro',
    icon: DollarSign,
    href: '/admin/financeiro',
    color: 'text-yellow-600'
  },
  {
    name: 'Relatórios',
    icon: FileText,
    href: '/admin/relatorios',
    color: 'text-indigo-600'
  }
];

const settingsModules = [
  {
    name: 'Usuários',
    icon: UserCog,
    href: '/admin/users',
    color: 'text-gray-600'
  }
];

export default function AdminSidebar() {
  const location = useLocation();

  const renderMenuItem = (module: typeof modules[0]) => {
    const isActive = location.pathname.startsWith(module.href);
    const Icon = module.icon;

    return (
      <li key={module.name}>
        <Link
          to={module.href}
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
            isActive 
              ? "bg-gray-100 text-gray-900" 
              : "hover:bg-gray-50"
          )}
        >
          <Icon className={cn("h-5 w-5", module.color)} />
          <span className="font-medium">{module.name}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="w-64 bg-white border-r h-screen fixed left-0 top-16 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {modules.map(renderMenuItem)}
        </ul>

        <div className="mt-8">
          <div className="px-3 mb-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </div>
          </div>
          <ul className="space-y-2">
            {settingsModules.map(renderMenuItem)}
          </ul>
        </div>
      </nav>
    </div>
  );
}