import * as React from "react";

// Define a type for the props that RadioItem expects
interface RadioItemValue {
  value: string;
}

export interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  children?: React.ReactNode;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onChange, defaultValue, children, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
      value || defaultValue
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleChange = (newValue: string) => {
      if (value === undefined) {
        setSelectedValue(newValue);
      }
      onChange?.(newValue);
    };

    return (
      <div
        ref={ref}
        className={`grid gap-2 ${className || ''}`}
        role="radiogroup"
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const childProps = child.props as RadioItemValue;
            return React.cloneElement(child as React.ReactElement<RadioItemProps>, {
              checked: selectedValue === childProps.value,
              onChange: () => handleChange(childProps.value),
            });
          }
          return child;
        })}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  checked?: boolean;
  onChange?: () => void;
}

export const RadioItem = React.forwardRef<HTMLInputElement, RadioItemProps>(
  ({ className, children, value, checked, onChange, ...props }, ref) => {
    return (
      <label className={`flex items-center space-x-2 ${className || ''}`}>
        <input
          type="radio"
          ref={ref}
          value={value}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
          {...props}
        />
        <span>{children}</span>
      </label>
    );
  }
);
RadioItem.displayName = "RadioItem";

// Export RadioGroupItem as an alias for RadioItem for compatibility
export const RadioGroupItem = RadioItem;
