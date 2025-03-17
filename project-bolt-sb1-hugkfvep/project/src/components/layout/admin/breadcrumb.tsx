import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const routeNames: Record<string, string> = {
  admin: 'Administração',
  dashboard: 'Dashboard',
  comunicacao: 'Comunicação',
  alunos: 'Alunos',
  cursos: 'Cursos',
  matriculas: 'Matrículas',
  financeiro: 'Financeiro',
  relatorios: 'Relatórios',
  configuracoes: 'Configurações'
};

export default function AdminBreadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link to="/" className="hover:text-gray-900">
        Início
      </Link>
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <React.Fragment key={path}>
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="font-medium text-gray-900">
                {routeNames[segment] || segment}
              </span>
            ) : (
              <Link to={path} className="hover:text-gray-900">
                {routeNames[segment] || segment}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}