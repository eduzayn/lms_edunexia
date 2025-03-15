import React from "react";
import { Card } from "../../components/ui/card";

import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function DepoimentosPage() {
  const testimonials = [
    {
      id: 1,
      name: "Ana Silva",
      role: "Diretora Acadêmica",
      company: "Instituto Educacional Avançar",
      image: "/avatars/avatar-1.png",
      content: "A plataforma Edunexia transformou completamente nossa abordagem de ensino à distância. A integração com IA e o sistema financeiro são diferenciais que nos ajudaram a melhorar a experiência dos alunos e a gestão administrativa."
    },
    {
      id: 2,
      name: "Carlos Mendes",
      role: "Coordenador de EAD",
      company: "Faculdade Tecnológica do Brasil",
      image: "/avatars/avatar-2.png",
      content: "Implementamos o Edunexia há 6 meses e já vimos um aumento significativo na retenção de alunos. O tutor de IA é impressionante e os alunos adoram a assistência 24/7 que recebem."
    },
    {
      id: 3,
      name: "Patrícia Oliveira",
      role: "Gerente Financeira",
      company: "Grupo Educacional Futuro",
      image: "/avatars/avatar-3.png",
      content: "O módulo financeiro do Edunexia reduziu drasticamente nossa inadimplência. A automação de notificações e a facilidade para os alunos visualizarem suas pendências financeiras fizeram toda a diferença."
    },
    {
      id: 4,
      name: "Roberto Almeida",
      role: "Professor",
      company: "Universidade Digital",
      image: "/avatars/avatar-4.png",
      content: "Como professor, posso dizer que a plataforma é extremamente intuitiva. A criação de conteúdo com sugestões de IA e a análise de desempenho dos alunos me ajudam a melhorar constantemente minhas aulas."
    },
    {
      id: 5,
      name: "Fernanda Costa",
      role: "Diretora de Tecnologia",
      company: "Instituto de Ensino Superior",
      image: "/avatars/avatar-5.png",
      content: "A arquitetura modular do Edunexia nos permitiu implementar apenas os recursos que precisávamos inicialmente e expandir conforme nossa necessidade. A equipe de suporte é excepcional."
    },
    {
      id: 6,
      name: "Marcelo Santos",
      role: "Diretor Executivo",
      company: "Rede de Escolas Profissionalizantes",
      image: "/avatars/avatar-6.png",
      content: "Escolhemos o Edunexia após comparar várias soluções no mercado. O retorno sobre o investimento foi rápido e a satisfação dos alunos aumentou significativamente. Recomendo fortemente."
    }
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Depoimentos</h1>
        <p className="text-muted-foreground mb-8">
          Veja o que nossos clientes estão dizendo sobre a plataforma Edunexia LMS.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {/* Fallback avatar if image fails to load */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  {/* We're using a placeholder since actual images might not exist */}
                  {/* In a real implementation, you would use actual images */}
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm italic">&ldquo;{testimonial.content}&rdquo;</p>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Quer saber mais sobre como o Edunexia pode transformar sua instituição de ensino?
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/pricing">
              <Button>Ver Planos</Button>
            </Link>
            <Link href="/support">
              <Button variant="outline">Falar com Consultor</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
