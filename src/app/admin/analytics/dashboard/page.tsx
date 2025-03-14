import * as React from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, DoughnutChart } from "@/components/analytics/chart-components";
import { analyticsService } from "@/lib/services/analytics-service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AnalyticsDashboardPage() {
  const supabase = createServerSupabaseClient();
  
  // Check if user is admin or instructor
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/login?redirect=/admin/analytics/dashboard");
  }
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();
  
  if (!profile || !["admin", "instructor"].includes(profile.role)) {
    redirect("/");
  }
  
  // Fetch platform analytics
  const platformAnalytics = await analyticsService.getPlatformAnalytics();
  
  // Prepare chart data
  const userGrowthData = {
    labels: (platformAnalytics.userGrowth as any[] || []).map((item: { month: string }) => item.month),
    datasets: [
      {
        label: "Novos Usuários",
        data: (platformAnalytics.userGrowth as any[] || []).map((item: { count: number }) => item.count),
        backgroundColor: "rgba(37, 99, 235, 0.5)",
        borderColor: "rgb(37, 99, 235)",
        borderWidth: 1
      }
    ]
  };
  
  const userDistributionData = {
    labels: ["Ativos", "Inativos"],
    datasets: [
      {
        data: [(platformAnalytics.activeUsers as number) || 0, (platformAnalytics.totalUsers as number || 0) - (platformAnalytics.activeUsers as number || 0)],
        backgroundColor: ["rgba(16, 185, 129, 0.5)", "rgba(239, 68, 68, 0.5)"],
        borderColor: ["rgb(16, 185, 129)", "rgb(239, 68, 68)"],
        borderWidth: 1
      }
    ]
  };
  
  // Fetch courses for the course analytics section
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .order("created_at", { ascending: false })
    .limit(5);
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Painel de Analytics</h1>
        <p className="text-muted-foreground">
          Visão geral do desempenho da plataforma e dos alunos
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Usuários</CardTitle>
            <CardDescription>Total de usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platformAnalytics.totalUsers as number || 0}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {platformAnalytics.activeUsers as number || 0} usuários ativos nos últimos 30 dias
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cursos</CardTitle>
            <CardDescription>Total de cursos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platformAnalytics.totalCourses as number || 0}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {platformAnalytics.totalEnrollments as number || 0} matrículas
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conteúdo</CardTitle>
            <CardDescription>Total de itens de conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platformAnalytics.totalContentItems as number || 0}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Em todos os cursos
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avaliações</CardTitle>
            <CardDescription>Total de avaliações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platformAnalytics.totalAssessments as number || 0}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {platformAnalytics.totalSubmissions as number || 0} submissões
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Usuários</CardTitle>
                <CardDescription>
                  Novos usuários nos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <LineChart data={userGrowthData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Usuários</CardTitle>
                <CardDescription>
                  Usuários ativos vs. inativos
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <DoughnutChart data={userDistributionData} />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Métricas Principais</CardTitle>
              <CardDescription>
                Indicadores de desempenho da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-md">
                  <div className="text-sm text-muted-foreground">Taxa de Usuários Ativos</div>
                  <div className="text-2xl font-bold mt-1">{((platformAnalytics.activeUserRate as number) || 0).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Percentual de usuários ativos nos últimos 30 dias
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="text-sm text-muted-foreground">Matrículas por Curso</div>
                  <div className="text-2xl font-bold mt-1">{((platformAnalytics.enrollmentsPerCourse as number) || 0).toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Média de matrículas por curso
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="text-sm text-muted-foreground">Submissões por Avaliação</div>
                  <div className="text-2xl font-bold mt-1">{((platformAnalytics.submissionsPerAssessment as number) || 0).toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Média de submissões por avaliação
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade de Usuários</CardTitle>
              <CardDescription>
                Análise de atividade dos usuários na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Dados detalhados de atividade de usuários serão implementados em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cursos Recentes</CardTitle>
              <CardDescription>
                Análise dos cursos mais recentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium">
                  <div className="col-span-5">Curso</div>
                  <div className="col-span-2">Alunos</div>
                  <div className="col-span-3">Conclusão</div>
                  <div className="col-span-2">Nota Média</div>
                </div>
                
                <div className="divide-y">
                  {courses?.map((course: { id: string; title: string }) => (
                    <div key={course.id} className="grid grid-cols-12 gap-4 p-4">
                      <div className="col-span-5 font-medium truncate">{course.title}</div>
                      <div className="col-span-2">--</div>
                      <div className="col-span-3">--</div>
                      <div className="col-span-2">--</div>
                    </div>
                  ))}
                  
                  {!courses?.length && (
                    <div className="p-4 text-center text-muted-foreground">
                      Nenhum curso encontrado
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <a href="/admin/analytics/courses" className="text-primary hover:underline">
                  Ver todos os cursos
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
