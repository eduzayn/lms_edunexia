import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ContentViewerProps {
  title: string;
  content: string;
  type: 'text' | 'mindmap' | 'flashcards';
}

export function ContentViewer({ title, content, type }: ContentViewerProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === 'text' && (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{content}</div>
          </div>
        )}
        
        {type === 'mindmap' && (
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm text-muted-foreground mb-2">Mapa Mental</p>
            <div className="whitespace-pre-wrap">{content}</div>
          </div>
        )}
        
        {type === 'flashcards' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">Flashcards</p>
            {content.split('\n\n').map((card, index) => (
              <div key={index} className="border p-4 rounded-md">
                {card}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
