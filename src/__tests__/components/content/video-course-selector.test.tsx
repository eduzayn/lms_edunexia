import React from 'react';
import { render, screen, fireEvent } from '../../utils/test-utils';
import { VideoCourseSelector } from '@/components/content/video-course-selector';

describe('VideoCourseSelector Component', () => {
  const mockCourses = [
    {
      id: 'course-1',
      title: 'Introduction to React',
      lessons: [
        { id: 'lesson-1-1', title: 'React Basics' },
        { id: 'lesson-1-2', title: 'React Hooks' }
      ]
    },
    {
      id: 'course-2',
      title: 'Advanced JavaScript',
      lessons: [
        { id: 'lesson-2-1', title: 'ES6 Features' },
        { id: 'lesson-2-2', title: 'Async Programming' }
      ]
    }
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default state', () => {
    render(<VideoCourseSelector courses={mockCourses} onSelect={mockOnSelect} />);
    
    expect(screen.getByText('Associar a Curso')).toBeInTheDocument();
    expect(screen.getByText('Selecione um curso')).toBeInTheDocument();
    expect(screen.queryByText('Selecione uma aula')).not.toBeInTheDocument();
  });

  it('renders with empty courses array', () => {
    render(<VideoCourseSelector courses={[]} onSelect={mockOnSelect} />);
    
    expect(screen.getByText('Selecione um curso')).toBeInTheDocument();
    
    // Open the dropdown
    fireEvent.click(screen.getByText('Selecione um curso'));
    
    expect(screen.getByText('Nenhum curso encontrado')).toBeInTheDocument();
  });

  it('opens course dropdown when clicked', () => {
    render(<VideoCourseSelector courses={mockCourses} onSelect={mockOnSelect} />);
    
    // Initially, course options should not be visible
    expect(screen.queryByText('Introduction to React')).not.toBeInTheDocument();
    
    // Open the dropdown
    fireEvent.click(screen.getByText('Selecione um curso'));
    
    // Now course options should be visible
    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
    expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument();
  });

  it('selects a course when clicked', () => {
    render(<VideoCourseSelector courses={mockCourses} onSelect={mockOnSelect} />);
    
    // Open the dropdown
    fireEvent.click(screen.getByText('Selecione um curso'));
    
    // Select a course
    fireEvent.click(screen.getByText('Introduction to React'));
    
    // Check if onSelect was called with correct parameters
    expect(mockOnSelect).toHaveBeenCalledWith('course-1', '');
    
    // Dropdown should close and selected course should be displayed
    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
    expect(screen.queryByText('Advanced JavaScript')).not.toBeInTheDocument();
    
    // Lesson dropdown should now be available
    expect(screen.getByText('Selecione uma aula')).toBeInTheDocument();
  });

  it('opens lesson dropdown when clicked after selecting a course', () => {
    render(
      <VideoCourseSelector 
        courses={mockCourses} 
        onSelect={mockOnSelect} 
        selectedCourseId="course-1" 
      />
    );
    
    // Lesson dropdown should be available
    expect(screen.getByText('Selecione uma aula')).toBeInTheDocument();
    
    // Open the lesson dropdown
    fireEvent.click(screen.getByText('Selecione uma aula'));
    
    // Lesson options should be visible
    expect(screen.getByText('React Basics')).toBeInTheDocument();
    expect(screen.getByText('React Hooks')).toBeInTheDocument();
  });

  it('selects a lesson when clicked', () => {
    render(
      <VideoCourseSelector 
        courses={mockCourses} 
        onSelect={mockOnSelect} 
        selectedCourseId="course-1" 
      />
    );
    
    // Open the lesson dropdown
    fireEvent.click(screen.getByText('Selecione uma aula'));
    
    // Select a lesson
    fireEvent.click(screen.getByText('React Basics'));
    
    // Check if onSelect was called with correct parameters
    expect(mockOnSelect).toHaveBeenCalledWith('course-1', 'lesson-1-1');
  });

  it('displays confirmation message when both course and lesson are selected', () => {
    render(
      <VideoCourseSelector 
        courses={mockCourses} 
        onSelect={mockOnSelect} 
        selectedCourseId="course-1" 
        selectedLessonId="lesson-1-1" 
      />
    );
    
    // Confirmation message should be displayed
    expect(screen.getByText('Vídeo será associado a: Introduction to React > React Basics')).toBeInTheDocument();
  });

  it('handles course with no lessons', () => {
    const coursesWithEmptyLessons = [
      {
        id: 'course-3',
        title: 'Empty Course',
        lessons: []
      }
    ];
    
    render(
      <VideoCourseSelector 
        courses={coursesWithEmptyLessons} 
        onSelect={mockOnSelect} 
        selectedCourseId="course-3" 
      />
    );
    
    // Open the lesson dropdown
    fireEvent.click(screen.getByText('Selecione uma aula'));
    
    // Should show empty state
    expect(screen.getByText('Nenhuma aula encontrada')).toBeInTheDocument();
  });
});
