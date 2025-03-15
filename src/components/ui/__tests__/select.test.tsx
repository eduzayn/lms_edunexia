import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../select';

describe('Select Components', () => {
  describe('Select', () => {
    it('renders correctly with children', () => {
      render(
        <Select>
          <div data-testid="select-child">Select Child</div>
        </Select>
      );
      expect(screen.getByTestId('select-child')).toBeInTheDocument();
    });
  });

  describe('SelectTrigger', () => {
    it('renders correctly', () => {
      render(
        <Select>
          <SelectTrigger data-testid="select-trigger">
            <span>Select an option</span>
          </SelectTrigger>
        </Select>
      );
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger" data-testid="select-trigger">
            <span>Select an option</span>
          </SelectTrigger>
        </Select>
      );
      expect(screen.getByTestId('select-trigger')).toHaveClass('custom-trigger');
    });
  });

  describe('SelectContent', () => {
    it('renders correctly', () => {
      render(
        <Select>
          <SelectContent data-testid="select-content">
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByTestId('select-content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Select>
          <SelectContent className="custom-content" data-testid="select-content">
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByTestId('select-content')).toHaveClass('custom-content');
    });
  });

  describe('SelectItem', () => {
    it('renders correctly', () => {
      render(
        <Select>
          <SelectContent>
            <SelectItem value="option1" data-testid="select-item">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByTestId('select-item')).toBeInTheDocument();
      expect(screen.getByTestId('select-item')).toHaveTextContent('Option 1');
    });

    it('applies custom className', () => {
      render(
        <Select>
          <SelectContent>
            <SelectItem value="option1" className="custom-item" data-testid="select-item">
              Option 1
            </SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByTestId('select-item')).toHaveClass('custom-item');
    });
  });

  describe('Select Composition', () => {
    it('renders a complete select with all components', () => {
      render(
        <Select defaultValue="option1">
          <SelectTrigger data-testid="select-trigger">
            <span data-testid="select-value">Select an option</span>
          </SelectTrigger>
          <SelectContent data-testid="select-content">
            <SelectItem value="option1" data-testid="select-item-1">Option 1</SelectItem>
            <SelectItem value="option2" data-testid="select-item-2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('select-value')).toBeInTheDocument();
      expect(screen.getByTestId('select-content')).toBeInTheDocument();
      expect(screen.getByTestId('select-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('select-item-2')).toBeInTheDocument();
    });
  });
});
