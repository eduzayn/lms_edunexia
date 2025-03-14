import * as React from "react";
import Link from "next/link";
import { Topic } from "../../lib/services/forum-service";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessageSquare, Eye, Pin, Lock } from "lucide-react";

interface TopicListProps {
  topics: Topic[];
  forumId: string;
}

export function TopicList({ topics, forumId }: TopicListProps) {
  return (
    <div className="space-y-4">
      {topics.map(topic => {
        const initials = topic.author?.full_name
          ? topic.author.full_name
              .split(' ')
              .map(name => name[0])
              .join('')
              .toUpperCase()
          : 'U';
        
        const formattedDate = new Date(topic.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        const lastPostDate = topic.last_post
          ? new Date(topic.last_post.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : null;
        
        return (
          <Card key={topic.id} className={topic.is_pinned ? 'border-primary/30 bg-primary/5' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={topic.author?.avatar_url} alt={topic.author?.full_name || 'Usuário'} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {topic.is_pinned && (
                      <Pin className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                    
                    {topic.is_locked && (
                      <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    
                    <Link
                      href={`/forums/topic/${topic.id}`}
                      className="font-medium text-lg hover:text-primary truncate"
                    >
                      {topic.title}
                    </Link>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <span>Por {topic.author?.full_name || 'Usuário'}</span>
                    <span className="mx-2">•</span>
                    <span>{formattedDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{topic.reply_count}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{topic.view_count}</span>
                    </div>
                  </div>
                </div>
                
                {topic.last_post && (
                  <div className="hidden md:block text-right text-sm flex-shrink-0">
                    <div className="text-muted-foreground">Última resposta</div>
                    <div>{topic.last_post.author_name}</div>
                    <div className="text-xs text-muted-foreground">{lastPostDate}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {topics.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium">Nenhum tópico encontrado</h3>
          <p className="mt-1">Seja o primeiro a criar um tópico neste fórum!</p>
          <div className="mt-4">
            <Link
              href={`/forums/create?forumId=${forumId}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Criar Tópico
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
