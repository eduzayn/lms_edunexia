import React from "react";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem } from "./breadcrumb";

export function TeacherBreadcrumb() {
  const pathname = usePathname();
  
  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: "Início", href: "/" },
      { label: "Portal do Professor", href: "/teacher/dashboard" },
    ];
    
    if (pathname === "/teacher/dashboard") {
      return items;
    }
    
    if (pathname.startsWith("/teacher/courses")) {
      return [...items, { label: "Meus Cursos", href: "/teacher/courses" }];
    }
    
    if (pathname.startsWith("/teacher/students")) {
      return [...items, { label: "Meus Alunos", href: "/teacher/students" }];
    }
    
    if (pathname.startsWith("/teacher/content")) {
      return [...items, { label: "Conteúdo", href: "/teacher/content" }];
    }
    
    if (pathname.startsWith("/teacher/assessments")) {
      return [...items, { label: "Avaliações", href: "/teacher/assessments" }];
    }
    
    if (pathname.startsWith("/teacher/reports")) {
      return [...items, { label: "Relatórios", href: "/teacher/reports" }];
    }
    
    if (pathname.startsWith("/forums")) {
      const forumsItems = [...items, { label: "Fóruns", href: "/forums/list" }];
      
      if (pathname.includes("/topic/")) {
        return [...forumsItems, { label: "Tópico", href: pathname }];
      }
      
      if (pathname === "/forums/create") {
        return [...forumsItems, { label: "Criar Tópico", href: "/forums/create" }];
      }
      
      if (pathname.includes("/list/")) {
        return [...forumsItems, { label: "Lista de Tópicos", href: pathname }];
      }
      
      return forumsItems;
    }
    
    return items;
  };
  
  const breadcrumbItems = getBreadcrumbItems();
  
  return <Breadcrumb items={breadcrumbItems} />;
}
