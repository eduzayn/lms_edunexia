"use client"

export function HomeContent({ email }: { email: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Bem vindo ao LMS Edunexia</h1>
      <p className="mt-4 text-lg text-gray-600">
        Você está logado como {email}
      </p>
    </div>
  )
} 