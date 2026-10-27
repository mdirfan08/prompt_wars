import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations } from '../../constants/translations';
import { analyzeFairnessRadar } from '../../utils/fairnessRadar';
import { FairnessFinding } from '../../types';
import {
  AlertTriangle,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Activity,
  Layers,
  Info,
  ChevronRight,
  TrendingDown,
  Clock,
  Sparkles
} from 'lucide-react';

export const FairnessRadarPanel: React.FC = () => {
  const { workers, shifts, reports, thresholds, updateThresholds, industry, language } = useFairShift();
  const t = translations[language];

  const findings = analyzeFairnessRadar(workers, shifts, reports, thresholds, industry);
  const [selectedFinding, setSelectedFinding] = useState<FairnessFinding | null>(findings[0] || null);

  const severityBadge = (sev: 'high' | 'medium' | 'low') => {
    switch (sev) {
      case 'high':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 uppercase">
            {t.severityBadgeHigh}
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
            {t.severityBadgeMed}
          </span>
        );
      case 'low':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
            {t.severityBadgeLow}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Fairness Radar Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-3 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Signature Differentiator: Explainable Workforce Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.radarTitle}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">{t.radarSub}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center sm:min-w-[180px]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              {t.findingsCount}
            </span>
            <div className="text-3xl font-black font-mono text-purple-400">
              {findings.length}
            </div>
            <span className="text-[10px] text-slate-500">Zero Hallucinations</span>
          </div>
        </div>

        {/* Disclaimer callout */}
        <div className="mt-6 p-3 rounded-2xl bg-purple-950/50 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Ethical AI Guardrail:</strong> {t.humanReviewDisclaimer} All radar flags are deterministic risk indicators derived mathematically from real attendance logs and safety incident submissions.
          </div>
        </div>
      </div>

      {/* Configurable Threshold Sliders */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-6">
          <Sliders className="w-4 h-4 text-slate-700" />
          <h3 className="font-bold text-slate-900 text-sm">{t.thresholdConfig}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Threshold 1: Max Daily Hours */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-800">{t.maxDailyThresholdLabel}</span>
              <span className="font-mono font-black text-purple-700 text-sm">
                {thresholds.maxDailyHours} Hours
              </span>
            </div>
            <input
              type="range"
              min="7"
              max="12"
              step="0.5"
              value={thresholds.maxDailyHours}
              onChange={e => updateThresholds({ maxDailyHours: Number(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>7h</span>
              <span>Default: 9h</span>
              <span>12h</span>
            </div>
          </div>

          {/* Threshold 2: Overdue SLA Hours */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-800">{t.overdueHoursLabel}</span>
              <span className="font-mono font-black text-rose-700 text-sm">
                {thresholds.overdueReportHours} Hours
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="48"
              step="4"
              value={thresholds.overdueReportHours}
              onChange={e => updateThresholds({ overdueReportHours: Number(e.target.value) })}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>12h</span>
              <span>Default: 24h</span>
              <span>48h</span>
            </div>
          </div>

          {/* Threshold 3: Repeated Hazard Count */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-800">Repeated Incident Threshold</span>
              <span className="font-mono font-black text-amber-700 text-sm">
                {thresholds.repeatedHazardThreshold} Reports
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="5"
              step="1"
              value={thresholds.repeatedHazardThreshold}
              onChange={e => updateThresholds({ repeatedHazardThreshold: Number(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>2 Reports</span>
              <span>Default: 2</span>
              <span>5 Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Findings List & Deep Explanation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Prioritized Findings List */}
        <div className="lg:col-span-2 space-y-3">
          {findings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm text-slate-400 text-xs">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
              {t.noFindingsNotice}
            </div>
          ) : (
            findings.map(finding => {
              const isSelected = selectedFinding?.id === finding.id;
              return (
                <div
                  key={finding.id}
                  onClick={() => setSelectedFinding(finding)}
                  className={`bg-white rounded-2xl p-5 border transition cursor-pointer shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'border-purple-600 ring-2 ring-purple-600/20'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {severityBadge(finding.severity)}
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {finding.type.replace('_', ' ')}
                      </span>
                    </div>
                    {finding.workArea && (
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {finding.workArea}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">
                    {language === 'ta' ? finding.titleTa : finding.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                    {finding.summary}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <span className="font-mono text-[11px]">
                      Records: {finding.supportedRecordIds.join(', ')}
                    </span>
                    <span className="text-purple-700 font-bold flex items-center gap-0.5">
                      Inspect Evidence <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Deep Explanation & Supporting Records Panel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <FileText className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Explainable Audit Breakdown</h3>
          </div>

          {selectedFinding ? (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">
                    Anomaly Ref: {selectedFinding.id}
                  </span>
                  {severityBadge(selectedFinding.severity)}
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {selectedFinding.title}
                </h4>
              </div>

              {/* Triggering Evidence */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">
                  {t.evidenceHeader}
                </span>
                <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                  {selectedFinding.evidence}
                </p>
              </div>

              {/* Why This Matters */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px] block mb-1">
                  {t.whyItMattersHeader}
                </span>
                <p className="text-amber-800 leading-relaxed">
                  {selectedFinding.whyItMatters}
                </p>
              </div>

              {/* Recommended Supervisor Action */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px] block mb-1">
                  {t.recommendationHeader}
                </span>
                <p className="text-emerald-800 font-medium leading-relaxed">
                  {selectedFinding.recommendedAction}
                </p>
              </div>

              {/* Supported Records Badge */}
              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Verified Data Lineage:</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedFinding.supportedRecordIds.length} Linked Records
                </span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select any finding to inspect its exact triggering record and audit trail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
