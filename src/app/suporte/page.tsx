'use client'

import { Button } from "@/components/ui/button"
import { Mail, MessageCircle, Phone } from "lucide-react"

const supportChannels = [
  {
    title: "Chat Online",
    description: "Converse em tempo real com nossa equipe de suporte",
    icon: MessageCircle,
    action: "Iniciar Chat",
  },
  {
    title: "Email",
    description: "Envie sua dúvida para nossa equipe",
    icon: Mail,
    action: "Enviar Email",
  },
  {
    title: "Telefone",
    description: "Fale diretamente com nosso time",
    icon: Phone,
    action: "Ligar Agora",
  },
]

const faqs = [
  {
    question: "Como posso começar a usar a plataforma?",
    answer: "Para começar, basta criar uma conta e escolher o plano que melhor atende às necessidades da sua instituição. Nossa equipe irá ajudar no processo de configuração inicial.",
  },
  {
    question: "Qual é o tempo de resposta do suporte?",
    answer: "Nosso tempo médio de resposta é de 2 horas para tickets normais e 30 minutos para clientes com suporte prioritário.",
  },
  {
    question: "Como funciona a tutoria com IA?",
    answer: "Nossa tutora virtual Prof. Ana utiliza inteligência artificial avançada para fornecer suporte personalizado aos alunos, respondendo dúvidas e auxiliando no processo de aprendizagem.",
  },
  {
    question: "É possível personalizar a plataforma?",
    answer: "Sim, oferecemos diferentes níveis de personalização dependendo do seu plano. No plano Enterprise, você tem acesso a customização total da plataforma.",
  },
]

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Suporte
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Estamos aqui para ajudar. Escolha o canal de atendimento que preferir.
                </p>
              </div>
            </div>

            {/* Canais de Suporte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {supportChannels.map((channel) => (
                <div
                  key={channel.title}
                  className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  <channel.icon className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{channel.title}</h3>
                  <p className="text-gray-500 text-center mb-6">
                    {channel.description}
                  </p>
                  <Button className="w-full">{channel.action}</Button>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div className="mt-24">
              <h2 className="text-2xl font-bold text-center mb-12">
                Perguntas Frequentes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="p-6 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 