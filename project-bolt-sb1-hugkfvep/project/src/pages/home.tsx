import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, TrendingUp, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Conteúdo Personalizado',
    description: 'Material didático adaptado ao ritmo e estilo de aprendizagem de cada aluno.'
  },
  {
    icon: Users,
    title: 'Colaboração em Tempo Real',
    description: 'Ferramentas para interação entre alunos e professores, promovendo aprendizado colaborativo.'
  },
  {
    icon: Award,
    title: 'Certificação Reconhecida',
    description: 'Certificados digitais validados e reconhecidos pelo mercado.'
  },
  {
    icon: TrendingUp,
    title: 'Analytics Avançado',
    description: 'Acompanhamento detalhado do progresso e desempenho dos alunos.'
  },
  {
    icon: Zap,
    title: 'Aprendizado Adaptativo',
    description: 'Sistema inteligente que se adapta às necessidades individuais.'
  },
  {
    icon: Shield,
    title: 'Segurança Garantida',
    description: 'Proteção de dados e privacidade em conformidade com a LGPD.'
  }
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Transforme a Educação com 
              <span className="text-indigo-600"> Inteligência Artificial</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Plataforma completa de ensino que combina tecnologia avançada com métodos pedagógicos inovadores para uma experiência de aprendizado única.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a 
                href="/registro" 
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Começar Agora
              </a>
              <a 
                href="/depoimentos" 
                className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                Ver Depoimentos
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recursos que Transformam o Aprendizado
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma oferece ferramentas poderosas para instituições de ensino, professores e alunos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;