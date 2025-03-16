import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

describe('AdminSidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
  });

  it('renders the sidebar with title', () => {
    render(<AdminSidebar />);
    
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<AdminSidebar />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Usuários')).toBeInTheDocument();
    expect(screen.getByText('Cursos')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    expect(screen.getByText('Módulos')).toBeInTheDocument();
    expect(screen.getByText('Financeiro')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Avaliações')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
    expect(screen.getByText('Suporte')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('highlights the active link based on current path', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/users');
    
    render(<AdminSidebar />);
    
    // Get all links
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const usersLink = screen.getByText('Usuários').closest('a');
    
    // Check that the correct link is highlighted
    expect(dashboardLink).toHaveClass('text-gray-700');
    expect(usersLink).toHaveClass('bg-primary');
    expect(usersLink).toHaveClass('text-white');
  });

  it('highlights links for nested paths', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/courses/list');
    
    render(<AdminSidebar />);
    
    // Get the courses link
    const coursesLink = screen.getByText('Cursos').closest('a');
    
    // Check that the correct link is highlighted
    expect(coursesLink).toHaveClass('bg-primary');
    expect(coursesLink).toHaveClass('text-white');
  });

  it('renders support and logout links', () => {
    render(<AdminSidebar />);
    
    const supportLink = screen.getByText('Suporte').closest('a');
    const logoutLink = screen.getByText('Sair').closest('a');
    
    expect(supportLink).toHaveAttribute('href', '/support');
    expect(logoutLink).toHaveAttribute('href', '/auth/login');
  });

  it('has correct href attributes for all links', () => {
    render(<AdminSidebar />);
    
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/admin/dashboard');
    expect(screen.getByText('Usuários').closest('a')).toHaveAttribute('href', '/admin/users');
    expect(screen.getByText('Cursos').closest('a')).toHaveAttribute('href', '/admin/courses/list');
    expect(screen.getByText('Conteúdo').closest('a')).toHaveAttribute('href', '/admin/content/list');
    expect(screen.getByText('Módulos').closest('a')).toHaveAttribute('href', '/admin/modules');
    expect(screen.getByText('Financeiro').closest('a')).toHaveAttribute('href', '/admin/financial');
    expect(screen.getByText('Relatórios').closest('a')).toHaveAttribute('href', '/admin/reports');
    expect(screen.getByText('Analytics').closest('a')).toHaveAttribute('href', '/admin/analytics/dashboard');
    expect(screen.getByText('Avaliações').closest('a')).toHaveAttribute('href', '/admin/assessments/list');
    expect(screen.getByText('Configurações').closest('a')).toHaveAttribute('href', '/admin/settings');
  });
});
