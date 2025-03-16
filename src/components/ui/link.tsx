import NextLink from "next/link"
import { ComponentProps } from "react"

type BaseProps = Omit<ComponentProps<typeof NextLink>, "className">

interface LinkProps extends BaseProps {
  variant?: "default" | "muted" | "primary"
  className?: string
}

const variantStyles = {
  default: "text-foreground hover:underline",
  muted: "text-muted-foreground hover:text-primary",
  primary: "text-primary hover:underline"
}

export function Link({ variant = "default", className = "", ...props }: LinkProps) {
  return (
    <NextLink
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    />
  )
} 