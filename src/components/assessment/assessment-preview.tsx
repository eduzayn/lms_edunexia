import * as React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Assessment, AssessmentQuestion } from "../../lib/services/assessment-service";
import { ArrowLeft, ArrowRight, Clock, AlertCircle } from "lucide-react";

interface AssessmentPreviewProps {
  assessment: Assessment;
  onSubmit?: () => void;
}

export function AssessmentPreview({ assessment, onSubmit }: AssessmentPreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = React.useState<number | null>(
    assessment.time_limit_minutes ? assessment.time_limit_minutes * 60 : null
  );

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const totalQuestions = assessment.questions.length;

  React.useEffect(() => {
    if (timeRemaining === null) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  const renderQuestionContent = (question: AssessmentQuestion) => {
    switch (question.question_type) {
      case "multiple_choice":
        return (
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            className="space-y-3"
          >
            {(question.options || []).map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="font-normal">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case "true_false":
        return (
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            className="space-y-3"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-true`} />
              <Label htmlFor={`${question.id}-true`} className="font-normal">
                Verdadeiro
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-false`} />
              <Label htmlFor={`${question.id}-false`} className="font-normal">
                Falso
              </Label>
            </div>
          </RadioGroup>
        );
      
      case "essay":
        return (
          <div className="space-y-2">
            <Textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="min-h-[200px]"
            />
            {question.settings?.wordLimit && (
              <p className="text-xs text-muted-foreground">
                Limite de palavras: {question.settings.wordLimit}
              </p>
            )}
          </div>
        );
      
      case "matching":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Associe os itens da coluna da esquerda com os da direita.
            </p>
            <Textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="min-h-[150px]"
            />
          </div>
        );
      
      case "fill_blank":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Preencha os espaços em branco no texto abaixo.
            </p>
            <Textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="min-h-[150px]"
            />
          </div>
        );
      
      case "code":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Linguagem: {question.settings?.language || "JavaScript"}
            </p>
            {question.settings?.starterCode && (
              <div className="p-3 bg-muted rounded-md font-mono text-sm whitespace-pre-wrap">
                {question.settings.starterCode}
              </div>
            )}
            <Textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Digite seu código aqui..."
              className="min-h-[200px] font-mono"
            />
          </div>
        );
      
      default:
        return (
          <p className="text-muted-foreground">
            Tipo de questão não suportado.
          </p>
        );
    }
  };

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Nenhuma questão disponível.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{assessment.title}</h2>
          <p className="text-muted-foreground">{assessment.description}</p>
        </div>
        
        {timeRemaining !== null && (
          <div className="flex items-center gap-2 text-lg font-medium">
            <Clock className="h-5 w-5" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between bg-muted p-3 rounded-md">
        <div className="text-sm">
          Questão {currentQuestionIndex + 1} de {totalQuestions}
        </div>
        
        <div className="text-sm">
          {currentQuestion.points} pontos
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {currentQuestion.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderQuestionContent(currentQuestion)}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Anterior</span>
          </Button>
          
          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button
              type="button"
              onClick={handleNextQuestion}
            >
              <span>Próxima</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
            >
              <span>Finalizar</span>
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="flex flex-wrap gap-2">
        {assessment.questions.map((q, index) => (
          <Button
            key={q.id}
            type="button"
            variant={index === currentQuestionIndex ? "default" : answers[q.id] ? "outline" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      
      {timeRemaining !== null && timeRemaining < 300 && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
          <AlertCircle className="h-5 w-5" />
          <span>Menos de 5 minutos restantes!</span>
        </div>
      )}
    </div>
  );
}
