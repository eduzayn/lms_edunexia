import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StudentBreadcrumb } from '../student-breadcrumb';
import { usePathname } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('StudentBreadcrumb Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders dashboard breadcrumb correctly', () => {
    // Mock the pathname to be the dashboard
    (usePathname as jest.Mock).mockReturnValue('/student/dashboard');
    
    render(<StudentBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
    
    // Only two items should be displayed for the dashboard
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(2);
  });

  it('renders courses breadcrumb correctly', () => {
    // Mock the pathname to be the courses page
    (usePathname as jest.Mock).mockReturnValue('/student/courses');
    
    render(<StudentBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument();
    
    // Three items should be displayed for the courses page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });

  it('renders course detail breadcrumb correctly', () => {
    // Mock the pathname to be a course detail page
    (usePathname as jest.Mock).mockReturnValue('/student/courses/123');
    
    render(<StudentBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument();
    expect(screen.getByText('Detalhes do Curso')).toBeInTheDocument();
    
    // Four items should be displayed for the course detail page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(4);
  });

  it('renders assessments breadcrumb correctly', () => {
    // Mock the pathname to be the assessments page
    (usePathname as jest.Mock).mockReturnValue('/student/assessments');
    
    render(<StudentBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
    expect(screen.getByText('Avaliações')).toBeInTheDocument();
    
    // Three items should be displayed for the assessments page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });

  it('renders assessment detail breadcrumb correctly', () => {
    // Mock the pathname to be an assessment detail page
    (usePathname as jest.Mock).mockReturnValue('/student/assessments/take/123');
    
    render(<StudentBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
    expect(screen.getByText('Avaliações')).toBeInTheDocument();
    expect(screen.getByText('Realizar Avaliação')).toBeInTheDocument();
    
    // Four items should be displayed for the assessment detail page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(4);
  });

  it('renders certificates breadcrumb correctly', () => {
    // Mock the pathname to be the certificates page
    (usePathname as jest.Mock).mockReturnValue('/student/certificates');
    
    render(<StudentBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
    expect(screen.getByText('Certificados')).toBeInTheDocument();
    
    // Three items should be displayed for the certificates page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });

  it('renders AI tutor breadcrumb correctly', () => {
    // Mock the pathname to be the AI tutor page
    (usePathname as jest.Mock).mockReturnValue('/student/ai-tutor');
    
    render(<StudentBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
    expect(screen.getByText('Tutor de IA')).toBeInTheDocument();
    
    // Three items should be displayed for the AI tutor page
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });
});
