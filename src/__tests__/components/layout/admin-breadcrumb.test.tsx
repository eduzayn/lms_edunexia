import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { AdminBreadcrumb } from '@/components/layout/admin-breadcrumb';
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

describe('AdminBreadcrumb Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic breadcrumb for dashboard', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0]).toHaveTextContent('Início');
    expect(breadcrumbItems[1]).toHaveTextContent('Portal Administrativo');
  });

  it('renders breadcrumb for users page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/users');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[0]).toHaveTextContent('Início');
    expect(breadcrumbItems[1]).toHaveTextContent('Portal Administrativo');
    expect(breadcrumbItems[2]).toHaveTextContent('Usuários');
  });

  it('renders breadcrumb for courses list page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/courses/list');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Cursos');
  });

  it('renders breadcrumb for course editor page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/courses/editor');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(4);
    expect(breadcrumbItems[2]).toHaveTextContent('Cursos');
    expect(breadcrumbItems[3]).toHaveTextContent('Editor de Curso');
  });

  it('renders breadcrumb for course preview page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/courses/preview');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(4);
    expect(breadcrumbItems[2]).toHaveTextContent('Cursos');
    expect(breadcrumbItems[3]).toHaveTextContent('Pré-visualização');
  });

  it('renders breadcrumb for content list page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/content/list');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Conteúdo');
  });

  it('renders breadcrumb for content editor page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/content/editor');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(4);
    expect(breadcrumbItems[2]).toHaveTextContent('Conteúdo');
    expect(breadcrumbItems[3]).toHaveTextContent('Editor de Conteúdo');
  });

  it('renders breadcrumb for video list page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/content/video/list');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(4);
    expect(breadcrumbItems[2]).toHaveTextContent('Conteúdo');
    expect(breadcrumbItems[3]).toHaveTextContent('Lista de Vídeos');
  });

  it('renders breadcrumb for modules page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/modules');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Módulos');
  });

  it('renders breadcrumb for financial page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/financial');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Financeiro');
  });

  it('renders breadcrumb for reports page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/reports');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Relatórios');
  });

  it('renders breadcrumb for analytics page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/analytics/dashboard');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Analytics');
  });

  it('renders breadcrumb for assessments list page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/assessments/list');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Avaliações');
  });

  it('renders breadcrumb for create assessment page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/assessments/create');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(4);
    expect(breadcrumbItems[2]).toHaveTextContent('Avaliações');
    expect(breadcrumbItems[3]).toHaveTextContent('Criar Avaliação');
  });

  it('renders breadcrumb for settings page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/settings');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Configurações');
  });

  it('renders breadcrumb for activities page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/activities');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Atividades');
  });

  it('renders breadcrumb for activities feedback page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/activities/feedback');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(4);
    expect(breadcrumbItems[2]).toHaveTextContent('Atividades');
    expect(breadcrumbItems[3]).toHaveTextContent('Feedback');
  });

  it('renders breadcrumb for administrative fees page', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/administrative-fees');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[2]).toHaveTextContent('Taxas Administrativas');
  });

  it('renders default breadcrumb for unknown paths', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/unknown/path');
    
    render(<AdminBreadcrumb />);
    
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0]).toHaveTextContent('Início');
    expect(breadcrumbItems[1]).toHaveTextContent('Portal Administrativo');
  });
});
