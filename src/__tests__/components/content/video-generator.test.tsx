import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import { VideoGenerator } from '@/components/content/video-generator';
import { videoGeneratorService } from '@/lib/services/video-generator-service';

// Mock the video generator service
jest.mock('@/lib/services/video-generator-service', () => ({
  videoGeneratorService: {
    generateVideo: jest.fn(),
    getVideoStatus: jest.fn(),
    getGeneratedVideos: jest.fn()
  }
}));

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}));

describe('VideoGenerator Component', () => {
  const mockCourses = [
    {
      id: 'course-1',
      title: 'Introduction to React',
      lessons: [
        { id: 'lesson-1-1', title: 'React Basics' },
        { id: 'lesson-1-2', title: 'React Hooks' }
      ]
    }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (videoGeneratorService.generateVideo as jest.Mock).mockResolvedValue({
      id: 'video-123',
      status: 'queued'
    });
    
    (videoGeneratorService.getVideoStatus as jest.Mock).mockResolvedValue({
      id: 'video-123',
      status: 'processing',
      progress: 50
    });
    
    (videoGeneratorService.getGeneratedVideos as jest.Mock).mockResolvedValue([
      {
        id: 'video-1',
        title: 'Previous Video',
        thumbnail_url: 'https://example.com/thumbnail1.jpg',
        created_at: '2025-03-01T00:00:00Z',
        status: 'completed'
      },
      {
        id: 'video-2',
        title: 'Another Video',
        thumbnail_url: 'https://example.com/thumbnail2.jpg',
        created_at: '2025-02-15T00:00:00Z',
        status: 'completed'
      }
    ]);
  });
  
  it('renders the component with initial state', async () => {
    render(<VideoGenerator courses={mockCourses} />);
    
    // Title should be present
    expect(screen.getByText('Gerador de Vídeos')).toBeInTheDocument();
    
    // Form elements should be present
    expect(screen.getByLabelText('Título do Vídeo')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Tópicos (um por linha)')).toBeInTheDocument();
    expect(screen.getByLabelText('Estilo do Vídeo')).toBeInTheDocument();
    expect(screen.getByLabelText('Duração (minutos)')).toBeInTheDocument();
    
    // Course selector should be present
    expect(screen.getByText('Associar a Curso')).toBeInTheDocument();
    
    // Generate button should be present
    expect(screen.getByText('Gerar Vídeo')).toBeInTheDocument();
    
    // Previous videos section should load
    await waitFor(() => {
      expect(videoGeneratorService.getGeneratedVideos).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Vídeos Anteriores')).toBeInTheDocument();
      expect(screen.getByText('Previous Video')).toBeInTheDocument();
      expect(screen.getByText('Another Video')).toBeInTheDocument();
    });
  });
  
  it('handles form submission', async () => {
    render(<VideoGenerator courses={mockCourses} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Título do Vídeo'), {
      target: { value: 'Test Video Title' }
    });
    
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test video description' }
    });
    
    fireEvent.change(screen.getByLabelText('Tópicos (um por linha)'), {
      target: { value: 'Topic 1\nTopic 2\nTopic 3' }
    });
    
    fireEvent.change(screen.getByLabelText('Estilo do Vídeo'), {
      target: { value: 'educational' }
    });
    
    fireEvent.change(screen.getByLabelText('Duração (minutos)'), {
      target: { value: '5' }
    });
    
    // Select a course and lesson
    fireEvent.click(screen.getByText('Selecione um curso'));
    fireEvent.click(screen.getByText('Introduction to React'));
    
    fireEvent.click(screen.getByText('Selecione uma aula'));
    fireEvent.click(screen.getByText('React Basics'));
    
    // Submit the form
    fireEvent.click(screen.getByText('Gerar Vídeo'));
    
    // Service should be called with correct parameters
    await waitFor(() => {
      expect(videoGeneratorService.generateVideo).toHaveBeenCalledWith({
        title: 'Test Video Title',
        description: 'Test video description',
        topics: ['Topic 1', 'Topic 2', 'Topic 3'],
        style: 'educational',
        duration: 5,
        course_id: 'course-1',
        lesson_id: 'lesson-1-1'
      });
    });
    
    // Should show processing state
    expect(screen.getByText('Vídeo em processamento...')).toBeInTheDocument();
  });
  
  it('displays validation errors', async () => {
    render(<VideoGenerator courses={mockCourses} />);
    
    // Submit the form without filling it
    fireEvent.click(screen.getByText('Gerar Vídeo'));
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('Título é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Pelo menos um tópico é obrigatório')).toBeInTheDocument();
    });
    
    // Service should not be called
    expect(videoGeneratorService.generateVideo).not.toHaveBeenCalled();
  });
  
  it('handles video generation error', async () => {
    (videoGeneratorService.generateVideo as jest.Mock).mockRejectedValue(
      new Error('Failed to generate video')
    );
    
    render(<VideoGenerator courses={mockCourses} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Título do Vídeo'), {
      target: { value: 'Test Video Title' }
    });
    
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Test video description' }
    });
    
    fireEvent.change(screen.getByLabelText('Tópicos (um por linha)'), {
      target: { value: 'Topic 1' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Gerar Vídeo'));
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Erro ao gerar vídeo: Failed to generate video')).toBeInTheDocument();
    });
  });
  
  it('polls for video status updates', async () => {
    // Mock status updates
    (videoGeneratorService.getVideoStatus as jest.Mock)
      .mockResolvedValueOnce({
        id: 'video-123',
        status: 'processing',
        progress: 25
      })
      .mockResolvedValueOnce({
        id: 'video-123',
        status: 'processing',
        progress: 50
      })
      .mockResolvedValueOnce({
        id: 'video-123',
        status: 'completed',
        progress: 100,
        video_url: 'https://example.com/video.mp4'
      });
    
    render(<VideoGenerator courses={mockCourses} />);
    
    // Fill out minimal form
    fireEvent.change(screen.getByLabelText('Título do Vídeo'), {
      target: { value: 'Test Video' }
    });
    
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Description' }
    });
    
    fireEvent.change(screen.getByLabelText('Tópicos (um por linha)'), {
      target: { value: 'Topic 1' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Gerar Vídeo'));
    
    // Should show initial progress
    await waitFor(() => {
      expect(screen.getByText('Vídeo em processamento...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
    });
    
    // Should update progress
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    });
    
    // Should show completion
    await waitFor(() => {
      expect(screen.getByText('Vídeo gerado com sucesso!')).toBeInTheDocument();
      expect(screen.getByText('Visualizar Vídeo')).toBeInTheDocument();
    });
  });
  
  it('displays previous videos and handles pagination', async () => {
    // Mock multiple pages of videos
    (videoGeneratorService.getGeneratedVideos as jest.Mock)
      .mockResolvedValueOnce([
        {
          id: 'video-1',
          title: 'Video 1',
          thumbnail_url: 'https://example.com/thumbnail1.jpg',
          created_at: '2025-03-01T00:00:00Z',
          status: 'completed'
        },
        {
          id: 'video-2',
          title: 'Video 2',
          thumbnail_url: 'https://example.com/thumbnail2.jpg',
          created_at: '2025-02-15T00:00:00Z',
          status: 'completed'
        }
      ])
      .mockResolvedValueOnce([
        {
          id: 'video-3',
          title: 'Video 3',
          thumbnail_url: 'https://example.com/thumbnail3.jpg',
          created_at: '2025-01-20T00:00:00Z',
          status: 'completed'
        }
      ]);
    
    render(<VideoGenerator courses={mockCourses} />);
    
    // First page of videos should load
    await waitFor(() => {
      expect(screen.getByText('Video 1')).toBeInTheDocument();
      expect(screen.getByText('Video 2')).toBeInTheDocument();
    });
    
    // Click next page
    fireEvent.click(screen.getByLabelText('Próxima página'));
    
    // Second page should load
    await waitFor(() => {
      expect(screen.getByText('Video 3')).toBeInTheDocument();
      expect(screen.queryByText('Video 1')).not.toBeInTheDocument();
    });
    
    // Click previous page
    fireEvent.click(screen.getByLabelText('Página anterior'));
    
    // First page should load again
    await waitFor(() => {
      expect(screen.getByText('Video 1')).toBeInTheDocument();
      expect(screen.getByText('Video 2')).toBeInTheDocument();
    });
  });
});
