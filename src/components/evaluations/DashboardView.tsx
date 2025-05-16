
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Evaluation, UserRole } from '../../types/evaluations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardViewProps {
  evaluations: Evaluation[];
  userRole: UserRole;
  onCreateClick: () => void;
  onListClick: () => void;
  onViewEvaluation: (id: string) => void;
  onEditEvaluation?: (id: string) => void;
  onDeleteEvaluation?: (id: string) => void;
  onTakeEvaluation?: (id: string) => void; // Nouvelle prop pour répondre à l'évaluation
  onViewResults?: (id: string) => void; // Nouvelle prop pour voir les résultats
  completedEvaluationIds?: string[]; // Liste des évaluations complétées par l'étudiant
  currentUser: {};
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  evaluations, 
  userRole, 
  onCreateClick, 
  onListClick,
  onViewEvaluation,
  onEditEvaluation,
  onDeleteEvaluation,
  onTakeEvaluation,
  onViewResults,
  currentUser,
  completedEvaluationIds = []
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const today = new Date();
  
  const upcomingEvaluations = evaluations.filter(e => new Date(e.date_line) > today);
  // const pastEvaluations = evaluations.filter(e => new Date(e.date_line) <= today);
  const pastEvaluations = userRole === "Professeur" ? evaluations.filter(e => new Date(e.date_line) <= today) : evaluations.filter(e => e?.evaluation_results.find(ue=>ue?.student === currentUser?.id)?.completed === true);
  
  const getFilteredEvaluations = () => {
    let filtered = evaluations;
    
    // Filtre par onglet
    if (activeTab === 'upcoming') {
      filtered = upcomingEvaluations;
    } else if (activeTab === 'past') {
      filtered = pastEvaluations;
    }
    
    // Filtre par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(term) || 
        e.description.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };
  
  const filteredEvaluations = getFilteredEvaluations();
  
  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  // const allEvaluationsUser = 
  
  // Calculer les statistiques
  const stats = {
    total: evaluations.length,
    upcoming: upcomingEvaluations.length,
    past: pastEvaluations.length,
    completionRate: userRole === 'Etudiant' 
      ? pastEvaluations.length > 0 
        ? Math.round((pastEvaluations.length / evaluations.length) * 100) 
        : 0
      : evaluations.length > 0 
        ? Math.round((pastEvaluations.length / evaluations.length) * 100) 
        : 0
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
  
  // Fonction pour déterminer si une date limite est proche (moins de 3 jours)
  const isDeadlineApproaching = (dateLimit: string) => {
    const limitDate = new Date(dateLimit);
    const diffTime = limitDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
  };

  // Vérifier si une évaluation a été complétée par l'étudiant
  const isEvaluationCompleted = (evaluationId: string) => {
    return completedEvaluationIds.includes(evaluationId);
  };
  
  // Vérifier si l'étudiant peut encore répondre à l'évaluation
  const canTakeEvaluation = (dateLimit: string) => {
    const limitDate = new Date(dateLimit);
    return today <= limitDate;
  };
  return (
    <div className="space-y-6">
      {/* En-tête et statistiques */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Tableau de bord</h2>
          {userRole === 'Professeur' && (
            <Button 
              variant="primary"
              onClick={onCreateClick}
            >
              Créer une évaluation
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h3 className="font-bold text-blue-800">Total</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-gray-600">
              {userRole === 'Etudiant' ? 'Évaluations disponibles' : 'Évaluations créées'}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h3 className="font-bold text-green-800">À venir</h3>
            <p className="text-2xl font-bold">{stats.upcoming}</p>
            <p className="text-gray-600">Évaluations en attente</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded border border-amber-200">
            <h3 className="font-bold text-amber-800">Passées</h3>
            <p className="text-2xl font-bold">{stats.past}</p>
            <p className="text-gray-600">Évaluations terminées</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded border border-purple-200">
            <h3 className="font-bold text-purple-800">Taux de complétion</h3>
            <p className="text-2xl font-bold">{stats.completionRate}%</p>
            <p className="text-gray-600">
              {userRole === 'Etudiant' ? 'Évaluations complétées' : 'Évaluations terminées'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Liste des évaluations */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {userRole === 'Etudiant' ? 'Mes évaluations à passées' : 'Mes évaluations'}
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une évaluation..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
        
        {/* Onglets de filtrage */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            Toutes ({evaluations.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'upcoming' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            À venir ({upcomingEvaluations.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'past' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('past')}
          >
            Passées ({pastEvaluations.length})
          </button>
        </div>
        
        {filteredEvaluations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Aucune évaluation trouvée</p>
            {userRole === 'Professeur' && (
              <Button
                variant="primary"
                onClick={onCreateClick}
                className="mt-4"
              >
                Créer votre première évaluation
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvaluations.map(evaluation => (
              <div 
                key={evaluation.id} 
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{evaluation.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(evaluation.type)}`}>
                        {evaluation.type === 'qcm' ? 'QCM' : 
                        evaluation.type === 'redaction' ? 'Rédaction' : 'Vrai/Faux'}
                      </span>
                      {isDeadlineApproaching(evaluation.date_line) && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                          Échéance proche
                        </span>
                      )}
                      {userRole === 'Etudiant' && isEvaluationCompleted(evaluation.id) && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          Complétée
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{evaluation.description.substring(0, 100)}...</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>Date limite: {formatDate(evaluation.date_line)}</span>
                      <span className="mx-2">•</span>
                      <span>{evaluation.questions.length} question{evaluation.questions.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 items-start">
                    {/* Boutons adaptés selon le rôle utilisateur */}
                    {userRole === 'Etudiant' ? (
                      <>
                        {isEvaluationCompleted(evaluation.id) ? (
                          // Si l'évaluation est complétée, afficher les résultats
                          // <Button
                          //   variant="secondary"
                          //   size="sm"
                          //   onClick={() => onViewResults && onViewResults(evaluation.id)}
                          // >
                          //   Voir résultats
                          // </Button>
                          ""
                        ) : canTakeEvaluation(evaluation.date_line) ? (
                          // Si la date limite n'est pas dépassée, permettre de répondre
                          (
                            evaluation?.evaluation_results?.length === 0 ||
                            !evaluation.evaluation_results?.some(ue => ue?.student === currentUser?.id) ||
                            evaluation.evaluation_results?.find(ue => ue?.student === currentUser?.id)?.completed === false
                          ) ?
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onTakeEvaluation && onTakeEvaluation(evaluation.id)}
                          >
                            Répondre
                          </Button>
                          :
                          <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onViewResults && onViewResults(evaluation.id)}
                        >
                          Voir résultats
                        </Button>
                        ) : (
                          // Si la date limite est dépassée, désactiver le bouton
                          <Button
                            variant=""
                            size="sm"
                            disabled
                            className='text-red-500'
                          >
                            Expirée
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onViewEvaluation(evaluation.id)}
                        >
                          Voir détails
                        </Button>
                      </>
                    ) : (
                      // Interface pour les professeurs et les admins
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onViewEvaluation(evaluation.id)}
                        >
                          Voir
                        </Button>
                        {/* <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onEditEvaluation && onEditEvaluation(evaluation.id)}
                        >
                          Modifier
                        </Button> */}
                        {/* <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDeleteEvaluation && onDeleteEvaluation(evaluation.id)}
                        >
                          Supprimer
                        </Button> */}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};