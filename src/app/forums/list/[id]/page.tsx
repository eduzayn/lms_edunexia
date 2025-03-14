import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TopicList } from "../../../../components/forums/topic-list";
import { forumService } from "../../../../lib/services/forum-service";
import { Button } from "../../../../components/ui/button";

export default async function ForumPage({ params, searchParams }) {
  const forumId = params.id;
  const page = parseInt(searchParams.page || "1", 10);
  
  // Fetch forum details
  const forum = await forumService.getForum(forumId);
  
  if (!forum) {
    notFound();
  }
  
  // Fetch topics for this forum with pagination
  const { topics, total } = await forumService.getTopics(forumId, page, 10);
  
  // Calculate pagination
  const totalPages = Math.ceil(total / 10);
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Link
          href="/forums/list"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para Fóruns</span>
        </Link>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{forum.title}</h1>
          <p className="text-muted-foreground mt-1">{forum.description}</p>
        </div>
        
        <Link
          href={`/forums/create?forumId=${forumId}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Criar Tópico
        </Link>
      </div>
      
      <div className="space-y-6">
        <div className="bg-muted/30 p-4 rounded-md flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">{total}</span> tópicos neste fórum
          </div>
          
          <div className="flex items-center gap-2">
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              defaultValue="recent"
            >
              <option value="recent">Mais recentes</option>
              <option value="popular">Mais populares</option>
              <option value="unanswered">Sem resposta</option>
            </select>
          </div>
        </div>
        
        <TopicList topics={topics} forumId={forumId} />
        
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {page > 1 && (
              <Link href={`/forums/list/${forumId}?page=${page - 1}`}>
                <Button variant="outline" size="sm">Anterior</Button>
              </Link>
            )}
            
            <div className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </div>
            
            {page < totalPages && (
              <Link href={`/forums/list/${forumId}?page=${page + 1}`}>
                <Button variant="outline" size="sm">Próxima</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
