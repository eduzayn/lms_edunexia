import * as React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  // This interface extends HTMLAttributes but doesn't add any new properties
}

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

export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  // This interface extends HTMLAttributes but doesn't add any new properties
}

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

export interface SectionDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  // This interface extends HTMLAttributes but doesn't add any new properties
}

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
