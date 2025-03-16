import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Diretora Acadêmica",
    institution: "Colégio Inovação",
    content: "A EdunexIA revolucionou nossa forma de ensinar. A tutoria com IA tem sido fundamental para o desenvolvimento personalizado dos nossos alunos. Em apenas 6 meses, vimos uma melhoria significativa no engajamento e resultados.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=1"
  },
  {
    name: "João Santos",
    role: "Professor de Matemática",
    institution: "Instituto Educacional Futuro",
    content: "Como professor, posso dizer que a plataforma tornou meu trabalho muito mais eficiente. O sistema de gestão de conteúdo é intuitivo e a análise de desempenho dos alunos me ajuda a identificar pontos de melhoria rapidamente.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=2"
  },
  {
    name: "Ana Oliveira",
    role: "Coordenadora Pedagógica",
    institution: "Escola Novos Caminhos",
    content: "A integração da IA no processo de aprendizagem é impressionante. Os alunos recebem suporte 24/7 e os relatórios detalhados nos permitem tomar decisões baseadas em dados reais.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=3"
  },
  {
    name: "Carlos Mendes",
    role: "Diretor Financeiro",
    institution: "Centro Educacional Progresso",
    content: "O módulo financeiro da EdunexIA nos ajudou a reduzir a inadimplência em 40%. A gestão de mensalidades e pagamentos ficou muito mais simples e transparente.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=4"
  }
];

export default function DepoimentosPage() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            O que dizem sobre a EdunexIA
          </h1>
          <p className="text-lg text-gray-600">
            Conheça as experiências de instituições que já transformaram sua gestão educacional com nossa plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-primary">{testimonial.institution}</p>
                </div>
              </div>
              
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>

              <p className="text-gray-600">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
