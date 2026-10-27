import React from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations, getTranslation } from '../../constants/translations';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileCheck,
  Briefcase,
  Star
} from 'lucide-react';

export const WorkerGrowth: React.FC = () => {
  const { currentWorker, language } = useFairShift();
  const t = getTranslation(language);

  return (
    <div className="space-y-6">
      {/* Worker Growth Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>{t.growthTitle}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'ta' ? currentWorker.nameTa : currentWorker.name} — Verified Skills Passport
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">{t.growthSub}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                {t.safetyExcellence}
              </span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {currentWorker.safetyScore}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {t.verifiedHoursTotal}
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {currentWorker.totalLifetimeHours}h
              </span>
            </div>
          </div>
        </div>

        {/* SDG 8 Alignment Note */}
        <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>UN SDG 8 Human Capital Mobility:</strong> {t.sdgImpactNote} Conventional casual labor lacks portable verified credentials. FairShift turns tamper-evident attendance records into permanent career equity.
          </div>
        </div>
      </div>

      {/* Verified Skills Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 transition">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.acquiredSkills}</h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {currentWorker.skills.length} Certified Capabilities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentWorker.skills.map((skill, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 transition"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {language === 'ta' ? skill.nameTa : skill.name}
                  </h4>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Tier: {language === 'ta' ? skill.levelTa : skill.level}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {skill.badge}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {skill.verifiedHours} On-Site Hours
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employment History Retention Card */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-emerald-400" />
          Cross-Contractor Passport Integrity
        </h3>
        <p className="text-xs text-slate-300 dark:text-slate-400 leading-relaxed max-w-2xl">
          When workers transition between primary contractors, subcontractors, or facility management agencies, their cumulative safe operating hours, zero-incident records, and specialized machinery certifications remain permanently attached to their verified FairShift ID.
        </p>
      </div>
    </div>
  );
};
