import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AssessmentForm } from "../../../../components/assessment/assessment-form";
import { assessmentService } from "../../../../lib/services/assessment-service";
import { createServerSupabaseClient } from "../../../../lib/supabase/server";

export default async function CreateAssessmentPage() {
  const supabase = createServerSupabaseClient();
  
  // Check if user is admin or instructor
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/login?redirect=/admin/assessments/create");
  }
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();
  
  if (!profile || !["admin", "instructor"].includes(profile.role)) {
    redirect("/");
  }
  
  // Fetch assessment types
  const assessmentTypes = await assessmentService.getAssessmentTypes();
  
  // Fetch courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .order("title");
  
  // Fetch modules
  const { data: modules } = await supabase
    .from("modules")
    .select("id, title")
    .order("title");
  
  // Create empty assessment for the form
  const emptyAssessment = {
    id: "",
    title: "",
    description: "",
    instructions: "",
    type_id: assessmentTypes[0]?.id || "",
    course_id: "",
    module_id: "",
    due_date: null,
    points: 100,
    passing_score: 70,
    time_limit_minutes: null,
    attempts_allowed: null,
    settings: {},
    questions: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Link
          href="/admin/assessments"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para Avaliações</span>
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar Nova Avaliação</h1>
        <p className="text-muted-foreground">
          Configure os detalhes da avaliação e adicione questões
        </p>
      </div>
      
      <AssessmentForm
        assessment={emptyAssessment}
        assessmentTypes={assessmentTypes}
        courses={courses || []}
        modules={modules || []}
        onUpdate={() => {}}
        onSave={async () => {}}
        isSaving={false}
      />
    </div>
  );
}
