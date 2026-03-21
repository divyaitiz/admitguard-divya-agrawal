import React, { useState } from 'react';
import PersonalDetails from './components/PersonalDetails';

// The 8 stages as defined in the technical parameters
const STAGES = [
  'Personal Details', 
  'ID Verification', 
  'Academic Details', 
  'Documents', 
  'AI Validation', 
  'Screening', 
  'Interview', 
  'Admission'
];

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const nextStep = () => {
    if (currentStep < STAGES.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] font-sans text-slate-900 p-4 md:p-8">
      {/* Header Section */}
      <header className="text-center mb-10">
        <div className="flex justify-center items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <span className="text-2xl">☑</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Futurense Document Verification
          </h1>
        </div>
        <p className="text-slate-500 text-sm font-medium">
          Streamlined candidate verification and admission process
        </p>
      </header>

      {/* 8-Stage Stepper */}
      <nav className="max-w-5xl mx-auto mb-12 px-4">
        <div className="flex justify-between items-start relative">
          {STAGES.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div key={label} className="flex flex-col items-center flex-1 relative z-10">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-110' : 
                    isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 
                    'bg-white border-slate-200 text-slate-400'}`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span 
                  className={`mt-3 text-[10px] text-center font-bold uppercase tracking-tighter w-16
                  ${isActive ? 'text-slate-800' : 'text-slate-400'}`}
                >
                  {label}
                </span>
              </div>
            );
          })}
          {/* Connecting Line */}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-200 -z-10" />
        </div>
      </nav>

      {/* Main Content Card */}
      <main className="max-w-4xl mx-auto bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 md:p-12 transition-all">
        {currentStep === 1 && <PersonalDetails onNext={nextStep} />}
        
        {/* Placeholder for remaining stages */}
        {currentStep > 1 && (
          <div className="py-20 text-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Stage {currentStep}: {STAGES[currentStep - 1]}
            </h2>
            <p className="text-slate-500 mb-8">This module is currently being optimized to reduce verification bottlenecks.</p>
            <button 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-blue-600 font-semibold hover:underline"
            >
              ← Back to previous step
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400 font-medium">
        © 2026 Futurense Technologies. All rights reserved.
      </footer>
    </div>
  );
};

export default App;