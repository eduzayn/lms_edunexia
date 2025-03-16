import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { TeacherSidebar } from '@/components/layout/teacher-sidebar';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

describe('TeacherSidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sidebar with title and navigation links', () => {
    require('next/navigation').usePathname.mockReturnValue('/teacher/dashboard');
    
    render(<TeacherSidebar />);
    
    // Check if title is rendered
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    
    // Check if all navigation links are rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument();
    expect(screen.getByText('Meus Alunos')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    expect(screen.getByText('Avaliações')).toBeInTheDocument();
    expect(screen.getByText('Fóruns')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    
    // Check if footer links are rendered
    expect(screen.getByText('Suporte')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('highlights the active link for dashboard', () => {
    require('next/navigation').usePathname.mockReturnValue('/teacher/dashboard');
    
    render(<TeacherSidebar />);
    
    // Get all navigation links
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const coursesLink = screen.getByText('Meus Cursos').closest('a');
    
    // Check if dashboard link has active class
    expect(dashboardLink).toHaveClass('bg-primary');
    expect(dashboardLink).toHaveClass('text-white');
    
    // Check if other links don't have active class
    expect(coursesLink).not.toHaveClass('bg-primary');
    expect(coursesLink).not.toHaveClass('text-white');
    expect(coursesLink).toHaveClass('text-gray-700');
  });

  it('highlights the active link for courses', () => {
    require('next/navigation').usePathname.mockReturnValue('/teacher/courses');
    
    render(<TeacherSidebar />);
    
    // Get all navigation links
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const coursesLink = screen.getByText('Meus Cursos').closest('a');
    
    // Check if courses link has active class
    expect(coursesLink).toHaveClass('bg-primary');
    expect(coursesLink).toHaveClass('text-white');
    
    // Check if other links don't have active class
    expect(dashboardLink).not.toHaveClass('bg-primary');
    expect(dashboardLink).not.toHaveClass('text-white');
    expect(dashboardLink).toHaveClass('text-gray-700');
  });

  it('highlights the active link for students', () => {
    require('next/navigation').usePathname.mockReturnValue('/teacher/students');
    
    render(<TeacherSidebar />);
    
    // Check if students link has active class
    const studentsLink = screen.getByText('Meus Alunos').closest('a');
    expect(studentsLink).toHaveClass('bg-primary');
    expect(studentsLink).toHaveClass('text-white');
  });

  it('highlights the active link for content', () => {
    require('next/navigation').usePathname.mockReturnValue('/teacher/content');
    
    render(<TeacherSidebar />);
    
    // Check if content link has active class
    const contentLink = screen.getByText('Conteúdo').closest('a');
    expect(contentLink).toHaveClass('bg-primary');
    expect(contentLink).toHaveClass('text-white');
  });

  it('highlights the active link for assessments', () => {
    require('next/navigation').usePathname.mockReturnValue('/teacher/assessments');
    
    render(<TeacherSidebar />);
    
    // Check if assessments link has active class
    const assessmentsLink = screen.getByText('Avaliações').closest('a');
    expect(assessmentsLink).toHaveClass('bg-primary');
    expect(assessmentsLink).toHaveClass('text-white');
  });

  it('highlights the active link for forums', () => {
    require('next/navigation').usePathname.mockReturnValue('/forums/list');
    
    render(<TeacherSidebar />);
    
    // Check if forums link has active class
    const forumsLink = screen.getByText('Fóruns').closest('a');
    expect(forumsLink).toHaveClass('bg-primary');
    expect(forumsLink).toHaveClass('text-white');
  });

  it('highlights the active link for reports', () => {
    require('next/navigation').usePathname.mockReturnValue('/teacher/reports');
    
    render(<TeacherSidebar />);
    
    // Check if reports link has active class
    const reportsLink = screen.getByText('Relatórios').closest('a');
    expect(reportsLink).toHaveClass('bg-primary');
    expect(reportsLink).toHaveClass('text-white');
  });

  it('highlights active link for nested paths', () => {
    require('next/navigation').usePathname.mockReturnValue('/teacher/courses/123');
    
    render(<TeacherSidebar />);
    
    // Check if courses link has active class for nested path
    const coursesLink = screen.getByText('Meus Cursos').closest('a');
    expect(coursesLink).toHaveClass('bg-primary');
    expect(coursesLink).toHaveClass('text-white');
  });
});
