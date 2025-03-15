import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { TeacherBreadcrumb } from '@/components/layout/teacher-breadcrumb';
import { usePathname } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

describe('TeacherBreadcrumb Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default breadcrumb items', () => {
    // Use jest.mocked instead of require
    jest.mocked(usePathname).mockReturnValue('/teacher/dashboard');
    
    render(<TeacherBreadcrumb />);
    
    // Check if default items are rendered
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
  });

  it('renders courses breadcrumb items', () => {
    jest.mocked(usePathname).mockReturnValue('/teacher/courses');
    
    render(<TeacherBreadcrumb />);
    
    // Check if courses items are rendered
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument();
  });

  it('renders students breadcrumb items', () => {
    jest.mocked(usePathname).mockReturnValue('/teacher/students');
    
    render(<TeacherBreadcrumb />);
    
    // Check if students items are rendered
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Meus Alunos')).toBeInTheDocument();
  });

  it('renders content breadcrumb items', () => {
    jest.mocked(usePathname).mockReturnValue('/teacher/content');
    
    render(<TeacherBreadcrumb />);
    
    // Check if content items are rendered
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });

  it('renders assessments breadcrumb items', () => {
    jest.mocked(usePathname).mockReturnValue('/teacher/assessments');
    
    render(<TeacherBreadcrumb />);
    
    // Check if assessments items are rendered
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Avaliações')).toBeInTheDocument();
  });

  it('renders reports breadcrumb items', () => {
    jest.mocked(usePathname).mockReturnValue('/teacher/reports');
    
    render(<TeacherBreadcrumb />);
    
    // Check if reports items are rendered
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('renders forums breadcrumb items', () => {
    jest.mocked(usePathname).mockReturnValue('/forums/list');
    
    render(<TeacherBreadcrumb />);
    
    // Check if forums items are rendered
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Fóruns')).toBeInTheDocument();
  });

  it('renders forum topic breadcrumb items', () => {
    jest.mocked(usePathname).mockReturnValue('/forums/topic/123');
    
    render(<TeacherBreadcrumb />);
    
    // Check if forum topic items are rendered
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Fóruns')).toBeInTheDocument();
    expect(screen.getByText('Tópico')).toBeInTheDocument();
  });

  it('renders create forum topic breadcrumb items', () => {
    jest.mocked(usePathname).mockReturnValue('/forums/create');
    
    render(<TeacherBreadcrumb />);
    
    // Check if create forum topic items are rendered
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Fóruns')).toBeInTheDocument();
    expect(screen.getByText('Criar Tópico')).toBeInTheDocument();
  });

  it('renders forum list breadcrumb items', () => {
    jest.mocked(usePathname).mockReturnValue('/forums/list/123');
    
    render(<TeacherBreadcrumb />);
    
    // Check if forum list items are rendered
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal do Professor')).toBeInTheDocument();
    expect(screen.getByText('Fóruns')).toBeInTheDocument();
    expect(screen.getByText('Lista de Tópicos')).toBeInTheDocument();
  });
});
