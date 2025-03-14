import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, FileText, Clock, Users, BarChart } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { assessmentService } from "../../../../lib/services/assessment-service";
import { createServerSupabaseClient } from "../../../../lib/supabase/server";

export default async function AssessmentsListPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const supabase = createServerSupabaseClient();
  
  // Check if user is admin or instructor
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/login?redirect=/admin/assessments/list");
  }
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();
  
  if (!profile || !["admin", "instructor"].includes(profile.role)) {
    redirect("/");
  }
  
  // Fetch assessments
  const courseId = typeof searchParams.courseId === 'string' ? searchParams.courseId : undefined;
  const assessments = await assessmentService.getAssessments(courseId);
  
  // Fetch courses for filter
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .order("title");
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sem prazo";
    
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Avaliações</h1>
          <p className="text-muted-foreground">
            Gerencie avaliações, questionários e tarefas
          </p>
        </div>
        
        <Link href="/admin/assessments/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            <span>Nova Avaliação</span>
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Curso</h3>
                <div className="space-y-1">
                  <Link href="/admin/assessments/list">
                    <Button
                      variant={!courseId ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      Todos os Cursos
                    </Button>
                  </Link>
                  
                  {courses?.map((course) => (
                    <Link
                      key={course.id}
                      href={`/admin/assessments/list?courseId=${course.id}`}
                    >
                      <Button
                        variant={courseId === course.id ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                      >
                        {course.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Tipo</h3>
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Todos os Tipos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Quiz
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Prova
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Tarefa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          {assessments.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h2 className="mt-4 text-lg font-medium">Nenhuma avaliação encontrada</h2>
              <p className="mt-1 text-muted-foreground">
                Comece criando uma nova avaliação para seus alunos.
              </p>
              <div className="mt-6">
                <Link href="/admin/assessments/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Criar Avaliação</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{assessment.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {assessment.description || "Sem descrição"}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {assessment.type?.name || "Quiz"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{assessment.questions.length} questões</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {assessment.time_limit_minutes
                            ? `${assessment.time_limit_minutes} min`
                            : "Sem limite"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>0 submissões</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                        <span>Nota: {assessment.passing_score}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Data de Entrega:</span>
                        <span>{formatDate(assessment.due_date)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href={`/admin/assessments/preview/${assessment.id}`}>
                      <Button variant="outline" size="sm">
                        Visualizar
                      </Button>
                    </Link>
                    <Link href={`/admin/assessments/edit/${assessment.id}`}>
                      <Button size="sm">
                        Editar
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
