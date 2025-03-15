import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminSidebar } from '../admin-sidebar';
import { usePathname } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('AdminSidebar Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders sidebar with all navigation links', () => {
    // Mock the pathname to be the dashboard
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
    
    render(<AdminSidebar />);
    
    // Check if the title is displayed
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
    
    // Check if all navigation links are displayed
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
    
    // Check if footer links are displayed
    expect(screen.getByText('Suporte')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('highlights the active link based on current path', () => {
    // Mock the pathname to be the dashboard
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
    
    render(<AdminSidebar />);
    
    // Get all navigation links
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const usersLink = screen.getByText('Usuários').closest('a');
    
    // Check if the dashboard link has the active class
    expect(dashboardLink).toHaveClass('bg-primary');
    expect(dashboardLink).toHaveClass('text-white');
    
    // Check if other links don't have the active class
    expect(usersLink).not.toHaveClass('bg-primary');
    expect(usersLink).not.toHaveClass('text-white');
    expect(usersLink).toHaveClass('text-gray-700');
    expect(usersLink).toHaveClass('hover:bg-gray-100');
  });

  it('highlights the courses link when on a courses subpage', () => {
    // Mock the pathname to be a courses subpage
    (usePathname as jest.Mock).mockReturnValue('/admin/courses/editor');
    
    render(<AdminSidebar />);
    
    // Get the courses link
    const coursesLink = screen.getByText('Cursos').closest('a');
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    
    // Check if the courses link has the active class
    expect(coursesLink).toHaveClass('bg-primary');
    expect(coursesLink).toHaveClass('text-white');
    
    // Check if other links don't have the active class
    expect(dashboardLink).not.toHaveClass('bg-primary');
    expect(dashboardLink).not.toHaveClass('text-white');
  });

  it('has correct href attributes for all links', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
    
    render(<AdminSidebar />);
    
    // Check href attributes for main navigation links
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
    
    // Check href attributes for footer links
    expect(screen.getByText('Suporte').closest('a')).toHaveAttribute('href', '/support');
    expect(screen.getByText('Sair').closest('a')).toHaveAttribute('href', '/auth/login');
  });

  it('has correct styling for the sidebar container', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
    
    render(<AdminSidebar />);
    
    // Get the sidebar container
    const sidebar = screen.getByText('Portal Administrativo').closest('aside');
    
    // Check if the sidebar has the correct styling
    expect(sidebar).toHaveClass('w-64');
    expect(sidebar).toHaveClass('bg-gray-50');
    expect(sidebar).toHaveClass('h-screen');
    expect(sidebar).toHaveClass('p-4');
  });
});
