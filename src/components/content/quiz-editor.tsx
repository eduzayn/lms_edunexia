"use client";

import React, { useState } from 'react';

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer?: string | string[];
}

interface QuizEditorProps {
  initialQuestions?: Question[];
  onChange?: (questions: Question[]) => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({
  initialQuestions = [],
  onChange
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  const addQuestion = (type: 'multiple_choice' | 'true_false' | 'short_answer') => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      type,
      options: type === 'multiple_choice' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'true_false' ? 'true' : '',
    };
    
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    
    if (onChange) {
      onChange(updatedQuestions);
    }
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
    
    if (onChange) {
      onChange(updatedQuestions);
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
    
    if (onChange) {
      onChange(updatedQuestions);
    }
  };

  const removeQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    
    if (onChange) {
      onChange(updatedQuestions);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addQuestion('multiple_choice')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Adicionar Múltipla Escolha
        </button>
        <button
          type="button"
          onClick={() => addQuestion('true_false')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Adicionar Verdadeiro/Falso
        </button>
        <button
          type="button"
          onClick={() => addQuestion('short_answer')}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Adicionar Resposta Curta
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma questão adicionada. Use os botões acima para criar questões.
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Questão {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remover
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto da Questão
                </label>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Digite a pergunta aqui..."
                />
              </div>
              
              {question.type === 'multiple_choice' && question.options && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opções
                  </label>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === option}
                        onChange={() => updateQuestion(question.id, 'correctAnswer', option)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder={`Opção ${optIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'true_false' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resposta Correta
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`tf-${question.id}`}
                        value="true"
                        checked={question.correctAnswer === 'true'}
                        onChange={() => updateQuestion(question.id, 'correctAnswer', 'true')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Verdadeiro</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`tf-${question.id}`}
                        value="false"
                        checked={question.correctAnswer === 'false'}
                        onChange={() => updateQuestion(question.id, 'correctAnswer', 'false')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Falso</span>
                    </label>
                  </div>
                </div>
              )}
              
              {question.type === 'short_answer' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resposta Correta
                  </label>
                  <input
                    type="text"
                    value={question.correctAnswer as string || ''}
                    onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Digite a resposta correta..."
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizEditor;
