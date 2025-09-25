export interface Question {
  id: string;
  type: 'multiple-choice' | 'text';
  question: string;
  options?: string[];
  required: boolean;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isActive: boolean;
  createdAt: Date;
  responses: FormResponse[];
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, string | string[]>;
  submittedAt: Date;
}

export interface StatsSummary {
  totalResponses: number;
  questionStats: Record<string, {
    type: 'multiple-choice' | 'text';
    question: string;
    responses: Record<string, number> | string[];
  }>;
}