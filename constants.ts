import { Subject, SubjectCategory } from './types';

export const CATEGORIES: Record<SubjectCategory, string> = {
  RANK_BUILDING: 'Rank Building',
  RANK_MAINTAINING: 'Rank Maintaining',
  RANK_DECIDING: 'Rank Deciding',
};

export const SUBJECTS: Subject[] = [
  // Rank Building
  { id: 'anat', name: 'Anatomy', category: 'RANK_BUILDING' },
  { id: 'physio', name: 'Physiology', category: 'RANK_BUILDING' },
  { id: 'biochem', name: 'Biochemistry', category: 'RANK_BUILDING' },
  { id: 'patho', name: 'Pathology', category: 'RANK_BUILDING' },
  { id: 'micro', name: 'Microbiology', category: 'RANK_BUILDING' },
  { id: 'pharma', name: 'Pharmacology', category: 'RANK_BUILDING' },
  { id: 'fmt', name: 'FMT', category: 'RANK_BUILDING' },
  { id: 'paeds', name: 'Pediatrics', category: 'RANK_BUILDING' },

  // Rank Maintaining
  { id: 'med', name: 'Medicine', category: 'RANK_MAINTAINING' },
  { id: 'surg', name: 'Surgery', category: 'RANK_MAINTAINING' },
  { id: 'obg', name: 'OBG', category: 'RANK_MAINTAINING' },
  { id: 'psm', name: 'PSM', category: 'RANK_MAINTAINING' },

  // Rank Deciding
  { id: 'eye', name: 'Ophthalmology', category: 'RANK_DECIDING' },
  { id: 'ent', name: 'ENT', category: 'RANK_DECIDING' },
  { id: 'ortho', name: 'Orthopedics', category: 'RANK_DECIDING' },
  { id: 'derma', name: 'Dermatology', category: 'RANK_DECIDING' },
  { id: 'psych', name: 'Psychiatry', category: 'RANK_DECIDING' },
  { id: 'radio', name: 'Radiology', category: 'RANK_DECIDING' },
  { id: 'anaes', name: 'Anesthesia', category: 'RANK_DECIDING' },
];

export const INITIAL_TESTS_DATA_KEY = 'medrank_tests_data';
