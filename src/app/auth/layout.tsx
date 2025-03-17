import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autenticação',
  description: 'Autenticação do EdunexIA LMS',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-[350px] w-full mx-auto space-y-6">
        {children}
      </div>
    </div>
  )
} 