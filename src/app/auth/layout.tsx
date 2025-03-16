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
    <div className="min-h-screen bg-muted/5">
      <Container className="relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative z-20">
            <Logo className="text-white" />
          </div>
          <div className="relative z-20 mt-auto">
            <Blockquote
              quote="A plataforma EdunexIA revolucionou a forma como gerencio minhas aulas e interajo com meus alunos. É simplesmente incrível!"
              author="Prof. Ana Maria Silva"
            />
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {children}
          </div>
        </div>
      </Container>
    </div>
  )
}
