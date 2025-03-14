import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface UserStatsProps {
  questionsAnswered: number;
  materialsGenerated: number;
  timeSaved: number;
}

export function UserStats({ questionsAnswered, materialsGenerated, timeSaved }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Perguntas Respondidas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{questionsAnswered}</p>
          <p className="text-sm text-muted-foreground">Interações com o tutor de IA</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Materiais Gerados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{materialsGenerated}</p>
          <p className="text-sm text-muted-foreground">Resumos, mapas mentais e mais</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tempo Economizado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{timeSaved} min</p>
          <p className="text-sm text-muted-foreground">Estimativa de tempo poupado</p>
        </CardContent>
      </Card>
    </div>
  );
}
