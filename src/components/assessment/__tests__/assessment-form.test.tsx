import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssessmentForm } from '../assessment-form';
import { Assessment, AssessmentType } from '../../../lib/services/assessment-service';

// Mock the QuestionEditor component
jest.mock('../question-editor', () => ({
  QuestionEditor: ({ question, index, onUpdate, onDelete, onMoveUp, onMoveDown }) => (
    <div data-testid={`question-editor-${index}`}>
      <span>Question: {question.question_text}</span>
      <button onClick={() => onUpdate(index, { ...question, question_text: 'Updated' })}>Update</button>
      <button onClick={() => onDelete(index)}>Delete</button>
      <button onClick={() => onMoveUp(index)}>Move Up</button>
      <button onClick={() => onMoveDown(index)}>Move Down</button>
    </div>
  )
}));

describe('AssessmentForm Component', () => {
  const mockAssessment: Assessment = {
    id: 'test-id',
    title: 'Test Assessment',
    description: 'Test Description',
    instructions: 'Test Instructions',
    type_id: 'type-1',
    course_id: 'course-1',
    module_id: 'module-1',
    due_date: '2025-04-15T00:00:00Z',
    points: 100,
    passing_score: 70,
    time_limit_minutes: 60,
    attempts_allowed: 3,
    questions: [
      {
        id: 'q1',
        assessment_id: 'test-id',
        question_text: 'Question 1',
        question_type: 'multiple_choice',
        points: 10,
        options: [],
        order: 0
      }
    ],
    settings: {},
    created_at: '2025-03-15T00:00:00Z',
    updated_at: '2025-03-15T00:00:00Z'
  };

  const mockAssessmentTypes: AssessmentType[] = [
    { id: 'type-1', name: 'Quiz', description: 'Short assessment', icon: 'quiz', settings: {} },
    { id: 'type-2', name: 'Exam', description: 'Comprehensive assessment', icon: 'exam', settings: {} }
  ];

  const mockCourses = [
    { id: 'course-1', title: 'Course 1' },
    { id: 'course-2', title: 'Course 2' }
  ];

  const mockModules = [
    { id: 'module-1', title: 'Module 1' },
    { id: 'module-2', title: 'Module 2' }
  ];

  const mockOnUpdate = jest.fn();
  const mockOnSave = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all sections', () => {
    render(
      <AssessmentForm
        assessment={mockAssessment}
        assessmentTypes={mockAssessmentTypes}
        courses={mockCourses}
        modules={mockModules}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
        isSaving={false}
      />
    );
    
    // Check if all section titles are displayed
    expect(screen.getByText('Informações Básicas')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
    expect(screen.getByText('Questões')).toBeInTheDocument();
    
    // Check if form fields are displayed with correct values
    expect(screen.getByLabelText('Título')).toHaveValue('Test Assessment');
    expect(screen.getByLabelText('Descrição')).toHaveValue('Test Description');
    expect(screen.getByLabelText('Instruções')).toHaveValue('Test Instructions');
    
    // Check if numeric fields have correct values
    expect(screen.getByLabelText('Pontuação Total')).toHaveValue(100);
    expect(screen.getByLabelText('Nota Mínima para Aprovação (%)')).toHaveValue(70);
    expect(screen.getByLabelText('Limite de Tempo (minutos)')).toHaveValue(60);
    expect(screen.getByLabelText('Tentativas Permitidas')).toHaveValue(3);
    
    // Check if question editor is rendered
    expect(screen.getByTestId('question-editor-0')).toBeInTheDocument();
    
    // Check if buttons are displayed
    expect(screen.getByText('Adicionar Questão')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar Avaliação')).toBeInTheDocument();
  });

  it('calls onUpdate when form fields change', () => {
    render(
      <AssessmentForm
        assessment={mockAssessment}
        assessmentTypes={mockAssessmentTypes}
        courses={mockCourses}
        modules={mockModules}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
        isSaving={false}
      />
    );
    
    // Change title
    const titleInput = screen.getByLabelText('Título');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockAssessment,
      title: 'Updated Title'
    });
    
    // Change description
    const descriptionInput = screen.getByLabelText('Descrição');
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockAssessment,
      description: 'Updated Description'
    });
    
    // Change points
    const pointsInput = screen.getByLabelText('Pontuação Total');
    fireEvent.change(pointsInput, { target: { value: '200' } });
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockAssessment,
      points: 200
    });
  });

  it('calls onSave when save button is clicked', () => {
    render(
      <AssessmentForm
        assessment={mockAssessment}
        assessmentTypes={mockAssessmentTypes}
        courses={mockCourses}
        modules={mockModules}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
        isSaving={false}
      />
    );
    
    const saveButton = screen.getByText('Salvar Avaliação');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('disables save button when isSaving is true', () => {
    render(
      <AssessmentForm
        assessment={mockAssessment}
        assessmentTypes={mockAssessmentTypes}
        courses={mockCourses}
        modules={mockModules}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
        isSaving={true}
      />
    );
    
    const saveButton = screen.getByText('Salvando...');
    expect(saveButton).toBeDisabled();
  });

  it('adds a new question when add question button is clicked', () => {
    render(
      <AssessmentForm
        assessment={mockAssessment}
        assessmentTypes={mockAssessmentTypes}
        courses={mockCourses}
        modules={mockModules}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
        isSaving={false}
      />
    );
    
    const addButton = screen.getByText('Adicionar Questão');
    fireEvent.click(addButton);
    
    // Check if onUpdate was called with a new question added
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    const updatedAssessment = mockOnUpdate.mock.calls[0][0];
    expect(updatedAssessment.questions.length).toBe(2);
    expect(updatedAssessment.questions[1].question_text).toBe('Nova questão');
  });

  it('deletes a question when delete button is clicked', () => {
    render(
      <AssessmentForm
        assessment={mockAssessment}
        assessmentTypes={mockAssessmentTypes}
        courses={mockCourses}
        modules={mockModules}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
        isSaving={false}
      />
    );
    
    // Find and click the delete button in the question editor
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    // Check if onUpdate was called with the question removed
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    const updatedAssessment = mockOnUpdate.mock.calls[0][0];
    expect(updatedAssessment.questions.length).toBe(0);
  });

  it('displays empty state when there are no questions', () => {
    const assessmentWithNoQuestions = {
      ...mockAssessment,
      questions: []
    };
    
    render(
      <AssessmentForm
        assessment={assessmentWithNoQuestions}
        assessmentTypes={mockAssessmentTypes}
        courses={mockCourses}
        modules={mockModules}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
        isSaving={false}
      />
    );
    
    expect(screen.getByText('Nenhuma questão adicionada ainda.')).toBeInTheDocument();
    expect(screen.getByText('Clique em "Adicionar Questão" para começar.')).toBeInTheDocument();
  });
});
