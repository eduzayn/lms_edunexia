import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
}: DatePickerProps) {
  const [date, setDate] = React.useState<string>(value || "");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    onChange?.(e.target.value);
  };

  const handleButtonClick = () => {
    inputRef.current?.showPicker();
  };

  return (
    <div className={`relative flex items-center ${className || ''}`}>
      <Input
        ref={inputRef}
        type="date"
        value={date}
        onChange={handleChange}
        className="pr-10"
        placeholder={placeholder}
        disabled={disabled}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="absolute right-1 h-7 w-7 p-0"
        onClick={handleButtonClick}
        disabled={disabled}
      >
        <CalendarIcon className="h-4 w-4" />
        <span className="sr-only">Open calendar</span>
      </Button>
    </div>
  );
}

// Simple calendar icon component
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
