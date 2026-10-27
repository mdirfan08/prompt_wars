import { IndustryConfig, Worker, Shift, SafetyReport } from '../types';

export const industryConfigs: Record<'construction' | 'facilities', IndustryConfig> = {
  construction: {
    id: 'construction',
    name: 'Metro Infrastructure & Construction',
    nameTa: 'மெட்ரோ உள்கட்டமைப்பு & கட்டுமான தளம்',
    tagline: 'High-risk civil and structural engineering operations',
    taglineTa: 'அதி-ஆபத்து சிவில் மற்றும் கட்டமைப்பு பொறியியல் செயல்பாடுகள்',
    workAreas: [
      'Sector 4 Scaffolding',
      'Electrical Sub-station B',
      'Tower B Foundation',
      'Heavy Equipment Depot',
      'Material Staging & Hoist Zone'
    ],
    safetyCategories: [
      { id: 'scaffold_fall', labelEn: 'Unsafe Scaffolding / Fall Hazard', labelTa: 'பாதுகாப்பற்ற சாரம் / கீழே விழும் ஆபத்து', typicalSeverity: 'high' },
      { id: 'ppe_missing', labelEn: 'Missing Mandatory PPE / Hardhats', labelTa: 'கட்டாய தலைக்கவசம் / பாதுகாப்பு கியர் இல்லை', typicalSeverity: 'medium' },
      { id: 'electrical_exposed', labelEn: 'Exposed High-Voltage Cable / Panel', labelTa: 'திறந்த நிலையில் உள்ள உயர் அழுத்த மின்கம்பி', typicalSeverity: 'critical' },
      { id: 'blocked_egress', labelEn: 'Blocked Emergency Exit / Debris', labelTa: 'அவசர வழி அடைப்பு / கட்டுமான குப்பைகள்', typicalSeverity: 'medium' },
      { id: 'equipment_defect', labelEn: 'Heavy Machinery Hydraulic Leak', labelTa: 'கனரக இயந்திர ஹைட்ராலிக் கசிவு', typicalSeverity: 'high' },
    ],
    adminRoles: ['Rajesh Kumar (Site Safety Director)', 'S. Raman (Structural Engineer)']
  },
  facilities: {
    id: 'facilities',
    name: 'University Campus Facilities & Support',
    nameTa: 'பல்கலைக்கழக வளாக பராமரிப்பு & ஆதரவு',
    tagline: 'Multi-shift campus sanitization, dining, and MEP operations',
    taglineTa: 'பல்கலைக்கழக சுகாதாரம், உணவுக்கூடம் மற்றும் பராமரிப்பு பணிகள்',
    workAreas: [
      'Hostel Dining Hall & Kitchen',
      'Science Lab Chemistry Wing',
      'Central Library HVAC Sub-level',
      'Engineering Block Sanitization',
      'Grounds & Waste Disposal Depot'
    ],
    safetyCategories: [
      { id: 'wet_floor', labelEn: 'Slippery / Wet Flooring Without Signage', labelTa: 'வழுக்கும் ஈரமான தரை (எச்சரிக்கை பலகை இன்றி)', typicalSeverity: 'medium' },
      { id: 'chemical_fumes', labelEn: 'Chemical Solvent / Cleaning Fume Leak', labelTa: 'இரசாயன கரைப்பான் / துப்புரவு வாயு கசிவு', typicalSeverity: 'high' },
      { id: 'ventilation_fault', labelEn: 'Faulty Exhaust Ventilation in Kitchen', labelTa: 'சமையலறை காற்று வெளியேற்றும் மின்விசிறி கோளாறு', typicalSeverity: 'medium' },
      { id: 'defective_buffer', labelEn: 'Frayed Power Cord on Floor Scrubber', labelTa: 'தரை துப்புரவு இயந்திரத்தில் சேதமடைந்த மின்வயர்', typicalSeverity: 'high' },
      { id: 'pathway_lighting', labelEn: 'Inadequate Night Pathway Lighting', labelTa: 'இரவு நேர நடைபாதை போதிய வெளிச்சமின்மை', typicalSeverity: 'low' },
    ],
    adminRoles: ['Dr. Lakshmi Narayanan (Head of Facilities)', 'K. Velmurugan (Campus Operations Lead)']
  }
};

