import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | EdunexIA LMS',
  description: 'Faça login na plataforma EdunexIA LMS',
}

export default function LoginPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img 
            src="/logo.png"
            alt="EdunexIA Logo"
            className="h-8 w-auto"
          />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "A EdunexIA revolucionou a forma como gerenciamos nossa instituição de ensino. A plataforma é intuitiva e a integração com IA nos ajuda a oferecer uma experiência personalizada para cada aluno."
            </p>
            <footer className="text-sm">Sofia Mendes - Diretora Acadêmica</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bem-vindo(a) de volta
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre com seu e-mail e senha para acessar a plataforma
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao clicar em continuar, você concorda com nossos{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
} 