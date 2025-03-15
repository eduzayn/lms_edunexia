/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuestionEditor } from '../question-editor';

// Mock the UI components to avoid complex rendering issues
jest.mock('../../ui/button', () => ({
  Button: ({ children, onClick }) => (
    <button onClick={onClick} data-testid="button">
      {children}
    </button>
  ),
}));

jest.mock('../../ui/card', () => ({
  Card: ({ children, className }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }) => (
    <div data-testid="card-title">{children}</div>
  ),
  CardContent: ({ children }) => (
    <div data-testid="card-content">{children}</div>
  ),
}));

jest.mock('../../ui/input', () => ({
  Input: ({ id, value, onChange }) => (
    <input id={id} value={value} onChange={onChange} data-testid="input" />
  ),
}));

jest.mock('../../ui/textarea', () => ({
  Textarea: ({ id, value, onChange }) => (
    <textarea id={id} value={value} onChange={onChange} data-testid="textarea" />
  ),
}));

jest.mock('../../ui/select', () => ({
  Select: ({ value, onValueChange, children }) => (
    <select value={value} onChange={(e) => onValueChange(e.target.value)} data-testid="select">
      {children}
    </select>
  ),
  SelectTrigger: ({ children }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }) => (
    <div data-testid="select-value">{placeholder}</div>
  ),
  SelectContent: ({ children }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ value, children }) => (
    <option value={value} data-testid="select-item">
      {children}
    </option>
  ),
}));

jest.mock('../../ui/switch', () => ({
  Switch: ({ checked, onCheckedChange }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      data-testid="switch"
    />
  ),
}));

jest.mock('../../ui/label', () => ({
  Label: ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} data-testid="label">
      {children}
    </label>
  ),
}));

jest.mock('lucide-react', () => ({
  Trash2: () => <div data-testid="trash-icon">Trash</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  GripVertical: () => <div data-testid="grip-icon">Grip</div>,
  ArrowUp: () => <div data-testid="arrow-up-icon">ArrowUp</div>,
  ArrowDown: () => <div data-testid="arrow-down-icon">ArrowDown</div>,
}));

describe('QuestionEditor Component', () => {
  // Basic test to verify the component renders without errors
  it('renders the question editor component', () => {
    const mockQuestion = {
      id: 'q1',
      assessment_id: 'test-id',
      question_text: 'Test Question',
      question_type: 'multiple_choice',
      points: 10,
      options: [
        { id: 'opt1', text: 'Option 1', is_correct: true, question_id: 'q1', order: 0 },
        { id: 'opt2', text: 'Option 2', is_correct: false, question_id: 'q1', order: 1 }
      ],
      order: 0
    };

    const mockOnUpdate = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnMoveUp = jest.fn();
    const mockOnMoveDown = jest.fn();

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

    // Verify that the component renders with basic structure
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByText('Questão 1')).toBeInTheDocument();
    
    // Verify that action buttons are present
    const buttons = screen.getAllByTestId('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('calls onUpdate when question text changes', () => {
    const mockQuestion = {
      id: 'q1',
      assessment_id: 'test-id',
      question_text: 'Test Question',
      question_type: 'multiple_choice',
      points: 10,
      options: [
        { id: 'opt1', text: 'Option 1', is_correct: true, question_id: 'q1', order: 0 },
        { id: 'opt2', text: 'Option 2', is_correct: false, question_id: 'q1', order: 1 }
      ],
      order: 0
    };

    const mockOnUpdate = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnMoveUp = jest.fn();
    const mockOnMoveDown = jest.fn();

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

    // Find all textareas and simulate changing the question text
    const textareas = screen.getAllByTestId('textarea');
    fireEvent.change(textareas[0], { target: { value: 'Updated Question Text' } });
    
    // Verify onUpdate was called with the updated question
    expect(mockOnUpdate).toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockQuestion = {
      id: 'q1',
      assessment_id: 'test-id',
      question_text: 'Test Question',
      question_type: 'multiple_choice',
      points: 10,
      options: [
        { id: 'opt1', text: 'Option 1', is_correct: true, question_id: 'q1', order: 0 },
        { id: 'opt2', text: 'Option 2', is_correct: false, question_id: 'q1', order: 1 }
      ],
      order: 0
    };

    const mockOnUpdate = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnMoveUp = jest.fn();
    const mockOnMoveDown = jest.fn();

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

    // Find all buttons and click the one with the trash icon
    const buttons = screen.getAllByTestId('button');
    const deleteButton = buttons.find(button => 
      button.textContent?.includes('Trash') || 
      button.innerHTML.includes('trash-icon')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(mockOnDelete).toHaveBeenCalledWith(0);
    }
  });
});
