import React from 'react';
import { UserRole } from '../../types/evaluations';

interface NavigationProps {
  activeTab: string;
  userRole: UserRole;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, userRole, onTabChange }) => {
  return (
    <nav className="bg-blue-700 text-white p-2">
      <div className="flex space-x-4">
        <button 
          className={`px-4 py-2 rounded-t ${activeTab === 'dashboard' ? 'bg-white text-blue-800' : ''}`}
          onClick={() => onTabChange('dashboard')}
        >
          Tableau de bord
        </button>
        
        {userRole === 'professeur' && (
          <button 
            className={`px-4 py-2 rounded-t ${activeTab === 'create' ? 'bg-white text-blue-800' : ''}`}
            onClick={() => onTabChange('create')}
          >
            Créer une évaluation
          </button>
        )}
        
        <button 
          className={`px-4 py-2 rounded-t ${activeTab === 'list' ? 'bg-white text-blue-800' : ''}`}
          onClick={() => onTabChange('list')}
        >
          Liste des évaluations
        </button>
        
        {userRole === 'professeur' && (
          <button 
            className={`px-4 py-2 rounded-t ${activeTab === 'results' ? 'bg-white text-blue-800' : ''}`}
            onClick={() => onTabChange('results')}
          >
            Résultats
          </button>
        )}
      </div>
    </nav>
  );
};