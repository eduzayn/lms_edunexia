import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">EdunexIA</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/">Início</NavLink>
          <NavLink to="/depoimentos">Depoimentos</NavLink>
          <NavLink to="/precos">Preços</NavLink>
          <NavLink to="/suporte">Suporte</NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/auth/portal-selection"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Entrar
          </Link>
          <Link
            to="/auth/aluno/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className={cn(
        "text-gray-600 hover:text-gray-900 font-medium transition",
        location.pathname === to && "text-indigo-600"
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar;