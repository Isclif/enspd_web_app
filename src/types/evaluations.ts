// types/evaluations.ts

export type UserRole = 'Etudiant' | 'Professeur' | 'Admin';

export type QuestionType = 'qcm' | 'redaction' | 'vrai_faux';

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[]; // Pour les QCM
  correctAnswer?: string | string[]; // Réponse correcte (chaîne pour vrai_faux et redaction, tableau pour qcm)
  points?: number; // Points attribués à la question
}

export interface Response {
  questionId: string;
  evaluationId: string;
  responseContent: string | string[]; // Contenu de la réponse (string pour redaction/vrai_faux, string[] pour QCM)
  isCorrect: boolean; // Si la réponse est correcte
  score: number; // Score obtenu pour cette réponse
  feedback?: string; // Commentaire du professeur (optionnel)
  submittedAt?: Date; // Date de soumission
}

export interface Evaluation {
  id: string;
  titre: string;
  description: string;
  type: QuestionType | 'mixte'; // Le type principal d'évaluation ou mixte si plusieurs types
  dateCreation: string;
  dateLimit: string; // Date limite de soumission
  duree?: number; // Durée en minutes (optionnel)
  questions: Question[];
  auteurId: string; // ID du professeur
  classeId?: string; // ID de la classe (optionnel)
  pointsTotal?: number; // Points totaux
  allowRetake?: boolean; // Permettre de refaire l'évaluation
  showCorrectAnswers?: boolean; // Montrer les réponses correctes après soumission
}

export interface StudentEvaluation {
  evaluationId: string;
  studentId: string;
  status: 'pending' | 'in_progress' | 'completed';
  completed: boolean;
  startedAt?: Date;
  submittedAt?: Date;
  score?: number;
  responses: any;
  submitted_at: Date;
}

export interface StudentNotes {

}