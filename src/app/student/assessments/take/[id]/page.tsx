import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { AssessmentPreview } from "../../../../../components/assessment/assessment-preview";
import { assessmentService } from "../../../../../lib/services/assessment-service";
import { createServerSupabaseClient } from "../../../../../lib/supabase/server";

export default async function TakeAssessmentPage({ params }) {
  const assessmentId = params.id;
  const supabase = createServerSupabaseClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect(`/auth/login?redirect=/student/assessments/take/${assessmentId}`);
  }
  
  // Fetch assessment
  const assessment = await assessmentService.getAssessment(assessmentId);
  
  if (!assessment) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Avaliação não encontrada</h1>
          <p className="mb-6">A avaliação solicitada não existe ou foi removida.</p>
          <Link href="/student/assessments/list">
            <Button>Voltar para Avaliações</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Check if assessment is available
  const now = new Date();
  const dueDate = assessment.due_date ? new Date(assessment.due_date) : null;
  
  if (dueDate && dueDate < now) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-4">
          <Link
            href="/student/assessments/list"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Avaliações</span>
          </Link>
        </div>
        
        <div className="text-center py-12 border rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Prazo Expirado</h1>
          <p className="mb-6">
            O prazo para realizar esta avaliação expirou em {dueDate.toLocaleDateString("pt-BR")}.
          </p>
          <Link href="/student/assessments/list">
            <Button>Voltar para Avaliações</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Check if student has attempts left
  const studentSubmissions = await assessmentService.getStudentSubmissions(
    session.user.id,
    assessmentId
  );
  
  const attemptsUsed = studentSubmissions.length;
  const attemptsAllowed = assessment.attempts_allowed;
  
  if (attemptsAllowed !== null && attemptsUsed >= attemptsAllowed) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-4">
          <Link
            href="/student/assessments/list"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Avaliações</span>
          </Link>
        </div>
        
        <div className="text-center py-12 border rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Limite de Tentativas Atingido</h1>
          <p className="mb-6">
            Você já utilizou todas as {attemptsAllowed} tentativas permitidas para esta avaliação.
          </p>
          <Link href="/student/assessments/list">
            <Button>Voltar para Avaliações</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Check if there's an in-progress submission
  const inProgressSubmission = studentSubmissions.find(s => s.status === "in_progress");
  
  // Create a new submission if needed
  if (!inProgressSubmission) {
    await assessmentService.createSubmission({
      assessment_id: assessmentId,
      student_id: session.user.id
    });
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Link
          href="/student/assessments/list"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para Avaliações</span>
        </Link>
      </div>
      
      <AssessmentPreview
        assessment={assessment}
        onSubmit={async () => {
          'use server';
          // This will be handled by a form action in a real implementation
        }}
      />
    </div>
  );
}
