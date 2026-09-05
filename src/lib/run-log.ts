import { ClearanceRunRecord } from '../types';

const RUN_LOGS_KEY = 'clearflow_run_logs_v1';

const SEED_RUN_LOGS: ClearanceRunRecord[] = [
  {
    id: 'CLR-2026-0814',
    timestamp: 'Today, 14:12:05',
    studentId: 'ayesha-raza',
    studentName: 'Ayesha Raza',
    rollNumber: 'BSCS-21-014',
    department: 'Computer Science',
    outcome: 'Passed',
    totalDurationSeconds: 1.4,
    financeStatus: 'approved',
    libraryStatus: 'approved',
    academicStatus: 'approved',
    note: 'Parallel dispatch completed with 0 exceptions.'
  },
  {
    id: 'CLR-2026-0813',
    timestamp: 'Today, 13:48:20',
    studentId: 'bilal-ahmed',
    studentName: 'Bilal Ahmed',
    rollNumber: 'BSSE-20-087',
    department: 'Software Engineering',
    outcome: 'Action Required',
    totalDurationSeconds: 1.9,
    financeStatus: 'approved',
    libraryStatus: 'rejected',
    academicStatus: 'approved',
    note: 'Library agent blocked clearance: 2 overdue books.'
  },
  {
    id: 'CLR-2026-0812',
    timestamp: 'Today, 11:30:14',
    studentId: 'hina-sultana',
    studentName: 'Hina Sultana',
    rollNumber: 'BBA-21-142',
    department: 'Business Administration',
    outcome: 'Action Required',
    totalDurationSeconds: 1.6,
    financeStatus: 'rejected',
    libraryStatus: 'approved',
    academicStatus: 'approved',
    note: 'Bursar agent flagged $1,450 outstanding balance.'
  },
  {
    id: 'CLR-2026-0811',
    timestamp: 'Yesterday, 17:04:55',
    studentId: 'ayesha-raza',
    studentName: 'Ayesha Raza',
    rollNumber: 'BSCS-21-014',
    department: 'Computer Science',
    outcome: 'Passed',
    totalDurationSeconds: 1.3,
    financeStatus: 'approved',
    libraryStatus: 'approved',
    academicStatus: 'approved',
    note: 'Full digital certificate issued.'
  }
];

export function getRunLogs(): ClearanceRunRecord[] {
  try {
    const raw = localStorage.getItem(RUN_LOGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading clearance logs:', err);
  }
  return SEED_RUN_LOGS;
}

export function addRunLog(log: ClearanceRunRecord): ClearanceRunRecord[] {
  try {
    const current = getRunLogs();
    const updated = [log, ...current.slice(0, 49)]; // keep latest 50
    localStorage.setItem(RUN_LOGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error adding clearance log:', err);
    return [log];
  }
}

export function clearRunLogs(): void {
  try {
    localStorage.removeItem(RUN_LOGS_KEY);
  } catch (err) {
    console.error('Error clearing logs:', err);
  }
}
