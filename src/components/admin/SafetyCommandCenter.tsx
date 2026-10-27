import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations, getTranslation } from '../../constants/translations';
import { industryConfigs } from '../../constants/industryData';
import { SafetyReport, ReportStatus } from '../../types';
import { formatTimeAgo } from '../../utils/calculations';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  EyeOff,
  User,
  Filter,
  FileCheck2,
  Calendar,
  Building2,
  ChevronRight,
  X,
  MessageSquare,
  Check
} from 'lucide-react';

export const SafetyCommandCenter: React.FC = () => {
  const { reports, thresholds, industry, language, updateReportStatus } = useFairShift();
  const t = getTranslation(language);
  const config = industryConfigs[industry];

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  // Modal State for advancing status
  const [activeReportForStatus, setActiveReportForStatus] = useState<SafetyReport | null>(null);
  const [targetStatus, setTargetStatus] = useState<ReportStatus>('acknowledged');
  const [supervisorName, setSupervisorName] = useState<string>(config.adminRoles[0]);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  // Active industry reports
  const indReports = reports.filter(r => r.industry === industry);

  // Filtered reports
  const filteredReports = indReports.filter(r => {
    const matchesStatus = statusFilter === 'ALL' || r.currentStatus === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || r.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  const handleOpenStatusModal = (report: SafetyReport, nextStatus: ReportStatus) => {
    setActiveReportForStatus(report);
    setTargetStatus(nextStatus);
    setSupervisorName(config.adminRoles[0]);
    setResolutionNotes(
      nextStatus === 'acknowledged'
        ? 'Acknowledged by on-duty site safety team. Isolation checklist issued.'
        : nextStatus === 'investigating'
        ? 'Technical crew deployed to site. Structural inspection underway.'
        : 'Hazard mitigated. Damaged components replaced, zone inspected, and cleared for safe work.'
    );
  };

  const handleConfirmStatusUpdate = () => {
    if (!activeReportForStatus) return;

    updateReportStatus(
      activeReportForStatus.id,
      targetStatus,
      supervisorName,
      'Site Safety Administration',
      resolutionNotes
    );

    setActiveReportForStatus(null);
  };

  const severityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-200 dark:bg-rose-900 text-rose-950 dark:text-rose-100 uppercase border border-rose-300 dark:border-rose-700">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 uppercase">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">Low</span>;
    }
  };

  const statusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">{t.statusSubmitted}</span>;
      case 'acknowledged':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">{t.statusAcknowledged}</span>;
      case 'investigating':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">{t.statusInvestigating}</span>;
      case 'resolved':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">{t.statusResolved}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Safety Command Center Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t.adminSafety}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Safety Incident Queue — Proof of Action
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Every reported hazard triggers an accountable verification lifecycle with timestamped supervisor responses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl">
              {filteredReports.length} Incidents Displayed
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="ALL">Filter by Status: All Statuses</option>
              <option value="submitted">Submitted (Awaiting Action)</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="investigating">Under Investigation</option>
              <option value="resolved">Resolved</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="ALL">Filter by Severity: All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Incident Queue List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/90 dark:border-slate-800 shadow-sm text-slate-400 dark:text-slate-500 text-xs">
            <ShieldAlert className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            No safety incidents match the selected criteria.
          </div>
        ) : (
          filteredReports.map(report => {
            const timeInfo = formatTimeAgo(report.createdAt);
            const isOverdue = report.currentStatus !== 'resolved' && timeInfo.hoursDiff > thresholds.overdueReportHours;

            return (
              <div
                key={report.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border transition shadow-sm hover:shadow-md ${
                  isOverdue
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50/10 dark:bg-rose-950/20'
                    : report.currentStatus === 'resolved'
                    ? 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-800/20'
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-xs bg-slate-900 dark:bg-slate-800 text-white px-2.5 py-1 rounded-lg">
                      #{report.id}
                    </span>
                    {severityBadge(report.severity)}
                    {statusBadge(report.currentStatus)}

                    {report.isAnonymous ? (
                      <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                        <EyeOff className="w-3 h-3 text-slate-500 dark:text-slate-400" /> Anonymous Worker
                      </span>
                    ) : (
                      <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                        <User className="w-3 h-3 text-slate-500 dark:text-slate-400" /> {report.workerName}
                      </span>
                    )}

                    {isOverdue && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> SLA OVERDUE ({Math.floor(timeInfo.hoursDiff)}h)
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    Reported {timeInfo.label}
                  </span>
                </div>

                {/* Body row */}
                <div className="mb-4">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-1">{report.category}</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 italic">
                    "{report.description}"
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Zone: <strong className="text-slate-800 dark:text-slate-200">{report.workArea}</strong>
                    </span>
                    {report.voiceTranscriptUsed && (
                      <span className="text-teal-700 dark:text-teal-400 font-bold">🎙️ Voice Transcribed</span>
                    )}
                  </div>
                </div>

                {/* Audit trail summary */}
                <div className="mb-4 p-3 bg-slate-100/60 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider block mb-1.5">
                    Proof of Action Timeline ({report.timeline.length} Events)
                  </span>
                  <div className="space-y-1">
                    {report.timeline.slice(-2).map((ev, i) => (
                      <div key={i} className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                        <span>
                          <strong className="text-slate-900 dark:text-white">[{ev.newStatus.toUpperCase()}]</strong> by {ev.actorName}: {ev.notes}
                        </span>
                        <span className="font-mono text-slate-400 dark:text-slate-500">
                          {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Management Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Assigned: <strong className="text-slate-800 dark:text-slate-200">{report.assignedAdmin || 'Unassigned'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {report.currentStatus === 'submitted' && (
                      <button
                        onClick={() => handleOpenStatusModal(report, 'acknowledged')}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-950/20 transition flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.acknowledgeAction}</span>
                      </button>
                    )}

                    {(report.currentStatus === 'submitted' || report.currentStatus === 'acknowledged') && (
                      <button
                        onClick={() => handleOpenStatusModal(report, 'investigating')}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-950/20 transition flex items-center gap-1"
                      >
                        <span>{t.investigateAction}</span>
                      </button>
                    )}

                    {report.currentStatus !== 'resolved' && (
                      <button
                        onClick={() => handleOpenStatusModal(report, 'resolved')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.resolveAction}</span>
                      </button>
                    )}

                    {report.currentStatus === 'resolved' && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Audit Sealed & Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Proof of Action Transition Modal */}
      {activeReportForStatus && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Proof of Action Transition
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Advancing Incident #{activeReportForStatus.id} to [{targetStatus.toUpperCase()}]
                </h3>
              </div>
              <button
                onClick={() => setActiveReportForStatus(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Supervisor Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {t.adminNameLabel}
                </label>
                <select
                  value={supervisorName}
                  onChange={e => setSupervisorName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {config.adminRoles.map(role => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Taken / Resolution Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {t.resolutionNotesLabel}
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Detail the physical inspection, root-cause isolation, or contractor repair undertaken..."
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                <strong>Compliance Note:</strong> This timestamp and manager identity will be immutably sealed into the worker's personal Proof of Action history.
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveReportForStatus(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusUpdate}
                disabled={!resolutionNotes.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.saveStatusUpdate}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
