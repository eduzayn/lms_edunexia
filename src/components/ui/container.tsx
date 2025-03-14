import * as React from "react";

// Using type instead of interface to avoid empty interface warning
export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className || ''}`}
      {...props}
    />
  )
);
Container.displayName = "Container";
