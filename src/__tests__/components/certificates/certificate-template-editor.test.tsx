import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import CertificateTemplateEditor from '@/components/certificates/certificate-template-editor';
import CertificateService from '@/lib/services/certificate-service';

// Mock certificate service
jest.mock('@/lib/services/certificate-service', () => ({
  getInstance: jest.fn(() => ({
    getTemplate: jest.fn(),
    createTemplate: jest.fn(),
    updateTemplate: jest.fn(),
  })),
}));

describe('CertificateTemplateEditor Component', () => {
  const mockTemplate = {
    id: 'template-1',
    name: 'Standard Template',
    description: 'A standard certificate template',
    html_template: '<div>{{student_name}} completed {{course_name}}</div>',
    css_style: 'body { font-family: Arial; }',
    background_image_url: 'https://example.com/bg.jpg',
    is_default: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when editing existing template', () => {
    render(<CertificateTemplateEditor templateId="template-1" />);
    
    expect(screen.getByText('Carregando template...')).toBeInTheDocument();
  });

  it('renders empty form when creating new template', () => {
    render(<CertificateTemplateEditor />);
    
    expect(screen.getByLabelText('Nome do Template')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('HTML Template')).toBeInTheDocument();
    expect(screen.getByLabelText('CSS Style')).toBeInTheDocument();
    expect(screen.getByLabelText('URL da Imagem de Fundo')).toBeInTheDocument();
    expect(screen.getByLabelText('Template Padrão')).toBeInTheDocument();
    
    // Check if save button is rendered
    expect(screen.getByText('Salvar Template')).toBeInTheDocument();
  });

  it('loads template data when editing existing template', async () => {
    const mockGetTemplate = jest.fn().mockResolvedValue(mockTemplate);
    
    (CertificateService.getInstance().getTemplate as jest.Mock).mockImplementation(mockGetTemplate);
    
    render(<CertificateTemplateEditor templateId="template-1" />);
    
    await waitFor(() => {
      expect(mockGetTemplate).toHaveBeenCalledWith('template-1');
    });
    
    // Check if form fields are populated with template data
    expect(screen.getByLabelText('Nome do Template')).toHaveValue('Standard Template');
    expect(screen.getByLabelText('Descrição')).toHaveValue('A standard certificate template');
    expect(screen.getByLabelText('HTML Template')).toHaveValue('<div>{{student_name}} completed {{course_name}}</div>');
    expect(screen.getByLabelText('CSS Style')).toHaveValue('body { font-family: Arial; }');
    expect(screen.getByLabelText('URL da Imagem de Fundo')).toHaveValue('https://example.com/bg.jpg');
  });

  it('calls createTemplate when saving new template', async () => {
    const mockCreateTemplate = jest.fn().mockResolvedValue({ id: 'new-template-id', ...mockTemplate });
    
    (CertificateService.getInstance().createTemplate as jest.Mock).mockImplementation(mockCreateTemplate);
    
    const onSave = jest.fn();
    render(<CertificateTemplateEditor onSave={onSave} />);
    
    // Fill form fields
    fireEvent.change(screen.getByLabelText('Nome do Template'), { target: { value: 'New Template' } });
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'A new certificate template' } });
    fireEvent.change(screen.getByLabelText('HTML Template'), { target: { value: '<div>New HTML</div>' } });
    fireEvent.change(screen.getByLabelText('CSS Style'), { target: { value: 'body { color: blue; }' } });
    fireEvent.change(screen.getByLabelText('URL da Imagem de Fundo'), { target: { value: 'https://example.com/new-bg.jpg' } });
    fireEvent.click(screen.getByLabelText('Template Padrão'));
    
    // Click save button
    fireEvent.click(screen.getByText('Salvar Template'));
    
    await waitFor(() => {
      expect(mockCreateTemplate).toHaveBeenCalledWith({
        name: 'New Template',
        description: 'A new certificate template',
        html_template: '<div>New HTML</div>',
        css_style: 'body { color: blue; }',
        background_image_url: 'https://example.com/new-bg.jpg',
        is_default: true
      });
      
      expect(onSave).toHaveBeenCalledWith({ id: 'new-template-id', ...mockTemplate });
    });
  });

  it('calls updateTemplate when saving existing template', async () => {
    const mockGetTemplate = jest.fn().mockResolvedValue(mockTemplate);
    const mockUpdateTemplate = jest.fn().mockResolvedValue({ ...mockTemplate, name: 'Updated Template' });
    
    (CertificateService.getInstance().getTemplate as jest.Mock).mockImplementation(mockGetTemplate);
    (CertificateService.getInstance().updateTemplate as jest.Mock).mockImplementation(mockUpdateTemplate);
    
    const onSave = jest.fn();
    render(<CertificateTemplateEditor templateId="template-1" onSave={onSave} />);
    
    await waitFor(() => {
      expect(mockGetTemplate).toHaveBeenCalledWith('template-1');
    });
    
    // Update form fields
    fireEvent.change(screen.getByLabelText('Nome do Template'), { target: { value: 'Updated Template' } });
    
    // Click save button
    fireEvent.click(screen.getByText('Salvar Template'));
    
    await waitFor(() => {
      expect(mockUpdateTemplate).toHaveBeenCalledWith('template-1', {
        name: 'Updated Template',
        description: 'A standard certificate template',
        html_template: '<div>{{student_name}} completed {{course_name}}</div>',
        css_style: 'body { font-family: Arial; }',
        background_image_url: 'https://example.com/bg.jpg',
        is_default: false
      });
      
      expect(onSave).toHaveBeenCalledWith({ ...mockTemplate, name: 'Updated Template' });
    });
  });

  it('shows error message when save fails', async () => {
    (CertificateService.getInstance().createTemplate as jest.Mock).mockRejectedValue(new Error('Save error'));
    
    render(<CertificateTemplateEditor />);
    
    // Fill form fields
    fireEvent.change(screen.getByLabelText('Nome do Template'), { target: { value: 'New Template' } });
    
    // Click save button
    fireEvent.click(screen.getByText('Salvar Template'));
    
    expect(await screen.findByText(/Erro ao salvar template/i)).toBeInTheDocument();
  });

  it('shows preview of template', async () => {
    const mockGetTemplate = jest.fn().mockResolvedValue(mockTemplate);
    
    (CertificateService.getInstance().getTemplate as jest.Mock).mockImplementation(mockGetTemplate);
    
    render(<CertificateTemplateEditor templateId="template-1" />);
    
    await waitFor(() => {
      expect(mockGetTemplate).toHaveBeenCalledWith('template-1');
    });
    
    // Click preview button
    fireEvent.click(screen.getByText('Visualizar'));
    
    // Check if preview is shown
    expect(screen.getByText('Prévia do Certificado')).toBeInTheDocument();
    
    // Preview should contain the rendered HTML
    const previewContainer = screen.getByTestId('certificate-preview');
    expect(previewContainer).toBeInTheDocument();
    expect(previewContainer.innerHTML).toContain('Nome do Aluno completed Nome do Curso');
  });
});
