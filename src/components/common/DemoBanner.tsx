import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { portal, setPortal, industry, setIndustry, reports } = useFairShift();

  const unresolvedCount = reports.filter(r => r.industry === industry && r.currentStatus !== 'resolved').length;

  return (
    <aside aria-label="Demo Sequence Guide" className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">
            Hackathon Judge Demonstration Guide
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">
            Prompt Wars 2026 × SRM ACM | UN SDG 8 (Decent Work & Economic Growth)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden md:inline">
            Active Data: <strong className="text-emerald-300">{unresolvedCount} open incidents</strong> synced via LocalStorage
          </span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/60 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isOpen ? 'Hide Walkthrough' : 'Interactive Judge Walkthrough'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-800/80 bg-slate-950/90 px-4 py-4 animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Recommended 10-Step Evaluation Sequence
                </h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  Follow this sequence to test bi-directional data flow, Proof of Action, and explainable Fairness Radar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-400">Step 1-3: Worker</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Frontline</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-tight">
                  Open <strong>Worker Portal</strong>. Click <strong>Clock In</strong>, watch real-time timer, review Transparent Pay breakdown & verified test cases.
                </p>
                <button
                  onClick={() => setPortal('worker')}
                  className="mt-2 text-[11px] text-teal-300 hover:underline flex items-center gap-1 font-medium"
                >
                  Go to Worker <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-400">Step 4: SpeakUp</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Shield</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-tight">
                  Go to <strong>SpeakUp Shield</strong> tab. Submit a hazard (voice or text), toggle Anonymous mode, and confirm in Review modal.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-400">Step 5-7: Action</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Command</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-tight">
                  Switch to <strong>Command Center</strong>. See the new report in the queue. Advance status (Proof of Action audit trail updates!).
                </p>
                <button
                  onClick={() => setPortal('admin')}
                  className="mt-2 text-[11px] text-teal-300 hover:underline flex items-center gap-1 font-medium"
                >
                  Go to Admin <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-400">Step 8: Radar</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">AI / Rules</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-tight">
                  Click <strong>Fairness Radar</strong> tab. Review explainable fatigue & repeated-hazard alerts with triggering evidence & slider thresholds.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-400">Step 9-10: Cross-Ind</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Context</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-tight">
                  Switch Industry from <strong>Construction</strong> to <strong>Facilities</strong>. Notice tailored work areas, hazards, and worker records.
                </p>
                <button
                  onClick={() => setIndustry(industry === 'construction' ? 'facilities' : 'construction')}
                  className="mt-2 text-[11px] text-amber-300 hover:underline flex items-center gap-1 font-medium"
                >
                  Switch Industry ({industry === 'construction' ? 'Facilities' : 'Construction'})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
