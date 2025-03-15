/**
 * @jest-environment jsdom
 */

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
    
    // Mock the pathname to be a student page
    usePathname.mockReturnValue('/student/dashboard');
  });

  it('renders the sidebar with navigation links', () => {
    render(<StudentSidebar />);
    
    // Check if the title is displayed
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
    
    // Check if navigation links are displayed
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument();
    expect(screen.getByText('Atividades')).toBeInTheDocument();
    expect(screen.getByText('Tutor IA')).toBeInTheDocument();
  });

  it('highlights the current active link', () => {
    usePathname.mockReturnValue('/student/dashboard');
    
    render(<StudentSidebar />);
    
    // Find all navigation links
    const links = screen.getAllByRole('link');
    
    // Find the Dashboard link which should be active
    const dashboardLink = links.find(link => link.textContent?.includes('Dashboard'));
    
    // Check if the Dashboard link has the active class
    expect(dashboardLink).toHaveClass('bg-primary');
  });

  it('does not highlight inactive links', () => {
    usePathname.mockReturnValue('/student/dashboard');
    
    render(<StudentSidebar />);
    
    // Find all navigation links
    const links = screen.getAllByRole('link');
    
    // Find a link that should not be active
    const coursesLink = links.find(link => link.textContent?.includes('Meus Cursos'));
    
    // Check that the Courses link does not have the active class
    expect(coursesLink).not.toHaveClass('bg-primary');
  });

  it('has correct href attributes for all links', () => {
    render(<StudentSidebar />);
    
    // Check href attributes for navigation links
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/student/dashboard');
    expect(screen.getByText('Meus Cursos').closest('a')).toHaveAttribute('href', '/student/courses');
    expect(screen.getByText('Atividades').closest('a')).toHaveAttribute('href', '/student/activities');
    expect(screen.getByText('Tutor IA').closest('a')).toHaveAttribute('href', '/student/ai-tutor');
  });
});