export const initialWorkers: Worker[] = [
  // Construction Workers
  {
    id: 'w-c1',
    name: 'Murugan Thangaraj',
    nameTa: 'முருகன் தங்கராஜ்',
    role: 'Lead Scaffolding Rigger',
    roleTa: 'முன்னணி சாரக் கட்டுமான கலைஞர்',
    industry: 'construction',
    workArea: 'Sector 4 Scaffolding',
    phone: '+91 98401 23411',
    hourlyRate: 150,
    currentStatus: 'clocked_in',
    activeShiftId: 'shift-live-c1',
    totalLifetimeHours: 1420,
    safetyScore: 98,
    skills: [
      { name: 'Scaffold Erection L3', nameTa: 'சாரக் கட்டுமானம் நிலை 3', level: 'Master', levelTa: 'நிபுணர்', verifiedHours: 840, badge: 'Safety Lead' },
      { name: 'Fall Arrest Rigging', nameTa: 'விழும் தடுப்பு கயிறு கட்டுதல்', level: 'Certified', levelTa: 'சான்றிதழ் பெற்றது', verifiedHours: 580, badge: 'Zero Incident' }
    ]
  },
  {
    id: 'w-c2',
    name: 'Karthik Subramanian',
    nameTa: 'கார்த்திக் சுப்ரமணியன்',
    role: 'Certified Site Electrician',
    roleTa: 'சான்றளிக்கப்பட்ட தள எலக்ட்ரீஷியன்',
    industry: 'construction',
    workArea: 'Electrical Sub-station B',
    phone: '+91 98402 34522',
    hourlyRate: 175,
    currentStatus: 'clocked_out',
    activeShiftId: null,
    totalLifetimeHours: 1980,
    safetyScore: 96,
    skills: [
      { name: '415V Switchgear Ops', nameTa: '415V சுவிட்ச்கியர் செயல்பாடு', level: 'Master', levelTa: 'நிபுணர்', verifiedHours: 1120, badge: 'High Voltage' },
      { name: 'Grounding & Lockout', nameTa: 'பூட்டுதல் மற்றும் தரை இணைப்பு', level: 'Certified', levelTa: 'சான்றிதழ் பெற்றது', verifiedHours: 860, badge: 'ISO Compliance' }
    ]
  },
  {
    id: 'w-c3',
    name: 'Dinesh Selvam',
    nameTa: 'தினேஷ் செல்வம்',
    role: 'Heavy Concrete Finisher',
    roleTa: 'கான்கிரீட் கட்டுமான தொழிலாளி',
    industry: 'construction',
    workArea: 'Tower B Foundation',
    phone: '+91 98403 45633',
    hourlyRate: 130,
    currentStatus: 'clocked_out',
    activeShiftId: null,
    totalLifetimeHours: 890,
    safetyScore: 94,
    skills: [
      { name: 'Precast Placement', nameTa: 'ப்ரீகாஸ்ட் பொருத்துதல்', level: 'Proficient', levelTa: 'திறமையானவர்', verifiedHours: 520, badge: 'Skill Verified' },
      { name: 'Vibrator Screed Ops', nameTa: 'கான்கிரீட் அதிர்வு இயக்கம்', level: 'Experienced', levelTa: 'அனுபவம் வாய்ந்தவர்', verifiedHours: 370, badge: 'Attendance Star' }
    ]
  },
  {
    id: 'w-c4',
    name: 'Ravi Palanichamy',
    nameTa: 'ரவி பழனிச்சாமி',
    role: 'Tower Crane Signalman',
    roleTa: 'கிரேன் சிக்னல் வழிகாட்டி',
    industry: 'construction',
    workArea: 'Material Staging & Hoist Zone',
    phone: '+91 98404 56744',
    hourlyRate: 140,
    currentStatus: 'clocked_out',
    activeShiftId: null,
    totalLifetimeHours: 1100,
    safetyScore: 99,
    skills: [
      { name: 'Rigging Hand Signals', nameTa: 'சமிக்ஞை கைகாட்டுதல்', level: 'Certified', levelTa: 'சான்றிதழ் பெற்றது', verifiedHours: 720, badge: 'Zero Incident' }
    ]
  },

  // Campus Facilities Workers
  {
    id: 'w-f1',
    name: 'Priya Sundaram',
    nameTa: 'பிரியா சுந்தரம்',
    role: 'Sanitation & Disinfection Lead',
    roleTa: 'சுகாதாரம் மற்றும் கிருமிநாசினி தலைவர்',
    industry: 'facilities',
    workArea: 'Science Lab Chemistry Wing',
    phone: '+91 98405 67855',
    hourlyRate: 125,
    currentStatus: 'clocked_in',
    activeShiftId: 'shift-live-f1',
    totalLifetimeHours: 1650,
    safetyScore: 100,
    skills: [
      { name: 'Bio-Hazard Sanitization', nameTa: 'உயிரியல்-ஆபத்து தூய்மைப்படுத்தல்', level: 'Master', levelTa: 'நிபுணர்', verifiedHours: 980, badge: 'Clean Certified' },
      { name: 'Chemical Spill Control', nameTa: 'இரசாயன கசிவு கட்டுப்பாடு', level: 'Certified', levelTa: 'சான்றிதழ் பெற்றது', verifiedHours: 670, badge: 'Fast Responder' }
    ]
  },
  {
    id: 'w-f2',
    name: 'Ananya Ramesh',
    nameTa: 'அனன்யா ரமேஷ்',
    role: 'Dining Facilities Steward',
    roleTa: 'உணவுக்கூட வசதிகள் மேற்பார்வையாளர்',
    industry: 'facilities',
    workArea: 'Hostel Dining Hall & Kitchen',
    phone: '+91 98406 78966',
    hourlyRate: 115,
    currentStatus: 'clocked_out',
    activeShiftId: null,
    totalLifetimeHours: 1240,
    safetyScore: 97,
    skills: [
      { name: 'Commercial Kitchen HACCP', nameTa: 'சமையலறை சுகாதார மேலாண்மை', level: 'Certified', levelTa: 'சான்றிதழ் பெற்றது', verifiedHours: 790, badge: 'Hygiene Star' },
      { name: 'Industrial Dishwasher Ops', nameTa: 'தொழில்துறை பாத்திரம் கழுவும் இயக்கம்', level: 'Proficient', levelTa: 'திறமையானவர்', verifiedHours: 450, badge: 'Safety Badge' }
    ]
  },
  {
    id: 'w-f3',
    name: 'Venkatesh Babu',
    nameTa: 'வெங்கடேஷ் பாபு',
    role: 'Campus HVAC & MEP Technician',
    roleTa: 'வளாக ஏசி & பைப்லைன் தொழில்நுட்ப வல்லுநர்',
    industry: 'facilities',
    workArea: 'Central Library HVAC Sub-level',
    phone: '+91 98407 89077',
    hourlyRate: 155,
    currentStatus: 'clocked_out',
    activeShiftId: null,
    totalLifetimeHours: 2100,
    safetyScore: 95,
    skills: [
      { name: 'Chiller Plant Overhaul', nameTa: 'குளிரூட்டும் ஆலை பராமரிப்பு', level: 'Master', levelTa: 'நிபுணர்', verifiedHours: 1400, badge: 'Master Tech' }
    ]
  }
];

