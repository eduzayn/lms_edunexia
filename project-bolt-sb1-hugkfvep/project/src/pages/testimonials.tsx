import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Maria Silva',
    role: 'Diretora Acadêmica',
    institution: 'Colégio Inovação',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop',
    content: 'A EdunexIA transformou completamente nossa gestão acadêmica. O sistema adaptativo de aprendizagem tem mostrado resultados impressionantes no desempenho dos alunos.',
    rating: 5
  },
  {
    name: 'João Santos',
    role: 'Coordenador de EAD',
    institution: 'Faculdade Futuro',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop',
    content: 'A plataforma oferece recursos excepcionais para ensino híbrido. Conseguimos aumentar nossa taxa de engajamento em 60% desde a implementação.',
    rating: 5
  },
  {
    name: 'Ana Oliveira',
    role: 'Professora de Matemática',
    institution: 'Instituto Educacional Progresso',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop',
    content: 'Os recursos de analytics me ajudam a identificar rapidamente onde os alunos precisam de mais suporte. É como ter um assistente pedagógico 24/7.',
    rating: 5
  },
  {
    name: 'Carlos Mendes',
    role: 'Diretor de Tecnologia',
    institution: 'Rede de Ensino Evolução',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop',
    content: 'A integração foi surpreendentemente fácil e o suporte técnico é excepcional. Em 3 meses, já estávamos com 100% das nossas unidades utilizando o sistema.',
    rating: 5
  },
  {
    name: 'Patricia Lima',
    role: 'Coordenadora Pedagógica',
    institution: 'Escola Novos Caminhos',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=150&h=150&auto=format&fit=crop',
    content: 'O acompanhamento personalizado que conseguimos oferecer aos alunos através da plataforma é incomparável. Os pais adoram os relatórios detalhados.',
    rating: 5
  },
  {
    name: 'Roberto Almeida',
    role: 'Gestor Administrativo',
    institution: 'Centro Educacional Excelência',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=150&h=150&auto=format&fit=crop',
    content: 'A automatização dos processos administrativos nos economiza horas de trabalho. O retorno sobre o investimento foi muito além das expectativas.',
    rating: 5
  }
];

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            O que dizem nossos clientes
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Histórias reais de instituições que transformaram sua forma de ensinar com a EdunexIA
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-indigo-600">{testimonial.institution}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;