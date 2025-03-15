import React from 'react';
import { render, screen, fireEvent } from '../../../__tests__/utils/test-utils';
import { DatePicker } from '../date-picker';

describe('DatePicker Component', () => {
  const mockSetDate = jest.fn();
  
  beforeEach(() => {
    mockSetDate.mockClear();
  });
  
  it('renders correctly', () => {
    render(<DatePicker setDate={mockSetDate} />);
    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<DatePicker setDate={mockSetDate} className="custom-datepicker" />);
    const container = screen.getByTestId('date-picker-container');
    expect(container).toHaveClass('custom-datepicker');
  });

  it('displays custom placeholder text', () => {
    render(<DatePicker setDate={mockSetDate} placeholder="Choose a date" />);
    expect(screen.getByPlaceholderText('Choose a date')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<DatePicker setDate={mockSetDate} disabled />);
    const input = screen.getByPlaceholderText('Select date');
    expect(input).toBeDisabled();
  });

  it('handles date selection', () => {
    render(<DatePicker setDate={mockSetDate} />);
    const input = screen.getByPlaceholderText('Select date');
    
    // Simulate date selection
    const testDate = '2023-01-01';
    fireEvent.change(input, { target: { value: testDate } });
    
    expect(mockSetDate).toHaveBeenCalledWith(expect.any(Date));
  });
});
