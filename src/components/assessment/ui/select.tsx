import * as React from "react";

// Using type instead of interface to avoid empty interface warning
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  onValueChange?: (value: string) => void;
  value?: string;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onValueChange, value, ...props }, ref) => {
    // Handle onValueChange if provided
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) {
        onValueChange(e.target.value);
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <select
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        ref={ref}
        value={value}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };

// Using type instead of interface to avoid empty interface warning
export type SelectItemProps = React.OptionHTMLAttributes<HTMLOptionElement>;

const SelectItem = React.forwardRef<HTMLOptionElement, SelectItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <option
        className={`relative flex w-full cursor-default select-none items-center py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);
SelectItem.displayName = "SelectItem";

export { SelectItem };

// Export additional components needed by the assessment forms
interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ className, children, ...props }) => (
  <div className={`flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`} {...props}>
    {children}
  </div>
);

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  children?: React.ReactNode;
  placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ className, children, ...props }) => (
  <span className={`flex-grow truncate ${className || ''}`} {...props}>
    {children}
  </span>
);

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export const SelectContent: React.FC<SelectContentProps> = ({ className, children, ...props }) => (
  <div className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className || ''}`} {...props}>
    <div className="p-1">{children}</div>
  </div>
);
