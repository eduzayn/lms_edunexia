import * as React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DatePicker } from "../ui/date-picker";
import { QuestionEditor } from "./question-editor";
import { Assessment, AssessmentQuestion, AssessmentType } from "../../lib/services/assessment-service";
import { Plus } from "lucide-react";

interface AssessmentFormProps {
  assessment: Assessment;
  assessmentTypes: AssessmentType[];
  courses: { id: string; title: string }[];
  modules: { id: string; title: string }[];
  onUpdate: (assessment: Assessment) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export function AssessmentForm({
  assessment,
  assessmentTypes,
  courses,
  modules,
  onUpdate,
  onSave,
  isSaving
}: AssessmentFormProps) {
  const handleChange = (field: keyof Assessment, value: unknown) => {
    onUpdate({ ...assessment, [field]: value });
  };

  const handleQuestionUpdate = (index: number, updatedQuestion: AssessmentQuestion) => {
    const questions = [...assessment.questions];
    questions[index] = updatedQuestion;
    onUpdate({ ...assessment, questions });
  };

  const handleAddQuestion = () => {
    const questions = [...assessment.questions];
    const newQuestion: AssessmentQuestion = {
      id: `temp-${Date.now()}`,
      assessment_id: assessment.id,
      question_text: "Nova questão",
      question_type: "multiple_choice",
      points: 10,
      options: [],
      order: questions.length
    };
    
    questions.push(newQuestion);
    onUpdate({ ...assessment, questions });
  };

  const handleDeleteQuestion = (index: number) => {
    const questions = [...assessment.questions];
    questions.splice(index, 1);
    
    // Update order for remaining questions
    questions.forEach((question, idx) => {
      question.order = idx;
    });
    
    onUpdate({ ...assessment, questions });
  };

  const handleMoveQuestionUp = (index: number) => {
    if (index === 0) return;
    
    const questions = [...assessment.questions];
    const temp = questions[index];
    questions[index] = questions[index - 1];
    questions[index - 1] = temp;
    
    // Update order
    questions.forEach((question, idx) => {
      question.order = idx;
    });
    
    onUpdate({ ...assessment, questions });
  };

  const handleMoveQuestionDown = (index: number) => {
    if (index === assessment.questions.length - 1) return;
    
    const questions = [...assessment.questions];
    const temp = questions[index];
    questions[index] = questions[index + 1];
    questions[index + 1] = temp;
    
    // Update order
    questions.forEach((question, idx) => {
      question.order = idx;
    });
    
    onUpdate({ ...assessment, questions });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={assessment.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Digite o título da avaliação"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={assessment.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Digite uma descrição para a avaliação"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="instructions">Instruções</Label>
            <Textarea
              id="instructions"
              value={assessment.instructions || ""}
              onChange={(e) => handleChange("instructions", e.target.value)}
              placeholder="Digite as instruções para os alunos"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Avaliação</Label>
              <Select
                value={assessment.type_id}
                onValueChange={(value: string) => handleChange("type_id", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {assessmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="course">Curso</Label>
              <Select
                value={assessment.course_id || ""}
                onValueChange={(value: string) => handleChange("course_id", value)}
              >
                <SelectTrigger id="course">
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="module">Módulo</Label>
              <Select
                value={assessment.module_id || ""}
                onValueChange={(value: string) => handleChange("module_id", value)}
              >
                <SelectTrigger id="module">
                  <SelectValue placeholder="Selecione o módulo" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="due-date">Data de Entrega</Label>
              <DatePicker
                date={assessment.due_date ? new Date(assessment.due_date) : undefined}
                setDate={(date) => handleChange("due_date", date?.toISOString())}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="points">Pontuação Total</Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={assessment.points}
                onChange={(e) => handleChange("points", parseInt(e.target.value))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="passing-score">Nota Mínima para Aprovação (%)</Label>
              <Input
                id="passing-score"
                type="number"
                min="0"
                max="100"
                value={assessment.passing_score}
                onChange={(e) => handleChange("passing_score", parseInt(e.target.value))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="time-limit">Limite de Tempo (minutos)</Label>
              <Input
                id="time-limit"
                type="number"
                min="0"
                value={assessment.time_limit_minutes || ""}
                onChange={(e) => handleChange("time_limit_minutes", e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Sem limite"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="attempts">Tentativas Permitidas</Label>
              <Input
                id="attempts"
                type="number"
                min="0"
                value={assessment.attempts_allowed || ""}
                onChange={(e) => handleChange("attempts_allowed", e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Ilimitadas"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Questões</CardTitle>
          <Button
            type="button"
            onClick={handleAddQuestion}
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Adicionar Questão</span>
          </Button>
        </CardHeader>
        <CardContent>
          {assessment.questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma questão adicionada ainda.</p>
              <p className="mt-1">Clique em "Adicionar Questão" para começar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assessment.questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={handleQuestionUpdate}
                  onDelete={handleDeleteQuestion}
                  onMoveUp={handleMoveQuestionUp}
                  onMoveDown={handleMoveQuestionDown}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar Avaliação"}
        </Button>
      </div>
    </div>
  );
}