// Helper to generate ISO strings relative to now
const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number, hour: number = 8) => {
  const dt = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
  dt.setHours(hour, 0, 0, 0);
  return dt.toISOString();
};
const todayStr = now.toISOString().split('T')[0];
const yesterdayStr = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const twoDaysAgoStr = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString().split('T')[0];

export const initialShifts: Shift[] = [
  // Murugan active shift today (started 3.2 hours ago)
  {
    id: 'shift-live-c1',
    workerId: 'w-c1',
    workerName: 'Murugan Thangaraj',
    industry: 'construction',
    date: todayStr,
    clockIn: hoursAgo(3.4),
    clockOut: null,
    breakMinutes: 15,
    hoursWorked: 3.15,
    regularHours: 3.15,
    overtimeHours: 0,
    workArea: 'Sector 4 Scaffolding',
    hourlyRate: 150,
    overtimeMultiplier: 1.5,
    estimatedGrossPay: 472.5
  },
  // Murugan shift yesterday (10.5 hours worked -> Overtime Alert!)
  {
    id: 'shift-c1-yesterday',
    workerId: 'w-c1',
    workerName: 'Murugan Thangaraj',
    industry: 'construction',
    date: yesterdayStr,
    clockIn: daysAgo(1, 7),
    clockOut: daysAgo(1, 18),
    breakMinutes: 30,
    hoursWorked: 10.5,
    regularHours: 8.0,
    overtimeHours: 2.5,
    workArea: 'Sector 4 Scaffolding',
    hourlyRate: 150,
    overtimeMultiplier: 1.5,
    estimatedGrossPay: 150 * 8 + 150 * 1.5 * 2.5 // 1200 + 562.5 = 1762.5
  },
  // Karthik shift yesterday (8.0 hours worked, standard)
  {
    id: 'shift-c2-yesterday',
    workerId: 'w-c2',
    workerName: 'Karthik Subramanian',
    industry: 'construction',
    date: yesterdayStr,
    clockIn: daysAgo(1, 8),
    clockOut: daysAgo(1, 16.5),
    breakMinutes: 30,
    hoursWorked: 8.0,
    regularHours: 8.0,
    overtimeHours: 0,
    workArea: 'Electrical Sub-station B',
    hourlyRate: 175,
    overtimeMultiplier: 1.5,
    estimatedGrossPay: 1400
  },
  // Dinesh shift yesterday (11.0 hours worked -> Overtime Alert!)
  {
    id: 'shift-c3-yesterday',
    workerId: 'w-c3',
    workerName: 'Dinesh Selvam',
    industry: 'construction',
    date: yesterdayStr,
    clockIn: daysAgo(1, 6),
    clockOut: daysAgo(1, 17.5),
    breakMinutes: 30,
    hoursWorked: 11.0,
    regularHours: 8.0,
    overtimeHours: 3.0,
    workArea: 'Tower B Foundation',
    hourlyRate: 130,
    overtimeMultiplier: 1.5,
    estimatedGrossPay: 130 * 8 + 130 * 1.5 * 3.0 // 1040 + 585 = 1625
  },

  // Priya active shift today (started 2.8 hours ago)
  {
    id: 'shift-live-f1',
    workerId: 'w-f1',
    workerName: 'Priya Sundaram',
    industry: 'facilities',
    date: todayStr,
    clockIn: hoursAgo(2.8),
    clockOut: null,
    breakMinutes: 10,
    hoursWorked: 2.63,
    regularHours: 2.63,
    overtimeHours: 0,
    workArea: 'Science Lab Chemistry Wing',
    hourlyRate: 125,
    overtimeMultiplier: 1.5,
    estimatedGrossPay: 328.75
  },
  // Priya shift yesterday (9.8 hours worked -> Overtime Alert in Facilities!)
  {
    id: 'shift-f1-yesterday',
    workerId: 'w-f1',
    workerName: 'Priya Sundaram',
    industry: 'facilities',
    date: yesterdayStr,
    clockIn: daysAgo(1, 7),
    clockOut: daysAgo(1, 17.3),
    breakMinutes: 30,
    hoursWorked: 9.8,
    regularHours: 8.0,
    overtimeHours: 1.8,
    workArea: 'Science Lab Chemistry Wing',
    hourlyRate: 125,
    overtimeMultiplier: 1.5,
    estimatedGrossPay: 125 * 8 + 125 * 1.5 * 1.8 // 1000 + 337.5 = 1337.5
  },
  // Ananya shift yesterday (7.5 hours worked)
  {
    id: 'shift-f2-yesterday',
    workerId: 'w-f2',
    workerName: 'Ananya Ramesh',
    industry: 'facilities',
    date: yesterdayStr,
    clockIn: daysAgo(1, 8),
    clockOut: daysAgo(1, 16),
    breakMinutes: 30,
    hoursWorked: 7.5,
    regularHours: 7.5,
    overtimeHours: 0,
    workArea: 'Hostel Dining Hall & Kitchen',
    hourlyRate: 115,
    overtimeMultiplier: 1.5,
    estimatedGrossPay: 862.5
  }
];

