import React from 'react';
import { render, screen, fireEvent } from '../../../__tests__/utils/test-utils';
import { RadioGroup, RadioGroupItem } from '../radio-group';

describe('RadioGroup Components', () => {
  describe('RadioGroup', () => {
    it('renders correctly with children', () => {
      render(
        <RadioGroup value="option1" onValueChange={() => {}}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" />
            <label htmlFor="option1">Option 1</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="option2" />
            <label htmlFor="option2">Option 2</label>
          </div>
        </RadioGroup>
      );
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <RadioGroup value="option1" onValueChange={() => {}} className="custom-group">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" />
            <label htmlFor="option1">Option 1</label>
          </div>
        </RadioGroup>
      );
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('custom-group');
    });
  });

  describe('RadioGroupItem', () => {
    it('renders correctly', () => {
      render(
        <RadioGroup value="option1" onValueChange={() => {}}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" />
            <label htmlFor="option1">Option 1</label>
          </div>
        </RadioGroup>
      );
      
      const radioItem = screen.getByLabelText('Option 1');
      expect(radioItem).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <RadioGroup value="option1" onValueChange={() => {}}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" className="custom-radio" />
            <label htmlFor="option1">Option 1</label>
          </div>
        </RadioGroup>
      );
      
      const radioItem = screen.getByRole('radio');
      expect(radioItem.parentElement).toHaveClass('custom-radio');
    });

    it('can be disabled', () => {
      render(
        <RadioGroup value="option1" onValueChange={() => {}}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" disabled />
            <label htmlFor="option1">Option 1</label>
          </div>
        </RadioGroup>
      );
      
      const radioItem = screen.getByLabelText('Option 1');
      expect(radioItem).toBeDisabled();
    });
  });
});
