import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Página não encontrada</h2>
      <Button asChild>
        <Link href="/">Voltar para o início</Link>
      </Button>
    </div>
  )
} 