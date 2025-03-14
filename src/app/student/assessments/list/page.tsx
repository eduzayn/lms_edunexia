import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { assessmentService } from "../../../../lib/services/assessment-service";
import { createServerSupabaseClient } from "../../../../lib/supabase/server";

export default async function StudentAssessmentsPage({ searchParams }) {
  const supabase = createServerSupabaseClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/login?redirect=/student/assessments/list");
  }
  
  // Fetch assessments
  const assessments = await assessmentService.getAssessments(searchParams.courseId);
  
  // Fetch student submissions for these assessments
  const studentSubmissions = await assessmentService.getStudentSubmissions(session.user.id);
  
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
  
  // Get submission status for an assessment
  const getSubmissionStatus = (assessmentId: string) => {
    const submissions = studentSubmissions.filter(s => s.assessment_id === assessmentId);
    
    if (submissions.length === 0) {
      return { status: "not_started", label: "Não iniciado", color: "default" };
    }
    
    const latestSubmission = submissions.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    
    if (latestSubmission.status === "in_progress") {
      return { status: "in_progress", label: "Em andamento", color: "warning" };
    }
    
    if (latestSubmission.status === "submitted" || latestSubmission.status === "needs_review") {
      return { status: "submitted", label: "Enviado", color: "info" };
    }
    
    if (latestSubmission.status === "graded") {
      return { 
        status: "graded", 
        label: latestSubmission.passed ? "Aprovado" : "Reprovado", 
        color: latestSubmission.passed ? "success" : "destructive",
        score: latestSubmission.score
      };
    }
    
    return { status: "unknown", label: "Desconhecido", color: "default" };
  };
  
  // Check if assessment is past due
  const isPastDue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Minhas Avaliações</h1>
          <p className="text-muted-foreground">
            Visualize e realize suas avaliações, questionários e tarefas
          </p>
        </div>
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
                  <Link href="/student/assessments/list">
                    <Button
                      variant={!searchParams.courseId ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      Todos os Cursos
                    </Button>
                  </Link>
                  
                  {courses?.map((course) => (
                    <Link
                      key={course.id}
                      href={`/student/assessments/list?courseId=${course.id}`}
                    >
                      <Button
                        variant={searchParams.courseId === course.id ? "default" : "outline"}
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
                <h3 className="text-sm font-medium">Status</h3>
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Todos os Status
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Pendentes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Concluídos
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
                Não há avaliações disponíveis para você no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((assessment) => {
                const submissionStatus = getSubmissionStatus(assessment.id);
                const isOverdue = isPastDue(assessment.due_date) && submissionStatus.status === "not_started";
                
                return (
                  <Card key={assessment.id} className={isOverdue ? "border-destructive" : ""}>
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
                          {submissionStatus.status === "graded" ? (
                            <>
                              <CheckCircle className={`h-4 w-4 ${submissionStatus.color === "success" ? "text-green-500" : "text-red-500"}`} />
                              <span>{submissionStatus.score}%</span>
                            </>
                          ) : (
                            <>
                              <div className={`h-2 w-2 rounded-full ${
                                submissionStatus.status === "not_started" ? "bg-gray-300" :
                                submissionStatus.status === "in_progress" ? "bg-yellow-500" :
                                submissionStatus.status === "submitted" ? "bg-blue-500" : "bg-gray-300"
                              }`} />
                              <span>{submissionStatus.label}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Prazo: {formatDate(assessment.due_date)}</span>
                        </div>
                      </div>
                      
                      {isOverdue && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          <span>Prazo expirado</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {submissionStatus.status === "graded" ? (
                        <Link href={`/student/assessments/results/${assessment.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Resultados
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/student/assessments/take/${assessment.id}`}>
                          <Button size="sm">
                            {submissionStatus.status === "in_progress" ? "Continuar" : "Iniciar"}
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
