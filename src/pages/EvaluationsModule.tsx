import React, { useState, useEffect } from 'react';
import { DashboardView } from '../components/evaluations/DashboardView';
import { EvaluationDetails } from '../components/evaluations/EvaluationDetails';
import { EvaluationResponse } from '../components/evaluations/EvaluationResponse';
import { EvaluationResults } from '../components/evaluations/EvaluationResults';
import { StudentEvaluation, UserRole } from '../types/evaluations';
import { CreateEvaluation, Evaluation } from '../components/evaluations/CreateEvaluation';

// Ce composant serait normalement connecté à une API pour récupérer et sauvegarder les données
export const EvaluationContainer: React.FC = () => {
  // État pour suivre le mode d'affichage
  const [mode, setMode] = useState<'dashboard' | 'view' | 'take' | 'results' | 'create'>('dashboard');
  
  // État pour l'utilisateur actuel (dans une vraie application, viendrait de l'authentification)
  const [userRole, setUserRole] = useState<UserRole>('etudiant');
  
  // État pour les évaluations (simulé, viendrait normalement d'une API)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  
  // Évaluation actuellement sélectionnée
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  
  // Réponses de l'étudiant (simulé)
  const [studentEvaluations, setStudentEvaluations] = useState<StudentEvaluation[]>([]);
  
  // ID de l'étudiant actuel (simulé)
  const currentStudentId = 'student123';
  
  // Charger les données simulées
  useEffect(() => {
    // Simuler le chargement des évaluations
    // Dans une vraie application, cela ferait un appel API
    const mockEvaluations: Evaluation[] = [
      {
        id: '1',
        titre: 'Quiz sur les bases de React',
        description: 'Évaluation des concepts fondamentaux de React',
        type: 'qcm',
        dateCreation: '2025-04-15',
        dateLimit: '2025-05-15',
        duree: 30,
        auteurId: 'prof123',
        pointsTotal: 20,
        allowRetake: false,
        showCorrectAnswers: true,
        questions: [
          {
            id: 'q1',
            type: 'qcm',
            content: 'Quel hook permet de gérer l\'état local dans un composant fonctionnel ?',
            options: ['useEffect', 'useState', 'useContext', 'useReducer'],
            correctAnswer: ['useState'],
            points: 2
          },
          {
            id: 'q2',
            type: 'vrai_faux',
            content: 'React utilise un DOM virtuel pour optimiser les mises à jour.',
            correctAnswer: 'vrai',
            points: 1
          },
          {
            id: 'q3',
            type: 'redaction',
            content: 'Expliquez la différence entre les composants à état et les composants sans état.',
            correctAnswer: 'Les composants à état (stateful) gèrent leur propre état interne, tandis que les composants sans état (stateless) reçoivent uniquement des props.',
            points: 5
          }
        ]
      },
      {
        id: '2',
        titre: 'Evaluation sur les bases de données',
        description: 'Test sur les concepts de base des bases de données relationnelles',
        type: 'mixte',
        dateCreation: '2025-04-10',
        dateLimit: '2025-04-24',
        duree: 45,
        auteurId: 'prof123',
        pointsTotal: 25,
        allowRetake: true,
        showCorrectAnswers: false,
        questions: [
          {
            id: 'q1',
            type: 'qcm',
            content: 'Quels sont les types de jointures en SQL ?',
            options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN'],
            correctAnswer: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN'],
            points: 3
          },
          {
            id: 'q2',
            type: 'vrai_faux',
            content: 'La normalisation diminue la redondance des données.',
            correctAnswer: 'vrai',
            points: 2
          }
        ]
      }
    ];
    
    setEvaluations(mockEvaluations);
    
    // Simuler les évaluations déjà complétées par l'étudiant
    const mockStudentEvaluations: StudentEvaluation[] = [
      {
        evaluationId: '2',
        studentId: currentStudentId,
        status: 'completed',
        startedAt: new Date('2025-04-22T14:30:00'),
        submittedAt: new Date('2025-04-22T15:10:00'),
        score: 20,
        responses: [
          {
            questionId: 'q1',
            evaluationId: '2',
            responseContent: ['INNER JOIN', 'LEFT JOIN', 'FULL JOIN'],
            isCorrect: false,
            score: 2,
            feedback: 'Réponse incomplète, manque RIGHT JOIN et CROSS JOIN'
          },
          {
            questionId: 'q2',
            evaluationId: '2',
            responseContent: 'vrai',
            isCorrect: true,
            score: 2
          }
        ]
      }
    ];
    
    setStudentEvaluations(mockStudentEvaluations);
  }, []);
  
  // Obtenir la liste des IDs d'évaluations complétées
  const completedEvaluationIds = studentEvaluations
    .filter(se => se.status === 'completed')
    .map(se => se.evaluationId);
  
  // Gérer le clic pour voir une évaluation
  const handleViewEvaluation = (id: string) => {
    const evaluation = evaluations.find(e => e.id === id);
    if (evaluation) {
      setSelectedEvaluation(evaluation);
      setMode('view');
    }
  };
  
  // Gérer le clic pour passer une évaluation
  const handleTakeEvaluation = (id: string) => {
    const evaluation = evaluations.find(e => e.id === id);
    if (evaluation) {
      setSelectedEvaluation(evaluation);
      setMode('take');
      
      // Dans une vraie application, on créerait aussi une entrée dans la base de données
      // pour indiquer que l'étudiant a commencé l'évaluation
    }
  };
  
  // Gérer le clic pour voir les résultats d'une évaluation
  const handleViewResults = (id: string) => {
    const evaluation = evaluations.find(e => e.id === id);
    if (evaluation) {
      setSelectedEvaluation(evaluation);
      setMode('results');
    }
  };
  
  // Gérer la soumission des réponses d'une évaluation
  const handleSubmitEvaluation = (responses: any[]) => {
    if (!selectedEvaluation) return;
    
    // Dans une vraie application, cela enverrait les réponses à l'API
    
    // Simuler l'évaluation automatique (pour les QCM et Vrai/Faux)
    const scoredResponses = responses.map(response => {
      const question = selectedEvaluation.questions.find(q => q.id === response.questionId);
      
      let isCorrect = false;
      let score = 0;
      
      if (question) {
        if (question.type === 'qcm') {
          // Pour les QCM, vérifier si toutes les réponses sont correctes
          const studentAnswers = response.responseContent as string[];
          const correctAnswers = question.correctAnswer as string[];
          
          isCorrect = 
            studentAnswers.length === correctAnswers.length && 
            studentAnswers.every(a => correctAnswers.includes(a));
          
          if (isCorrect) {
            score = question.points || 0;
          } else {
            // Attribution partielle des points pour les réponses partiellement correctes
            const correctCount = studentAnswers.filter(a => correctAnswers.includes(a)).length;
            score = Math.floor((correctCount / correctAnswers.length) * (question.points || 0));
          }
        } else if (question.type === 'vrai_faux') {
          // Pour Vrai/Faux, c'est soit tout juste, soit tout faux
          isCorrect = response.responseContent === question.correctAnswer;
          score = isCorrect ? (question.points || 0) : 0;
        }
        // Pour les questions de rédaction, le score sera attribué manuellement par l'enseignant
      }
      
      return {
        ...response,
        isCorrect,
        score
      };
    });
    
    // Calculer le score total
    const totalScore = scoredResponses.reduce((sum, r) => sum + r.score, 0);
    
    // Créer une nouvelle entrée d'évaluation complétée
    const newStudentEvaluation: StudentEvaluation = {
      evaluationId: selectedEvaluation.id,
      studentId: currentStudentId,
      status: 'completed',
      startedAt: new Date(), // Dans une vraie app, on utiliserait le moment réel du début
      submittedAt: new Date(),
      score: totalScore,
      responses: scoredResponses
    };
    
    // Mettre à jour l'état
    setStudentEvaluations(prev => [...prev, newStudentEvaluation]);
    
    // Afficher les résultats
    setMode('results');
  };
  
  // Modifier une évaluation (pour les professeurs)
  const handleEditEvaluation = (id: string) => {
    // Dans une vraie application, cela redirigerait vers un formulaire d'édition
    console.log('Modifier l\'évaluation', id);
  };
  
  // Supprimer une évaluation (pour les professeurs)
  const handleDeleteEvaluation = (id: string) => {
    // Dans une vraie application, cela enverrait une requête à l'API
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) {
      setEvaluations(prev => prev.filter(e => e.id !== id));
    }
  };
  
  // Créer une nouvelle évaluation (pour les professeurs)
  const handleCreateEvaluation = () => {
    // Changer le mode pour afficher le formulaire de création
    setMode('create');
  };
  
  // Gérer la soumission d'une nouvelle évaluation
  const handleSubmitNewEvaluation = (newEvaluation: Omit<Evaluation, 'id' | 'createdAt'>) => {
    // Dans une vraie application, cela enverrait la nouvelle évaluation à l'API
    
    // Simuler l'ajout de l'évaluation avec un ID généré
    const evaluationWithId: Evaluation = {
      ...newEvaluation,
      id: `${evaluations.length + 1}`, // Simple incrémentation pour l'ID
      auteurId: 'prof123', // ID du professeur connecté
      dateCreation: new Date().toISOString().split('T')[0], // Date du jour
      pointsTotal: newEvaluation.questions.reduce((sum, q) => sum + q.points, 0), // Calculer le total des points
      duree: 30, // Valeur par défaut
      allowRetake: false, // Valeur par défaut
      showCorrectAnswers: true // Valeur par défaut
    };
    
    // Ajouter la nouvelle évaluation à la liste
    setEvaluations(prev => [...prev, evaluationWithId]);
    
    // Retourner au tableau de bord
    setMode('dashboard');
  };
  
  // Obtenir les réponses de l'étudiant pour l'évaluation sélectionnée
  const getStudentResponses = () => {
    if (!selectedEvaluation) return [];
    
    const studentEval = studentEvaluations.find(
      se => se.evaluationId === selectedEvaluation.id && se.studentId === currentStudentId
    );
    
    return studentEval ? studentEval.responses : [];
  };
  
  // Vérifier si l'étudiant a déjà complété l'évaluation sélectionnée
  const isSelectedEvaluationCompleted = () => {
    if (!selectedEvaluation) return false;
    return completedEvaluationIds.includes(selectedEvaluation.id);
  };
  
  // Vérifier si l'étudiant peut passer l'évaluation sélectionnée
  const canTakeSelectedEvaluation = () => {
    if (!selectedEvaluation) return false;
    
    const today = new Date();
    const limitDate = new Date(selectedEvaluation.dateLimit);
    
    // Vérifier si la date limite n'est pas dépassée
    const isNotExpired = today <= limitDate;
    
    // Vérifier si l'étudiant n'a pas déjà complété l'évaluation
    // ou si l'évaluation permet de multiples tentatives
    const canTake = !isSelectedEvaluationCompleted() || selectedEvaluation.allowRetake;
    
    return isNotExpired && canTake;
  };
  
  // Fonctions pour basculer entre les modes du rôle utilisateur (pour la démonstration)
  const toggleUserRole = () => {
    setUserRole(prev => prev === 'etudiant' ? 'professeur' : 'etudiant');
  };
  
  return (
    <div className="container mx-auto p-4">
      {/* Bouton pour basculer entre les rôles (pour la démonstration uniquement) */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={toggleUserRole}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Mode: {userRole === 'etudiant' ? 'Étudiant' : 'Professeur'}
        </button>
      </div>
      
      {/* Afficher le composant approprié selon le mode */}
      {mode === 'dashboard' && (
        <DashboardView
          evaluations={evaluations}
          userRole={userRole}
          onCreateClick={handleCreateEvaluation}
          onListClick={() => {}}
          onViewEvaluation={handleViewEvaluation}
          onEditEvaluation={userRole === 'professeur' ? handleEditEvaluation : undefined}
          onDeleteEvaluation={userRole === 'professeur' ? handleDeleteEvaluation : undefined}
          onTakeEvaluation={userRole === 'etudiant' ? handleTakeEvaluation : undefined}
          onViewResults={userRole === 'etudiant' ? handleViewResults : undefined}
          completedEvaluationIds={completedEvaluationIds}
        />
      )}
      
      {mode === 'view' && selectedEvaluation && (
        <EvaluationDetails
          evaluation={selectedEvaluation}
          userRole={userRole}
          onBack={() => setMode('dashboard')}
          onTakeEvaluation={() => setMode('take')}
          onEditEvaluation={() => handleEditEvaluation(selectedEvaluation.id)}
          onDeleteEvaluation={() => handleDeleteEvaluation(selectedEvaluation.id)}
          canTakeEvaluation={canTakeSelectedEvaluation()}
          isCompleted={isSelectedEvaluationCompleted()}
          onViewResults={() => setMode('results')}
        />
      )}
      
      {mode === 'take' && selectedEvaluation && (
        <EvaluationResponse
          evaluation={selectedEvaluation}
          onSubmit={handleSubmitEvaluation}
          onCancel={() => setMode('dashboard')}
        />
      )}
      
      {mode === 'results' && selectedEvaluation && (
        <EvaluationResults
          evaluation={selectedEvaluation}
          responses={getStudentResponses()}
          userRole={userRole}
          onClose={() => setMode('dashboard')}
          onRetakeEvaluation={
            selectedEvaluation.allowRetake ? 
              () => setMode('take') : 
              undefined
          }
        />
      )}
      
      {/* Rendu du composant CreateEvaluation */}
      {mode === 'create' && (
        <div className="container mx-auto p-4">
          <CreateEvaluation
            onSubmit={handleSubmitNewEvaluation}
          />
          <div className="mt-4">
            <button 
              onClick={() => setMode('dashboard')}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      )}
    </div>
  );
};