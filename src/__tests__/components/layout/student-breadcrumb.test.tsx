import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { StudentBreadcrumb } from '@/components/layout/student-breadcrumb';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

// Mock the Breadcrumb component
jest.mock('@/components/layout/breadcrumb', () => ({
  Breadcrumb: ({ items }) => (
    <div data-testid="breadcrumb">
      {items.map((item, index) => (
        <span key={index} data-testid="breadcrumb-item">
          {item.label} {index < items.length - 1 && '>'} 
        </span>
      ))}
    </div>
  )
}));

describe('StudentBreadcrumb Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic breadcrumb for dashboard', () => {
    (usePathname as jest.Mock).mockReturnValue('/student/dashboard');
    
    render(<StudentBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0]).toHaveTextContent('Início');
    expect(breadcrumbItems[1]).toHaveTextContent('Portal do Aluno');
  });

  it('renders breadcrumb for courses page', () => {
    (usePathname as jest.Mock).mockReturnValue('/student/courses');
    
    render(<StudentBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[0]).toHaveTextContent('Início');
    expect(breadcrumbItems[1]).toHaveTextContent('Portal do Aluno');
    expect(breadcrumbItems[2]).toHaveTextContent('Meus Cursos');
  });

  it('renders breadcrumb for specific course page', () => {
    (usePathname as jest.Mock).mockReturnValue('/student/courses/123');
    
    render(<StudentBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(4);
    expect(breadcrumbItems[2]).toHaveTextContent('Meus Cursos');
    expect(breadcrumbItems[3]).toHaveTextContent('Detalhes do Curso');
  });

  it('renders breadcrumb for progress page', () => {
    (usePathname as jest.Mock).mockReturnValue('/student/progress');
    
    render(<StudentBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Meu Progresso');
  });

  it('renders breadcrumb for certificates page', () => {
    (usePathname as jest.Mock).mockReturnValue('/student/certificates');
    
    render(<StudentBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Certificados');
  });

  it('renders breadcrumb for specific certificate page', () => {
    (usePathname as jest.Mock).mockReturnValue('/student/certificates/123');
    
    render(<StudentBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(4);
    expect(breadcrumbItems[2]).toHaveTextContent('Certificados');
    expect(breadcrumbItems[3]).toHaveTextContent('Detalhes do Certificado');
  });

  it('renders breadcrumb for forums list page', () => {
    (usePathname as jest.Mock).mockReturnValue('/forums/list');
    
    render(<StudentBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Fóruns');
  });

  it('renders breadcrumb for forum topic page', () => {
    (usePathname as jest.Mock).mockReturnValue('/forums/topic/123');
    
    render(<StudentBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(4);
    expect(breadcrumbItems[2]).toHaveTextContent('Fóruns');
    expect(breadcrumbItems[3]).toHaveTextContent('Tópico');
  });

  it('renders breadcrumb for create forum page', () => {
    (usePathname as jest.Mock).mockReturnValue('/forums/create');
    
    render(<StudentBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(4);
    expect(breadcrumbItems[2]).toHaveTextContent('Fóruns');
    expect(breadcrumbItems[3]).toHaveTextContent('Criar Tópico');
  });

  it('renders breadcrumb for gamification page', () => {
    (usePathname as jest.Mock).mockReturnValue('/student/gamification');
    
    render(<StudentBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Gamificação');
  });

  it('renders default breadcrumb for unknown paths', () => {
    (usePathname as jest.Mock).mockReturnValue('/unknown/path');
    
    render(<StudentBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0]).toHaveTextContent('Início');
    expect(breadcrumbItems[1]).toHaveTextContent('Portal do Aluno');
  });
});
