import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className: string): R;
      toHaveValue(value: any): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeChecked(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeNull(): R;
      toBe(expected: any): R;
      toHaveBeenCalledWith(expected: any): R;
      toHaveBeenCalledTimes(expected: number): R;
    }
  }
}

// Extend expect
declare namespace jest {
  interface Expect {
    toHaveBeenCalledWith: any;
    toHaveBeenCalledTimes: any;
  }
}
