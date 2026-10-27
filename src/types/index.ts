export type IndustryType = 'construction' | 'facilities';

export type Language =
  | 'en'
  // 22 Indian languages in the Eighth Schedule of Constitution of India
  | 'as' // Assamese
  | 'bn' // Bengali
  | 'brx' // Bodo
  | 'doi' // Dogri
  | 'gu' // Gujarati
  | 'hi' // Hindi
  | 'kn' // Kannada
  | 'ks' // Kashmiri
  | 'kok' // Konkani
  | 'mai' // Maithili
  | 'ml' // Malayalam
  | 'mni' // Manipuri (Meitei)
  | 'mr' // Marathi
  | 'ne' // Nepali
  | 'or' // Odia
  | 'pa' // Punjabi
  | 'sa' // Sanskrit
  | 'sat' // Santali
  | 'sd' // Sindhi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'ur' // Urdu
  // Additional International Languages
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'ar' // Arabic
  | 'id' // Indonesian
  | 'pt' // Portuguese
  | 'zh' // Chinese (Simplified)
  | 'ja'; // Japanese

export type Theme = 'light' | 'dark';

export type AttendanceStatus = 'clocked_in' | 'clocked_out' | 'on_break';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus = 'submitted' | 'acknowledged' | 'investigating' | 'resolved';

export interface AuditEvent {
  id: string;
  timestamp: string; // ISO string
  previousStatus: ReportStatus | null;
  newStatus: ReportStatus;
  actorName: string;
  actorRole: string;
  notes: string;
}

export interface SafetyReport {
  id: string; // e.g. "FS-4912"
  workerId: string;
  workerName: string;
  isAnonymous: boolean;
  industry: IndustryType;
  category: string;
  severity: ReportSeverity;
  workArea: string;
  description: string;
  voiceTranscriptUsed?: boolean;
  language: Language;
  createdAt: string; // ISO string
  currentStatus: ReportStatus;
  updatedAt: string; // ISO string
  assignedAdmin?: string;
  resolutionNotes?: string;
  timeline: AuditEvent[];
}

export interface Shift {
  id: string;
  workerId: string;
  workerName: string;
  industry: IndustryType;
  date: string; // YYYY-MM-DD
  clockIn: string; // ISO string
  clockOut: string | null; // ISO string or null if currently active
  breakMinutes: number;
  hoursWorked: number;
  regularHours: number;
  overtimeHours: number;
  workArea: string;
  hourlyRate: number;
  overtimeMultiplier: number;
  estimatedGrossPay: number;
}

export interface WorkerSkill {
  name: string;
  nameTa: string;
  level: string;
  levelTa: string;
  verifiedHours: number;
  badge: string;
}

export interface Worker {
  id: string;
  name: string;
  nameTa: string;
  role: string;
  roleTa: string;
  industry: IndustryType;
  workArea: string;
  phone: string;
  hourlyRate: number;
  currentStatus: AttendanceStatus;
  activeShiftId: string | null;
  skills: WorkerSkill[];
  totalLifetimeHours: number;
  safetyScore: number;
}

export interface FairnessFinding {
  id: string;
  type: 'excessive_hours' | 'uneven_overtime' | 'repeated_hazard' | 'overdue_report' | 'rest_break_deficit';
  title: string;
  titleTa: string;
  severity: 'high' | 'medium' | 'low';
  workArea?: string;
  workerId?: string;
  workerName?: string;
  summary: string;
  evidence: string;
  whyItMatters: string;
  recommendedAction: string;
  supportedRecordIds: string[];
}

export interface FairnessThresholds {
  maxDailyHours: number; // e.g., 9 hours
  overdueReportHours: number; // e.g., 24 hours
  overtimeInequityThreshold: number; // hours gap between workers in same industry
  repeatedHazardThreshold: number; // incidents in same area
}

export interface PayCalculation {
  standardHours: number;
  overtimeHours: number;
  hourlyRate: number;
  overtimeMultiplier: number;
  basePay: number;
  overtimePay: number;
  grossPay: number;
  statutoryDeductions: number; // demo standard PF / insurance
  netEstimatedPay: number;
}

export interface IndustryConfig {
  id: IndustryType;
  name: string;
  nameTa: string;
  tagline: string;
  taglineTa: string;
  workAreas: string[];
  safetyCategories: {
    id: string;
    labelEn: string;
    labelTa: string;
    typicalSeverity: ReportSeverity;
  }[];
  adminRoles: string[];
}

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  script: string;
  isRtl?: boolean;
  category: 'indian' | 'international' | 'default';
  voiceSupported: boolean;
}
