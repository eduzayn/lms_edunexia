import * as React from "react";

// Using type instead of interface to avoid empty interface warning
export type SectionProps = React.HTMLAttributes<HTMLElement>;

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={`py-12 ${className || ''}`}
      {...props}
    />
  )
);
Section.displayName = "Section";

// Using type instead of interface to avoid empty interface warning
export type SectionTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl ${className || ''}`}
      {...props}
    />
  )
);
SectionTitle.displayName = "SectionTitle";

// Using type instead of interface to avoid empty interface warning
export type SectionDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const SectionDescription = React.forwardRef<HTMLParagraphElement, SectionDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={`mt-4 max-w-2xl text-xl text-gray-500 ${className || ''}`}
      {...props}
    />
  )
);
SectionDescription.displayName = "SectionDescription";
