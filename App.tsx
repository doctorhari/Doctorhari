import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, BrainCircuit, Filter, FileSpreadsheet } from 'lucide-react';
import { GrandTest, SubjectCategory } from './types';
import { INITIAL_TESTS_DATA_KEY } from './constants';
import ScoreTable from './components/ScoreTable';
import AddTestModal from './components/AddTestModal';
import { analyzePerformance } from './services/geminiService';

const App: React.FC = () => {
  const [tests, setTests] = useState<GrandTest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<GrandTest | null>(null);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'AI_INSIGHTS'>('DASHBOARD');
  const [filterCategory, setFilterCategory] = useState<SubjectCategory | 'ALL'>('ALL');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  useEffect(() => {
    if (tests.length > 0) {
      localStorage.setItem(INITIAL_TESTS_DATA_KEY, JSON.stringify(tests));
    } else {
      // If all tests are deleted, clear/update storage
      localStorage.removeItem(INITIAL_TESTS_DATA_KEY);
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
    // Clear old analysis when data changes
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

  const handleAnalyze = async () => {
    if (tests.length === 0) return;
    setIsAnalyzing(true);
    const result = await analyzePerformance(tests);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

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
                onClick={() => {
                  setEditingTest(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-md shadow-indigo-200"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add GT Result</span>
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
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
                  <p className="text-gray-500 text-sm">Track your progress across all 19 subjects</p>
               </div>
               
               <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
                 <Filter size={16} className="text-gray-400 ml-2" />
                 <select 
                   value={filterCategory}
                   onChange={(e) => setFilterCategory(e.target.value as SubjectCategory | 'ALL')}
                   className="bg-transparent border-none text-sm font-medium focus:ring-0 text-gray-700 cursor-pointer outline-none pr-8"
                 >
                   <option value="ALL">All Categories</option>
                   <option value="RANK_BUILDING">Rank Building</option>
                   <option value="RANK_MAINTAINING">Rank Maintaining</option>
                   <option value="RANK_DECIDING">Rank Deciding</option>
                 </select>
               </div>
            </div>

            {/* Score Table */}
            <ScoreTable 
              tests={tests} 
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
                  <p className="text-indigo-200">Get personalized analysis of your weak spots and strategic advice to improve your rank.</p>
                </div>
                <BrainCircuit size={48} className="text-indigo-300 opacity-50" />
              </div>
              
              <div className="mt-8">
                {tests.length === 0 ? (
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                     <p>Please add at least one test result to unlock AI analysis.</p>
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
                        Analyzing Scores...
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
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Coach's Report</h3>
                <div className="prose prose-indigo max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {aiAnalysis}
                </div>
              </div>
            )}
            
            {!aiAnalysis && tests.length > 0 && !isAnalyzing && (
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
          testCount={tests.length}
          initialData={editingTest || undefined}
        />
      )}
    </div>
  );
};

export default App;