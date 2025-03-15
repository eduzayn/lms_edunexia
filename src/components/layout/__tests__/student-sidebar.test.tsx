import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StudentSidebar } from '../student-sidebar';
import { usePathname } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('StudentSidebar Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders sidebar with all navigation links', () => {
    // Mock the pathname to be the dashboard
    (usePathname as jest.Mock).mockReturnValue('/student/dashboard');
    
    render(<StudentSidebar />);
    
    // Check if the title is displayed
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
    
    // Check if all navigation links are displayed
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument();
    expect(screen.getByText('Meu Progresso')).toBeInTheDocument();
    expect(screen.getByText('Financeiro')).toBeInTheDocument();
    expect(screen.getByText('Certificados')).toBeInTheDocument();
    expect(screen.getByText('Tutor IA')).toBeInTheDocument();
    expect(screen.getByText('Atividades')).toBeInTheDocument();
    expect(screen.getByText('Fóruns')).toBeInTheDocument();
    expect(screen.getByText('Suporte')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('highlights the active link based on current path', () => {
    // Mock the pathname to be the dashboard
    (usePathname as jest.Mock).mockReturnValue('/student/dashboard');
    
    render(<StudentSidebar />);
    
    // Get all navigation links
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const coursesLink = screen.getByText('Meus Cursos').closest('a');
    
    // Check if the dashboard link has the active class
    expect(dashboardLink).toHaveClass('bg-primary');
    expect(dashboardLink).toHaveClass('text-white');
    
    // Check if other links don't have the active class
    expect(coursesLink).not.toHaveClass('bg-primary');
    expect(coursesLink).not.toHaveClass('text-white');
    expect(coursesLink).toHaveClass('text-gray-700');
    expect(coursesLink).toHaveClass('hover:bg-gray-100');
  });

  it('highlights the courses link when on a courses subpage', () => {
    // Mock the pathname to be a courses subpage
    (usePathname as jest.Mock).mockReturnValue('/student/courses/123');
    
    render(<StudentSidebar />);
    
    // Get the courses link
    const coursesLink = screen.getByText('Meus Cursos').closest('a');
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    
    // Check if the courses link has the active class
    expect(coursesLink).toHaveClass('bg-primary');
    expect(coursesLink).toHaveClass('text-white');
    
    // Check if other links don't have the active class
    expect(dashboardLink).not.toHaveClass('bg-primary');
    expect(dashboardLink).not.toHaveClass('text-white');
  });

  it('has correct href attributes for all links', () => {
    (usePathname as jest.Mock).mockReturnValue('/student/dashboard');
    
    render(<StudentSidebar />);
    
    // Check href attributes for main navigation links
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/student/dashboard');
    expect(screen.getByText('Meus Cursos').closest('a')).toHaveAttribute('href', '/student/courses');
    expect(screen.getByText('Meu Progresso').closest('a')).toHaveAttribute('href', '/student/progress');
    expect(screen.getByText('Financeiro').closest('a')).toHaveAttribute('href', '/student/financial');
    expect(screen.getByText('Certificados').closest('a')).toHaveAttribute('href', '/student/certificates');
    expect(screen.getByText('Tutor IA').closest('a')).toHaveAttribute('href', '/student/ai-tutor');
    expect(screen.getByText('Atividades').closest('a')).toHaveAttribute('href', '/student/activities');
    expect(screen.getByText('Fóruns').closest('a')).toHaveAttribute('href', '/forums/list');
    
    // Check href attributes for footer links
    expect(screen.getByText('Suporte').closest('a')).toHaveAttribute('href', '/support');
    expect(screen.getByText('Sair').closest('a')).toHaveAttribute('href', '/auth/login');
  });

  it('has correct styling for the sidebar container', () => {
    (usePathname as jest.Mock).mockReturnValue('/student/dashboard');
    
    render(<StudentSidebar />);
    
    // Get the sidebar container
    const sidebar = screen.getByText('Portal do Aluno').closest('aside');
    
    // Check if the sidebar has the correct styling
    expect(sidebar).toHaveClass('w-64');
    expect(sidebar).toHaveClass('bg-gray-50');
    expect(sidebar).toHaveClass('h-screen');
    expect(sidebar).toHaveClass('p-4');
  });
});
