interface BlockquoteProps {
  quote: string
  author: string
  className?: string
}

export function Blockquote({ quote, author, className = "" }: BlockquoteProps) {
  return (
    <blockquote className={`space-y-2 ${className}`}>
      <p className="text-lg">
        {quote}
      </p>
      <footer className="text-sm">
        {author}
      </footer>
    </blockquote>
  )
} 