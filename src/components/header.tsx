import Image from 'next/image'
import { Link } from '@/components/ui/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="EdunexIA"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-semibold">EdunexIA</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80">
            Início
          </Link>
          <Link href="/depoimentos" className="transition-colors hover:text-foreground/80">
            Depoimentos
          </Link>
          <Link href="/precos" className="transition-colors hover:text-foreground/80">
            Preços
          </Link>
          <Link href="/suporte" className="transition-colors hover:text-foreground/80">
            Suporte
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/auth/portal-selection">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/auth/aluno/register">
            <Button>Criar Conta</Button>
          </Link>
        </div>
      </div>
    </header>
  )
} 