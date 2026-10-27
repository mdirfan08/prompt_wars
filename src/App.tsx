import React from 'react';
import { FairShiftProvider, useFairShift } from './context/FairShiftContext';
import { Navbar } from './components/common/Navbar';
import { DemoBanner } from './components/common/DemoBanner';
import { Toast } from './components/common/Toast';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { getTranslation } from './constants/translations';
import { ShieldCheck, HeartHandshake, Globe2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { portal, language } = useFairShift();
  const t = getTranslation(language);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Demo Sequence Guide for Hackathon Judges */}
      <DemoBanner />

      {/* Main Navigation Header */}
      <Navbar />

      {/* Main Interface Content */}
      <div className="flex-1">
        {portal === 'worker' ? <WorkerDashboard /> : <AdminDashboard />}
      </div>

      {/* Toast Notifications */}
      <Toast />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-700 dark:text-slate-200">{t.appTitle} 2026</span>
            <span>•</span>
            <span>{t.appSubtitle}</span>
            <span>•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{t.sdgGoal}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <span>SRM ACM Student Chapter × Prompt Wars 2026</span>
            <span>•</span>
            <span>Zero-API Offline Local Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FairShiftProvider>
      <AppContent />
    </FairShiftProvider>
  );
};

export default App;
