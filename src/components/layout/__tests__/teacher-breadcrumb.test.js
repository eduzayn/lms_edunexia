/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TeacherBreadcrumb } from '../teacher-breadcrumb';
import { usePathname } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('TeacherBreadcrumb Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders the breadcrumb for dashboard path', () => {
    // Mock the pathname to be the dashboard
    usePathname.mockReturnValue('/teacher/dashboard');
    
    render(<TeacherBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
  });

  it('renders the breadcrumb for courses path', () => {
    // Mock the pathname to be the courses page
    usePathname.mockReturnValue('/teacher/courses');
    
    render(<TeacherBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument();
  });

  it('renders the breadcrumb for students path', () => {
    // Mock the pathname to be the students page
    usePathname.mockReturnValue('/teacher/students');
    
    render(<TeacherBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Meus Alunos')).toBeInTheDocument();
  });

  it('renders the breadcrumb for assessments path', () => {
    // Mock the pathname to be the assessments page
    usePathname.mockReturnValue('/teacher/assessments');
    
    render(<TeacherBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Avaliações')).toBeInTheDocument();
  });

  it('renders the breadcrumb for content path', () => {
    // Mock the pathname to be the content page
    usePathname.mockReturnValue('/teacher/content');
    
    render(<TeacherBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });

  it('renders the breadcrumb for reports path', () => {
    // Mock the pathname to be the reports page
    usePathname.mockReturnValue('/teacher/reports');
    
    render(<TeacherBreadcrumb />);
    
    // Check if the breadcrumb items are displayed
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });
});
