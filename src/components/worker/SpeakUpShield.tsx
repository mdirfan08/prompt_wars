import React, { useState, useEffect } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { translations } from '../../constants/translations';
import { industryConfigs } from '../../constants/industryData';
import { ReportSeverity } from '../../types';
import { isSpeechRecognitionSupported, createSpeechRecognizer } from '../../utils/speech';
import {
  ShieldAlert,
  Mic,
  MicOff,
  EyeOff,
  Eye,
  Send,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Volume2,
  MapPin,
  X
} from 'lucide-react';

interface SpeakUpShieldProps {
  onReportSubmitted?: (reportId: string) => void;
}

export const SpeakUpShield: React.FC<SpeakUpShieldProps> = ({ onReportSubmitted }) => {
  const { currentWorker, industry, language, submitSafetyReport } = useFairShift();
  const t = translations[language];
  const config = industryConfigs[industry];

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string>(config.safetyCategories[0].labelEn);
  const [selectedSeverity, setSelectedSeverity] = useState<ReportSeverity>('high');
  const [workArea, setWorkArea] = useState<string>(currentWorker.workArea);
  const [description, setDescription] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceUsed, setVoiceUsed] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  // Keep category updated if industry changes
  useEffect(() => {
    setSelectedCategory(config.safetyCategories[0].labelEn);
    setWorkArea(currentWorker.workArea);
  }, [industry, currentWorker]);

  // Voice recognition instance
  const speechSupported = isSpeechRecognitionSupported();

  const handleToggleVoice = () => {
    if (!speechSupported) {
      setVoiceError(t.voiceFallback);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setVoiceError(null);
    setIsListening(true);

    const recognizer = createSpeechRecognizer(language, {
      onResult: (transcript: string) => {
        setDescription(prev => (prev ? `${prev} ${transcript}` : transcript));
        setVoiceUsed(true);
      },
      onError: (errMsg: string) => {
        setVoiceError(`Voice recognition: ${errMsg}`);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (recognizer) {
      try {
        recognizer.start();
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      return;
    }
    setShowReviewModal(true);
  };

  const handleFinalSubmit = () => {
    const reportId = submitSafetyReport({
      category: selectedCategory,
      severity: selectedSeverity,
      workArea,
      description,
      isAnonymous,
      voiceTranscriptUsed: voiceUsed
    });

    setShowReviewModal(false);
    setSubmittedReportId(reportId);
    setDescription('');
    setVoiceUsed(false);

    if (onReportSubmitted) {
      onReportSubmitted(reportId);
    }
  };

  const severityOptions: { value: ReportSeverity; label: string; bg: string; border: string; text: string }[] = [
    { value: 'low', label: t.severityLow, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
    { value: 'medium', label: t.severityMedium, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
    { value: 'high', label: t.severityHigh, bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' },
    { value: 'critical', label: t.severityCritical, bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-950 font-black' }
  ];

  return (
    <div className="space-y-6">
      {/* SpeakUp Shield Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t.speakUpHeading}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              SpeakUp Shield — Frontline Hazard Intelligence
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">{t.speakUpSubheading}</p>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900 text-white text-xs">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Worker Protection: <strong>No Reprisal Guarantee</strong> (UN SDG 8.8)
            </span>
          </div>
        </div>

        {/* Honest Privacy Notice Callout */}
        <div className="mt-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <EyeOff className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Prototype Security Boundary:</strong> {t.anonymousExplainer} When Anonymous mode is enabled, your personal identity is redacted from site supervisor displays.
          </div>
        </div>
      </div>

      {/* Success Confirmation Banner if submitted */}
      {submittedReportId && (
        <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-xl border border-emerald-700 flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">
                {t.reportSubmittedSuccess} #{submittedReportId}
              </h4>
              <p className="text-xs text-emerald-200 mt-0.5">
                Proof of Action tracking is now active. Switch to the <strong>Proof of Action</strong> tab or the <strong>Employer Command Center</strong> to observe live lifecycle progression.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubmittedReportId(null)}
            className="text-emerald-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hazard Report Form */}
      <form onSubmit={handleOpenReview} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        {/* Category & Work Area Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hazard Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t.reportCategory}
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl border border-slate-200 p-3.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {config.safetyCategories.map(cat => (
                <option key={cat.id} value={cat.labelEn}>
                  {language === 'ta' ? cat.labelTa : cat.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Work Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t.workAreaPrompt}
            </label>
            <div className="relative">
              <select
                value={workArea}
                onChange={e => setWorkArea(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl border border-slate-200 p-3.5 pr-8 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {config.workAreas.map(area => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Severity Selection (Cards) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {t.severityLevel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {severityOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedSeverity(opt.value)}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  selectedSeverity === opt.value
                    ? `${opt.bg} ${opt.border} ring-2 ring-slate-900 shadow-md`
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold uppercase ${opt.text}`}>
                    {opt.value}
                  </span>
                  {selectedSeverity === opt.value && (
                    <span className="w-2 h-2 rounded-full bg-slate-900" />
                  )}
                </div>
                <span className="text-[11px] text-slate-600 block leading-tight">
                  {opt.label.split('—')[1] || opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Description + Voice to Text */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.hazardDescription}
            </label>

            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-900/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>{t.voiceListening}</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.voiceInputPrompt}</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="E.g., Loose scaffold ledger bar on level 3, ungrounded wire near concrete mixer, or slippery oil spill blocking fire egress..."
              className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm rounded-2xl border border-slate-200 p-4 focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-slate-400"
              required
            />
            {voiceUsed && (
              <span className="absolute right-3 bottom-3 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> Voice Captured
              </span>
            )}
          </div>

          {voiceError && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3 h-3" />
              <span>{voiceError}</span>
            </p>
          )}
        </div>

        {/* Anonymity Toggle */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isAnonymous ? 'bg-slate-900 text-emerald-400' : 'bg-slate-200 text-slate-600'}`}>
              {isAnonymous ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-bold text-slate-900 text-xs block">{t.anonymousToggle}</span>
              <span className="text-[11px] text-slate-500">
                {isAnonymous
                  ? 'Your name and contact phone will be redacted in ordinary supervisor incident queues'
                  : `Report will display your identity (${currentWorker.name})`}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              isAnonymous
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {isAnonymous ? 'Anonymous: ON' : 'Anonymous: OFF'}
          </button>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!description.trim()}
            className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm shadow-xl shadow-amber-950/20 flex items-center justify-center gap-2 transition"
          >
            <Send className="w-4 h-4" />
            <span>{t.reviewBeforeSubmit}</span>
          </button>
        </div>
      </form>

      {/* Review Before Submit Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-slate-900 shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              {t.reviewModalTitle}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Please verify your report details. Once transmitted, this creates a verifiable Proof of Action record in the employer safety queue.
            </p>

            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">{t.reviewCategory}:</span>
                <span className="font-bold text-slate-900">{selectedCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">{t.reviewSeverity}:</span>
                <span className="font-bold text-rose-700 uppercase">{selectedSeverity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">{t.reviewArea}:</span>
                <span className="font-bold text-slate-900">{workArea}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">{t.reviewIdentity}:</span>
                <span className={`font-bold ${isAnonymous ? 'text-emerald-700' : 'text-slate-800'}`}>
                  {isAnonymous ? t.identityAnonymous : `${t.identityDisclosed} ${currentWorker.name}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-500 block mb-1">Description:</span>
                <p className="text-slate-800 italic bg-white p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                  "{description}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950/20 transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.confirmAndSend}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
