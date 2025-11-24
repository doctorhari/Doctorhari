import React, { useEffect } from 'react';
import { Subject, ExamMode } from '../types';

interface ScoreInputRowProps {
  subject: Subject;
  mode: ExamMode;
  values: {
    correct: number;
    wrong: number;
    obtained: number;
    total: number;
  };
  onChange: (subjectId: string, field: string, value: number) => void;
}

const ScoreInputRow: React.FC<ScoreInputRowProps> = ({ subject, mode, values, onChange }) => {
  
  // Auto-calculate logic when Correct/Wrong changes
  useEffect(() => {
    if (mode === 'CUSTOM') return;

    let calculatedObtained = 0;
    let calculatedTotal = 0;

    if (mode === 'NEET_PG') {
      // NEET PG: Obtained = Correct * 4 - Wrong * 1
      calculatedObtained = (values.correct * 4) - (values.wrong * 1);
      // Total Marks: (Correct + Wrong) * 4
      calculatedTotal = (values.correct + values.wrong) * 4;
    } else if (mode === 'INI_CET') {
      // INI CET: Obtained = Correct * 1 - Wrong * 0.33
      calculatedObtained = (values.correct * 1) - (values.wrong * 0.33);
      // Total Marks: (Correct + Wrong) * 1
      calculatedTotal = (values.correct + values.wrong) * 1;
    }
    
    // Ensure scores are formatted nicely (2 decimal places) but stored as numbers
    const finalObtained = parseFloat(calculatedObtained.toFixed(2));
    const finalTotal = parseFloat(calculatedTotal.toFixed(2));
    
    if (finalObtained !== values.obtained) {
      onChange(subject.id, 'obtained', finalObtained);
    }
    
    // Update Total Marks based on the updated rule
    if (finalTotal !== values.total) {
      onChange(subject.id, 'total', finalTotal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.correct, values.wrong, mode]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center p-2 border-b border-gray-100 hover:bg-gray-50">
      <div className="md:col-span-2 font-medium text-gray-700">
        <span className={`text-xs uppercase px-2 py-1 rounded mr-2 ${
          subject.category === 'RANK_BUILDING' ? 'bg-blue-100 text-blue-700' :
          subject.category === 'RANK_MAINTAINING' ? 'bg-purple-100 text-purple-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {subject.category.replace('RANK_', '')}
        </span>
        {subject.name}
      </div>

      {(mode === 'NEET_PG' || mode === 'INI_CET') ? (
        <>
          <div>
            <label className="block text-xs text-gray-400 md:hidden">Correct</label>
            <input
              type="number"
              min="0"
              value={values.correct === 0 ? '' : values.correct}
              onChange={(e) => onChange(subject.id, 'correct', e.target.value === '' ? 0 : parseInt(e.target.value))}
              className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-300"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 md:hidden">Wrong</label>
            <input
              type="number"
              min="0"
              value={values.wrong === 0 ? '' : values.wrong}
              onChange={(e) => onChange(subject.id, 'wrong', e.target.value === '' ? 0 : parseInt(e.target.value))}
              className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-300"
              placeholder="0"
            />
          </div>
        </>
      ) : (
        <div className="hidden md:block md:col-span-2"></div>
      )}

      <div>
        <label className="block text-xs text-gray-400 md:hidden">Obtained</label>
        <input
          type="number"
          step="0.01"
          value={values.obtained === 0 ? '' : values.obtained}
          onChange={(e) => onChange(subject.id, 'obtained', e.target.value === '' ? 0 : parseFloat(e.target.value))}
          className={`w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${mode !== 'CUSTOM' ? 'bg-gray-50 text-gray-500' : ''}`}
          placeholder="0.00"
          readOnly={mode !== 'CUSTOM'}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 md:hidden">Total</label>
        <input
          type="number"
          min="1"
          value={values.total === 0 ? '' : values.total}
          onChange={(e) => onChange(subject.id, 'total', e.target.value === '' ? 0 : parseFloat(e.target.value))}
          className={`w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${mode !== 'CUSTOM' ? 'bg-gray-50 text-gray-500' : ''}`}
          placeholder="0"
          readOnly={mode !== 'CUSTOM'}
        />
      </div>
    </div>
  );
};

export default ScoreInputRow;