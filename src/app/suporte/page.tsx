import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  BookOpen,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageCircle,
  Phone,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Suporte | EdunexIA LMS',
  description: 'Central de ajuda e suporte para usuários da plataforma.',
}

const supportChannels = [
  {
    title: 'Chat Online',
    description: 'Converse em tempo real com nossa equipe de suporte',
    icon: MessageCircle,
    action: 'Iniciar chat',
    href: '#chat',
  },
  {
    title: 'Email',
    description: 'Envie sua dúvida para nossa equipe técnica',
    icon: Mail,
    action: 'Enviar email',
    href: 'mailto:suporte@edunexia.com',
  },
  {
    title: 'Telefone',
    description: 'Fale diretamente com um de nossos especialistas',
    icon: Phone,
    action: 'Ligar agora',
    href: 'tel:0800123456',
  },
]

const helpResources = [
  {
    title: 'Base de Conhecimento',
    description: 'Artigos e tutoriais detalhados sobre a plataforma',
    icon: BookOpen,
    action: 'Acessar artigos',
    href: '/docs',
  },
  {
    title: 'FAQ',
    description: 'Respostas para as dúvidas mais frequentes',
    icon: HelpCircle,
    action: 'Ver perguntas',
    href: '/faq',
  },
  {
    title: 'Treinamentos',
    description: 'Vídeos e cursos sobre como usar a plataforma',
    icon: LifeBuoy,
    action: 'Ver treinamentos',
    href: '/training',
  },
]

const faqItems = [
  {
    question: 'Como faço para criar meu primeiro curso?',
    answer:
      'Para criar seu primeiro curso, acesse o painel do professor, clique em "Novo Curso" e siga o assistente de criação. Você poderá adicionar conteúdo, atividades e configurar as opções do curso.',
  },
  {
    question: 'Como adicionar alunos ao curso?',
    answer:
      'Existem várias formas de adicionar alunos: importação em massa via CSV, convite por email ou código de acesso. Na seção "Alunos" do seu curso, escolha a opção que melhor atende sua necessidade.',
  },
  {
    question: 'Como funciona a tutoria com IA?',
    answer:
      'Nossa tutoria com IA utiliza algoritmos avançados para identificar dificuldades dos alunos e oferecer suporte personalizado. O sistema aprende com as interações e adapta o conteúdo para cada aluno.',
  },
  {
    question: 'Como emitir certificados para os alunos?',
    answer:
      'Os certificados são emitidos automaticamente quando o aluno completa todos os requisitos do curso. Você pode personalizar o modelo de certificado nas configurações do curso.',
  },
  {
    question: 'Como acompanhar o progresso dos alunos?',
    answer:
      'No painel de analytics, você encontra relatórios detalhados sobre o progresso, engajamento e desempenho dos alunos. É possível filtrar por turma, período e exportar os dados.',
  },
]

export default function SupportPage() {
  return (
    <div className="container py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Como podemos ajudar?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Escolha o canal de atendimento mais adequado para você
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {supportChannels.map((channel) => (
          <Card key={channel.title}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <channel.icon className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{channel.title}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href={channel.href}>{channel.action}</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-center text-2xl font-semibold">
          Recursos de ajuda
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {helpResources.map((resource) => (
            <Card key={resource.title}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <resource.icon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <a href={resource.href}>{resource.action}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-center text-2xl font-semibold">
          Perguntas frequentes
        </h2>
        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold">
          Ainda precisa de ajuda?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Nossa equipe está disponível 24/7 para ajudar você.
        </p>
        <Button className="mt-8" size="lg">
          Falar com especialista
        </Button>
      </div>
    </div>
  )
} 