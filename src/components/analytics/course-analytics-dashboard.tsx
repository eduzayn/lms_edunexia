import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { analyticsService, CourseAnalytics } from "../../lib/services/analytics-service";
import { BarChart, LineChart, PieChart } from "./chart-components";

interface CourseAnalyticsDashboardProps {
  courseId: string;
  initialData?: CourseAnalytics;
}

export function CourseAnalyticsDashboard({ courseId, initialData }: CourseAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = React.useState<CourseAnalytics | null>(initialData || null);
  const [loading, setLoading] = React.useState(!initialData);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!initialData) {
      const fetchAnalytics = async () => {
        try {
          setLoading(true);
          const data = await analyticsService.getCourseAnalytics(courseId);
          setAnalytics(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching course analytics:", err);
          setError("Falha ao carregar dados analíticos do curso");
        } finally {
          setLoading(false);
        }
      };

      fetchAnalytics();
    }
  }, [courseId, initialData]);

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
        <p>Nenhum dado analítico disponível para este curso.</p>
      </div>
    );
  }

  // Prepare chart data
  const moduleCompletionData = {
    labels: analytics.moduleCompletion.map(m => m.title),
    datasets: [
      {
        label: "Taxa de Conclusão (%)",
        data: analytics.moduleCompletion.map(m => m.completionRate),
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
        label: "Nota Média",
        data: analytics.assessmentPerformance.map(a => a.averageScore),
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1
      },
      {
        label: "Taxa de Conclusão (%)",
        data: analytics.assessmentPerformance.map(a => a.completionRate),
        backgroundColor: "rgba(245, 158, 11, 0.5)",
        borderColor: "rgb(245, 158, 11)",
        borderWidth: 1
      }
    ]
  };

  const studentActivityData = {
    labels: ["Ativos", "Inativos"],
    datasets: [
      {
        data: [analytics.activeStudents, analytics.totalStudents - analytics.activeStudents],
        backgroundColor: ["rgba(16, 185, 129, 0.5)", "rgba(239, 68, 68, 0.5)"],
        borderColor: ["rgb(16, 185, 129)", "rgb(239, 68, 68)"],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Alunos Matriculados</CardTitle>
            <CardDescription>Total de alunos no curso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalStudents}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {analytics.activeStudents} alunos ativos nos últimos 7 dias
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taxa de Conclusão</CardTitle>
            <CardDescription>Progresso médio dos alunos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.completionRate.toFixed(1)}%</div>
            <Progress
              value={analytics.completionRate}
              className="h-2 mt-2"
            />
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
      </div>
      
      <Tabs defaultValue="modules">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="assessments">Avaliações</TabsTrigger>
          <TabsTrigger value="students">Alunos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conclusão de Módulos</CardTitle>
              <CardDescription>
                Taxa de conclusão por módulo do curso
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart data={moduleCompletionData} />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.moduleCompletion.map((module) => (
              <Card key={module.moduleId}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{module.completionRate.toFixed(1)}%</div>
                  <Progress
                    value={module.completionRate}
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho em Avaliações</CardTitle>
              <CardDescription>
                Notas médias e taxas de conclusão por avaliação
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart data={assessmentPerformanceData} />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.assessmentPerformance.map((assessment) => (
              <Card key={assessment.assessmentId}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{assessment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Nota Média</div>
                      <div className="text-xl font-bold">{assessment.averageScore.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Conclusão</div>
                      <div className="text-xl font-bold">{assessment.completionRate.toFixed(1)}%</div>
                    </div>
                  </div>
                  <Progress
                    value={assessment.averageScore}
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Atividade dos Alunos</CardTitle>
                <CardDescription>
                  Alunos ativos vs. inativos nos últimos 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart data={studentActivityData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Progresso dos Alunos</CardTitle>
                <CardDescription>
                  Distribuição do progresso dos alunos no curso
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <LineChart
                  data={{
                    labels: analytics.studentProgress.map((_, i) => `Aluno ${i + 1}`),
                    datasets: [
                      {
                        label: "Progresso (%)",
                        data: analytics.studentProgress.map(s => s.progress),
                        borderColor: "rgb(37, 99, 235)",
                        backgroundColor: "rgba(37, 99, 235, 0.1)",
                        tension: 0.4,
                        fill: true
                      }
                    ]
                  }}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalhes dos Alunos</CardTitle>
              <CardDescription>
                Progresso individual e última atividade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium">
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">ID do Aluno</div>
                  <div className="col-span-4">Progresso</div>
                  <div className="col-span-4">Última Atividade</div>
                </div>
                
                <div className="divide-y">
                  {analytics.studentProgress.map((student, index) => (
                    <div key={student.studentId} className="grid grid-cols-12 gap-4 p-4">
                      <div className="col-span-1">{index + 1}</div>
                      <div className="col-span-3 truncate">{student.studentId}</div>
                      <div className="col-span-4">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={student.progress}
                            className="h-2"
                          />
                          <span className="text-sm">{student.progress.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="col-span-4 text-sm text-muted-foreground">
                        {new Date(student.lastActivity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
