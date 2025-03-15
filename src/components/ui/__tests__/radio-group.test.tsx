import React from 'react';
import { render, screen, fireEvent } from '../../../__tests__/utils/test-utils';
import { RadioGroup, RadioGroupItem } from '../radio-group';

describe('RadioGroup Components', () => {
  describe('RadioGroup', () => {
    it('renders correctly with children', () => {
      render(
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" id="option1">Option 1</RadioGroupItem>
          <RadioGroupItem value="option2" id="option2">Option 2</RadioGroupItem>
        </RadioGroup>
      );
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <RadioGroup defaultValue="option1" className="custom-group">
          <RadioGroupItem value="option1" id="option1">Option 1</RadioGroupItem>
        </RadioGroup>
      );
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('custom-group');
    });

    it('handles value changes correctly', () => {
      const handleValueChange = jest.fn();
      render(
        <RadioGroup defaultValue="option1" onValueChange={handleValueChange}>
          <RadioGroupItem value="option1" id="option1">Option 1</RadioGroupItem>
          <RadioGroupItem value="option2" id="option2">Option 2</RadioGroupItem>
        </RadioGroup>
      );
      
      const option2 = screen.getByLabelText('Option 2');
      fireEvent.click(option2);
      
      expect(handleValueChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('RadioGroupItem', () => {
    it('renders correctly', () => {
      render(
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" id="option1">Option 1</RadioGroupItem>
        </RadioGroup>
      );
      
      const radioItem = screen.getByLabelText('Option 1');
      expect(radioItem).toBeInTheDocument();
      expect(radioItem).toBeChecked();
    });

    it('applies custom className', () => {
      render(
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" id="option1" className="custom-radio">
            Option 1
          </RadioGroupItem>
        </RadioGroup>
      );
      
      const radioItem = screen.getByLabelText('Option 1');
      expect(radioItem.parentElement).toHaveClass('custom-radio');
    });

    it('can be disabled', () => {
      render(
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" id="option1" disabled>
            Option 1
          </RadioGroupItem>
        </RadioGroup>
      );
      
      const radioItem = screen.getByLabelText('Option 1');
      expect(radioItem).toBeDisabled();
    });
  });

  describe('RadioGroup Composition', () => {
    it('renders a complete radio group with multiple options', () => {
      const handleValueChange = jest.fn();
      render(
        <RadioGroup defaultValue="option1" onValueChange={handleValueChange}>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option1" id="option1" />
              <label htmlFor="option1">Option 1</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option2" id="option2" />
              <label htmlFor="option2">Option 2</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option3" id="option3" disabled />
              <label htmlFor="option3">Option 3 (Disabled)</label>
            </div>
          </div>
        </RadioGroup>
      );

      expect(screen.getByLabelText('Option 1')).toBeChecked();
      expect(screen.getByLabelText('Option 2')).not.toBeChecked();
      expect(screen.getByLabelText('Option 3 (Disabled)')).toBeDisabled();
      
      fireEvent.click(screen.getByLabelText('Option 2'));
      expect(handleValueChange).toHaveBeenCalledWith('option2');
    });
  });
});
