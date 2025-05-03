// src/components/evaluations/EvaluationCard.tsx
import React from 'react';
import { Button } from '../common/Button';
import { Evaluation, UserRole } from '../../types/evaluations';

interface EvaluationCardProps {
  evaluation: Evaluation;
  userRole: UserRole;
  onEdit?: (id: string) => void;
  onRespond?: (id: string) => void;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ 
  evaluation, 
  userRole, 
  onEdit, 
  onRespond 
}) => {
  const typeLabels = {
    qcm: 'QCM',
    redaction: 'Rédaction',
    vrai_faux: 'Vrai/Faux'
  };
  
  return (
    <div className="border border-gray-200 rounded p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{evaluation.titre}</h3>
          <p className="text-gray-600">{evaluation.description}</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
            {typeLabels[evaluation.type]}
          </span>
          <p className="text-sm text-gray-500 mt-1">
            Date limite: {new Date(evaluation.dateLimit).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        {userRole === 'professeur' ? (
          <Button variant="primary" size="sm" onClick={() => onEdit && onEdit(evaluation.id)}>
            Modifier
          </Button>
        ) : (
          <Button variant="success" size="sm" onClick={() => onRespond && onRespond(evaluation.id)}>
            Répondre
          </Button>
        )}
      </div>
    </div>
  );
};