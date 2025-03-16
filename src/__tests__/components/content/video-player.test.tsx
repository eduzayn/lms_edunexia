import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import { VideoPlayer } from '@/components/content/video-player';

// Mock the video element methods
HTMLMediaElement.prototype.play = jest.fn().mockImplementation(() => Promise.resolve());
HTMLMediaElement.prototype.pause = jest.fn();
HTMLMediaElement.prototype.load = jest.fn();

describe('VideoPlayer Component', () => {
  const mockVideoUrl = 'https://example.com/video.mp4';
  const mockPosterUrl = 'https://example.com/poster.jpg';
  const mockTitle = 'Test Video';
  const mockDescription = 'This is a test video description';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders with required props', () => {
    render(<VideoPlayer videoUrl={mockVideoUrl} />);
    
    const videoElement = screen.getByTestId('video-player');
    expect(videoElement).toBeInTheDocument();
    expect(videoElement).toHaveAttribute('src', mockVideoUrl);
  });
  
  it('renders with all props', () => {
    render(
      <VideoPlayer 
        videoUrl={mockVideoUrl} 
        posterUrl={mockPosterUrl}
        title={mockTitle}
        description={mockDescription}
        autoPlay={false}
        controls={true}
        loop={false}
        muted={false}
      />
    );
    
    const videoElement = screen.getByTestId('video-player');
    expect(videoElement).toBeInTheDocument();
    expect(videoElement).toHaveAttribute('src', mockVideoUrl);
    expect(videoElement).toHaveAttribute('poster', mockPosterUrl);
    expect(videoElement).toHaveAttribute('controls');
    expect(videoElement).not.toHaveAttribute('autoplay');
    expect(videoElement).not.toHaveAttribute('loop');
    expect(videoElement).not.toHaveAttribute('muted');
    
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
    expect(screen.getByText(mockDescription)).toBeInTheDocument();
  });
  
  it('handles play/pause toggle', async () => {
    render(<VideoPlayer videoUrl={mockVideoUrl} />);
    
    const videoElement = screen.getByTestId('video-player');
    const playButton = screen.getByLabelText('Play');
    
    // Initial state should be paused
    expect(playButton).toHaveAttribute('aria-label', 'Play');
    
    // Click play
    fireEvent.click(playButton);
    
    // Should call play method
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    
    // Mock the playing state
    fireEvent.play(videoElement);
    
    await waitFor(() => {
      const pauseButton = screen.getByLabelText('Pause');
      expect(pauseButton).toHaveAttribute('aria-label', 'Pause');
    });
    
    // Click pause
    const pauseButton = screen.getByLabelText('Pause');
    fireEvent.click(pauseButton);
    
    // Should call pause method
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
  });
  
  it('handles volume control', () => {
    render(<VideoPlayer videoUrl={mockVideoUrl} />);
    
    const videoElement = screen.getByTestId('video-player');
    const volumeButton = screen.getByLabelText('Volume');
    
    // Click volume button to show slider
    fireEvent.click(volumeButton);
    
    const volumeSlider = screen.getByRole('slider');
    expect(volumeSlider).toBeInTheDocument();
    
    // Change volume
    fireEvent.change(volumeSlider, { target: { value: '0.5' } });
    
    // Video volume should be updated
    expect(videoElement.volume).toBe(0.5);
    
    // Mute the video
    fireEvent.click(volumeButton);
    
    // Video should be muted
    expect(videoElement.muted).toBe(true);
    
    // Unmute the video
    fireEvent.click(volumeButton);
    
    // Video should be unmuted
    expect(videoElement.muted).toBe(false);
  });
  
  it('handles fullscreen toggle', () => {
    // Mock requestFullscreen and exitFullscreen
    const requestFullscreenMock = jest.fn();
    const exitFullscreenMock = jest.fn();
    
    document.exitFullscreen = exitFullscreenMock;
    Element.prototype.requestFullscreen = requestFullscreenMock;
    
    render(<VideoPlayer videoUrl={mockVideoUrl} />);
    
    const fullscreenButton = screen.getByLabelText('Enter fullscreen');
    
    // Click fullscreen button
    fireEvent.click(fullscreenButton);
    
    // Should call requestFullscreen
    expect(requestFullscreenMock).toHaveBeenCalledTimes(1);
    
    // Mock fullscreen state
    Object.defineProperty(document, 'fullscreenElement', {
      value: screen.getByTestId('video-container'),
      writable: true
    });
    
    // Dispatch fullscreenchange event
    fireEvent.fullScreenChange(document);
    
    // Fullscreen button should now be "Exit fullscreen"
    expect(screen.getByLabelText('Exit fullscreen')).toBeInTheDocument();
    
    // Click exit fullscreen button
    fireEvent.click(screen.getByLabelText('Exit fullscreen'));
    
    // Should call exitFullscreen
    expect(exitFullscreenMock).toHaveBeenCalledTimes(1);
  });
  
  it('handles progress bar interaction', () => {
    render(<VideoPlayer videoUrl={mockVideoUrl} />);
    
    const videoElement = screen.getByTestId('video-player');
    const progressBar = screen.getByRole('progressbar');
    
    // Set video duration
    Object.defineProperty(videoElement, 'duration', { value: 100 });
    
    // Trigger timeupdate event
    Object.defineProperty(videoElement, 'currentTime', { value: 25 });
    fireEvent.timeUpdate(videoElement);
    
    // Progress should be updated
    expect(progressBar).toHaveAttribute('aria-valuenow', '25');
    
    // Click on progress bar to seek
    fireEvent.click(progressBar, { clientX: 50 });
    
    // Video should seek to new position
    expect(videoElement.currentTime).toBe(50);
  });
  
  it('displays loading state', () => {
    render(<VideoPlayer videoUrl={mockVideoUrl} />);
    
    const videoElement = screen.getByTestId('video-player');
    
    // Trigger waiting event
    fireEvent.waiting(videoElement);
    
    // Loading indicator should be visible
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    
    // Trigger canplay event
    fireEvent.canPlay(videoElement);
    
    // Loading indicator should be hidden
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
  });
  
  it('handles video error state', () => {
    render(<VideoPlayer videoUrl="invalid-url" />);
    
    const videoElement = screen.getByTestId('video-player');
    
    // Trigger error event
    fireEvent.error(videoElement);
    
    // Error message should be displayed
    expect(screen.getByText('Erro ao carregar o vídeo. Por favor, tente novamente.')).toBeInTheDocument();
  });
});
