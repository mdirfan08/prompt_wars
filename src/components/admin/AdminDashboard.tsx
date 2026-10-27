import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations, getTranslation } from '../../constants/translations';
import { ExecutiveOverview } from './ExecutiveOverview';
import { WorkforceOperations } from './WorkforceOperations';
import { SafetyCommandCenter } from './SafetyCommandCenter';
import { FairnessRadarPanel } from './FairnessRadarPanel';
import { ManagementInsights } from './ManagementInsights';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  AlertTriangle,
  BarChart2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { language, reports, industry } = useFairShift();
  const t = getTranslation(language);

  const [activeTab, setActiveTab] = useState<'overview' | 'workforce' | 'safety' | 'fairness' | 'insights'>('overview');

  const openReportsCount = reports.filter(r => r.industry === industry && r.currentStatus !== 'resolved').length;

  interface AdminNavItem {
    id: 'overview' | 'workforce' | 'safety' | 'fairness' | 'insights';
    label: string;
    icon: any;
    badge?: number;
  }

  const navItems: AdminNavItem[] = [
    { id: 'overview', label: t.adminOverview, icon: LayoutDashboard },
    { id: 'workforce', label: t.adminWorkforce, icon: Users },
    { id: 'safety', label: t.adminSafety, icon: ShieldAlert, badge: openReportsCount },
    { id: 'fairness', label: t.adminFairness, icon: AlertTriangle },
    { id: 'insights', label: t.adminInsights, icon: BarChart2 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Sub-navigation Bar */}
      <nav aria-label="Command Center Sub-navigation" className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between overflow-x-auto gap-1 transition">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap relative ${
                isActive
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-rose-500 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
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
        {activeTab === 'overview' && <ExecutiveOverview onNavigate={tab => setActiveTab(tab)} />}
        {activeTab === 'workforce' && <WorkforceOperations />}
        {activeTab === 'safety' && <SafetyCommandCenter />}
        {activeTab === 'fairness' && <FairnessRadarPanel />}
        {activeTab === 'insights' && <ManagementInsights />}
      </main>
    </div>
  );
};
