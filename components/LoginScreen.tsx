import React, { useState } from 'react';
import { Activity, CheckCircle, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate network delay for authentication
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Simple Navbar for Landing */}
      <div className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="bg-indigo-600 p-1.5 rounded-lg">
             <Activity className="text-white h-5 w-5" />
           </div>
           <span className="text-xl font-bold text-gray-900 tracking-tight">MedRank Tracker</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in-up">
          
          {/* Left Side: Hero / Value Prop */}
          <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-between relative overflow-hidden bg-indigo-900 text-white">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800 border border-indigo-700 text-indigo-200 text-xs font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                AI-Powered Analysis
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Elevate Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Medical Rank</span>
              </h1>
              
              <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
                The comprehensive score tracker for NEET PG & INI CET aspirants. Identify weak subjects, visualize trends, and get smart coaching.
              </p>
              
              <div className="space-y-4">
                {[
                  "Subject-wise Performance Tracking",
                  "Trend Analysis & Rank Prediction",
                  "Secure Cloud Sync",
                  "Export Detailed Excel Reports"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-indigo-100">
                    <div className="bg-indigo-800/50 p-1 rounded-full">
                      <CheckCircle size={16} className="text-green-400" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-12 pt-8 border-t border-indigo-800/50 flex items-center justify-between text-xs text-indigo-400">
              <span>Trusted by Medicos across India</span>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="md:w-1/2 p-8 md:p-16 bg-white flex flex-col justify-center items-center">
            <div className="w-full max-w-sm">
              <div className="text-center mb-10">
                <div className="inline-block p-4 rounded-full bg-indigo-50 mb-4 relative">
                   {isLoading && (
                     <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                   )}
                   <Activity className={`text-indigo-600 transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`} size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{isLoading ? 'Signing in...' : 'Welcome Back'}</h2>
                <p className="text-gray-500 mt-2">Sign in with your Google account to access your dashboard</p>
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-4 rounded-xl transition-all transform active:scale-[0.99] shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-gray-400" />
              </button>

              <div className="mt-8 text-center">
                 <p className="text-xs text-gray-400">
                    By signing in, you agree to our <span className="underline cursor-pointer hover:text-indigo-600">Terms of Service</span> and <span className="underline cursor-pointer hover:text-indigo-600">Privacy Policy</span>.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;