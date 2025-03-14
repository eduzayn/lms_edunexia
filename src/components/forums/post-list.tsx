import * as React from "react";
import { Post } from "../../lib/services/forum-service";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ThumbsUp, MessageSquare, Check, Flag, MoreHorizontal } from "lucide-react";
import { PostEditor } from "./post-editor";
import { forumService } from "../../lib/services/forum-service";

interface PostListProps {
  posts: Post[];
  topicId: string;
  currentUserId: string;
  isInstructor: boolean;
  onReplyAdded?: () => void;
}

export function PostList({
  posts,
  topicId,
  currentUserId,
  isInstructor,
  onReplyAdded
}: PostListProps) {
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  
  const handleReply = async (postId: string, content: string) => {
    try {
      await forumService.createPost({
        topic_id: topicId,
        parent_id: postId,
        content,
        author_id: currentUserId
      });
      
      setReplyingTo(null);
      if (onReplyAdded) {
        onReplyAdded();
      }
    } catch (error) {
      console.error("Error replying to post:", error);
    }
  };
  
  const handleLike = async (postId: string) => {
    try {
      await forumService.likePost(postId);
      if (onReplyAdded) {
        onReplyAdded();
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  
  const handleMarkAsAnswer = async (postId: string) => {
    try {
      await forumService.markAsAnswer(postId, topicId);
      if (onReplyAdded) {
        onReplyAdded();
      }
    } catch (error) {
      console.error("Error marking post as answer:", error);
    }
  };
  
  const renderPost = (post: Post, isReply = false) => {
    const initials = post.author?.full_name
      ? post.author.full_name
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase()
      : 'U';
    
    const formattedDate = new Date(post.created_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return (
      <div
        key={post.id}
        className={`mb-4 ${isReply ? 'ml-12 mt-4' : ''} ${post.is_answer ? 'border-l-4 border-green-500 pl-4' : ''}`}
      >
        <Card className={post.is_answer ? 'bg-green-50' : ''}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author?.avatar_url} alt={post.author?.full_name || 'Usuário'} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{post.author?.full_name || 'Usuário'}</div>
                    <div className="text-xs text-muted-foreground">{formattedDate}</div>
                  </div>
                  
                  {post.is_answer && (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <Check className="h-4 w-4 mr-1" />
                      <span>Resposta Aceita</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                    onClick={() => handleLike(post.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{post.like_count || 0}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                    onClick={() => setReplyingTo(post.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>Responder</span>
                  </Button>
                  
                  {(isInstructor || currentUserId === post.author_id) && !post.is_answer && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground"
                      onClick={() => handleMarkAsAnswer(post.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      <span>Marcar como Resposta</span>
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground ml-auto"
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    <span>Reportar</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                {replyingTo === post.id && (
                  <div className="mt-4">
                    <PostEditor
                      placeholder="Escreva sua resposta..."
                      submitLabel="Responder"
                      onSubmit={(content) => handleReply(post.id, content)}
                      onCancel={() => setReplyingTo(null)}
                      isReply
                    />
                  </div>
                )}
                
                {post.replies && post.replies.length > 0 && (
                  <div className="mt-4">
                    {post.replies.map(reply => renderPost(reply, true))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {posts.map(post => renderPost(post))}
    </div>
  );
}
