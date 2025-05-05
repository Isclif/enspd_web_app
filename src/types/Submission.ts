export interface Answer {
    questionId: string;
    value: string | string[] | Record<string, string>;
  }
  
  export interface Submission {
    id: string;
    examId: string;
    studentId: string;
    submittedAt: Date;
    answers: Answer[];
    score?: number;
    feedback?: string;
    timeTaken: number; // en secondes
  }
  
  export type RequestStatus = 'pending' | 'approved' | 'rejected';
  
  export interface ExamRequest {
    id: string;
    examId: string;
    studentId: string;
    requestedAt: Date;
    status: RequestStatus;
    professorMessage?: string;
  }