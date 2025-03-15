import React from 'react';

// Mock implementation of QuestionEditor component for testing
export const QuestionEditor = ({ question, index, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
  return (
    <div data-testid="question-editor">
      <div className="question-header">
        <h3>Question {index + 1}</h3>
      </div>
      <div className="question-content">
        <label htmlFor={`question-text-${question.id}`}>
          Texto da Questão
          <textarea 
            id={`question-text-${question.id}`}
            value={question.question_text}
            onChange={(e) => onUpdate(index, { ...question, question_text: e.target.value })}
          />
        </label>
        
        <div className="question-type">
          <span>Tipo de Questão</span>
          <select 
            id={`question-type-${question.id}`}
            value={question.question_type}
            onChange={(e) => onUpdate(index, { ...question, question_type: e.target.value })}
          >
            <option value="multiple_choice">Múltipla Escolha</option>
            <option value="true_false">Verdadeiro/Falso</option>
            <option value="essay">Dissertativa</option>
          </select>
        </div>
        
        <label htmlFor={`question-points-${question.id}`}>
          Pontos
          <input 
            id={`question-points-${question.id}`}
            type="number"
            value={question.points}
            onChange={(e) => onUpdate(index, { ...question, points: parseInt(e.target.value) })}
          />
        </label>
        
        <div className="options-section">
          <h4>Opções</h4>
          {question.options.map((option, optIndex) => (
            <div key={option.id} className="option-item">
              <label htmlFor={`option-text-${option.id}`}>
                Texto da Opção
                <textarea 
                  id={`option-text-${option.id}`}
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = [...question.options];
                    newOptions[optIndex] = { ...option, text: e.target.value };
                    onUpdate(index, { ...question, options: newOptions });
                  }}
                />
              </label>
              
              <label htmlFor={`option-correct-${option.id}`}>
                Resposta Correta
                <input 
                  id={`option-correct-${option.id}`}
                  type="checkbox"
                  checked={option.is_correct}
                  onChange={() => {
                    const newOptions = [...question.options];
                    newOptions[optIndex] = { ...option, is_correct: !option.is_correct };
                    onUpdate(index, { ...question, options: newOptions });
                  }}
                />
              </label>
            </div>
          ))}
          
          <button 
            onClick={() => {
              const newOption = {
                id: `new-option-${Date.now()}`,
                text: '',
                is_correct: false,
                question_id: question.id,
                order: question.options.length
              };
              onUpdate(index, { 
                ...question, 
                options: [...question.options, newOption]
              });
            }}
          >
            Adicionar Opção
          </button>
        </div>
      </div>
      
      <div className="question-actions">
        <button onClick={() => onDelete(index)}>Excluir Questão</button>
        <button onClick={() => onMoveUp(index)}>Mover para Cima</button>
        <button onClick={() => onMoveDown(index)}>Mover para Baixo</button>
      </div>
    </div>
  );
};
