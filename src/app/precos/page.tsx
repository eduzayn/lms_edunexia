import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Preços | EdunexIA LMS',
  description: 'Conheça nossos planos e escolha o que melhor atende suas necessidades.',
}

const plans = [
  {
    name: 'Básico',
    price: 'R$ 99',
    description: 'Ideal para começar sua jornada de ensino online',
    features: [
      'Até 100 alunos',
      'Cursos ilimitados',
      'Suporte por email',
      'Certificados digitais',
      'Avaliações básicas',
      'Relatórios simples',
    ],
    cta: 'Começar agora',
    popular: false,
  },
  {
    name: 'Profissional',
    price: 'R$ 199',
    description: 'Perfeito para instituições em crescimento',
    features: [
      'Até 500 alunos',
      'Cursos ilimitados',
      'Suporte prioritário',
      'Certificados personalizados',
      'Avaliações avançadas',
      'Relatórios detalhados',
      'Gamificação',
      'API de integração',
    ],
    cta: 'Experimentar grátis',
    popular: true,
  },
  {
    name: 'Empresarial',
    price: 'Sob consulta',
    description: 'Para grandes instituições e corporações',
    features: [
      'Alunos ilimitados',
      'Cursos ilimitados',
      'Suporte 24/7',
      'Personalização completa',
      'Ambiente dedicado',
      'Integrações customizadas',
      'SLA garantido',
      'Treinamento da equipe',
    ],
    cta: 'Falar com consultor',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="container py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Preços transparentes e flexíveis
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Escolha o plano ideal para sua instituição de ensino
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border bg-card p-8 shadow-sm ${
              plan.popular
                ? 'border-primary ring-2 ring-primary'
                : 'border-border'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                Mais popular
              </span>
            )}

            <div className="text-center">
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <p className="mt-4 text-4xl font-bold tracking-tight">
                {plan.price}
                {plan.price !== 'Sob consulta' && (
                  <span className="text-base font-normal text-muted-foreground">
                    /mês
                  </span>
                )}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="ml-3 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="mt-8 w-full" variant={plan.popular ? 'default' : 'outline'}>
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold">
          Precisa de um plano personalizado?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Entre em contato conosco para discutirmos uma solução sob medida para sua
          instituição.
        </p>
        <Button className="mt-8" variant="outline" size="lg">
          Falar com um consultor
        </Button>
      </div>
    </div>
  )
} 