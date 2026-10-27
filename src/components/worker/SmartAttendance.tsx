import React, { useState, useEffect } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations } from '../../constants/translations';
import { industryConfigs } from '../../constants/industryData';
import { calculateElapsedHours, formatDuration } from '../../utils/calculations';
import {
  Clock,
  Play,
  Square,
  Coffee,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export const SmartAttendance: React.FC = () => {
  const { currentWorker, shifts, industry, language, clockIn, clockOut, toggleBreak } = useFairShift();
  const t = translations[language];
  const config = industryConfigs[industry];

  const [selectedArea, setSelectedArea] = useState<string>(currentWorker.workArea);

  // Active shift
  const activeShift = shifts.find(
    s => s.id === currentWorker.activeShiftId || (s.workerId === currentWorker.id && !s.clockOut)
  );

  // Live elapsed timer
  const [elapsed, setElapsed] = useState<number>(() => {
    return activeShift ? calculateElapsedHours(activeShift.clockIn, null, activeShift.breakMinutes) : 0;
  });

  useEffect(() => {
    if (!activeShift) {
      setElapsed(0);
      return;
    }
    const timer = setInterval(() => {
      setElapsed(calculateElapsedHours(activeShift.clockIn, null, activeShift.breakMinutes));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeShift]);

  // Worker's recorded shifts
  const workerShifts = shifts.filter(s => s.workerId === currentWorker.id);

  return (
    <div className="space-y-6">
      {/* Attendance Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.attendanceHeading}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {language === 'ta' ? currentWorker.nameTa : currentWorker.name} — {t.currentStatus}
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">{t.attendanceSubheading}</p>
          </div>

          {/* Current State Pill */}
          <div className="flex items-center gap-2">
            <span
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                currentWorker.currentStatus === 'clocked_in'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : currentWorker.currentStatus === 'on_break'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentWorker.currentStatus === 'clocked_in'
                    ? 'bg-emerald-500 animate-pulse'
                    : currentWorker.currentStatus === 'on_break'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
              <span>
                {currentWorker.currentStatus === 'clocked_in'
                  ? t.statusClockedIn
                  : currentWorker.currentStatus === 'on_break'
                  ? t.statusOnBreak
                  : t.statusClockedOut}
              </span>
            </span>
          </div>
        </div>

        {/* Live Attendance Action Panel */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Work Area Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t.workAreaLabel}
            </label>
            <div className="relative">
              <select
                disabled={currentWorker.currentStatus !== 'clocked_out'}
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl border border-slate-200 p-3 pr-8 focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
              >
                {config.workAreas.map(area => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Geo-zone verified upon clock-in</p>
          </div>

          {/* Live Timer Display */}
          <div className="bg-slate-900 rounded-2xl p-4 text-white text-center shadow-inner">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              {t.shiftDuration}
            </span>
            <div className="text-3xl font-black font-mono text-emerald-400">
              {formatDuration(elapsed)}
            </div>
            <span className="text-[10px] text-slate-400">
              {activeShift ? `Started at ${new Date(activeShift.clockIn).toLocaleTimeString()}` : 'No active shift'}
            </span>
          </div>

          {/* Interactive Attendance Buttons */}
          <div className="space-y-2.5">
            {currentWorker.currentStatus === 'clocked_out' ? (
              <button
                onClick={() => clockIn(selectedArea)}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.clockInAction}</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => clockOut()}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950 transition"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{t.clockOutAction}</span>
                </button>
                <button
                  onClick={() => toggleBreak()}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>{currentWorker.currentStatus === 'on_break' ? t.endBreak : t.startBreak}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Demo GPS / Geo-verification notice */}
        <div className="mt-6 flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Demo Geo-Fencing Mode:</strong> Location verified within 50m of {selectedArea}.
            Simulated tamper-resistant biometric token logged on-device.
          </span>
        </div>
      </div>

      {/* Shift History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <h3 className="font-bold text-slate-900 text-base">{t.shiftHistory}</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {workerShifts.length} shifts recorded
          </span>
        </div>

        {workerShifts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Clock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">{t.noShiftsRecorded}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">{t.dateCol}</th>
                  <th className="py-3 px-3">{t.workAreaLabel}</th>
                  <th className="py-3 px-3">{t.inTimeCol}</th>
                  <th className="py-3 px-3">{t.outTimeCol}</th>
                  <th className="py-3 px-3">{t.durationCol}</th>
                  <th className="py-3 px-3">{t.overtimeCol}</th>
                  <th className="py-3 px-3">{t.earningsCol}</th>
                  <th className="py-3 px-3">{t.statusCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workerShifts.map(s => {
                  const isLive = !s.clockOut;
                  const durationDisplay = isLive ? formatDuration(elapsed) : `${s.hoursWorked} hrs`;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-3 font-semibold text-slate-900">{s.date}</td>
                      <td className="py-3.5 px-3 text-slate-600">{s.workArea}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-700">
                        {new Date(s.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-700">
                        {s.clockOut ? (
                          new Date(s.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        ) : (
                          <span className="text-emerald-600 font-bold animate-pulse">Running...</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{durationDisplay}</td>
                      <td className="py-3.5 px-3">
                        {s.overtimeHours > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                            +{s.overtimeHours}h OT
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-700 font-mono">
                        ₹{s.estimatedGrossPay}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isLive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isLive ? 'ACTIVE' : 'COMPLETED'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
