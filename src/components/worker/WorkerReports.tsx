import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations } from '../../constants/translations';
import { SafetyReport, ReportStatus } from '../../types';
import { formatTimeAgo } from '../../utils/calculations';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  EyeOff,
  UserCheck,
  Calendar,
  Building2,
  FileCheck2,
  ArrowRight
} from 'lucide-react';

export const WorkerReports: React.FC = () => {
  const { reports, currentWorker, industry, language } = useFairShift();
  const t = translations[language];

  // Reports relevant to current worker or current industry
  const relevantReports = reports.filter(
    r => r.industry === industry && (r.workerId === currentWorker.id || r.isAnonymous)
  );

  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(null);

  const statusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            {t.statusSubmitted}
          </span>
        );
      case 'acknowledged':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            {t.statusAcknowledged}
          </span>
        );
      case 'investigating':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            {t.statusInvestigating}
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {t.statusResolved}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Proof of Action Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>{t.proofOfActionTitle}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Proof of Action — Live Supervisor Accountability
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">{t.proofOfActionSub}</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Tracked Records
            </span>
            <span className="text-2xl font-black font-mono text-slate-900">
              {relevantReports.length} Active Audits
            </span>
          </div>
        </div>
      </div>

      {/* Reports List and Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report Cards */}
        <div className="lg:col-span-2 space-y-3">
          {relevantReports.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm text-slate-400">
              <ShieldCheck className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-sm">{t.noReportsFound}</p>
            </div>
          ) : (
            relevantReports.map(report => {
              const timeInfo = formatTimeAgo(report.createdAt);
              const isSelected = selectedReport?.id === report.id;
              const isOverdue = report.currentStatus !== 'resolved' && timeInfo.hoursDiff > 24;

              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`bg-white rounded-2xl p-5 border transition cursor-pointer shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        #{report.id}
                      </span>
                      {statusBadge(report.currentStatus)}
                      {report.isAnonymous && (
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Anonymous
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {timeInfo.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-1">{report.category}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    "{report.description}"
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {report.workArea}
                    </span>

                    {isOverdue && (
                      <span className="text-rose-600 font-bold flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> SLA Overdue
                      </span>
                    )}

                    <span className="text-teal-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                      View Timeline <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Proof of Action Audit Timeline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Proof of Action Timeline</h3>
          </div>

          {selectedReport ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs text-slate-500">
                    Incident #{selectedReport.id}
                  </span>
                  {statusBadge(selectedReport.currentStatus)}
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {selectedReport.category}
                </h4>
                <p className="text-xs text-slate-600 mt-1 italic p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  "{selectedReport.description}"
                </p>
              </div>

              {/* Chronological Audit Trail */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Verified Audit History
                </span>

                <div className="relative pl-6 space-y-4 border-l-2 border-emerald-500/30">
                  {selectedReport.timeline.map((event, idx) => (
                    <div key={event.id || idx} className="relative">
                      {/* Node circle */}
                      <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="font-extrabold text-slate-900 uppercase">
                            {event.newStatus}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          By: <strong className="text-slate-800">{event.actorName}</strong> ({event.actorRole})
                        </div>
                        <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1 leading-relaxed">
                          {event.notes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              <FileCheck2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              Select any safety incident to review its immutable chronological supervisor audit trail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
