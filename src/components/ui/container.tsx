import { ComponentProps } from "react"

interface ContainerProps extends ComponentProps<"div"> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
}

const sizeStyles = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl"
}

export function Container({ size = "md", className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 ${sizeStyles[size]} ${className}`}
      {...props}
    />
  )
}
