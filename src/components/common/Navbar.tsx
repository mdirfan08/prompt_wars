import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations } from '../../constants/translations';
import { industryConfigs } from '../../constants/industryData';
import {
  Shield,
  HardHat,
  LayoutDashboard,
  Building2,
  Globe,
  RotateCcw,
  Users,
  AlertCircle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    portal,
    setPortal,
    industry,
    setIndustry,
    language,
    setLanguage,
    currentWorker,
    setCurrentWorkerId,
    workers,
    reports,
    resetDemoData
  } = useFairShift();

  const [showResetModal, setShowResetModal] = useState(false);
  const t = translations[language];

  // Workers in currently selected industry
  const currentIndustryWorkers = workers.filter(w => w.industry === industry);

  // Unresolved reports count for current industry
  const openReports = reports.filter(r => r.industry === industry && r.currentStatus !== 'resolved').length;

  return (
    <>
      <header className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/30">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    {t.appTitle}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hidden sm:inline-block">
                    SDG 8
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-none hidden md:block">
                  {industryConfigs[industry][language === 'ta' ? 'nameTa' : 'name']}
                </p>
              </div>
            </div>

            {/* Portal Switcher (Center Tabs) */}
            <nav aria-label="Portal Navigation" className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setPortal('worker')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  portal === 'worker'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HardHat className="w-4 h-4" />
                <span className="hidden sm:inline">{t.workerPortal}</span>
                <span className="sm:hidden">Worker</span>
              </button>

              <button
                onClick={() => setPortal('admin')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  portal === 'admin'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">{t.commandCenter}</span>
                <span className="sm:hidden">Admin</span>
                {openReports > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {openReports}
                  </span>
                )}
              </button>
            </nav>

            {/* Right Controls: Industry Toggle, Worker Selector, Language, Reset */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Industry Dropdown */}
              <div className="relative">
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value as 'construction' | 'facilities')}
                  className="bg-slate-900 text-slate-200 text-xs font-medium rounded-lg border border-slate-700/80 px-2.5 py-1.5 pr-7 appearance-none cursor-pointer hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  title="Switch Industry Configuration"
                >
                  <option value="construction">🏗️ Construction Site</option>
                  <option value="facilities">🏢 Campus Facilities</option>
                </select>
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>

              {/* Worker Persona Selector (Only visible in Worker Portal) */}
              {portal === 'worker' && (
                <div className="relative hidden lg:block">
                  <select
                    value={currentWorker.id}
                    onChange={e => setCurrentWorkerId(e.target.value)}
                    className="bg-slate-900 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-900/50 px-2.5 py-1.5 pr-7 appearance-none cursor-pointer hover:border-emerald-700 focus:outline-none"
                    title="Change Demo Worker Persona"
                  >
                    {currentIndustryWorkers.map(w => (
                      <option key={w.id} value={w.id}>
                        👤 {language === 'ta' ? w.nameTa : w.name} ({language === 'ta' ? w.roleTa : w.role})
                      </option>
                    ))}
                  </select>
                  <Users className="w-3.5 h-3.5 text-emerald-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              )}

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold transition"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>

              {/* Reset Demo Data Button */}
              <button
                onClick={() => setShowResetModal(true)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 transition"
                title="Reset Demo Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Reset Demo State?</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              This will reset all attendance shifts, safety incident reports, and fairness threshold settings back to the clean competition seed data.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 transition"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
