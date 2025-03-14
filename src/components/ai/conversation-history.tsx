import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface ConversationHistoryProps {
  conversations: {
    id: string;
    title: string;
    created_at: string;
    description?: string;
  }[];
  onSelect: (id: string) => void;
}

export function ConversationHistory({ conversations, onSelect }: ConversationHistoryProps) {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <Card key={conversation.id}>
          <CardHeader className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{conversation.title}</CardTitle>
                <CardDescription>
                  {conversation.description || 'Conversa com o assistente de IA'}
                </CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(conversation.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </CardHeader>
          <CardFooter className="p-4 pt-0">
            <Button variant="outline" size="sm" onClick={() => onSelect(conversation.id)}>
              Ver Conversa
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
