# FairShift — Worker-First Workforce Intelligence
### Prompt Wars 2026 × SRM ACM Student Chapter | UN SDG 8: Decent Work & Economic Growth

> **FairShift** is a worker-first workforce intelligence platform that brings transparency, accountability, and psychological safety to frontline employment. It empowers workers to verify their hours, understand estimated compensation, and safely report hazards with verifiable **Proof of Action**, while providing employers with an explainable **Fairness Radar** to eliminate excessive fatigue and systemic safety risks.

---

## 🌟 Signature Differentiators

### 1. 🛡️ Fairness Radar (Explainable Workforce Intelligence)
- **Zero-Hallucination Decision Support**: Instead of opaque black-box AI scores, the Fairness Radar runs transparent, deterministic rules over actual shift logs and incident records.
- **Configurable Risk Thresholds**:
  - Daily hours fatigue threshold (default: 9.0 hrs, adjustable via slider).
  - Overdue hazard SLA threshold (default: 24 hrs, adjustable via slider).
  - Overtime inequity spread detection across comparable workers.
  - Multi-incident concentration detection in identical physical zones.
- **Traceable Audit Evidence**: Each finding links directly to the underlying record IDs and provides explicit, actionable mitigation guidance.

### 2. 🎙️ SpeakUp Shield (Frontline Voice/Text Reporting)
- **Accessible Hazard Input**: Voice-to-text dictation via the browser Web Speech API, paired with an immediate manual text fallback.
- **Selective Anonymity Toggle**: Redacts worker identity from ordinary supervisor queues to protect against retaliation (UN SDG 8.8).
- **Review-Before-Submit Step**: Prevents accidental submissions and generates an immutable tracking reference (e.g. `#FS-8492`).
- **Honest Privacy Explanations**: Transparently discloses client-side demo storage boundaries.

### 3. ⏱️ Proof of Action (Accountable Incident Lifecycle)
- **Accountable Lifecycle**: Enforces `Submitted` → `Acknowledged` → `Under Investigation` → `Resolved`.
- **Chronological Audit Trail**: Every status transition permanently seals the timestamp, the acting supervisor's name, and mitigation notes.
- **Shared Data Core**: Real-time bi-directional synchronization between the frontline worker portal and the employer command center via shared state.

---

## 🏗️ Two Industry Configurations in One Reusable Platform

1. **Metro Infrastructure & Construction**:
   - High-risk civil and structural operations.
   - Work areas: *Sector 4 Scaffolding, Electrical Sub-station B, Tower B Foundation, Heavy Material Depot*.
   - Specialized hazard categories: *Unsafe Scaffolding / Fall Hazard, Exposed High-Voltage Wiring, Missing PPE, Hydraulic Leaks*.
2. **University Campus Facilities & Support**:
   - Multi-shift sanitization, dining, and MEP operations.
   - Work areas: *Hostel Dining Hall, Science Lab Chemistry Wing, Central Library HVAC Sub-level, Grounds & Waste Depot*.
   - Specialized hazard categories: *Chemical Fumes / Solvent Spills, Wet / Slippery Flooring, Faulty Ventilation*.

---

## 🌐 Localization & Accessibility

- **Bilingual Interface**: Seamless toggle between **English** and **தமிழ் (Tamil)** covering all primary worker workflows, buttons, statuses, and explanations.
- **Inclusive Design**: Touch targets exceeding 48px, WCAG AA high-contrast status badges, clear tabular layouts, and reduced cognitive load for frontline workers.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v10+

### Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Run Unit Tests
```bash
npm test
```
Executes test assertions validating deterministic pay calculations, overtime multipliers, and duration formatting.

### Build Production Bundle
```bash
npm run build
```

---

## 🎯 Recommended 10-Step Judge Evaluation Walkthrough

Follow this interactive sequence to evaluate the platform in under 3 minutes:

1. **Open Worker Portal**: Note the personalized greeting (`Murugan Thangaraj`), assigned work area, and simulated GPS badge.
2. **Clock In**: Click **Clock In Now** on the hero card. Observe the real-time second-by-second shift timer initiate.
3. **Inspect Transparent Pay**: Switch to the **Transparent Pay** tab. Verify the decomposition of regular hours, overtime, base pay, and net estimates. Click any of the 3 **Verified Test Cases** to validate mathematical precision.
4. **Submit a Safety Hazard (SpeakUp Shield)**:
   - Navigate to the **SpeakUp Shield** tab.
   - Select a hazard category (e.g. *Exposed High-Voltage Cable*).
   - Enter a description using the keyboard or click **Hold to speak (Voice-to-Text)**.
   - Leave **Anonymous Mode: ON**.
   - Click **Review & Submit Report**, inspect the summary modal, and click **Confirm & Transmit**.
   - Note the generated reference code (e.g., `#FS-XXXX`).
5. **Switch to Employer Command Center**: Click the **Command Center** button in the top navigation bar.
6. **Verify New Report in Incident Queue**:
   - Go to the **Safety Command Center** tab.
   - Locate the newly submitted report at the top of the queue.
   - Notice that the worker's name is redacted as *"Anonymous Worker"* while preserving critical severity and location details.
7. **Advance Report Lifecycle (Proof of Action)**:
   - Click **Acknowledge Incident**. Select supervisor name and click **Save Status**.
   - Notice the status immediately advances and logs a new event in the chronological audit history.
8. **Demonstrate Fairness Radar**:
   - Click the **Fairness Radar** tab.
   - Observe explainable risk findings (e.g. *Excessive Shift Duration > 9h*, *Overtime Disparity Spread*, *Repeated Hazard Zone*).
   - Adjust the **Max Daily Hours Threshold slider** from 9h down to 8h and watch the Radar recalculate risks instantly.
   - Click any finding to inspect its exact triggering record IDs and recommended supervisor intervention.
9. **Switch Industry Context**:
   - In the top navigation bar, change the Industry dropdown from **Construction** to **Campus Facilities**.
   - Watch the platform dynamically re-scope work areas, hazard categories, worker personas, and operational KPIs.
10. **Verify Bi-Directional Proof of Action**:
   - Switch back to the **Worker Portal** and open the **Proof of Action** tab.
   - Verify that the supervisor's acknowledgement and timestamp are reflected live in the worker's personal timeline.

---

## ⚖️ UN SDG 8 Alignment Checklist

- [x] **Target 8.5 (Full & Productive Employment)**: Portable skills passport preserving lifetime verified hours and specialized certifications across contractors.
- [x] **Target 8.8 (Safe & Secure Working Environments)**: SpeakUp Shield non-reprisal hazard reporting, SLA overdue alerts, and repeat hazard cluster detection.
- [x] **Transparent Compensation**: Deterministic wage decomposition eliminating casual worker underpayment and overtime disputes.
