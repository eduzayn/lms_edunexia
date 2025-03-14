import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ThumbsUp, ThumbsDown, Award, AlertTriangle } from "lucide-react";

interface FeedbackDisplayProps {
  feedback: {
    feedback: string;
    score?: number;
    strengths: string[];
    improvements: string[];
    created_at?: string;
  };
  compact?: boolean;
}

export function FeedbackDisplay({ feedback, compact = false }: FeedbackDisplayProps) {
  const formattedDate = feedback.created_at 
    ? new Date(feedback.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Feedback da Prof. Ana</CardTitle>
            {feedback.score !== undefined && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <Award className="h-4 w-4" />
                <span>{feedback.score}/10</span>
              </div>
            )}
          </div>
          {formattedDate && (
            <CardDescription>{formattedDate}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <ThumbsUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Pontos fortes</p>
                <ul className="mt-1 space-y-1">
                  {feedback.strengths.slice(0, 2).map((strength, index) => (
                    <li key={index} className="text-sm">{strength}</li>
                  ))}
                  {feedback.strengths.length > 2 && (
                    <li className="text-sm text-muted-foreground">
                      +{feedback.strengths.length - 2} outros pontos
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Áreas para melhoria</p>
                <ul className="mt-1 space-y-1">
                  {feedback.improvements.slice(0, 2).map((improvement, index) => (
                    <li key={index} className="text-sm">{improvement}</li>
                  ))}
                  {feedback.improvements.length > 2 && (
                    <li className="text-sm text-muted-foreground">
                      +{feedback.improvements.length - 2} outras sugestões
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Ver feedback completo
          </button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Feedback da Prof. Ana</CardTitle>
          {feedback.score !== undefined && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
              <Award className="h-5 w-5" />
              <span>{feedback.score}/10</span>
            </div>
          )}
        </div>
        {formattedDate && (
          <CardDescription>{formattedDate}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{feedback.feedback}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">Pontos fortes</h3>
              </div>
              <ul className="space-y-2 pl-6 list-disc">
                {feedback.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="font-medium">Áreas para melhoria</h3>
              </div>
              <ul className="space-y-2 pl-6 list-disc">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