export const initialReports: SafetyReport[] = [
  // Construction Report 1: Overdue incident (> 32 hours old, high severity, in Sector 4 Scaffolding)
  {
    id: 'FS-8021',
    workerId: 'w-c1',
    workerName: 'Murugan Thangaraj',
    isAnonymous: true,
    industry: 'construction',
    category: 'Unsafe Scaffolding / Fall Hazard',
    severity: 'high',
    workArea: 'Sector 4 Scaffolding',
    description: 'Loose base plates and missing toe-boards on the outer cantilever scaffold at 14m elevation. Heavy wind vibration observed.',
    voiceTranscriptUsed: true,
    language: 'en',
    createdAt: hoursAgo(34),
    currentStatus: 'submitted',
    updatedAt: hoursAgo(34),
    timeline: [
      {
        id: 'aud-8021-1',
        timestamp: hoursAgo(34),
        previousStatus: null,
        newStatus: 'submitted',
        actorName: 'Anonymous Worker (via SpeakUp Shield)',
        actorRole: 'Frontline Worker',
        notes: 'Initial hazard report logged with audio transcription.'
      }
    ]
  },
  // Construction Report 2: Second incident in Sector 4 Scaffolding (Repeated Hazard trigger!)
  {
    id: 'FS-8022',
    workerId: 'w-c2',
    workerName: 'Karthik Subramanian',
    isAnonymous: false,
    industry: 'construction',
    category: 'Exposed High-Voltage Cable / Panel',
    severity: 'critical',
    workArea: 'Sector 4 Scaffolding',
    description: 'Temporary 415V distribution conduit pinched under scaffold ledger bar with damaged outer insulation.',
    voiceTranscriptUsed: false,
    language: 'en',
    createdAt: hoursAgo(18),
    currentStatus: 'acknowledged',
    updatedAt: hoursAgo(12),
    assignedAdmin: 'Rajesh Kumar (Site Safety Director)',
    timeline: [
      {
        id: 'aud-8022-1',
        timestamp: hoursAgo(18),
        previousStatus: null,
        newStatus: 'submitted',
        actorName: 'Karthik Subramanian',
        actorRole: 'Certified Site Electrician',
        notes: 'Reported directly during morning pre-shift inspection.'
      },
      {
        id: 'aud-8022-2',
        timestamp: hoursAgo(12),
        previousStatus: 'submitted',
        newStatus: 'acknowledged',
        actorName: 'Rajesh Kumar',
        actorRole: 'Site Safety Director',
        notes: 'Acknowledged. Safety lock-out protocol initiated for distribution zone.'
      }
    ]
  },
  // Construction Report 3: Resolved report in Foundation
  {
    id: 'FS-8015',
    workerId: 'w-c3',
    workerName: 'Dinesh Selvam',
    isAnonymous: false,
    industry: 'construction',
    category: 'Heavy Machinery Hydraulic Leak',
    severity: 'medium',
    workArea: 'Tower B Foundation',
    description: 'Minor hydraulic oil seepage on excavator arm arm-pivot near water pump channel.',
    voiceTranscriptUsed: false,
    language: 'en',
    createdAt: hoursAgo(52),
    currentStatus: 'resolved',
    updatedAt: hoursAgo(30),
    assignedAdmin: 'S. Raman (Structural Engineer)',
    resolutionNotes: 'Seal O-ring replaced by on-site maintenance contractor. Pressure test verified.',
    timeline: [
      {
        id: 'aud-8015-1',
        timestamp: hoursAgo(52),
        previousStatus: null,
        newStatus: 'submitted',
        actorName: 'Dinesh Selvam',
        actorRole: 'Concrete Finisher',
        notes: 'Noticed fluid puddle during excavation shift.'
      },
      {
        id: 'aud-8015-2',
        timestamp: hoursAgo(46),
        previousStatus: 'submitted',
        newStatus: 'investigating',
        actorName: 'S. Raman',
        actorRole: 'Structural Engineer',
        notes: 'Dispatched mechanical team for hydraulic line inspection.'
      },
      {
        id: 'aud-8015-3',
        timestamp: hoursAgo(30),
        previousStatus: 'investigating',
        newStatus: 'resolved',
        actorName: 'S. Raman',
        actorRole: 'Structural Engineer',
        notes: 'Seal replaced and tested. Machinery cleared for operations.'
      }
    ]
  },

  // Facilities Report 1: Overdue incident in Science Lab
  {
    id: 'FS-9104',
    workerId: 'w-f1',
    workerName: 'Priya Sundaram',
    isAnonymous: true,
    industry: 'facilities',
    category: 'Chemical Solvent / Cleaning Fume Leak',
    severity: 'high',
    workArea: 'Science Lab Chemistry Wing',
    description: 'Pungent vapor buildup inside organic solvent storage cupboard; extraction blower failing to maintain negative pressure.',
    voiceTranscriptUsed: true,
    language: 'en',
    createdAt: hoursAgo(30),
    currentStatus: 'submitted',
    updatedAt: hoursAgo(30),
    timeline: [
      {
        id: 'aud-9104-1',
        timestamp: hoursAgo(30),
        previousStatus: null,
        newStatus: 'submitted',
        actorName: 'Anonymous Worker',
        actorRole: 'Sanitation Lead',
        notes: 'Submitted via SpeakUp voice shield.'
      }
    ]
  },
  // Facilities Report 2: Repeated incident in Science Lab
  {
    id: 'FS-9105',
    workerId: 'w-f1',
    workerName: 'Priya Sundaram',
    isAnonymous: false,
    industry: 'facilities',
    category: 'Slippery / Wet Flooring Without Signage',
    severity: 'medium',
    workArea: 'Science Lab Chemistry Wing',
    description: 'Condensation runoff from lab refrigerator creating slick puddle near fire exit door.',
    voiceTranscriptUsed: false,
    language: 'en',
    createdAt: hoursAgo(10),
    currentStatus: 'acknowledged',
    updatedAt: hoursAgo(8),
    assignedAdmin: 'Dr. Lakshmi Narayanan (Head of Facilities)',
    timeline: [
      {
        id: 'aud-9105-1',
        timestamp: hoursAgo(10),
        previousStatus: null,
        newStatus: 'submitted',
        actorName: 'Priya Sundaram',
        actorRole: 'Sanitation Lead',
        notes: 'Reported during mid-morning floor inspection.'
      },
      {
        id: 'aud-9105-2',
        timestamp: hoursAgo(8),
        previousStatus: 'submitted',
        newStatus: 'acknowledged',
        actorName: 'Dr. Lakshmi Narayanan',
        actorRole: 'Head of Facilities',
        notes: 'Caution signage placed; refrigeration tech dispatched.'
      }
    ]
  }
];
