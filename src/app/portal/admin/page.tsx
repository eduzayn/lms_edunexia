"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  BookOpen,
  Settings,
  CreditCard,
  FileText,
  Bell,
  HelpCircle,
} from "lucide-react";

export default function AdminPortalPage() {
  const menuItems = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="w-6 h-6" />,
      description: "Visualize métricas e relatórios importantes",
    },
    {
      title: "Usuários",
      icon: <Users className="w-6 h-6" />,
      description: "Gerencie alunos, professores e administradores",
    },
    {
      title: "Cursos",
      icon: <BookOpen className="w-6 h-6" />,
      description: "Administre cursos e conteúdos",
    },
    {
      title: "Financeiro",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Controle pagamentos e mensalidades",
    },
    {
      title: "Relatórios",
      icon: <FileText className="w-6 h-6" />,
      description: "Acesse relatórios detalhados",
    },
    {
      title: "Notificações",
      icon: <Bell className="w-6 h-6" />,
      description: "Gerencie comunicações do sistema",
    },
    {
      title: "Configurações",
      icon: <Settings className="w-6 h-6" />,
      description: "Configure parâmetros do sistema",
    },
    {
      title: "Suporte",
      icon: <HelpCircle className="w-6 h-6" />,
      description: "Acesse recursos de ajuda",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <motion.h1 
            className="text-2xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Portal Administrativo
          </motion.h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    {item.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <Button variant="ghost" className="w-full">
                    Acessar
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
} 