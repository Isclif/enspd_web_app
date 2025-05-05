import React from 'react';
import { Button } from '../common/Button';
import { Evaluation, UserRole } from '../../types/evaluations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EvaluationDetailsProps {
  evaluation: Evaluation;
  userRole: UserRole;
  onBack: () => void;
  onTakeEvaluation?: () => void;
  onEditEvaluation?: () => void;
  onDeleteEvaluation?: () => void;
  canTakeEvaluation?: boolean;
  isCompleted?: boolean;
  onViewResults?: () => void;
}

export const EvaluationDetails: React.FC<EvaluationDetailsProps> = ({
  evaluation,
  userRole,
  onBack,
  onTakeEvaluation,
  onEditEvaluation,
  onDeleteEvaluation,
  canTakeEvaluation = true,
  isCompleted = false,
  onViewResults
}) => {
  // Formatage des dates
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };
  
  // Fonction pour générer une couleur de badge en fonction du type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'qcm': return 'bg-blue-100 text-blue-800';
      case 'redaction': return 'bg-green-100 text-green-800';
      case 'vrai_faux': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center space-x-2 mb-2">
          <h2 className="text-xl font-bold">{evaluation.titre}</h2>
          <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(evaluation.type)}`}>
            {evaluation.type === 'qcm' ? 'QCM' : 
             evaluation.type === 'redaction' ? 'Rédaction' : 'Vrai/Faux'}
          </span>
          {isCompleted && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
              Complétée
            </span>
          )}
        </div>
        <p className="text-gray-600">{evaluation.description}</p>
      </div>
      
      {/* Informations sur l'évaluation */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Informations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Date limite</p>
            <p className="font-medium">{formatDate(evaluation.dateLimit)}</p>
          </div>
          <div>
            <p className="text-gray-500">Nombre de questions</p>
            <p className="font-medium">{evaluation.questions.length}</p>
          </div>
          {evaluation.duree && (
            <div>
              <p className="text-gray-500">Durée</p>
              <p className="font-medium">{evaluation.duree} minutes</p>
            </div>
          )}
          {evaluation.pointsTotal && (
            <div>
              <p className="text-gray-500">Points totaux</p>
              <p className="font-medium">{evaluation.pointsTotal} points</p>
            </div>
          )}
          {userRole === 'etudiant' && (
            <div>
              <p className="text-gray-500">Tentatives autorisées</p>
              <p className="font-medium">{evaluation.allowRetake ? 'Multiples' : 'Une seule'}</p>
            </div>
          )}
          {userRole === 'professeur' && (
            <div>
              <p className="text-gray-500">Afficher les réponses correctes</p>
              <p className="font-medium">{evaluation.showCorrectAnswers ? 'Oui' : 'Non'}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Aperçu des questions pour les professeurs uniquement */}
      {userRole === 'professeur' && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Questions ({evaluation.questions.length})</h3>
          <div className="space-y-3">
            {evaluation.questions.map((question, index) => (
              <div key={question.id} className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Q{index + 1}.</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      question.type === 'qcm' ? 'bg-blue-100 text-blue-800' :
                      question.type === 'redaction' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {question.type === 'qcm' ? 'QCM' : 
                      question.type === 'redaction' ? 'Rédaction' : 'Vrai/Faux'}
                    </span>
                  </div>
                  {question.points && (
                    <span className="text-sm text-gray-500">{question.points} pts</span>
                  )}
                </div>
                <p className="mt-2">{question.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Pour les étudiants, afficher un message sur l'évaluation */}
      {userRole === 'etudiant' && !isCompleted && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Informations importantes</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>Cette évaluation comporte {evaluation.questions.length} questions</li>
            {evaluation.duree && <li>Vous disposez de {evaluation.duree} minutes pour la compléter</li>}
            <li>Date limite de soumission: {formatDate(evaluation.dateLimit)}</li>
            {!evaluation.allowRetake && <li>Vous ne pourrez passer cette évaluation qu'une seule fois</li>}
          </ul>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        
        <div className="flex space-x-2">
          {userRole === 'etudiant' ? (
            <>
              {isCompleted ? (
                <Button 
                  variant="primary" 
                  onClick={onViewResults}
                >
                  Voir les résultats
                </Button>
              ) : canTakeEvaluation ? (
                <Button 
                  variant="primary" 
                  onClick={onTakeEvaluation}
                >
                  Commencer l'évaluation
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  disabled
                >
                  Évaluation expirée
                </Button>
              )}
            </>
          ) : (
            <>
              <Button 
                variant="secondary" 
                onClick={onEditEvaluation}
              >
                Modifier
              </Button>
              <Button 
                variant="danger" 
                onClick={onDeleteEvaluation}
              >
                Supprimer
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};