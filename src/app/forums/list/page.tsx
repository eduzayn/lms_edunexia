import * as React from "react";
import Link from "next/link";
import { ForumList } from "../../../components/forums/forum-list";
import { forumService } from "../../../lib/services/forum-service";

export default async function ForumsListPage() {
  // Fetch forums from the server
  const forums = await forumService.getForums();
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Fóruns de Discussão</h1>
          <p className="text-muted-foreground mt-1">
            Participe das discussões, tire dúvidas e compartilhe conhecimento
          </p>
        </div>
        
        <Link
          href="/forums/create"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Criar Tópico
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Fóruns Gerais</h2>
            <ForumList
              forums={forums.filter(forum => forum.is_global)}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Fóruns de Cursos</h2>
            <ForumList
              forums={forums.filter(forum => !forum.is_global)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
