import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { StudentSidebar } from '@/components/layout/student-sidebar';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

describe('StudentSidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/student/dashboard');
  });

  it('renders the sidebar with title', () => {
    render(<StudentSidebar />);
    
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<StudentSidebar />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument();
    expect(screen.getByText('Meu Progresso')).toBeInTheDocument();
    expect(screen.getByText('Certificados')).toBeInTheDocument();
    expect(screen.getByText('Fóruns')).toBeInTheDocument();
    expect(screen.getByText('Suporte')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('highlights the active link based on current path', () => {
    (usePathname as jest.Mock).mockReturnValue('/student/courses');
    
    render(<StudentSidebar />);
    
    // Get all links
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const coursesLink = screen.getByText('Meus Cursos').closest('a');
    
    // Check that the correct link is highlighted
    expect(dashboardLink).toHaveClass('text-gray-700');
    expect(coursesLink).toHaveClass('bg-primary');
    expect(coursesLink).toHaveClass('text-white');
  });

  it('highlights links for nested paths', () => {
    (usePathname as jest.Mock).mockReturnValue('/student/courses/123');
    
    render(<StudentSidebar />);
    
    // Get the courses link
    const coursesLink = screen.getByText('Meus Cursos').closest('a');
    
    // Check that the correct link is highlighted
    expect(coursesLink).toHaveClass('bg-primary');
    expect(coursesLink).toHaveClass('text-white');
  });

  it('renders support and logout links', () => {
    render(<StudentSidebar />);
    
    const supportLink = screen.getByText('Suporte').closest('a');
    const logoutLink = screen.getByText('Sair').closest('a');
    
    expect(supportLink).toHaveAttribute('href', '/support');
    expect(logoutLink).toHaveAttribute('href', '/auth/login');
  });

  it('has correct href attributes for all links', () => {
    render(<StudentSidebar />);
    
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/student/dashboard');
    expect(screen.getByText('Meus Cursos').closest('a')).toHaveAttribute('href', '/student/courses');
    expect(screen.getByText('Meu Progresso').closest('a')).toHaveAttribute('href', '/student/progress');
    expect(screen.getByText('Certificados').closest('a')).toHaveAttribute('href', '/student/certificates');
    expect(screen.getByText('Fóruns').closest('a')).toHaveAttribute('href', '/forums/list');
  });
});
