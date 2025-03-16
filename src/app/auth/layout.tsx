import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { Container } from "@/components/ui/container"
import { Blockquote } from "@/components/ui/blockquote"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
