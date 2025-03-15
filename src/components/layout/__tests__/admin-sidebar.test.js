/**
 * @jest-environment jsdom
 */

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
    
    // Mock the pathname to be an admin page
    usePathname.mockReturnValue('/admin/dashboard');
  });

  it('renders the sidebar with navigation links', () => {
    render(<AdminSidebar />);
    
    // Check if the title is displayed
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
    
    // Check if navigation links are displayed
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Usuários')).toBeInTheDocument();
    expect(screen.getByText('Cursos')).toBeInTheDocument();
    expect(screen.getByText('Financeiro')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('highlights the current active link', () => {
    usePathname.mockReturnValue('/admin/dashboard');
    
    render(<AdminSidebar />);
    
    // Find all navigation links
    const links = screen.getAllByRole('link');
    
    // Find the Dashboard link which should be active
    const dashboardLink = links.find(link => link.textContent?.includes('Dashboard'));
    
    // Check if the Dashboard link has the active class
    expect(dashboardLink).toHaveClass('bg-primary');
  });

  it('does not highlight inactive links', () => {
    usePathname.mockReturnValue('/admin/dashboard');
    
    render(<AdminSidebar />);
    
    // Find all navigation links
    const links = screen.getAllByRole('link');
    
    // Find a link that should not be active
    const usersLink = links.find(link => link.textContent?.includes('Usuários'));
    
    // Check that the Users link does not have the active class
    expect(usersLink).not.toHaveClass('bg-primary');
  });

  it('has correct href attributes for all links', () => {
    render(<AdminSidebar />);
    
    // Check href attributes for navigation links
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/admin/dashboard');
    expect(screen.getByText('Usuários').closest('a')).toHaveAttribute('href', '/admin/users');
    expect(screen.getByText('Cursos').closest('a')).toHaveAttribute('href', '/admin/courses/list');
    expect(screen.getByText('Financeiro').closest('a')).toHaveAttribute('href', '/admin/financial');
    expect(screen.getByText('Configurações').closest('a')).toHaveAttribute('href', '/admin/settings');
  });
});
