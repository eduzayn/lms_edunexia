import * as React from "react";
import Link from "next/link";
import { Forum } from "../../lib/services/forum-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { MessageSquare, Users } from "lucide-react";

interface ForumListProps {
  forums: Forum[];
}

export function ForumList({ forums }: ForumListProps) {
  return (
    <div className="space-y-4">
      {forums.map(forum => (
        <Card key={forum.id}>
          <CardHeader className="pb-2">
            <Link href={`/forums/list/${forum.id}`}>
              <CardTitle className="text-xl hover:text-primary transition-colors">
                {forum.title}
              </CardTitle>
            </Link>
            <CardDescription>{forum.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{forum.post_count || 0} mensagens</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{forum.topic_count || 0} tópicos</span>
              </div>
              <div className="ml-auto">
                <Link
                  href={`/forums/list/${forum.id}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  Ver Fórum
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {forums.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium">Nenhum fórum encontrado</h3>
          <p>Não há fóruns disponíveis no momento.</p>
        </div>
      )}
    </div>
  );
}
