// src/components/evaluations/EvaluationList.tsx
import React, { useState, useMemo } from 'react';
import { EvaluationCard } from './EvaluationCard';
import { EvaluationDetails } from './EvaluationDetails';
import { Evaluation, UserRole } from '../../types/evaluations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EvaluationListProps {
  evaluations: Evaluation[];
  userRole: UserRole;
  onEdit: (id: string) => void;
  onRespond?: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EvaluationList: React.FC<EvaluationListProps> = ({ 
  evaluations, 
  userRole, 
  onEdit, 
  onRespond,
  onDelete
}) => {
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleViewDetails = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
  };

  const handleBack = () => {
    setSelectedEvaluation(null);
  };

  const handleEdit = () => {
    if (selectedEvaluation) {
      onEdit(selectedEvaluation.id);
      setSelectedEvaluation(null);
    }
  };

  const handleDelete = () => {
    if (selectedEvaluation) {
      onDelete(selectedEvaluation.id);
      setSelectedEvaluation(null);
    }
  };

  const handleSortChange = (field: 'date' | 'title') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedEvaluations = useMemo(() => {
    const today = new Date();
    
    // Filtrer par type (à venir/passées)
    let filtered = [...evaluations];
    if (filterType === 'upcoming') {
      filtered = filtered.filter(e => new Date(e.dateLimit) > today);
    } else if (filterType === 'past') {
      filtered = filtered.filter(e => new Date(e.dateLimit) <= today);
    }
    
    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.titre.toLowerCase().includes(query) || 
        e.description.toLowerCase().includes(query)
      );
    }
    
    // Trier
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.dateLimit).getTime();
        const dateB = new Date(b.dateLimit).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const titleA = a.titre.toLowerCase();
        const titleB = b.titre.toLowerCase();
        return sortOrder === 'asc' 
          ? titleA.localeCompare(titleB) 
          : titleB.localeCompare(titleA);
      }
    });
  }, [evaluations, filterType, searchQuery, sortBy, sortOrder]);

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  // Compter les évaluations à venir et passées
  const today = new Date();
  const upcomingCount = evaluations.filter(e => new Date(e.dateLimit) > today).length;
  const pastCount = evaluations.filter(e => new Date(e.dateLimit) <= today).length;

  if (selectedEvaluation) {
    return (
      <EvaluationDetails 
        evaluation={selectedEvaluation}
        onEdit={userRole === 'Professeur' ? handleEdit : undefined}
        onDelete={userRole === 'Professeur' ? handleDelete : undefined}
        onBack={handleBack}
        onRespond={userRole === 'Etudiant' && onRespond ? () => onRespond(selectedEvaluation.id) : undefined}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Liste des évaluations</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une évaluation..."
              className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

        <div className="flex justify-between items-center">
          {/* Filtres */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              className={`px-4 py-2 ${filterType === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setFilterType('all')}
            >
              Toutes ({evaluations.length})
            </button>
            <button
              className={`px-4 py-2 ${filterType === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setFilterType('upcoming')}
            >
              À venir ({upcomingCount})
            </button>
            <button
              className={`px-4 py-2 ${filterType === 'past' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setFilterType('past')}
            >
              Passées ({pastCount})
            </button>
          </div>

          {/* Options de tri */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Trier par:</span>
            <div className="flex border rounded-lg overflow-hidden">
              <button
                className={`px-3 py-1 text-sm ${sortBy === 'date' ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                onClick={() => handleSortChange('date')}
              >
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                className={`px-3 py-1 text-sm ${sortBy === 'title' ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                onClick={() => handleSortChange('title')}
              >
                Titre {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredAndSortedEvaluations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-2">Aucune évaluation trouvée.</p>
            <p className="text-sm text-gray-400">
              {searchQuery ? "Essayez de modifier vos critères de recherche." : 
                filterType !== 'all' ? "Essayez de changer le filtre." : 
                "Aucune évaluation n'a été créée."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedEvaluations.map(evaluation => (
              <div key={evaluation.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{evaluation.titre}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          evaluation.type === 'qcm' ? 'bg-blue-100 text-blue-800' :
                          evaluation.type === 'redaction' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {evaluation.type === 'qcm' ? 'QCM' : 
                          evaluation.type === 'redaction' ? 'Rédaction' : 'Vrai/Faux'}
                        </span>
                        {new Date(evaluation.dateLimit) < today ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                            Terminée
                          </span>
                        ) : new Date(evaluation.dateLimit).getTime() - today.getTime() < 3 * 24 * 60 * 60 * 1000 ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                            Échéance proche
                          </span>
                        ) : null}
                      </div>
                      <p className="text-gray-600">{evaluation.description.length > 120 
                        ? `${evaluation.description.substring(0, 120)}...` 
                        : evaluation.description}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {formatDate(evaluation.dateLimit)}
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                          </svg>
                          {evaluation.questions.length} question{evaluation.questions.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => handleViewDetails(evaluation)}
                      >
                        Voir détails
                      </button>
                      {userRole === 'Professeur' && (
                        <>
                          <button
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
                            onClick={() => onEdit(evaluation.id)}
                          >
                            Modifier
                          </button>
                          <button
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
                            onClick={() => onDelete(evaluation.id)}
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                      {userRole === 'Etudiant' && onRespond && new Date(evaluation.dateLimit) > today && (
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                          onClick={() => onRespond(evaluation.id)}
                        >
                          Répondre
                        </button>
                      )}
                    </div>
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