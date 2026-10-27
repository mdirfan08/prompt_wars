import React from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations, getTranslation } from '../../constants/translations';
import { industryConfigs } from '../../constants/industryData';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  ShieldAlert,
  Clock,
  Layers,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const ManagementInsights: React.FC = () => {
  const { workers, shifts, reports, industry, language } = useFairShift();
  const t = getTranslation(language);
  const config = industryConfigs[industry];

  // Industry specific records
  const indWorkers = workers.filter(w => w.industry === industry);
  const indShifts = shifts.filter(s => s.industry === industry);
  const indReports = reports.filter(r => r.industry === industry);

  // 1. Overtime hours per worker
  const workerOtData = indWorkers.map(w => {
    const workerShifts = indShifts.filter(s => s.workerId === w.id);
    const totalOt = Number(workerShifts.reduce((acc, s) => acc + s.overtimeHours, 0).toFixed(1));
    return { name: w.name, nameTa: w.nameTa, ot: totalOt };
  });
  const maxOt = Math.max(...workerOtData.map(d => d.ot), 1);

  // 2. Incident count per work area
  const areaIncidentData = config.workAreas.map(area => {
    const count = indReports.filter(r => r.workArea === area).length;
    return { area, count };
  });
  const maxAreaCount = Math.max(...areaIncidentData.map(d => d.count), 1);

  // 3. Status breakdown
  const submittedCount = indReports.filter(r => r.currentStatus === 'submitted').length;
  const acknowledgedCount = indReports.filter(r => r.currentStatus === 'acknowledged').length;
  const investigatingCount = indReports.filter(r => r.currentStatus === 'investigating').length;
  const resolvedCount = indReports.filter(r => r.currentStatus === 'resolved').length;
  const totalReports = indReports.length || 1;

  return (
    <div className="space-y-6">
      {/* Insights Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold mb-2">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>{t.adminInsights}</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Executive Workforce & Safety Analytics
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
          Visual summaries dynamically aggregated from immutable attendance logs and Proof of Action incident queues.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Overtime Distribution by Worker */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 transition">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Overtime Allocation by Worker</h3>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">Recent shifts</span>
          </div>

          <div className="space-y-3 pt-2">
            {workerOtData.map((d, i) => {
              const widthPct = Math.round((d.ot / maxOt) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{language === 'ta' ? d.nameTa : d.name}</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{d.ot}h OT</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, widthPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Hazard Concentration by Work Area */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 transition">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Incident Reports by Work Area</h3>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">Total: {indReports.length}</span>
          </div>

          <div className="space-y-3 pt-2">
            {areaIncidentData.map((d, i) => {
              const widthPct = Math.round((d.count / maxAreaCount) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{d.area}</span>
                    <span className="font-mono font-bold text-rose-700 dark:text-rose-400">{d.count} reports</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        d.count >= 2 ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      style={{ width: `${d.count > 0 ? Math.max(8, widthPct) : 2}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Proof of Action Status Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 lg:col-span-2 transition">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Proof of Action Resolution Pipeline</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              {resolvedCount}/{indReports.length} Resolved (
              {((resolvedCount / totalReports) * 100).toFixed(0)}%)
            </span>
          </div>

          {/* Segmented Pipeline Bar */}
          <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
            <div
              style={{ width: `${(submittedCount / totalReports) * 100}%` }}
              className="bg-blue-500 h-full transition-all"
              title={`Submitted: ${submittedCount}`}
            />
            <div
              style={{ width: `${(acknowledgedCount / totalReports) * 100}%` }}
              className="bg-amber-500 h-full transition-all"
              title={`Acknowledged: ${acknowledgedCount}`}
            />
            <div
              style={{ width: `${(investigatingCount / totalReports) * 100}%` }}
              className="bg-purple-500 h-full transition-all"
              title={`Under Investigation: ${investigatingCount}`}
            />
            <div
              style={{ width: `${(resolvedCount / totalReports) * 100}%` }}
              className="bg-emerald-500 h-full transition-all"
              title={`Resolved: ${resolvedCount}`}
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-md bg-blue-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">Submitted: <strong className="text-slate-900 dark:text-white">{submittedCount}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-md bg-amber-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">Acknowledged: <strong className="text-slate-900 dark:text-white">{acknowledgedCount}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-md bg-purple-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">Investigating: <strong className="text-slate-900 dark:text-white">{investigatingCount}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-md bg-emerald-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">Resolved: <strong className="text-slate-900 dark:text-white">{resolvedCount}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
