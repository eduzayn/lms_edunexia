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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Lado esquerdo - Banner */}
      <div className="hidden lg:flex bg-blue-600 text-white">
        <div className="flex flex-col justify-center items-center p-8 w-full">
          <h1 className="text-4xl font-bold mb-6">EdunexIA LMS</h1>
          <p className="text-xl text-center max-w-md">
            Transforme sua instituição de ensino com a plataforma mais inovadora do mercado.
          </p>
        </div>
      </div>

      {/* Lado direito - Conteúdo */}
      <div className="flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  )
}
