import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuestionEditor } from '../question-editor';
import { AssessmentQuestion } from '../../../lib/services/assessment-service';

describe('QuestionEditor Component', () => {
  const mockQuestion: AssessmentQuestion = {
    id: 'q1',
    assessment_id: 'test-id',
    question_text: 'Test Question',
    question_type: 'multiple_choice',
    points: 10,
    options: [
      { id: 'opt1', text: 'Option 1', is_correct: true },
      { id: 'opt2', text: 'Option 2', is_correct: false }
    ],
    order: 0
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnMoveUp = jest.fn();
  const mockOnMoveDown = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the question editor with correct content', () => {
    render(
      <QuestionEditor
        question={mockQuestion}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );
    
    // Check if question text is displayed
    expect(screen.getByLabelText('Texto da Questão')).toHaveValue('Test Question');
    
    // Check if question type is displayed
    expect(screen.getByText('Tipo de Questão')).toBeInTheDocument();
    
    // Check if points input is displayed
    expect(screen.getByLabelText('Pontos')).toHaveValue(10);
    
    // Check if options are displayed
    expect(screen.getByText('Opções')).toBeInTheDocument();
    
    // Check if action buttons are displayed
    expect(screen.getByText('Excluir Questão')).toBeInTheDocument();
    expect(screen.getByText('Mover para Cima')).toBeInTheDocument();
    expect(screen.getByText('Mover para Baixo')).toBeInTheDocument();
  });

  it('calls onUpdate when question text changes', () => {
    render(
      <QuestionEditor
        question={mockQuestion}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );
    
    const questionTextInput = screen.getByLabelText('Texto da Questão');
    fireEvent.change(questionTextInput, { target: { value: 'Updated Question Text' } });
    
    expect(mockOnUpdate).toHaveBeenCalledWith(0, {
      ...mockQuestion,
      question_text: 'Updated Question Text'
    });
  });

  it('calls onUpdate when points change', () => {
    render(
      <QuestionEditor
        question={mockQuestion}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );
    
    const pointsInput = screen.getByLabelText('Pontos');
    fireEvent.change(pointsInput, { target: { value: '20' } });
    
    expect(mockOnUpdate).toHaveBeenCalledWith(0, {
      ...mockQuestion,
      points: 20
    });
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <QuestionEditor
        question={mockQuestion}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );
    
    const deleteButton = screen.getByText('Excluir Questão');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(0);
  });

  it('calls onMoveUp when move up button is clicked', () => {
    render(
      <QuestionEditor
        question={mockQuestion}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );
    
    const moveUpButton = screen.getByText('Mover para Cima');
    fireEvent.click(moveUpButton);
    
    expect(mockOnMoveUp).toHaveBeenCalledWith(0);
  });

  it('calls onMoveDown when move down button is clicked', () => {
    render(
      <QuestionEditor
        question={mockQuestion}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );
    
    const moveDownButton = screen.getByText('Mover para Baixo');
    fireEvent.click(moveDownButton);
    
    expect(mockOnMoveDown).toHaveBeenCalledWith(0);
  });

  it('renders options correctly for multiple choice questions', () => {
    render(
      <QuestionEditor
        question={mockQuestion}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );
    
    // Check if option text inputs are displayed
    const optionInputs = screen.getAllByPlaceholderText('Texto da opção');
    expect(optionInputs.length).toBe(2);
    
    // Check if correct answer checkboxes are displayed
    const correctCheckboxes = screen.getAllByRole('checkbox');
    expect(correctCheckboxes.length).toBe(2);
    
    // First option should be checked (correct)
    expect(correctCheckboxes[0]).toBeChecked();
    
    // Second option should not be checked (incorrect)
    expect(correctCheckboxes[1]).not.toBeChecked();
  });

  it('adds a new option when add option button is clicked', () => {
    render(
      <QuestionEditor
        question={mockQuestion}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );
    
    const addOptionButton = screen.getByText('Adicionar Opção');
    fireEvent.click(addOptionButton);
    
    // Check if onUpdate was called with a new option added
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    const updatedQuestion = mockOnUpdate.mock.calls[0][1];
    expect(updatedQuestion.options.length).toBe(3);
    expect(updatedQuestion.options[2].text).toBe('');
    expect(updatedQuestion.options[2].is_correct).toBe(false);
  });

  it('updates option text when changed', () => {
    render(
      <QuestionEditor
        question={mockQuestion}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );
    
    const optionInputs = screen.getAllByPlaceholderText('Texto da opção');
    fireEvent.change(optionInputs[0], { target: { value: 'Updated Option 1' } });
    
    // Check if onUpdate was called with updated option text
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    const updatedQuestion = mockOnUpdate.mock.calls[0][1];
    expect(updatedQuestion.options[0].text).toBe('Updated Option 1');
  });

  it('toggles option correctness when checkbox is clicked', () => {
    render(
      <QuestionEditor
        question={mockQuestion}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );
    
    const correctCheckboxes = screen.getAllByRole('checkbox');
    fireEvent.click(correctCheckboxes[0]); // Uncheck first option
    
    // Check if onUpdate was called with updated option correctness
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    const updatedQuestion = mockOnUpdate.mock.calls[0][1];
    expect(updatedQuestion.options[0].is_correct).toBe(false);
  });
});
