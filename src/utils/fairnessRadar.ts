import { FairnessFinding, FairnessThresholds, SafetyReport, Shift, Worker } from '../types';

/**
 * Analyzes live application state and extracts explainable fairness and safety findings
 * based strictly on recorded shifts, workers, and safety reports.
 */
export function analyzeFairnessRadar(
  workers: Worker[],
  shifts: Shift[],
  reports: SafetyReport[],
  thresholds: FairnessThresholds,
  currentIndustry: 'construction' | 'facilities'
): FairnessFinding[] {
  const findings: FairnessFinding[] = [];

  // Filter records by the active industry
  const industryWorkers = workers.filter(w => w.industry === currentIndustry);
  const industryShifts = shifts.filter(s => s.industry === currentIndustry);
  const industryReports = reports.filter(r => r.industry === currentIndustry);

  // 1. RULE: Excessive Daily Working Hours Flag
  // Checks any shift exceeding the configurable threshold (e.g., > 9 hours)
  const excessiveShifts = industryShifts.filter(s => s.hoursWorked > thresholds.maxDailyHours);
  excessiveShifts.forEach(shift => {
    const worker = industryWorkers.find(w => w.id === shift.workerId) || { name: shift.workerName };
    findings.push({
      id: `fairness-excessive-${shift.id}`,
      type: 'excessive_hours',
      title: `Excessive Daily Shift Duration (${shift.hoursWorked} hrs)`,
      titleTa: `அதிகப்படியான தினசரி வேலை நேரம் (${shift.hoursWorked} மணி)`,
      severity: shift.hoursWorked >= thresholds.maxDailyHours + 2 ? 'high' : 'medium',
      workerId: shift.workerId,
      workerName: worker.name,
      workArea: shift.workArea,
      summary: `Worker ${worker.name} logged ${shift.hoursWorked}h on ${shift.date}, exceeding the ${thresholds.maxDailyHours}h daily threshold.`,
      evidence: `Shift #${shift.id}: Recorded ${shift.hoursWorked} hours (${shift.regularHours}h regular + ${shift.overtimeHours}h overtime) at ${shift.workArea}.`,
      whyItMatters: 'Extended continuous physical labor significantly increases cognitive fatigue, musculoskeletal strain, and on-site accident probability (UN SDG 8.8 safe work environments).',
      recommendedAction: 'Mandate minimum 11 hours rest window before next shift; review supervisor shift scheduling to reallocate workload.',
      supportedRecordIds: [shift.id]
    });
  });

  // 2. RULE: Overtime Distribution Disparity across comparable frontline workers
  // Compare overtime hours logged by workers in this industry
  const workerOtMap = new Map<string, { worker: Worker; totalOt: number; shiftIds: string[] }>();
  industryWorkers.forEach(w => {
    workerOtMap.set(w.id, { worker: w, totalOt: 0, shiftIds: [] });
  });

  industryShifts.forEach(s => {
    const entry = workerOtMap.get(s.workerId);
    if (entry) {
      entry.totalOt += s.overtimeHours;
      entry.shiftIds.push(s.id);
    }
  });

  const workerOtList = Array.from(workerOtMap.values()).sort((a, b) => b.totalOt - a.totalOt);
  if (workerOtList.length >= 2) {
    const highest = workerOtList[0];
    const lowest = workerOtList[workerOtList.length - 1];
    const otGap = highest.totalOt - lowest.totalOt;

    if (highest.totalOt > 0 && otGap >= thresholds.overtimeInequityThreshold) {
      findings.push({
        id: `fairness-ot-disparity-${currentIndustry}`,
        type: 'uneven_overtime',
        title: `Significant Overtime Disparity Detected (${otGap.toFixed(1)}h spread)`,
        titleTa: `கூடுதல் நேர ஒதுக்கீட்டில் குறிப்பிடத்தக்க வேறுபாடு (${otGap.toFixed(1)} மணி)`,
        severity: otGap >= 4 ? 'medium' : 'low',
        summary: `Overtime is disproportionately allocated: ${highest.worker.name} logged ${highest.totalOt.toFixed(1)}h OT while ${lowest.worker.name} logged ${lowest.totalOt.toFixed(1)}h OT.`,
        evidence: `Comparison of ${industryWorkers.length} workers: High = ${highest.worker.name} (${highest.totalOt.toFixed(1)}h OT), Low = ${lowest.worker.name} (${lowest.totalOt.toFixed(1)}h OT).`,
        whyItMatters: 'Unequal overtime allocation either concentrates fatigue risk onto specific individuals or creates perceived economic favoritism among frontline crews.',
        recommendedAction: 'Rotate premium overtime availability fairly across qualified team members in the same wage tier.',
        supportedRecordIds: [...highest.shiftIds, ...lowest.shiftIds]
      });
    }
  }

  // 3. RULE: Repeated Workplace Hazards in the Same Work Area
  // Group unresolved or recent reports by workArea
  const areaReportMap = new Map<string, SafetyReport[]>();
  industryReports.forEach(r => {
    const list = areaReportMap.get(r.workArea) || [];
    list.push(r);
    areaReportMap.set(r.workArea, list);
  });

  areaReportMap.forEach((repList, area) => {
    if (repList.length >= thresholds.repeatedHazardThreshold) {
      findings.push({
        id: `fairness-repeat-hazard-${area.replace(/\s+/g, '-').toLowerCase()}`,
        type: 'repeated_hazard',
        title: `Repeated Hazard Zone: ${area} (${repList.length} incidents)`,
        titleTa: `மீண்டும் மீண்டும் ஆபத்து பதிவாகும் பகுதி: ${area} (${repList.length} சம்பவங்கள்)`,
        severity: repList.some(r => r.severity === 'critical' || r.severity === 'high') ? 'high' : 'medium',
        workArea: area,
        summary: `Multiple safety concerns (${repList.length} reports) have been filed for "${area}".`,
        evidence: `Reports: ${repList.map(r => `${r.id} [${r.category} - ${r.currentStatus}]`).join(', ')}.`,
        whyItMatters: 'Recurring incident reports in identical physical zones indicate underlying structural or procedural vulnerabilities rather than isolated employee errors.',
        recommendedAction: 'Dispatch senior safety engineer to conduct comprehensive root-cause physical inspection of this area.',
        supportedRecordIds: repList.map(r => r.id)
      });
    }
  });

  // 4. RULE: Overdue Safety Reports SLA Violation (> configured threshold hours)
  const now = Date.now();
  industryReports.forEach(r => {
    if (r.currentStatus !== 'resolved') {
      const createdTime = new Date(r.createdAt).getTime();
      const ageHours = (now - createdTime) / (1000 * 60 * 60);

      if (ageHours > thresholds.overdueReportHours) {
        findings.push({
          id: `fairness-overdue-${r.id}`,
          type: 'overdue_report',
          title: `Overdue Safety Report SLA: #${r.id} (${Math.floor(ageHours)}h Unresolved)`,
          titleTa: `தாமதமான பாதுகாப்பு புகார் தீர்வு: #${r.id} (${Math.floor(ageHours)} மணி நேரமாக தீர்க்கப்படவில்லை)`,
          severity: r.severity === 'critical' || r.severity === 'high' ? 'high' : 'medium',
          workArea: r.workArea,
          summary: `Report #${r.id} ("${r.category}") has remained unresolved for ${Math.floor(ageHours)} hours (SLA limit: ${thresholds.overdueReportHours}h).`,
          evidence: `Created at ${new Date(r.createdAt).toLocaleString()} by ${r.isAnonymous ? 'Anonymous Worker' : r.workerName}. Current Status: ${r.currentStatus.toUpperCase()}.`,
          whyItMatters: 'Unresponsive management to frontline safety alerts discourages future reporting, eroding worker psychological safety and trust.',
          recommendedAction: `Escalate incident #${r.id} immediately to Lead Supervisor for prompt Proof of Action acknowledgement and resolution notes.`,
          supportedRecordIds: [r.id]
        });
      }
    }
  });

  // Sort findings by severity: high first, then medium, then low
  const severityRank = { high: 3, medium: 2, low: 1 };
  return findings.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
}
