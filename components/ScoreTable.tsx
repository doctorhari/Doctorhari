import React from 'react';
import { SubjectCategory, GrandTest } from '../types';
import { SUBJECTS, CATEGORIES } from '../constants';
import { TrendingUp, TrendingDown, Minus, Edit2, Trash2 } from 'lucide-react';

interface ScoreTableProps {
  tests: GrandTest[];
  filterCategory: SubjectCategory | 'ALL';
  onEdit: (test: GrandTest) => void;
  onDelete: (id: string) => void;
}

const ScoreTable: React.FC<ScoreTableProps> = ({ tests, filterCategory, onEdit, onDelete }) => {

  const getScoreColor = (percentage: number) => {
    if (percentage <= 50) return 'bg-red-200 text-red-900 border-red-300';
    if (percentage < 80) return 'bg-yellow-100 text-yellow-900 border-yellow-300';
    return 'bg-green-200 text-green-900 border-green-300';
  };

  const categoriesToShow = filterCategory === 'ALL' 
    ? (Object.keys(CATEGORIES) as SubjectCategory[]) 
    : [filterCategory];

  return (
    <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th scope="col" className="px-6 py-4 sticky left-0 bg-gray-50 z-10 w-64 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              Subject
            </th>
            {tests.map(test => (
              <th key={test.id} scope="col" className="px-6 py-4 min-w-[140px] text-center whitespace-nowrap group relative">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-gray-900 text-base mb-1">{test.name}</span>
                  <span className="text-[10px] text-gray-500 font-normal bg-gray-200 px-2 py-0.5 rounded-full">
                    {test.mode.replace('_', ' ')}
                  </span>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(test)}
                      className="p-1 hover:bg-indigo-100 text-indigo-600 rounded"
                      title="Edit Test"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => onDelete(test.id)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                      title="Delete Test"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categoriesToShow.map(cat => {
            const catSubjects = SUBJECTS.filter(s => s.category === cat);
            
            return (
              <React.Fragment key={cat}>
                {/* Category Header Row */}
                <tr className="bg-gray-100/80">
                  <td colSpan={tests.length + 1} className="px-6 py-2 font-bold text-gray-600 text-xs tracking-wider sticky left-0 bg-gray-100/80 z-10">
                    {CATEGORIES[cat]}
                  </td>
                </tr>

                {/* Subject Rows */}
                {catSubjects.map(subject => {
                  // Calculate average for this subject across all tests
                  const totalScore = tests.reduce((acc, t) => acc + (t.scores[subject.id]?.percentage || 0), 0);
                  const averageScore = tests.length > 0 ? totalScore / tests.length : 0;

                  return (
                    <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-gray-900 sticky left-0 bg-white hover:bg-gray-50 z-10 border-r border-gray-100">
                        <div className="flex flex-col">
                          <span>{subject.name}</span>
                          {tests.length > 1 && (
                            <span className="text-[10px] text-gray-400 font-normal">
                              Avg: {averageScore.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                      {tests.map((test) => {
                        const score = test.scores[subject.id];
                        const percentage = score ? score.percentage : 0;
                        
                        // Compare current score with the calculated average
                        let trendIcon = null;
                        
                        if (tests.length > 1) {
                          const diff = percentage - averageScore;
                          
                          // Use a small buffer (e.g., 0.5%) to treat close scores as "flat"
                          if (diff > 0.5) {
                            trendIcon = <TrendingUp size={14} className="text-green-600 ml-1.5" strokeWidth={2.5} />;
                          } else if (diff < -0.5) {
                            trendIcon = <TrendingDown size={14} className="text-red-500 ml-1.5" strokeWidth={2.5} />;
                          } else {
                            trendIcon = <Minus size={14} className="text-gray-300 ml-1.5" />;
                          }
                        }

                        return (
                          <td key={test.id} className="px-2 py-3 text-center" title={`Vs Average: ${(percentage - averageScore).toFixed(1)}%`}>
                            <div className="flex items-center justify-center">
                                <span className={`inline-block px-3 py-1 rounded-md font-bold text-xs border ${getScoreColor(percentage)}`}>
                                  {percentage}%
                                </span>
                                {trendIcon}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {tests.length === 0 && (
        <div className="p-12 text-center text-gray-400">
          <p>No test data available. Add your first GT to see the scoreboard.</p>
        </div>
      )}
    </div>
  );
};

export default ScoreTable;