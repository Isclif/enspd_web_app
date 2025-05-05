import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Evaluation, Question, Response, QuestionType } from '../../types/evaluations';

interface EvaluationResponseProps {
  evaluation: Evaluation;
  onSubmit: (responses: Response[]) => void;
  onCancel: () => void;
}

export const EvaluationResponse: React.FC<EvaluationResponseProps> = ({ 
  evaluation, 
  onSubmit, 
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    evaluation.duree ? evaluation.duree * 60 : null
  );
  
  // Initialiser les réponses vides
  useEffect(() => {
    const initialResponses = evaluation.questions.map(question => ({
      questionId: question.id,
      evaluationId: evaluation.id,
      responseContent: question.type === 'qcm' ? [] : '',
      isCorrect: false,
      score: 0
    }));
    
    setResponses(initialResponses);
  }, [evaluation]);
  
  // Décompte du temps si une durée est définie
  useEffect(() => {
    if (timeLeft === null) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleResponseChange = (questionIndex: number, value: string | string[]) => {
    setResponses(prev => {
      const newResponses = [...prev];
      newResponses[questionIndex] = {
        ...newResponses[questionIndex],
        responseContent: value
      };
      return newResponses;
    });
  };
  
  const handleSubmit = () => {
    onSubmit(responses);
  };
  
  const currentQuestion = evaluation.questions[currentStep];
  
  const renderQuestionContent = (question: Question, index: number) => {
    switch (question.type) {
      case 'qcm':
        return (
          <div className="space-y-3">
            {question.options?.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center">
                <input
                  type="checkbox"
                  id={`option-${optIndex}`}
                  checked={
                    Array.isArray(responses[index]?.responseContent) && 
                    responses[index]?.responseContent.includes(option)
                  }
                  onChange={(e) => {
                    const currentResponses = Array.isArray(responses[index]?.responseContent) 
                      ? [...responses[index].responseContent as string[]] 
                      : [];
                    
                    if (e.target.checked) {
                      handleResponseChange(index, [...currentResponses, option]);
                    } else {
                      handleResponseChange(
                        index, 
                        currentResponses.filter(opt => opt !== option)
                      );
                    }
                  }}
                  className="h-5 w-5 text-blue-600"
                />
                <label htmlFor={`option-${optIndex}`} className="ml-2 text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'vrai_faux':
        return (
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="true"
                name={`question-${question.id}`}
                value="vrai"
                checked={responses[index]?.responseContent === 'vrai'}
                onChange={() => handleResponseChange(index, 'vrai')}
                className="h-5 w-5 text-blue-600"
              />
              <label htmlFor="true" className="ml-2 text-gray-700">
                Vrai
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="false"
                name={`question-${question.id}`}
                value="faux"
                checked={responses[index]?.responseContent === 'faux'}
                onChange={() => handleResponseChange(index, 'faux')}
                className="h-5 w-5 text-blue-600"
              />
              <label htmlFor="false" className="ml-2 text-gray-700">
                Faux
              </label>
            </div>
          </div>
        );
        
      case 'redaction':
        return (
          <textarea
            value={responses[index]?.responseContent as string || ''}
            onChange={(e) => handleResponseChange(index, e.target.value)}
            className="w-full h-32 p-3 border rounded-lg"
            placeholder="Rédigez votre réponse ici..."
          />
        );
        
      default:
        return <p>Type de question non pris en charge</p>;
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold">{evaluation.titre}</h2>
        {timeLeft !== null && (
          <div className={`font-mono text-lg ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
            Temps restant: {formatTime(timeLeft)}
          </div>
        )}
      </div>
      
      {/* Progression */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Question {currentStep + 1} sur {evaluation.questions.length}</span>
          <span>{Math.round(((currentStep + 1) / evaluation.questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((currentStep + 1) / evaluation.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Question courante */}
      <div className="mb-6">
        <div className="flex space-x-2 mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            currentQuestion.type === 'qcm' ? 'bg-blue-100 text-blue-800' :
            currentQuestion.type === 'redaction' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {currentQuestion.type === 'qcm' ? 'QCM' : 
             currentQuestion.type === 'redaction' ? 'Rédaction' : 'Vrai/Faux'}
          </span>
          {currentQuestion.points && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
              {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-medium mb-4">{currentQuestion.content}</h3>
        
        {renderQuestionContent(currentQuestion, currentStep)}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => {
            if (currentStep > 0) {
              setCurrentStep(currentStep - 1);
            } else {
              onCancel();
            }
          }}
        >
          {currentStep > 0 ? 'Précédent' : 'Annuler'}
        </Button>
        
        <div className="flex space-x-2">
          {currentStep < evaluation.questions.length - 1 ? (
            <Button
              variant="primary"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Suivant
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              Terminer l'évaluation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};