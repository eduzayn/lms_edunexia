/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TeacherSidebar } from '../teacher-sidebar';
import { usePathname } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('TeacherSidebar Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock the pathname to be a teacher page
    usePathname.mockReturnValue('/teacher/dashboard');
  });

  it('renders the sidebar with navigation links', () => {
    render(<TeacherSidebar />);
    
    // Check if the title is displayed
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    
    // Check if navigation links are displayed
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument();
    expect(screen.getByText('Meus Alunos')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    expect(screen.getByText('Avaliações')).toBeInTheDocument();
    expect(screen.getByText('Fóruns')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('highlights the current active link', () => {
    usePathname.mockReturnValue('/teacher/dashboard');
    
    render(<TeacherSidebar />);
    
    // Find all navigation links
    const links = screen.getAllByRole('link');
    
    // Find the Dashboard link which should be active
    const dashboardLink = links.find(link => link.textContent?.includes('Dashboard'));
    
    // Check if the Dashboard link has the active class (bg-primary instead of bg-accent)
    expect(dashboardLink).toHaveClass('bg-primary');
  });

  it('does not highlight inactive links', () => {
    usePathname.mockReturnValue('/teacher/dashboard');
    
    render(<TeacherSidebar />);
    
    // Find all navigation links
    const links = screen.getAllByRole('link');
    
    // Find a link that should not be active
    const coursesLink = links.find(link => link.textContent?.includes('Meus Cursos'));
    
    // Check that the Courses link does not have the active class
    expect(coursesLink).not.toHaveClass('bg-primary');
  });

  it('has correct href attributes for all links', () => {
    render(<TeacherSidebar />);
    
    // Check href attributes for navigation links
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/teacher/dashboard');
    expect(screen.getByText('Meus Cursos').closest('a')).toHaveAttribute('href', '/teacher/courses');
    expect(screen.getByText('Meus Alunos').closest('a')).toHaveAttribute('href', '/teacher/students');
    expect(screen.getByText('Avaliações').closest('a')).toHaveAttribute('href', '/teacher/assessments');
    expect(screen.getByText('Conteúdo').closest('a')).toHaveAttribute('href', '/teacher/content');
    expect(screen.getByText('Relatórios').closest('a')).toHaveAttribute('href', '/teacher/reports');
  });
});
