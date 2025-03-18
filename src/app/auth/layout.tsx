import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autenticação | EdunexIA LMS',
  description: 'Autenticação na plataforma EdunexIA LMS',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  )
} 