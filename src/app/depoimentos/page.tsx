"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    role: "Diretora Acadêmica",
    institution: "Colégio Inovação",
    image: "/avatars/maria-silva.jpg",
    rating: 5,
    content: "A EdunexIA revolucionou nossa forma de ensinar. A tutoria com IA tem sido fundamental para o desenvolvimento personalizado dos nossos alunos. Em apenas 6 meses, vimos uma melhoria significativa no engajamento e resultados."
  },
  {
    id: 2,
    name: "João Santos",
    role: "Professor de Matemática",
    institution: "Instituto Educacional Futuro",
    image: "/avatars/joao-santos.jpg",
    rating: 5,
    content: "Como professor, posso dizer que a plataforma tornou meu trabalho muito mais eficiente. O sistema de gestão de conteúdo é intuitivo e a análise de desempenho dos alunos me ajuda a identificar pontos de melhoria rapidamente."
  },
  {
    id: 3,
    name: "Ana Oliveira",
    role: "Coordenadora Pedagógica",
    institution: "Escola Novos Caminhos",
    image: "/avatars/ana-oliveira.jpg",
    rating: 5,
    content: "A integração da IA no processo de aprendizagem é impressionante. Os alunos recebem suporte 24/7 e os relatórios detalhados nos permitem tomar decisões baseadas em dados reais."
  },
  {
    id: 4,
    name: "Carlos Mendes",
    role: "Diretor Financeiro",
    institution: "Centro Educacional Progresso",
    image: "/avatars/carlos-mendes.jpg",
    rating: 5,
    content: "O módulo financeiro da EdunexIA nos ajudou a reduzir a inadimplência em 40%. A gestão de mensalidades e pagamentos ficou muito mais simples e transparente."
  }
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">O que dizem sobre a EdunexIA</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Conheça as experiências de instituições que já transformaram sua gestão educacional com nossa plataforma.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      <p className="text-blue-600 text-sm">{testimonial.institution}</p>
                    </div>
                  </div>
                  <div className="flex mb-4" aria-label={`Avaliação: ${testimonial.rating} de 5 estrelas`}>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
