import { Suspense } from 'react'
import { unstable_noStore as noStore } from 'next/cache'

// Componente que será renderizado estaticamente
function StaticContent() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Bem-vindo ao EduNexia LMS
        </h1>
        <p className="mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Sua plataforma completa de ensino à distância
        </p>
      </div>
    </section>
  )
}

// Componente que será renderizado dinamicamente
async function DynamicContent() {
  noStore()
  
  // Aqui você pode adicionar qualquer conteúdo dinâmico
  // como estatísticas, últimos cursos, etc.
  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold tracking-tighter">Conteúdo Dinâmico</h2>
        <div className="mt-4">
          {/* Conteúdo dinâmico aqui */}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <StaticContent />
      <Suspense fallback={<div>Carregando...</div>}>
        <DynamicContent />
      </Suspense>
    </main>
  )
} 