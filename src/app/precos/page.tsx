'use client'

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Básico",
    price: "R$ 199",
    description: "Ideal para pequenas instituições",
    features: [
      "Até 100 alunos",
      "Gestão de cursos básica",
      "Fórum de discussão",
      "Suporte por email",
    ],
  },
  {
    name: "Profissional",
    price: "R$ 399",
    description: "Perfeito para instituições em crescimento",
    features: [
      "Até 500 alunos",
      "Gestão de cursos avançada",
      "Tutoria com IA básica",
      "Fórum de discussão",
      "Suporte prioritário",
      "Relatórios básicos",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    description: "Para grandes instituições",
    features: [
      "Alunos ilimitados",
      "Gestão de cursos completa",
      "Tutoria com IA avançada",
      "Fórum de discussão",
      "Suporte 24/7",
      "Relatórios avançados",
      "API personalizada",
      "Customização total",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Planos e Preços
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Escolha o plano ideal para sua instituição de ensino
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-8">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col p-6 bg-white rounded-lg shadow-lg ${
                    plan.popular ? 'border-2 border-blue-500' : 'border border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </div>
                  )}
                  <div className="mb-5">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-gray-500 mt-2">{plan.description}</p>
                  </div>
                  <div className="mb-5">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.price !== "Personalizado" && <span className="text-gray-500">/mês</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.price === "Personalizado" ? "Fale Conosco" : "Começar Agora"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 