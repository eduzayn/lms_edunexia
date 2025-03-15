import React from "react";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem } from "./breadcrumb";

export function AdminBreadcrumb() {
  const pathname = usePathname();
  
  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: "Início", href: "/" },
      { label: "Portal Administrativo", href: "/admin/dashboard" },
    ];
    
    if (pathname === "/admin/dashboard") {
      return items;
    }
    
    if (pathname.startsWith("/admin/users")) {
      return [...items, { label: "Usuários", href: "/admin/users" }];
    }
    
    if (pathname.startsWith("/admin/courses")) {
      const coursesItems = [...items, { label: "Cursos", href: "/admin/courses/list" }];
      
      if (pathname === "/admin/courses/list") {
        return coursesItems;
      }
      
      if (pathname === "/admin/courses/editor") {
        return [...coursesItems, { label: "Editor de Curso", href: "/admin/courses/editor" }];
      }
      
      if (pathname === "/admin/courses/preview") {
        return [...coursesItems, { label: "Pré-visualização", href: "/admin/courses/preview" }];
      }
      
      return coursesItems;
    }
    
    if (pathname.startsWith("/admin/content")) {
      const contentItems = [...items, { label: "Conteúdo", href: "/admin/content/list" }];
      
      if (pathname === "/admin/content/list") {
        return contentItems;
      }
      
      if (pathname === "/admin/content/editor") {
        return [...contentItems, { label: "Editor de Conteúdo", href: "/admin/content/editor" }];
      }
      
      if (pathname.startsWith("/admin/content/video")) {
        const videoItems = [...contentItems, { label: "Vídeos", href: "/admin/content/video" }];
        
        if (pathname === "/admin/content/video/list") {
          return [...contentItems, { label: "Lista de Vídeos", href: "/admin/content/video/list" }];
        }
        
        return videoItems;
      }
      
      return contentItems;
    }
    
    if (pathname.startsWith("/admin/modules")) {
      return [...items, { label: "Módulos", href: "/admin/modules" }];
    }
    
    if (pathname.startsWith("/admin/financial")) {
      return [...items, { label: "Financeiro", href: "/admin/financial" }];
    }
    
    if (pathname.startsWith("/admin/reports")) {
      return [...items, { label: "Relatórios", href: "/admin/reports" }];
    }
    
    if (pathname.startsWith("/admin/analytics")) {
      return [...items, { label: "Analytics", href: "/admin/analytics/dashboard" }];
    }
    
    if (pathname.startsWith("/admin/assessments")) {
      const assessmentsItems = [...items, { label: "Avaliações", href: "/admin/assessments/list" }];
      
      if (pathname === "/admin/assessments/list") {
        return assessmentsItems;
      }
      
      if (pathname === "/admin/assessments/create") {
        return [...assessmentsItems, { label: "Criar Avaliação", href: "/admin/assessments/create" }];
      }
      
      return assessmentsItems;
    }
    
    if (pathname.startsWith("/admin/settings")) {
      return [...items, { label: "Configurações", href: "/admin/settings" }];
    }
    
    if (pathname.startsWith("/admin/activities")) {
      const activitiesItems = [...items, { label: "Atividades", href: "/admin/activities" }];
      
      if (pathname === "/admin/activities/feedback") {
        return [...activitiesItems, { label: "Feedback", href: "/admin/activities/feedback" }];
      }
      
      return activitiesItems;
    }
    
    if (pathname.startsWith("/admin/administrative-fees")) {
      return [...items, { label: "Taxas Administrativas", href: "/admin/administrative-fees" }];
    }
    
    return items;
  };
  
  const breadcrumbItems = getBreadcrumbItems();
  
  return <Breadcrumb items={breadcrumbItems} />;
}
