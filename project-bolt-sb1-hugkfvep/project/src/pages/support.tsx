import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown, 
  BookOpen,
  Video,
  FileText,
  HelpCircle
} from 'lucide-react';

const faqs = [
  {
    question: 'Como faço para resetar a senha dos meus alunos?',
    answer: 'Como administrador, acesse o painel de gestão, selecione o aluno desejado e clique em "Resetar Senha". Um email será enviado automaticamente para o aluno com as instruções de redefinição.'
  },
  {
    question: 'É possível personalizar o ambiente virtual com as cores da minha instituição?',
    answer: 'Sim! No plano Profissional ou superior, você tem acesso ao módulo de personalização de marca, onde pode configurar cores, logos e outros elementos visuais para manter a identidade da sua instituição.'
  },
  {
    question: 'Como exporto os relatórios de desempenho dos alunos?',
    answer: 'Na seção de Analytics, você encontra diversos tipos de relatórios. Selecione o relatório desejado, configure os filtros e clique em "Exportar". Os dados podem ser baixados em formato PDF, Excel ou CSV.'
  },
  {
    question: 'Qual o limite de armazenamento para materiais didáticos?',
    answer: 'O plano Básico oferece 50GB de armazenamento, o Profissional 200GB e o Enterprise possui armazenamento ilimitado. Todos os arquivos são armazenados com backup automático em nuvem.'
  },
  {
    question: 'Como integro o sistema com outros softwares educacionais?',
    answer: 'A EdunexIA oferece APIs REST e webhooks para integração com outros sistemas. Nossa documentação técnica detalha todos os endpoints disponíveis e exemplos de implementação.'
  }
];

const resources = [
  {
    title: 'Central de Tutoriais',
    description: 'Vídeos e guias passo a passo para todas as funcionalidades',
    icon: Video,
    link: '/tutoriais'
  },
  {
    title: 'Documentação',
    description: 'Documentação técnica completa da plataforma',
    icon: FileText,
    link: '/documentacao'
  },
  {
    title: 'Base de Conhecimento',
    description: 'Artigos e soluções para dúvidas comuns',
    icon: BookOpen,
    link: '/conhecimento'
  },
  {
    title: 'Comunidade',
    description: 'Fórum de discussão com outros usuários',
    icon: HelpCircle,
    link: '/comunidade'
  }
];

const FAQ = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
};

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Como podemos ajudar?
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Estamos aqui para garantir que você aproveite ao máximo a EdunexIA
          </motion.p>
        </div>

        {/* Canais de Atendimento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MessageSquare className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chat Online</h3>
            <p className="text-gray-600 mb-4">Atendimento instantâneo para dúvidas rápidas</p>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>Disponível 24/7</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Phone className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Suporte por Telefone</h3>
            <p className="text-gray-600 mb-4">Atendimento personalizado para questões complexas</p>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>Seg-Sex, 8h às 18h</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Mail className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 mb-4">Para solicitações detalhadas e documentadas</p>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>Resposta em até 24h</span>
            </div>
          </motion.div>
        </div>

        {/* Recursos de Ajuda */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Recursos de Ajuda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.a
                key={resource.title}
                href={resource.link}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <resource.icon className="w-8 h-8 text-indigo-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600">{resource.description}</p>
              </motion.a>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Perguntas Frequentes</h2>
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {faqs.map((faq) => (
              <FAQ key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Não encontrou o que procurava? {' '}
            <button className="text-indigo-600 font-medium hover:text-indigo-700">
              Fale com um especialista
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;