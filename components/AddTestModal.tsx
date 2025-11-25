import React, { useState, useEffect } from 'react';
import { X, Save, Calculator, Edit3 } from 'lucide-react';
import { SUBJECTS } from '../constants';
import { GrandTest, ExamMode, SubjectScore } from '../types';
import ScoreInputRow from './ScoreInputRow';

interface AddTestModalProps {
  onClose: () => void;
  onSave: (test: GrandTest) => void;
  testCount: number;
  initialData?: GrandTest;
  defaultMode?: ExamMode;
}

const AddTestModal: React.FC<AddTestModalProps> = ({ onClose, onSave, testCount, initialData, defaultMode = 'NEET_PG' }) => {
  const [testName, setTestName] = useState(`GT${testCount + 1}`);
  // Mode is strictly controlled by the dashboard or initial data, not selectable by user directly here
  const [mode] = useState<ExamMode>(initialData?.mode || defaultMode);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Determine if we should start in direct entry mode
  // If editing, check if scores align with formula. If not, assume direct entry.
  const [isDirectEntry, setIsDirectEntry] = useState(() => {
    if (!initialData) return false;
    
    // Heuristic: Check one non-empty subject to see if values match calculation
    for (const sub of SUBJECTS) {
      const s = initialData.scores[sub.id];
      if (s && s.totalMarks > 0) {
        const correct = s.correct || 0;
        const wrong = s.wrong || 0;
        const obtained = s.obtainedMarks;
        
        // Calculate expected based on mode
        let expected = 0;
        if (initialData.mode === 'NEET_PG') {
          expected = (correct * 4) - wrong;
        } else {
           // INI CET
           expected = correct - (wrong * 0.33);
        }
        
        // Allow small float tolerance
        if (Math.abs(expected - obtained) > 0.1) {
          return true; // Likely direct entry
        }
      }
    }
    return false;
  });

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
            <div className="flex items-center gap-2 mb-1">
               <h2 className="text-2xl font-bold">{initialData ? 'Edit Test' : 'Add Test'}</h2>
               <span className="bg-indigo-500/50 px-2 py-0.5 rounded text-xs uppercase tracking-wide font-semibold border border-indigo-400">
                  {mode.replace('_', ' ')}
               </span>
            </div>
            <p className="text-indigo-200 text-sm">
               {isDirectEntry ? 'Entering marks directly' : `Calculating based on ${mode.replace('_', ' ')} negative marking`}
            </p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Entry Method</label>
            <div className={`border rounded-md p-2 flex items-center gap-2 ${isDirectEntry ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-300'}`}>
                <input 
                  type="checkbox"
                  id="directEntry"
                  checked={isDirectEntry}
                  onChange={(e) => setIsDirectEntry(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="directEntry" className="text-sm text-gray-700 select-none flex items-center gap-2 cursor-pointer w-full">
                  {isDirectEntry ? <Edit3 size={14} className="text-indigo-600"/> : <Calculator size={14} className="text-gray-400"/>}
                  Direct Marks Entry
                </label>
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
          {!isDirectEntry ? (
            <>
              <div>Correct</div>
              <div>Wrong</div>
            </>
          ) : (
            <div className="col-span-2 text-center text-gray-400 font-normal normal-case italic">Manual Entry Mode</div>
          )}
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
              isDirectEntry={isDirectEntry}
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
            Save Test Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTestModal;