import * as React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success";
}

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "default":
        return "bg-background text-foreground";
      case "destructive":
        return "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive";
      case "success":
        return "border-green-500/50 text-green-700 dark:border-green-500 [&>svg]:text-green-500";
      default:
        return "bg-background text-foreground";
    }
  };

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${getVariantClasses()} ${className || ""}`}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={`mb-1 font-medium leading-none tracking-tight ${className || ""}`}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-sm [&_p]:leading-relaxed ${className || ""}`}
      {...props}
    />
  );
}
