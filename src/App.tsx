import React from 'react';
import { FairShiftProvider, useFairShift } from './context/FairShiftContext';
import { Navbar } from './components/common/Navbar';
import { DemoBanner } from './components/common/DemoBanner';
import { Toast } from './components/common/Toast';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ShieldCheck, HeartHandshake, Globe2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { portal, industry } = useFairShift();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
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
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-700">FairShift 2026</span>
            <span>•</span>
            <span>Worker-First Workforce Intelligence</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">UN SDG 8 (Decent Work & Economic Growth)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
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
