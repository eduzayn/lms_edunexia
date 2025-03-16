import { Link } from "@/components/ui/link"

interface LogoProps {
  showSubtitle?: boolean
  className?: string
}

export function Logo({ showSubtitle = true, className = "" }: LogoProps) {
  return (
    <Link href="/" variant="default" className={`flex items-center gap-2 ${className}`}>
      <span className="text-2xl font-bold">EdunexIA</span>
      {showSubtitle && <span className="text-xl">LMS</span>}
    </Link>
  )
} 