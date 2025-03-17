import type { Metadata } from 'next'
import Image from 'next/image'
import { Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Depoimentos | EdunexIA LMS',
  description: 'Veja o que nossos clientes dizem sobre a plataforma.',
}

const testimonials = [
  {
    name: 'Ana Silva',
    role: 'Diretora Acadêmica',
    institution: 'Faculdade Inovação',
    image: '/testimonials/ana-silva.jpg',
    content:
      'A EdunexIA transformou completamente nossa forma de ensinar. A integração da IA no processo de aprendizagem trouxe resultados surpreendentes para nossos alunos.',
    rating: 5,
  },
  {
    name: 'Carlos Santos',
    role: 'Coordenador de EAD',
    institution: 'Instituto Tecnológico',
    image: '/testimonials/carlos-santos.jpg',
    content:
      'A facilidade de uso e o suporte excepcional fazem da EdunexIA a melhor escolha para instituições que buscam inovação no ensino.',
    rating: 5,
  },
  {
    name: 'Mariana Costa',
    role: 'Professora',
    institution: 'Colégio Futuro',
    image: '/testimonials/mariana-costa.jpg',
    content:
      'Como professora, posso dizer que a plataforma me ajuda a criar conteúdos mais engajadores e acompanhar o progresso dos alunos de forma eficiente.',
    rating: 5,
  },
  {
    name: 'Roberto Oliveira',
    role: 'Diretor de TI',
    institution: 'Universidade Digital',
    image: '/testimonials/roberto-oliveira.jpg',
    content:
      'A infraestrutura robusta e a segurança da plataforma nos dão tranquilidade para escalar nossas operações de ensino à distância.',
    rating: 5,
  },
  {
    name: 'Patrícia Lima',
    role: 'Coordenadora Pedagógica',
    institution: 'Escola Nova Era',
    image: '/testimonials/patricia-lima.jpg',
    content:
      'A adaptabilidade da plataforma às nossas necessidades específicas e o sistema de avaliação inteligente são diferenciais importantes.',
    rating: 5,
  },
  {
    name: 'Fernando Mendes',
    role: 'Gestor de Projetos',
    institution: 'Centro de Capacitação',
    image: '/testimonials/fernando-mendes.jpg',
    content:
      'A EdunexIA nos ajudou a expandir nossa oferta de cursos e melhorar significativamente a experiência de aprendizagem dos alunos.',
    rating: 5,
  },
]

export default function TestimonialsPage() {
  return (
    <div className="container py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          O que dizem nossos clientes
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Depoimentos de instituições que transformaram seu ensino com a EdunexIA
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="flex flex-col rounded-2xl border bg-card p-8"
          >
            <div className="flex items-center gap-4">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role} • {testimonial.institution}
                </p>
              </div>
            </div>

            <div className="mt-4 flex">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-primary text-primary"
                />
              ))}
            </div>

            <blockquote className="mt-4 flex-1">
              <p className="text-muted-foreground">{testimonial.content}</p>
            </blockquote>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold">
          Quer fazer parte dessa transformação?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Junte-se a milhares de instituições que já estão revolucionando o ensino
          com a EdunexIA.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/precos"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Ver planos
          </a>
          <a
            href="/suporte"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Falar com consultor
          </a>
        </div>
      </div>
    </div>
  )
}
