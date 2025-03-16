import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null
  
  return (
    <div className={`bg-destructive/10 border border-destructive text-destructive rounded-md p-3 flex items-start gap-2 ${className}`}>
      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  )
} 