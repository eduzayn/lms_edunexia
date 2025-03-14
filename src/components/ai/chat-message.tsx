import * as React from "react";

interface ChatMessageProps {
  role: 'assistant' | 'user';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === 'assistant';
  
  return (
    <div className={`flex items-start gap-3 ${!isAssistant ? 'justify-end' : ''}`}>
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
          A
        </div>
      )}
      
      <div className={`${isAssistant ? 'bg-primary/10' : 'bg-secondary/10'} rounded-lg p-3 max-w-[80%]`}>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      
      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
          E
        </div>
      )}
    </div>
  );
}
