import * as React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  // This interface extends HTMLAttributes but doesn't add any new properties
}

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
