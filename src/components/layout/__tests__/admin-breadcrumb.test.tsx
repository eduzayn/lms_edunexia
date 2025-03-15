import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminBreadcrumb } from '../admin-breadcrumb';
import { usePathname } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('AdminBreadcrumb Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders dashboard breadcrumb correctly', () => {
    // Mock the pathname to be the dashboard
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
    
    render(<AdminBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
    
    // Only two items should be displayed for the dashboard
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(2);
  });

  it('renders users breadcrumb correctly', () => {
    // Mock the pathname to be the users page
    (usePathname as jest.Mock).mockReturnValue('/admin/users');
    
    render(<AdminBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
    expect(screen.getByText('Usuários')).toBeInTheDocument();
    
    // Three items should be displayed for the users page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });

  it('renders courses breadcrumb correctly', () => {
    // Mock the pathname to be the courses list page
    (usePathname as jest.Mock).mockReturnValue('/admin/courses/list');
    
    render(<AdminBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
    expect(screen.getByText('Cursos')).toBeInTheDocument();
    
    // Three items should be displayed for the courses list page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });

  it('renders course editor breadcrumb correctly', () => {
    // Mock the pathname to be the course editor page
    (usePathname as jest.Mock).mockReturnValue('/admin/courses/editor');
    
    render(<AdminBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
    expect(screen.getByText('Cursos')).toBeInTheDocument();
    expect(screen.getByText('Editor de Curso')).toBeInTheDocument();
    
    // Four items should be displayed for the course editor page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(4);
  });

  it('renders assessments breadcrumb correctly', () => {
    // Mock the pathname to be the assessments list page
    (usePathname as jest.Mock).mockReturnValue('/admin/assessments/list');
    
    render(<AdminBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
    expect(screen.getByText('Avaliações')).toBeInTheDocument();
    
    // Three items should be displayed for the assessments list page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });

  it('renders create assessment breadcrumb correctly', () => {
    // Mock the pathname to be the create assessment page
    (usePathname as jest.Mock).mockReturnValue('/admin/assessments/create');
    
    render(<AdminBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
    expect(screen.getByText('Avaliações')).toBeInTheDocument();
    expect(screen.getByText('Criar Avaliação')).toBeInTheDocument();
    
    // Four items should be displayed for the create assessment page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(4);
  });

  it('renders settings breadcrumb correctly', () => {
    // Mock the pathname to be the settings page
    (usePathname as jest.Mock).mockReturnValue('/admin/settings');
    
    render(<AdminBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
    
    // Three items should be displayed for the settings page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });
});
