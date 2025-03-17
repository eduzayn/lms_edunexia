import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Básico',
    price: 'R$ 4,90',
    period: 'por aluno/mês',
    description: 'Ideal para escolas pequenas iniciando na transformação digital',
    features: [
      'Até 500 alunos',
      'Ambiente Virtual de Aprendizagem',
      'Biblioteca de Conteúdo Digital',
      'Suporte por email',
      'Relatórios básicos',
      '5 módulos inclusos'
    ],
    highlighted: false
  },
  {
    name: 'Profissional',
    price: 'R$ 7,90',
    period: 'por aluno/mês',
    description: 'Perfeito para instituições em crescimento',
    features: [
      'Até 2000 alunos',
      'Todos os recursos do plano Básico',
      'Analytics avançado',
      'Integração com sistemas escolares',
      'Suporte prioritário',
      '12 módulos inclusos',
      'Personalização de marca',
      'App mobile personalizado'
    ],
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Consulte',
    period: 'preço personalizado',
    description: 'Para grandes instituições e redes de ensino',
    features: [
      'Alunos ilimitados',
      'Todos os recursos do plano Profissional',
      'API completa',
      'Suporte 24/7',
      'Módulos ilimitados',
      'Treinamento presencial',
      'Gestor de conta dedicado',
      'Infraestrutura dedicada'
    ],
    highlighted: false
  }
];

const PricingPage = () => {
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
            Planos que crescem com você
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Escolha o plano ideal para sua instituição e comece a transformar a educação hoje mesmo
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-white border-2 border-indigo-600 shadow-xl scale-105'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {plan.highlighted ? 'Começar agora' : 'Saiba mais'}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Precisa de um plano personalizado? {' '}
            <a href="/contato" className="text-indigo-600 font-medium hover:text-indigo-700">
              Entre em contato com nossa equipe
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;