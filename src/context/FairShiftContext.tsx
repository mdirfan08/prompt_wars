import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Worker,
  Shift,
  SafetyReport,
  IndustryType,
  Language,
  ReportStatus,
  FairnessThresholds,
  AuditEvent,
  ReportSeverity
} from '../types';
import {
  initialWorkers,
  initialShifts,
  initialReports,
  industryConfigs
} from '../constants/industryData';
import { calculateElapsedHours, calculatePay } from '../utils/calculations';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface FairShiftContextType {
  // Global Navigation & Persona
  portal: 'worker' | 'admin';
  setPortal: (p: 'worker' | 'admin') => void;
  industry: IndustryType;
  setIndustry: (ind: IndustryType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentWorker: Worker;
  setCurrentWorkerId: (id: string) => void;
  
  // Data Records
  workers: Worker[];
  shifts: Shift[];
  reports: SafetyReport[];
  thresholds: FairnessThresholds;
  
  // Toast notifications
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;

  // Worker Attendance Actions
  clockIn: (workArea?: string) => boolean;
  clockOut: () => boolean;
  toggleBreak: () => void;

  // Safety Reporting & Proof of Action
  submitSafetyReport: (data: {
    category: string;
    severity: ReportSeverity;
    workArea: string;
    description: string;
    isAnonymous: boolean;
    voiceTranscriptUsed?: boolean;
  }) => string;

  updateReportStatus: (
    reportId: string,
    newStatus: ReportStatus,
    actorName: string,
    actorRole: string,
    notes: string
  ) => void;

  // Fairness Radar Actions
  updateThresholds: (partial: Partial<FairnessThresholds>) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'fairshift_demo_state_v1';

const defaultThresholds: FairnessThresholds = {
  maxDailyHours: 9.0,
  overdueReportHours: 24.0,
  overtimeInequityThreshold: 2.0,
  repeatedHazardThreshold: 2
};

const FairShiftContext = createContext<FairShiftContextType | undefined>(undefined);

export const FairShiftProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available, otherwise default
  const [portal, setPortal] = useState<'worker' | 'admin'>('worker');
  const [industry, setIndustryState] = useState<IndustryType>('construction');
  const [language, setLanguage] = useState<Language>('en');
  const [currentWorkerId, setCurrentWorkerId] = useState<string>('w-c1');
  const [toast, setToast] = useState<ToastState | null>(null);

  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_workers`);
      return saved ? JSON.parse(saved) : initialWorkers;
    } catch {
      return initialWorkers;
    }
  });

  const [shifts, setShifts] = useState<Shift[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_shifts`);
      return saved ? JSON.parse(saved) : initialShifts;
    } catch {
      return initialShifts;
    }
  });

  const [reports, setReports] = useState<SafetyReport[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reports`);
      return saved ? JSON.parse(saved) : initialReports;
    } catch {
      return initialReports;
    }
  });

  const [thresholds, setThresholds] = useState<FairnessThresholds>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_thresholds`);
      return saved ? JSON.parse(saved) : defaultThresholds;
    } catch {
      return defaultThresholds;
    }
  });

  // Save to localStorage whenever core data changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_workers`, JSON.stringify(workers));
      localStorage.setItem(`${STORAGE_KEY}_shifts`, JSON.stringify(shifts));
      localStorage.setItem(`${STORAGE_KEY}_reports`, JSON.stringify(reports));
      localStorage.setItem(`${STORAGE_KEY}_thresholds`, JSON.stringify(thresholds));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [workers, shifts, reports, thresholds]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(curr => (curr?.id === id ? null : curr));
    }, 4500);
  };

  // Switch Industry handler: auto-picks appropriate worker for that industry
  const setIndustry = (newInd: IndustryType) => {
    setIndustryState(newInd);
    const workerInInd = workers.find(w => w.industry === newInd);
    if (workerInInd) {
      setCurrentWorkerId(workerInInd.id);
    }
    showToast(
      newInd === 'construction'
        ? 'Switched to Metro Infrastructure & Construction context'
        : 'Switched to University Campus Facilities & Support context',
      'info'
    );
  };

  // Current active worker object
  const currentWorker =
    workers.find(w => w.id === currentWorkerId) ||
    workers.find(w => w.industry === industry) ||
    workers[0];

  // CLOCK IN Action
  const clockIn = (customWorkArea?: string): boolean => {
    if (currentWorker.currentStatus === 'clocked_in') {
      showToast('Worker is already clocked in on an active shift.', 'warning');
      return false;
    }

    const nowIso = new Date().toISOString();
    const todayStr = nowIso.split('T')[0];
    const newShiftId = `shift-${Date.now()}`;
    const assignedArea = customWorkArea || currentWorker.workArea;

    const newShift: Shift = {
      id: newShiftId,
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      industry: currentWorker.industry,
      date: todayStr,
      clockIn: nowIso,
      clockOut: null,
      breakMinutes: 0,
      hoursWorked: 0.05, // initial fraction
      regularHours: 0.05,
      overtimeHours: 0,
      workArea: assignedArea,
      hourlyRate: currentWorker.hourlyRate,
      overtimeMultiplier: 1.5,
      estimatedGrossPay: Number((0.05 * currentWorker.hourlyRate).toFixed(2))
    };

    setShifts(prev => [newShift, ...prev]);

    setWorkers(prev =>
      prev.map(w =>
        w.id === currentWorker.id
          ? {
              ...w,
              currentStatus: 'clocked_in',
              activeShiftId: newShiftId,
              workArea: assignedArea
            }
          : w
      )
    );

    showToast(
      language === 'ta'
        ? `பணி தொடக்கம் பதிவு செய்யப்பட்டது (${new Date().toLocaleTimeString()})`
        : `Clock-in recorded successfully at ${new Date().toLocaleTimeString()} [Area: ${assignedArea}]`,
      'success'
    );
    return true;
  };

  // CLOCK OUT Action
  const clockOut = (): boolean => {
    if (currentWorker.currentStatus === 'clocked_out') {
      showToast('Worker is not currently clocked in.', 'warning');
      return false;
    }

    const activeShift = shifts.find(
      s => s.id === currentWorker.activeShiftId || (s.workerId === currentWorker.id && !s.clockOut)
    );

    const nowIso = new Date().toISOString();
    const elapsed = activeShift
      ? calculateElapsedHours(activeShift.clockIn, nowIso, activeShift.breakMinutes)
      : 1.0;
    const finalHours = Math.max(0.1, elapsed);

    const pay = calculatePay(finalHours, currentWorker.hourlyRate, 1.5, 8.0);

    if (activeShift) {
      setShifts(prev =>
        prev.map(s =>
          s.id === activeShift.id
            ? {
                ...s,
                clockOut: nowIso,
                hoursWorked: Number(finalHours.toFixed(2)),
                regularHours: pay.standardHours,
                overtimeHours: pay.overtimeHours,
                estimatedGrossPay: pay.grossPay
              }
            : s
        )
      );
    }

    setWorkers(prev =>
      prev.map(w =>
        w.id === currentWorker.id
          ? {
              ...w,
              currentStatus: 'clocked_out',
              activeShiftId: null,
              totalLifetimeHours: Number((w.totalLifetimeHours + finalHours).toFixed(1))
            }
          : w
      )
    );

    showToast(
      language === 'ta'
        ? `பணி முடிந்தது. பதிவு செய்யப்பட்ட நேரம்: ${finalHours.toFixed(2)} மணி. உத்தேச ஊதியம்: ₹${pay.grossPay}`
        : `Clock-out recorded. Shift: ${finalHours.toFixed(2)} hrs. Estimated Gross Pay: ₹${pay.grossPay}`,
      'success'
    );
    return true;
  };

  // TOGGLE BREAK Action
  const toggleBreak = () => {
    if (currentWorker.currentStatus === 'clocked_out') {
      showToast('Cannot take a break while off-shift. Please clock in first.', 'warning');
      return;
    }

    const newStatus = currentWorker.currentStatus === 'clocked_in' ? 'on_break' : 'clocked_in';
    setWorkers(prev =>
      prev.map(w => (w.id === currentWorker.id ? { ...w, currentStatus: newStatus } : w))
    );

    showToast(
      newStatus === 'on_break'
        ? language === 'ta' ? 'இடைவேளை தொடங்கியது' : 'Break started. Break timer is running.'
        : language === 'ta' ? 'இடைவேளை முடிந்தது, பணி மீண்டும் தொடர்கிறது' : 'Break ended. Shift resumed.',
      'info'
    );
  };

  // SUBMIT SAFETY REPORT (SpeakUp Shield)
  const submitSafetyReport = (data: {
    category: string;
    severity: ReportSeverity;
    workArea: string;
    description: string;
    isAnonymous: boolean;
    voiceTranscriptUsed?: boolean;
  }): string => {
    const reportRefId = `FS-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const initialAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: nowIso,
      previousStatus: null,
      newStatus: 'submitted',
      actorName: data.isAnonymous ? 'Anonymous Worker (SpeakUp Shield)' : currentWorker.name,
      actorRole: currentWorker.role,
      notes: `Report created via SpeakUp Shield${data.voiceTranscriptUsed ? ' with Voice Dictation' : ''}.`
    };

    const newReport: SafetyReport = {
      id: reportRefId,
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      isAnonymous: data.isAnonymous,
      industry: currentWorker.industry,
      category: data.category,
      severity: data.severity,
      workArea: data.workArea,
      description: data.description,
      voiceTranscriptUsed: !!data.voiceTranscriptUsed,
      language,
      createdAt: nowIso,
      currentStatus: 'submitted',
      updatedAt: nowIso,
      timeline: [initialAudit]
    };

    setReports(prev => [newReport, ...prev]);

    showToast(
      language === 'ta'
        ? `பாதுகாப்பு புகார் #${reportRefId} வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.`
        : `Safety Report #${reportRefId} filed successfully. Proof of Action tracking initialized.`,
      'success'
    );

    return reportRefId;
  };

  // UPDATE REPORT STATUS (Proof of Action)
  const updateReportStatus = (
    reportId: string,
    newStatus: ReportStatus,
    actorName: string,
    actorRole: string,
    notes: string
  ) => {
    const nowIso = new Date().toISOString();

    setReports(prev =>
      prev.map(r => {
        if (r.id !== reportId) return r;

        const newAudit: AuditEvent = {
          id: `aud-${Date.now()}`,
          timestamp: nowIso,
          previousStatus: r.currentStatus,
          newStatus,
          actorName: actorName || 'Authorized Site Supervisor',
          actorRole: actorRole || 'Safety Operations',
          notes: notes || `Status advanced to ${newStatus}`
        };

        return {
          ...r,
          currentStatus: newStatus,
          updatedAt: nowIso,
          assignedAdmin: actorName,
          resolutionNotes: newStatus === 'resolved' ? notes : r.resolutionNotes,
          timeline: [...r.timeline, newAudit]
        };
      })
    );

    showToast(
      `Report #${reportId} status updated to [${newStatus.toUpperCase()}] by ${actorName}`,
      'success'
    );
  };

  // UPDATE FAIRNESS THRESHOLDS
  const updateThresholds = (partial: Partial<FairnessThresholds>) => {
    setThresholds(prev => ({ ...prev, ...partial }));
    showToast('Fairness Radar thresholds updated. Risk models recalculated.', 'info');
  };

  // RESET DEMO DATA
  const resetDemoData = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_workers`);
      localStorage.removeItem(`${STORAGE_KEY}_shifts`);
      localStorage.removeItem(`${STORAGE_KEY}_reports`);
      localStorage.removeItem(`${STORAGE_KEY}_thresholds`);
    } catch (e) {
      console.warn(e);
    }
    setWorkers(initialWorkers);
    setShifts(initialShifts);
    setReports(initialReports);
    setThresholds(defaultThresholds);
    setIndustryState('construction');
    setCurrentWorkerId('w-c1');
    showToast('Demo data reset to clean initial seed state.', 'success');
  };

  return (
    <FairShiftContext.Provider
      value={{
        portal,
        setPortal,
        industry,
        setIndustry,
        language,
        setLanguage,
        currentWorker,
        setCurrentWorkerId,
        workers,
        shifts,
        reports,
        thresholds,
        toast,
        showToast,
        clockIn,
        clockOut,
        toggleBreak,
        submitSafetyReport,
        updateReportStatus,
        updateThresholds,
        resetDemoData
      }}
    >
      {children}
    </FairShiftContext.Provider>
  );
};

export const useFairShift = () => {
  const context = useContext(FairShiftContext);
  if (!context) {
    throw new Error('useFairShift must be used within a FairShiftProvider');
  }
  return context;
};
