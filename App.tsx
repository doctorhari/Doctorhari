import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, BrainCircuit, Filter, FileSpreadsheet, Download, Trophy, X, Stethoscope, GraduationCap } from 'lucide-react';
import { GrandTest, SubjectCategory, ExamMode } from './types';
import { INITIAL_TESTS_DATA_KEY, SUBJECTS, CATEGORIES } from './constants';
import ScoreTable from './components/ScoreTable';
import AddTestModal from './components/AddTestModal';
import { analyzePerformance } from './services/geminiService';

const App: React.FC = () => {
  // App Data States
  const [tests, setTests] = useState<GrandTest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<GrandTest | null>(null);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'AI_INSIGHTS'>('DASHBOARD');
  
  // Dashboard & Filter States
  const [activeExamTab, setActiveExamTab] = useState<ExamMode>('NEET_PG');
  const [filterCategory, setFilterCategory] = useState<SubjectCategory | 'ALL'>('ALL');
  
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);

  // Load test data
  useEffect(() => {
    const saved = localStorage.getItem(INITIAL_TESTS_DATA_KEY);
    if (saved) {
      try {
        setTests(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Save test data & Check for motivation notification
  useEffect(() => {
    if (tests.length > 0) {
      localStorage.setItem(INITIAL_TESTS_DATA_KEY, JSON.stringify(tests));
      
      // Motivation Check: If last test was > 14 days ago (checking GLOBAL activity)
      const sortedTests = [...tests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const lastTestDate = new Date(sortedTests[0].date);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastTestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays > 14) {
        setShowMotivation(true);
      } else {
        setShowMotivation(false);
      }

    } else {
      localStorage.removeItem(INITIAL_TESTS_DATA_KEY);
      setShowMotivation(false);
    }
  }, [tests]);

  const handleSaveTest = (testData: GrandTest) => {
    if (editingTest) {
      setTests(prev => prev.map(t => t.id === testData.id ? testData : t));
    } else {
      setTests(prev => [...prev, testData]);
    }
    setEditingTest(null);
    setIsModalOpen(false);
    setAiAnalysis('');
  };

  const handleEditTest = (test: GrandTest) => {
    setEditingTest(test);
    setIsModalOpen(true);
  };

  const handleDeleteTest = (id: string) => {
    if (window.confirm('Are you sure you want to delete this test record?')) {
      setTests(prev => prev.filter(t => t.id !== id));
      setAiAnalysis('');
    }
  };

  const handleCloseModal = () => {
    setEditingTest(null);
    setIsModalOpen(false);
  };

  // Filter tests based on the selected Dashboard (NEET PG vs INI CET)
  const filteredTests = tests.filter(test => test.mode === activeExamTab);

  const handleAnalyze = async () => {
    if (filteredTests.length === 0) return;
    setIsAnalyzing(true);
    // Analyze only the tests visible in the current dashboard
    const result = await analyzePerformance(filteredTests);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleExportToExcel = () => {
    if (filteredTests.length === 0) {
      alert(`No ${activeExamTab.replace('_', ' ')} data to export.`);
      return;
    }

    const XLSX = (window as any).XLSX;
    if (!XLSX) {
      alert("Export library is loading. Please try again in a moment.");
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws: any = {};
    
    // Define column widths
    const cols = [{ wch: 30 }]; // Subject column width slightly increased
    filteredTests.forEach(() => cols.push({ wch: 12 })); // Tests
    ws['!cols'] = cols;

    let currentRow = 0;

    // --- Helper to set cell with style ---
    const setCell = (r: number, c: number, val: any, style: any = {}, mergeAcross: number = 0) => {
      const cellRef = XLSX.utils.encode_cell({r, c});
      ws[cellRef] = { 
        v: val, 
        t: typeof val === 'number' ? 'n' : 's',
        s: style 
      };
      
      if (mergeAcross > 0) {
        if (!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push({ s: { r, c }, e: { r, c: c + mergeAcross } });
      }
    };

    // --- Styles ---
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F46E5" } }, // Indigo 600
      alignment: { horizontal: "center", vertical: "center" },
      border: { bottom: { style: "thin" }, top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
    };

    const catStyles: Record<SubjectCategory, any> = {
      RANK_BUILDING: {
        font: { bold: true, color: { rgb: "1e3a8a" }, sz: 12 },
        fill: { fgColor: { rgb: "DBEAFE" } }, // Blue 100
        border: { bottom: { style: "thin" }, top: { style: "thin" } }
      },
      RANK_MAINTAINING: {
        font: { bold: true, color: { rgb: "581c87" }, sz: 12 },
        fill: { fgColor: { rgb: "F3E8FF" } }, // Purple 100
        border: { bottom: { style: "thin" }, top: { style: "thin" } }
      },
      RANK_DECIDING: {
        font: { bold: true, color: { rgb: "c2410c" }, sz: 12 },
        fill: { fgColor: { rgb: "FFEDD5" } }, // Orange 100
        border: { bottom: { style: "thin" }, top: { style: "thin" } }
      }
    };

    const subjectStyle = {
      alignment: { horizontal: "left" },
      border: { bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
    };

    const scoreStyles = {
      red: { 
        fill: { fgColor: { rgb: "FCA5A5" } }, 
        alignment: { horizontal: "center" },
        border: { bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
      },
      yellow: { 
        fill: { fgColor: { rgb: "FDE047" } }, 
        alignment: { horizontal: "center" },
        border: { bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
      },
      green: { 
        fill: { fgColor: { rgb: "86EFAC" } }, 
        alignment: { horizontal: "center" },
        border: { bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
      }
    };

    // --- 1. Main Header Row ---
    // Updated header to include the exam mode name
    setCell(currentRow, 0, `Subject / ${activeExamTab.replace('_', ' ')}`, headerStyle);
    
    filteredTests.forEach((t, i) => {
      setCell(currentRow, i + 1, t.name, headerStyle);
    });
    currentRow++;

    // --- 2. Data Rows ---
    (Object.keys(CATEGORIES) as SubjectCategory[]).forEach(cat => {
      const catSubjects = SUBJECTS.filter(s => s.category === cat);
      
      // Category Header
      setCell(currentRow, 0, CATEGORIES[cat], catStyles[cat], filteredTests.length);
      currentRow++;

      // Subjects
      catSubjects.forEach((subject) => {
        setCell(currentRow, 0, subject.name, subjectStyle);
        
        filteredTests.forEach((test, i) => {
          const score = test.scores[subject.id];
          const percentage = score ? score.percentage : 0;
          
          let style = scoreStyles.red;
          if (percentage >= 80) style = scoreStyles.green;
          else if (percentage >= 50) style = scoreStyles.yellow;

          setCell(currentRow, i + 1, percentage, style);
        });
        currentRow++;
      });
    });

    // Set Sheet Range
    ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: currentRow - 1, c: filteredTests.length } });

    // Append Sheet and Write File
    XLSX.utils.book_append_sheet(wb, ws, `MedRank_${activeExamTab}`);
    XLSX.writeFile(wb, `MedRank_${activeExamTab}_Sheet.xlsx`);
  };

  const TABS: { id: ExamMode; label: string; icon: React.ReactNode }[] = [
    { id: 'NEET_PG', label: 'NEET PG', icon: <Stethoscope size={16} /> },
    { id: 'INI_CET', label: 'INI CET', icon: <GraduationCap size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <FileSpreadsheet className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                MedRank Tracker
              </span>
            </div>
            <div className="flex items-center gap-4">
              
              <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('DASHBOARD')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'DASHBOARD' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('AI_INSIGHTS')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'AI_INSIGHTS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={16} />
                    AI Coach
                  </div>
                </button>
              </div>
              
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
                title={`Export ${activeExamTab.replace('_', ' ')} Data`}
              >
                <Download size={18} />
                <span className="hidden lg:inline">Export</span>
              </button>

              <button
                onClick={() => {
                  setEditingTest(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-md shadow-indigo-200"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add GT</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard View */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            
            {/* Motivation Notification Banner */}
            {showMotivation && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm flex items-start justify-between animate-fade-in">
                <div className="flex gap-4">
                  <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
                     <Trophy className="text-orange-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-800">Time for your next Grand Test!</h3>
                    <p className="text-orange-700 text-sm mt-1 leading-relaxed">
                      It's been over 2 weeks since your last test. You are missing out on critical practice. 
                      <br/>
                      Write a GT today to secure that <span className="font-black bg-orange-200 px-1 rounded text-orange-900">Two Digit Rank</span>!
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMotivation(false)} 
                  className="text-orange-400 hover:text-orange-600 hover:bg-orange-100 p-1 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Dashboard Tabs (Exam Mode Switcher) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex p-1 bg-gray-200 rounded-xl">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveExamTab(tab.id);
                      setAiAnalysis(''); // Clear AI analysis when switching dashboards
                    }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      activeExamTab === tab.id
                        ? 'bg-white text-indigo-700 shadow-md ring-1 ring-black/5'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm w-full md:w-auto">
                 <Filter size={16} className="text-gray-400 ml-2" />
                 <select 
                   value={filterCategory}
                   onChange={(e) => setFilterCategory(e.target.value as SubjectCategory | 'ALL')}
                   className="bg-transparent border-none text-sm font-medium focus:ring-0 text-gray-700 cursor-pointer outline-none pr-8 py-1"
                 >
                   <option value="ALL">All Categories</option>
                   <option value="RANK_BUILDING">Rank Building</option>
                   <option value="RANK_MAINTAINING">Rank Maintaining</option>
                   <option value="RANK_DECIDING">Rank Deciding</option>
                 </select>
               </div>
            </div>

            {/* Header Stats */}
             <div>
                <h1 className="text-2xl font-bold text-gray-900">{activeExamTab.replace('_', ' ')} Dashboard</h1>
                <p className="text-gray-500 text-sm">
                  Tracking {filteredTests.length} {activeExamTab.replace('_', ' ')} tests.
                  {filteredTests.length === 0 && " No tests found for this category."}
                </p>
             </div>

            {/* Score Table */}
            <ScoreTable 
              tests={filteredTests} 
              filterCategory={filterCategory}
              onEdit={handleEditTest}
              onDelete={handleDeleteTest}
            />
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
               <span className="font-semibold mr-2">Color Key:</span>
               <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-red-200 border border-red-300"></span>
                 <span>Weak (0-50%)</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300"></span>
                 <span>Average (51-79%)</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-green-200 border border-green-300"></span>
                 <span>Strong (80-100%)</span>
               </div>
            </div>
          </div>
        )}

        {/* AI Insights View */}
        {activeTab === 'AI_INSIGHTS' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">AI Performance Coach</h2>
                  <p className="text-indigo-200">
                    Get personalized analysis for your <span className="font-bold text-white">{activeExamTab.replace('_', ' ')}</span> performance.
                  </p>
                </div>
                <BrainCircuit size={48} className="text-indigo-300 opacity-50" />
              </div>
              
              <div className="mt-8">
                {filteredTests.length === 0 ? (
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                     <p>Please add at least one {activeExamTab.replace('_', ' ')} test result to unlock AI analysis.</p>
                     <button 
                        onClick={() => setActiveTab('DASHBOARD')}
                        className="text-indigo-200 underline mt-2 text-sm hover:text-white"
                     >
                        Go to Dashboard
                     </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-indigo-900 border-t-transparent rounded-full"></div>
                        Analyzing {activeExamTab.replace('_', ' ')} Scores...
                      </>
                    ) : (
                      'Generate Analysis'
                    )}
                  </button>
                )}
              </div>
            </div>

            {aiAnalysis && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Coach's Report ({activeExamTab.replace('_', ' ')})</h3>
                <div className="prose prose-indigo max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {aiAnalysis}
                </div>
              </div>
            )}
            
            {!aiAnalysis && filteredTests.length > 0 && !isAnalyzing && (
              <div className="text-center py-12 text-gray-400">
                Click the button above to generate your report.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {isModalOpen && (
        <AddTestModal 
          onClose={handleCloseModal} 
          onSave={handleSaveTest}
          testCount={filteredTests.length}
          initialData={editingTest || undefined}
          defaultMode={activeExamTab}
        />
      )}
    </div>
  );
};

export default App;