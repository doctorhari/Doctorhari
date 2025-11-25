export type SubjectCategory = 'RANK_BUILDING' | 'RANK_MAINTAINING' | 'RANK_DECIDING';

export type ExamMode = 'NEET_PG' | 'INI_CET';

export interface Subject {
  id: string;
  name: string;
  category: SubjectCategory;
}

export interface SubjectScore {
  subjectId: string;
  correct?: number;
  wrong?: number;
  unattempted?: number; // Optional tracking
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
}

export interface GrandTest {
  id: string;
  name: string; // e.g., GT1
  date: string;
  mode: ExamMode;
  scores: Record<string, SubjectScore>; // keyed by subjectId
}

export interface AnalysisResult {
  text: string;
}