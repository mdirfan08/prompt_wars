import React, { useState, useEffect } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations } from '../../constants/translations';
import { industryConfigs } from '../../constants/industryData';
import { calculateElapsedHours, calculatePay, formatDuration } from '../../utils/calculations';
import {
  Clock,
  Play,
  Square,
  Coffee,
  DollarSign,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface WorkerHomeProps {
  onNavigate: (tab: 'home' | 'attendance' | 'pay' | 'speakup' | 'reports' | 'growth') => void;
}

export const WorkerHome: React.FC<WorkerHomeProps> = ({ onNavigate }) => {
  const { currentWorker, shifts, reports, industry, language, clockIn, clockOut, toggleBreak } = useFairShift();
  const t = translations[language];

  // Dynamic greeting based on hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.greetingMorning : hour < 17 ? t.greetingAfternoon : t.greetingEvening;

  // Active shift calculation
  const activeShift = shifts.find(
    s => s.id === currentWorker.activeShiftId || (s.workerId === currentWorker.id && !s.clockOut)
  );

  // Live timer for active shift
  const [liveElapsedHours, setLiveElapsedHours] = useState<number>(() => {
    return activeShift ? calculateElapsedHours(activeShift.clockIn, null, activeShift.breakMinutes) : 0;
  });

  useEffect(() => {
    if (!activeShift) {
      setLiveElapsedHours(0);
      return;
    }
    const interval = setInterval(() => {
      setLiveElapsedHours(calculateElapsedHours(activeShift.clockIn, null, activeShift.breakMinutes));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeShift]);

  // Today's total logged hours (completed shifts today + active shift)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCompletedShifts = shifts.filter(s => s.workerId === currentWorker.id && s.date === todayStr && s.clockOut);
  const completedTodayHours = todayCompletedShifts.reduce((acc, s) => acc + s.hoursWorked, 0);
  const totalTodayHours = Number((completedTodayHours + (activeShift ? liveElapsedHours : 0)).toFixed(2));

  // Today's estimated pay
  const payEst = calculatePay(totalTodayHours, currentWorker.hourlyRate, 1.5, 8.0);

  // Open safety reports for current industry
  const openReportsCount = reports.filter(r => r.industry === industry && r.currentStatus !== 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {industryConfigs[industry][language === 'ta' ? 'nameTa' : 'name']}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {greeting},{' '}
              <span className="text-emerald-400">
                {language === 'ta' ? currentWorker.nameTa : currentWorker.name}
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {language === 'ta' ? currentWorker.roleTa : currentWorker.role} • {t.workerSubtitle}
            </p>

            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t.workAreaLabel}: <strong className="text-slate-200">{currentWorker.workArea}</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400/90 font-medium">{t.gpsVerified}</span>
            </div>
          </div>

          {/* Primary Attendance Action Card */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 sm:min-w-[280px] shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.currentStatus}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  currentWorker.currentStatus === 'clocked_in'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : currentWorker.currentStatus === 'on_break'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {currentWorker.currentStatus === 'clocked_in'
                  ? t.statusClockedIn
                  : currentWorker.currentStatus === 'on_break'
                  ? t.statusOnBreak
                  : t.statusClockedOut}
              </span>
            </div>

            {/* Shift Timer when clocked in */}
            {activeShift && (
              <div className="mb-4 p-3 rounded-xl bg-slate-900/90 border border-emerald-500/20 text-center">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  {t.shiftDuration}
                </span>
                <span className="text-2xl font-black font-mono text-emerald-300">
                  {formatDuration(liveElapsedHours)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{t.activeTimerText}</span>
              </div>
            )}

            {/* Attendance Buttons */}
            <div className="space-y-2">
              {currentWorker.currentStatus === 'clocked_out' ? (
                <button
                  onClick={() => clockIn()}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition transform active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t.clockInAction}</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => clockOut()}
                    className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-950 flex items-center justify-center gap-2 transition"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>{t.clockOutAction}</span>
                  </button>

                  <button
                    onClick={() => toggleBreak()}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>{currentWorker.currentStatus === 'on_break' ? t.endBreak : t.startBreak}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Worker Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Logged Hours */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.todayWorked}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{formatDuration(totalTodayHours)}</div>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <span>{totalTodayHours >= 8 ? 'Standard shift completed' : 'Standard 8h limit'}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Today's Estimated Earnings */}
        <div
          onClick={() => onNavigate('pay')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.estimatedTodayPay}</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{payEst.grossPay}</div>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <span>₹{currentWorker.hourlyRate}/hr base rate</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* SpeakUp Shield Quick Action */}
        <div
          onClick={() => onNavigate('speakup')}
          className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm hover:shadow-md transition cursor-pointer group bg-gradient-to-b from-amber-50/20 to-transparent"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">{t.navSpeakUp}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900">Report a Hazard</div>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <span>Voice / Text with Anonymous mode</span>
            <ArrowRight className="w-3 h-3 text-amber-500 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Proof of Action Active Reports */}
        <div
          onClick={() => onNavigate('reports')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.openReportsCount}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{openReportsCount} Incidents</div>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <span>{t.navReports} tracking</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
          </p>
        </div>
      </div>

      {/* Honest Prototype Notice & Shift Schedule Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Shift Info */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex items-start gap-3">
          <Calendar className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{t.nextShift}</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Tomorrow: 08:00 - 16:30 • {currentWorker.workArea} (Standard 8.0h Shift + 30m meal break)
            </p>
          </div>
        </div>

        {/* Transparency & UN SDG 8 Note */}
        <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200/60 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-950 text-sm">UN SDG 8: Decent Work & Economic Growth</h4>
            <p className="text-xs text-emerald-800/90 mt-0.5">
              {t.deviceNote}: All attendance records and hazard alerts are stored immutably in shared local state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
