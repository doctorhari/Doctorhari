import React, { useState, useEffect } from 'react';
import { X, Save, Calculator } from 'lucide-react';
import { SUBJECTS } from '../constants';
import { GrandTest, ExamMode, SubjectScore } from '../types';
import ScoreInputRow from './ScoreInputRow';

interface AddTestModalProps {
  onClose: () => void;
  onSave: (test: GrandTest) => void;
  testCount: number;
  initialData?: GrandTest;
}

const AddTestModal: React.FC<AddTestModalProps> = ({ onClose, onSave, testCount, initialData }) => {
  const [testName, setTestName] = useState(`GT${testCount + 1}`);
  const [mode, setMode] = useState<ExamMode>('NEET_PG');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Initialize state for all subjects
  const [subjectData, setSubjectData] = useState<Record<string, { correct: number; wrong: number; obtained: number; total: number }>>(() => {
    const initial: any = {};
    SUBJECTS.forEach(sub => {
      initial[sub.id] = { correct: 0, wrong: 0, obtained: 0, total: 100 };
    });
    return initial;
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setTestName(initialData.name);
      setMode(initialData.mode);
      setDate(initialData.date);
      
      const loadedScores: any = {};
      SUBJECTS.forEach(sub => {
        const existingScore = initialData.scores[sub.id];
        if (existingScore) {
          loadedScores[sub.id] = {
            correct: existingScore.correct || 0,
            wrong: existingScore.wrong || 0,
            obtained: existingScore.obtainedMarks,
            total: existingScore.totalMarks
          };
        } else {
          loadedScores[sub.id] = { correct: 0, wrong: 0, obtained: 0, total: 100 };
        }
      });
      setSubjectData(loadedScores);
    }
  }, [initialData]);

  const handleRowChange = (subjectId: string, field: string, value: number) => {
    setSubjectData(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    const scores: Record<string, SubjectScore> = {};
    
    SUBJECTS.forEach(sub => {
      const data = subjectData[sub.id];
      const percentage = data.total > 0 ? Math.round((data.obtained / data.total) * 100) : 0;
      
      scores[sub.id] = {
        subjectId: sub.id,
        correct: data.correct,
        wrong: data.wrong,
        obtainedMarks: data.obtained,
        totalMarks: data.total,
        percentage
      };
    });

    const newTest: GrandTest = {
      id: initialData ? initialData.id : crypto.randomUUID(),
      name: testName,
      date,
      mode,
      scores
    };

    onSave(newTest);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">{initialData ? 'Edit Test Result' : 'New Grand Test Entry'}</h2>
            <p className="text-indigo-200 text-sm">{initialData ? 'Update your marks' : 'Enter your marks or use the calculator'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-indigo-500 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Global Settings */}
        <div className="p-6 bg-gray-50 border-b border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
            <input 
              type="text" 
              value={testName} 
              onChange={(e) => setTestName(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calculation Mode</label>
            <div className="relative">
              <select 
                value={mode} 
                onChange={(e) => setMode(e.target.value as ExamMode)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border appearance-none"
              >
                <option value="NEET_PG">NEET PG (x4 / -1)</option>
                <option value="INI_CET">INI CET (x1 / -0.33)</option>
                <option value="CUSTOM">Direct Marks Entry</option>
              </select>
              <Calculator className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
          </div>
        </div>

        {/* Rows Header - Desktop */}
        <div className="hidden md:grid grid-cols-6 gap-2 px-6 py-2 bg-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
          <div className="col-span-2">Subject</div>
          {(mode !== 'CUSTOM') && (
            <>
              <div>Correct</div>
              <div>Wrong</div>
            </>
          )}
          {mode === 'CUSTOM' && <div className="col-span-2"></div>}
          <div>Obtained</div>
          <div>Total Marks</div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {SUBJECTS.map((subject) => (
            <ScoreInputRow
              key={subject.id}
              subject={subject}
              mode={mode}
              values={subjectData[subject.id]}
              onChange={handleRowChange}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg font-medium"
          >
            <Save size={18} />
            {initialData ? 'Update Test Result' : 'Save Test Result'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTestModal;