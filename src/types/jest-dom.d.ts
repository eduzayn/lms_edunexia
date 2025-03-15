import '@testing-library/jest-dom';

// Extend Jest matchers
declare global {
  namespace jest {
    // Add missing matchers to the Matchers interface
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveValue(value: any): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeChecked(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeNull(): R;
      toBe(expected: any): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenCalledTimes(expected: number): R;
      not: {
        toBeInTheDocument(): R;
        toHaveClass(...classNames: string[]): R;
        toBeNull(): R;
        toHaveBeenCalledWith(...args: any[]): R;
      };
    }
  }
}

// Make TypeScript recognize these matchers on the global expect object
declare global {
  namespace globalThis {
    interface JestMatchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveValue(value: any): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeChecked(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeNull(): R;
      toBe(expected: any): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenCalledTimes(expected: number): R;
    }
  }
}
