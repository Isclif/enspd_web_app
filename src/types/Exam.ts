export type QuestionType = 'multipleChoice' | 'singleChoice' | 'text' | 'trueOrFalse' | 'matching';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | string[] | Record<string, string>; // Différents formats selon le type
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  createdBy: string; // ID du professeur
  createdAt: Date;
  duration: number; // en minutes
  questions: Question[];
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
}