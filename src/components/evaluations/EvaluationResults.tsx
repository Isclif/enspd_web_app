import React from 'react';
import { Button } from '../common/Button';
import { Evaluation, Response, UserRole } from '../../types/evaluations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EvaluationResultsProps {
  evaluation: Evaluation;
  responses: Response[];
  userRole: UserRole;
  onClose: () => void;
  onRetakeEvaluation?: () => void; // Optionnel, pour refaire l'évaluation (si autorisé)
}

export const EvaluationResults: React.FC<EvaluationResultsProps> = ({
  evaluation,
  responses,
  userRole,
  onClose,
  onRetakeEvaluation
}) => {
  // Calcul du score total
  const totalPoints = evaluation?.questions?.reduce((sum, q) => sum + (q.points || 0), 0);
  const earnedPoints = responses?.reduce((sum, r) => sum + (r.score || 0), 0);
  const percentageScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  
  // Déterminer si l'évaluation est réussie (seuil arbitraire de 60%)
  const isPassed = percentageScore >= 60;
  
  // Formatage de la date de soumission
  const formatDate = (date: Date) => {
    return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="mb-6 border-b pb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{evaluation.title} - Résultats</h2>
          <div className={`text-lg font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
            {earnedPoints}/{totalPoints} points ({percentageScore}%)
          </div>
        </div>
        <p className="text-gray-600 mt-2">{evaluation.description}</p>
        <div className="flex items-center mt-2">
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
            isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPassed ? 'Réussi' : 'Non réussi'}
          </span>
          <span className="text-sm text-gray-500 ml-3">
            Soumis le {formatDate(new Date())}
          </span>
        </div>
      </div>
      
      {/* Résumé des réponses */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Détail des réponses ddd</h3>
        
        <div className="space-y-6">
          {evaluation?.questions?.map((question, index) => {
            const response = responses.find(r => r.questionId === question.id);
            const isCorrect = response?.isCorrect;

            // console.log("response", response);
            
            return (
              <div 
                key={question.id} 
                className={`p-4 rounded-lg ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Question {index + 1}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        question.type === 'qcm' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {question.type === 'qcm' ? 'QCM' : 
                        question.type === 'redaction' ? 'Rédaction' : 'Vrai/Faux'}
                      </span>
                    </div>
                    <p className="mt-2">{question.text}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">
                      {response?.score || 0}/{question.points || 0}
                    </span>
                  </div>
                </div>
                
                {/* Affichage de la réponse */}
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700">Votre réponse:</h4>
                  <div className="mt-1 p-2 bg-white rounded border">
                    {question.type === 'qcm' && Array.isArray(response?.responseContent) ? (
                      <ul className="list-disc list-inside">
                        {(response?.responseContent).map((item, i) => (
                          <li key={i}>{item.text}</li>
                        ))}
                      </ul>
                    ) : question.type === 'vrai_faux' && typeof response?.responseContent === 'string' ? (
                      <p>{(response?.responseContent as string) === 'vrai' ? 'Vrai' : 'Faux'}</p>
                    ) : ""}
                  </div>
                </div>
                
                {/* Réponse correcte (visible seulement si l'évaluation est terminée ou si c'est le professeur) */}
                {(userRole === 'Professeur' || evaluation.show_correct_answers) && question.correct_answer.length != 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700">Réponse correcte:</h4>
                    <div className="mt-1 p-2 bg-white rounded border">
                      {question.type === 'qcm' && Array.isArray(question.correct_answer) ? (
                        <ul className="list-disc list-inside">
                          {(question.correct_answer).map((item, i) => (
                            <li key={i}>{item.text}</li>
                          ))}
                        </ul>
                      ) : question.type === 'vrai_faux' ? (
                        <p>{question.correct_answer[0]?.text === 'Vrai' ? 'Vrai' : 'Faux'}</p>
                      ) : ""}
                    </div>
                  </div>
                )}
                
                {/* Feedback du professeur (si disponible) */}
                {response?.feedback && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700">Commentaire:</h4>
                    <div className="mt-1 p-2 bg-white rounded border">
                      <p>{response.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          // variant="outline"
          onClick={onClose}
          // className='text-blue-500'
        >
          Retour au tableau de bord
        </Button>
        
        {/* Option pour refaire l'évaluation si c'est autorisé */}
        {userRole === 'Etudiant' && evaluation.allowRetake && onRetakeEvaluation && (
          <Button
            variant="primary"
            onClick={onRetakeEvaluation}
          >
            Refaire l'évaluation
          </Button>
        )}
      </div>
    </div>
  );
};