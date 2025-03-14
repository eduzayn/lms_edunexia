import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { analyticsService, StudentAnalytics } from "../../lib/services/analytics-service";
import { BarChart, LineChart, DoughnutChart, RadarChart } from "./chart-components";

interface StudentAnalyticsDashboardProps {
  studentId: string;
  initialData?: StudentAnalytics;
}

export function StudentAnalyticsDashboard({ studentId, initialData }: StudentAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = React.useState<StudentAnalytics | null>(initialData || null);
  const [loading, setLoading] = React.useState(!initialData);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!initialData) {
      const fetchAnalytics = async () => {
        try {
          setLoading(true);
          const data = await analyticsService.getStudentAnalytics(studentId);
          setAnalytics(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching student analytics:", err);
          setError("Falha ao carregar dados analíticos do aluno");
        } finally {
          setLoading(false);
        }
      };

      fetchAnalytics();
    }
  }, [studentId, initialData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md text-destructive">
        <p>{error}</p>
        <button
          className="mt-2 text-sm underline"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-muted p-4 rounded-md">
        <p>Nenhum dado analítico disponível para este aluno.</p>
      </div>
    );
  }

  // Format time spent
  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };

  // Prepare chart data
  const courseProgressData = {
    labels: analytics.courseProgress.map(c => c.title),
    datasets: [
      {
        label: "Progresso (%)",
        data: analytics.courseProgress.map(c => c.progress),
        backgroundColor: "rgba(37, 99, 235, 0.5)",
        borderColor: "rgb(37, 99, 235)",
        borderWidth: 1
      }
    ]
  };

  const assessmentPerformanceData = {
    labels: analytics.assessmentPerformance.map(a => a.title),
    datasets: [
      {
        label: "Nota",
        data: analytics.assessmentPerformance.map(a => a.score),
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1
      }
    ]
  };

  const courseCompletionData = {
    labels: ["Concluídos", "Em Andamento"],
    datasets: [
      {
        data: [analytics.completedCourses, analytics.enrolledCourses - analytics.completedCourses],
        backgroundColor: ["rgba(16, 185, 129, 0.5)", "rgba(245, 158, 11, 0.5)"],
        borderColor: ["rgb(16, 185, 129)", "rgb(245, 158, 11)"],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cursos Matriculados</CardTitle>
            <CardDescription>Total de cursos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.enrolledCourses}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {analytics.completedCourses} cursos concluídos
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nota Média</CardTitle>
            <CardDescription>Desempenho nas avaliações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.averageScore.toFixed(1)}</div>
            <Progress
              value={analytics.averageScore}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tempo Total</CardTitle>
            <CardDescription>Tempo dedicado aos cursos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatTimeSpent(analytics.totalTimeSpent)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Em todos os cursos
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pontos Fortes</CardTitle>
            <CardDescription>Áreas de destaque</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.strengths.length > 0 ? (
                analytics.strengths.map((strength, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50">
                    {strength}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">Nenhum ponto forte identificado ainda</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="courses">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="assessments">Avaliações</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Progresso nos Cursos</CardTitle>
                <CardDescription>
                  Progresso percentual em cada curso
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart data={courseProgressData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conclusão de Cursos</CardTitle>
                <CardDescription>
                  Cursos concluídos vs. em andamento
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <DoughnutChart data={courseCompletionData} />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalhes dos Cursos</CardTitle>
              <CardDescription>
                Progresso e desempenho por curso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium">
                  <div className="col-span-4">Curso</div>
                  <div className="col-span-3">Progresso</div>
                  <div className="col-span-2">Nota</div>
                  <div className="col-span-3">Última Atividade</div>
                </div>
                
                <div className="divide-y">
                  {analytics.courseProgress.map((course) => (
                    <div key={course.courseId} className="grid grid-cols-12 gap-4 p-4">
                      <div className="col-span-4 font-medium truncate">{course.title}</div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={course.progress}
                            className="h-2"
                          />
                          <span className="text-sm">{course.progress.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="col-span-2">{course.score.toFixed(1)}</div>
                      <div className="col-span-3 text-sm text-muted-foreground">
                        {new Date(course.lastActivity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho em Avaliações</CardTitle>
              <CardDescription>
                Notas obtidas em cada avaliação
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart data={assessmentPerformanceData} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Avaliações</CardTitle>
              <CardDescription>
                Detalhes das avaliações realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium">
                  <div className="col-span-5">Avaliação</div>
                  <div className="col-span-2">Nota</div>
                  <div className="col-span-3">Data de Conclusão</div>
                  <div className="col-span-2">Status</div>
                </div>
                
                <div className="divide-y">
                  {analytics.assessmentPerformance.map((assessment) => (
                    <div key={assessment.assessmentId} className="grid grid-cols-12 gap-4 p-4">
                      <div className="col-span-5 font-medium truncate">{assessment.title}</div>
                      <div className="col-span-2">{assessment.score.toFixed(1)}</div>
                      <div className="col-span-3 text-sm text-muted-foreground">
                        {new Date(assessment.completedAt).toLocaleString()}
                      </div>
                      <div className="col-span-2">
                        <Badge variant={assessment.score >= 70 ? "success" : "destructive"}>
                          {assessment.score >= 70 ? "Aprovado" : "Reprovado"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Pontos Fortes</CardTitle>
                <CardDescription>
                  Áreas em que você se destaca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.strengths.length > 0 ? (
                    analytics.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-green-50">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>{strength}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      Nenhum ponto forte identificado ainda
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Áreas para Melhorar</CardTitle>
                <CardDescription>
                  Áreas que precisam de mais atenção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.areasForImprovement.length > 0 ? (
                    analytics.areasForImprovement.map((area, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-red-50">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span>{area}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      Nenhuma área para melhorar identificada ainda
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Perfil de Habilidades</CardTitle>
              <CardDescription>
                Visão geral das suas habilidades
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <RadarChart
                data={{
                  labels: ["Participação", "Pontualidade", "Desempenho", "Engajamento", "Colaboração"],
                  datasets: [
                    {
                      label: "Suas Habilidades",
                      data: [85, 90, analytics.averageScore, 75, 80],
                      backgroundColor: "rgba(37, 99, 235, 0.2)",
                      borderColor: "rgb(37, 99, 235)",
                      borderWidth: 2
                    }
                  ]
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
