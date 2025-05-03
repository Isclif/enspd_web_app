// src/components/evaluations/TakeEvaluation.tsx
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Evaluation, Question, QuestionType } from '../../types/evaluations';

interface StudentAnswer {
  questionId: string;
  selectedOptionIds: string[]; // Pour QCM, peut contenir plusieurs IDs
  textAnswer?: string; // Pour les questions de rédaction
}

interface TakeEvaluationProps {
  evaluation: Evaluation;
  onSubmit: (answers: StudentAnswer[]) => void;
  onCancel: () => void;
}

export const TakeEvaluation: React.FC<TakeEvaluationProps> = ({ 
  evaluation, 
  onSubmit, 
  onCancel 
}) => {
  // Initialiser les réponses vides pour chaque question
  const initialAnswers = evaluation.questions.map(q => ({
    questionId: q.id,
    selectedOptionIds: [],
    textAnswer: q.type === 'redaction' ? '' : undefined
  }));
  
  const [answers, setAnswers] = useState<StudentAnswer[]>(initialAnswers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const handleOptionSelect = (questionIndex: number, optionId: string, questionType: QuestionType) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      
      if (questionType === 'qcm') {
        // Pour QCM, toggle l'option (ajouter ou enlever)
        const currentSelected = newAnswers[questionIndex].selectedOptionIds;
        if (currentSelected.includes(optionId)) {
          newAnswers[questionIndex].selectedOptionIds = currentSelected.filter(id => id !== optionId);
        } else {
          newAnswers[questionIndex].selectedOptionIds = [...currentSelected, optionId];
        }
      } else if (questionType === 'vrai_faux') {
        // Pour Vrai/Faux, une seule option peut être sélectionnée
        newAnswers[questionIndex].selectedOptionIds = [optionId];
      }
      
      return newAnswers;
    });
  };
  
  const handleTextAnswerChange = (questionIndex: number, text: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex].textAnswer = text;
      return newAnswers;
    });
  };
  
  const handleSubmit = () => {
    onSubmit(answers);
  };
  
  const currentQuestion = evaluation.questions[currentQuestionIndex];
  const totalQuestions = evaluation.questions.length;
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Vérifier si la question actuelle a été répondue
  const isCurrentQuestionAnswered = () => {
    const answer = answers[currentQuestionIndex];
    if (currentQuestion.type === 'redaction') {
      return answer.textAnswer && answer.textAnswer.trim().length > 0;
    } else {
      return answer.selectedOptionIds.length > 0;
    }
  };
  
  // Calculer le nombre de questions répondues
  const answeredQuestionsCount = answers.filter(a => {
    if (evaluation.questions.find(q => q.id === a.questionId)?.type === 'redaction') {
      return a.textAnswer && a.textAnswer.trim().length > 0;
    } else {
      return a.selectedOptionIds.length > 0;
    }
  }).length;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{evaluation.titre}</h2>
      <p className="text-gray-600 mb-6">{evaluation.description}</p>
      
      {/* Progression */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-sm text-gray-600">
            {answeredQuestionsCount} / {totalQuestions} questions répondues
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(answeredQuestionsCount / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Affichage de la question courante */}
      <div className="mb-8 p-4 border rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">
            {currentQuestion.text}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Réponse selon le type de question */}
        {currentQuestion.type === 'redaction' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre réponse:
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 min-h-[150px]"
              value={answers[currentQuestionIndex].textAnswer || ''}
              onChange={(e) => handleTextAnswerChange(currentQuestionIndex, e.target.value)}
              placeholder="Écrivez votre réponse ici..."
            ></textarea>
          </div>
        ) : (
          <div className="space-y-3">
            {currentQuestion.options.map(option => (
              <div 
                key={option.id} 
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  answers[currentQuestionIndex].selectedOptionIds.includes(option.id) 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => handleOptionSelect(
                  currentQuestionIndex, 
                  option.id, 
                  currentQuestion.type
                )}
              >
                <div className="flex items-center">
                  <input
                    type={currentQuestion.type === 'qcm' ? 'checkbox' : 'radio'}
                    checked={answers[currentQuestionIndex].selectedOptionIds.includes(option.id)}
                    onChange={() => {}} // Géré par le onClick du div parent
                    className="h-4 w-4"
                  />
                  <label className="ml-2">{option.text}</label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline"

          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Question précédente
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Quitter
          </Button>
          
          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={answeredQuestionsCount < totalQuestions}
            >
              Terminer l'évaluation
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={goToNextQuestion}
            >
              Question suivante
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};