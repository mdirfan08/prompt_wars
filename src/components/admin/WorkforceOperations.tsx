import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations, getTranslation } from '../../constants/translations';
import { industryConfigs } from '../../constants/industryData';
import { Worker, Shift } from '../../types';
import { calculateElapsedHours, calculatePay, formatDuration } from '../../utils/calculations';
import {
  Users,
  Search,
  Filter,
  HardHat,
  Clock,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  X,
  Phone,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const WorkforceOperations: React.FC = () => {
  const { workers, shifts, thresholds, industry, language } = useFairShift();
  const t = getTranslation(language);
  const config = industryConfigs[industry];

  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  // Workers for the active industry
  const indWorkers = workers.filter(w => w.industry === industry);

  // Filtered workers
  const filteredWorkers = indWorkers.filter(w => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nameTa.includes(searchTerm);

    const matchesArea = areaFilter === 'ALL' || w.workArea === areaFilter;
    const matchesStatus = statusFilter === 'ALL' || w.currentStatus === statusFilter;

    return matchesSearch && matchesArea && matchesStatus;
  });

  // Today's ISO date string
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Operations Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>{t.adminWorkforce}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Workforce Operations & Roster
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Real-time attendance statuses, shift durations, and fatigue flags across {config[language === 'ta' ? 'nameTa' : 'name']}.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl">
            Showing {filteredWorkers.length} of {indWorkers.length} Workers
          </span>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Area Filter */}
          <div className="relative">
            <select
              value={areaFilter}
              onChange={e => setAreaFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">{t.allAreas}</option>
              {config.workAreas.map(area => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">{t.allStatuses}</option>
              <option value="clocked_in">Active on Shift</option>
              <option value="clocked_out">Off Shift</option>
              <option value="on_break">On Break</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Worker Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition">
        {filteredWorkers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
            <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            No workers match the current search and filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Worker & Role</th>
                  <th className="py-3 px-3">Work Area</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Hours Today</th>
                  <th className="py-3 px-3">Overtime</th>
                  <th className="py-3 px-3">Est. Today's Pay</th>
                  <th className="py-3 px-3">Alerts</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredWorkers.map(w => {
                  const workerShifts = shifts.filter(s => s.workerId === w.id);
                  const activeShift = workerShifts.find(s => !s.clockOut);
                  const completedToday = workerShifts.filter(s => s.date === todayStr && s.clockOut);
                  const activeHours = activeShift ? calculateElapsedHours(activeShift.clockIn, null, activeShift.breakMinutes) : 0;
                  const completedHours = completedToday.reduce((acc, s) => acc + s.hoursWorked, 0);
                  const totalTodayHours = Number((activeHours + completedHours).toFixed(2));

                  const otHours = Math.max(0, totalTodayHours - 8.0);
                  const pay = calculatePay(totalTodayHours, w.hourlyRate, 1.5, 8.0);
                  const hasFatigueAlert = totalTodayHours > thresholds.maxDailyHours;

                  return (
                    <tr key={w.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      {/* Name & Role */}
                      <td className="py-3.5 px-3">
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {language === 'ta' ? w.nameTa : w.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {language === 'ta' ? w.roleTa : w.role}
                        </div>
                      </td>

                      {/* Work Area */}
                      <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {w.workArea}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            w.currentStatus === 'clocked_in'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                              : w.currentStatus === 'on_break'
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {w.currentStatus === 'clocked_in'
                            ? 'ACTIVE'
                            : w.currentStatus === 'on_break'
                            ? 'ON BREAK'
                            : 'OFF SHIFT'}
                        </span>
                      </td>

                      {/* Hours Today */}
                      <td className="py-3.5 px-3 font-bold font-mono text-slate-900 dark:text-white">
                        {totalTodayHours > 0 ? `${totalTodayHours}h` : '0h'}
                      </td>

                      {/* Overtime */}
                      <td className="py-3.5 px-3">
                        {otHours > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[10px]">
                            +{otHours.toFixed(1)}h OT
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Estimated Pay */}
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        ₹{pay.grossPay}
                      </td>

                      {/* Alerts */}
                      <td className="py-3.5 px-3">
                        {hasFatigueAlert ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-extrabold text-[10px] flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Fatigue Risk
                          </span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Normal
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => setSelectedWorker(w)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <span>Timesheet</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Worker Detail Drawer Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Verified Worker File
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedWorker.name} ({selectedWorker.nameTa})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedWorker.role} • {selectedWorker.workArea}
                </p>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Base Rate</span>
                <span className="font-mono font-black text-slate-900 dark:text-white text-base">₹{selectedWorker.hourlyRate}/hr</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Lifetime Hours</span>
                <span className="font-mono font-black text-slate-900 dark:text-white text-base">{selectedWorker.totalLifetimeHours}h</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-100 dark:border-emerald-800 text-center">
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold block">Safety Score</span>
                <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 text-base">{selectedWorker.safetyScore}%</span>
              </div>
            </div>

            {/* Shift History Table */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
                Recorded Shifts Timesheet
              </h4>
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Area</th>
                      <th className="p-3">Hours</th>
                      <th className="p-3">Overtime</th>
                      <th className="p-3">Est. Pay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {shifts.filter(s => s.workerId === selectedWorker.id).map(s => (
                      <tr key={s.id}>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{s.date}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{s.workArea}</td>
                        <td className="p-3 font-bold dark:text-slate-200">{s.hoursWorked}h</td>
                        <td className="p-3 text-amber-700 dark:text-amber-400 font-bold">
                          {s.overtimeHours > 0 ? `+${s.overtimeHours}h` : '—'}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">₹{s.estimatedGrossPay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition"
              >
                Close Timesheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
