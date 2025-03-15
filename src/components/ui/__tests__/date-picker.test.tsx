import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { DatePicker } from '../date-picker';

describe('DatePicker Component', () => {
  it('renders correctly', () => {
    render(<DatePicker />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<DatePicker className="custom-datepicker" />);
    expect(screen.getByRole('textbox').parentElement).toHaveClass('custom-datepicker');
  });

  it('displays placeholder text', () => {
    render(<DatePicker placeholder="Select date" />);
    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<DatePicker disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<DatePicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes additional props to the input element', () => {
    render(<DatePicker data-testid="test-datepicker" aria-label="Date selection" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Date selection');
  });

  it('renders with default date when provided', () => {
    const defaultDate = new Date('2023-01-01');
    render(<DatePicker defaultValue={defaultDate} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('01/01/2023');
  });

  it('renders with min and max date constraints', () => {
    const minDate = new Date('2023-01-01');
    const maxDate = new Date('2023-12-31');
    render(<DatePicker minDate={minDate} maxDate={maxDate} />);
    
    // The constraints are applied to the calendar, but we can verify the component renders
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });
});
