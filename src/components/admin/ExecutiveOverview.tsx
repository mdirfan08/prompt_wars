import React from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations } from '../../constants/translations';
import { industryConfigs } from '../../constants/industryData';
import { analyzeFairnessRadar } from '../../utils/fairnessRadar';
import {
  Users,
  HardHat,
  AlertTriangle,
  Clock,
  ShieldAlert,
  TrendingUp,
  Activity,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ExecutiveOverviewProps {
  onNavigate: (tab: 'overview' | 'workforce' | 'safety' | 'fairness' | 'insights') => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ onNavigate }) => {
  const { workers, shifts, reports, thresholds, industry, language } = useFairShift();
  const t = translations[language];
  const config = industryConfigs[industry];

  // Derive metrics strictly from actual records for this industry
  const indWorkers = workers.filter(w => w.industry === industry);
  const totalWorkforce = indWorkers.length;
  const onShiftWorkers = indWorkers.filter(w => w.currentStatus === 'clocked_in' || w.currentStatus === 'on_break');

  const indShifts = shifts.filter(s => s.industry === industry);
  const indReports = reports.filter(r => r.industry === industry);
  const openReports = indReports.filter(r => r.currentStatus !== 'resolved');

  // Excessive hours shifts (> thresholds.maxDailyHours)
  const excessiveShifts = indShifts.filter(s => s.hoursWorked > thresholds.maxDailyHours);

  // Average recorded shift duration
  const completedShifts = indShifts.filter(s => s.clockOut);
  const avgShiftDuration = completedShifts.length > 0
    ? Number((completedShifts.reduce((acc, s) => acc + s.hoursWorked, 0) / completedShifts.length).toFixed(1))
    : 0;

  // Fairness Radar findings
  const findings = analyzeFairnessRadar(workers, shifts, reports, thresholds, industry);
  const highRiskFindings = findings.filter(f => f.severity === 'high');

  // Workforce health score: derived deterministically
  // 100 - (excessive shifts * 5) - (open reports * 8) - (high risk * 10)
  const healthScore = Math.max(
    40,
    Math.min(100, Math.round(100 - excessiveShifts.length * 4 - openReports.length * 6 - highRiskFindings.length * 8))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-teal-400 text-xs font-semibold mb-3 border border-slate-700">
            <Activity className="w-3.5 h-3.5" />
            <span>{config[language === 'ta' ? 'nameTa' : 'name']}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t.adminOverview} — Workforce Intelligence
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Real-time telemetry uniting smart attendance, fatigue risk monitoring, and accountable safety lifecycle tracking.
          </p>
        </div>

        {/* Workforce Health Index */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center sm:min-w-[200px]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {t.workforceHealth}
          </span>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {healthScore}/100
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {healthScore >= 85 ? 'Optimal Safe Operating Range' : 'Attention Recommended'}
          </span>
        </div>
      </div>

      {/* 6 Real Record-Derived KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Workforce */}
        <div
          onClick={() => onNavigate('workforce')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.totalWorkforce}</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{totalWorkforce} Workers</div>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <span>{indWorkers.map(w => w.name.split(' ')[0]).join(', ')}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Currently On Shift */}
        <div
          onClick={() => onNavigate('workforce')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.currentlyOnShift}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            {onShiftWorkers.length} Active
          </div>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <span>{((onShiftWorkers.length / totalWorkforce) * 100).toFixed(0)}% site presence</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Excessive Hours Alerts */}
        <div
          onClick={() => onNavigate('fairness')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.excessiveHoursAlerts}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-700 font-mono">
            {excessiveShifts.length} Shifts
          </div>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <span>Exceeds {thresholds.maxDailyHours}h daily limit</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Open Safety Incidents */}
        <div
          onClick={() => onNavigate('safety')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.openIncidents}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-700 font-mono">
            {openReports.length} Unresolved
          </div>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <span>Proof of Action active</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Average Shift Length */}
        <div
          onClick={() => onNavigate('workforce')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.avgShiftLength}</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {avgShiftDuration} Hours
          </div>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <span>Across {completedShifts.length} completed shifts</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Fairness Radar Findings */}
        <div
          onClick={() => onNavigate('fairness')}
          className="bg-white rounded-2xl p-5 border border-purple-200/90 shadow-sm hover:shadow-md transition cursor-pointer group bg-gradient-to-b from-purple-50/20 to-transparent"
        >
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Fairness Radar</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-900 font-mono">
            {findings.length} Signals
          </div>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <span>{highRiskFindings.length} High Risk findings</span>
            <ArrowRight className="w-3 h-3 text-purple-500 group-hover:translate-x-0.5 transition" />
          </p>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Action Queue Preview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-sm">Prioritized Incident Queue</h3>
            </div>
            <button
              onClick={() => onNavigate('safety')}
              className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
            >
              Open Safety Center <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {openReports.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No open incidents currently pending.</p>
            ) : (
              openReports.slice(0, 3).map(r => (
                <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-[11px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded">
                        #{r.id}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-rose-100 text-rose-800">
                        {r.severity}
                      </span>
                      <span className="text-xs text-slate-500">{r.workArea}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium line-clamp-1">
                      {r.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {r.currentStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Explainable Fairness Rule Engine Callout */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero-Hallucination Intelligence</span>
            </div>
            <h3 className="font-bold text-white text-base mb-2">
              Explainable Decision Support (UN SDG 8.8)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              FairShift avoids black-box algorithms or opaque employee scoring. Every fatigue alert, overtime disparity warning, and repeat hazard notice is supported by exact timestamped shifts and verifiable work-area records.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Current Max Daily Limit: {thresholds.maxDailyHours}h</span>
            <button
              onClick={() => onNavigate('fairness')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Configure Radar Rules <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
