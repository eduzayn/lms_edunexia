import * as React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Trash2, Plus, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { AssessmentQuestion, QuestionOption } from "../../lib/services/assessment-service";

interface QuestionEditorProps {
  question: AssessmentQuestion;
  index: number;
  onUpdate: (index: number, question: AssessmentQuestion) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export function QuestionEditor({
  question,
  index,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown
}: QuestionEditorProps) {
  const handleQuestionChange = (field: keyof AssessmentQuestion, value: unknown) => {
    onUpdate(index, { ...question, [field]: value });
  };

  const handleOptionChange = (optionIndex: number, field: keyof QuestionOption, value: unknown) => {
    const updatedOptions = [...(question.options || [])];
    updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value };
    
    onUpdate(index, { ...question, options: updatedOptions });
  };

  const handleAddOption = () => {
    const options = [...(question.options || [])];
    const newOption: QuestionOption = {
      id: `temp-${Date.now()}`,
      question_id: question.id,
      text: "",
      is_correct: false,
      order: options.length
    };
    
    options.push(newOption);
    onUpdate(index, { ...question, options });
  };

  const handleDeleteOption = (optionIndex: number) => {
    const options = [...(question.options || [])];
    options.splice(optionIndex, 1);
    
    // Update order for remaining options
    options.forEach((option, idx) => {
      option.order = idx;
    });
    
    onUpdate(index, { ...question, options });
  };

  const renderQuestionTypeFields = () => {
    switch (question.question_type) {
      case "multiple_choice":
        return (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Opções</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>Adicionar Opção</span>
              </Button>
            </div>
            
            {(question.options || []).map((option, optionIndex) => (
              <div key={option.id} className="flex items-start gap-2 p-3 border rounded-md">
                <div className="mt-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="grid gap-2">
                    <Label htmlFor={`option-${option.id}`}>Texto da Opção</Label>
                    <Textarea
                      id={`option-${option.id}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(optionIndex, "text", e.target.value)}
                      placeholder="Digite o texto da opção"
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`correct-${option.id}`}
                      checked={option.is_correct}
                      onCheckedChange={(checked: boolean) => handleOptionChange(optionIndex, "is_correct", checked)}
                    />
                    <Label htmlFor={`correct-${option.id}`}>Resposta Correta</Label>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor={`feedback-${option.id}`}>Feedback (opcional)</Label>
                    <Textarea
                      id={`feedback-${option.id}`}
                      value={option.feedback || ""}
                      onChange={(e) => handleOptionChange(optionIndex, "feedback", e.target.value)}
                      placeholder="Feedback para esta opção"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteOption(optionIndex)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        );
      
      case "true_false":
        return (
          <div className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label>Resposta Correta</Label>
              <Select
                value={question.correct_answer || "true"}
                onValueChange={(value: string) => handleQuestionChange("correct_answer", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a resposta correta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Verdadeiro</SelectItem>
                  <SelectItem value="false">Falso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case "essay":
        return (
          <div className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor={`word-limit-${question.id}`}>Limite de Palavras (opcional)</Label>
              <Input
                id={`word-limit-${question.id}`}
                type="number"
                min="0"
                value={question.settings?.wordLimit || ""}
                onChange={(e) => {
                  const settings = { ...question.settings, wordLimit: parseInt(e.target.value) };
                  handleQuestionChange("settings", settings);
                }}
                placeholder="Ex: 500"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`rubric-${question.id}`}>Critérios de Avaliação</Label>
              <Textarea
                id={`rubric-${question.id}`}
                value={question.settings?.rubric || ""}
                onChange={(e) => {
                  const settings = { ...question.settings, rubric: e.target.value };
                  handleQuestionChange("settings", settings);
                }}
                placeholder="Descreva os critérios de avaliação para esta questão"
                className="min-h-[100px]"
              />
            </div>
          </div>
        );
      
      case "matching":
      case "fill_blank":
        return (
          <div className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor={`correct-answer-${question.id}`}>Resposta Correta</Label>
              <Textarea
                id={`correct-answer-${question.id}`}
                value={question.correct_answer || ""}
                onChange={(e) => handleQuestionChange("correct_answer", e.target.value)}
                placeholder="Digite a resposta correta"
                className="min-h-[80px]"
              />
            </div>
          </div>
        );
      
      case "code":
        return (
          <div className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor={`language-${question.id}`}>Linguagem de Programação</Label>
              <Select
                value={question.settings?.language || "javascript"}
                onValueChange={(value: string) => {
                  const settings = { ...question.settings, language: value };
                  handleQuestionChange("settings", settings);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a linguagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="ruby">Ruby</SelectItem>
                  <SelectItem value="swift">Swift</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`starter-code-${question.id}`}>Código Inicial (opcional)</Label>
              <Textarea
                id={`starter-code-${question.id}`}
                value={question.settings?.starterCode || ""}
                onChange={(e) => {
                  const settings = { ...question.settings, starterCode: e.target.value };
                  handleQuestionChange("settings", settings);
                }}
                placeholder="Código inicial para o aluno"
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`test-cases-${question.id}`}>Casos de Teste</Label>
              <Textarea
                id={`test-cases-${question.id}`}
                value={question.settings?.testCases || ""}
                onChange={(e) => {
                  const settings = { ...question.settings, testCases: e.target.value };
                  handleQuestionChange("settings", settings);
                }}
                placeholder="Casos de teste para verificar a solução"
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          Questão {index + 1}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onMoveDown(index)}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(index)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor={`question-type-${question.id}`}>Tipo de Questão</Label>
          <Select
            value={question.question_type}
            onValueChange={(value: string) => handleQuestionChange("question_type", value)}
          >
            <SelectTrigger id={`question-type-${question.id}`}>
              <SelectValue placeholder="Selecione o tipo de questão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
              <SelectItem value="true_false">Verdadeiro/Falso</SelectItem>
              <SelectItem value="essay">Dissertativa</SelectItem>
              <SelectItem value="matching">Correspondência</SelectItem>
              <SelectItem value="fill_blank">Preencher Lacunas</SelectItem>
              <SelectItem value="code">Código</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`question-text-${question.id}`}>Texto da Questão</Label>
          <Textarea
            id={`question-text-${question.id}`}
            value={question.question_text}
            onChange={(e) => handleQuestionChange("question_text", e.target.value)}
            placeholder="Digite o texto da questão"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`question-points-${question.id}`}>Pontos</Label>
          <Input
            id={`question-points-${question.id}`}
            type="number"
            min="1"
            value={question.points}
            onChange={(e) => handleQuestionChange("points", parseInt(e.target.value))}
          />
        </div>
        
        {renderQuestionTypeFields()}
        
        <div className="grid gap-2">
          <Label htmlFor={`question-feedback-${question.id}`}>Feedback Geral (opcional)</Label>
          <Textarea
            id={`question-feedback-${question.id}`}
            value={question.feedback || ""}
            onChange={(e) => handleQuestionChange("feedback", e.target.value)}
            placeholder="Feedback geral para esta questão"
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
