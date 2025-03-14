import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pin, Lock, Flag, MoreHorizontal } from "lucide-react";
import { PostList } from "../../../../components/forums/post-list";
import { PostEditor } from "../../../../components/forums/post-editor";
import { forumService } from "../../../../lib/services/forum-service";
import { Button } from "../../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Card, CardContent } from "../../../../components/ui/card";
import { getServerUser } from "../../../../lib/supabase/server";

export default async function TopicPage({ params }) {
  const topicId = params.id;
  
  // Get current user
  const user = await getServerUser();
  
  if (!user) {
    // Redirect to login if not authenticated
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="mb-4">Você precisa estar logado para acessar os fóruns de discussão.</p>
        <Link
          href="/auth/login?redirect=/forums/topic/${topicId}"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Fazer Login
        </Link>
      </div>
    );
  }
  
  // Fetch topic details
  const topic = await forumService.getTopic(topicId);
  
  if (!topic) {
    notFound();
  }
  
  // Fetch forum details
  const forum = await forumService.getForum(topic.forum_id);
  
  if (!forum) {
    notFound();
  }
  
  // Fetch posts for this topic
  const posts = await forumService.getPosts(topicId);
  
  // Format date
  const formattedDate = new Date(topic.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Get user initials
  const initials = topic.author?.full_name
    ? topic.author.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
    : 'U';
  
  // Check if user is instructor or admin (for permissions)
  const isInstructor = false; // This should be fetched from user profile
  
  const handleReply = async (content: string) => {
    'use server';
    
    if (!user) return;
    
    await forumService.createPost({
      topic_id: topicId,
      content,
      author_id: user.id
    });
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Link
          href={`/forums/list/${topic.forum_id}`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para {forum.title}</span>
        </Link>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={topic.author?.avatar_url} alt={topic.author?.full_name || 'Usuário'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{topic.title}</h1>
                
                {topic.is_pinned && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <Pin className="h-3 w-3 mr-1" />
                    <span>Fixado</span>
                  </div>
                )}
                
                {topic.is_locked && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    <Lock className="h-3 w-3 mr-1" />
                    <span>Bloqueado</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <span>Por {topic.author?.full_name || 'Usuário'}</span>
                <span className="mx-2">•</span>
                <span>{formattedDate}</span>
              </div>
              
              <div className="mt-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: topic.content }} />
              
              <div className="mt-6 flex items-center gap-2">
                {isInstructor && !topic.is_pinned && (
                  <Button variant="outline" size="sm">
                    <Pin className="h-4 w-4 mr-2" />
                    <span>Fixar Tópico</span>
                  </Button>
                )}
                
                {isInstructor && !topic.is_locked && (
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Bloquear Tópico</span>
                  </Button>
                )}
                
                <Button variant="outline" size="sm" className="ml-auto">
                  <Flag className="h-4 w-4 mr-2" />
                  <span>Reportar</span>
                </Button>
                
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        <PostList
          posts={posts}
          topicId={topicId}
          currentUserId={user.id}
          isInstructor={isInstructor}
        />
        
        {!topic.is_locked && (
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Sua Resposta</h2>
            <PostEditor
              placeholder="Escreva sua resposta..."
              submitLabel="Responder"
              onSubmit={handleReply}
            />
          </div>
        )}
        
        {topic.is_locked && (
          <div className="bg-muted p-4 rounded-md text-center">
            <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Este tópico está bloqueado e não aceita novas respostas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
