import React, { useState, useEffect } from 'react';
import { DashboardView } from '../components/evaluations/DashboardView';
import { EvaluationDetails } from '../components/evaluations/EvaluationDetails';
import { EvaluationResponse } from '../components/evaluations/EvaluationResponse';
import { EvaluationResults } from '../components/evaluations/EvaluationResults';
import { StudentEvaluation, StudentNotes, UserRole } from '../types/evaluations';
import { CreateEvaluation, Evaluation } from '../components/evaluations/CreateEvaluation';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import AuthUser from "../components/AuthUser/AuthUser";

import URLS from "../js/ConfigUrl"
import { useFetch } from "../js/useFetch"
import { ResultsView } from '../components/evaluations/ResultsView';

export interface TakenEvaluation {
  evaluation: string;
  score: number; 
  completed: string;
  duration: string;
}

export interface CurrentEvaluation {
  id: string;
  score: number; 
  completed: boolean;
  duration: string;
  questions: any;
  student: string;
}

// Ce composant serait normalement connecté à une API pour récupérer et sauvegarder les données
export const EvaluationContainer: React.FC = () => {

  const {token, user} = AuthUser()

  const { handlePost, handleFetch, handlePatch } = useFetch()
  
  // État pour suivre le mode d'affichage
  const [mode, setMode] = useState<'dashboard' | 'view' | 'take' | 'results' | 'create' | 'results_view'>('dashboard');
  
  // État pour l'utilisateur actuel (dans une vraie application, viendrait de l'authentification)
  const [userRole, setUserRole] = useState<UserRole>(user?.status);

  // console.log("user?.status", user?.status);
  
  // État pour les évaluations (simulé, viendrait normalement d'une API)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  // État pour les évaluations (simulé, viendrait normalement d'une API)
  const [selectedEvaluationResponse, setSelectedEvaluationResponse] = useState<Evaluation | null>(null);  
  
  // Évaluation actuellement sélectionnée
  const [selectedEvaluation, setSelectedEvaluation] = useState<CurrentEvaluation | null>(null);

  // État pour les évaluations (simulé, viendrait normalement d'une API)
  const [takenEvaluations, setTakenEvaluations] = useState<CurrentEvaluation[]>([]);

  // console.log("selectedEvaluation", selectedEvaluation);

  
  // Réponses de l'étudiant (simulé)
  const [studentEvaluations, setStudentEvaluations] = useState<StudentEvaluation[]>([]);

  // notes des etudiants
  const [studentNotes, setStudentsNotes] = useState<StudentNotes[]>([]);

  // Current taken evaluation
  const [takenEvalResultId, setTakenEvalResultId] = useState<string>();
  
  // ID de l'étudiant actuel (simulé)
  const currentStudentId = user;

  const [pendingEvaluationId, setPendingEvaluationId] = useState<number | null>(null);

  // Charger les evaluations

  let headersList = {
    "Authorization": `Bearer ${token}` 
  }

  const fetchEvaluations = async () => {
      try {
          const response = await fetch(`${URLS.API_BACK}/evaluations/`, {
              method: "GET",
              headers: headersList
          });
          if (!response.ok) {
              throw new Error('Erreur lors de la récupération des données');
          }
          const data: Evaluation[] = await response.json();
          setEvaluations(data);
      } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
      }
  };

  const fetchStudentsNotes = async () => {
    try {
        const response = await fetch(`${URLS.API_BACK}/student_results/`, {
            method: "GET",
            headers: headersList
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        const data: StudentNotes[] = await response.json();
        setStudentsNotes(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
};

  const fetchEvaluationsResult = async () => {
    try {
        const response = await fetch(`${URLS.API_BACK}/student_results/`, {
            method: "GET",
            headers: headersList
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        const data: CurrentEvaluation[] = await response.json();
        setTakenEvaluations(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
  };

  useEffect(()=>{
    fetchEvaluations()
    fetchEvaluationsResult()

    if(user.status === 'Professeur'){
      fetchStudentsNotes()
    }
  }, [])
  
  // Obtenir la liste des IDs d'évaluations complétées
  const completedEvaluationIds = studentEvaluations
    .filter(se => se.status === 'completed')
    .map(se => se.evaluationId);
  
  // Gérer le clic pour voir une évaluation
  const handleViewEvaluation = (id: string) => {
    const evaluation = evaluations.find(e => e.id === id);

    console.log("evaluation view", evaluation);
    
    if (evaluation) {
      setSelectedEvaluation(evaluation);
      setMode('view');
    }
  };

  // mettre a jour le temps de l'evaliuation
  const handleCreateTakenEvaluation = async (id: string) => {

    let evaluationUrl = `${URLS.API_BACK}/student_results/` 

    const evaluation = evaluations?.find(e => e.id === id);

    let data = {
      evaluation: evaluation?.id,
      score: 0,
      duration: evaluation?.duration
    }
    

    const response = await handlePost(evaluationUrl, data)

    if(response.status === 201){
      setTakenEvalResultId(response.id)
      fetchEvaluations()
      // handleTakeEvaluation(response.evaluation.id)
      setPendingEvaluationId(response.evaluation)
    } else if(response.status === 409){
      setTakenEvalResultId(response.result_id)
      // handleTakeEvaluation(response.evaluation_id)
      setPendingEvaluationId(response.evaluation_id)
    } else {
      console.error("error has ocurred");
    }
  };
  
  // Gérer le clic pour passer une évaluation
  const handleTakeEvaluation = (seldEvaluation: {}, userEval: {}) => {

    if (userEval) {
      setSelectedEvaluationResponse(seldEvaluation)
      setSelectedEvaluation(seldEvaluation);
      setMode('take');
    } else {
      console.log("non enregistrer", userEval)
    }
  };

  // console.log("selectedEvaluationResponse", selectedEvaluationResponse);

  // mettre a jour le temps de l'evaliuation
  const handleUpdateEvaluationConsommation = async (id: string, duration: string) => {

    let evaluationUrl = `${URLS.API_BACK}/student_results/${id}/` 

    let data = {
      duration
    }

    const response = await handlePatch(evaluationUrl, data)

    if(response.status === 200){
      console.log("duration modified");
    } else{
      console.error("duration not modified");
    }
  };

  
  useEffect(() => {
    
    const evaluationExist = evaluations.find(e => e.id === pendingEvaluationId);

    const userEvaluationExist = evaluationExist?.evaluation_results?.find((el)=>(el?.student === user.id))

    // console.log("userEvaluationExist", userEvaluationExist);
    
    if (pendingEvaluationId !== null && userEvaluationExist) {
      
      // console.log("entré", true);
      // console.log("userEvaluationExist", userEvaluationExist);
      // console.log("pendingEvaluationId", pendingEvaluationId);


      handleTakeEvaluation(evaluationExist, userEvaluationExist);

      setPendingEvaluationId(null);
    }

  }, [pendingEvaluationId, evaluations]);

  // console.log("takenEvaluations", takenEvaluations);

  // console.log("allEvaluations", evaluations);
  
  
  // Gérer le clic pour voir les résultats d'une évaluation
  const handleViewResults = (id: string) => {
    console.log("takenEvaluations", takenEvaluations);
    
    const evaluation = takenEvaluations.find(e => e.evaluation.id === id);
    if (evaluation) {
      setSelectedEvaluation(evaluation);
      setMode('results_view');
    }
  };
  
  // Gérer la soumission des réponses d'une évaluation
  const handleSubmitEvaluation = async (responses: any[]) => {

    if (!selectedEvaluation) return;

    console.log("user_responses",responses);
    
    
    // Dans une vraie application, cela enverrait les réponses à l'API
    
    // Correction de l'evaluation
    const scoredResponses = responses.map(response => {
      const question = selectedEvaluation?.questions.find((q) => q.id === response.questionId);
      
      let isCorrect = false;
      let score = 0;
      
      if (question) {
        if (question.type === 'qcm') {
          // Pour les QCM, vérifier si toutes les réponses sont correctes
          const studentAnswers = response.responseContent as string[];
          const correctAnswers = question.correct_answer as string[];
          
          isCorrect = 
            studentAnswers.length === correctAnswers.length && 
            studentAnswers.every(sa => correctAnswers.some(ca => ca.id === sa.id && ca.isCorrect === true))
            // studentAnswers.every(a => correctAnswers.includes(a));
          
          console.log("studentAnswers.every(sa => correctAnswers.some(ca => ca.isCorrect === sa.isCorrect))", studentAnswers.every(sa => correctAnswers.some(ca => ca.isCorrect === sa.isCorrect)));
          
          if (isCorrect) {
            score = question.points || 0;
          } else {
            // Attribution partielle des points pour les réponses partiellement correctes
            const correctCount = studentAnswers.filter(sa => correctAnswers.some(ca => ca.id === sa.id && ca.isCorrect === true)).length;
            score = Math.floor((correctCount / correctAnswers.length) * (question.points || 0));
          }
        } else if (question.type === 'vrai_faux') {
          // Pour Vrai/Faux, c'est soit tout juste, soit tout faux
          isCorrect = response.responseContent === question.correct_answer[0].text.toLowerCase();
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

    let evaluationUrl = `${URLS.API_BACK}/student_results/${scoredResponses[0].resultId}/` 

    let data: StudentEvaluation = {
      score: totalScore,
      completed: true,
      submitted_at: new Date(),
      responses: scoredResponses
    }

    const response = await handlePatch(evaluationUrl, data)

    if(response.status === 200){
      // Mettre à jour l'état
      setStudentEvaluations([data]);
      // setStudentEvaluations(prev => [...prev, data]);

      // fetchEvaluations()
      
      // Afficher les résultats
      setMode('results');
      console.log("duration modified");
    } else{
      console.error("duration not modified");
    }
    
    // Créer une nouvelle entrée d'évaluation complétée
    // const newStudentEvaluation: StudentEvaluation = {
    //   evaluationId: selectedEvaluation.id,
    //   studentId: currentStudentId,
    //   status: 'completed',
    //   startedAt: new Date(), // Dans une vraie app, on utiliserait le moment réel du début
    //   submittedAt: new Date(),
    //   score: totalScore,
    //   responses: scoredResponses
    // };
    
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
  const handleSubmitNewEvaluation = async (newEvaluation: Omit<Evaluation, 'id' | 'createdAt'>, course_id: string) => {
    
    const { questions, ...evaluationData } = newEvaluation;

    let evalUrl = `${URLS.API_BACK}/evaluations_create/${course_id}/` 
    let questionUrl = `${URLS.API_BACK}/questions_create/${course_id}/` 

    try {
      // Étape 1 : Créer l'évaluation
      const evalResponse = await handlePost(evalUrl, evaluationData);
  
      if (evalResponse.status === 201) {
        // const createdEvaluation = await evalResponse.json();
        const evaluation = evalResponse.id;
  
        // Étape 2 : Parcourir les questions
        const questionPromises = questions.map((question) => {
          let correct_answer: any [] = []

          question?.options.map((op)=>{
            if(op.isCorrect){
              correct_answer.push(op)
            }
          })

          console.log("correct_answer", correct_answer);
          

          const questionPayload = {
            ...question,
            evaluation,
            correct_answer
            // options: question.options.map(({ text, isCorrect }) => ({
            //   text,
            //   isCorrect
            // }))
          };

          return handlePost(questionUrl, questionPayload)
  
          // return fetch('/api/questions', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(questionPayload)
          // });
        });
  
        await Promise.all(questionPromises);
        console.log('Évaluation et questions créées avec succès');
      } else {
        console.error('Erreur lors de la création de l’évaluation');
      }
    } catch (error) {
      console.error('Erreur réseau ou serveur :', error);
    }

    // const response = handlePost(evalUrl, newEvaluation)
    
    // Dans une vraie application, cela enverrait la nouvelle évaluation à l'API
    
    // Simuler l'ajout de l'évaluation avec un ID généré
    // const evaluationWithId: Evaluation = {
    //   ...newEvaluation,
    //   id: `${evaluations.length + 1}`, // Simple incrémentation pour l'ID
    //   auteurId: 'prof123', // ID du professeur connecté
    //   dateCreation: new Date().toISOString().split('T')[0], // Date du jour
    //   pointsTotal: newEvaluation.questions.reduce((sum, q) => sum + q.points, 0), // Calculer le total des points
    //   duree: 30, // Valeur par défaut
    //   allowRetake: false, // Valeur par défaut
    //   showCorrectAnswers: true // Valeur par défaut
    // };
    
    // // Ajouter la nouvelle évaluation à la liste
    // setEvaluations(prev => [...prev, evaluationWithId]);

    fetchEvaluations()
    
    // Retourner au tableau de bord
    setMode('dashboard');
  };
  
  // Obtenir les réponses de l'étudiant pour l'évaluation sélectionnée
  const getStudentResponses = () => {
    if (!selectedEvaluation) return [];
    
    const studentEval = studentEvaluations.find(
      se => se.responses.find((el)=>el.evaluationId === selectedEvaluation.id)
      // se => se.evaluationId === selectedEvaluation.id && se.studentId === currentStudentId?.id
    );

    console.log("selectedEvaluation", selectedEvaluation);
    console.log("studentEval", studentEval);
    // console.log("studentEvaluations", studentEvaluations);

    
    
    return studentEval ? studentEval.responses : [];
  };

  // Obtenir les réponses de l'étudiant lorsqu'il veux les revoirs
  const getStudentResponsesReview = () => {
    if (!selectedEvaluation) return [];
    
    const studentEvalReview = selectedEvaluation.responses.filter((el)=>el.evaluationId === selectedEvaluation?.evaluation.id);

    console.log("selectedEvaluation", selectedEvaluation);
    console.log("studentEvalReview", studentEvalReview);
    // console.log("studentEvaluations", studentEvaluations);

    
    
    return studentEvalReview ? studentEvalReview : [];
  };
  
  // Vérifier si l'étudiant a déjà complété l'évaluation sélectionnée
  const isSelectedEvaluationCompleted = () => {
    if (!selectedEvaluation) return false;

    if   (
      selectedEvaluation?.evaluation_results?.length === 0 ||
      !selectedEvaluation.evaluation_results?.some(ue => ue?.student === user?.id) ||
      selectedEvaluation.evaluation_results?.find(ue => ue?.student === user?.id)?.completed === false
    ) {
      return false
    } else {
      return true
    }
    // return completedEvaluationIds.includes(selectedEvaluation.id);
  };
  
  // Vérifier si l'étudiant peut passer l'évaluation sélectionnée
  const canTakeSelectedEvaluation = () => {
    if (!selectedEvaluation) return false;
    
    const today = new Date();
    // const limitDate = new Date(selectedEvaluation.evaluation.date_line);
    const limitDate = new Date(selectedEvaluation.date_line);
    
    // Vérifier si la date limite n'est pas dépassée
    const isNotExpired = today <= limitDate;
    
    // Vérifier si l'étudiant n'a pas déjà complété l'évaluation
    // ou si l'évaluation permet de multiples tentatives
    // const canTake = !isSelectedEvaluationCompleted() || selectedEvaluation.evaluation.allow_retake;
    const canTake = !isSelectedEvaluationCompleted() || selectedEvaluation.allow_retake;
    
    return isNotExpired && canTake;
  };
  
  // Fonctions pour basculer entre les modes du rôle utilisateur (pour la démonstration)
  const toggleUserRole = () => {
    setUserRole(prev => prev === 'Etudiant' ? 'Professeur' : 'Etudiant');
  };
  
  return (
    <>
      <Breadcrumb pageName={`${"Evaluation"}`} />
      <div className="">
        {/* Bouton pour basculer entre les rôles (pour la démonstration uniquement) */}
        {/* <div className="mb-4 flex justify-end">
          <button
            onClick={toggleUserRole}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Mode: {userRole === 'Etudiant' ? 'Étudiant' : 'Professeur'}
          </button>
        </div> */}
        
        {/* Afficher le composant approprié selon le mode */}
        {mode === 'dashboard' && (
          <DashboardView
            evaluations={evaluations}
            userRole={userRole}
            onCreateClick={handleCreateEvaluation}
            onListClick={() => {}}
            onViewEvaluation={handleViewEvaluation}
            onEditEvaluation={userRole === 'Professeur' ? handleEditEvaluation : undefined}
            onDeleteEvaluation={userRole === 'Professeur' ? handleDeleteEvaluation : undefined}
            onTakeEvaluation={userRole === 'Etudiant' ? handleCreateTakenEvaluation : undefined}
            // onTakeEvaluation={userRole === 'Etudiant' ? handleTakeEvaluation : undefined}
            onViewResults={userRole === 'Etudiant' ? handleViewResults : undefined}
            completedEvaluationIds={completedEvaluationIds}
            currentUser={user}
            studentsResults={studentNotes}
          />
        )}
        
        {mode === 'view' && selectedEvaluation && (
          <EvaluationDetails
            evaluation={selectedEvaluation}
            userRole={userRole}
            onBack={() => setMode('dashboard')}
            onTakeEvaluation={(id: string) => {handleCreateTakenEvaluation(id)}}
            // onTakeEvaluation={(id: string) => {setMode('take'); handleTakeEvaluation(id)}}
            onEditEvaluation={() => handleEditEvaluation(selectedEvaluation.id)}
            onDeleteEvaluation={() => handleDeleteEvaluation(selectedEvaluation.id)}
            canTakeEvaluation={canTakeSelectedEvaluation()}
            isCompleted={isSelectedEvaluationCompleted()}
            onViewResults={() => {setMode('results_view'); handleViewResults(selectedEvaluation.id)}}
          />
        )}
        
        {mode === 'take' && selectedEvaluationResponse && (
          <EvaluationResponse
            evaluation={selectedEvaluationResponse}
            selectedTakenEvalResultId={takenEvalResultId}
            onSubmit={handleSubmitEvaluation}
            updateDuration={handleUpdateEvaluationConsommation}
            // createTakeEval={handleCreateTakenEvaluation}
            onCancel={() => {setMode('dashboard'); fetchEvaluations(); fetchEvaluationsResult()}}
            onFinish={() => {fetchEvaluations(); fetchEvaluationsResult()}}
            currentUser={user}
          />
        )}
        
        {mode === 'results' && selectedEvaluation && (
          <EvaluationResults
            evaluation={selectedEvaluation}
            responses={getStudentResponses()}
            userRole={userRole}
            onClose={() => {setMode('dashboard'), fetchEvaluations(); fetchEvaluationsResult()}}
            onRetakeEvaluation={
              selectedEvaluation.evaluation?.allow_retake ? 
                () => setMode('take') : 
                undefined
            }
          />
        )}

        {mode === 'results_view' && selectedEvaluation && (
          <ResultsView
            evaluation={selectedEvaluation}
            responses={getStudentResponsesReview()}
            userRole={userRole}
            onClose={() => {setMode('dashboard'), fetchEvaluations(); fetchEvaluationsResult()}}
            onRetakeEvaluation={
              selectedEvaluation.evaluation?.allow_retake ? 
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
    </>
  );
};