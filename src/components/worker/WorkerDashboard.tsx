import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations } from '../../constants/translations';
import { WorkerHome } from './WorkerHome';
import { SmartAttendance } from './SmartAttendance';
import { PayExplorer } from './PayExplorer';
import { SpeakUpShield } from './SpeakUpShield';
import { WorkerReports } from './WorkerReports';
import { WorkerGrowth } from './WorkerGrowth';
import {
  Home,
  Clock,
  DollarSign,
  ShieldAlert,
  FileCheck2,
  Award
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { language, reports, industry } = useFairShift();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'home' | 'attendance' | 'pay' | 'speakup' | 'reports' | 'growth'>('home');

  const openReportsCount = reports.filter(r => r.industry === industry && r.currentStatus !== 'resolved').length;

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'attendance', label: t.navAttendance, icon: Clock },
    { id: 'pay', label: t.navPay, icon: DollarSign },
    { id: 'speakup', label: t.navSpeakUp, icon: ShieldAlert },
    { id: 'reports', label: t.navReports, icon: FileCheck2, badge: openReportsCount },
    { id: 'growth', label: t.navGrowth, icon: Award }
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Worker Sub-navigation Bar */}
      <nav aria-label="Worker Sub-navigation" className="bg-white rounded-2xl p-1.5 border border-slate-200/90 shadow-sm flex items-center justify-between overflow-x-auto gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap relative ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-emerald-500 text-slate-950' : 'bg-rose-100 text-rose-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Main Tab Content */}
      <main>
        {activeTab === 'home' && <WorkerHome onNavigate={tab => setActiveTab(tab)} />}
        {activeTab === 'attendance' && <SmartAttendance />}
        {activeTab === 'pay' && <PayExplorer />}
        {activeTab === 'speakup' && <SpeakUpShield onReportSubmitted={() => setActiveTab('reports')} />}
        {activeTab === 'reports' && <WorkerReports />}
        {activeTab === 'growth' && <WorkerGrowth />}
      </main>
    </div>
  );
};
