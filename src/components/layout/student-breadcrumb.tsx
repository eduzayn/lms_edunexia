"use client"
import React from "react";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem } from "./breadcrumb";

export function StudentBreadcrumb() {
  const pathname = usePathname();
  
  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: "Início", href: "/" },
      { label: "Portal do Aluno", href: "/student/dashboard" },
    ];
    
    if (pathname === "/student/dashboard") {
      return items;
    }
    
    if (pathname.startsWith("/student/courses")) {
      return [...items, { label: "Meus Cursos", href: "/student/courses" }];
    }
    
    if (pathname.startsWith("/student/progress")) {
      return [...items, { label: "Meu Progresso", href: "/student/progress" }];
    }
    
    if (pathname.startsWith("/student/financial")) {
      const financialItems = [...items, { label: "Financeiro", href: "/student/financial" }];
      
      if (pathname === "/student/financial/invoices") {
        return [...financialItems, { label: "Faturas", href: "/student/financial/invoices" }];
      }
      
      if (pathname === "/student/financial/payment-methods") {
        return [...financialItems, { label: "Métodos de Pagamento", href: "/student/financial/payment-methods" }];
      }
      
      if (pathname === "/student/financial/debt-negotiation") {
        return [...financialItems, { label: "Negociação de Dívidas", href: "/student/financial/debt-negotiation" }];
      }
      
      if (pathname.startsWith("/student/financial/administrative-fees")) {
        const adminFeesItems = [...financialItems, { label: "Taxas Administrativas", href: "/student/financial/administrative-fees" }];
        
        if (pathname === "/student/financial/administrative-fees/request") {
          return [...adminFeesItems, { label: "Solicitar", href: "/student/financial/administrative-fees/request" }];
        }
        
        if (pathname === "/student/financial/administrative-fees/payment") {
          return [...adminFeesItems, { label: "Pagamento", href: "/student/financial/administrative-fees/payment" }];
        }
        
        return adminFeesItems;
      }
      
      return financialItems;
    }
    
    if (pathname.startsWith("/student/certificates")) {
      return [...items, { label: "Certificados", href: "/student/certificates" }];
    }
    
    if (pathname.startsWith("/student/ai-tutor")) {
      return [...items, { label: "Tutor IA", href: "/student/ai-tutor" }];
    }
    
    if (pathname.startsWith("/student/activities")) {
      const activitiesItems = [...items, { label: "Atividades", href: "/student/activities" }];
      
      if (pathname.includes("/feedback/")) {
        return [...activitiesItems, { label: "Feedback", href: pathname }];
      }
      
      if (pathname.includes("/submit")) {
        return [...activitiesItems, { label: "Enviar Atividade", href: pathname }];
      }
      
      return activitiesItems;
    }
    
    if (pathname.startsWith("/student/assessments")) {
      const assessmentsItems = [...items, { label: "Avaliações", href: "/student/assessments/list" }];
      
      if (pathname.includes("/take/")) {
        return [...assessmentsItems, { label: "Realizar Avaliação", href: pathname }];
      }
      
      return assessmentsItems;
    }
    
    return items;
  };
  
  const breadcrumbItems = getBreadcrumbItems();
  
  return <Breadcrumb items={breadcrumbItems} />;
}
